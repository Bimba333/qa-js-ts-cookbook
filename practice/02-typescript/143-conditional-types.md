# Практика: Conditional Types

## Концептуальные вопросы

1. Что означает `T extends U ? X : Y`?
2. Почему conditional type не является `if` во время выполнения?
3. Что происходит с generic conditional type при union?

## Чтение кода

```ts
type IsString<Value> = Value extends string ? true : false;

type A = IsString<string>;
type B = IsString<number>;
```

Какие типы получают `A` и `B`?

## Предскажите результат проверки

```ts
type OnlyString<Value> = Value extends string ? Value : never;

type Result = OnlyString<string | number | boolean>;
```

Какой тип получает `Result`?

## Анализ типа

Почему `extends` в conditional type означает assignability, а не наследование класса?

## Задание на отладку

Исправьте вспомогательный тип:

```ts
type Message<Result> = Result.ok extends true ? "ok" : "fail";
```

## Задание Automation QA

Создайте `AssertionLabel<Result>`, который возвращает `"passed"`, если `Result` подходит под `{ passed: true }`, иначе `"failed"`.

## Мини-проект

Создайте `ToArray<Value>`, который превращает каждый вариант union в массив этого варианта.
