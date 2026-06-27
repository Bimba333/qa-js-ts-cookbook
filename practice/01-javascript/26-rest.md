# Практика. Глава 29. Rest Parameters

## Концептуальные вопросы

Ответьте своими словами.

1. Зачем существуют Rest Parameters?
2. Какую проблему решает неизвестное количество arguments?
3. Что означает `...statusCodes` в parameter list?
4. Что именно собирает rest parameter?
5. Почему rest parameter получает array?
6. Что находится внутри rest array?
7. Что будет при нуле arguments?
8. Почему rest parameter должен быть последним?
9. Когда лучше использовать обычные parameters вместо rest?
10. Почему имя rest parameter лучше писать во множественном числе?
11. Почему Rest и Spread не нужно смешивать в этой главе?

## Определите collected arguments

Для каждого примера укажите:

* обычные parameters;
* rest parameter;
* что находится внутри rest array.

### Задача 1

```javascript
function collectStatuses(...statusCodes) {}

collectStatuses(200, 201, 204);
```

### Задача 2

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {}

validateStatuses(200, 200, 201, 204);
```

### Задача 3

```javascript
function logMessages(firstMessage, ...otherMessages) {}

logMessages('start', 'validate', 'finish');
```

## What is inside the rest array?

Ответьте, что будет внутри rest array.

### Задача 1

```javascript
function collectValues(...values) {}

collectValues();
```

### Задача 2

```javascript
function collectValues(...values) {}

collectValues('a');
```

### Задача 3

```javascript
function collectValues(firstValue, ...otherValues) {}

collectValues('a', 'b', 'c');
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
function collectStatuses(...statusCodes) {
  console.log(statusCodes);
}

collectStatuses(200, 201);
```

### Задача 2

```javascript
function collectStatuses(...statusCodes) {
  console.log(statusCodes);
}

collectStatuses();
```

### Задача 3

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {
  console.log(expectedStatus);
  console.log(actualStatuses);
}

validateStatuses(200, 200, 201);
```

### Задача 4

```javascript
function logMessages(firstMessage, ...otherMessages) {
  console.log(firstMessage);
  console.log(otherMessages);
}

logMessages('start');
```

## Задачи на отладку

### Задача 1

Что не так с сигнатурой?

```javascript
function validateStatuses(...actualStatuses, expectedStatus) {}
```

### Задача 2

Почему имя parameter сбивает с толку?

```javascript
function collectStatuses(...statusCode) {
  console.log(statusCode);
}
```

### Задача 3

Почему здесь rest parameter не нужен?

```javascript
function compareStatus(...statuses) {
  console.log(statuses);
}

compareStatus(200, 200);
```

### Задача 4

Что неверно в объяснении?

```text
Rest parameter распаковывает array в arguments.
```

## QA-задачи

### Сценарий 1. Many status validator

Создайте function `validateStatuses(expectedStatus, ...actualStatuses)`.

Функция должна вывести expected status и collected actual statuses.

Вызовите ее с arguments:

```text
200, 200, 201, 204
```

### Сценарий 2. Flexible logger

Создайте function `logMessages(...messages)`.

Функция должна вывести array сообщений.

Вызовите ее с одним, двумя и тремя messages.

### Сценарий 3. Collect test data

Создайте function `collectUserEmails(...userEmails)`.

Функция должна вернуть `userEmails`.

Вызовите ее с тремя email values.

### Сценарий 4. Naming

Замените плохие rest parameter names:

```text
...statusCode
...email
...locator
...message
```

на имена, которые показывают collection.

## Мини-проект

Создайте файл:

```text
playground/rest-qa-helpers.js
```

В нем:

1. Создайте function `validateStatuses(expectedStatus, ...actualStatuses)`.
2. Создайте function `logMessages(...messages)`.
3. Создайте function `collectUserEmails(...userEmails)`.
4. Создайте function `collectLocatorNames(...locatorNames)`.
5. Вызовите каждую функцию с разным количеством arguments.
6. Добавьте отчет:

```text
Function | Normal parameters | Rest parameter | Collected values | QA meaning
```
