# Решения: Utility Types

## Концептуальные вопросы

### Ответ

Utility types нужны для готовых преобразований типов. Они не меняют объекты во время выполнения. Многие из них основаны на `keyof`, mapped types, conditional types и `infer`.

### Объяснение

Это стандартные строительные блоки TypeScript.

### Типичная ошибка

Использовать utility type вместо понимания формы данных.

### Связь с Automation QA

Utility types помогают строить payload, response и config-модели.

## Чтение кода

### Ответ

`UserPatch` получает все поля `User` как optional. `PublicUser` получает только `id` и `email`.

### Объяснение

`Partial` делает свойства необязательными, `Pick` выбирает указанные ключи.

### Типичная ошибка

Думать, что `Partial` изменит объект во время выполнения.

### Связь с Automation QA

Patch payload часто описывается через `Partial`.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку.

### Объяснение

`FinalStatus` исключает `"skipped"`, поэтому допустимы только `"passed"` и `"failed"`.

### Типичная ошибка

Ожидать, что исходный union останется без изменений.

### Связь с Automation QA

Так можно отделять финальные статусы от промежуточных.

## Анализ типа

### Ответ

`Pick<User, "id">` оставляет только выбранные поля. `Omit<User, "email">` оставляет все поля, кроме указанных.

### Объяснение

Оба типа строят новую объектную форму от исходной.

### Типичная ошибка

Использовать `Omit`, когда нужно явно ограничить публичный контракт через `Pick`.

### Связь с Automation QA

Для public response часто безопаснее явно выбирать поля.

## Задание на отладку

### Ответ

```ts
type User = {
  id: string;
  email: string;
};

type UsersById = Record<string, User>;
```

### Объяснение

`Record<Key, Value>` требует два аргумента типа.

### Типичная ошибка

Передать только тип ключа.

### Связь с Automation QA

Словари по id часто используются для fixtures и test data.

## Задание Automation QA

### Ответ

```ts
type CreateUserPayload = {
  email: string;
  password: string;
  role: "admin" | "viewer";
};

type UpdateUserPayload = Partial<CreateUserPayload>;
type PublicUserPayload = Omit<CreateUserPayload, "password">;
```

### Объяснение

Update payload может содержать часть полей, а public payload исключает пароль.

### Типичная ошибка

Сделать password optional вместо полного исключения из публичной модели.

### Связь с Automation QA

Так API tests не смешивают create payload и public response.

## Мини-проект

### Ответ

```ts
type BuildTitle = (suite: string, test: string) => string;

type BuildTitleArgs = Parameters<BuildTitle>;
type BuildTitleResult = ReturnType<BuildTitle>;
```

### Объяснение

`Parameters` извлекает tuple параметров, `ReturnType` извлекает тип результата.

### Типичная ошибка

Передать не function type.

### Связь с Automation QA

Так можно связывать helper call arguments с его function type.
