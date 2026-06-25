# Решения. Глава 21. Conditionals

## Концептуальные вопросы

### 1. Why conditionals exist

Ответ:

Conditionals exist because programs need to choose execution paths.

Рассуждение:

A test should not always continue after status `500`. It must decide based on evaluated result.

Типичная ошибка:

Think conditionals are only syntax for grouping code.

Automation QA connection:

Tests choose whether to validate body, retry, skip or report failure.

### 2. Execution path

Ответ:

Execution path is the branch of code that actually runs after decision.

Рассуждение:

In `if / else`, one branch runs and the other is skipped.

Типичная ошибка:

Think JavaScript evaluates all branches and then chooses output.

Automation QA connection:

Only selected assertion path runs.

### 3. Before `if`

Ответ:

JavaScript evaluates condition expression.

Рассуждение:

`statusCode === 200` becomes `true` or `false`.

Типичная ошибка:

Read condition as text instead of evaluated expression.

Automation QA connection:

Assertions depend on expression results.

### 4. Boolean decision making

Ответ:

It means program uses evaluated result to choose path.

Рассуждение:

Boolean expressions are clearest for decisions.

Типичная ошибка:

Rely on unclear truthy/falsy values.

Automation QA connection:

Clear Boolean names improve test readability.

### 5. `else`

Ответ:

`else` provides alternative path when `if` condition is not selected.

Рассуждение:

It makes failure or fallback behavior explicit.

Типичная ошибка:

Omit else when failure path matters.

Automation QA connection:

Status error reporting belongs in else path.

### 6. `else if`

Ответ:

`else if` is useful for multiple related decisions in a chain.

Рассуждение:

Status code can be success, not found, server error or unexpected.

Типичная ошибка:

Write independent `if` statements when only one category should run.

Automation QA connection:

Response classification.

### 7. Nested conditions

Ответ:

Nested conditions are useful when inner decision only matters inside outer path.

Рассуждение:

Checking body fields makes sense only if status is successful.

Типичная ошибка:

Create deep nesting that hides decision path.

Automation QA connection:

Response validation often nests body checks inside status check.

### 8. `switch`

Ответ:

`switch` evaluates one expression and chooses matching case.

Рассуждение:

Environment selection is a good example.

Типичная ошибка:

Use switch for unrelated conditions.

Automation QA connection:

Config selection.

### 9. `default`

Ответ:

`default` handles fallback when no case matches.

Рассуждение:

Unexpected environment should still have explicit behavior.

Типичная ошибка:

Forget fallback path.

Automation QA connection:

Prevents silent wrong config.

### 10. Readability

Ответ:

Readable conditional logic makes decisions visible.

Рассуждение:

Named expressions explain why branch exists.

Типичная ошибка:

Put too many checks into one long condition.

Automation QA connection:

Readable tests are easier to debug.

### 11. No random branches

Ответ:

JavaScript evaluates expression and follows rules.

Рассуждение:

Branch choice is determined by result.

Типичная ошибка:

Explain unexpected branch as "random".

Automation QA connection:

Debug evaluated values, not guesses.

### 12. Connection to operators

Ответ:

Operators produce results used by conditionals.

Рассуждение:

`statusCode === 200` is comparison operator result.

Типичная ошибка:

Separate operators and conditionals mentally.

Automation QA connection:

Validation conditions are built from operators.

## Identify execution path

### Задача 1

Ответ:

Expression: `statusCode === 200`. Result: `true`. Chosen path: if block. Skipped path: none.

Рассуждение:

`200 === 200` is true.

Типичная ошибка:

Ignore evaluated value.

Automation QA connection:

Success validation path runs.

### Задача 2

Ответ:

Expression: `statusCode === 200`. Result: `false`. Chosen path: else block. Skipped path: if block.

Рассуждение:

`500 === 200` is false.

Типичная ошибка:

Think if block partially runs.

Automation QA connection:

Failure path should report status error.

### Задача 3

Ответ:

Switch expression: `environment`. Value: `'local'`. Chosen path: `case 'local'`. Skipped: other cases and default.

Рассуждение:

Switch matches one known case.

Типичная ошибка:

Expect default to run even after matching case.

Automation QA connection:

Environment config selection.

## Predict the output before running

### Задача 1

Ответ:

```text
Not success
```

Рассуждение:

`404 === 200` is false, so else branch runs.

Типичная ошибка:

Read only variable name, not comparison.

Automation QA connection:

Non-200 status follows failure path.

### Задача 2

Ответ:

```text
Server error
```

Рассуждение:

First two conditions are false; `503 >= 500` is true.

Типичная ошибка:

Expect default after one false condition.

Automation QA connection:

Server error classification.

### Задача 3

Ответ:

```text
Missing id
```

Рассуждение:

Status is OK, so inner condition runs. `id` is not in empty object.

Типичная ошибка:

Skip inner decision.

Automation QA connection:

