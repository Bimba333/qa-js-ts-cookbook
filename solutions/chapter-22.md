# Решения. Глава 22. Loops

## Концептуальные вопросы

### 1. Why loops exist

Ответ:

Loops exist to repeat an algorithm until a stopping condition is reached.

Объяснение:

Validating 100 responses should not require 100 copied blocks.

Распространённая ошибка:

Think loop is only shorter syntax.

Связь с Automation QA:

Tests often validate many items.

### 2. Repeated execution

Ответ:

Repeated execution means running the same body multiple times.

Объяснение:

Each pass is controlled by condition and update.

Распространённая ошибка:

Forget condition controls repetition.

Связь с Automation QA:

Response validation repeats per response.

### 3. Loop condition

Ответ:

Loop condition decides whether repetition continues.

Объяснение:

When condition becomes false, loop stops.

Распространённая ошибка:

Write condition that never becomes false.

Связь с Automation QA:

Retry loops need max attempts.

### 4. Iteration

Ответ:

Iteration is one pass through loop body.

Объяснение:

If body runs three times, loop has three iterations.

Распространённая ошибка:

Confuse iteration with loop itself.

Связь с Automation QA:

One iteration can validate one response.

### 5. Loop body

Ответ:

Loop body contains repeated work.

Объяснение:

In response validation, body checks current response.

Распространённая ошибка:

Put initialization inside body accidentally.

Связь с Automation QA:

Body often contains assertion logic.

### 6. Initialization

Ответ:

Initialization prepares starting state.

Объяснение:

Example: `let index = 0`.

Распространённая ошибка:

Reinitialize counter inside body.

Связь с Automation QA:

Counters track attempts or response index.

### 7. Update step

Ответ:

Update changes loop state after each iteration.

Объяснение:

It moves loop toward stopping condition.

Распространённая ошибка:

Forget update and create infinite loop.

Связь с Automation QA:

Retry attempts must increment.

### 8. `while`

Ответ:

`while` checks condition before each body execution.

Объяснение:

If condition is false initially, body does not run.

Распространённая ошибка:

Expect body to run once always.

Связь с Automation QA:

Useful when repetition count is unknown.

### 9. `do...while`

Ответ:

It runs body once before checking condition.

Объяснение:

Useful when action must happen at least once.

Распространённая ошибка:

Use it when zero executions should be possible.

Связь с Automation QA:

Can model first request before deciding retry.

### 10. `for`

Ответ:

`for` organizes initialization, condition and update in one line.

Объяснение:

It is clear for counter-based loops.

Распространённая ошибка:

Overload `for` header with complex logic.

Связь с Automation QA:

Useful for validating arrays of responses by index.

### 11. `break`

Ответ:

`break` exits loop immediately.

Объяснение:

Use it when invalid response is found and no more checks are needed.

Распространённая ошибка:

Think break only skips current iteration.

Связь с Automation QA:

Stop on first critical failure.

### 12. `continue`

Ответ:

`continue` skips rest of current iteration and moves to next iteration.

Объяснение:

Use it to skip invalid test data but keep processing others.

Распространённая ошибка:

Think continue stops loop.

Связь с Automation QA:

Skip users with missing optional data.

### 13. Infinite loops

Ответ:

They happen when condition never becomes false.

Объяснение:

Usually update is missing or moves wrong way.

Распространённая ошибка:

Debug body and ignore condition/update relationship.

Связь с Automation QA:

Endless retries can hang test runs.

### 14. Choosing loop

Ответ:

Use `for` for clear counter lifecycle, `while` for unknown repetition count, `do...while` when body must run once.

Объяснение:

Choice depends on what is repeated and when condition is known.

Распространённая ошибка:

Choose based only on habit.

Связь с Automation QA:

Different QA scenarios need different repetition models.

## Определите loop lifecycle

### Задача 1

Ответ:

Initialization: `let attempt = 1`.

Condition: `attempt <= 3`.

Body: `console.log(attempt)`.

Update: `attempt += 1`.

Stopping condition: `attempt` becomes `4`, so `attempt <= 3` is false.

