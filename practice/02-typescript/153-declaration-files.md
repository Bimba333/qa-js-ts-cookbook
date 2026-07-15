# Практика: Declaration Files

## Концептуальные вопросы

1. Что описывает `.d.ts` файл?
2. Почему `declare` не создает значение времени выполнения?
3. Почему декларация должна совпадать с реальным JavaScript API?

## Чтение кода

```ts
declare function buildReportName(title: string): string;
```

Что это объявление сообщает TypeScript и чего оно не делает?

## Предскажите результат проверки

```ts
declare function createReportLine(title: string, passed: boolean): string;

createReportLine("login", "passed");
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему `.d.ts` файл может сделать небезопасный код внешне корректным, если декларация неверная.

## Задание на отладку

Исправьте декларацию:

```ts
declare function readRetryCount(): string;

const retries: number = readRetryCount();
```

Фактический JavaScript helper возвращает число.

## Задание Automation QA

Опишите декларацию для JavaScript helper `createLegacyReportLine(title, passed)`, который возвращает строку.

## Мини-проект

Создайте декларации для небольшого legacy API:

- `getEnvironmentName(): "local" | "staging"`;
- `getBaseUrl(): string`;
- `writeReportLine(line: string): void`.
