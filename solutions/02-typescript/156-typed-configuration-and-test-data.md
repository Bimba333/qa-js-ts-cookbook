# Решения: Typed Configuration and Test Data

## Концептуальные вопросы

### Ответ

Конфигурацию лучше описывать типом, потому что от нее зависят разные части проекта. `satisfies` проверяет форму объекта и сохраняет точность значений. TypeScript не валидирует данные во время выполнения, потому что типы исчезают после компиляции.

### Объяснение

Типы работают на этапе проверки кода, а не во время выполнения программы.

### Типичная ошибка

Считать типизированный объект защитой от любого внешнего значения.

### Связь с Automation QA

Конфигурация окружений влияет на запуск тестов, API helpers и отчеты.

## Чтение кода

### Ответ

TypeScript смог бы найти неправильное значение `name`, отсутствие `baseUrl`, отсутствие `retries` или неправильный тип любого поля.

### Объяснение

`EnvironmentConfig` задает обязательную форму объекта.

### Типичная ошибка

Думать, что объект с похожими полями всегда подходит типу.

### Связь с Automation QA

Так можно заранее поймать ошибки в объектах конфигурации.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку: в объекте нет ключа `production`, который обязателен в `Record<EnvironmentName, string>`.

### Объяснение

`Record` требует значение для каждого варианта из union.

### Типичная ошибка

Использовать `Record`, но забыть один из обязательных ключей.

### Связь с Automation QA

Каждое окружение должно иметь настройку, иначе запуск может сломаться поздно.

## Анализ типа

### Ответ

`TestUser` описывает ожидаемую форму во время проверки TypeScript. Внешний JSON является значением во время выполнения и может не соответствовать этому типу.

### Объяснение

TypeScript проверяет код, который пишет разработчик, но не проверяет автоматически внешние данные.

### Типичная ошибка

Присвоить внешним данным тип и считать их проверенными.

### Связь с Automation QA

Данные из файлов, API или окружения требуют отдельной проверки на границе.

## Задание на отладку

### Ответ

```ts
type TestUser = {
  readonly id: string;
  email: string;
  role: "admin" | "viewer";
};

const user: TestUser = {
  id: "user-1",
  email: "admin@example.test",
  role: "admin",
};
```

### Объяснение

`role` может быть только `"admin"` или `"viewer"`.

### Типичная ошибка

Добавлять новое строковое значение без изменения модели.

### Связь с Automation QA

Роли тестовых пользователей должны быть согласованы с тем, что реально поддерживает проект.

## Задание Automation QA

### Ответ

```ts
type EnvironmentName = "local" | "staging";

type EnvironmentConfig = {
  name: EnvironmentName;
  baseUrl: string;
  retries: number;
};

const environments = {
  local: {
    name: "local",
    baseUrl: "http://localhost:3000",
    retries: 0,
  },
  staging: {
    name: "staging",
    baseUrl: "https://staging.example.test",
    retries: 2,
  },
} satisfies Record<EnvironmentName, EnvironmentConfig>;
```

### Объяснение

`Record` требует конфигурацию для каждого окружения.

### Типичная ошибка

Описать окружения как произвольный объект без проверки ключей.

### Связь с Automation QA

Такой объект может использовать runner, API helper и модуль отчетности.

## Мини-проект

### Ответ

```ts
type EnvironmentName = "local" | "staging";

type TestUser = {
  id: string;
  email: string;
  role: "admin" | "viewer";
};

type TestDataSet = {
  name: string;
  environment: EnvironmentName;
  users: readonly TestUser[];
};

const smokeData: TestDataSet = {
  name: "smoke",
  environment: "staging",
  users: [
    {
      id: "user-1",
      email: "admin@example.test",
      role: "admin",
    },
  ],
};
```

### Объяснение

Модель связывает имя набора, окружение и пользователей.

### Типичная ошибка

Хранить тестовые данные без общей формы.

### Связь с Automation QA

Такой набор можно переиспользовать в smoke- и regression-сценариях.
