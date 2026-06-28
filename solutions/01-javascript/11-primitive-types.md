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

Assertions compare значения, not variable names.

### 2. Почему primitive and object значения

Ответ:

JavaScript separates fundamental indivisible значения from structured object значения.

Объяснение:

Primitive значения are atomic in this mental model; objects behave differently and will be studied later.

Распространённая ошибка:

Use object поведение to explain primitives.

Связь с Automation QA:

API responses contain both primitive поля and structured objects.

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

Number represents numeric значения like `200`, `30`, `19.99`.

Объяснение:

JavaScript uses Number for integer-like and fractional numeric значения.

Распространённая ошибка:

Treat numeric string `"200"` as Number.

Связь с Automation QA:

HTTP status code from API is usually Number.

### 6. String

Ответ:

String represents text значения.

Объяснение:

`'Anna'`, `'active'`, `'200'` are strings.

Распространённая ошибка:

Confuse visually numeric string with number.

Связь с Automation QA:

UI text is often String even when it looks like a number.

### 7. Boolean

Ответ:

Boolean has two значения: `true` and `false`.

Объяснение:

It represents flags and yes/no состояния.

Распространённая ошибка:

Use string `"true"` вместо Boolean `true`.

Связь с Automation QA:

API поля like `active` often are Boolean.

### 8. Undefined vs Null

Ответ:

`undefined` often means not assigned or missing. `null` usually means intentional absence.

Объяснение:

They are different primitive значения with different meanings.

Распространённая ошибка:

Treat both as same "nothing".

Связь с Automation QA:

API may intentionally return `null`; JSON does not represent `undefined`.

### 9. Symbol

Ответ:

Symbol creates unique primitive значения.

Объяснение:

`Symbol('id')` and `Symbol('id')` are different значения.

Распространённая ошибка:

Think same description means same Symbol.

Связь с Automation QA:

Less common in tests, but may appear in libraries.

### 10. BigInt

Ответ:

BigInt represents large integer значения.

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

It helps inspect значения, but has historical поведение for `null`.

Распространённая ошибка:

Trust `typeof null` as proof that null is object.

Связь с Automation QA:

Useful when debugging unexpected API response значения.

### 12. Primitive immutability

Ответ:

Primitive value itself cannot be changed internally.

Объяснение:

Reassignment points identifier to another primitive value; it does not mutate old value.

Распространённая ошибка:

Confuse reassignment with mutation.

Связь с Automation QA:

Helps reason about expected значения in tests.

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

Каждый literal относится к primitive category.

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

This is common when comparing UI text and API response значения.

## Задачи на отладку

### Задача 1

Ответ:

`expectedStatusCode` is Number, `actualStatusCode` is String.

Объяснение:

They look similar but are different primitive types.

Распространённая ошибка:

Compare visual вывод вместо value type.

Связь с Automation QA:

UI text often needs explicit parsing or string expectation.

### Задача 2

Ответ:

Expected should be `null`, not `undefined`, because API intentionally returns JSON `null`.

Объяснение:

JSON has `null`, but not `undefined`.

Распространённая ошибка:

Use undefined for all absent значения.

Связь с Automation QA:

Correct API validation depends on distinguishing null from missing поля.

### Задача 3

Ответ:

`typeof null` returns `"object"` due to historical поведение. `null` remains primitive.

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

Each JSON поле maps to a primitive value after parsing.

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

Mix UI and API значения without conversion plan.

Связь с Automation QA:

Cross-layer tests often compare UI text and backend значения.

### Сценарий 3

Ответ:

Large IDs are often stored as String to avoid numeric precision issues and preserve exact representation.

Объяснение:

BigInt exists, but APIs often serialize IDs как строки.

Распространённая ошибка:

Treat every numeric-looking ID as Number.

Связь с Automation QA:

IDs should usually be compared exactly, often как строки.

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

Таблица:

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

The project shows primitive значения and the limitation of `typeof null`.

Распространённая ошибка:

Mark `deletedAt` as Object because typeof result is `"object"`.

Связь с Automation QA:

This table format is useful for API response validation design.

## Возможные улучшения

После выполнения практики можно:

* take one API response and classify all primitive поля;
* compare UI text значения with API primitive значения;
* add explicit expected value types to test cases;
* return to this chapter before Object Type.
