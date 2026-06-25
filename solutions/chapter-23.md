# Решения. Глава 23. Error Handling

## Концептуальные вопросы

### 1. Normal execution

Ответ:

Normal execution is the usual forward flow of program statements.

Рассуждение:

One operation succeeds, then next line can use its result.

Типичная ошибка:

Assume normal path continues even after critical failure.

Automation QA connection:

Successful API parsing allows response validation.

### 2. Abnormal execution

Ответ:

Abnormal execution happens when error interrupts normal flow.

Рассуждение:

Invalid JSON prevents parsed object from existing.

Типичная ошибка:

Treat error as just another value.

Automation QA connection:

Test should not validate missing response body.

### 3. Error

Ответ:

Error is a signal that execution cannot continue normally as expected.

Рассуждение:

It changes execution path.

Типичная ошибка:

Think error handling means making failure disappear.

Automation QA connection:

Errors should explain test failure.

### 4. Runtime error

Ответ:

Runtime error happens while program is running.

Рассуждение:

`JSON.parse('not valid json')` fails during execution.

Типичная ошибка:

Confuse runtime error with syntax error.

Automation QA connection:

Runtime data from API can be invalid.

### 5. Why program stops

Ответ:

Program stops because continuing normal path may be unsafe or impossible.

Рассуждение:

No parsed object means field validation cannot run correctly.

Типичная ошибка:

Continue after setup failure.

Automation QA connection:

Stopping test can be correct behavior.

### 6. `throw`

Ответ:

`throw` intentionally starts error path.

Рассуждение:

It interrupts normal execution.

Типичная ошибка:

Expect code after throw in same path to run.

Automation QA connection:

Throw clear error when API status is wrong.

### 7. `try`

Ответ:

`try` marks code where error may happen.

Рассуждение:

It creates a controlled area for possible failure.

Типичная ошибка:

Wrap too much unrelated code in one try.

Automation QA connection:

Parsing response body can be inside try.

### 8. `catch`

Ответ:

`catch` handles error from try block.

Рассуждение:

It receives error and can log, recover or decide to stop.

Типичная ошибка:

Empty catch block.

Automation QA connection:

Catch can add clear failure context.

### 9. `finally`

Ответ:

`finally` runs after try/catch flow whether success or failure happened.

Рассуждение:

Useful for cleanup-like operations.

Типичная ошибка:

Think finally means operation succeeded.

Automation QA connection:

Cleanup temporary data.

### 10. Error propagation

Ответ:

If error is not handled locally, it moves conceptually to outer level.

Рассуждение:

Later functions will make this more visible.

Типичная ошибка:

Think every error must be caught immediately.

Automation QA connection:

Some errors should fail test framework directly.

### 11. Where to handle

Ответ:

Handle error where meaningful action can be taken.

Рассуждение:

If current level cannot recover or improve message, let error propagate.

Типичная ошибка:

Catch every error too early.

Automation QA connection:

Setup failure should often stop the test.

### 12. Do not hide errors

Ответ:

Hidden errors make tests misleading.

Рассуждение:

A test that ignores setup failure may fail later with unclear message.

Типичная ошибка:

Catch and ignore.

Automation QA connection:

Reliable tests fail clearly.

## Identify execution flow

### Задача 1

Ответ:

Normal path starts in try. `JSON.parse` fails. `console.log('Parsed')` does not run. Catch prints `Invalid JSON`. Then `After` prints.

Output:

```text
Invalid JSON
After
```

Рассуждение:

Error jumps from failing operation to catch.

Типичная ошибка:

Expect `Parsed` to print.

Automation QA connection:

Validation after invalid JSON should not run.

### Задача 2

Ответ:

No error occurs. Catch does not run. Finally runs.

Output:

```text
Start
Success
Cleanup
```

Рассуждение:

Finally runs on success too.

Типичная ошибка:

Think finally only runs after errors.

Automation QA connection:

Cleanup after successful test setup.

### Задача 3

Ответ:

`throw` starts error path. There is no catch here, but finally runs before error continues outward. If run directly, script ends with thrown error after printing cleanup.

Output before termination:

```text
Cleanup
```

Рассуждение:

Finally does not swallow error.

Типичная ошибка:

Think finally handles error.

Automation QA connection:

Cleanup can run even when test fails.

## Predict the output before running

### Задача 1

Ответ:

```text
A
B
D
```

Рассуждение:

`throw` skips `console.log('C')`; catch prints error message.

Типичная ошибка:

Expect C to run.

Automation QA connection:

Validation after failed step does not run.

### Задача 2

Ответ:

```text
Start
Finally
```

