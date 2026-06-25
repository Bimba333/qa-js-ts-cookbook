# Решения. Глава 18. Type Conversion

## Концептуальные вопросы

### 1. Why type conversion exists

Ответ:

Type conversion exists because operations often expect one type but receive another.

Рассуждение:

Values come from APIs, forms, env variables and code. Their types may not match operation expectation.

Типичная ошибка:

Think conversion happens randomly.

Automation QA connection:

Tests frequently receive strings where they need numbers or booleans.

### 2. Operation expectation

Ответ:

It means every operation works best with certain value types.

Рассуждение:

Subtraction expects numeric values. Text building expects string values. Conditions use Boolean conversion.

Типичная ошибка:

Look only at input values, not at operation.

Automation QA connection:

Assertions fail when expected type and actual type are different.

### 3. Implicit conversion

Ответ:

Implicit conversion is automatic conversion triggered by JavaScript operation.

Рассуждение:

`'5' - 1` converts `'5'` to Number because subtraction expects Number.

Типичная ошибка:

Assume implicit means random.

Automation QA connection:

Hidden implicit conversion can hide bugs in tests.

### 4. Explicit conversion

Ответ:

Explicit conversion is conversion requested by programmer through `Number()`, `String()` or `Boolean()`.

Рассуждение:

It makes intent visible.

Типичная ошибка:

Rely on tricks like subtracting zero instead of clear conversion.

Automation QA connection:

Explicit conversion makes test setup easier to review.

### 5. Why explicit conversion is better in tests

Ответ:

It documents expected type and prevents hidden behavior.

Рассуждение:

`Number(retriesFromEnv)` is clearer than relying on an operation to convert.

Типичная ошибка:

Let assertion or operation perform conversion implicitly.

Automation QA connection:

Readable tests fail with clearer reasons.

### 6. `Number()`

Ответ:

`Number()` converts value to Number or produces `NaN` if meaningful numeric conversion is impossible.

Рассуждение:

`Number('5')` gives `5`; `Number('abc')` gives `NaN`.

Типичная ошибка:

Assume every string can become useful number.

Automation QA connection:

Parsing API numeric fields needs validation.

### 7. `NaN`

Ответ:

`NaN` appears when Number conversion cannot produce meaningful numeric value.

Рассуждение:

`Number(undefined)` and `Number('abc')` are examples.

Типичная ошибка:

Ignore `NaN` and continue numeric calculation.

Automation QA connection:

`NaN` often reveals wrong response field or wrong parsing.

### 8. `String()`

Ответ:

`String()` converts value to string representation.

Рассуждение:

`String(200)` becomes `'200'`; `String(null)` becomes `'null'`.

Типичная ошибка:

Think `null` becomes empty string.

Automation QA connection:

Useful when filling text fields or building readable logs.

### 9. `Boolean()`

Ответ:

`Boolean()` converts value according to truthy/falsy rules.

Рассуждение:

Non-empty strings are truthy; empty string is falsy.

Типичная ошибка:

Expect `Boolean('false')` to be false.

Automation QA connection:

Env variables like `'false'` need explicit parsing.

### 10. Truthy

Ответ:

Truthy value becomes `true` in Boolean conversion.

Рассуждение:

Examples: `'hello'`, `'false'`, `1`, `{}`, `[]`.

Типичная ошибка:

Treat truthy as semantically true.

Automation QA connection:

Non-empty UI text is truthy even if it says `"false"`.

### 11. Falsy

Ответ:

Falsy value becomes `false` in Boolean conversion.

Рассуждение:

Examples: `false`, `0`, `''`, `null`, `undefined`, `NaN`.

Типичная ошибка:

Think all empty-looking values behave the same in every context.

Automation QA connection:

Missing API fields can become falsy through Boolean conversion.

### 12. Conversion is not random

Ответ:

Conversion follows language rules based on what type operation expects.

Рассуждение:

Same value can be converted differently in different operations because operations expect different types.

Типичная ошибка:

Memorize outputs without understanding operation expectation.

Automation QA connection:

Understanding rules helps debug failures faster.

### 13. Equality chapter

Ответ:

Equality has separate comparison rules and should be studied independently.

Рассуждение:

Conversions may appear in comparisons, but equality algorithms are not this chapter's topic.

