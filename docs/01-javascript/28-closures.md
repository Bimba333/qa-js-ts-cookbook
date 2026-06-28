# Closures

## Связь с предыдущей главой

Предыдущая глава объяснила Spread.

```text
Spread
│
└── раскрывает одну collection
    │
    ▼
    в много отдельных значений
```

Теперь мы возвращаемся к функциям и к модели выполнения JavaScript.

К этому моменту уже известно:

```text
Execution Context
│
├── создает среду выполнения
│
├── имеет Creation Phase
│
└── имеет Execution Phase

Scope
│
└── отвечает за видимость identifiers

Lexical Environment
│
├── хранит identifiers
└── связывает окружение с outer environment

Function
│
├── получает arguments через parameters
├── выполняет body
└── может вернуть value через return
```

Теперь появляется один из самых важных вопросов JavaScript:

> Функция уже завершила выполнение. Почему некоторые значения все еще существуют?

Это вопрос о Closures.

Главный вопрос главы:

> Почему это значение все еще существует?

---

## Предварительные требования

Для этой главы нужно понимать:

* что Execution Context создается при выполнении функции;
* что Call Stack управляет активными Execution Contexts;
* что Scope определяет, где identifier видим;
* что Lexical Environment хранит identifiers и связь с outer environment;
* что function object можно вернуть из функции;
* что `return` завершает выполнение функции и отправляет value обратно;
* что function body выполняется только после invocation.

Не требуется знать `this`, modules, private class поля, WeakMap privacy, Garbage Collector internals, React hooks, event listeners или async closures. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            150-190 минут
Разбор схем:             60-80 минут
Запуск примеров:         25-35 минут
Практика:                120-160 минут
Повторение материала:    35 минут
```

Уровень сложности: **L4**.

Closure часто кажется магией, потому что читатель ожидает, что все локальные данные функции исчезают сразу после ее завершения. На самом деле магии нет: function object удерживает ссылку на то Lexical Environment, где он был создан, если продолжает использовать identifiers из него.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/27-spread.md
```

Текущая глава:

```text
docs/01-javascript/28-closures.md
```

Следующая глава:

```text
docs/01-javascript/29-this.md
```

Следующая глава ответит:

> Как определяется контекст выполнения функции через `this`?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существуют Closures;
* почему функция может помнить outer variables;
* как Closure связана с Lexical Environment;
* почему outer scope может оставаться доступным после завершения функции;
* чем expected lifetime отличается от actual lifetime;
* как работают multiple closures;
* почему independent closures не мешают друг другу;
* как Closure связана с Execution Context и Call Stack;
* какие ошибки чаще всего возникают;
* как Closures применяются в Automation QA.

---

## Мотивация

Начнем с поведения, которое сначала кажется странным.

```javascript
function createStatusValidator() {
  const expectedStatus = 200;

  return function validateStatus(actualStatus) {
    return actualStatus === expectedStatus;
  };
}

const validateSuccess = createStatusValidator();

console.log(validateSuccess(200));
```

Функция `createStatusValidator()` уже завершилась.

```text
createStatusValidator()
│
├── created expectedStatus
├── returned validateStatus
└── finished
```

Но `validateStatus()` все еще может прочитать `expectedStatus`.

```text
validateSuccess(200)
│
└── reads expectedStatus
```

Ожидание читателя:

```text
Function finished
│
▼
local variables disappeared
│
▼
expectedStatus should be unavailable
```

Фактическое поведение:

```text
Function finished
│
▼
returned function still needs expectedStatus
│
▼
Function object holds reference to required environment
│
▼
expectedStatus is still available
```

Главный вопрос:

> Почему `expectedStatus` все еще существует?

Closure отвечает именно на этот вопрос.

---

## Теория

### Проблема исчезающих локальных данных

Обычная функция выполняется так:

```text
Function call
│
▼
Function Execution Context created
│
▼
Local identifiers prepared
│
▼
Function body executed
│
▼
Function returns
│
▼
Execution Context removed from Call Stack
```

Выполнение функции:

```text
Call Stack
│
├── Global Execution Context
└── createStatusValidator()
```

Function finishes:

```text
Call Stack
│
└── Global Execution Context
```

После завершения функции ее Execution Context больше не активен.

Но важно не смешивать две идеи:

```text
Execution Context finished
│
└── active execution stopped

Returned function object
│
└── may still reference its Lexical Environment
```

Execution Context отвечает за выполнение.

