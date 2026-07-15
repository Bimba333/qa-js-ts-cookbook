# Практика: satisfies

## Концептуальные вопросы

1. Какую проблему решает `satisfies`?
2. Чем `satisfies` отличается от annotation?
3. Чем `satisfies` отличается от assertion?

## Чтение кода

```ts
type ReportConfig = {
  mode: "summary" | "detailed";
  includePassed: boolean;
};

const config = {
  mode: "summary",
  includePassed: true,
} satisfies ReportConfig;
```

Почему `config.mode` остается точным значением `"summary"`?

## Предскажите результат проверки

```ts
type EnvironmentConfig = {
  baseUrl: string;
  retries: number;
};

const config = {
  baseUrl: "https://service.local",
  retries: "2",
} satisfies EnvironmentConfig;
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему `satisfies` не проверяет данные во время выполнения.

## Задание на отладку

Исправьте конфигурацию:

```ts
type RetryPolicy = {
  retries: number;
  strategy: "none" | "linear";
};

const policy = {
  retries: 2,
  strategy: "always",
} satisfies RetryPolicy;
```

## Задание Automation QA

Создайте тип конфигурации окружения:

- `baseUrl: string`;
- `retries: number`;
- `report: "short" | "full"`.

Создайте объект через `satisfies`.

## Мини-проект

Создайте набор конфигураций для `local`, `staging` и `production`.

Каждая конфигурация должна проверяться через `satisfies`, но сохранять точные литеральные значения.
