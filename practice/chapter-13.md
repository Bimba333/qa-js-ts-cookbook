# Практика. Глава 13. Temporal Dead Zone

## Концептуальные вопросы

Ответьте своими словами.

1. Что такое Temporal Dead Zone?
2. Почему TDZ существует?
3. Почему `let` и `const` нельзя называть "not hoisted"?
4. Что такое registration?
5. Что такое initialization?
6. Когда TDZ begins?
7. Когда TDZ ends?
8. Как TDZ работает для `let`?
9. Как TDZ работает для `const`?
10. Почему `var` behaves differently?
11. Что означает ReferenceError before initialization?
12. Чем TDZ ReferenceError отличается от missing identifier ReferenceError?

## Identify TDZ

Для каждого фрагмента укажите, где начинается TDZ и где заканчивается.

### Фрагмент 1

```javascript
// console.log(userName);

let userName = 'Anna';

console.log(userName);
```

### Фрагмент 2

```javascript
if (true) {
  // console.log(status);

  const status = 'active';

  console.log(status);
}
```

### Фрагмент 3

```javascript
let retryCount;

console.log(retryCount);
```

## Predict output

Перед запуском предскажите вывод.

### Задача 1

```javascript
let userName;

console.log(userName);

userName = 'Anna';

console.log(userName);
```

### Задача 2

```javascript
console.log(status);

var status = 'created';

console.log(status);
```

### Задача 3

```javascript
// console.log(baseUrl);

const baseUrl = 'https://example.com';

console.log(baseUrl);
```

Ответьте также: что произойдет, если раскомментировать первую строку?

## Determine identifier state

Для кода ниже заполните таблицу:

```text
Line | Identifier | State
```

Код:

```javascript
// console.log(userName);

let userName = 'Anna';
const role = 'admin';
var status = 'created';

console.log(userName);
console.log(role);
console.log(status);
```

Используйте states:

```text
registered
uninitialized
TDZ
initialized
readable
undefined
```

## Debugging tasks

### Задача 1

Инженер видит ошибку:

```text
ReferenceError: Cannot access 'baseUrl' before initialization
```

Объясните, почему это не означает, что engine вообще не знает `baseUrl`.

### Задача 2

Инженер написал:

```javascript
const loginUrl = baseUrl + '/login';

const baseUrl = 'https://example.com';
```

Объясните ошибку и исправьте порядок.

### Задача 3

Инженер говорит:

```text
let and const are not hoisted.
```

Переформулируйте точнее.

## QA-oriented tasks

### Сценарий 1

В Playwright helper есть:

```javascript
const loginUrl = baseUrl + '/login';

const baseUrl = 'https://example.com';
```

Объясните, почему helper падает и как исправить.

### Сценарий 2

Тест использует `var`:

```javascript
console.log(expectedStatus);

var expectedStatus = 'active';
```

Почему это может скрыть ошибку?

### Сценарий 3

Команда предпочитает `const` в новых тестах.

Объясните, как TDZ помогает находить declaration order mistakes раньше.

## Mini-project

Создайте файл:

```text
playground/tdz-test-flow.js
```

В нем должно быть:

* `const baseUrl`;
* `let userName`;
* вывод `userName` after declaration;
* assignment `userName = 'Anna'`;
* вывод `baseUrl`;
* вывод `userName`;
* `var status = 'created'`;
* вывод `status`.

После кода нарисуйте timeline:

```text
Creation Phase
├── baseUrl → uninitialized
├── userName → uninitialized
└── status → undefined

Execution Phase
├── initialize baseUrl
├── initialize userName with undefined
├── assign userName
├── assign status
└── read initialized identifiers
```
