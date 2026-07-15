# Решения: Type-only Imports and Exports

## Концептуальные вопросы

### Ответ

`import type` импортирует объявление только для проверки типов. Такой импорт стирается при компиляции и не должен использоваться для выполнения побочных эффектов.

### Объяснение

Импорт только типа не создает зависимость времени выполнения в сгенерированном JavaScript.

### Типичная ошибка

Ожидать, что `import type` выполнит код импортируемого модуля.

### Связь с Automation QA

Типы config и response models можно импортировать без лишних runtime-зависимостей.

## Чтение кода

### Ответ

`EnvironmentConfig` нужен только TypeScript. В показанном фрагменте нет runtime-импорта.

### Объяснение

Функция получает объект во время вызова. Сам тип нужен только для проверки формы объекта.

### Типичная ошибка

Считать тип runtime-объектом.

### Связь с Automation QA

Helpers часто принимают configuration shape, но не создают конфигурацию сами.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку: `ReportWriter` импортирован только как тип и не может использоваться с `new`.

### Объяснение

`new` требует значение класса во время выполнения.

### Типичная ошибка

Забывать, что class имеет сторону значения и сторону типа.

### Связь с Automation QA

Если helper-функция создает объект, нужен обычный import, а не `import type`.

## Анализ типа

### Ответ

Class существует как JavaScript-значение во время выполнения и одновременно описывает тип своих экземпляров в TypeScript.

### Объяснение

Обычный import класса можно использовать в value position и type position. `import type` оставляет только type position.

### Типичная ошибка

Считать, что все объявления TypeScript имеют значение во время выполнения.

### Связь с Automation QA

Page object class можно передавать как тип экземпляра или создавать как значение.

## Задание на отладку

### Ответ

```ts
import { createReportLine } from "./report-line.js";

console.log(createReportLine("login", "passed"));
```

### Объяснение

Функция является значением времени выполнения, поэтому нужен обычный import.

### Типичная ошибка

Использовать `import type` для функций.

### Связь с Automation QA

Helper-функции времени выполнения должны импортироваться как значения.

## Задание Automation QA

### Ответ

```ts
// environment-config.ts
export type EnvironmentConfig = {
  protocol: "http" | "https";
  host: string;
};
```

```ts
// build-base-url.ts
import type { EnvironmentConfig } from "./environment-config.js";

export function buildBaseUrl(config: EnvironmentConfig): string {
  return `${config.protocol}://${config.host}`;
}
```

### Объяснение

Функция использует только форму конфигурации, поэтому type-only import подходит.

### Типичная ошибка

Импортировать тип обычным import без необходимости.

### Связь с Automation QA

Это делает зависимости helper-модуля понятнее.

## Мини-проект

### Ответ

```ts
// report-types.ts
export type ReportItem = {
  title: string;
  status: "passed" | "failed";
};
```

```ts
// report-printer.ts
import type { ReportItem } from "./report-types.js";

export function printReportItem(item: ReportItem): string {
  return `${item.status}: ${item.title}`;
}
```

### Объяснение

Тип импортируется только для проверки параметра.

### Типичная ошибка

Ожидать, что `ReportItem` будет доступен в сгенерированном JavaScript.

### Связь с Automation QA

Так можно типизировать данные отчета без лишнего кода времени выполнения.