Lexical Environment хранит identifiers, которые могут понадобиться function object позже.

---

### Наблюдаемое противоречие

Посмотрим на минимальный пример:

```javascript
function outer() {
  const message = 'Saved value';

  function inner() {
    return message;
  }

  return inner;
}

const readMessage = outer();

console.log(readMessage());
```

Reader expectation:

```text
outer() finished
│
▼
message disappeared
│
▼
inner() cannot read message
```

Фактическое поведение:

```text
outer() finished
│
▼
inner function object still exists
│
▼
inner references message
│
▼
message is still reachable through environment reference
```

Вот момент, где рождается Closure.

```text
inner function object
│
├── function body
└── reference to outer lexical environment
```

Closure creation:

```text
outer Lexical Environment
│
├── message: 'Saved value'
└── inner function object
    │
    └── holds reference to this environment
```

Closure - это не отдельная синтаксическая конструкция.

Это поведение, которое возникает, когда function object удерживает ссылку на lexical environment, где он был создан.

---

### Что такое Closure

Теперь можно дать рабочее определение.

Closure - это поведение function object, который удерживает ссылку на Lexical Environment, где он был создан.

```text
Function object
│
▼
holds reference to
│
▼
Lexical Environment
where it was created
```

Более практичная формулировка:

> Closure позволяет функции использовать variables из outer scope даже после того, как outer function завершила выполнение.

Важно:

```text
Closure is not:
│
├── special syntax
├── copy of all variables
├── hidden global variable
└── magic memory leak

Closure is:
│
└── function object that holds reference to needed lexical environment
```

Миф -> Реальность:

```text
Миф
│
└── Closure копирует значения внутрь функции

Реальность
│
└── function object держит ссылку на environment,
    где эти identifiers находятся
```

---

### Lexical Environment revisit

В главе про Lexical Environment мы видели:

```text
Lexical Environment
│
├── Environment Record
│   └── identifiers
│
└── Outer Environment Reference
    └── ссылка на внешнее окружение
```

Теперь эта модель становится особенно важной.

Когда функция создается, она создается не в пустоте.

```text
Global Lexical Environment
│
└── createStatusValidator function object

createStatusValidator Lexical Environment
│
├── expectedStatus
└── validateStatus function object
```

Функция `validateStatus` была создана внутри `createStatusValidator`.

Значит, ее lexical position выглядит так:

```text
Global Scope
│
└── createStatusValidator Scope
    │
    └── validateStatus Scope
```

Scope Chain revisit:

```text
validateStatus()
│
├── search in own environment
│
├── search in createStatusValidator environment
│
└── search in global environment
```

Closure появляется потому, что `validateStatus` удерживает доступ к outer environment, где лежит `expectedStatus`.

---

### Outer scope access

Функция ищет identifier так же, как раньше:

```text
Need expectedStatus
│
▼
Search local environment
│
▼
Not found
│
▼
Search outer environment
│
▼
Found
```

Outer scope:

```text
createStatusValidator()
│
├── expectedStatus = 200
│
└── validateStatus()
    │
    └── can read expectedStatus
```

После завершения `createStatusValidator()` меняется не правило поиска, а lifetime нужного environment.

```text
Before return
│
└── validateStatus uses outer expectedStatus

After return
│
└── validateStatus still uses outer expectedStatus
```

Главный вопрос остается тем же:

> Почему это значение все еще существует?

Потому что function object все еще существует и все еще ссылается на environment, где находится это значение.

---

## Внутренний механизм

### Полная последовательность

Разберем пример как фильм.

```javascript
function createValidator(expectedStatus) {
  return function validate(actualStatus) {
    return actualStatus === expectedStatus;
  };
}

const validateOk = createValidator(200);

console.log(validateOk(200));
console.log(validateOk(404));
```

Complete Closure model:

```text
1. Global code starts
   │
   ▼
2. createValidator function object exists
   │
   ▼
3. createValidator(200) is called
   │
   ▼
4. Function Execution Context is created
   │
   ▼
5. expectedStatus receives 200
   │
   ▼
6. validate function object is created inside
   │
   ▼
7. validate holds reference to outer lexical environment
   │
   ▼
8. createValidator returns validate
   │
   ▼
9. createValidator execution finishes
   │
   ▼
10. validateOk stores returned function object
    │
    ▼
11. validateOk(200) is called later
    │
    ▼
12. validate reads expectedStatus through environment reference
```

Execution Context revisit:

