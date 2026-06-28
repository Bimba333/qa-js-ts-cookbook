# Решения. Глава 23. Error Handling

## Концептуальные вопросы

### 1. Normal execution

Ответ:

Нормальное выполнение — это обычный прямой поток инструкций программы.

Объяснение:

One operation succeeds, then next line can use its result.

Распространённая ошибка:

Assume normal path continues even after critical failure.

Связь с Automation QA:

Successful API parsing allows response validation.

### 2. Abnormal execution

Ответ:

Abnormal execution happens when error interrupts normal flow.

Объяснение:

Invalid JSON prevents parsed object from existing.

Распространённая ошибка:

Treat error as just another value.

Связь с Automation QA:

Test should not validate missing response body.

### 3. Error

Ответ:

Error is a signal that execution cannot continue normally as expected.

Объяснение:

It changes execution path.

Распространённая ошибка:

Think error handling means making failure disappear.

Связь с Automation QA:

Errors should explain test failure.

### 4. Runtime error

Ответ:

Runtime error happens while program is running.

Объяснение:

`JSON.parse('not valid json')` fails during execution.

Распространённая ошибка:

Confuse runtime error with syntax error.

Связь с Automation QA:

Runtime data from API can be invalid.

### 5. Why program stops

Ответ:

Program stops because continuing normal path may be unsafe or impossible.

Объяснение:

No parsed object means поле validation cannot run correctly.

Распространённая ошибка:

Continue after setup failure.

Связь с Automation QA:

Stopping test can be correct поведение.

### 6. `throw`

Ответ:

`throw` intentionally starts error path.

Объяснение:

It interrupts normal execution.

Распространённая ошибка:

Expect code after throw in same path to run.

Связь с Automation QA:

Throw clear error when API status is wrong.

### 7. `try`

Ответ:

`try` marks code where error may happen.

Объяснение:

It creates a controlled area for possible failure.

Распространённая ошибка:

Wrap too much unrelated code in one try.

Связь с Automation QA:

Parsing response body can be inside try.

### 8. `catch`

Ответ:

`catch` handles error from try block.

Объяснение:

It receives error and can log, recover or decide to stop.

Распространённая ошибка:

Empty catch block.

Связь с Automation QA:

Catch can add clear failure context.

### 9. `finally`

Ответ:

`finally` runs after try/catch flow whether success or failure happened.

Объяснение:

Useful for cleanup-like operations.

Распространённая ошибка:

Think finally means operation succeeded.

Связь с Automation QA:

Cleanup temporary data.

### 10. Error propagation

Ответ:

If error is not handled locally, it moves conceptually to outer level.

Объяснение:

Later functions will make this more visible.

Распространённая ошибка:

Think every error must be caught immediately.

Связь с Automation QA:

Some errors should fail test framework directly.

### 11. Where to handle

Ответ:

Handle error where meaningful action can be taken.

Объяснение:

If current level cannot recover or improve message, let error propagate.

Распространённая ошибка:

Catch every error too early.

Связь с Automation QA:

Setup failure should often stop the test.

### 12. Do not hide errors

Ответ:

Hidden errors make tests misleading.

Объяснение:

A test that ignores setup failure may fail later with unclear message.

Распространённая ошибка:

Catch and ignore.

Связь с Automation QA:

Reliable tests fail clearly.

## Определите execution flow

### Задача 1

Ответ:

Normal path starts in try. `JSON.parse` fails. `console.log('Parsed')` does not run. Catch prints `Invalid JSON`. Then `After` prints.

Вывод:

```text
Invalid JSON
After
```

Объяснение:

Error jumps from failing operation to catch.

Распространённая ошибка:

Expect `Parsed` to print.

Связь с Automation QA:

Validation after invalid JSON should not run.

### Задача 2

Ответ:

No error occurs. Catch does not run. Finally runs.

Вывод:

```text
Start
Success
Cleanup
```

Объяснение:

Finally runs on success too.

Распространённая ошибка:

Think finally only runs after errors.

Связь с Automation QA:

Cleanup after successful test setup.

### Задача 3

Ответ:

