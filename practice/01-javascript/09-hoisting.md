# Практика. Глава 12. Hoisting

## Концептуальные вопросы

Ответьте своими словами.

1. Почему Hoisting существует?
2. Почему неправильно говорить, что JavaScript moves code upward?
3. Что engine делает during Creation Phase?
4. Что engine делает during Execution Phase?
5. Как function declaration регистрируется до execution?
6. Как `var` регистрируется до execution?
7. Как `let` регистрируется до execution?
8. Как `const` регистрируется до execution?
9. Чем declaration отличается от initialization?
10. Почему `var a = 5` не означает, что `5` доступно before line?
11. Почему `let` и `const` требуют отдельной главы про TDZ?
12. Как Hoisting связан с Lexical Environment?

## Предскажите вывод

Перед запуском предскажите вывод.

### Задача 1

```javascript
printStatus();

function printStatus() {
  console.log('ready');
}
```

### Задача 2

```javascript
console.log(userName);

var userName = 'Anna';

console.log(userName);
```

### Задача 3

```javascript
console.log(testStatus);

var testStatus = 'created';

testStatus = 'ready';

console.log(testStatus);
```

### Задача 4

```javascript
// console.log(baseUrl);

const baseUrl = 'https://example.com';

console.log(baseUrl);
```

Ответьте также: что произойдет, если раскомментировать первую строку?

## Определите Creation Phase

Для кода ниже выпишите, что будет prepared before execution.

```javascript
runTest();

console.log(userName);

var userName = 'Anna';
let userRole = 'admin';
const baseUrl = 'https://example.com';

function runTest() {
  console.log('test');
}
```

Заполните таблицу:

```text
Identifier | Declaration kind | Creation Phase state
```

## Определите declaration vs initialization

Для каждой строки подпишите:

```text
declaration
initialization
assignment
read
function call
```

Код:

```javascript
console.log(environmentName);

var environmentName = 'staging';

environmentName = 'production';

console.log(environmentName);
```

## Задачи на отладку

### Задача 1

Инженер думает, что код был переписан engine:

```javascript
console.log(userName);

var userName = 'Anna';
```

Объясните, почему это неверная модель.

### Задача 2

Инженер ожидал `Anna`, но получил `undefined`:

```javascript
console.log(userName);

var userName = 'Anna';
```

Объясните через Creation Phase and Execution Phase.

### Задача 3

Инженер говорит:

```text
let and const are not hoisted.
```

Почему эта формулировка неточная?

## QA-задачи

### Сценарий 1

В legacy helper file есть:

```javascript
setupTest();

function setupTest() {
  console.log('setup');
}
```

Объясните, почему это работает.

### Сценарий 2

В старом Node.js helper есть:

```javascript
console.log(configName);

var configName = 'local';
```

Какой output ожидается и почему?

### Сценарий 3

Команда пишет новые Playwright tests.

Ответьте:

1. Нужно ли intentionally rely on Hoisting?
2. Почему лучше объявлять helpers before usage?
3. Зачем все равно понимать Hoisting?

## Мини-проект

Создайте файл:

```text
playground/hoisting-movie.js
```

В нем должно быть:

* вызов function declaration before its line;
* `console.log` для `var` before assignment;
* assignment для `var`;
* safe `let` после initialization;
* safe `const` после initialization.

После кода нарисуйте:

```text
Creation Phase
├── function ...
├── var ...
├── let ...
└── const ...

Execution Phase
├── call function
├── read var
├── assign var
├── initialize let
└── initialize const
```
