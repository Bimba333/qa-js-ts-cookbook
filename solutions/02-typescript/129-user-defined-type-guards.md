# Решения: User Defined Type Guards

## Концептуальные вопросы

### Ответ

`value is Type` означает: если функция вернула `true`, TypeScript может считать параметр типом `Type`. Обычный `boolean` не сообщает, какой тип доказан. TypeScript доверяет сигнатуре guard-функции.

### Объяснение

Type predicate связывает результат функции с narrowing параметра.

### Типичная ошибка

Думать, что TypeScript проверяет реализацию guard на полноту.

### Связь с Automation QA

Guard-функции полезны для переиспользуемой проверки API-ответов и конфигураций.

## Чтение кода

### Ответ

Проверка слишком слабая: она не проверяет значения `status` и не проверяет, что `durationMs` является числом.

### Объяснение

Guard должен доказывать именно тот тип, который указан в type predicate.

### Типичная ошибка

Проверить только наличие свойства, но не проверить его тип.

### Связь с Automation QA

API может вернуть поле с неправильным типом, и слабый guard это пропустит.

## Предскажите результат проверки

### Ответ

TypeScript разрешает `value.status`, потому что `isTestResult(value)` имеет сигнатуру `value is TestResult`.

### Объяснение

Внутри ветки `if` значение считается `TestResult`.

### Типичная ошибка

Ожидать такой же эффект от функции, которая возвращает просто `boolean`.

### Связь с Automation QA

Так можно отделить проверку ответа от бизнес-логики helper.

## Анализ типа

### Ответ

Плохой guard опасен, потому что TypeScript начинает доверять неверному утверждению.

### Объяснение

Если guard возвращает `true` для неподходящего значения, дальнейший код получает ложную безопасность.

### Типичная ошибка

Использовать guard как способ заглушить ошибки компилятора.

### Связь с Automation QA

Ложный guard может привести к падению тестов далеко от места реальной проблемы.

## Задание на отладку

### Ответ

```ts
function isApiError(value: unknown): value is { errorCode: string; message: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return "errorCode" in value && typeof value.errorCode === "string" && "message" in value && typeof value.message === "string";
}
```

### Объяснение

Проверяются объектность, `null`, массивы, наличие свойств и типы значений.

### Типичная ошибка

Не проверять `null`, хотя `typeof null === "object"`.

### Связь с Automation QA

Такой guard можно использовать перед формированием понятного сообщения об ошибке API.

## Задание Automation QA

### Ответ

```ts
type ApiSuccess = {
  ok: true;
  data: string;
};

function isApiSuccess(value: unknown): value is ApiSuccess {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return "ok" in value && value.ok === true && "data" in value && typeof value.data === "string";
}

function handle(value: unknown): string {
  if (isApiSuccess(value)) {
    return value.data;
  }

  return "Ответ не подходит";
}
```

### Объяснение

Guard доказывает точную форму успешного ответа.

### Типичная ошибка

Проверить только `ok`, но не проверить `data`.

### Связь с Automation QA

API helper может возвращать понятный результат только после проверки внешних данных.

## Мини-проект

### Ответ

```ts
type PassedResult = { status: "passed"; durationMs: number };
type FailedResult = { status: "failed"; message: string };

function isPassedResult(value: unknown): value is PassedResult {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "status" in value && value.status === "passed" && "durationMs" in value && typeof value.durationMs === "number";
}

function isFailedResult(value: unknown): value is FailedResult {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "status" in value && value.status === "failed" && "message" in value && typeof value.message === "string";
}

function report(value: unknown): string {
  if (isPassedResult(value)) {
    return `passed: ${value.durationMs}ms`;
  }

  if (isFailedResult(value)) {
    return `failed: ${value.message}`;
  }

  return "unknown";
}
```

### Объяснение

Каждый guard отвечает за один вариант результата.

### Типичная ошибка

Делать один слишком общий guard, который трудно проверить.

### Связь с Automation QA

Так строятся надежные helpers вокруг внешних данных.