`throw` starts error path. There is no catch here, but finally runs before error continues outward. If run directly, script ends with thrown error after printing cleanup.

Вывод до завершения:

```text
Cleanup
```

Объяснение:

Finally does not swallow error.

Распространённая ошибка:

Think finally handles error.

Связь с Automation QA:

Cleanup can run even when test fails.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
A
B
D
```

Объяснение:

`throw` skips `console.log('C')`; catch prints error message.

Распространённая ошибка:

Expect C to run.

Связь с Automation QA:

Validation after failed step does not run.

### Задача 2

Ответ:

```text
Start
Finally
```

Объяснение:

No error, so catch skipped. Finally still runs.

Распространённая ошибка:

Expect catch to run always.

Связь с Automation QA:

Cleanup after success.

### Задача 3

Ответ:

```text
Stop test
```

Объяснение:

Status is not 200, so error is thrown; body validation does not run.

Распространённая ошибка:

Expect `Validate body` after throw.

Связь с Automation QA:

Stop validation after bad status.

## Чтение кода

Ответ:

Operation that can fail: `JSON.parse(rawBody)`.

If parsing fails, catch runs.

Field validation `console.log(body.id)` does not run.

QA debugging should log that response body is invalid and ideally include safe context about operation/вход.

Объяснение:

No parsed body exists after parse error.

Распространённая ошибка:

Пытаться проверять поля после ошибки парсинга.

Связь с Automation QA:

Invalid JSON should produce clear test failure.

## Задачи на отладку

### Задача 1

Ответ:

It is bad because it swallows error and loses information.

Лучше:

```javascript
try {
  JSON.parse(rawBody);
} catch (error) {
  console.log('Invalid JSON response:', error.message);
}
```

Объяснение:

Catch should handle, not hide.

Распространённая ошибка:

Empty catch.

Связь с Automation QA:

Hidden parsing failures make tests misleading.

### Задача 2

Ответ:

`Failed` does not explain what failed or why.

Лучше:

```javascript
throw new Error('Expected status 200, received 500');
```

Объяснение:

Useful error message includes expectation and actual состояние.

Распространённая ошибка:

Throw generic message.

Связь с Automation QA:

Clear failure messages speed up debugging.

### Задача 3

Ответ:

Continuing after setup failure is dangerous because test lacks required data.

Объяснение:

Later failure may be misleading.

Распространённая ошибка:

Ignore setup error to keep test running.

Связь с Automation QA:

Fail fast on critical setup failures.

## QA-задачи

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

Объяснение:

Bad status interrupts normal validation path.

Распространённая ошибка:

Continue to body validation.

Связь с Automation QA:

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

Объяснение:

Parsing may fail, so try/catch gives controlled path.

Распространённая ошибка:

Catch but do not log useful context.

Связь с Automation QA:

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

Объяснение:

Finally runs after failure handling.

Распространённая ошибка:

Put cleanup only after successful operation.

Связь с Automation QA:

Temporary data should be cleaned up.

### Сценарий 4

Ответ:

```text
Invalid optional screenshot cleanup → handle locally and log
Login setup failed                 → let test stop / throw clear error
API returned invalid JSON          → usually stop validation with clear error
Temporary log file cannot be deleted → handle locally and log
```

Объяснение:

Handle locally when recovery or useful logging is possible. Stop when test cannot continue meaningfully.

Распространённая ошибка:

Treat all errors the same.

Связь с Automation QA:

Different failure severity requires different handling.

## Мини-проект

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

Отчёт:

```text
Step              | Normal path             | Error path                  | What happens to execution now
----------------- | ----------------------- | --------------------------- | ------------------------------
status check      | continue to parsing      | throw status error          | catch handles message
JSON parse        | body object is available | throw parsing error         | field validation skipped
id validation     | print valid id           | throw missing id error      | catch handles message
finally           | cleanup runs             | cleanup also runs           | execution leaves controlled flow
```

Объяснение:

Each risky operation has a clear failure path.

Распространённая ошибка:

Put all failures behind generic `Failed`.

Связь с Automation QA:

This is a practical API validation pattern.
