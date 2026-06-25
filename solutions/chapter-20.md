# Решения. Глава 20. Operators

## Концептуальные вопросы

### 1. What is an operator

Ответ:

Operator is a language action performed on operand values that produces a result.

Рассуждение:

In `2 + 3`, `+` performs addition.

Типичная ошибка:

Think operator is only a symbol, not an operation.

Automation QA connection:

Assertions and validation expressions are built from operators.

### 2. What is an operand

Ответ:

Operand is a value used by an operator.

Рассуждение:

In `2 + 3`, `2` and `3` are operands.

Типичная ошибка:

Confuse operand with result.

Automation QA connection:

In `statusCode === 200`, both `statusCode` and `200` are operands.

### 3. Operator result

Ответ:

Operator result is the value produced after operation.

Рассуждение:

`2 + 3` produces `5`; `200 === 200` produces `true`.

Типичная ошибка:

Ignore result and expect visible effect.

Automation QA connection:

Assertions use Boolean results.

### 4. Why categories exist

Ответ:

Categories group operators by operation type.

Рассуждение:

Arithmetic calculates, comparison compares, assignment updates.

Типичная ошибка:

Expect all operators to behave like arithmetic.

Automation QA connection:

Understanding category helps read test expressions.

### 5. Unary operator

Ответ:

Unary operator works with one operand.

Рассуждение:

`typeof value` and `!isReady` are examples.

Типичная ошибка:

Expect every operator to have two operands.

Automation QA connection:

`typeof` is useful for debugging API values.

### 6. Binary operator

Ответ:

Binary operator works with two operands.

Рассуждение:

`2 + 3`, `statusCode === 200`, `'id' in body`.

Типичная ошибка:

Miss left and right operands.

Automation QA connection:

Most assertions use binary comparisons.

### 7. Ternary operator

Ответ:

Ternary operator works with three operands.

Рассуждение:

`condition ? valueIfTrue : valueIfFalse`.

Типичная ошибка:

Use ternary for complex logic too early.

Automation QA connection:

Can create simple labels in reports, but conditionals will be studied later.

### 8. Arithmetic operators

Ответ:

They perform numeric-like calculations.

Рассуждение:

Examples: `+`, `-`, `*`, `/`, `%`.

Типичная ошибка:

Forget `+` can also interact with strings.

Automation QA connection:

Used for totals, timeouts, retries.

### 9. Comparison operators

Ответ:

They compare values and usually produce Boolean result.

Рассуждение:

`===`, `<`, `>=` are comparison operators.

Типичная ошибка:

Confuse comparison with assignment.

Automation QA connection:

Assertions depend on comparisons.

### 10. Logical operators

Ответ:

They combine or evaluate condition-like values.

Рассуждение:

`&&`, `||`, `!` are logical operators.

Типичная ошибка:

Jump into short-circuit details before understanding category.

Automation QA connection:

Used to combine validation checks.

### 11. Assignment operators

Ответ:

They store or update values.

Рассуждение:

`=` assigns; `+=` updates based on current value.

Типичная ошибка:

Confuse `=` with `===`.

Automation QA connection:

Used for counters and prepared test data.

### 12. `typeof`

Ответ:

`typeof` returns string with type category.

Рассуждение:

`typeof 'Anna'` returns `'string'`.

Типичная ошибка:

Call `typeof` a function.

Automation QA connection:

Useful for debugging response field types.

### 13. `delete`

Ответ:

At a high level, `delete` removes property from object.

Рассуждение:

After deleting property, `in` can show it is no longer present.

Типичная ошибка:

Think delete removes a variable.

Automation QA connection:

Used for sanitizing objects before comparison.

### 14. `in`

Ответ:

`in` checks property presence in object.

Рассуждение:

It does not compare property value.

Типичная ошибка:

Use `in` to check value correctness.

Automation QA connection:

Useful for response schema-like checks.

### 15. Precedence

Ответ:

Precedence decides operation order when expression has multiple operators.

Рассуждение:

`*` is evaluated before `+` in `2 + 3 * 4`.

Типичная ошибка:

Rely on memory instead of using parentheses.

Automation QA connection:

Readable validation expressions reduce review mistakes.

## Identify operator category

### Задача 1

Ответ:

Operator: `+`. Operands: `2`, `3`. Category: arithmetic. Result type: Number.

Рассуждение:

Addition calculates result.

Типичная ошибка:

Forget `+` may behave differently with strings.

Automation QA connection:

Used in calculations.

### Задача 2

Ответ:

Operator: `===`. Operands: `statusCode`, `200`. Category: comparison. Result type: Boolean.

Рассуждение:

Strict equality compares without conversion.

Типичная ошибка:

Confuse with assignment.

Automation QA connection:

Common assertion expression.

### Задача 3

Ответ:

Operator: `&&`. Operands: `isReady`, `hasUser`. Category: logical. Result: condition-like result.

Рассуждение:

It combines checks.

Типичная ошибка:

Explain short-circuit before understanding operator category.

