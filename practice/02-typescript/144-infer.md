# Практика: infer

## Концептуальные вопросы

1. Где можно использовать `infer`?
2. Почему `infer` не создает переменную во время выполнения?
3. Чем `infer` отличается от обычного вывода generic-типа?

## Чтение кода

```ts
type ArrayItem<Value> = Value extends Array<infer Item> ? Item : never;

type User = ArrayItem<Array<{ id: string }>>;
```

Какой тип получает `User`?

## Предскажите результат проверки

```ts
type PromiseValue<Value> = Value extends Promise<infer Result>
  ? Result
  : Value;

type A = PromiseValue<Promise<string>>;
type B = PromiseValue<number>;
```

Какие типы получают `A` и `B`?

## Анализ типа

Почему `infer` должен находиться внутри шаблона conditional type?

## Задание на отладку

Исправьте тип:

```ts
type Bad<Value> = infer Value;
```

Сделайте helper для извлечения элемента массива.

## Задание Automation QA

Создайте `AsyncResult<Fn>`, который извлекает значение из `Promise`, возвращаемого async helper-функцией.

## Мини-проект

Создайте `FunctionResult<Fn>`, который извлекает return type функции.
