# Практика. Глава 22. Loops

## Концептуальные вопросы

Ответьте своими словами.

1. Why do loops exist?
2. What is repeated execution?
3. What is loop condition?
4. What is iteration?
5. What is loop body?
6. What is initialization?
7. What is update step?
8. How does `while` work?
9. How does `do...while` differ from `while`?
10. How does `for` organize loop lifecycle?
11. What does `break` do?
12. What does `continue` do?
13. Why do infinite loops happen?
14. How do you choose appropriate loop?

## Определите loop lifecycle

Для каждого примера укажите:

* initialization;
* condition;
* body;
* update;
* stopping condition.

### Задача 1

```javascript
let attempt = 1;

while (attempt <= 3) {
  console.log(attempt);
  attempt += 1;
}
```

### Задача 2

```javascript
for (let index = 0; index < 3; index += 1) {
  console.log(index);
}
```

### Задача 3

```javascript
let shouldRetry = false;

do {
  console.log('Run once');
} while (shouldRetry);
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
let index = 0;

while (index < 3) {
  console.log(index);
  index += 1;
}
```

### Задача 2

```javascript
for (let index = 0; index < 4; index += 1) {
  if (index === 2) {
    continue;
  }

  console.log(index);
}
```

### Задача 3

```javascript
for (let attempt = 1; attempt <= 5; attempt += 1) {
  console.log('Attempt', attempt);

  if (attempt === 3) {
    break;
  }
}
```

### Задача 4

```javascript
let attempt = 5;

do {
  console.log(attempt);
  attempt += 1;
} while (attempt < 3);
```

## Чтение кода

Прочитайте код и ответьте:

1. What is repeated?
2. When does loop stop?
3. What happens if status is not `200`?
4. Which iteration prints invalid response?

```javascript
const responses = [
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
```

## Задачи на отладку

### Задача 1

Почему этот loop может быть infinite?

```javascript
let attempt = 1;

while (attempt <= 3) {
  console.log(attempt);
}
```

### Задача 2

Почему loop выполняется 4 раза, а не 3?

```javascript
for (let index = 0; index <= 3; index += 1) {
  console.log(index);
}
```

### Задача 3

Чем `break` отличается от `continue` в этом коде?

```javascript
for (let index = 0; index < 5; index += 1) {
  if (index === 1) {
    continue;
  }

  if (index === 3) {
    break;
  }

  console.log(index);
}
```

## QA-задачи

### Сценарий 1. Validate many responses

Есть responses:

```javascript
const responses = [
  { statusCode: 200 },
  { statusCode: 200 },
  { statusCode: 404 },
];
```

Напишите loop, который проверяет status and stops on first invalid response.

### Сценарий 2. Retry attempts

Напишите loop for maximum 3 attempts.

Каждая iteration должна печатать attempt number.

### Сценарий 3. Skip invalid test data

Есть users:

```javascript
const users = [
  { email: 'anna@example.com' },
  { email: '' },
  { email: 'kate@example.com' },
];
```

Напишите loop, который skips users with empty email.

### Сценарий 4. Polling concept

Опишите loop lifecycle for polling status until it becomes `ready` or max attempts reached.

## Мини-проект

Создайте файл:

```text
playground/loop-response-validator.js
```

В нем:

1. Создайте array `responses` with at least 5 objects.
2. Some responses should have status `200`.
3. One response should have status `500`.
4. Use `for` loop to validate responses.
5. Print valid response index.
6. Stop on first invalid response using `break`.
7. Add second loop over users.
8. Skip user with empty email using `continue`.
9. Print report:

```text
Loop | Iteration | Decision | Action | Stop reason
```
