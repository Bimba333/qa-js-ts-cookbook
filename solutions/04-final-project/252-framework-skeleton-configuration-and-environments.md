# Решения: Каркас, configuration и environments

## 1. Классификация значений конфигурации

### Ответ

| Запись | Категория | Владелец | Runtime validation | Допустимость в сообщениях |
| --- | --- | --- | --- | --- |
| `process.env.QA_UI_BASE_URL` | Необработанный ввод | Источник environment | Да | Только имя ключа |
| `config.uiBaseUrl` | Проверенная конфигурация | Слой конфигурации | Уже выполнена | Только после безопасной обработки |
| `local` | Профиль | Слой конфигурации | Да | Да |
| `secret://ci/qa-credentials` | Ссылка на секрет | Слой конфигурации | Да | Лучше без полного значения |
| Фактический пароль | Значение секрета | Поставщик секретов | Да, после получения | Нет |
| `GITHUB_RUN_ID` | Несекретные метаданные CI | Источник среды CI | При использовании | Да |
| `QA_OPERATION_TIMEOUT_MS="5000"` | Необработанный ввод | Источник environment | Да | Только имя ключа |
| `config.operationTimeoutMs` | Проверенная конфигурация | Слой конфигурации | Уже выполнена | Да |

### Объяснение

`process.env` содержит строки и отсутствие значений, поэтому это ещё не модель конфигурации. Строка `"5000"` становится числом только после разбора и проверки диапазона. Ссылка на секрет указывает, где получить значение, но не является самим значением секрета.

### Типичная ошибка

Считать любую переменную окружения готовой конфигурацией или хранить пароль прямо в `.env.example`.

### Связь с Automation QA

Такое разделение позволяет fixtures и helpers получать проверенную модель, не разносить чтение environment по всему framework и не раскрывать учётные данные в отчётах.

## 2. Аудит границы необработанного ввода

### Ответ

Исправленное направление зависимостей:

```text
process.env
→ граница необработанного ввода
→ проверка во время выполнения
→ Composition Root
→ минимальный контекст
```

| Нарушение | Риск | Новый владелец | Проверка |
| --- | --- | --- | --- |
| Профиль читается в fixture | Неизвестный `production` скрывает ошибку | Слой конфигурации | Неподдерживаемый профиль завершает startup ошибкой |
| URL читается в REST-клиенте | Клиент получает непроверенную строку | Слой конфигурации | В исполняемом коде клиента нет `process.env` |
| Timeout преобразуется в Composition Root | `NaN` или неверный диапазон | Проверяющая функция | Негативные тесты проверяют ключ и причину |
| Ссылка на секрет печатается в тесте | Утечка служебных данных | Граница секретов | Тесты и журналы не содержат значение ссылки |

### Объяснение

Источник environment отвечает только за получение необработанного ввода. Проверяющая функция строит полную неизменяемую модель. Composition Root получает уже проверенную конфигурацию и создаёт минимальный контекст.

### Типичная ошибка

Заменить несколько чтений `process.env` одним глобальным helper, который всё равно доступен из любого слоя. Граница остаётся размытой.

### Связь с Automation QA

Единая точка загрузки делает локальный и CI-запуск предсказуемыми: Page Objects, API clients и fixtures позже будут зависеть от конфигурации, а не от окружения процесса.

## 3. Исправление проверки во время выполнения

### Ответ

```ts
type Profile = "local" | "ci";

type Config = Readonly<{
  profile: Profile;
  timeoutMs: number;
}>;

class ConfigError extends Error {
  constructor(readonly key: string, reason: string) {
    super(`Некорректная configuration: ${key}: ${reason}`);
    this.name = "ConfigError";
  }
}

function parseProfile(value: string | undefined): Profile {
  if (value === undefined) {
    throw new ConfigError("QA_PROFILE", "значение обязательно");
  }

  if (value === "local" || value === "ci") {
    return value;
  }

  throw new ConfigError("QA_PROFILE", "разрешены local и ci");
}

function parseTimeout(value: string | undefined): number {
  if (value === undefined) {
    throw new ConfigError("QA_TIMEOUT_MS", "значение обязательно");
  }

  const timeoutMs = Number(value);

  if (
    !/^\d+$/.test(value)
    || !Number.isSafeInteger(timeoutMs)
    || timeoutMs < 100
    || timeoutMs > 120000
  ) {
    throw new ConfigError(
      "QA_TIMEOUT_MS",
      "ожидается целое число от 100 до 120000",
    );
  }

  return timeoutMs;
}

function loadConfig(source: Record<string, string | undefined>): Config {
  const config: Config = {
    profile: parseProfile(source.QA_PROFILE),
    timeoutMs: parseTimeout(source.QA_OPERATION_TIMEOUT_MS),
  };

  return Object.freeze(config);
}
```

Целенаправленные тесты должны отдельно проверять корректную конфигурацию, отсутствие `QA_PROFILE`, неподдерживаемый профиль и неправильный timeout.

### Объяснение

Каждое поле проходит разбор до построения. Если хотя бы одно поле неверно, функция выбрасывает безопасную ошибку и не возвращает частичную конфигурацию.

### Типичная ошибка

Использовать `as Profile`: утверждение типа заставляет компилятор доверять коду, но не проверяет строку во время выполнения.

### Связь с Automation QA

Framework завершается до старта тестов с понятным именем ключа, а не падает позднее внутри fixture или request helper.

