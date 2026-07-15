# Практика: Module Resolution

## Концептуальные вопросы

1. Что такое module specifier?
2. Чем relative import отличается от non-relative import?
3. Почему TypeScript не устанавливает пакет автоматически?

## Чтение кода

```ts
import { formatTitle } from "./format-title.js";
```

Где TypeScript будет искать модуль?

## Предскажите результат проверки

```ts
import { buildReport } from "./missing-report.js";
```

Что покажет TypeScript, если такого файла нет?

## Анализ типа

Объясните, почему найденная `.d.ts` декларация не гарантирует наличие runtime-реализации.

## Задание на отладку

Исправьте импорт, если текущий файл лежит рядом с `report-name.ts`:

```ts
import { buildReportName } from "report-name";
```

## Задание Automation QA

Опишите, как лучше организовать relative imports между `report-file.ts` и `report-name.ts`, если файлы лежат в одной папке.

## Мини-проект

Создайте три файла:

- `format-title.ts`;
- `report-file.ts`;
- `main.ts`.

`main.ts` должен импортировать функцию из `report-file.ts`, а `report-file.ts` — функцию из `format-title.ts`.
