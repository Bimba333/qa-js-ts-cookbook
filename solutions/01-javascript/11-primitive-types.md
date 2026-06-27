# Решения. Глава 14. Primitive Types

## Концептуальные вопросы

### 1. Что такое value

Ответ:

Value — actual information, с которой работает JavaScript.

Объяснение:

Identifier gives access, but value is the information itself: `200`, `'Anna'`, `true`.

Распространённая ошибка:

Путать identifier and value.

Связь с Automation QA:

Assertions compare values, not variable names.

### 2. Почему primitive and object values

Ответ:

JavaScript separates fundamental indivisible values from structured object values.

Объяснение:

Primitive values are atomic in this mental model; objects behave differently and will be studied later.

Распространённая ошибка:

Use object behavior to explain primitives.

Связь с Automation QA:

API responses contain both primitive fields and structured objects.

### 3. Primitive value

Ответ:

Primitive value is fundamental indivisible value.

Объяснение:

`30`, `'active'`, `true`, `null` are not treated as structures in this chapter.

Распространённая ошибка:

Think primitives are just tiny objects.

Связь с Automation QA:

Primitive assertions are the base of most tests.

### 4. Primitive types

Ответ:

Number, String, Boolean, Undefined, Null, Symbol, BigInt.

Объяснение:

These are the seven primitive types in JavaScript.

Распространённая ошибка:

Forget Null because `typeof null` returns `"object"`.

Связь с Automation QA:

Knowing all primitive types helps read data from APIs and libraries.

### 5. Number

Ответ:

Number represents numeric values like `200`, `30`, `19.99`.

Объяснение:

JavaScript uses Number for integer-like and fractional numeric values.

Распространённая ошибка:

Treat numeric string `"200"` as Number.

Связь с Automation QA:

HTTP status code from API is usually Number.

### 6. String

Ответ:

String represents text values.

Объяснение:

`'Anna'`, `'active'`, `'200'` are strings.

Распространённая ошибка:

Confuse visually numeric string with number.

Связь с Automation QA:

UI text is often String even when it looks like a number.

### 7. Boolean

Ответ:

Boolean has two values: `true` and `false`.

Объяснение:

It represents flags and yes/no states.

Распространённая ошибка:

Use string `"true"` instead of Boolean `true`.

Связь с Automation QA:

API fields like `active` often are Boolean.

### 8. Undefined vs Null

Ответ:

`undefined` often means not assigned or missing. `null` usually means intentional absence.

Объяснение:

They are different primitive values with different meanings.

Распространённая ошибка:

Treat both as same "nothing".

Связь с Automation QA:

API may intentionally return `null`; JSON does not represent `undefined`.

### 9. Symbol

Ответ:

Symbol creates unique primitive values.

Объяснение:

`Symbol('id')` and `Symbol('id')` are different values.

Распространённая ошибка:

Think same description means same Symbol.

Связь с Automation QA:

Less common in tests, but may appear in libraries.

### 10. BigInt

Ответ:

BigInt represents large integer values.

Объяснение:

BigInt literal ends with `n`, for example `10n`.

Распространённая ошибка:

Mix Number and BigInt casually.

Связь с Automation QA:

Large IDs may be represented as BigInt or String depending on API.

### 11. typeof

Ответ:

`typeof` returns a string with type category.

Объяснение:

It helps inspect values, but has historical behavior for `null`.

Распространённая ошибка:

Trust `typeof null` as proof that null is object.

Связь с Automation QA:

Useful when debugging unexpected API response values.

### 12. Primitive immutability

Ответ:

Primitive value itself cannot be changed internally.

Объяснение:

Reassignment points identifier to another primitive value; it does not mutate old value.

Распространённая ошибка:

Confuse reassignment with mutation.

Связь с Automation QA:

Helps reason about expected values in tests.

## Определите primitive types

Ответ:

```text
statusCode   → Number
userName     → String
isActive     → Boolean
deletedAt    → Null
responseBody → Undefined before assignment
uniqueId     → Symbol
largeId      → BigInt
```

Объяснение:

Each literal belongs to a primitive category.

Распространённая ошибка:

Classify `deletedAt` by `typeof null` as object.

Связь с Automation QA:

Same classification is used for API assertions.

## Предскажите typeof

Ответ:

```text
number
string
boolean
undefined
object
symbol
bigint
```

Объяснение:

`typeof null` returns `"object"` historically, despite null being primitive.

Распространённая ошибка:

Expect `typeof null` to be `"null"`.

Связь с Automation QA:

`typeof` can help debug, but must be interpreted carefully.

## Чтение кода

Ответ:

Number:

```text
expectedStatusCode → 200
```

String:

```text
actualStatusCode → "200"
expectedUserName → "Anna"
```

Boolean:

```text
isUserActive → true
```

Intentional absence:

```text
deletedAt → null
```

Missing / not assigned:

```text
responseTime → undefined before assignment
```

Объяснение:

Value appearance does not determine type by visual similarity alone.

Распространённая ошибка:

Treat `"200"` as Number.

Связь с Automation QA:

This is common when comparing UI text and API response values.

## Задачи на отладку

### Задача 1

Ответ:

`expectedStatusCode` is Number, `actualStatusCode` is String.

Объяснение:

They look similar but are different primitive types.

Распространённая ошибка:

Compare visual output instead of value type.

Связь с Automation QA:

UI text often needs explicit parsing or string expectation.

### Задача 2

Ответ:

Expected should be `null`, not `undefined`, because API intentionally returns JSON `null`.

Объяснение:

JSON has `null`, but not `undefined`.

Распространённая ошибка:

Use undefined for all absent values.

Связь с Automation QA:

Correct API validation depends on distinguishing null from missing fields.

### Задача 3

Ответ:

`typeof null` returns `"object"` due to historical behavior. `null` remains primitive.

Объяснение:

`typeof` result is not a perfect conceptual taxonomy for `null`.

Распространённая ошибка:

Build object mental model around null.

Связь с Automation QA:

Avoid wrong assertions based only on `typeof`.

## QA-задачи

### Сценарий 1

Ответ:

```text
expectedName      → "Anna" → String
expectedAge       → 30 → Number
expectedActive    → true → Boolean
expectedDeletedAt → null → Null
```

Объяснение:

Each JSON field maps to a primitive value after parsing.

Распространённая ошибка:

Expect age as `"30"` because UI displays it as text.

Связь с Automation QA:

API response validation should preserve expected types.

### Сценарий 2

Ответ:

UI text `"200"` is String. API value `200` is Number.

Объяснение:

Assertions should either compare string with string or number with number intentionally.

Распространённая ошибка:

Mix UI and API values without conversion plan.

Связь с Automation QA:

Cross-layer tests often compare UI text and backend values.

### Сценарий 3

Ответ:

Large IDs are often stored as String to avoid numeric precision issues and preserve exact representation.

Объяснение:

BigInt exists, but APIs often serialize IDs as strings.

Распространённая ошибка:

Treat every numeric-looking ID as Number.

Связь с Automation QA:

IDs should usually be compared exactly, often as strings.

## Мини-проект

Один из вариантов:

```javascript
const statusCode = 200;
const userName = 'Anna';
const isActive = true;
const deletedAt = null;
let optionalComment;
const largeOrderId = 9007199254740993n;

console.log(statusCode, typeof statusCode);
console.log(userName, typeof userName);
console.log(isActive, typeof isActive);
console.log(deletedAt, typeof deletedAt);
console.log(optionalComment, typeof optionalComment);
console.log(largeOrderId, typeof largeOrderId);
```

Table:

```text
Identifier      | Value              | Primitive type | typeof result | QA meaning
statusCode      | 200                | Number         | number        | HTTP status
userName        | "Anna"             | String         | string        | user data
isActive        | true               | Boolean        | boolean       | user flag
deletedAt       | null               | Null           | object        | intentional absence
optionalComment | undefined          | Undefined      | undefined     | not assigned
largeOrderId    | 9007199254740993n  | BigInt         | bigint        | large ID
```

Объяснение:

The project shows primitive values and the limitation of `typeof null`.

Распространённая ошибка:

Mark `deletedAt` as Object because typeof result is `"object"`.

Связь с Automation QA:

This table format is useful for API response validation design.

## Возможные улучшения

После выполнения практики можно:

* take one API response and classify all primitive fields;
* compare UI text values with API primitive values;
* add explicit expected value types to test cases;
* return to this chapter before Object Type.