## 4. Частичное построение и очистка

### Ответ

```ts
type Cleanup = () => void | Promise<void>;

class ResourceScope {
  readonly #cleanups: Cleanup[] = [];
  #closed = false;

  register(cleanup: Cleanup): void {
    if (this.#closed) {
      throw new Error("Нельзя зарегистрировать cleanup после закрытия ResourceScope");
    }

    this.#cleanups.push(cleanup);
  }

  async close(...primary: [] | [primaryError: unknown]): Promise<void> {
    if (this.#closed) {
      throw new Error("ResourceScope уже закрыт");
    }

    this.#closed = true;
    const hasPrimaryError = primary.length === 1;
    const primaryError = primary[0];
    const cleanupErrors: unknown[] = [];

    for (const cleanup of this.#cleanups.splice(0).reverse()) {
      try {
        await cleanup();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }

    if (hasPrimaryError && cleanupErrors.length === 0) {
      throw primaryError;
    }

    if (hasPrimaryError || cleanupErrors.length > 0) {
      throw new AggregateError(
        hasPrimaryError
          ? [primaryError, ...cleanupErrors]
          : cleanupErrors,
        "Выполнение или очистка ресурсов завершились ошибкой",
      );
    }
  }
}

async function createRuntime() {
  const scope = new ResourceScope();

  try {
    const first = await acquireFirst();
    scope.register(() => first.close());

    const second = await acquireSecond();
    scope.register(() => second.close());

    return { first, second, scope };
  } catch (error) {
    await scope.close(error);
    throw error;
  }
}
```

Тест подменяет функции получения ресурсов: первая завершается успешно, вторая выбрасывает контрольную ошибку. Проверка подтверждает вызов `first.close()` и сохранение этой ошибки.

### Объяснение

Очистка регистрируется сразу после успешного получения ресурса. Поэтому ошибка следующего шага не оставляет уже созданный ресурс без владельца. Обратный порядок учитывает зависимости между ресурсами.

### Типичная ошибка

Регистрировать все функции очистки только после полного построения или считать любой `close()` идемпотентным без документированного контракта.

### Связь с Automation QA

Тот же принцип позже защищает browser contexts, API contexts и database transactions от утечек при частично успешной подготовке test runtime.

## 5. Области жизни ресурсов каркаса

### Ответ

| Ресурс | Scope / lifetime | Владелец | Sharing | Cleanup и риск |
| --- | --- | --- | --- | --- |
| `RuntimeConfig` | Снимок процесса | Слой конфигурации | Да, объект неизменяем | Очистка не нужна; риск устаревшей мутации |
| `FoundationContext` | Test | Fixture | Нет по умолчанию | После теста; риск общего изменяемого состояния |
| `ResourceScope` | Runtime теста | Composition Root / fixture | Нет | LIFO после теста; риск утечки |
| `.env.example` | Артефакт репозитория | Репозиторий | Да | Очистка не нужна; риск зафиксированного секрета |
| Внешний SUT | Внешняя среда | Внешняя среда | Да | Каркас не закрывает; риск разрушить чужой ресурс |
| Будущий browser context | Test | UI fixture | Нет по умолчанию | После теста; риск утечки состояния |

Worker scope сам по себе не изолирует бизнес-данные. Изоляция требует уникальных данных, ясного владения и гарантированной очистки.

### Объяснение

Область жизни выбирается по владению, изменяемости и правилам очистки. Высокая стоимость создания может быть аргументом, но не отменяет риск разделяемого состояния.

### Типичная ошибка

Переносить изменяемый ресурс в worker scope только ради скорости и считать, что test runner автоматически разделит данные.

### Связь с Automation QA

Верная область жизни предотвращает взаимное влияние параллельных тестов и делает причины нестабильных падений наблюдаемыми.

## 6. Мини-проект: расширение проверок каркаса

### Ответ

Пример негативного теста для URL с credentials:

```ts
import { expect, test } from "@playwright/test";
import { ConfigurationError, validateConfig } from "../../src/config/index.js";

test("rejects credentials inside UI URL", () => {
  expect(() =>
    validateConfig({
      QA_PROFILE: "local",
      QA_UI_BASE_URL: "https://user:password@ui.qa.invalid",
      QA_REST_BASE_URL: "https://api.qa.invalid",
      QA_GRPC_TARGET: "grpc.qa.invalid:443",
      QA_POSTGRES_CONNECTION_REF: "secret://local/postgres",
      QA_CREDENTIALS_REF: "secret://local/credentials",
    }),
  ).toThrow(
    expect.objectContaining<Partial<ConfigurationError>>({
      key: "QA_UI_BASE_URL",
    }),
  );
});
```

Команды проверки:

```bash
npm run final-project:typecheck
npm run final-project:startup
npm run final-project:test
npm run final-project:check
```

### Объяснение

Тест работает только с необработанным источником и проверяющей функцией, поэтому не требует браузера, сети или реальных credentials. Проверка использует имя ключа, а не чувствительное значение.

### Типичная ошибка

Добавлять retries к детерминированному тесту конфигурации или ослаблять исполняемую проверяющую функцию, чтобы тест было проще написать.

### Связь с Automation QA

Целенаправленные негативные тесты фиксируют контракт конфигурации и останавливают framework до запуска дорогих UI, API, gRPC или database-шагов.
