# Решения. Глава 22. Loops

## Концептуальные вопросы

### 1. Why loops exist

Ответ:

Loops exist to repeat an algorithm until a stopping condition is reached.

Рассуждение:

Validating 100 responses should not require 100 copied blocks.

Типичная ошибка:

Think loop is only shorter syntax.

Automation QA connection:

Tests often validate many items.

### 2. Repeated execution

Ответ:

Repeated execution means running the same body multiple times.

Рассуждение:

Each pass is controlled by condition and update.

Типичная ошибка:

Forget condition controls repetition.

Automation QA connection:

Response validation repeats per response.

### 3. Loop condition

Ответ:

Loop condition decides whether repetition continues.

Рассуждение:

When condition becomes false, loop stops.

Типичная ошибка:

Write condition that never becomes false.

Automation QA connection:

Retry loops need max attempts.

### 4. Iteration

Ответ:

Iteration is one pass through loop body.

Рассуждение:

If body runs three times, loop has three iterations.

Типичная ошибка:

Confuse iteration with loop itself.

Automation QA connection:

One iteration can validate one response.

### 5. Loop body

Ответ:

Loop body contains repeated work.

Рассуждение:

In response validation, body checks current response.

Типичная ошибка:

Put initialization inside body accidentally.

Automation QA connection:

Body often contains assertion logic.

### 6. Initialization

Ответ:

Initialization prepares starting state.

Рассуждение:

Example: `let index = 0`.

Типичная ошибка:

Reinitialize counter inside body.

Automation QA connection:

Counters track attempts or response index.

### 7. Update step

Ответ:

Update changes loop state after each iteration.

Рассуждение:

It moves loop toward stopping condition.

Типичная ошибка:

Forget update and create infinite loop.

Automation QA connection:

Retry attempts must increment.

### 8. `while`

Ответ:

`while` checks condition before each body execution.

Рассуждение:

If condition is false initially, body does not run.

Типичная ошибка:

Expect body to run once always.

Automation QA connection:

Useful when repetition count is unknown.

### 9. `do...while`

Ответ:

It runs body once before checking condition.

Рассуждение:

Useful when action must happen at least once.

Типичная ошибка:

Use it when zero executions should be possible.

Automation QA connection:

Can model first request before deciding retry.

### 10. `for`

Ответ:

`for` organizes initialization, condition and update in one line.

Рассуждение:

It is clear for counter-based loops.

Типичная ошибка:

Overload `for` header with complex logic.

Automation QA connection:

Useful for validating arrays of responses by index.

### 11. `break`

Ответ:

`break` exits loop immediately.

Рассуждение:

Use it when invalid response is found and no more checks are needed.

Типичная ошибка:

Think break only skips current iteration.

Automation QA connection:

Stop on first critical failure.

### 12. `continue`

Ответ:

`continue` skips rest of current iteration and moves to next iteration.

Рассуждение:

Use it to skip invalid test data but keep processing others.

Типичная ошибка:

Think continue stops loop.

Automation QA connection:

Skip users with missing optional data.

### 13. Infinite loops

Ответ:

They happen when condition never becomes false.

Рассуждение:

Usually update is missing or moves wrong way.

Типичная ошибка:

Debug body and ignore condition/update relationship.

Automation QA connection:

Endless retries can hang test runs.

### 14. Choosing loop

Ответ:

Use `for` for clear counter lifecycle, `while` for unknown repetition count, `do...while` when body must run once.

Рассуждение:

Choice depends on what is repeated and when condition is known.

Типичная ошибка:

Choose based only on habit.

Automation QA connection:

Different QA scenarios need different repetition models.

## Identify loop lifecycle

### Задача 1

Ответ:

Initialization: `let attempt = 1`.

Condition: `attempt <= 3`.

Body: `console.log(attempt)`.

Update: `attempt += 1`.

Stopping condition: `attempt` becomes `4`, so `attempt <= 3` is false.

Рассуждение:

Each iteration prints current attempt and increments it.

Типичная ошибка:

Forget that condition is checked before body.

Automation QA connection:

Retry loop lifecycle.

### Задача 2

Ответ:

Initialization: `let index = 0`.

Condition: `index < 3`.

Body: `console.log(index)`.

Update: `index += 1`.

Stopping condition: `index` becomes `3`.

Рассуждение:

It prints `0`, `1`, `2`.

Типичная ошибка:

Expect `3` to print.

Automation QA connection:

Array index validation.

### Задача 3

Ответ:

Initialization: `let shouldRetry = false`.

Condition: `shouldRetry`.

Body: `console.log('Run once')`.

Update: none in body.

Stopping condition: after first body execution, condition is false.

Рассуждение:

`do...while` runs body once before condition check.

Типичная ошибка:

Expect zero executions because condition is false.

Automation QA connection:

First request may happen before retry decision.

## Predict the output before running

### Задача 1

Ответ:

```text
0
1
2
```

Рассуждение:

Index starts at `0`, stops when it becomes `3`.

Типичная ошибка:

Include `3`.

Automation QA connection:

Three responses by index.

### Задача 2

Ответ:

```text
0
1
3
```

Рассуждение:

When index is `2`, `continue` skips `console.log`.

Типичная ошибка:

Think continue stops entire loop.

