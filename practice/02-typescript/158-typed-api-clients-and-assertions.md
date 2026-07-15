# Практика: Typed API Clients and Assertions

## Концептуальные вопросы

1. Зачем нужен generic type `ApiResponse<T>`?
2. Почему тип ответа API не является проверкой во время выполнения?
3. Почему `any` особенно опасен в API-клиенте?

## Чтение кода

```ts
type ApiResponse<TBody> = {
  status: number;
  body: TBody;
};

type UserResponse = {
  id: string;
  email: string;
};

async function getUser(): Promise<ApiResponse<UserResponse>> {
  return {
    status: 200,
    body: {
      id: "user-1",
      email: "admin@example.test",
    },
  };
}
```

Какой тип будет у `body` после `await getUser()`?

## Предскажите результат проверки

```ts
type UserResponse = {
  id: string;
  email: string;
};

const user: UserResponse = {
  id: "user-1",
};
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему `Promise<ApiResponse<UserResponse>>` помогает коду клиента, но не гарантирует честность реального сервера.

## Задание на отладку

Исправьте тело запроса:

```ts
type CreateUserPayload = {
  email: string;
  role: "admin" | "viewer";
};

const payload: CreateUserPayload = {
  email: "viewer@example.test",
  role: "owner",
};
```

## Задание Automation QA

Опишите вспомогательную функцию проверки `assertStatus`, которая принимает `ApiResponse<unknown>` и ожидаемый статус.

Если статус не совпадает, функция должна выбрасывать `Error`.

## Мини-проект

Создайте типы:

- `ApiResponse<TBody>`;
- `CreateUserPayload`;
- `UserResponse`;
- `UserRow`.

Затем напишите функцию, которая преобразует `UserRow` в `UserResponse`.