Рассуждение:

No error, so catch skipped. Finally still runs.

Типичная ошибка:

Expect catch to run always.

Automation QA connection:

Cleanup after success.

### Задача 3

Ответ:

```text
Stop test
```

Рассуждение:

Status is not 200, so error is thrown; body validation does not run.

Типичная ошибка:

Expect `Validate body` after throw.

Automation QA connection:

Stop validation after bad status.

## Code reading

Ответ:

Operation that can fail: `JSON.parse(rawBody)`.

If parsing fails, catch runs.

Field validation `console.log(body.id)` does not run.

QA debugging should log that response body is invalid and ideally include safe context about operation/input.

Рассуждение:

No parsed body exists after parse error.

Типичная ошибка:

Try to validate fields after parse failure.

Automation QA connection:

Invalid JSON should produce clear test failure.

## Debugging tasks

### Задача 1

Ответ:

It is bad because it swallows error and loses information.

Better:

```javascript
try {
  JSON.parse(rawBody);
} catch (error) {
  console.log('Invalid JSON response:', error.message);
}
```

Рассуждение:

Catch should handle, not hide.

Типичная ошибка:

Empty catch.

Automation QA connection:

Hidden parsing failures make tests misleading.

### Задача 2

Ответ:

`Failed` does not explain what failed or why.

Better:

```javascript
throw new Error('Expected status 200, received 500');
```

Рассуждение:

Useful error message includes expectation and actual state.

Типичная ошибка:

Throw generic message.

Automation QA connection:

Clear failure messages speed up debugging.

### Задача 3

Ответ:

Continuing after setup failure is dangerous because test lacks required data.

Рассуждение:

Later failure may be misleading.

Типичная ошибка:

Ignore setup error to keep test running.

Automation QA connection:

Fail fast on critical setup failures.

## QA-oriented tasks

### Сценарий 1

Ответ:

```javascript
const statusCode = 500;

try {
  if (statusCode !== 200) {
    throw new Error(`Expected status 200, received ${statusCode}`);
  }
} catch (error) {
  console.log(error.message);
}
```

Рассуждение:

Bad status interrupts normal validation path.

Типичная ошибка:

Continue to body validation.

Automation QA connection:

Status validation failure should be clear.

### Сценарий 2

Ответ:

```javascript
const rawBody = '{ "id": 101 }';

try {
  const body = JSON.parse(rawBody);
  console.log(body.id);
} catch (error) {
  console.log('Could not parse response body:', error.message);
}
```

Рассуждение:

Parsing may fail, so try/catch gives controlled path.

Типичная ошибка:

Catch but do not log useful context.

Automation QA connection:

API parsing failures are common.

### Сценарий 3

Ответ:

```javascript
try {
  console.log('Create temporary user');
  throw new Error('Validation failed');
} catch (error) {
  console.log('Handle error');
} finally {
  console.log('Delete temporary user');
}
```

Рассуждение:

Finally runs after failure handling.

Типичная ошибка:

Put cleanup only after successful operation.

Automation QA connection:

Temporary data should be cleaned up.

### Сценарий 4

Ответ:

```text
Invalid optional screenshot cleanup → handle locally and log
Login setup failed                 → let test stop / throw clear error
API returned invalid JSON          → usually stop validation with clear error
Temporary log file cannot be deleted → handle locally and log
```

Рассуждение:

Handle locally when recovery or useful logging is possible. Stop when test cannot continue meaningfully.

Типичная ошибка:

Treat all errors the same.

Automation QA connection:

Different failure severity requires different handling.

## Mini-project

Возможное решение:

```javascript
const response = {
  statusCode: 200,
  rawBody: '{ "id": 101 }',
};

try {
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, received ${response.statusCode}`);
  }

  const body = JSON.parse(response.rawBody);

  if (!('id' in body)) {
    throw new Error('Response body does not contain id');
  }

  console.log('Valid response id:', body.id);
} catch (error) {
  console.log('Response validation failed:', error.message);
} finally {
  console.log('Cleanup test data');
}
```

Report:

```text
Step              | Normal path             | Error path                  | What happens to execution now
----------------- | ----------------------- | --------------------------- | ------------------------------
status check      | continue to parsing      | throw status error          | catch handles message
JSON parse        | body object is available | throw parsing error         | field validation skipped
id validation     | print valid id           | throw missing id error      | catch handles message
finally           | cleanup runs             | cleanup also runs           | execution leaves controlled flow
```

Рассуждение:

Each risky operation has a clear failure path.

Типичная ошибка:

Put all failures behind generic `Failed`.

Automation QA connection:

This is a practical API validation pattern.
