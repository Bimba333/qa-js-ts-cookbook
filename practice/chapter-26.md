# Практика. Глава 26. Arrow Functions

## Концептуальные вопросы

Ответьте своими словами.

1. Зачем появились Arrow Functions?
2. Какую проблему решает короткий синтаксис?
3. Что создает Arrow Function?
4. Почему Arrow Function не является новым типом значения?
5. Чем Arrow Function похожа на Function Expression?
6. Чем Arrow Function отличается по записи от Function Expression?
7. Что такое explicit return?
8. Что такое implicit return на высоком уровне?
9. Когда один параметр можно писать без скобок?
10. Когда скобки обязательны?
11. Почему короткая запись не всегда лучше?
12. Почему эта глава еще не про callbacks и lexical `this`?

## Rewrite Function Expressions as Arrow Functions

Перепишите Function Expressions в Arrow Functions.

### Задача 1

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

### Задача 2

```javascript
const validateUserProfile = function () {
  console.log('Validate user profile');
};
```

### Задача 3

```javascript
const isSuccessfulStatus = function () {
  return true;
};
```

### Задача 4

```javascript
const compareStatus = function (actualStatus, expectedStatus) {
  return actualStatus === expectedStatus;
};
```

## Identify implicit return

Для каждого примера укажите, используется explicit return или implicit return.

### Задача 1

```javascript
const isSuccessfulStatus = () => true;
```

### Задача 2

```javascript
const isSuccessfulStatus = () => {
  return true;
};
```

### Задача 3

```javascript
const getStatusMessage = () => 'Status is valid';
```

### Задача 4

```javascript
const getStatusMessage = () => {
  const message = 'Status is valid';
  return message;
};
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
const validateStatus = () => {
  console.log('Validate status');
};

console.log('Before');
validateStatus();
console.log('After');
```

### Задача 2

```javascript
const isSuccessfulStatus = () => true;

console.log(isSuccessfulStatus());
```

### Задача 3

```javascript
const isSuccessfulStatus = () => {
  true;
};

console.log(isSuccessfulStatus());
```

### Задача 4

```javascript
const validateStatus = statusCode => {
  console.log(statusCode);
};

validateStatus(200);
```

## Задачи на отладку

### Задача 1

Почему `Validate status` не выводится?

```javascript
const validateStatus = () => {
  console.log('Validate status');
};

validateStatus;
```

### Задача 2

Почему результат будет не `true`?

```javascript
const isSuccessfulStatus = () => {
  true;
};

console.log(isSuccessfulStatus());
```

### Задача 3

Что не так с записью?

```javascript
const compareStatus = actualStatus, expectedStatus => {
  return actualStatus === expectedStatus;
};
```

### Задача 4

Почему этот код может быть хуже для чтения?

```javascript
const validateStatus = statusCode => statusCode === 200 ? 'ok' : 'fail';
```

## QA-oriented tasks

### Сценарий 1. Concise validator

Создайте Arrow Function `isSuccessfulStatus`, которая возвращает `true` через implicit return.

Вызовите ее и выведите результат.

### Сценарий 2. Explicit validation helper

Создайте Arrow Function `validateUserProfile`.

Тело должно выводить `Validate user profile`.

Вызовите функцию.

### Сценарий 3. Rewrite helper

Перепишите Function Expression в Arrow Function.

```javascript
const cleanupTestData = function () {
  console.log('Delete test user');
};
```

### Сценарий 4. Readability decision

Для каждого случая выберите, что читаемее:

```text
короткий validator, который возвращает boolean
длинная проверка из нескольких действий
helper с понятным именем и одним console.log
сложная проверка с условием
```

## Мини-проект

Создайте файл:

```text
playground/arrow-function-helpers.js
```

В нем:

1. Создайте Arrow Function `setupTestData`.
2. Создайте Arrow Function `isSuccessfulStatus` с implicit return.
3. Создайте Arrow Function `validateUserProfile` с телом в `{}`.
4. Создайте Arrow Function `cleanupTestData`.
5. Вызовите функции в логическом порядке.
6. Выведите результат `isSuccessfulStatus`.
7. Добавьте текстовый отчет:

```text
Имя переменной | Синтаксис | Возврат | QA-смысл
```