```text
createValidator Execution Context
│
├── parameter expectedStatus = 200
├── creates validate function object
└── returns validate
```

Function returned:

```text
createValidator()
│
└── returns function object
    │
    ├── name: validate
    └── reference to outer environment
```

Returned function called later:

```text
validateOk(200)
│
├── actualStatus = 200
├── expectedStatus found through outer environment reference
└── returns true
```

---

### Как удерживается доступ

Closure не означает, что JavaScript сохраняет весь Call Stack.

Call Stack interaction:

```text
Call Stack during createValidator()
│
├── Global Execution Context
└── createValidator Execution Context

Call Stack after return
│
└── Global Execution Context
```

Сохраняется не "активный вызов функции".

Function object удерживает ссылку на нужное lexical environment.

```text
Execution Context
│
└── no longer active

Lexical Environment needed by closure
│
└── still reachable through function reference
```

Интуитивная модель памяти:

```text
validateOk
│
└── function object
    │
    ├── code: return actualStatus === expectedStatus
    └── environment link
        │
        └── expectedStatus = 200
```

Мы не углубляемся в Garbage Collector. Важно только одно:

```text
If function still needs environment
│
▼
environment cannot be discarded
```

Garbage Collector будет изучаться позже. Сейчас достаточно понимать: пока function object доступен и ему нужен outer environment, это окружение остается достижимым через ссылку function object.

---

### Lifetime captured variables

Обычная локальная переменная:

```text
Function starts
│
▼
local variable created
│
▼
function finishes
│
▼
variable no longer needed
```

Captured variable:

```text
Function starts
│
▼
local variable created
│
▼
inner function uses it
│
▼
inner function returned
│
▼
outer function finishes
│
▼
variable still needed through function reference
│
▼
environment remains reachable
```

Ожидаемое время жизни vs Фактическое время жизни:

```text
Expected
│
└── variable lives until outer function finishes

Actual with Closure
│
└── variable lives while returned function can still use it
```

Data reachability:

```text
expectedStatus
│
├── created during createValidator(200)
├── captured by validate
├── reachable after createValidator finishes
└── read when validateOk is called
```

---

### Multiple closures

Одна factory function может создать несколько closures.

```javascript
function createCounter(start) {
  let count = start;

  return function increment() {
    count = count + 1;
    return count;
  };
}

const firstCounter = createCounter(0);
const secondCounter = createCounter(10);

console.log(firstCounter());
console.log(firstCounter());
console.log(secondCounter());
```

Multiple counters:

```text
createCounter(0)
│
└── closure A
    │
    └── count = 0

createCounter(10)
│
└── closure B
    │
    └── count = 10
```

Independent closures:

```text
firstCounter()
│
└── uses environment A
    │
    └── count: 0 -> 1 -> 2

secondCounter()
│
└── uses environment B
    │
    └── count: 10 -> 11
```

Они не делят один `count`, потому что каждый вызов `createCounter()` создает новое lexical environment.

```text
One function definition
│
▼
many function calls
│
▼
many lexical environments
│
▼
many independent closures
```

---

### Closure timeline

Closure временная шкала:

```text
T1  createCounter function object exists
│
T2  createCounter(0) called
│
T3  count created with value 0
│
T4  increment function object created
│
T5  increment captures access to count
│
T6  createCounter returns increment
│
T7  createCounter finishes
│
T8  count is still needed
│
T9  firstCounter() called
│
T10 firstCounter reads and updates count
```

Environment lifetime:

```text
createCounter environment
│
├── active while createCounter runs
└── remains reachable because increment references it
```

Closure lifetime:

```text
Returned function exists
│
▼
function object holds environment reference
│
▼
returned function can read captured variables
```

---

## Ментальная модель

### Рюкзак

Представьте функцию, которая выходит из комнаты, но берет с собой рюкзак.

В рюкзаке не лежит копия всего мира. Эта модель означает, что у function object остается ссылка на то окружение, которое функции нужно.

Backpack analogy:

```text
Function object
│
├── code
└── backpack
    │
    └── access to outer variables
```

Когда функция вызывается позже:

```text
function called later
│
├── uses its own parameters
└── opens backpack when outer variable is needed
```

Эта модель полезна, но ее нужно понимать аккуратно:

```text
Backpack means
│
└── reference to lexical environment

Backpack does not mean
│
└── copied values snapshot
```

---

### Запомненная комната

Другая модель - linked room.

```text
Outer function room
│
├── expectedStatus
└── inner function was created here
```

