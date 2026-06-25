# Практика. Глава 21. Conditionals

## Концептуальные вопросы

Ответьте своими словами.

1. Why do conditionals exist?
2. What does it mean that program chooses execution path?
3. What happens before `if` chooses a branch?
4. What is Boolean decision making?
5. What does `else` add?
6. When is `else if` useful?
7. When are nested conditions useful?
8. What does `switch` evaluate?
9. What does `default` branch do?
10. Why should conditional logic be readable?
11. Why does JavaScript not randomly choose branches?
12. How do conditionals connect to operators?

## Identify execution path

Для каждого примера укажите:

* evaluated expression;
* result;
* chosen path;
* skipped path.

### Задача 1

```javascript
const statusCode = 200;

if (statusCode === 200) {
  console.log('Success');
}
```

### Задача 2

```javascript
const statusCode = 500;

if (statusCode === 200) {
  console.log('Success');
} else {
  console.log('Failure');
}
```

### Задача 3

```javascript
const environment = 'local';

switch (environment) {
  case 'local':
    console.log('Local');
    break;
  case 'staging':
    console.log('Staging');
    break;
  default:
    console.log('Production');
}
```

## Predict the output before running

### Задача 1

```javascript
const statusCode = 404;

if (statusCode === 200) {
  console.log('Success');
} else {
  console.log('Not success');
}
```

### Задача 2

```javascript
const statusCode = 503;

if (statusCode === 200) {
  console.log('Success');
} else if (statusCode === 404) {
  console.log('Not found');
} else if (statusCode >= 500) {
  console.log('Server error');
} else {
  console.log('Unexpected');
}
```

### Задача 3

```javascript
const statusCode = 200;
const responseBody = {};

if (statusCode === 200) {
  if ('id' in responseBody) {
    console.log('Has id');
  } else {
    console.log('Missing id');
  }
} else {
  console.log('Bad status');
}
```

### Задача 4

```javascript
const environment = 'qa';

switch (environment) {
  case 'local':
    console.log('Local');
    break;
  case 'staging':
    console.log('Staging');
    break;
  default:
    console.log('Default');
}
```

## Code reading

Прочитайте код и ответьте:

1. What decision is the program making?
2. Which expression is evaluated first?
3. Which path runs?
4. How could names improve readability?

```javascript
const statusCode = 200;
const responseTimeMs = 350;
const hasUserId = true;

if (statusCode === 200 && responseTimeMs < 500 && hasUserId) {
  console.log('Valid response');
} else {
  console.log('Invalid response');
}
```

## Debugging tasks

### Задача 1

Почему branch runs, хотя initial status is `500`?

```javascript
let statusCode = 500;

if (statusCode = 200) {
  console.log('Success');
}

console.log(statusCode);
```

### Задача 2

Почему `id` with value `0` может быть проблемой для такого condition?

```javascript
const responseBody = {
  id: 0,
};

if (responseBody.id) {
  console.log('Has id');
} else {
  console.log('Missing id');
}
```

### Задача 3

Как улучшить readability?

```javascript
if (statusCode === 200 && responseTimeMs < 500 && hasUserId && !isDeleted) {
  console.log('Valid');
}
```

## QA-oriented tasks

### Сценарий 1. Status code validation

Напишите conditional:

* if status is 200, print `Validate body`;
* otherwise print `Report status error`.

### Сценарий 2. Retry decision

Напишите conditional:

* if status is 500 or greater, print `Retry may be needed`;
* otherwise print `No retry`.

### Сценарий 3. Environment selection

Use `switch` for:

* `local`;
* `staging`;
* default.

### Сценарий 4. Choosing assertions

If `responseType` is `user`, print `Assert user fields`; otherwise print `Assert generic response`.

## Mini-project

Создайте файл:

```text
playground/conditional-response-check.js
```

В нем:

1. Создайте object `response`:
   * `statusCode`;
   * `responseTimeMs`;
   * `body`.
2. If status is not 200, print status error.
3. Else validate:
   * response time less than 500;
   * body has `id`;
   * body has `email`.
4. Use readable named expressions.
5. Add `switch` for environment:
   * `local`;
   * `staging`;
   * default.
6. Print report:

```text
Decision | Expression result | Chosen path | QA meaning
```
