# Практика: Typed Configuration and Test Data

## Концептуальные вопросы

1. Почему configuration лучше описывать типом, а не оставлять как произвольный объект?
2. Чем `satisfies` полезен для config objects?
3. Почему TypeScript не валидирует данные, которые пришли во время выполнения?

## Чтение кода

```ts
type EnvironmentName = "local" | "staging" | "production";

type EnvironmentConfig = {
  name: EnvironmentName;
  baseUrl: string;
  retries: number;
};

const stagingConfig: EnvironmentConfig = {
  name: "staging",
  baseUrl: "https://staging.example.test",
  retries: 2,
};
```

Какие ошибки TypeScript смог бы найти в таком объекте?

## Предскажите результат проверки

```ts
type EnvironmentName = "local" | "staging" | "production";

type EnvironmentMap = Record<EnvironmentName, string>;

const urls = {
  local: "http://localhost:3000",
  staging: "https://staging.example.test",
} satisfies EnvironmentMap;
```

Что покажет TypeScript?

## Анализ типа

Объясните разницу между типом:

```ts
type TestUser = {
  id: string;
  email: string;
};
```

и реальным объектом, который пришел из внешнего JSON.

## Задание на отладку

Исправьте данные:

```ts
type TestUser = {
  readonly id: string;
  email: string;
  role: "admin" | "viewer";
};

const user: TestUser = {
  id: "user-1",
  email: "admin@example.test",
  role: "owner",
};
```

## Задание Automation QA

Опишите типы для двух тестовых окружений:

- `local`;
- `staging`.

У каждого окружения должны быть:

- `name`;
- `baseUrl`;
- `retries`.

## Мини-проект

Создайте модель `TestDataSet`, которая содержит:

- `environment`;
- список пользователей;
- имя набора данных.

Пользователь должен иметь `id`, `email` и `role`.
