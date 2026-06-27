# Решения. Глава 19. Equality

## Концептуальные вопросы

### 1. Why equality is needed

Ответ:

Equality is needed to decide whether two values match according to a chosen comparison rule.

Объяснение:

Programs compare API values, user roles, status codes, parsed configuration and object identity.

Распространённая ошибка:

Think equality has one universal meaning.

Связь с Automation QA:

Assertions are comparisons.

### 2. Why multiple equality operators

Ответ:

Because JavaScript supports comparison with conversion, comparison without conversion and special exact comparison through `Object.is()`.

Объяснение:

Different operators answer different questions.

Распространённая ошибка:

Think `==` and `===` differ only by style.

Связь с Automation QA:

Choosing wrong operator can hide bugs.

### 3. What `==` asks

Ответ:

`==` asks: can these values become comparable?

Объяснение:

It may perform conversion before comparison.

Распространённая ошибка:

Use `==` accidentally.

Связь с Automation QA:

`200 == '200'` can hide an API contract mismatch.

### 4. What `===` asks

Ответ:

`===` asks: are these already the same type and value?

Объяснение:

It never performs type conversion.

Распространённая ошибка:

Expect `5 === '5'` to be true because values look similar.

Связь с Automation QA:

Strict equality reveals type mismatches.

### 5. What `Object.is()` asks

Ответ:

`Object.is()` asks whether values are the same according to its exact comparison rules.

Объяснение:

It differs from `===` for `NaN` and `+0` / `-0`.

Распространённая ошибка:

Use it everywhere instead of knowing why it is needed.

Связь с Automation QA:

Useful for explicit edge-case checks.

### 6. Why `==` can hide type problems

Ответ:

Because it may convert values before comparison.

Объяснение:

String `'200'` can become Number `200`, making comparison pass.

Распространённая ошибка:

Let loose equality validate API contract.

Связь с Automation QA:

Tests should catch wrong response types.

### 7. Why `===` avoids hidden conversion

Ответ:

It compares without type conversion.

Объяснение:

If types differ, result is false.

Распространённая ошибка:

Parse after comparison instead of before.

Связь с Automation QA:

Use explicit parsing before strict comparison when conversion is intended.

### 8. Object identity

Ответ:

Object identity means whether two variables refer to the same object.

Объяснение:

Objects are compared by identity, not shape.

Распространённая ошибка:

Expect two same-looking objects to be equal with `===`.

Связь с Automation QA:

Use framework structure matchers for response object shape.

### 9. Same-looking objects

Ответ:

They are not equal by identity if they are different object values.

Объяснение:

Two object literals create two objects.

Распространённая ошибка:

Confuse visual similarity with identity.

Связь с Automation QA:

API response object and expected object are usually different objects.

### 10. NaN comparison

Ответ:

`NaN === NaN` is false, while `Object.is(NaN, NaN)` is true.

Объяснение:

`NaN` is a special numeric value.

Распространённая ошибка:

Check NaN with strict equality.

Связь с Automation QA:

Parsed invalid numeric fields may become `NaN`.

### 11. +0 and -0

Ответ:

`+0 === -0` is true, but `Object.is(+0, -0)` is false.

Объяснение:

This is a special edge case for exact semantics.

Распространённая ошибка:

Assume `Object.is()` always matches `===`.

Связь с Automation QA:

Rare in tests, but important for understanding semantics.

### 12. Recommended strategy

Ответ:

Prefer `===` by default. Use `==` only intentionally. Use `Object.is()` for specific edge cases.

Объяснение:

This strategy minimizes hidden conversion.

Распространённая ошибка:

Use one operator everywhere without understanding.

Связь с Automation QA:

Strict comparisons make tests more reliable.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
true
false
true
```

Объяснение:

`==` converts, `===` does not. Explicit `Number('5')` gives Number `5`.

Распространённая ошибка:

Forget that `===` checks type too.

Связь с Automation QA:

Parse before strict assertion.

### Задача 2

Ответ:

```text
true
false
true
false
```

Объяснение:

Loose equality can convert values. Strict equality does not.

Распространённая ошибка:

Use `==` and accidentally accept wrong type.

Связь с Automation QA:

Falsy-like values can create misleading test passes.

### Задача 3

Ответ:

```text
false
true
```

Объяснение:

`firstUser` and `secondUser` are different objects. `sameUser` refers to same object as `firstUser`.

Распространённая ошибка:

Compare object shape with `===`.

Связь с Automation QA:

Object response structure needs proper matcher later.

### Задача 4

Ответ:

```text
false
true
true
false
```

Объяснение:

`NaN` and `+0/-0` are special cases where `Object.is()` differs from `===`.

Распространённая ошибка:

Assume `Object.is()` is always identical to `===`.

Связь с Automation QA:

Use explicit edge-case checks when needed.

## Определите comparison strategy

### Сценарий 1

Ответ:

If contract expects Number, use `===` and fail on string, or explicitly parse only if contract allows string input. For strict contract validation, `===`.

Объяснение:

`==` would hide type mismatch.

Распространённая ошибка:

Use loose equality to make test pass.

Связь с Automation QA:

Contract tests should reveal wrong types.

### Сценарий 2

Ответ:

Use `===` for object identity.

Объяснение:

For objects, `===` checks whether both variables refer to same object.

Распространённая ошибка:

Assume it checks shape.

Связь с Automation QA:

Useful for debugging shared references.

### Сценарий 3

Ответ:

Use `Object.is(value, NaN)` or `Number.isNaN(value)`.

Объяснение:

`value === NaN` is false.

Распространённая ошибка:

Check NaN with strict equality.

Связь с Automation QA:

Invalid parsed API fields can become `NaN`.

### Сценарий 4

Ответ:

Use object structure comparison later in testing framework.

Объяснение:

`===` checks identity, not deep shape.

Распространённая ошибка:

Expect plain `===` to compare object contents.

Связь с Automation QA:

Framework matchers handle this in real tests.

### Сценарий 5

Ответ:

Use `==` only if conversion is intentionally desired and documented.

Объяснение:

Loose equality asks whether values can become comparable.

Распространённая ошибка:

Use `==` because it is shorter.

Связь с Automation QA:

Intentional loose comparison should be rare in tests.

## Чтение кода

Ответ:

1. `expectedStatus == actualStatusFromApi` may hide type mismatch.
2. `expectedStatus === actualStatusFromApi` reveals mismatch.
3. `expectedStatus === Number(actualStatusFromApi)` is best after intentional parsing.

Объяснение:

The API value is String. The expected value is Number.

Распространённая ошибка:

Compare before deciding whether parsing is part of the test.

Связь с Automation QA:

This is common in API response validation.

## Задачи на отладку

### Задача 1

Ответ:

Problem: `==` converts `'200'` to comparable numeric value, so test passes.

Fix:

```javascript
const expectedStatus = 200;
const actualStatus = '200';

