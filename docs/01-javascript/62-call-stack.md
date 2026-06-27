# Call Stack

## Связь с предыдущей главой

Предыдущая глава показала, что JavaScript создает Execution Context:

```text
program starts
│
▼
Execution Context is created
```

Но в нашем примере functions вызывают друг друга:

```javascript
a();
// a -> b -> c
```

Теперь нужно понять, как JavaScript управляет несколькими active function calls.

## Главный вопрос

> Как functions выполняются step by step?

Ответ этой главы: через Call Stack.

## Предварительные требования

Для этой главы нужно понимать:

* что function call создает Function Execution Context;
* что function body выполняется после invocation;
* что synchronous code выполняется последовательно;
* что `a()`, `b()`, `c()` образуют цепочку вызовов.

В этой главе рассматривается только обычное последовательное выполнение function calls.

## Цели обучения

После главы вы будете понимать:

* зачем нужен Call Stack;
* что происходит при входе в function;
* что происходит при выходе из function;
* почему JavaScript возвращается в caller;
* как читать простую stack trace.

## Мотивация

Возьмем тот же код:

```javascript
function c() {
  console.log('c');
}

function b() {
  c();
  console.log('b');
}

function a() {
  b();
  console.log('a');
}

a();
```

Output:

```text
c
b
a
```

Вопрос:

> Как JavaScript помнит, что после `c()` нужно вернуться в `b()`, а после `b()` — в `a()`?

Для этого нужен Call Stack.

## Теория

Call Stack — это stack of function calls.

Когда вызывается function, JavaScript помещает ее execution frame наверх stack.

Когда function завершается, frame снимается со stack.

```text
function call
│
▼
push frame
│
▼
function finishes
│
▼
pop frame
```

JavaScript выполняет frame, который находится наверху.

## Внутренний механизм

Старт программы:

```text
Call Stack
└── Global
```

Вызов `a()`:

```text
Call Stack
├── a
└── Global
```

`a()` вызывает `b()`:

```text
Call Stack
├── b
├── a
└── Global
```

`b()` вызывает `c()`:

```text
Call Stack
├── c
├── b
├── a
└── Global
```

`c()` завершается:

```text
Call Stack
├── b
├── a
└── Global
```

`b()` завершается:

```text
Call Stack
├── a
└── Global
```

`a()` завершается:

```text
Call Stack
└── Global
```

Program ends when global execution finishes and no synchronous work remains.

## Главная ментальная модель

Главная модель главы: **stack of function calls**.

```text
top
│
├── current function
├── caller
└── previous caller
```

Last called function finishes first.

## Примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-62/
```

Запуск:

```bash
node examples/01-javascript/chapter-62/01-single-call.js
node examples/01-javascript/chapter-62/02-a-b-c.js
node examples/01-javascript/chapter-62/03-return-flow.js
node examples/01-javascript/chapter-62/04-stack-trace.js
```

## Практическое использование

Call Stack помогает понимать execution order.

Практически это нужно, когда:

* function calls вложены друг в друга;
* error появляется внутри helper;
* нужно понять, почему output идет в определенном порядке;
* stack trace показывает несколько function names.

## Использование в Automation QA

Минимальная QA-аналогия:

```text
test runner
│
▼
test function
│
▼
helper function
│
▼
assertion helper
```

Если assertion helper падает, stack trace показывает chain callers. Это не новая тема, а прямое применение Call Stack.

## Распространённые ошибки

### Ошибка 1. Читать calls сверху вниз как завершение

Выполнение идет внутрь calls, но завершение идет обратно.

### Ошибка 2. Думать, что functions выполняются одновременно

В synchronous code JavaScript выполняет только top stack frame.

### Ошибка 3. Игнорировать stack trace

Stack trace показывает путь, по которому execution пришел к ошибке.

## Практика

Практика находится в:

```text
practice/01-javascript/62-call-stack.md
```

Решения находятся в:

```text
solutions/01-javascript/62-call-stack.md
```

## Краткие итоги

Call Stack управляет order function execution.

Главное:

* function call pushes frame;
* function finish pops frame;
* JavaScript выполняет top frame;
* Call Stack объясняет return to caller.

## Переход к следующей главе

Теперь понятно, как JavaScript управляет execution flow.

Следующий вопрос:

> Где values и objects живут во время этих calls?

Ответ ведет к Memory Model.