Body validation after successful status.

### Задача 4

Ответ:

```text
Default
```

Рассуждение:

No case matches `'qa'`, so default branch runs.

Типичная ошибка:

Expect unmatched switch to do nothing when default exists.

Automation QA connection:

Fallback environment selection.

## Code reading

Ответ:

Decision: whether response is valid.

First evaluated expression: the full logical expression inside `if`.

Chosen path: `Valid response`, because all three checks are true.

Readable version:

```javascript
const isStatusOk = statusCode === 200;
const isFastEnough = responseTimeMs < 500;
const hasUser = hasUserId;

if (isStatusOk && isFastEnough && hasUser) {
  console.log('Valid response');
} else {
  console.log('Invalid response');
}
```

Рассуждение:

Named expressions expose decisions.

Типичная ошибка:

Make one long condition and hide intent.

Automation QA connection:

Readable validation is easier to maintain.

## Debugging tasks

### Задача 1

Ответ:

Branch runs because `statusCode = 200` is assignment, not comparison. It changes value to `200`, and assignment result is used by condition.

Correct:

```javascript
let statusCode = 500;

if (statusCode === 200) {
  console.log('Success');
}
```

Рассуждение:

Operators matter: `=` and `===` perform different operations.

Типичная ошибка:

Use assignment in condition accidentally.

Automation QA connection:

Can make tests pass incorrectly.

### Задача 2

Ответ:

`0` is falsy, so else branch runs even though property exists.

Better:

```javascript
if ('id' in responseBody) {
  console.log('Has id');
}
```

Рассуждение:

Presence check and truthy check are different decisions.

Типичная ошибка:

Treat value truthiness as property existence.

Automation QA connection:

API IDs can be `0`.

### Задача 3

Ответ:

Use named expressions:

```javascript
const isStatusOk = statusCode === 200;
const isFastEnough = responseTimeMs < 500;
const hasUser = hasUserId;
const isUserActive = !isDeleted;

if (isStatusOk && isFastEnough && hasUser && isUserActive) {
  console.log('Valid');
}
```

Рассуждение:

Names explain decisions.

Типичная ошибка:

Compress all QA intent into one expression.

Automation QA connection:

Improves test review.

## QA-oriented tasks

### Сценарий 1

Ответ:

```javascript
if (statusCode === 200) {
  console.log('Validate body');
} else {
  console.log('Report status error');
}
```

Рассуждение:

Status decides validation path.

Типичная ошибка:

Validate body even after bad status.

Automation QA connection:

Basic API test flow.

### Сценарий 2

Ответ:

```javascript
if (statusCode >= 500) {
  console.log('Retry may be needed');
} else {
  console.log('No retry');
}
```

Рассуждение:

Server error status chooses retry path.

Типичная ошибка:

Retry every non-200 status.

Automation QA connection:

Retry logic starts with condition.

### Сценарий 3

Ответ:

```javascript
switch (environment) {
  case 'local':
    console.log('Local config');
    break;
  case 'staging':
    console.log('Staging config');
    break;
  default:
    console.log('Default config');
}
```

Рассуждение:

Switch chooses based on one value.

Типичная ошибка:

Forget default branch.

Automation QA connection:

Environment config selection.

### Сценарий 4

Ответ:

```javascript
if (responseType === 'user') {
  console.log('Assert user fields');
} else {
  console.log('Assert generic response');
}
```

Рассуждение:

Response type chooses assertion path.

Типичная ошибка:

Run user assertions for every response.

Automation QA connection:

Dynamic response validation.

## Mini-project

Возможное решение:

```javascript
const response = {
  statusCode: 200,
  responseTimeMs: 350,
  body: {
    id: 101,
    email: 'anna@example.com',
  },
};

const environment = 'staging';

const isStatusOk = response.statusCode === 200;
const isFastEnough = response.responseTimeMs < 500;
const hasId = 'id' in response.body;
const hasEmail = 'email' in response.body;

if (!isStatusOk) {
  console.log('Status error');
} else if (isFastEnough && hasId && hasEmail) {
  console.log('Valid response');
} else {
  console.log('Invalid response body');
}

switch (environment) {
  case 'local':
    console.log('Local config');
    break;
  case 'staging':
    console.log('Staging config');
    break;
  default:
    console.log('Default config');
}
```

Report:

```text
Decision                | Expression result | Chosen path           | QA meaning
----------------------- | ----------------- | --------------------- | -----------------------------
status is OK            | true              | validate body         | response can be checked
response time < 500     | true              | valid timing          | performance threshold passed
body has id             | true              | keep validation       | required field exists
body has email          | true              | valid response        | required field exists
environment is staging  | true              | staging config        | correct config selected
```

Рассуждение:

The code separates decisions into named expressions and then chooses paths.

Типичная ошибка:

Put all checks into one unreadable condition.

Automation QA connection:

This mirrors real API response validation.
