# Решения. Глава 20. Operators

## Концептуальные вопросы

### 1. What is an operator

Ответ:

Operator is a language action performed on operand values that produces a result.

Объяснение:

In `2 + 3`, `+` performs addition.

Распространённая ошибка:

Think operator is only a symbol, not an operation.

Связь с Automation QA:

Assertions and validation expressions are built from operators.

### 2. What is an operand

Ответ:

Operand is a value used by an operator.

Объяснение:

In `2 + 3`, `2` and `3` are operands.

Распространённая ошибка:

Confuse operand with result.

Связь с Automation QA:

In `statusCode === 200`, both `statusCode` and `200` are operands.

### 3. Operator result

Ответ:

Operator result is the value produced after operation.

Объяснение:

`2 + 3` produces `5`; `200 === 200` produces `true`.

Распространённая ошибка:

Ignore result and expect visible effect.

Связь с Automation QA:

Assertions use Boolean results.

### 4. Why categories exist

Ответ:

Categories group operators by operation type.

Объяснение:

Arithmetic calculates, comparison compares, assignment updates.

Распространённая ошибка:

Expect all operators to behave like arithmetic.

Связь с Automation QA:

Understanding category helps read test expressions.

### 5. Unary operator

Ответ:

Unary operator works with one operand.

Объяснение:

`typeof value` and `!isReady` are examples.

Распространённая ошибка:

Expect every operator to have two operands.

Связь с Automation QA:

`typeof` is useful for debugging API values.

### 6. Binary operator

Ответ:

Binary operator works with two operands.

Объяснение:

`2 + 3`, `statusCode === 200`, `'id' in body`.

Распространённая ошибка:

Miss left and right operands.

Связь с Automation QA:

Most assertions use binary comparisons.

### 7. Ternary operator

Ответ:

Ternary operator works with three operands.

Объяснение:

`condition ? valueIfTrue : valueIfFalse`.

Распространённая ошибка:

Use ternary for complex logic too early.

Связь с Automation QA:

Can create simple labels in reports, but conditionals will be studied later.

### 8. Arithmetic operators

Ответ:

They perform numeric-like calculations.

Объяснение:

Examples: `+`, `-`, `*`, `/`, `%`.

Распространённая ошибка:

Forget `+` can also interact with strings.

Связь с Automation QA:

Used for totals, timeouts, retries.

### 9. Comparison operators

Ответ:

They compare values and usually produce Boolean result.

Объяснение:

`===`, `<`, `>=` are comparison operators.

Распространённая ошибка:

Confuse comparison with assignment.

Связь с Automation QA:

Assertions depend on comparisons.

### 10. Logical operators

Ответ:

They combine or evaluate condition-like values.

Объяснение:

`&&`, `||`, `!` are logical operators.

Распространённая ошибка:

Jump into short-circuit details before understanding category.

Связь с Automation QA:

Used to combine validation checks.

### 11. Assignment operators

Ответ:

They store or update values.

Объяснение:

`=` assigns; `+=` updates based on current value.

Распространённая ошибка:

Confuse `=` with `===`.

Связь с Automation QA:

Used for counters and prepared test data.

### 12. `typeof`

Ответ:

`typeof` returns string with type category.

Объяснение:

`typeof 'Anna'` returns `'string'`.

Распространённая ошибка:

Call `typeof` a function.

Связь с Automation QA:

Useful for debugging response field types.

### 13. `delete`

Ответ:

At a high level, `delete` removes property from object.

Объяснение:

After deleting property, `in` can show it is no longer present.

Распространённая ошибка:

Think delete removes a variable.

Связь с Automation QA:

Used for sanitizing objects before comparison.

### 14. `in`

Ответ:

`in` checks property presence in object.

Объяснение:

It does not compare property value.

Распространённая ошибка:

Use `in` to check value correctness.

Связь с Automation QA:

Useful for response schema-like checks.

### 15. Precedence

Ответ:

Precedence decides operation order when expression has multiple operators.

Объяснение:

`*` is evaluated before `+` in `2 + 3 * 4`.

Распространённая ошибка:

Rely on memory instead of using parentheses.

Связь с Automation QA:

Readable validation expressions reduce review mistakes.

## Определите operator category

### Задача 1

Ответ:

Operator: `+`. Operands: `2`, `3`. Category: arithmetic. Result type: Number.

Объяснение:

Addition calculates result.

Распространённая ошибка:

Forget `+` may behave differently with strings.

Связь с Automation QA:

Used in calculations.

### Задача 2

Ответ:

Operator: `===`. Operands: `statusCode`, `200`. Category: comparison. Result type: Boolean.

Объяснение:

Strict equality compares without conversion.

Распространённая ошибка:

Confuse with assignment.

Связь с Automation QA:

Common assertion expression.

### Задача 3

Ответ:

Operator: `&&`. Operands: `isReady`, `hasUser`. Category: logical. Result: condition-like result.

Объяснение:

It combines checks.

Распространённая ошибка:

Explain short-circuit before understanding operator category.

Связь с Automation QA:

Used to combine validation states.

### Задача 4

Ответ:

Operator: `typeof`. Operand: `userName`. Category: type inspection. Result type: String.

Объяснение:

`typeof` returns type category string.

Распространённая ошибка:

Write `typeof(userName)` and think it is a normal function call.

Связь с Automation QA:

Debugging API value types.

### Задача 5

Ответ:

Operator: `in`. Operands: `'id'`, `responseBody`. Category: property/object-related. Result type: Boolean.

Объяснение:

It checks property presence.

Распространённая ошибка:

Expect it to check property value.

Связь с Automation QA:

Response field existence check.

### Задача 6

Ответ:

Operator: `+=`. Operands: `retryCount`, `1`. Category: assignment/update. Result type depends on updated value.

Объяснение:

It reads current value, performs operation and assigns back.

Распространённая ошибка:

Forget current value participates.

Связь с Automation QA:

Retry counters.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
200
102
```

Объяснение:

`*` multiplies; `+` adds numbers.

Распространённая ошибка:

Confuse item count and addition.

Связь с Automation QA:

Calculating totals.

### Задача 2

Ответ:

```text
true
false
true
```

Объяснение:

Each comparison produces Boolean result.

Распространённая ошибка:

Read `<` and `>=` backward.

Связь с Automation QA:

Response validation thresholds.

### Задача 3

Ответ:

```text
false
true
true
```

Объяснение:

`&&` needs both condition-like values true. `||` accepts one true. `!false` becomes true.

Распространённая ошибка:

Confuse AND and OR.

Связь с Automation QA:

Combining validation checks.

### Задача 4

Ответ:

```text
string
true
false
```

Объяснение:

`typeof responseBody.name` is string. `id` exists; `role` does not.

Распространённая ошибка:

Expect `in` to check value instead of presence.

Связь с Automation QA:

Response body shape checks.

### Задача 5

Ответ:

```text
14
20
```

Объяснение:

Multiplication happens before addition. Parentheses change order.

Распространённая ошибка:

Ignore precedence.

Связь с Automation QA:

Parentheses make test expressions easier to review.

## Чтение кода

Ответ:

Operators:

```text
+       arithmetic / string-related behavior depending on operands
===     comparison
in      property presence
```

Results:

```text
nextRetryCount → "31"
isSuccess      → true
hasId          → true
```

Possible type conversion issue:

```text
retryCountFromEnv + 1
```

Объяснение:

`retryCountFromEnv` is string, so `+` does not produce numeric increment here.

Распространённая ошибка:

Assume numeric-looking string behaves as number.

Связь с Automation QA:

Environment variables often arrive as strings.

## Задачи на отладку

### Задача 1

Ответ:

Operator: `+`. With string operand, operation produces string concatenation here.

Fix:

```javascript
const retryCount = '3';
const nextRetryCount = Number(retryCount) + 1;
```

Объяснение:

Numeric operation needs Number.

Распространённая ошибка:

Ignore operand type.

Связь с Automation QA:

Parsing config values.

### Задача 2

Ответ:

`*` has higher precedence than `+`, so expression is `2 + (3 * 4)`.

Объяснение:

`3 * 4` is `12`; `2 + 12` is `14`.

Распространённая ошибка:

Assume left-to-right for every operator.

Связь с Automation QA:

Use parentheses in complex validations.

### Задача 3

Ответ:

`in` checks whether property exists. It does not compare the value `101`.

Объяснение:

`'id' in responseBody` returns true because property is present.

Распространённая ошибка:

Use presence check as value assertion.

Связь с Automation QA:

Need separate checks for existence and value.

### Задача 4

Ответ:

Property `temporaryCode` is removed. The final result is:

```text
false
```

Объяснение:

`delete` removes property at a high level; `in` then checks presence.

Распространённая ошибка:

Expect deleted property to still be present with `undefined`.

Связь с Automation QA:

Sanitizing payloads.

## QA-задачи

### Сценарий 1

Ответ:

```javascript
const isStatusExpected = statusCode === 200;
const isFastEnough = responseTimeMs < 500;
const isValid = isStatusExpected && isFastEnough;
```

Объяснение:

Comparison operators produce Booleans; logical operator combines them.

Распространённая ошибка:

Combine raw values without explicit checks.

Связь с Automation QA:

Common validation pattern.

### Сценарий 2

Ответ:

```javascript
const statusCode = '200';

