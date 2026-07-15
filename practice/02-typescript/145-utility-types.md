# Практика: Utility Types

## Концептуальные вопросы

1. Зачем нужны utility types?
2. Почему utility types не меняют объекты во время выполнения?
3. Какие изученные операции лежат в основе многих utility types?

## Чтение кода

```ts
type User = {
  id: string;
  email: string;
  role: "admin" | "viewer";
};

type UserPatch = Partial<User>;
type PublicUser = Pick<User, "id" | "email">;
```

Какие формы получают `UserPatch` и `PublicUser`?

## Предскажите результат проверки

```ts
type Status = "passed" | "failed" | "skipped";
type FinalStatus = Exclude<Status, "skipped">;

const status: FinalStatus = "skipped";
```

Что покажет TypeScript?

## Анализ типа

Объясните, чем `Pick<User, "id">` отличается от `Omit<User, "email">`.

## Задание на отладку

Исправьте тип:

```ts
type UsersById = Record<number>;
```

Он должен описывать словарь пользователей по строковому id.

## Задание Automation QA

Создайте `UpdateUserPayload` через `Partial<CreateUserPayload>`.

Создайте `PublicUserPayload` через `Omit<CreateUserPayload, "password">`.

## Мини-проект

Создайте function type `BuildTitle`.

Получите `Parameters<BuildTitle>` и `ReturnType<BuildTitle>`.
