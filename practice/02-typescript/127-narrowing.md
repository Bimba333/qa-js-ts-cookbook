# Практика: Narrowing

## Концептуальные вопросы

1. Почему union type нельзя использовать как один конкретный тип без проверки?
2. Чем narrowing отличается от изменения значения во время выполнения?
3. Как `return` помогает TypeScript исключить вариант типа?

## Чтение кода

```ts
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return value.toFixed(1);
}
```

Объясните, какой тип имеет `value` в каждой ветке.

## Предскажите результат проверки

```ts
function message(error: string | undefined): string {
  if (error === undefined) {
    return "ok";
  }

  return error.toUpperCase();
}
```

Будет ли TypeScript разрешать `error.toUpperCase()` после `if`?

## Анализ типа

Опишите, почему этот код небезопасен:

```ts
function print(value: string | number): void {
  console.log(value.toUpperCase());
}
```

## Задание на отладку

Исправьте код так, чтобы TypeScript понимал оба варианта:

```ts
function normalize(value: string | number): string {
  return value.trim();
}
```

## Задание Automation QA

Создайте тип результата логина:

```ts
type LoginResult =
  | { status: "success"; userId: string }
  | { status: "failed"; reason: string };
```

Напишите функцию `describeLogin(result: LoginResult): string`, которая безопасно обрабатывает оба варианта.

## Мини-проект

Опишите union type для результата запуска теста:

- тест прошел;
- тест упал;
- тест был пропущен.

Напишите функцию, которая возвращает текст для отчета и использует narrowing.