Automation QA connection:

Used to combine validation states.

### Задача 4

Ответ:

Operator: `typeof`. Operand: `userName`. Category: type inspection. Result type: String.

Рассуждение:

`typeof` returns type category string.

Типичная ошибка:

Write `typeof(userName)` and think it is a normal function call.

Automation QA connection:

Debugging API value types.

### Задача 5

Ответ:

Operator: `in`. Operands: `'id'`, `responseBody`. Category: property/object-related. Result type: Boolean.

Рассуждение:

It checks property presence.

Типичная ошибка:

Expect it to check property value.

Automation QA connection:

Response field existence check.

### Задача 6

Ответ:

Operator: `+=`. Operands: `retryCount`, `1`. Category: assignment/update. Result type depends on updated value.

Рассуждение:

It reads current value, performs operation and assigns back.

Типичная ошибка:

Forget current value participates.

Automation QA connection:

Retry counters.

## Predict the output before running

### Задача 1

Ответ:

```text
200
102
```

Рассуждение:

`*` multiplies; `+` adds numbers.

Типичная ошибка:

Confuse item count and addition.

Automation QA connection:

Calculating totals.

### Задача 2

Ответ:

```text
true
false
true
```

Рассуждение:

Each comparison produces Boolean result.

Типичная ошибка:

Read `<` and `>=` backward.

Automation QA connection:

Response validation thresholds.

### Задача 3

Ответ:

```text
false
true
true
```

Рассуждение:

`&&` needs both condition-like values true. `||` accepts one true. `!false` becomes true.

Типичная ошибка:

Confuse AND and OR.

Automation QA connection:

Combining validation checks.

### Задача 4

Ответ:

```text
string
true
false
```

Рассуждение:

`typeof responseBody.name` is string. `id` exists; `role` does not.

Типичная ошибка:

Expect `in` to check value instead of presence.

Automation QA connection:

Response body shape checks.

### Задача 5

Ответ:

```text
14
20
```

Рассуждение:

Multiplication happens before addition. Parentheses change order.

Типичная ошибка:

Ignore precedence.

Automation QA connection:

Parentheses make test expressions easier to review.

## Code reading

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

Рассуждение:

`retryCountFromEnv` is string, so `+` does not produce numeric increment here.

Типичная ошибка:

Assume numeric-looking string behaves as number.

Automation QA connection:

Environment variables often arrive as strings.

## Debugging tasks

### Задача 1

Ответ:

Operator: `+`. With string operand, operation produces string concatenation here.

Fix:

```javascript
const retryCount = '3';
const nextRetryCount = Number(retryCount) + 1;
```

Рассуждение:

Numeric operation needs Number.

Типичная ошибка:

Ignore operand type.

Automation QA connection:

Parsing config values.

### Задача 2

Ответ:

`*` has higher precedence than `+`, so expression is `2 + (3 * 4)`.

Рассуждение:

`3 * 4` is `12`; `2 + 12` is `14`.

Типичная ошибка:

Assume left-to-right for every operator.

Automation QA connection:

Use parentheses in complex validations.

### Задача 3

Ответ:

`in` checks whether property exists. It does not compare the value `101`.

Рассуждение:

`'id' in responseBody` returns true because property is present.

Типичная ошибка:

Use presence check as value assertion.

Automation QA connection:

Need separate checks for existence and value.

### Задача 4

Ответ:

Property `temporaryCode` is removed. The final result is:

```text
false
```

Рассуждение:

`delete` removes property at a high level; `in` then checks presence.

Типичная ошибка:

Expect deleted property to still be present with `undefined`.

Automation QA connection:

Sanitizing payloads.

## QA-oriented tasks

### Сценарий 1

Ответ:

```javascript
const isStatusExpected = statusCode === 200;
const isFastEnough = responseTimeMs < 500;
const isValid = isStatusExpected && isFastEnough;
```

Рассуждение:

Comparison operators produce Booleans; logical operator combines them.

Типичная ошибка:

Combine raw values without explicit checks.

Automation QA connection:

Common validation pattern.

### Сценарий 2

Ответ:

```javascript
const statusCode = '200';

console.log(typeof statusCode);
```

Рассуждение:

`typeof` inspects type category.

Типичная ошибка:

Assume value is number because it looks numeric.

Automation QA connection:

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

Рассуждение:

`in` checks property presence.

Типичная ошибка:

Think `in` validates property value.

Automation QA connection:

Schema-like response checks.

### Сценарий 4

Ответ:

```javascript
const createdAt = new Date();

console.log(createdAt instanceof Date);
```

Рассуждение:

`instanceof` checks runtime relationship at a high level.

Типичная ошибка:

Use `typeof` for Date and expect `"date"`.

Automation QA connection:

Runtime validation of values returned by helpers.

## Mini-project

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

Рассуждение:

The project combines comparison, logical, type inspection, property presence and delete operators.

Типичная ошибка:

Treat every check as a value comparison.

Automation QA connection:

This mirrors response validation in API tests.