console.log(expectedStatus === actualStatus);
```

If API intentionally returns string, parse explicitly:

```javascript
console.log(expectedStatus === Number(actualStatus));
```

Объяснение:

The correct fix depends on API contract.

Распространённая ошибка:

Use loose equality to avoid dealing with types.

Связь с Automation QA:

Strict assertions catch contract drift.

### Задача 2

Ответ:

`expectedUser` and `actualUser` are different objects.

Объяснение:

`===` compares object identity, not shape.

Распространённая ошибка:

Expect deep comparison from strict equality.

Связь с Automation QA:

Testing framework matchers are needed for object structure.

### Задача 3

Ответ:

`price === NaN` is false because `NaN` is special. `Object.is(price, NaN)` is true because `Object.is()` treats `NaN` values as same.

Объяснение:

`Number('not available')` produces `NaN`.

Распространённая ошибка:

Check invalid number with strict equality.

Связь с Automation QA:

Useful when validating parsed numeric API fields.

## QA-задачи

### Сценарий 1

Ответ:

If contract says statusCode should be Number, compare strictly without conversion:

```javascript
const expectedStatusCode = 200;
const actualStatusCode = '200';

console.log(actualStatusCode === expectedStatusCode);
```

This should fail.

Объяснение:

API returned wrong type according to contract.

Распространённая ошибка:

Use `==` and hide the bug.

Связь с Automation QA:

Contract tests should enforce value and type.

### Сценарий 2

Ответ:

```javascript
const expectedStatusCode = 200;
const actualStatusCodeFromApi = '200';
const parsedStatusCode = Number(actualStatusCodeFromApi);

console.log(parsedStatusCode === expectedStatusCode);
```

Объяснение:

Conversion is intentional and visible.

Распространённая ошибка:

Let `==` perform hidden conversion.

Связь с Automation QA:

Parsed values should be compared strictly.

### Сценарий 3

Ответ:

`expected === actual` checks whether both variables refer to same object. It does not compare fields.

Объяснение:

The objects are separate object values.

Распространённая ошибка:

Use strict equality as deep equality.

Связь с Automation QA:

Real object assertions need framework matchers later.

### Сценарий 4

Ответ:

Checklist:

```text
1. Search for == in tests.
2. Identify both value types.
3. Ask whether conversion is intentional.
4. If not intentional, replace with ===.
5. If conversion is needed, parse explicitly before ===.
6. For objects, check whether identity or structure is intended.
7. For NaN, use Object.is() or Number.isNaN().
```

Объяснение:

Unsafe loose equality hides type mismatches.

Распространённая ошибка:

Replace all comparisons mechanically without understanding.

Связь с Automation QA:

This checklist helps harden test suites.

## Мини-проект

Возможное решение:

```javascript
const rawApiResponse = {
  statusCode: '200',
  retryCount: '3',
  price: 'not available',
};

const parsedResponse = {
  statusCode: Number(rawApiResponse.statusCode),
  retryCount: Number(rawApiResponse.retryCount),
  price: Number(rawApiResponse.price),
};

console.log(rawApiResponse.statusCode == 200);
console.log(rawApiResponse.statusCode === 200);
console.log(parsedResponse.statusCode === 200);
console.log(Object.is(parsedResponse.price, NaN));

const expected = {
  status: 'ok',
};

const actual = {
  status: 'ok',
};

console.log(expected === actual);
```

Report:

```text
Comparison                     | Result | What exactly is compared            | QA meaning
------------------------------ | ------ | ----------------------------------- | ------------------------------
raw status == 200              | true   | values after possible conversion    | hides type mismatch
raw status === 200             | false  | type and value                      | reveals API returned string
parsed status === 200          | true   | parsed number and expected number   | clear assertion after parsing
Object.is(parsed price, NaN)   | true   | Object.is NaN semantics             | invalid numeric field detected
expected === actual            | false  | object identity                     | not structure comparison
```

Объяснение:

The project demonstrates all central comparison modes.

Распространённая ошибка:

Use one equality operator for every situation.

Связь с Automation QA:

This mirrors API validation and parsed response checks.
