# Решения. Глава 19. Equality

## Концептуальные вопросы

### 1. Why equality is needed

Ответ:

Equality is needed to decide whether two values match according to a chosen comparison rule.

Рассуждение:

Programs compare API values, user roles, status codes, parsed configuration and object identity.

Типичная ошибка:

Think equality has one universal meaning.

Automation QA connection:

Assertions are comparisons.

### 2. Why multiple equality operators

Ответ:

Because JavaScript supports comparison with conversion, comparison without conversion and special exact comparison through `Object.is()`.

Рассуждение:

Different operators answer different questions.

Типичная ошибка:

Think `==` and `===` differ only by style.

Automation QA connection:

Choosing wrong operator can hide bugs.

### 3. What `==` asks

Ответ:

`==` asks: can these values become comparable?

Рассуждение:

It may perform conversion before comparison.

Типичная ошибка:

Use `==` accidentally.

Automation QA connection:

`200 == '200'` can hide an API contract mismatch.

### 4. What `===` asks

Ответ:

`===` asks: are these already the same type and value?

Рассуждение:

It never performs type conversion.

Типичная ошибка:

Expect `5 === '5'` to be true because values look similar.

Automation QA connection:

Strict equality reveals type mismatches.

### 5. What `Object.is()` asks

Ответ:

`Object.is()` asks whether values are the same according to its exact comparison rules.

Рассуждение:

It differs from `===` for `NaN` and `+0` / `-0`.

Типичная ошибка:

Use it everywhere instead of knowing why it is needed.

Automation QA connection:

Useful for explicit edge-case checks.

### 6. Why `==` can hide type problems

Ответ:

Because it may convert values before comparison.

Рассуждение:

String `'200'` can become Number `200`, making comparison pass.

Типичная ошибка:

Let loose equality validate API contract.

Automation QA connection:

Tests should catch wrong response types.

### 7. Why `===` avoids hidden conversion

Ответ:

It compares without type conversion.

Рассуждение:

If types differ, result is false.

Типичная ошибка:

Parse after comparison instead of before.

Automation QA connection:

Use explicit parsing before strict comparison when conversion is intended.

### 8. Object identity

Ответ:

Object identity means whether two variables refer to the same object.

Рассуждение:

Objects are compared by identity, not shape.

Типичная ошибка:

Expect two same-looking objects to be equal with `===`.

Automation QA connection:

Use framework structure matchers for response object shape.

### 9. Same-looking objects

Ответ:

They are not equal by identity if they are different object values.

Рассуждение:

Two object literals create two objects.

Типичная ошибка:

Confuse visual similarity with identity.

Automation QA connection:

API response object and expected object are usually different objects.

### 10. NaN comparison

Ответ:

`NaN === NaN` is false, while `Object.is(NaN, NaN)` is true.

Рассуждение:

`NaN` is a special numeric value.

Типичная ошибка:

Check NaN with strict equality.

Automation QA connection:

Parsed invalid numeric fields may become `NaN`.

### 11. +0 and -0

Ответ:

`+0 === -0` is true, but `Object.is(+0, -0)` is false.

Рассуждение:

This is a special edge case for exact semantics.

Типичная ошибка:

Assume `Object.is()` always matches `===`.

Automation QA connection:

Rare in tests, but important for understanding semantics.

### 12. Recommended strategy

Ответ:

Prefer `===` by default. Use `==` only intentionally. Use `Object.is()` for specific edge cases.

Рассуждение:

This strategy minimizes hidden conversion.

Типичная ошибка:

Use one operator everywhere without understanding.

Automation QA connection:

Strict comparisons make tests more reliable.

## Predict the output before running

### Задача 1

Ответ:

```text
true
false
true
```

Рассуждение:

`==` converts, `===` does not. Explicit `Number('5')` gives Number `5`.

Типичная ошибка:

Forget that `===` checks type too.

Automation QA connection:

Parse before strict assertion.

### Задача 2

Ответ:

```text
true
false
true
false
```

Рассуждение:

Loose equality can convert values. Strict equality does not.

Типичная ошибка:

Use `==` and accidentally accept wrong type.

Automation QA connection:

Falsy-like values can create misleading test passes.

### Задача 3

Ответ:

```text
false
true
```

Рассуждение:

`firstUser` and `secondUser` are different objects. `sameUser` refers to same object as `firstUser`.

Типичная ошибка:

Compare object shape with `===`.

Automation QA connection:

Object response structure needs proper matcher later.

### Задача 4

Ответ:

