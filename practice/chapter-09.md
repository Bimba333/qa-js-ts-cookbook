# Практика. Глава 9. Variables

## Концептуальные вопросы

Ответьте своими словами.

1. Почему variables существуют?
2. Почему variable не стоит объяснять как коробку?
3. Что такое identifier?
4. Что такое declaration?
5. Что такое initialization?
6. Что такое assignment?
7. Что такое reassignment?
8. Чем declaration отличается от assignment?
9. Что означает declaration without initialization?
10. Почему `const` должен быть initialized сразу?
11. Когда уместен `let`?
12. Почему `var` не является modern default?

## Identify declaration / initialization / assignment

Для каждого фрагмента подпишите строки как:

```text
declaration
initialization
assignment
reassignment
read
```

### Фрагмент 1

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
```

### Фрагмент 2

```javascript
let testStatus;

testStatus = 'created';

console.log(testStatus);
```

### Фрагмент 3

```javascript
let retryCount = 0;

retryCount = 1;
retryCount = 2;

console.log(retryCount);
```

## Predict output before running

Перед запуском предскажите вывод.

### Задача 1

```javascript
let testStatus;

console.log(testStatus);
```

### Задача 2

```javascript
let testStatus = 'created';

testStatus = 'ready';

console.log(testStatus);
```

### Задача 3

```javascript
const baseUrl = 'https://example.com';
const path = '/login';
const loginUrl = baseUrl + path;

console.log(loginUrl);
```

## Predict variable state

Для кода ниже заполните таблицу:

```text
Step | Operation | Current variable state
```

Код:

```javascript
let setupStatus;

setupStatus = 'started';
setupStatus = 'finished';

console.log(setupStatus);
```

## Code reading

Прочитайте код и ответьте:

1. Какие identifiers объявлены?
2. Какие variables initialized сразу?
3. Где происходит reassignment?
4. Какие values читаются в конце?

```javascript
const browserName = 'chromium';
let testStatus = 'created';
const expectedTitle = 'Dashboard';

testStatus = 'ready';

console.log(browserName);
console.log(testStatus);
console.log(expectedTitle);
```

## Debugging tasks

### Задача 1

Инженер ожидал увидеть `created`, но получил `ready`.

```javascript
let testStatus = 'created';

testStatus = 'ready';

console.log(testStatus);
```

Объясните ошибку в mental model.

### Задача 2

Инженер написал:

```javascript
// const userName;
// userName = 'Anna';
```

Почему такой подход не подходит для `const`?

### Задача 3

Инженер написал:

```javascript
let baseUrl = 'https://example.com';

console.log(baseUrl);
```

Почему здесь лучше использовать `const`?

## QA-oriented tasks

### Сценарий 1

Для Playwright-теста нужно сохранить:

* base URL;
* browser name;
* текущий статус подготовки;
* expected user status;
* actual user status.

Выберите `const` или `let` для каждого значения и объясните выбор.

### Сценарий 2

Тест получает helper result:

```javascript
function buildUserName() {
  return 'qa-user';
}

const userName = buildUserName();
```

Объясните, какие операции происходят с variable `userName`.

### Сценарий 3

Fixture сначала создает пользователя, потом активирует его.

```text
status: created
status: active
```

Какой keyword лучше использовать для `status` и почему?

## Mini-project

Создайте файл:

```text
playground/variables-test-data.js
```

В нем должно быть:

* `baseUrl` как `const`;
* `browserName` как `const`;
* `testStatus` как `let`;
* initial value `testStatus` — `'created'`;
* reassignment `testStatus` на `'ready'`;
* `expectedStatus` как `const`;
* `actualStatus` как `const`;
* вывод всех значений.

После кода составьте таблицу:

```text
Identifier | Keyword | Initial value | Reassignment? | Why this keyword?
```
