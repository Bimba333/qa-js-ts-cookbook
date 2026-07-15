# Практика: Type-only Imports and Exports

## Концептуальные вопросы

1. Что делает `import type`?
2. Почему type-only import стирается при компиляции?
3. Почему `import type` не должен использоваться для побочных эффектов?

## Чтение кода

```ts
import type { EnvironmentConfig } from "./environment-config.js";

function buildBaseUrl(config: EnvironmentConfig): string {
  return `${config.protocol}://${config.host}`;
}
```

Какая зависимость нужна только TypeScript, а какая нужна JavaScript во время выполнения?

## Предскажите результат проверки

```ts
import type { ReportWriter } from "./report-writer.js";

const writer = new ReportWriter();
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему class может использоваться и как значение времени выполнения, и как тип экземпляра.

## Задание на отладку

Исправьте код:

```ts
import type { createReportLine } from "./report-line.js";

console.log(createReportLine("login", "passed"));
```

`createReportLine` является функцией.

## Задание Automation QA

Создайте type `EnvironmentConfig` и функцию `buildBaseUrl(config: EnvironmentConfig): string`, используя `import type`.

## Мини-проект

Создайте модуль `report-types.ts` с `export type ReportItem`.

Создайте модуль `report-printer.ts`, который импортирует этот тип через `import type` и форматирует объект.
