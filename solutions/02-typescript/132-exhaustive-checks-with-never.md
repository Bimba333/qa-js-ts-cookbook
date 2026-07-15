# Решения: Exhaustive Checks with never

## Концептуальные вопросы

### Ответ

`never` означает, что после обработки всех вариантов ничего не должно остаться. `default: return "unknown"` скрывает забытый вариант. Discriminated union удобен, потому что `switch` по общему полю последовательно исключает варианты.

### Объяснение

Exhaustive check превращает неполный обработчик в ошибку компиляции.

### Типичная ошибка

Оставлять `default` без `const exhaustive: never = value`.

### Связь с Automation QA

Статусы отчетов и запусков тестов часто имеют конечный набор вариантов.

## Чтение кода

### Ответ

В `default` `status` должен быть `never`, потому что `passed` и `failed` уже обработаны.

### Объяснение

Если TypeScript видит там не `never`, значит, остался необработанный вариант.

### Типичная ошибка

Считать `default` просто запасной веткой.

### Связь с Automation QA

Так можно защитить formatter статусов от неполных изменений.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку на присваивании `status` в `never`.

### Объяснение

После добавления `skipped` этот вариант остается необработанным.

### Типичная ошибка

Добавить новый вариант union type и забыть обновить обработчики.

### Связь с Automation QA

При появлении нового статуса отчета компилятор покажет все места, которые нужно обновить.

## Анализ типа

### Ответ

Каждый `case` в `switch` сужает union type. Exhaustive check проверяет, что после всех `case` не осталось вариантов.

### Объяснение

Это продолжение narrowing, только в форме проверки полноты.

### Типичная ошибка

Использовать `never` без общего discriminant-поля.

### Связь с Automation QA

Discriminated union хорошо описывает состояния запуска, отчета или задачи.

## Задание на отладку

### Ответ

```ts
type JobState =
  | { state: "queued" }
  | { state: "running"; attempt: number }
  | { state: "done"; passed: boolean };

function label(state: JobState): string {
  switch (state.state) {
    case "queued":
      return "queued";
    case "running":
      return String(state.attempt);
    case "done":
      return state.passed ? "passed" : "failed";
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}
```

### Объяснение

Добавлена обработка `done`, поэтому в `default` ничего не остается.

### Типичная ошибка

Убрать проверку `never` вместо добавления пропущенной ветки.

### Связь с Automation QA

Так можно надежно обрабатывать состояния job-запуска.

## Задание Automation QA

### Ответ

```ts
type TestReportStatus =
  | { kind: "passed"; durationMs: number }
  | { kind: "failed"; errorMessage: string }
  | { kind: "skipped"; reason: string };

function formatReportStatus(status: TestReportStatus): string {
  switch (status.kind) {
    case "passed":
      return `passed: ${status.durationMs}ms`;
    case "failed":
      return `failed: ${status.errorMessage}`;
    case "skipped":
      return `skipped: ${status.reason}`;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
```

### Объяснение

Все варианты `kind` обработаны явно.

### Типичная ошибка

Использовать общий `string` для статуса вместо literal union.

### Связь с Automation QA

Formatter отчета становится устойчивым к расширению статусов.

## Мини-проект

### Ответ

```ts
type SuiteStatus =
  | { kind: "queued" }
  | { kind: "running"; workers: number }
  | { kind: "passed"; durationMs: number }
  | { kind: "failed"; failedTests: number }
  | { kind: "canceled"; reason: string };

function formatSuiteStatus(status: SuiteStatus): string {
  switch (status.kind) {
    case "queued":
      return "queued";
    case "running":
      return `running: ${status.workers}`;
    case "passed":
      return `passed: ${status.durationMs}ms`;
    case "failed":
      return `failed: ${status.failedTests}`;
    case "canceled":
      return `canceled: ${status.reason}`;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
```

### Объяснение

`never` в `default` гарантирует, что новый статус нельзя забыть.

### Типичная ошибка

Возвращать `"unknown"` для любого нового статуса.

### Связь с Automation QA

Это полезно для отчетов по suite-level результатам.
