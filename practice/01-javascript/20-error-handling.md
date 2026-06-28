# Практика. Глава 23. Error Handling

## Концептуальные вопросы

Ответьте своими словами.

1. Что такое normal execution?
2. Что такое abnormal execution?
3. What is an error?
4. Что такое runtime error?
5. Почему программа может остановиться после error?
6. Что делает `throw`?
7. Что отмечает `try`?
8. What does `catch` handle?
9. What does `finally` do at a high level?
10. What is error propagation conceptually?
11. How do you choose where to handle error?
12. Why should tests not hide errors?

## Определите execution flow

Для каждого примера укажите:

* normal path;
* error path;
* catch path;
* finally path if present;
* whether execution continues.

### Задача 1

```javascript
try {
  JSON.parse('not valid json');
  console.log('Parsed');
} catch (error) {
  console.log('Invalid JSON');
}

console.log('After');
```

### Задача 2

```javascript
try {
  console.log('Start');
  console.log('Success');
} catch (error) {
  console.log('Error');
} finally {
  console.log('Cleanup');
}
```

### Задача 3

```javascript
try {
  throw new Error('Bad status');
} finally {
  console.log('Cleanup');
}
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
try {
  console.log('A');
  throw new Error('B');
  console.log('C');
} catch (error) {
  console.log(error.message);
}

console.log('D');
```

### Задача 2

```javascript
try {
  console.log('Start');
} catch (error) {
  console.log('Catch');
} finally {
  console.log('Finally');
}
```

### Задача 3

```javascript
const statusCode = 404;

try {
  if (statusCode !== 200) {
    throw new Error('Unexpected status');
  }

  console.log('Validate body');
} catch (error) {
  console.log('Stop test');
}
```

## Чтение кода

Прочитайте код и ответьте:

1. What operation can fail?
2. What happens if parsing fails?
3. Does поле validation run after parsing error?
4. What should be logged for QA debugging?

```javascript
const rawBody = 'not valid json';

try {
  const body = JSON.parse(rawBody);
  console.log(body.id);
} catch (error) {
  console.log('Invalid response body');
}
```

## Задачи на отладку

### Задача 1

Почему это плохой catch?

```javascript
try {
  JSON.parse(rawBody);
} catch (error) {
}
```

### Задача 2

Почему сообщение об ошибке плохо помогает debugging?

```javascript
throw new Error('Failed');
```

### Задача 3

Почему продолжать test после setup failure может быть опасно?

```javascript
try {
  throw new Error('Could not create user');
} catch (error) {
  console.log('Ignoring setup error');
}

console.log('Run test');
```

## QA-задачи

### Сценарий 1. Status validation

Напишите код:

* if status is not 200, throw clear error;
* catch error and log message.

### Сценарий 2. JSON parsing

Напишите код:

* parse raw body inside try;
* log `body.id` if parsing succeeds;
* catch parsing error with clear message.

### Сценарий 3. Cleanup

Напишите код:

* print `Create temporary user`;
* simulate failure with throw;
* catch error;
* finally print `Delete temporary user`.

### Сценарий 4. Decide local handling

Для каждого случая решите: handle locally or let test stop?

```text
Invalid optional screenshot cleanup
Login setup failed
API returned invalid JSON
Temporary log file cannot be deleted
```

## Мини-проект

Создайте файл:

```text
playground/error-handling-response-check.js
```

В нем:

1. Create response object:
   * `statusCode`;
   * `rawBody`.
2. Use `try`.
3. If status is not `200`, throw error with actual status.
4. Parse `rawBody`.
5. Validate that parsed body has `id`.
6. Use `catch` to print clear error message.
7. Use `finally` to print cleanup message.
8. Add report:

```text
Step | Normal path | Error path | What happens to execution now
```