Типичная ошибка:

Mix conversion rules with equality behavior too early.

Automation QA connection:

Assertions require careful comparison strategy.

## Identify conversions

### Задача 1

Ответ:

Explicit conversion. `Number()` expects numeric conversion. Result: `200`.

Рассуждение:

String `'200'` can become Number `200`.

Типичная ошибка:

Keep status code as string when numeric assertion expects number.

Automation QA connection:

API may return status code as string.

### Задача 2

Ответ:

Explicit conversion. `String()` expects string representation. Result: `'false'`.

Рассуждение:

Boolean false becomes string text `'false'`.

Типичная ошибка:

Expect empty string.

Automation QA connection:

Useful in logs and form fields.

### Задача 3

Ответ:

Explicit conversion. `Boolean()` applies truthy/falsy rules. Result: `false`.

Рассуждение:

Empty string is falsy.

Типичная ошибка:

Treat every string as truthy without checking empty string.

Automation QA connection:

Empty form input can become false in Boolean conversion.

### Задача 4

Ответ:

Implicit conversion. Subtraction expects Number. Result: `4`.

Рассуждение:

`'5'` becomes Number `5`.

Типичная ошибка:

Expect string operation.

Automation QA connection:

Numeric calculations from string API values may appear to work implicitly.

### Задача 5

Ответ:

Implicit conversion. With string operand, `+` produces string concatenation here. Result: `'51'`.

Рассуждение:

Number `1` is adapted to string context.

Типичная ошибка:

Expect numeric addition.

Automation QA connection:

Bug with env values: `'3' + 1` becomes `'31'`.

## Predict the output before running

### Задача 1

Ответ:

```text
5
0
NaN
NaN
0
```

Рассуждение:

Numeric strings convert to numbers. Empty string and `null` convert to `0`. Non-numeric string and `undefined` produce `NaN`.

Типичная ошибка:

Expect empty string to produce `NaN`.

Automation QA connection:

Input parsing should handle empty and invalid values intentionally.

### Задача 2

Ответ:

```text
200
true
null
undefined
```

Рассуждение:

These are string representations, even if console output may not show quotes.

Типичная ошибка:

Forget result type is String.

Automation QA connection:

String conversion is useful for UI text values.

### Задача 3

Ответ:

```text
true
true
false
false
true
false
```

Рассуждение:

Non-empty strings are truthy. Empty string, zero and `NaN` are falsy.

Типичная ошибка:

Expect `'false'` or `'0'` to be false.

Automation QA connection:

Env strings are dangerous for Boolean conversion.

### Задача 4

Ответ:

```text
51
4
10
```

Рассуждение:

`+` with string creates string result here. `-` and `*` expect Number.

Типичная ошибка:

Assume all arithmetic-like operators behave same with strings.

Automation QA connection:

Hidden conversion bugs often appear in calculations from API strings.

## Truthy / Falsy exercises

Ответ:

Truthy:

```text
true
1
"hello"
"false"
"0"
[]
{}
```

Falsy:

```text
false
0
""
null
undefined
NaN
```

Рассуждение:

Boolean conversion follows fixed truthy/falsy rules.

Типичная ошибка:

Think empty array or empty object is falsy.

Automation QA connection:

Empty response objects or arrays are still truthy.

## Code reading

Ответ:

Hidden conversion: `retriesFromEnv + 1` creates string concatenation behavior.

Explicit conversion: `Boolean(headlessFromEnv)`.

Bug: `retryCount` becomes `'31'`; `headless` becomes `true`.

Clearer version:

```javascript
const retriesFromEnv = '3';
const headlessFromEnv = 'false';

const retryCount = Number(retriesFromEnv) + 1;
const booleanTextMap = {
  true: true,
  false: false,
};

const headless = booleanTextMap[headlessFromEnv];

console.log(retryCount);
console.log(headless);
```

Рассуждение:

The config values are strings. They must be parsed according to intended type.

Типичная ошибка:

Use `Boolean('false')`.

Automation QA connection:

Environment parsing is a common source of test config bugs.

## Debugging tasks

### Задача 1

Ответ:

Problem: `retriesFromEnv` is String, and `+` produces string concatenation here.

Fix:

```javascript
const retriesFromEnv = '3';
const nextRetry = Number(retriesFromEnv) + 1;

console.log(nextRetry);
```