Когда outer function завершилась, комната не уничтожается, если inner function все еще может туда вернуться за нужным identifier.

Remembered room:

```text
inner function
│
└── has a link to room where it was created
    │
    └── can read variables from that room
```

Invisible link:

```text
validateOk
│
└── function object
    │
    └── invisible link
        │
        └── createValidator environment
```

---

### Notebook

Closure можно представить как notebook с записями, которые функция может использовать позже.

```text
Notebook
│
├── expectedStatus: 200
└── baseUrl: 'https://api.example.test'
```

Объект функции:

```text
validator
│
├── receives actualStatus
└── reads expectedStatus from notebook
```

Notebook помогает понять, почему helper factory удобна в тестах:

```text
createApiValidator(baseUrl)
│
└── returns validator
    │
    └── has access to baseUrl through environment reference
```

---

### Текущее место в модели JavaScript

Текущее место в модели JavaScript:

```text
JavaScript execution model
│
├── Engine and Runtime
├── Execution Context
├── Call Stack
├── Memory
├── Variables
├── Scope
├── Lexical Environment
├── Functions
│   ├── Declaration
│   ├── Expression
│   ├── Arrow Functions
│   ├── Parameters
│   ├── Return
│   ├── Rest
│   ├── Spread
│   └── Closures
└── this
    └── next chapter
```

Переход к this:

```text
Closure
│
└── explains how function keeps access to lexical environment

this
│
└── will explain how function receives execution receiver/context
```

Closure отвечает:

```text
What variables can this function still access?
```

`this` ответит:

```text
How is this function called and what is its receiver?
```

---

## Примеры кода

Примеры находятся в папке:

```text
examples/01-javascript/chapter-28/
```

Запуск:

```bash
node examples/01-javascript/chapter-28/01-first-closure.js
node examples/01-javascript/chapter-28/02-counter.js
node examples/01-javascript/chapter-28/03-independent-closures.js
node examples/01-javascript/chapter-28/04-common-mistakes.js
node examples/01-javascript/chapter-28/05-memory-intuition.js
node examples/01-javascript/chapter-28/06-qa-example.js
```

### Первый Closure

```javascript
function createMessageReader() {
  const message = 'Environment is reachable';

  return function readMessage() {
    return message;
  };
}

const readMessage = createMessageReader();

console.log(readMessage());
```

Что происходит:

```text
createMessageReader()
│
├── creates message
├── creates readMessage
├── readMessage uses message
└── returns readMessage
```

Позже:

```text
readMessage()
│
└── reads message through environment reference
```

---

### Counter

```javascript
function createCounter() {
  let count = 0;

  return function increment() {
    count = count + 1;
    return count;
  };
}

const counter = createCounter();

console.log(counter());
console.log(counter());
console.log(counter());
```

Complete counter picture:

```text
counter
│
└── increment function object
    │
    └── reference to lexical environment
        │
        └── count: 0 -> 1 -> 2 -> 3
```

`count` не становится global variable. Он остается доступным только через returned function.

---

### Independent closures

```javascript
function createCounter(start) {
  let count = start;

  return function increment() {
    count = count + 1;
    return count;
  };
}

const smallCounter = createCounter(0);
const largeCounter = createCounter(100);

console.log(smallCounter());
console.log(smallCounter());
console.log(largeCounter());
console.log(largeCounter());
```

Independent environment picture:

```text
smallCounter
│
└── count starts at 0

largeCounter
│
└── count starts at 100
```

Каждый вызов `createCounter()` создает отдельное lexical environment.

---

### Memory intuition

```javascript
function createUserReader(userName) {
  return function readUserName() {
    return userName;
  };
}

const readAdminName = createUserReader('Anna');
const readGuestName = createUserReader('Ivan');

console.log(readAdminName());
console.log(readGuestName());
```

Интуитивная модель памяти:

```text
readAdminName
│
└── environment A
    │
    └── userName = 'Anna'

readGuestName
│
└── environment B
    │
    └── userName = 'Ivan'
```

Это концептуальная модель, а не описание внутренней памяти конкретного engine.

---

### QA-пример

```javascript
function createStatusValidator(expectedStatus) {
  return function validateResponse(response) {
    return response.status === expectedStatus;
  };
}

const validateSuccess = createStatusValidator(200);
const validateCreated = createStatusValidator(201);

const response = {
  status: 200
};

console.log(validateSuccess(response));
console.log(validateCreated(response));
```

Пример QA-helper:

