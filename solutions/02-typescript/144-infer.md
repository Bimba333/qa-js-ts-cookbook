# Решения: infer

## Концептуальные вопросы

### Ответ

`infer` используется внутри conditional type. Он не создает переменную во время выполнения. Обычный вывод generic-типа выводит аргумент типа при использовании generic, а `infer` извлекает часть типа из структуры.

### Объяснение

`infer` работает только в шаблоне на уровне типов.

### Типичная ошибка

Писать `infer` вне conditional type.

### Связь с Automation QA

Так можно извлекать типы результатов helper-функций.

## Чтение кода

### Ответ

`User` получает тип `{ id: string }`.

### Объяснение

`ArrayItem` извлекает тип элемента массива.

### Типичная ошибка

Ожидать, что `User` будет массивом.

### Связь с Automation QA

Так можно получать тип одного элемента из списка тестовых данных.

## Предскажите результат проверки

### Ответ

`A` получает `string`, `B` получает `number`.

### Объяснение

Для `Promise<string>` извлекается значение `string`. Для `number` применяется запасной вариант `Value`.

### Типичная ошибка

Думать, что запасной вариант всегда `never`.

### Связь с Automation QA

Async helpers можно разворачивать до типа фактического результата.

## Анализ типа

### Ответ

`infer` нужен внутри шаблона, чтобы TypeScript понял, какую часть структуры нужно извлечь.

### Объяснение

Без conditional type нет структуры для сопоставления.

### Типичная ошибка

Использовать `infer` как объявление обычного типа.

### Связь с Automation QA

Это полезно для типизации helper APIs, но не должно превращаться в сложную магию.

## Задание на отладку

### Ответ

```ts
type ArrayItem<Value> = Value extends Array<infer Item>
  ? Item
  : never;
```

### Объяснение

`infer Item` находится внутри шаблона conditional type.

### Типичная ошибка

Писать `infer` без `extends`.

### Связь с Automation QA

Тип элемента массива часто нужен для test data collections.

## Задание Automation QA

### Ответ

```ts
type AsyncResult<Fn> = Fn extends (...args: never[]) => Promise<infer Result>
  ? Result
  : never;

async function loadReport() {
  return {
    title: "Smoke",
    passed: true,
  };
}

type Report = AsyncResult<typeof loadReport>;
```

### Объяснение

TypeScript сопоставляет функцию с async function shape и извлекает `Result`.

### Типичная ошибка

Пытаться извлечь `Promise` целиком вместо его значения.

### Связь с Automation QA

Так можно типизировать результат async report helper.

## Мини-проект

### Ответ

```ts
type FunctionResult<Fn> = Fn extends (...args: never[]) => infer Result
  ? Result
  : never;

function buildUser() {
  return {
    id: "u-1",
    email: "qa@example.com",
  };
}

type User = FunctionResult<typeof buildUser>;
```

### Объяснение

`infer Result` извлекает return type функции.

### Типичная ошибка

Передать не function type и ожидать полезный результат.

### Связь с Automation QA

Это связывает тип результата с реальным helper.