```text
false
true
true
false
```

Рассуждение:

`NaN` and `+0/-0` are special cases where `Object.is()` differs from `===`.

Типичная ошибка:

Assume `Object.is()` is always identical to `===`.

Automation QA connection:

Use explicit edge-case checks when needed.

## Identify comparison strategy

### Сценарий 1

Ответ:

If contract expects Number, use `===` and fail on string, or explicitly parse only if contract allows string input. For strict contract validation, `===`.

Рассуждение:

`==` would hide type mismatch.

Типичная ошибка:

Use loose equality to make test pass.

Automation QA connection:

Contract tests should reveal wrong types.

### Сценарий 2

Ответ:

Use `===` for object identity.

Рассуждение:

For objects, `===` checks whether both variables refer to same object.

Типичная ошибка:

Assume it checks shape.

Automation QA connection:

Useful for debugging shared references.

### Сценарий 3

Ответ:

Use `Object.is(value, NaN)` or `Number.isNaN(value)`.

Рассуждение:

`value === NaN` is false.

Типичная ошибка:

Check NaN with strict equality.

Automation QA connection:

Invalid parsed API fields can become `NaN`.

### Сценарий 4

Ответ:

Use object structure comparison later in testing framework.

Рассуждение:

`===` checks identity, not deep shape.

Типичная ошибка:

Expect plain `===` to compare object contents.

Automation QA connection:

Framework matchers handle this in real tests.

### Сценарий 5

Ответ:

Use `==` only if conversion is intentionally desired and documented.

Рассуждение:

Loose equality asks whether values can become comparable.

Типичная ошибка:

Use `==` because it is shorter.

Automation QA connection:

Intentional loose comparison should be rare in tests.

## Code reading

Ответ:

1. `expectedStatus == actualStatusFromApi` may hide type mismatch.
2. `expectedStatus === actualStatusFromApi` reveals mismatch.
3. `expectedStatus === Number(actualStatusFromApi)` is best after intentional parsing.

Рассуждение:

The API value is String. The expected value is Number.

Типичная ошибка:

Compare before deciding whether parsing is part of the test.

Automation QA connection:

This is common in API response validation.

## Debugging tasks

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

Рассуждение:

The correct fix depends on API contract.

Типичная ошибка:

Use loose equality to avoid dealing with types.

Automation QA connection:

Strict assertions catch contract drift.

### Задача 2

Ответ:

`expectedUser` and `actualUser` are different objects.

Рассуждение:

`===` compares object identity, not shape.

Типичная ошибка:

Expect deep comparison from strict equality.

Automation QA connection:

Testing framework matchers are needed for object structure.

### Задача 3

Ответ:

`price === NaN` is false because `NaN` is special. `Object.is(price, NaN)` is true because `Object.is()` treats `NaN` values as same.

Рассуждение:

`Number('not available')` produces `NaN`.

Типичная ошибка:

Check invalid number with strict equality.

Automation QA connection:

Useful when validating parsed numeric API fields.

## QA-oriented tasks

### Сценарий 1

Ответ:

If contract says statusCode should be Number, compare strictly without conversion:

```javascript
const expectedStatusCode = 200;
const actualStatusCode = '200';

console.log(actualStatusCode === expectedStatusCode);
```

This should fail.

Рассуждение:

API returned wrong type according to contract.

Типичная ошибка:

Use `==` and hide the bug.

Automation QA connection:

Contract tests should enforce value and type.

### Сценарий 2

Ответ:

```javascript
const expectedStatusCode = 200;
const actualStatusCodeFromApi = '200';
const parsedStatusCode = Number(actualStatusCodeFromApi);

console.log(parsedStatusCode === expectedStatusCode);
```

Рассуждение:

Conversion is intentional and visible.

Типичная ошибка:

Let `==` perform hidden conversion.

Automation QA connection:

Parsed values should be compared strictly.

### Сценарий 3

Ответ:

`expected === actual` checks whether both variables refer to same object. It does not compare fields.

Рассуждение:

The objects are separate object values.

Типичная ошибка:

Use strict equality as deep equality.

Automation QA connection:

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

Рассуждение:

Unsafe loose equality hides type mismatches.

Типичная ошибка:

Replace all comparisons mechanically without understanding.

Automation QA connection:

This checklist helps harden test suites.

## Mini-project

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

Рассуждение:

The project demonstrates all central comparison modes.

Типичная ошибка:

Use one equality operator for every situation.

Automation QA connection:

This mirrors API validation and parsed response checks.
