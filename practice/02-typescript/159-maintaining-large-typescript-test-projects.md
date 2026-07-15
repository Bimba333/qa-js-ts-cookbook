# Практика: Maintaining Large TypeScript Test Projects

## Концептуальные вопросы

1. Почему у типов должен быть владелец?
2. Почему публичный типовой API должен быть небольшим?
3. Чем опасны слишком сложные типы без реальной инженерной задачи?

## Чтение кода

```ts
export type ReportStatus = "passed" | "failed" | "skipped";

export type ReportSummary = {
  suiteName: string;
  status: ReportStatus;
  durationMs: number;
};

type InternalReportLine = {
  text: string;
  level: "info" | "warning";
};
```

Какие типы являются публичной границей модуля, а какой тип остается внутренним?

## Предскажите результат проверки

```ts
type RetryPolicy = {
  maxAttempts: number;
  delayMs: number;
};

const policy: RetryPolicy = {
  maxAttempts: 3,
};
```

Что покажет TypeScript?

## Анализ типа

Объясните, как TypeScript помогает при рефакторинге `UserRole`, если эта роль используется в разных слоях проекта.

## Задание на отладку

Сузьте публичный API:

```ts
export type InternalRetryState = {
  attempt: number;
  startedAt: number;
};

export type RetryPolicy = {
  maxAttempts: number;
  delayMs: number;
};
```

Какой тип стоит оставить экспортируемым, если другие модули должны знать только правила повторов?

## Задание Automation QA

Опишите, где должны жить типы для:

- конфигурации;
- ответа API;
- Page Object;
- сводки отчета.

## Мини-проект

Спроектируйте небольшой публичный типовой API для модуля отчетности.

Он должен экспортировать:

- `ReportStatus`;
- `ReportSummary`;
- функцию создания краткого текста отчета.

Внутренний тип строки отчета не экспортируйте.