console.log(typeof statusCode);
```

Объяснение:

`typeof` inspects type category.

Распространённая ошибка:

Assume value is number because it looks numeric.

Связь с Automation QA:

Debugging API responses.

### Сценарий 3

Ответ:

```javascript
const responseBody = {
  id: 101,
  email: 'anna@example.com',
};

console.log('id' in responseBody);
console.log('role' in responseBody);
```

Объяснение:

`in` checks property presence.

Распространённая ошибка:

Think `in` validates property value.

Связь с Automation QA:

Schema-like response checks.

### Сценарий 4

Ответ:

```javascript
const createdAt = new Date();

console.log(createdAt instanceof Date);
```

Объяснение:

`instanceof` checks runtime relationship at a high level.

Распространённая ошибка:

Use `typeof` for Date and expect `"date"`.

Связь с Automation QA:

Runtime validation of values returned by helpers.

## Мини-проект

Возможное решение:

```javascript
const response = {
  statusCode: 200,
  responseTimeMs: 350,
  body: {
    id: 101,
    email: 'anna@example.com',
    role: 'admin',
  },
};

const isStatusOk = response.statusCode === 200;
const isFastEnough = response.responseTimeMs < 500;
const hasId = 'id' in response.body;
const hasRole = 'role' in response.body;
const isRoleString = typeof response.body.role === 'string';

const isValidResponse = isStatusOk && isFastEnough && hasId && hasRole && isRoleString;

delete response.body.role;

const hasRoleAfterDelete = 'role' in response.body;

console.log(isStatusOk);
console.log(isFastEnough);
console.log(hasId);
console.log(hasRole);
console.log(isRoleString);
console.log(isValidResponse);
console.log(hasRoleAfterDelete);
```

Report:

```text
Expression                       | Operator category        | Result | QA meaning
-------------------------------- | ------------------------ | ------ | -------------------------
response.statusCode === 200      | comparison               | true   | status is expected
response.responseTimeMs < 500    | comparison               | true   | response is fast enough
"id" in response.body            | property presence        | true   | id exists
"role" in response.body          | property presence        | true   | role exists before delete
typeof response.body.role        | type inspection          | string | role is text
combined with &&                 | logical                  | true   | all checks passed
delete response.body.role        | property deletion        | -      | role removed
"role" in response.body          | property presence        | false  | role no longer exists
```

Объяснение:

The project combines comparison, logical, type inspection, property presence and delete operators.

Распространённая ошибка:

Treat every check as a value comparison.

Связь с Automation QA:

This mirrors response validation in API tests.
