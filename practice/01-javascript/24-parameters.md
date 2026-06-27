# Практика. Глава 27. Parameters

## Концептуальные вопросы

Ответьте своими словами.

1. Зачем существуют параметры?
2. Что такое parameter?
3. Что такое argument?
4. Почему parameter принадлежит определению функции?
5. Почему argument принадлежит вызову функции?
6. Как argument становится доступным внутри функции?
7. Как работает функция без параметров?
8. Как работает один parameter?
9. Как работают несколько parameters?
10. Что значит "matching by position"?
11. Что происходит при missing argument?
12. Что происходит при extra argument?
13. Почему имена parameters важны?

## Parameter vs argument

Для каждого примера укажите:

* parameters;
* arguments;
* какие значения попадут в какие parameters.

### Задача 1

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus(200);
```

### Задача 2

```javascript
function compareStatus(actualStatus, expectedStatus) {
  console.log(actualStatus === expectedStatus);
}

compareStatus(200, 201);
```

### Задача 3

```javascript
const createUser = (userEmail) => {
  console.log(userEmail);
};

createUser('anna@example.com');
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus(200);
```

### Задача 2

```javascript
function compareStatus(actualStatus, expectedStatus) {
  console.log(actualStatus);
  console.log(expectedStatus);
}

compareStatus(200, 201);
```

### Задача 3

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus();
```

### Задача 4

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus(200, 201);
```

## Задачи на отладку

### Задача 1

Почему выводится `undefined`?

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus();
```

### Задача 2

Почему сравнение дает неожиданный результат?

```javascript
function compareStatus(actualStatus, expectedStatus) {
  console.log(actualStatus === expectedStatus);
}

compareStatus(201, 200);
```

### Задача 3

Почему имена parameters плохие?

```javascript
function validate(a, b) {
  console.log(a === b);
}
```

### Задача 4

Что неверно в объяснении?

```text
В compareStatus(actualStatus, expectedStatus)
actualStatus и expectedStatus являются arguments.
```

## QA-задачи

### Сценарий 1. API status validator

Создайте function `validateApiStatus` с parameters:

```text
actualStatus
expectedStatus
```

Функция должна выводить оба значения и результат сравнения.

Вызовите ее с arguments `200` и `200`.

### Сценарий 2. Test data helper

Создайте function `createUser` с parameter `userEmail`.

Функция должна выводить email.

Вызовите ее с argument `'anna@example.com'`.

### Сценарий 3. Locator helper

Создайте Arrow Function `clickElement` с parameter `locatorName`.

Функция должна выводить locator name.

Вызовите ее с argument `'profile button'`.

### Сценарий 4. Naming

Замените плохие parameter names на хорошие:

```text
a, b       для сравнения статусов
x          для email пользователя
v          для имени locator
data       для объекта профиля пользователя
```

## Мини-проект

Создайте файл:

```text
playground/parameterized-qa-helpers.js
```

В нем:

1. Создайте function `validateStatus(actualStatus, expectedStatus)`.
2. Создайте function `createUser(userEmail)`.
3. Создайте Arrow Function `openProfile(userId)`.
4. Создайте Arrow Function `clickElement(locatorName)`.
5. Вызовите каждую функцию с понятными arguments.
6. Добавьте отчет:

```text
Function | Parameters | Arguments | QA meaning
```
