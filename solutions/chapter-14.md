# Решения. Глава 14. Primitive Types

## Концептуальные вопросы

### 1. Что такое value

Ответ:

Value — actual information, с которой работает JavaScript.

Рассуждение:

Identifier gives access, but value is the information itself: `200`, `'Anna'`, `true`.

Типичная ошибка:

Путать identifier and value.

Automation QA connection:

Assertions compare values, not variable names.

### 2. Почему primitive and object values

Ответ:

JavaScript separates fundamental indivisible values from structured object values.

Рассуждение:

Primitive values are atomic in this mental model; objects behave differently and will be studied later.

Типичная ошибка:

Use object behavior to explain primitives.

Automation QA connection:

API responses contain both primitive fields and structured objects.

### 3. Primitive value

Ответ:

Primitive value is fundamental indivisible value.

Рассуждение:

`30`, `'active'`, `true`, `null` are not treated as structures in this chapter.

Типичная ошибка:

Think primitives are just tiny objects.

Automation QA connection:

Primitive assertions are the base of most tests.

### 4. Primitive types

Ответ:

Number, String, Boolean, Undefined, Null, Symbol, BigInt.

Рассуждение:

These are the seven primitive types in JavaScript.

Типичная ошибка:

Forget Null because `typeof null` returns `"object"`.

Automation QA connection:

Knowing all primitive types helps read data from APIs and libraries.

### 5. Number

Ответ:

Number represents numeric values like `200`, `30`, `19.99`.

Рассуждение:

JavaScript uses Number for integer-like and fractional numeric values.

Типичная ошибка:

Treat numeric string `"200"` as Number.

Automation QA connection:

HTTP status code from API is usually Number.

### 6. String

Ответ:

String represents text values.

Рассуждение:

`'Anna'`, `'active'`, `'200'` are strings.

Типичная ошибка:

Confuse visually numeric string with number.

Automation QA connection:

UI text is often String even when it looks like a number.

### 7. Boolean

Ответ:

Boolean has two values: `true` and `false`.

Рассуждение:

It represents flags and yes/no states.

Типичная ошибка:

Use string `"true"` instead of Boolean `true`.

Automation QA connection:

API fields like `active` often are Boolean.

### 8. Undefined vs Null

Ответ:

`undefined` often means not assigned or missing. `null` usually means intentional absence.

Рассуждение:

They are different primitive values with different meanings.

Типичная ошибка:

Treat both as same "nothing".

Automation QA connection:

API may intentionally return `null`; JSON does not represent `undefined`.

### 9. Symbol

Ответ:

Symbol creates unique primitive values.

Рассуждение:

`Symbol('id')` and `Symbol('id')` are different values.

Типичная ошибка:

Think same description means same Symbol.

Automation QA connection:

Less common in tests, but may appear in libraries.

### 10. BigInt

Ответ:

BigInt represents large integer values.

Рассуждение:

BigInt literal ends with `n`, for example `10n`.

Типичная ошибка:

Mix Number and BigInt casually.

Automation QA connection:

Large IDs may be represented as BigInt or String depending on API.

### 11. typeof

Ответ:

`typeof` returns a string with type category.

Рассуждение:

It helps inspect values, but has historical behavior for `null`.

Типичная ошибка:

Trust `typeof null` as proof that null is object.

Automation QA connection:

Useful when debugging unexpected API response values.

### 12. Primitive immutability

Ответ:

Primitive value itself cannot be changed internally.

Рассуждение:

Reassignment points identifier to another primitive value; it does not mutate old value.

Типичная ошибка:

Confuse reassignment with mutation.

Automation QA connection:

Helps reason about expected values in tests.

## Identify primitive types

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

Рассуждение:

Each literal belongs to a primitive category.

Типичная ошибка:

Classify `deletedAt` by `typeof null` as object.

Automation QA connection:

Same classification is used for API assertions.

## Predict typeof

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

Рассуждение:

`typeof null` returns `"object"` historically, despite null being primitive.

Типичная ошибка:

Expect `typeof null` to be `"null"`.

Automation QA connection:

`typeof` can help debug, but must be interpreted carefully.

## Code reading

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

Рассуждение:

Value appearance does not determine type by visual similarity alone.

Типичная ошибка:

Treat `"200"` as Number.

Automation QA connection:

This is common when comparing UI text and API response values.

## Debugging tasks

### Задача 1

Ответ:

`expectedStatusCode` is Number, `actualStatusCode` is String.

Рассуждение:

They look similar but are different primitive types.

Типичная ошибка:

Compare visual output instead of value type.

Automation QA connection:

UI text often needs explicit parsing or string expectation.

### Задача 2

Ответ:

Expected should be `null`, not `undefined`, because API intentionally returns JSON `null`.

Рассуждение:

JSON has `null`, but not `undefined`.

Типичная ошибка:

Use undefined for all absent values.

Automation QA connection:

Correct API validation depends on distinguishing null from missing fields.

### Задача 3

Ответ:

`typeof null` returns `"object"` due to historical behavior. `null` remains primitive.

Рассуждение:

`typeof` result is not a perfect conceptual taxonomy for `null`.

Типичная ошибка:

Build object mental model around null.

Automation QA connection:

Avoid wrong assertions based only on `typeof`.

## QA-oriented tasks

### Сценарий 1

Ответ:

```text
expectedName      → "Anna" → String
expectedAge       → 30 → Number
expectedActive    → true → Boolean
expectedDeletedAt → null → Null
```

Рассуждение:

Each JSON field maps to a primitive value after parsing.

Типичная ошибка:

Expect age as `"30"` because UI displays it as text.

Automation QA connection:

API response validation should preserve expected types.

### Сценарий 2

Ответ:

UI text `"200"` is String. API value `200` is Number.

Рассуждение:

Assertions should either compare string with string or number with number intentionally.

Типичная ошибка:

Mix UI and API values without conversion plan.

Automation QA connection:

Cross-layer tests often compare UI text and backend values.

### Сценарий 3

Ответ:

Large IDs are often stored as String to avoid numeric precision issues and preserve exact representation.

Рассуждение:

BigInt exists, but APIs often serialize IDs as strings.

Типичная ошибка:

Treat every numeric-looking ID as Number.

Automation QA connection:

IDs should usually be compared exactly, often as strings.

## Mini-project

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

Рассуждение:

The project shows primitive values and the limitation of `typeof null`.

Типичная ошибка:

Mark `deletedAt` as Object because typeof result is `"object"`.

Automation QA connection:

This table format is useful for API response validation design.

## Возможные улучшения

После выполнения практики можно:

* take one API response and classify all primitive fields;
* compare UI text values with API primitive values;
* add explicit expected value types to test cases;
* return to this chapter before Object Type.