```text
createStatusValidator(200)
│
└── returns validator
    │
    └── reaches expectedStatus = 200 through environment reference

createStatusValidator(201)
│
└── returns validator
    │
    └── reaches expectedStatus = 201 through environment reference
```

Так можно создавать читаемые validators без дублирования expected значения в каждом тесте.

---

## Частые вопросы

### Closure копирует значения?

Нет. Полезнее думать так: function object удерживает ссылку на lexical environment, где лежат нужные identifiers.

```text
Not a copy
│
└── not a frozen snapshot

Access to environment
│
└── reference held by function object
```

### Closure появляется только при return function?

Нет. Но в этой главе мы используем `return function`, потому что это самый понятный способ увидеть поведение. Другие применения будут встречаться позже, например в callbacks и event listeners.

### Closure делает переменную global?

Нет. Captured variable не становится global variable.

```text
Global variable
│
└── accessible from global scope

Captured variable
│
└── accessible through function that captured it
```

### Closure всегда плохо влияет на память?

Нет. Closure - нормальный механизм языка. Проблемы появляются, когда код случайно сохраняет больше данных, чем нужно. Garbage Collector и memory management будут изучаться позже.

---

## Распространенные мифы

### Миф 1. Closure - это редкая продвинутая техника

Реальность: Closures встречаются в обычном JavaScript-коде постоянно, особенно в helper creators, validators и factory functions.

```text
Factory function
│
└── returns configured helper
    │
    └── closure is already involved
```

### Миф 2. Closure хранит копию всех переменных outer function

Реальность: правильнее мыслить через ссылку function object на нужное lexical environment.

```text
Not:
│
└── copy all values

Better model:
│
└── function object references environment it needs
```

### Миф 3. Closure делает код непредсказуемым

Реальность: Closure предсказуема, если вручную отслеживать:

```text
Where function was created
│
▼
What outer identifiers it uses
│
▼
Which environment is referenced
```

Closure становится сложной только тогда, когда разработчик пытается запомнить определение вместо того, чтобы рисовать environment.

---

## Типичные ошибки

### Ошибка 1. Думать, что outer variable исчезла всегда

Неправильная модель:

```text
outer function finished
│
▼
all local data must disappear
```

Что произошло:

```text
inner function still references outer variable
│
▼
environment remains reachable through function reference
```

Исправленная модель:

```text
outer function execution finished
│
▼
needed lexical environment may still be reachable
```

---

### Ошибка 2. Думать, что Closure хранит копию значения

```javascript
function createCounter() {
  let count = 0;

  return function increment() {
    count = count + 1;
    return count;
  };
}
```

Если бы Closure хранила копию, `count` каждый раз был бы `0`.

Фактическое поведение:

```text
same reachable variable
│
└── updated on every call
```

---

### Ошибка 3. Создавать общий состояние случайно

```javascript
let sharedStatus = 200;

function validateStatus(actualStatus) {
  return actualStatus === sharedStatus;
}
```

Это не factory. Это global mutable состояние.

Более контролируемый вариант:

```javascript
function createStatusValidator(expectedStatus) {
  return function validateStatus(actualStatus) {
    return actualStatus === expectedStatus;
  };
}
```

Типичные ошибки:

```text
Global mutable state
│
└── many tests can accidentally affect it

Closure factory
│
└── each validator references its own environment
```

---

### Ошибка 4. Путать Closure и Scope

Scope отвечает на вопрос:

```text
Where is identifier visible?
```

Closure отвечает на вопрос:

```text
Why can function still reach outer environment later?
```

Они связаны, но это не одно и то же.

---

## Практическое использование

Closure полезна, когда нужно создать функцию, которая имеет доступ к части настройки из Lexical Environment, где была создана.

Factory function:

```text
input configuration
│
▼
create specialized function
│
▼
use specialized function later
```

Пример:

```javascript
function createPrefixLogger(prefix) {
  return function logMessage(message) {
    console.log(prefix + ': ' + message);
  };
}

const logApi = createPrefixLogger('API');
const logUi = createPrefixLogger('UI');

logApi('Request started');
logUi('Button clicked');
```

Complete practical picture:

```text
createPrefixLogger('API')
│
└── logMessage reaches prefix = 'API'

createPrefixLogger('UI')
│
└── logMessage reaches prefix = 'UI'
```

Closure помогает:

* создавать specialized helpers;
* избегать лишних global variables;
* хранить configuration рядом с поведение;
* делать код выразительнее;
* уменьшать дублирование.