Automation QA connection:

Skip invalid test data item.

### Задача 3

Ответ:

```text
Attempt 1
Attempt 2
Attempt 3
```

Рассуждение:

Break happens after logging attempt `3`.

Типичная ошибка:

Expect attempts 4 and 5.

Automation QA connection:

Stop after success or critical state.

### Задача 4

Ответ:

```text
5
```

Рассуждение:

`do...while` runs body once before condition check. Then `attempt` is `6`, condition `6 < 3` is false.

Типичная ошибка:

Expect no output.

Automation QA connection:

Action that must happen before retry decision.

## Code reading

Ответ:

Repeated: response validation.

Loop stops when invalid response is found or when all responses are checked.

If status is not `200`, code prints invalid response and breaks.

Invalid response prints at index `1`.

Рассуждение:

First response is valid, second has status `500`, so break stops before third.

Типичная ошибка:

Expect third response to be checked.

Automation QA connection:

Stop on first invalid API response.

## Debugging tasks

### Задача 1

Ответ:

It can be infinite because `attempt` never changes.

Fix:

```javascript
let attempt = 1;

while (attempt <= 3) {
  console.log(attempt);
  attempt += 1;
}
```

Рассуждение:

Condition stays true forever without update.

Типичная ошибка:

Look only at body output, not update.

Automation QA connection:

Endless retries hang test runs.

### Задача 2

Ответ:

Because condition is `index <= 3`, so values `0`, `1`, `2`, `3` all pass.

Рассуждение:

If you want three iterations from zero, use `index < 3`.

Типичная ошибка:

Off-by-one error.

Automation QA connection:

Can check one extra row or response.

### Задача 3

Ответ:

`continue` at `index === 1` skips logging 1 and moves to next iteration.

`break` at `index === 3` stops loop entirely.

Output:

```text
0
2
```

Рассуждение:

Index 3 reaches break before logging.

Типичная ошибка:

Confuse break and continue.

Automation QA connection:

Skip bad data vs stop on critical failure.

## QA-oriented tasks

### Сценарий 1

Ответ:

```javascript
const responses = [
  { statusCode: 200 },
  { statusCode: 200 },
  { statusCode: 404 },
];

for (let index = 0; index < responses.length; index += 1) {
  const response = responses[index];

  if (response.statusCode !== 200) {
    console.log('Invalid response', index);
    break;
  }

  console.log('Valid response', index);
}
```

Рассуждение:

Loop repeats validation and stops at first invalid response.

Типичная ошибка:

Continue after critical invalid response.

Automation QA connection:

Batch API validation.

### Сценарий 2

Ответ:

```javascript
const maxAttempts = 3;

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  console.log('Attempt', attempt);
}
```

Рассуждение:

Known number of attempts fits `for`.

Типичная ошибка:

Use condition that allows four attempts.

Automation QA connection:

Retry limit.

### Сценарий 3

Ответ:

```javascript
const users = [
  { email: 'anna@example.com' },
  { email: '' },
  { email: 'kate@example.com' },
];

for (let index = 0; index < users.length; index += 1) {
  const user = users[index];

  if (user.email === '') {
    continue;
  }

  console.log('Process user', user.email);
}
```

Рассуждение:

Empty email user is skipped; loop continues.

Типичная ошибка:

Use break and stop processing remaining users.

Automation QA connection:

Skip invalid test data while keeping valid cases.

### Сценарий 4

Ответ:

Lifecycle:

```text
initialization: attempt = 1
condition: attempt <= maxAttempts and status is not ready
body: check current status
update: attempt += 1
stop: status becomes ready or max attempts reached
```

Рассуждение:

Polling repeats a check with a stopping condition.

Типичная ошибка:

Poll without max attempts.

Automation QA connection:

Avoid endless waits.

## Mini-project

Возможное решение:

```javascript
const responses = [
  { statusCode: 200 },
  { statusCode: 200 },
  { statusCode: 200 },
  { statusCode: 500 },
  { statusCode: 200 },
];

for (let index = 0; index < responses.length; index += 1) {
  const response = responses[index];

  if (response.statusCode !== 200) {
    console.log('Invalid response', index);
    break;
  }

  console.log('Valid response', index);
}

const users = [
  { email: 'anna@example.com' },
  { email: '' },
  { email: 'kate@example.com' },
];

for (let index = 0; index < users.length; index += 1) {
  const user = users[index];

  if (user.email === '') {
    continue;
  }

  console.log('Valid user', user.email);
}
```

Report:

```text
Loop       | Iteration | Decision                  | Action              | Stop reason
---------- | --------- | ------------------------- | ------------------- | ---------------------
responses  | 0         | status is 200             | print valid         | continue
responses  | 1         | status is 200             | print valid         | continue
responses  | 2         | status is 200             | print valid         | continue
responses  | 3         | status is not 200         | print invalid       | break
users      | 0         | email is not empty        | print user          | continue
users      | 1         | email is empty            | skip user           | continue
users      | 2         | email is not empty        | print user          | loop ends
```

Рассуждение:

First loop demonstrates `break`; second loop demonstrates `continue`.

Типичная ошибка:

Use `break` when invalid user should only be skipped.

Automation QA connection:

Real tests often stop on critical API failures but skip invalid optional data.
