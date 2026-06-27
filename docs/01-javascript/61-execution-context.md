# Execution Context

## Связь с предыдущей главой

Предыдущая глава завершила работу с порядком элементов:

```text
sort()
reverse()
```

Там мы управляли array order. Теперь уровень меняется: нас интересует не метод массива, а сам запуск JavaScript-кода.

Дальше модуль будет идти как одна система:

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

## Главный вопрос

> Как JavaScript начинает выполнять код?

Ответ этой главы: перед выполнением создается Execution Context.

## Предварительные требования

Для этой главы нужно понимать:

* что JavaScript выполняет код последовательно;
* что function body выполняется только после вызова;
* что variables дают доступ к values;
* что раньше уже были изучены functions, variables и objects.

Не требуется знать внутреннее устройство конкретного engine. Эта глава строит conceptual model.

## Цели обучения

После главы вы будете понимать:

* зачем нужен Execution Context;
* что создается перед выполнением кода;
* чем global execution отличается от function execution;
* почему function call создает отдельную среду выполнения;
* как эта тема готовит Call Stack.

## Мотивация

Посмотрим на простой код:

```javascript
function c() {
  const message = 'inside c';
  console.log(message);
}

function b() {
  c();
}

function a() {
  b();
}

a();
```

Видимый output простой:

```text
inside c
```

Но внутри JavaScript должен ответить на несколько вопросов:

* какой код выполняется на верхнем уровне;
* что такое `a`, `b` и `c`;
* когда выполнять body функции `a`;
* где появится local value `message`;
* что создать при вызове каждой function.

Execution Context отвечает на первый слой этих вопросов.

## Теория

Execution Context — это conceptual unit execution. Это среда, в которой JavaScript выполняет код.

Когда запускается файл, сначала создается Global Execution Context:

```text
JavaScript file
│
▼
Global Execution Context
│
▼
top-level code can run
```

Когда вызывается function, создается Function Execution Context:

```text
function call
│
▼
Function Execution Context
│
▼
function body can run
```

Важно: function declaration не означает execution. Function body начнет выполняться только после call.

## Внутренний механизм

Для нашего сквозного примера sequence выглядит так:

```text
program starts
│
▼
Global Execution Context is created
│
▼
functions a, b, c are available as callable functions
│
▼
a() is called
│
▼
Execution Context for a() is created
```

Затем `a()` вызывает `b()`:

```text
a() body
│
▼
b() call
│
▼
Execution Context for b() is created
```

Затем `b()` вызывает `c()`:

```text
b() body
│
▼
c() call
│
▼
Execution Context for c() is created
```

Внутри `c()` появляется local value:

```text
c() context
│
├── message
└── console.log(message)
```

В этой главе важно только одно: перед выполнением кода JavaScript создает execution unit, в котором этот код может выполняться.

## Главная ментальная модель

Главная модель главы: **execution start unit**.

```text
code wants to run
│
▼
Execution Context is created
│
▼
code has an execution environment
```

Execution Context можно представить как рабочую область для выполнения кода. Это не объект, который вы создаете руками, а модель того, что JavaScript подготавливает перед execution.

## Примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-61/
```

Запуск:

```bash
node examples/01-javascript/chapter-61/01-global-context.js
node examples/01-javascript/chapter-61/02-function-context.js
node examples/01-javascript/chapter-61/03-nested-contexts.js
node examples/01-javascript/chapter-61/04-context-per-call.js
```

Все примеры используют одну идею: `a()` вызывает `b()`, `b()` вызывает `c()`.

## Практическое использование

Execution Context нужен не для того, чтобы писать специальный syntax. Он нужен для чтения поведения программы.

Он помогает понять:

* почему function body не выполняется до call;
* почему local variables появляются только во время function execution;
* почему следующий вызов той же function получает новую execution unit;
* почему ошибка внутри function должна рассматриваться в контексте конкретного call.

## Использование в Automation QA

В Automation QA похожая идея видна в test runner:

```text
test file
│
▼
runner prepares execution
│
▼
test function runs
```

Не нужно перегружать аналогию. Достаточно помнить: как test runner создает среду для test execution, так JavaScript создает Execution Context для running code.

## Распространённые ошибки

### Ошибка 1. Думать, что function declaration сразу выполняет function body

Declaration делает function available. Execution starts only after call.

### Ошибка 2. Смешивать Global Execution Context и Function Execution Context

Top-level code и function body выполняются в разных execution units.

### Ошибка 3. Искать детали конкретного engine

В этой главе нужна conceptual model, а не детали устройства конкретного JavaScript engine.

## Практика

Практика находится в:

```text
practice/01-javascript/61-execution-context.md
```

Решения находятся в:

```text
solutions/01-javascript/61-execution-context.md
```

## Краткие итоги

Execution Context — это execution unit, который JavaScript создает перед выполнением кода.

Главное:

* file execution starts with Global Execution Context;
* function call creates Function Execution Context;
* function body runs only after invocation;
* Execution Context отвечает на вопрос: где сейчас выполняется код?

## Переход к следующей главе

Теперь понятно, что function calls создают новые execution contexts.

Следующий вопрос:

> Если contexts становится несколько, как JavaScript понимает, какой выполняется сейчас?

Ответ ведет к Call Stack.
