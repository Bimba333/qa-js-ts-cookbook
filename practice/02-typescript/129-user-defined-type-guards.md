# Практика: User Defined Type Guards

## Концептуальные вопросы

1. Что означает запись `value is Type`?
2. Почему обычного `boolean` недостаточно для reusable narrowing?
3. Почему TypeScript доверяет guard-функции?

## Чтение кода

```ts
type TestResult = {
  status: "passed" | "failed";
  durationMs: number;
};

function isTestResult(value: unknown): value is TestResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "status" in value && "durationMs" in value;
}
```

Какая проверка здесь слишком слабая?

## Предскажите результат проверки

```ts
function handle(value: unknown): string {
  if (isTestResult(value)) {
    return value.status;
  }

  return "unknown";
}
```

Почему TypeScript разрешает `value.status` внутри `if`?

## Анализ типа

Объясните, почему плохой guard может быть опаснее отсутствия guard.

## Задание на отладку

Улучшите guard:

```ts
function isApiError(value: unknown): value is { errorCode: string; message: string } {
  return typeof value === "object";
}
```

Проверка должна учитывать `null`, массивы, наличие свойств и типы свойств.

## Задание Automation QA

Создайте guard `isApiSuccess`, который проверяет объект:

```ts
type ApiSuccess = {
  ok: true;
  data: string;
};
```

Используйте его в функции обработки `unknown` ответа.

## Мини-проект

Напишите два guard:

- `isPassedResult`;
- `isFailedResult`.

Затем напишите функцию, которая принимает `unknown` и возвращает текст для отчета.
