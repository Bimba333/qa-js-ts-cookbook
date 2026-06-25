# Практика. Глава 14. Primitive Types

## Концептуальные вопросы

Ответьте своими словами.

1. Что такое value?
2. Почему JavaScript divides values into primitive and object values?
3. Что такое primitive value?
4. Какие primitive types есть в JavaScript?
5. Что представляет Number?
6. Что представляет String?
7. Что представляет Boolean?
8. Чем `undefined` отличается от `null`?
9. Что такое Symbol на базовом уровне?
10. Что такое BigInt на базовом уровне?
11. Что показывает `typeof`?
12. Что означает immutability of primitive values?

## Identify primitive types

Для каждого value укажите primitive type.

```javascript
const statusCode = 200;
const userName = 'Anna';
const isActive = true;
const deletedAt = null;
let responseBody;
const uniqueId = Symbol('id');
const largeId = 9007199254740993n;
```

## Predict typeof

Перед запуском предскажите результат.

```javascript
console.log(typeof 200);
console.log(typeof '200');
console.log(typeof false);
console.log(typeof undefined);
console.log(typeof null);
console.log(typeof Symbol('id'));
console.log(typeof 10n);
```

## Code reading

Прочитайте код и ответьте:

1. Какие values являются Number?
2. Какие values являются String?
3. Какие values являются Boolean?
4. Где intentional absence?
5. Где missing / not assigned value?

```javascript
const expectedStatusCode = 200;
const actualStatusCode = '200';
const expectedUserName = 'Anna';
const isUserActive = true;
const deletedAt = null;
let responseTime;
```

## Debugging tasks

### Задача 1

Тест ожидал number, но actual value оказался string.

```javascript
const expectedStatusCode = 200;
const actualStatusCode = '200';
```

Объясните проблему.

### Задача 2

Инженер написал:

```javascript
const deletedAt = undefined;
```

Но API возвращает:

```json
{
  "deletedAt": null
}
```

Объясните, почему expected value выбран неверно.

### Задача 3

Инженер делает вывод:

```text
typeof null is "object", so null is object.
```

Исправьте объяснение.

## QA-oriented tasks

### Сценарий 1

API response:

```json
{
  "name": "Anna",
  "age": 30,
  "active": true,
  "deletedAt": null
}
```

Выпишите expected values and primitive types for assertions.

### Сценарий 2

UI показывает status code as text `"200"`, API возвращает status code as number `200`.

Объясните, почему assertions должны учитывать type.

### Сценарий 3

Тестовые данные:

```javascript
const expectedId = '9007199254740993';
```

Почему large ID часто хранится as String in tests?

## Mini-project

Создайте файл:

```text
playground/primitive-values-report.js
```

В нем должно быть:

* Number value `statusCode`;
* String value `userName`;
* Boolean value `isActive`;
* Null value `deletedAt`;
* Undefined value `optionalComment`;
* BigInt value `largeOrderId`;
* вывод каждого value;
* вывод `typeof` для каждого value.

После кода составьте таблицу:

```text
Identifier | Value | Primitive type | typeof result | QA meaning
```