Объяснение:

Each iteration prints current attempt and increments it.

Распространённая ошибка:

Forget that condition is checked before body.

Связь с Automation QA:

Retry loop lifecycle.

### Задача 2

Ответ:

Initialization: `let index = 0`.

Condition: `index < 3`.

Body: `console.log(index)`.

Update: `index += 1`.

Stopping condition: `index` becomes `3`.

Объяснение:

It prints `0`, `1`, `2`.

Распространённая ошибка:

Expect `3` to print.

Связь с Automation QA:

Array index validation.

### Задача 3

Ответ:

Initialization: `let shouldRetry = false`.

Condition: `shouldRetry`.

Body: `console.log('Run once')`.

Update: none in body.

Stopping condition: after first body execution, condition is false.

Объяснение:

`do...while` runs body once before condition check.

Распространённая ошибка:

Expect zero executions because condition is false.

Связь с Automation QA:

First request may happen before retry decision.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
0
1
2
```

Объяснение:

Index starts at `0`, stops when it becomes `3`.

Распространённая ошибка:

Include `3`.

Связь с Automation QA:

Three responses by index.

### Задача 2

Ответ:

```text
0
1
3
```

Объяснение:

When index is `2`, `continue` skips `console.log`.

Распространённая ошибка:

Think continue stops entire loop.

Связь с Automation QA:

Skip invalid test data item.

### Задача 3

Ответ:

```text
Attempt 1
Attempt 2
Attempt 3
```

Объяснение:

Break happens after logging attempt `3`.

Распространённая ошибка:

Expect attempts 4 and 5.

Связь с Automation QA:

Stop after success or critical state.

### Задача 4

Ответ:

```text
5
```

Объяснение:

`do...while` runs body once before condition check. Then `attempt` is `6`, condition `6 < 3` is false.

Распространённая ошибка:

Expect no output.

Связь с Automation QA:

Action that must happen before retry decision.

## Чтение кода

Ответ:

Repeated: response validation.

Loop stops when invalid response is found or when all responses are checked.

If status is not `200`, code prints invalid response and breaks.

Invalid response prints at index `1`.

Объяснение:

First response is valid, second has status `500`, so break stops before third.

Распространённая ошибка:

Expect third response to be checked.

Связь с Automation QA:

Stop on first invalid API response.

## Задачи на отладку

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

Объяснение:

Condition stays true forever without update.

Распространённая ошибка:

Look only at body output, not update.

Связь с Automation QA:

Endless retries hang test runs.

### Задача 2

Ответ:

Because condition is `index <= 3`, so values `0`, `1`, `2`, `3` all pass.

Объяснение:

If you want three iterations from zero, use `index < 3`.

Распространённая ошибка:

Off-by-one error.

Связь с Automation QA:

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

Объяснение:

Index 3 reaches break before logging.

Распространённая ошибка:

Confuse break and continue.

Связь с Automation QA:

Skip bad data vs stop on critical failure.

## QA-задачи

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

Объяснение:

Loop repeats validation and stops at first invalid response.

Распространённая ошибка:

Continue after critical invalid response.

Связь с Automation QA:

Batch API validation.

### Сценарий 2

Ответ:

```javascript
const maxAttempts = 3;

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  console.log('Attempt', attempt);
}
```

Объяснение:

Known number of attempts fits `for`.

Распространённая ошибка:

Use condition that allows four attempts.

Связь с Automation QA:

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

Объяснение:

Empty email user is skipped; loop continues.

Распространённая ошибка:

Use break and stop processing remaining users.

Связь с Automation QA:

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

Объяснение:

Polling repeats a check with a stopping condition.

Распространённая ошибка:

Poll without max attempts.

Связь с Automation QA:

Avoid endless waits.

## Мини-проект

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

Объяснение:

First loop demonstrates `break`; second loop demonstrates `continue`.

Распространённая ошибка:

Use `break` when invalid user should only be skipped.

Связь с Automation QA:

Real tests often stop on critical API failures but skip invalid optional data.
