# Практика: TypeScript and JavaScript Modules

## Концептуальные вопросы

1. Что делает `export` в модуле?
2. Почему TypeScript не заменяет JavaScript module semantics?
3. Почему `interface` не становится значением времени выполнения после экспорта?

## Чтение кода

```ts
export type ReportStatus = "passed" | "failed";

export function createReportLine(title: string, status: ReportStatus): string {
  return `${status}: ${title}`;
}
```

Что является runtime-экспортом, а что существует только для проверки типов?

## Предскажите результат проверки

```ts
import { createReportLine } from "./report-line.js";

createReportLine("login", "skipped");
```

Что покажет TypeScript, если `ReportStatus` разрешает только `"passed"` и `"failed"`?

## Анализ типа

Объясните, почему default export не является автоматически лучшим выбором, чем named export.

## Задание на отладку

Исправьте импорт:

```ts
import { buildTitle } from "./title.js";

console.log(buildTitle("smoke"));
```

Файл `title.ts` экспортирует:

```ts
export function createTitle(value: string): string {
  return `Report: ${value}`;
}
```

## Задание Automation QA

Создайте модуль, который экспортирует type `CheckStatus = "passed" | "failed"` и функцию `formatCheckStatus(status: CheckStatus): string`.

## Мини-проект

Спроектируйте два модуля:

- `report-model.ts` экспортирует type `ReportItem`;
- `report-format.ts` импортирует `ReportItem` и экспортирует функцию `formatReportItem()`.
