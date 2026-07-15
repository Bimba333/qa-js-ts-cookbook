# Практика: Generic Type Aliases and Interfaces

## Концептуальные вопросы

1. Зачем type alias может иметь параметр типа?
2. Чем generic interface отличается от обычного interface?
3. Почему неиспользуемый параметр типа является проблемой?

## Чтение кода

```ts
type ApiResponse<Data> = {
  status: number;
  body: Data;
};
```

Какую роль играет `Data`?

## Предскажите результат проверки

```ts
type TestResult<Data> = {
  status: "passed";
  data: Data;
};

const result: TestResult<{ id: string }> = {
  status: "passed",
  data: { id: "u-1" },
};
```

Будет ли TypeScript знать тип `result.data.id`?

## Анализ типа

Найдите проблему:

```ts
type Box<Value> = {
  createdAt: string;
};
```

## Задание на отладку

Создайте обобщённый type alias `Page<Item>` с полями:

- `items: Item[]`;
- `total: number`.

## Задание Automation QA

Создайте `ApiResponse<Data>` и используйте его для ответа с user body.

## Мини-проект

Создайте обобщённый interface `TestDataBuilder<Data>` с методом `build(): Data`, затем опишите builder для user test data.
