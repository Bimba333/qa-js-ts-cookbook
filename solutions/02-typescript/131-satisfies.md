# Решения: satisfies

## Концептуальные вопросы

### Ответ

`satisfies` проверяет, что значение соответствует типу, но не заменяет выведенный тип выражения целевым типом. От annotation он отличается сохранением типа выражения, от assertion — тем, что не скрывает несоответствие.

### Объяснение

Это проверка формы объекта на этапе компиляции.

### Типичная ошибка

Считать `satisfies` проверкой данных во время выполнения.

### Связь с Automation QA

Он удобен для статических конфигураций тестового проекта.

## Чтение кода

### Ответ

`config.mode` остается `"summary"`, потому что `satisfies` не назначает переменной общий тип `ReportConfig`, а целевой тип содержит literal union для `mode`.

### Объяснение

TypeScript проверяет совместимость, но сохраняет исходный вывод типа объекта.

### Типичная ошибка

Ожидать такого же поведения от annotation.

### Связь с Automation QA

Точные литеральные значения помогают различать режимы отчетов и окружений.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку: `retries` должен быть `number`, а передана строка.

### Объяснение

`satisfies` проверяет соответствие форме `EnvironmentConfig`.

### Типичная ошибка

Писать `as EnvironmentConfig`, скрывая ошибку.

### Связь с Automation QA

Ошибка конфигурации будет поймана до запуска тестов.

## Анализ типа

### Ответ

`satisfies` работает только во время проверки TypeScript и исчезает после компиляции.

### Объяснение

Если данные пришли извне во время выполнения, их все равно нужно проверять кодом во время выполнения.

### Типичная ошибка

Использовать `satisfies` для данных из API.

### Связь с Automation QA

Статические настройки можно проверять через `satisfies`, внешние ответы требуют guards.

## Задание на отладку

### Ответ

```ts
type RetryPolicy = {
  retries: number;
  strategy: "none" | "linear";
};

const policy = {
  retries: 2,
  strategy: "linear",
} satisfies RetryPolicy;
```

### Объяснение

`strategy` должен быть одним из разрешенных литеральных значений.

### Типичная ошибка

Расширять тип ради неправильного значения вместо исправления конфигурации.

### Связь с Automation QA

Неправильная стратегия retry может исказить результаты тестов.

## Задание Automation QA

### Ответ

```ts
type EnvironmentConfig = {
  baseUrl: string;
  retries: number;
  report: "short" | "full";
};

const localConfig = {
  baseUrl: "http://localhost:3000",
  retries: 1,
  report: "short",
} satisfies EnvironmentConfig;
```

### Объяснение

Объект проверяется по форме и сохраняет точные значения.

### Типичная ошибка

Использовать assertion и потерять проверку.

### Связь с Automation QA

Так можно описывать окружения без лишней логики во время выполнения.

## Мини-проект

### Ответ

```ts
type EnvironmentConfig = {
  baseUrl: string;
  retries: number;
  report: "short" | "full";
};

const local = {
  baseUrl: "http://localhost:3000",
  retries: 0,
  report: "short",
} satisfies EnvironmentConfig;

const staging = {
  baseUrl: "https://staging.example.test",
  retries: 1,
  report: "full",
} satisfies EnvironmentConfig;

const production = {
  baseUrl: "https://example.test",
  retries: 2,
  report: "full",
} satisfies EnvironmentConfig;
```

### Объяснение

Каждый объект проверяется отдельно и сохраняет собственные литеральные значения.

### Типичная ошибка

Делать общий объект с неточными строковыми значениями.

### Связь с Automation QA

Такая структура полезна для выбора окружения запуска тестов.
