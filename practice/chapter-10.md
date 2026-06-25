# Практика. Глава 10. Scope

## Концептуальные вопросы

Ответьте своими словами.

1. Зачем существует Scope?
2. Что означает visibility of identifiers?
3. Что такое Global Scope?
4. Что такое Function Scope?
5. Что такое Block Scope?
6. Что такое parent scope?
7. Что такое child scope?
8. Что такое Scope Chain на концептуальном уровне?
9. Что означает identifier lookup?
10. Что такое variable shadowing?
11. Чем visibility отличается от lifetime?
12. Почему Scope Chain не является Call Stack?

## Determine variable visibility

Для каждого фрагмента ответьте, где identifier visible.

### Фрагмент 1

```javascript
const baseUrl = 'https://example.com';

function printBaseUrl() {
  console.log(baseUrl);
}
```

### Фрагмент 2

```javascript
function prepareUser() {
  const userName = 'Anna';

  console.log(userName);
}
```

### Фрагмент 3

```javascript
if (true) {
  const expectedStatus = 'active';

  console.log(expectedStatus);
}
```

## Identify Scope

Для кода ниже подпишите identifiers и scopes:

```javascript
const baseUrl = 'https://example.com';

function buildLoginUrl() {
  const path = '/login';

  if (true) {
    const fullUrl = baseUrl + path;

    console.log(fullUrl);
  }
}
```

Ответьте:

1. Какие identifiers находятся в Global Scope?
2. Какие identifiers находятся в Function Scope?
3. Какие identifiers находятся в Block Scope?
4. Какой lookup path у `baseUrl` внутри блока?
5. Какой lookup path у `path` внутри блока?

## Predict output before running

Перед запуском предскажите вывод.

### Задача 1

```javascript
const status = 'global';

function printStatus() {
  const status = 'local';

  console.log(status);
}

printStatus();
console.log(status);
```

### Задача 2

```javascript
const testName = 'login';

if (true) {
  const expectedStatus = 'active';

  console.log(testName);
  console.log(expectedStatus);
}
```

### Задача 3

```javascript
const baseUrl = 'https://example.com';

function printUrl() {
  const path = '/profile';

  console.log(baseUrl + path);
}

printUrl();
```

## Debugging

### Задача 1

Инженер ожидал, что код сможет прочитать `userName` после вызова функции.

```javascript
function prepareUser() {
  const userName = 'Anna';
}

prepareUser();

// console.log(userName);
```

Объясните, почему это неверно.

### Задача 2

Инженер видит неожиданный вывод:

```javascript
const status = 'global';

function checkStatus() {
  const status = 'local';

  console.log(status);
}

checkStatus();
```

Почему выводится `local`, а не `global`?

### Задача 3

Инженер использует global mutable state:

```javascript
let currentUserName = 'unknown';

function testA() {
  currentUserName = 'user-a';
}

function testB() {
  console.log(currentUserName);
}
```

Объясните риск для автотестов.

## QA-oriented tasks

### Сценарий 1

В helper есть variables:

```text
requestBody
normalizedEmail
responseStatus
```

Объясните, почему эти identifiers должны оставаться helper-local, если тесту они напрямую не нужны.

### Сценарий 2

Fixture создает `authToken`, а тест использует только готовую страницу.

Ответьте:

1. Должен ли `authToken` быть visible в тесте?
2. Почему Scope помогает скрыть implementation details?
3. Как это влияет на читаемость?

### Сценарий 3

В тесте есть `expectedStatus`, а в helper тоже есть `expectedStatus`.

Объясните, когда это shadowing может быть проблемой.

## Mini-project

Создайте файл:

```text
playground/scope-test-flow.js
```

В нем должно быть:

* global `baseUrl`;
* function `testLogin`;
* внутри `testLogin` — `userName` и `expectedStatus`;
* внутри `testLogin` блок `if (true)`;
* внутри блока — `actualStatus`;
* вывод `baseUrl`, `userName`, `expectedStatus`, `actualStatus` внутри блока;
* вывод `baseUrl` после вызова функции.

После кода нарисуйте:

```text
Global Scope
└── Function Scope
    └── Block Scope
```

И подпишите, где visible каждый identifier.
