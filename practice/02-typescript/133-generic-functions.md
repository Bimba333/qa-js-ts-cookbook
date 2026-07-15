# Практика: Generic Functions

## Концептуальные вопросы

1. Чем обобщённая функция отличается от функции с `any`?
2. Почему параметр типа не существует во время выполнения?
3. Как один параметр типа связывает вход и выход функции?

## Чтение кода

```ts
function first<Item>(items: Item[]): Item | undefined {
  return items[0];
}

const value = first(["passed", "failed"]);
```

Какой тип получает `value`?

## Предскажите результат проверки

```ts
function wrap<Value>(value: Value) {
  return { value };
}

const wrapped = wrap({ id: "u-1", role: "admin" });
```

Будет ли TypeScript знать поле `role` у `wrapped.value`?

## Анализ типа

Объясните, почему функция ниже небезопасна:

```ts
function first(items: any[]) {
  return items[0];
}
```

## Задание на отладку

Перепишите функцию без `any`:

```ts
function createData(data: any): any {
  return data;
}
```

## Задание Automation QA

Напишите обобщённую вспомогательную функцию `withMeta`, которая принимает значение любого типа и возвращает объект с полями:

- `value`;
- `createdAt`.

Тип `value` должен сохраняться.

## Мини-проект

Создайте обобщённую вспомогательную функцию `pair`, которая принимает expected и actual значения. Типы expected и actual могут быть разными и должны сохраняться.
