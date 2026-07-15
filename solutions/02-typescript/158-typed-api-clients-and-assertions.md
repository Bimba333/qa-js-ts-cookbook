# Решения: Typed API Clients and Assertions

## Концептуальные вопросы

### Ответ

`ApiResponse<T>` позволяет переиспользовать общую форму ответа с разными телами. Тип ответа API не является проверкой во время выполнения, потому что типы исчезают после компиляции. `any` опасен, потому что отключает проверку в месте работы с внешними данными.

### Объяснение

TypeScript помогает коду клиента, но не гарантирует честность внешнего сервера.

### Типичная ошибка

Считать, что тип автоматически проверяет реальный HTTP-ответ.

### Связь с Automation QA

API-тесты часто работают с недоверенными данными, поэтому граница проверки во время выполнения должна быть осознанной.

## Чтение кода

### Ответ

После `await getUser()` поле `body` будет иметь тип `UserResponse`.

### Объяснение

`ApiResponse<UserResponse>` подставляет `UserResponse` вместо generic-параметра `TBody`.

### Типичная ошибка

Терять тип body и возвращать `ApiResponse<unknown>` без необходимости.

### Связь с Automation QA

Так API-клиент сообщает тестам, какую модель ответа он возвращает.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку: в объекте нет обязательного поля `email`.

### Объяснение

`UserResponse` требует `id` и `email`.

### Типичная ошибка

Считать частичный объект полноценной response model.

### Связь с Automation QA

Response models помогают ловить неполные тестовые данные.

## Анализ типа

### Ответ

`Promise<ApiResponse<UserResponse>>` помогает коду понимать форму результата. Но если реальный сервер вернет другую форму, TypeScript сам это не проверит во время выполнения.

### Объяснение

Тип относится к коду проекта, а не к физическому ответу сервера.

### Типичная ошибка

Доверять внешнему ответу только потому, что функция имеет тип.

### Связь с Automation QA

На границе API полезно сочетать типы и проверки во время выполнения, если данные недоверенные.

## Задание на отладку

### Ответ

```ts
type CreateUserPayload = {
  email: string;
  role: "admin" | "viewer";
};

const payload: CreateUserPayload = {
  email: "viewer@example.test",
  role: "viewer",
};
```

### Объяснение

`role` ограничен двумя допустимыми значениями.

### Типичная ошибка

Использовать строку, которую API не поддерживает.

### Связь с Automation QA

Типизированное тело запроса снижает риск отправки неверных данных.

## Задание Automation QA

### Ответ

```ts
type ApiResponse<TBody> = {
  status: number;
  body: TBody;
};

function assertStatus(response: ApiResponse<unknown>, expectedStatus: number): void {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${expectedStatus}, received ${response.status}`);
  }
}
```

### Объяснение

Вспомогательная функция проверяет статус и не зависит от конкретной формы body.

### Типичная ошибка

Типизировать body как `any` без необходимости.

### Связь с Automation QA

Такую функцию можно использовать для разных ответов API.

## Мини-проект

### Ответ

```ts
type ApiResponse<TBody> = {
  status: number;
  body: TBody;
};

type CreateUserPayload = {
  email: string;
  role: "admin" | "viewer";
};

type UserResponse = {
  id: string;
  email: string;
  role: "admin" | "viewer";
};

type UserRow = {
  id: string;
  email: string;
  role: "admin" | "viewer";
};

function mapRowToResponse(row: UserRow): UserResponse {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
  };
}
```

### Объяснение

Строка базы данных и ответ API могут иметь отдельные модели, даже если сейчас они совпадают.

### Типичная ошибка

Использовать одну модель для всех слоев без проверки границ.

### Связь с Automation QA

Так легче сравнивать данные API и базы без потери структуры.