---

## Использование в Automation QA

### Factory functions

В Automation QA часто нужны helpers, которые отличаются только настройкой.

```javascript
function createHeaderValidator(expectedHeaderName) {
  return function validateHeaders(headers) {
    return headers[expectedHeaderName] !== undefined;
  };
}
```

QA factory:

```text
createHeaderValidator('x-request-id')
│
└── returns validator
    │
    └── references environment with header name
```

---

### Reusable validators

```javascript
function createResponseValidator(expectedStatus) {
  return function validateResponse(response) {
    return response.status === expectedStatus;
  };
}

const validateOk = createResponseValidator(200);
const validateCreated = createResponseValidator(201);
```

Automation QA object:

```text
response
│
├── status
├── body
└── headers

validator closure
│
└── reaches expected status through environment reference
```

Такой подход полезен для REST API проверок, где один и тот же алгоритм применяется к разным expected значения.

---

### Configuration capture

```javascript
function createApiUrlBuilder(baseUrl) {
  return function buildUrl(path) {
    return baseUrl + path;
  };
}

const buildStagingUrl = createApiUrlBuilder('https://staging.example.test');

console.log(buildStagingUrl('/users'));
```

Configuration capture:

```text
baseUrl
│
└── captured once

path
│
└── provided on every call
```

Это удобно для helpers, которые должны помнить environment configuration.

---

### Locator factories

В Playwright locator factories часто строятся вокруг контекста страницы или selector prefix, к которым helper получает доступ через environment reference. Подробно Playwright будет изучаться позже, но сама идея Closure уже понятна.

```text
createLocator(prefix)
│
└── returns function
    │
    └── holds reference to environment with prefix
```

Важно: callbacks, async поведение и event listeners будут разобраны позже. Здесь достаточно понять: Closure позволяет helper иметь доступ к данным из Lexical Environment, где он был создан.

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/28-closures.md
```

Выполняйте задания после запуска примеров из `examples/01-javascript/chapter-28/`.

Решения находятся отдельно:

```text
solutions/01-javascript/28-closures.md
```

Сначала решите задания самостоятельно. Для Closures особенно важно не угадывать ответ, а вручную рисовать environment:

```text
function object
│
└── reference to lexical environment
```

---

## Решения

Файл с решениями:

```text
solutions/01-javascript/28-closures.md
```

В решениях важно смотреть не только на итоговый код, но и на reasoning: для Closures главный навык - объяснять, почему function object все еще имеет доступ к конкретному lexical environment.

```text
Answer
│
├── code result
├── reasoning
├── common mistake
└── Связь с Automation QA
```

---

## Итоги

Closure объясняет, почему функция может использовать outer variables после завершения outer function.

Главная идея:

```text
Function object
│
▼
holds reference to
│
▼
Lexical Environment
where it was created
```

Полная картина:

```text
Outer function called
│
▼
Outer Lexical Environment created
│
▼
Inner function object created
│
▼
Inner function uses outer identifiers
│
▼
Outer function returns inner function
│
▼
Outer execution finishes
│
▼
Returned function keeps environment reachable
│
▼
Returned function is called later
│
▼
Outer variables are still accessible
```

Closure не является магией. Function object удерживает ссылку на Lexical Environment, где он был создан, потому что продолжает использовать identifiers из этого окружения.

---

## Что нужно запомнить

* Closure - это поведение function object, который удерживает ссылку на Lexical Environment, где был создан.
* Closure появляется, когда функция использует variables из outer scope.
* Outer function может завершиться, но нужное lexical environment может оставаться достижимым через function object.
* Captured variable не становится global variable.
* Closure не копирует значения как frozen snapshot.
* Каждый вызов factory function может создать независимое lexical environment.
* Closures полезны для factory functions, validators, configuration capture и QA helpers.
* Следующая глава про `this` объяснит другой вопрос: не какие variables видны функции, а как определяется ее execution объект выполнения.

Краткая ментальная модель:

```text
Closure
│
├── function object
├── code to execute
└── reference to lexical environment
```

---

## Проверьте себя

Ответьте без запуска кода:

1. Почему `expectedStatus` доступен после завершения `createStatusValidator()`?
2. Closure копирует значение переменной или function object удерживает ссылку на environment?
3. Почему два вызова `createCounter()` создают независимые counters?
4. Чем Scope отличается от Closure?
5. Почему captured variable не является global variable?
6. Какая тема логически следует после Closures и почему?
