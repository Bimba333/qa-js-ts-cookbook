# Практика: Primitive Types

## Концептуальные вопросы

1. Какие TypeScript-типы соответствуют строке, числу и boolean?
2. Почему обычно пишут `string`, а не `String`?
3. Что описывает `undefined`?
4. Что описывает `null`?
5. Какие значения описывают `bigint` и `symbol`?
6. Почему TypeScript не меняет runtime-значения?

## Чтение кода

Определите типы переменных.

```typescript
const baseUrl = 'https://api.example.test';
const timeoutMs = 3000;
const debug = false;
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
const statusCode: number = 200;
const statusText: string = 'OK';
const passed: boolean = true;
```

## Задание на отладку

Найдите проблему.

```typescript
const timeoutMs: number = '5000';
const headless: boolean = 'true';
```

## Задание Automation QA

Опишите типы для config:

* `baseUrl`;
* `retries`;
* `headless`;
* `reportName`.

## Мини-проект

Создайте набор переменных для test run metadata:

* название проекта;
* номер запуска;
* признак CI;
* значение окружения, которое пока не задано.

Добавьте к каждой переменной подходящий тип.
