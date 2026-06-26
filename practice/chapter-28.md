# Практика. Глава 28. Return

## Концептуальные вопросы

Ответьте своими словами.

1. Зачем существует `return`?
2. Что такое return value?
3. Как функция отправляет данные caller?
4. Что происходит с выполнением функции после `return`?
5. Что получает caller, если explicit return отсутствует?
6. Чем `console.log()` отличается от `return`?
7. Что значит implicit `undefined`?
8. Что такое one return statement?
9. Что такое multiple return paths?
10. Почему return paths должны быть читаемыми?
11. Почему функции можно рассматривать как transformations of data?

## Identify return values

Для каждого примера укажите:

* есть ли explicit return;
* какое значение возвращает функция;
* что получает caller.

### Задача 1

```javascript
function isSuccessfulStatus(statusCode) {
  return statusCode === 200;
}

const result = isSuccessfulStatus(200);
```

### Задача 2

```javascript
function logStatus(statusCode) {
  console.log(statusCode);
}

const result = logStatus(200);
```

### Задача 3

```javascript
function getStatusMessage(statusCode) {
  if (statusCode === 200) {
    return 'OK';
  }

  return 'Not OK';
}

const message = getStatusMessage(500);
```

## console.log() vs return

Объясните разницу.

### Задача 1

```javascript
function printCheck(statusCode) {
  console.log(statusCode === 200);
}

const result = printCheck(200);
```

### Задача 2

```javascript
function returnCheck(statusCode) {
  return statusCode === 200;
}

const result = returnCheck(200);
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
function isSuccessfulStatus(statusCode) {
  return statusCode === 200;
}

console.log(isSuccessfulStatus(200));
```

### Задача 2

```javascript
function logStatus(statusCode) {
  console.log(statusCode);
}

console.log(logStatus(200));
```

### Задача 3

```javascript
function getStatusMessage(statusCode) {
  if (statusCode === 200) {
    return 'OK';
  }

  return 'Not OK';
}

console.log(getStatusMessage(500));
```

### Задача 4

```javascript
function testReturn() {
  return 'first';
  return 'second';
}

console.log(testReturn());
```

## Задачи на отладку

### Задача 1

Почему `result` получает `undefined`?

```javascript
function isSuccessfulStatus(statusCode) {
  statusCode === 200;
}

const result = isSuccessfulStatus(200);
console.log(result);
```

### Задача 2

Почему `Done` не выводится?

```javascript
function validateStatus(statusCode) {
  return statusCode === 200;
  console.log('Done');
}

console.log(validateStatus(200));
```

### Задача 3

Почему caller не может использовать результат проверки?

```javascript
function isSuccessfulStatus(statusCode) {
  console.log(statusCode === 200);
}

const passed = isSuccessfulStatus(200);
```

### Задача 4

Почему return paths могут быть трудными для чтения?

```javascript
function getStatusMessage(statusCode) {
  if (statusCode === 200) return 'OK';
  if (statusCode === 201) return 'Created';
  if (statusCode === 204) return 'No Content';
  return 'Other';
}
```

## QA-oriented tasks

### Сценарий 1. Boolean validator

Создайте function `isSuccessfulStatus(actualStatus, expectedStatus)`.

Функция должна вернуть результат сравнения.

Вызовите ее и сохраните результат в переменную `passed`.

### Сценарий 2. Message helper

Создайте function `getStatusMessage(statusCode)`.

Если status code равен `200`, верните `Status is successful`.

Иначе верните `Status is not successful`.

### Сценарий 3. console.log vs return

Создайте две функции:

```text
printUserEmail
getUserEmail
```

Первая должна печатать email.

Вторая должна возвращать email.

Сравните, что получает caller.

### Сценарий 4. Readable helper API

Для каждого helper укажите, что он должен возвращать:

```text
isSuccessfulStatus(statusCode)
getUserEmail()
getProfileButtonName()
getStatusMessage(statusCode)
```

## Мини-проект

Создайте файл:

```text
playground/return-qa-helpers.js
```

В нем:

1. Создайте function `isSuccessfulStatus(actualStatus, expectedStatus)`.
2. Создайте function `getStatusMessage(statusCode)`.
3. Создайте function `getUserEmail()`.
4. Создайте function `printUserEmail()`.
5. Покажите разницу между `return` и `console.log()`.
6. Сохраните return values в переменные.
7. Добавьте отчет:

```text
Function | Input | Return value | QA meaning
```
