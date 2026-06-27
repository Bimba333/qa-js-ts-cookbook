# Hoisting + TDZ

## Связь с предыдущей главой

Предыдущая глава объяснила Memory Model:

```text
Stack = active frames
Heap  = object values
```

Теперь можно объяснить странное поведение variables до declaration. JavaScript подготавливает execution environment before line-by-line execution, но разные declarations получают разное initial state.

## Главный вопрос

> Почему variables behave unexpectedly before declaration?

Ответ этой главы: из-за Hoisting и Temporal Dead Zone.

## Предварительные требования

Для этой главы нужно понимать:

* что Execution Context создается before execution;
* что Call Stack запускает function frames;
* что Memory Model хранит names, values и references;
* чем `var`, `let` и `const` отличаются в обычном коде.

Specification details не нужны. Эта глава объясняет practical lifecycle variables.

## Цели обучения

После главы вы будете понимать:

* почему hoisting is preparation, not code movement;
* почему function declarations доступны before call line;
* почему `var` reads as `undefined` before assignment;
* почему `let` и `const` находятся в TDZ before initialization;
* как читать ReferenceError before initialization.

## Мотивация

Сквозной пример:

```javascript
a();

function a() {
  b();
}

function b() {
  c();
}

function c() {
  console.log(message);
  let message = 'inside c';
}
```

Вызов `a()` работает, хотя function declaration находится ниже.

Но чтение `message` before `let message` causes ReferenceError.

Вопрос:

> Почему одна часть кода работает before declaration, а другая падает?

## Теория

Hoisting — это подготовка declarations during Creation Phase. Это не перемещение строк.

```text
Creation Phase
│
▼
register declarations
│
▼
Execution Phase
│
▼
run code line by line
```

Function declarations:

```text
function a() {}
│
▼
registered as callable function
```

`var`:

```text
var value
│
▼
registered with undefined
```

`let` и `const`:

```text
let value / const value
│
▼
registered
│
▼
inaccessible until initialization
```

TDZ is the period between registration and initialization where access is forbidden.

## Внутренний механизм

Для function declarations:

```javascript
a();

function a() {
  console.log('a');
}
```

Conceptual lifecycle:

```text
Creation Phase
│
▼
a registered as function
│
▼
Execution Phase
│
▼
a() can run
```

Для `var`:

```javascript
console.log(value);
var value = 'ready';
```

Conceptual lifecycle:

```text
Creation Phase
│
▼
value registered as undefined
│
▼
Execution Phase
│
▼
console.log(undefined)
```

Для `let`:

```javascript
console.log(value);
let value = 'ready';
```

Conceptual lifecycle:

```text
Creation Phase
│
▼
value registered but uninitialized
│
▼
Execution before declaration line
│
▼
ReferenceError
```

State timeline:

```text
registered
│
▼
TDZ
│
▼
initialization line
│
▼
accessible value
```

## Главная ментальная модель

Главная модель главы: **variable lifecycle before/after declaration**.

```text
before execution
│
▼
identifier may already be registered
│
▼
access depends on declaration kind
```

```text
function declaration -> callable
var                  -> undefined
let / const          -> TDZ until initialization
```

## Примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-64/
```

Запуск:

```bash
node examples/01-javascript/chapter-64/01-function-hoisting.js
node examples/01-javascript/chapter-64/02-var-hoisting.js
node examples/01-javascript/chapter-64/03-tdz-caught.js
node examples/01-javascript/chapter-64/04-a-b-c-hoisting.js
```

Все examples valid and runnable. TDZ example catches the error intentionally.

## Практическое использование

Hoisting + TDZ помогают объяснять:

* why calling a function declaration before its line works;
* why `var` can hide setup order bugs with `undefined`;
* why `let`/`const` fail early before initialization;
* why declaration order matters inside functions.

## Использование в Automation QA

QA-аналогия здесь нужна только как warning:

```text
helper reads test data
│
▼
test data declared later with const
│
▼
ReferenceError
```

Правило для tests простое: initialize configuration and test data before reading them.

## Распространённые ошибки

### Ошибка 1. Говорить, что `let` и `const` не hoisted

Они registered, но inaccessible before initialization.

### Ошибка 2. Представлять hoisting как перемещение строк

Source code не переезжает. Подготавливается execution environment.

### Ошибка 3. Путать `undefined` и TDZ

`var` before assignment gives `undefined`. `let`/`const` before initialization throw ReferenceError.

## Практика

Практика находится в:

```text
practice/01-javascript/64-hoisting-tdz.md
```

Решения находятся в:

```text
solutions/01-javascript/64-hoisting-tdz.md
```

## Краткие итоги

Hoisting + TDZ объясняют variable lifecycle before execution reaches declaration line.

Главное:

* hoisting is preparation;
* function declarations become callable;
* `var` starts as `undefined`;
* `let` and `const` are in TDZ before initialization;
* TDZ means identifier exists but access is forbidden.

## Переход к следующей главе

Этот модуль собрал базовую внутреннюю картину:

```text
Execution Context
│
▼
Call Stack
│
▼
Memory Model
│
▼
Hoisting + TDZ
```

Теперь можно читать JavaScript-code как execution system, а не как набор независимых строк.