Рассуждение:

Numeric addition expects Number values.

Типичная ошибка:

Assume numeric-looking string is Number.

Automation QA connection:

Env variables are strings.

### Задача 2

Ответ:

`Boolean('false')` is `true` because `'false'` is non-empty string.

Better parsing:

```javascript
const headlessFromEnv = 'false';
const booleanTextMap = {
  true: true,
  false: false,
};

const headless = booleanTextMap[headlessFromEnv];
```

Рассуждение:

Boolean conversion checks truthiness, not semantic meaning of text.

Типичная ошибка:

Treat string content `"false"` as Boolean false.

Automation QA connection:

Can invert browser launch settings in test runs.

### Задача 3

Ответ:

Output:

```text
NaN
```

Рассуждение:

`'not available'` cannot be converted to meaningful Number.

Типичная ошибка:

Ignore invalid numeric field.

Automation QA connection:

API response validation should catch invalid numeric data.

## QA-oriented tasks

### Сценарий 1

Ответ:

```javascript
const response = {
  statusCode: '200',
};

const statusCode = Number(response.statusCode);
```

Рассуждение:

Test expects numeric status code, but API field is String.

Типичная ошибка:

Compare visually similar values without type awareness.

Automation QA connection:

API contract may represent numbers as strings.

### Сценарий 2

Ответ:

```javascript
const ageFromInput = '30';
const age = Number(ageFromInput);
const nextAge = age + 1;
```

Рассуждение:

Form values are often strings; numeric calculation expects Number.

Типичная ошибка:

Use `ageFromInput + 1` and get `'301'`.

Automation QA connection:

UI automation often reads text input values.

### Сценарий 3

Ответ:

```javascript
const retriesFromEnv = '2';
const headlessFromEnv = 'false';

const retries = Number(retriesFromEnv);
const booleanTextMap = {
  true: true,
  false: false,
};

const headless = booleanTextMap[headlessFromEnv];
```

Рассуждение:

Retries needs Number. Headless needs explicit semantic parsing.

Типичная ошибка:

Use `Boolean(headlessFromEnv)`.

Automation QA connection:

Correct config parsing prevents wrong browser mode and retry count.

### Сценарий 4

Ответ:

Checklist:

```text
1. What source produced the value?
2. What is the current type?
3. What type does operation expect?
4. Is conversion implicit or explicit?
5. Can Number conversion produce NaN?
6. Is Boolean conversion affected by non-empty strings?
7. Are env variables parsed intentionally?
8. Are form values converted before numeric operations?
```

Рассуждение:

Most conversion bugs come from mismatch between received type and expected operation type.

Типичная ошибка:

Debug final assertion without checking input types.

Automation QA connection:

Useful for API, UI and Playwright config debugging.

## Mini-project

Возможное решение:

```javascript
const rawConfig = {
  retries: '3',
  headless: 'false',
  timeoutMs: '5000',
  baseUrl: 'https://example.com',
};

const parsedConfig = {
  retries: Number(rawConfig.retries),
  headless: {
    true: true,
    false: false,
  }[rawConfig.headless],
  timeoutMs: Number(rawConfig.timeoutMs),
  baseUrl: String(rawConfig.baseUrl),
};

console.log(rawConfig);
console.log(parsedConfig);

console.log(typeof parsedConfig.retries);
console.log(typeof parsedConfig.headless);
console.log(typeof parsedConfig.timeoutMs);
console.log(typeof parsedConfig.baseUrl);
```

Report:

```text
Property  | Raw value             | Raw type | Parsed value          | Parsed type | Why conversion is needed
--------- | --------------------- | -------- | --------------------- | ----------- | -------------------------
retries   | "3"                   | string   | 3                     | number      | retry count is numeric
headless  | "false"               | string   | false                 | boolean     | browser mode is boolean
timeoutMs | "5000"                | string   | 5000                  | number      | timeout calculation
baseUrl   | "https://example.com" | string   | "https://example.com" | string      | URL remains text
```

Рассуждение:

Raw config simulates env values. Parsed config makes intended types explicit.

Типичная ошибка:

Use `Boolean(rawConfig.headless)` and get `true`.

Automation QA connection:

This is the foundation of reliable framework configuration parsing.
