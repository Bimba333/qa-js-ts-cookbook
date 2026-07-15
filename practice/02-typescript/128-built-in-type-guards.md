# Практика: Built-in Type Guards

## Концептуальные вопросы

1. Какие проверки TypeScript понимает как built-in type guards?
2. Когда лучше использовать `typeof`?
3. Почему truthiness narrowing может быть логически опасным?

## Чтение кода

```ts
function label(value: string | number | null): string {
  if (typeof value === "number") {
    return `count: ${value}`;
  }

  if (value === null) {
    return "empty";
  }

  return value.toUpperCase();
}
```

Объясните, как TypeScript уточняет тип на каждом шаге.

## Предскажите результат проверки

```ts
type Success = { data: string };
type Failure = { error: string };

function read(response: Success | Failure): string {
  if ("data" in response) {
    return response.data;
  }

  return response.error;
}
```

Почему TypeScript разрешает доступ к `response.data`?

## Анализ типа

Найдите потенциальную проблему:

```ts
function getName(name: string | undefined): string {
  if (name) {
    return name;
  }

  return "Anonymous";
}
```

Что произойдет с пустой строкой?

## Задание на отладку

Исправьте код:

```ts
function hasMessage(value: unknown): boolean {
  return "message" in value;
}
```

Добавьте проверку, которая делает использование `in` безопасным.

## Задание Automation QA

Создайте union type для API-ответа:

- `{ status: "ok"; body: string }`
- `{ status: "error"; message: string }`

Напишите функцию, которая использует equality narrowing по `status`.

## Мини-проект

Напишите helper `formatUnknownError(error: Error | string | null): string`.

Используйте `instanceof`, `typeof` и явную проверку `null`.
