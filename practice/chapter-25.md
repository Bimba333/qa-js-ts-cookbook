# Практика. Глава 25. Function Expression

## Концептуальные вопросы

Ответьте своими словами.

1. Зачем существуют Function Expressions?
2. Что значит "функция является значением"?
3. Что хранит переменная в Function Expression?
4. Выполняется ли тело функции при присваивании?
5. Что такое anonymous function expression?
6. Что такое named function expression на высоком уровне?
7. Чем Function Declaration отличается от Function Expression?
8. Почему вызов идет через имя переменной?
9. Почему хорошее имя переменной важно?
10. Почему эта глава еще не про callbacks?
11. Как Function Expressions могут использоваться в Automation QA?

## Определите declaration vs expression

Для каждого примера укажите, где Function Declaration, где Function Expression, и какое значение хранит переменная.

### Задача 1

```javascript
function validateStatus() {
  console.log('Status is valid');
}
```

### Задача 2

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

### Задача 3

```javascript
const cleanupTestData = function cleanup() {
  console.log('Delete test user');
};
```

## Определите сохраненный function objects

### Задача 1

```javascript
const openProfile = function () {
  console.log('Open profile');
};

openProfile();
```

Ответьте:

* какая переменная хранит function object;
* где function object создается;
* где function object вызывается.

### Задача 2

```javascript
const validateUser = function () {
  console.log('Validate user');
};

const checkUser = validateUser;

checkUser();
```

Ответьте:

* какие переменные связаны с function object;
* какая переменная используется для вызова;
* почему тело выполняется.

## Предскажите вывод перед запуском

### Задача 1

```javascript
const validateStatus = function () {
  console.log('Validate status');
};

console.log('Before');
validateStatus();
console.log('After');
```

### Задача 2

```javascript
const validateStatus = function () {
  console.log('Validate status');
};

console.log(typeof validateStatus);
```

### Задача 3

```javascript
const setup = function () {
  console.log('Setup');
};

const cleanup = function () {
  console.log('Cleanup');
};

cleanup();
setup();
```

### Задача 4

```javascript
const validateStatus = function () {
  console.log('Validate status');
};

console.log('Stored');
```

## Задачи на отладку

### Задача 1

Почему `Validate status` не выводится?

```javascript
const validateStatus = function () {
  console.log('Validate status');
};

validateStatus;
```

### Задача 2

Почему имя переменной плохо помогает читать тест?

```javascript
const fn = function () {
  console.log('Validate user profile');
};

fn();
```

### Задача 3

Что будет ошибкой в рассуждении?

```javascript
const validateStatus = function () {
  console.log('Validate status');
};
```

Объяснение:

```text
Строка с присваиванием сразу выполняет тело функции.
```

## QA-задачи

### Сценарий 1. Reusable validator

Создайте Function Expression `validateApiStatus`.

Функция должна выводить `Validate API status`.

Вызовите ее.

### Сценарий 2. Test utilities

Создайте три Function Expressions:

```text
setupTestData
openUserProfile
cleanupTestData
```

Каждая функция должна выводить одно действие.

Вызовите их в логическом порядке.

### Сценарий 3. Declaration vs Expression

Перепишите Function Declaration в Function Expression.

```javascript
function validateUserProfile() {
  console.log('Validate user profile');
}
```

### Сценарий 4. Naming

Подберите хорошие имена переменных для function objects:

```text
проверить статус ответа
создать тестового пользователя
открыть страницу профиля
удалить тестовые данные
```

## Мини-проект

Создайте файл:

```text
playground/function-expression-utils.js
```

В нем:

1. Создайте Function Expression `setupTestData`.
2. Создайте Function Expression `validateUserProfile`.
3. Создайте Function Expression `validateUserSettings`.
4. Создайте Function Expression `cleanupTestData`.
5. Каждая функция должна выводить одно понятное действие.
6. Вызовите функции в логическом порядке.
7. Вызовите одну validation-функцию дважды.
8. Добавьте текстовый отчет:

```text
Имя переменной | Хранимое значение | Вызвана? | QA-смысл
```
