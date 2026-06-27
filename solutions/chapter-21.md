# Решения. Глава 21. Conditionals

## Концептуальные вопросы

### 1. Why conditionals exist

Ответ:

Conditionals exist because programs need to choose execution paths.

Объяснение:

A test should not always continue after status `500`. It must decide based on evaluated result.

Распространённая ошибка:

Think conditionals are only syntax for grouping code.

Связь с Automation QA:

Tests choose whether to validate body, retry, skip or report failure.

### 2. Execution path

Ответ:

Execution path is the branch of code that actually runs after decision.

Объяснение:

In `if / else`, one branch runs and the other is skipped.

Распространённая ошибка:

Think JavaScript evaluates all branches and then chooses output.

Связь с Automation QA:

Only selected assertion path runs.

### 3. Before `if`

Ответ:

JavaScript evaluates condition expression.

Объяснение:

`statusCode === 200` becomes `true` or `false`.

Распространённая ошибка:

Read condition as text instead of evaluated expression.

Связь с Automation QA:

Assertions depend on expression results.

### 4. Boolean decision making

Ответ:

It means program uses evaluated result to choose path.

Объяснение:

Boolean expressions are clearest for decisions.

Распространённая ошибка:

Rely on unclear truthy/falsy values.

Связь с Automation QA:

Clear Boolean names improve test readability.

### 5. `else`

Ответ:

`else` provides alternative path when `if` condition is not selected.

Объяснение:

It makes failure or fallback behavior explicit.

Распространённая ошибка:

Omit else when failure path matters.

Связь с Automation QA:

Status error reporting belongs in else path.

### 6. `else if`

Ответ:

`else if` is useful for multiple related decisions in a chain.

Объяснение:

Status code can be success, not found, server error or unexpected.

Распространённая ошибка:

Write independent `if` statements when only one category should run.

Связь с Automation QA:

Response classification.

### 7. Nested conditions

Ответ:

Nested conditions are useful when inner decision only matters inside outer path.

Объяснение:

Checking body fields makes sense only if status is successful.

Распространённая ошибка:

Create deep nesting that hides decision path.

Связь с Automation QA:

Response validation often nests body checks inside status check.

### 8. `switch`

Ответ:

`switch` evaluates one expression and chooses matching case.

Объяснение:

Environment selection is a good example.

Распространённая ошибка:

Use switch for unrelated conditions.

Связь с Automation QA:

Config selection.

### 9. `default`

Ответ:

`default` handles fallback when no case matches.

Объяснение:

Unexpected environment should still have explicit behavior.

Распространённая ошибка:

Forget fallback path.

Связь с Automation QA:

Prevents silent wrong config.

### 10. Читаемость

Ответ:

Readable conditional logic makes decisions visible.

Объяснение:

Named expressions explain why branch exists.

Распространённая ошибка:

Put too many checks into one long condition.

Связь с Automation QA:

Readable tests are easier to debug.

### 11. No random branches

Ответ:

JavaScript evaluates expression and follows rules.

Объяснение:

Branch choice is determined by result.

Распространённая ошибка:

Explain unexpected branch as "random".

Связь с Automation QA:

Debug evaluated values, not guesses.

### 12. Connection to operators

Ответ:

Operators produce results used by conditionals.

Объяснение:

`statusCode === 200` is comparison operator result.

Распространённая ошибка:

Separate operators and conditionals mentally.

Связь с Automation QA:

Validation conditions are built from operators.

## Определите execution path

### Задача 1

Ответ:

Expression: `statusCode === 200`. Result: `true`. Chosen path: if block. Skipped path: none.

Объяснение:

`200 === 200` is true.

Распространённая ошибка:

Ignore evaluated value.

Связь с Automation QA:

Success validation path runs.

### Задача 2

Ответ:

Expression: `statusCode === 200`. Result: `false`. Chosen path: else block. Skipped path: if block.

Объяснение:

`500 === 200` is false.

Распространённая ошибка:

Think if block partially runs.

Связь с Automation QA:

Failure path should report status error.

### Задача 3

Ответ:

Switch expression: `environment`. Value: `'local'`. Chosen path: `case 'local'`. Skipped: other cases and default.

Объяснение:

Switch matches one known case.

Распространённая ошибка:

Expect default to run even after matching case.

Связь с Automation QA:

Environment config selection.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
Not success
```

Объяснение:

`404 === 200` is false, so else branch runs.

Распространённая ошибка:

Read only variable name, not comparison.

Связь с Automation QA:

Non-200 status follows failure path.

### Задача 2

Ответ:

```text
Server error
```

Объяснение:

First two conditions are false; `503 >= 500` is true.

Распространённая ошибка:

Expect default after one false condition.

Связь с Automation QA:

Server error classification.

### Задача 3

Ответ:

```text
Missing id
```

Объяснение:

Status is OK, so inner condition runs. `id` is not in empty object.

Распространённая ошибка:

Skip inner decision.

Связь с Automation QA:

Body validation after successful status.

### Задача 4

Ответ:

```text
Default
```

Объяснение:

No case matches `'qa'`, so default branch runs.

Распространённая ошибка:

Expect unmatched switch to do nothing when default exists.

Связь с Automation QA:

Fallback environment selection.

## Чтение кода

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

Объяснение:

Named expressions expose decisions.

Распространённая ошибка:

Make one long condition and hide intent.

Связь с Automation QA:

Readable validation is easier to maintain.

## Задачи на отладку

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

Объяснение:

Operators matter: `=` and `===` perform different operations.

Распространённая ошибка:

Use assignment in condition accidentally.

Связь с Automation QA:

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

Объяснение:

Presence check and truthy check are different decisions.

Распространённая ошибка:

Treat value truthiness as property existence.

Связь с Automation QA:

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

Объяснение:

Names explain decisions.

Распространённая ошибка:

Compress all QA intent into one expression.

Связь с Automation QA:

Improves test review.

## QA-задачи

### Сценарий 1

Ответ:

```javascript
if (statusCode === 200) {
  console.log('Validate body');
} else {
  console.log('Report status error');
}
```

Объяснение:

Status decides validation path.

Распространённая ошибка:

Validate body even after bad status.

Связь с Automation QA:

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

Объяснение:

Server error status chooses retry path.

Распространённая ошибка:

Retry every non-200 status.

Связь с Automation QA:

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

Объяснение:

Switch chooses based on one value.

Распространённая ошибка:

Forget default branch.

Связь с Automation QA:

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

Объяснение:

Response type chooses assertion path.

Распространённая ошибка:

Run user assertions for every response.

Связь с Automation QA:

Dynamic response validation.

## Мини-проект

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

Объяснение:

The code separates decisions into named expressions and then chooses paths.

Распространённая ошибка:

Put all checks into one unreadable condition.

Связь с Automation QA:

This mirrors real API response validation.
