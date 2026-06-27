# Memory Model

## Связь с предыдущей главой

Предыдущая глава объяснила Call Stack:

```text
a()
│
▼
b()
│
▼
c()
```

Call Stack показывает, какая function выполняется сейчас. Но execution frame должен хранить данные: local variables, primitive values, references to objects.

Теперь вопрос не в order execution, а в storage.

## Главный вопрос

> Где values и objects хранятся во время выполнения?

Ответ этой главы: в conceptual Memory Model, который удобно объяснять через Stack и Heap.

## Предварительные требования

Для этой главы нужно понимать:

* что Call Stack управляет function calls;
* что variables дают named access to values;
* что primitive values и object values ведут себя по-разному;
* что references уже объяснялись раньше.

Это не глава о precise engine implementation. Stack/Heap здесь используются как practical conceptual model.

## Цели обучения

После главы вы будете понимать:

* зачем программе memory;
* как stack связан с active calls;
* зачем heap нужен для objects;
* почему primitive values и object references удобно рисовать по-разному;
* как memory model помогает понять mutation.

## Мотивация

Используем тот же сквозной пример:

```javascript
function c() {
  const count = 3;
  const user = { name: 'Anna' };

  console.log(count);
  console.log(user.name);
}

function b() {
  c();
}

function a() {
  b();
}

a();
```

JavaScript должен где-то хранить:

* number `3`;
* name `count`;
* object `{ name: 'Anna' }`;
* reference from `user` to that object;
* active function calls.

## Теория

В conceptual model:

```text
Stack
│
├── active function frames
├── local primitive values
└── references to objects

Heap
│
└── object values
```

Stack удобно связывать с active execution:

```text
Call Stack frame
│
├── local names
└── local values/references
```

Heap удобно связывать с object storage:

```text
user variable
│
▼
reference
│
▼
object in Heap
```

Важно: это учебная модель. Реальные engines могут хранить данные сложнее. Для понимания JavaScript behavior эта модель достаточно точна.

## Внутренний механизм

Когда execution входит в `c()`, появляется frame:

```text
Call Stack
├── c frame
├── b frame
├── a frame
└── Global
```

Внутри `c frame` появляются local names:

```text
c frame
│
├── count -> 3
└── user  -> reference
```

Object value живет в Heap:

```text
Heap
└── object
    └── name: 'Anna'
```

Связь:

```text
c frame
└── user
    │
    ▼
    Heap object
    └── name: 'Anna'
```

Когда `c()` заканчивается, its frame leaves the stack. Если object больше нигде не reachable, позже он может быть cleaned up. Garbage Collector будет изучаться отдельно; здесь достаточно понимать lifetime concept.

## Главная ментальная модель

Главная модель главы: **memory split: stack/heap**.

```text
Stack = active calls and local access
Heap  = object values
```

```text
function frame
│
├── primitive value
└── reference ──► object in Heap
```

## Примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-63/
```

Запуск:

```bash
node examples/01-javascript/chapter-63/01-stack-values.js
node examples/01-javascript/chapter-63/02-heap-object.js
node examples/01-javascript/chapter-63/03-reference-mutation.js
node examples/01-javascript/chapter-63/04-a-b-c-memory.js
```

## Практическое использование

Memory Model помогает понимать:

* почему primitive reassignment does not mutate old value;
* почему object mutation видна через reference;
* почему local variables исчезают после function execution;
* почему shared object can be changed from different places.

## Использование в Automation QA

QA-аналогия минимальная:

```text
test data object
│
▼
shared between helpers
│
▼
one helper mutates object
│
▼
another helper sees changed data
```

Memory Model объясняет такие баги без мистики: helpers can share references to the same object.

## Распространённые ошибки

### Ошибка 1. Считать Stack и Heap точной схемой engine internals

Это practical model, not full implementation.

### Ошибка 2. Думать, что variable contains object itself

В conceptual model variable keeps reference to object in Heap.

### Ошибка 3. Забывать про lifetime frame

Local variables существуют во время execution соответствующей function.

## Практика

Практика находится в:

```text
practice/01-javascript/63-memory-model.md
```

Решения находятся в:

```text
solutions/01-javascript/63-memory-model.md
```

## Краткие итоги

Memory Model объясняет, где values live during execution.

Главное:

* Call Stack frames связаны with active function calls;
* primitive values удобно рисовать near frame;
* objects удобно рисовать in Heap;
* variables can hold references to objects;
* this model explains shared mutation.

## Переход к следующей главе

Теперь понятно, где живут values.

Следующий вопрос:

> Почему некоторые variables ведут себя странно before declaration?

Ответ ведет к Hoisting + TDZ.
