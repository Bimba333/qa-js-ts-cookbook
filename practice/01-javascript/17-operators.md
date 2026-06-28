# Практика. Глава 20. Operators

## Концептуальные вопросы

Ответьте своими словами.

1. Что такое operator?
2. Что такое operand?
3. Что такое результат operator?
4. Why are operators grouped into categories?
5. What is unary operator?
6. What is binary operator?
7. What is ternary operator?
8. What do arithmetic operators do?
9. What do comparison operators do?
10. What do logical operators do at a high level?
11. What do assignment operators do?
12. What does `typeof` return?
13. Что делает `delete` на высоком уровне?
14. Что проверяет `in`?
15. Why does operator precedence exist?

## Определите operator category

Для каждого выражения укажите:

* operator;
* operands;
* category;
* result type.

### Задача 1

```javascript
2 + 3;
```

### Задача 2

```javascript
statusCode === 200;
```

### Задача 3

```javascript
isReady && hasUser;
```

### Задача 4

```javascript
typeof userName;
```

### Задача 5

```javascript
'id' in responseBody;
```

### Задача 6

```javascript
retryCount += 1;
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
const itemPrice = 100;
const itemCount = 2;

console.log(itemPrice * itemCount);
console.log(itemPrice + itemCount);
```

### Задача 2

```javascript
const statusCode = 200;
const responseTimeMs = 450;

console.log(statusCode === 200);
console.log(responseTimeMs < 300);
console.log(responseTimeMs >= 400);
```

### Задача 3

```javascript
const isStatusOk = true;
const hasUserId = false;

console.log(isStatusOk && hasUserId);
console.log(isStatusOk || hasUserId);
console.log(!hasUserId);
```

### Задача 4

```javascript
const responseBody = {
  id: 101,
  name: 'Anna',
};

console.log(typeof responseBody.name);
console.log('id' in responseBody);
console.log('role' in responseBody);
```

### Задача 5

```javascript
console.log(2 + 3 * 4);
console.log((2 + 3) * 4);
```

## Чтение кода

Прочитайте код и ответьте:

1. Какие operators используются?
2. Какие operands у каждого operator?
3. Какие results будут получены?
4. Где возможна type conversion ошибка?

```javascript
const retryCountFromEnv = '3';
const statusCode = 200;
const responseBody = {
  id: 101,
};

const nextRetryCount = retryCountFromEnv + 1;
const isSuccess = statusCode === 200;
const hasId = 'id' in responseBody;

console.log(nextRetryCount);
console.log(isSuccess);
console.log(hasId);
```

## Задачи на отладку

### Задача 1

Ожидали `4`, получили `'31'`.

```javascript
const retryCount = '3';
const nextRetryCount = retryCount + 1;

console.log(nextRetryCount);
```

Какой operator используется and what operation is being performed?

### Задача 2

Почему result равен `14`, а не `20`?

```javascript
const result = 2 + 3 * 4;

console.log(result);
```

### Задача 3

Почему проверка не проверяет value?

```javascript
const responseBody = {
  id: 101,
};

console.log('id' in responseBody);
```

### Задача 4

Что изменится в object?

```javascript
const user = {
  name: 'Anna',
  temporaryCode: '1234',
};

delete user.temporaryCode;

console.log('temporaryCode' in user);
```

## QA-задачи

### Сценарий 1. Assertion expression

Напишите expression, который проверяет:

* `statusCode` equals `200`;
* `responseTimeMs` less than `500`;
* both checks are true.

### Сценарий 2. Debug type

API вернул:

```javascript
const statusCode = '200';
```

Используйте operator для проверки type category.

### Сценарий 3. Object property verification

API response body:

```javascript
const responseBody = {
  id: 101,
  email: 'anna@example.com',
};
```

Проверьте наличие `id` and `role`.

### Сценарий 4. Runtime validation

Есть value:

```javascript
const createdAt = new Date();
```

Проверьте, что value is Date at runtime.

## Мини-проект

Создайте файл:

```text
playground/operators-report.js
```

В нем:

1. Создайте объект `response`:
   * `statusCode: 200`;
   * `responseTimeMs: 350`;
   * `body` with `id`, `email`, `role`.
2. Создайте expressions:
   * status is 200;
   * response time is less than 500;
   * body has `id`;
   * body has `role`;
   * role type is string.
3. Combine checks into `isValidResponse`.
4. Delete property `role`.
5. Check `role` again with `in`.
6. Print report:

```text
Expression | Operator category | Result | QA meaning
```
