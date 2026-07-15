# Практика: Exhaustive Checks with never

## Концептуальные вопросы

1. Что означает `never` в exhaustive check?
2. Почему `default: return "unknown"` может скрыть ошибку?
3. Почему discriminated union хорошо подходит для exhaustive checks?

## Чтение кода

```ts
type Status =
  | { kind: "passed"; durationMs: number }
  | { kind: "failed"; message: string };

function format(status: Status): string {
  switch (status.kind) {
    case "passed":
      return String(status.durationMs);
    case "failed":
      return status.message;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
```

Почему `status` должен быть `never` в `default`?

## Предскажите результат проверки

Добавьте в `Status` вариант:

```ts
{ kind: "skipped"; reason: string }
```

Что произойдет с `const exhaustive: never = status`?

## Анализ типа

Объясните, почему exhaustive check зависит от narrowing в `switch`.

## Задание на отладку

Исправьте функцию так, чтобы она обрабатывала все варианты:

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
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}
```

## Задание Automation QA

Создайте `TestReportStatus` с вариантами:

- `passed`;
- `failed`;
- `skipped`.

Напишите formatter с exhaustive check.

## Мини-проект

Смоделируйте обработку статуса запуска тестового набора:

- queued;
- running;
- passed;
- failed;
- canceled.

Сделайте `switch`, который TypeScript проверяет на полноту через `never`.
