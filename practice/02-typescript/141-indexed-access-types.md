# Практика: Indexed Access Types

## Концептуальные вопросы

1. Что делает `Type[Key]`?
2. Почему indexed access type не читает свойство во время выполнения?
3. Как получить тип элемента массива через `ArrayType[number]`?

## Чтение кода

```ts
type ApiResponse = {
  status: 200;
  body: {
    id: string;
    email: string;
  };
};

type Body = ApiResponse["body"];
```

Какой тип получает `Body`?

## Предскажите результат проверки

```ts
type User = {
  id: string;
};

type Email = User["email"];
```

Что покажет TypeScript?

## Анализ типа

Что получится из типа `ApiResponse["status" | "body"]`?

## Задание на отладку

Исправьте тип элемента массива:

```ts
type Tests = Array<{
  title: string;
  status: "passed" | "failed";
}>;

type Test = Tests["title"];
```

## Задание Automation QA

Создайте тип `CreateUserResponse` с полем `body`.

Получите тип `CreatedUser` через indexed access type.

## Мини-проект

Создайте тип `Suite` с массивом `tests`.

Получите тип одного теста через `Suite["tests"][number]`.
