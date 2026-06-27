# Практика. Глава 24. Function Declaration

## Концептуальные вопросы

Ответьте своими словами.

1. Зачем существуют функции?
2. Что такое дублирование кода?
3. Почему дублированная проверка опасна в тестах?
4. Что такое переиспользуемое поведение?
5. Что значит дать алгоритму имя?
6. Что такое function declaration?
7. Что такое тело функции?
8. Что такое вызов функции?
9. Выполняет ли function declaration тело функции?
10. Когда выполняется тело функции?
11. Почему одну функцию можно вызвать много раз?
12. Как функции улучшают читаемость?
13. Как функции улучшают поддерживаемость?

## Найдите дублированный код

Найдите дублированную логику и предложите имя функции.

### Задача 1

```javascript
const firstStatus = 200;
if (firstStatus !== 200) {
  throw new Error('Expected status 200');
}

const secondStatus = 200;
if (secondStatus !== 200) {
  throw new Error('Expected status 200');
}
```

### Задача 2

```javascript
console.log('Create user');
console.log('Open profile page');
console.log('Validate profile');

console.log('Create user');
console.log('Open profile page');
console.log('Validate profile');
```

## Найдите вызов функции

Для каждого примера укажите:

* объявление функции;
* тело функции;
* вызов функции;
* выполняется ли тело.

### Задача 1

```javascript
function setupTestData() {
  console.log('Create user');
}
```

### Задача 2

```javascript
function setupTestData() {
  console.log('Create user');
}

setupTestData();
```

### Задача 3

```javascript
function cleanupTestData() {
  console.log('Delete user');
}

console.log('Test finished');
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
function validateResponse() {
  console.log('Validate response');
}

console.log('Before');
validateResponse();
console.log('After');
```

### Задача 2

```javascript
function validateResponse() {
  console.log('Validate response');
}

validateResponse();
validateResponse();
```

### Задача 3

```javascript
function setup() {
  console.log('Setup');
}

function cleanup() {
  console.log('Cleanup');
}

cleanup();
setup();
```

### Задача 4

```javascript
function validateResponse() {
  console.log('Validation runs');
}

console.log('Declared');
```

## Задачи на отладку

### Задача 1

Почему `Validation runs` не выводится?

```javascript
function validateResponse() {
  console.log('Validation runs');
}

console.log('Test finished');
```

### Задача 2

Почему название плохо помогает читать тест?

```javascript
function doStuff() {
  console.log('Validate response status');
}

doStuff();
```

### Задача 3

Почему эта функция может быть слишком широкой?

```javascript
function runEverything() {
  console.log('Create user');
  console.log('Validate response');
  console.log('Delete user');
  console.log('Send report');
}
```

## QA-задачи

### Сценарий 1. Переиспользуемая проверка

Создайте function declaration `assertStatusIsSuccessful`.

Внутри используйте фиксированное значение `statusCode = 200` и выведите `Status is successful`.

Вызовите функцию.

### Сценарий 2. Setup helper

Создайте функцию `setupTestData`, которая выводит `Create test user`.

Вызовите ее два раза.

### Сценарий 3. Cleanup helper

Создайте функцию `cleanupTestData`, которая выводит `Delete test user`.

Вызовите ее после `console.log('Run test')`.

### Сценарий 4. Naming

Подберите более удачные имена:

```text
doStuff
check
make
clear
```

for algorithms:

```text
validate API response status
create test user
delete test user
open profile page
```

## Мини-проект

Создайте файл:

```text
playground/function-declaration-helpers.js
```

В нем:

1. Создайте функцию `setupTestData`.
2. Создайте функцию `openUserProfile`.
3. Создайте функцию `validateUserProfile`.
4. Создайте функцию `cleanupTestData`.
5. Каждая функция должна выводить одно понятное действие.
6. Вызовите функции в логическом порядке теста.
7. Вызовите `validateUserProfile` два раза.
8. Добавьте отчет:

```text
Имя функции | Переиспользуемый алгоритм | Вызвана? | Сколько раз | QA-смысл
```
