# Hoisting

## Связь с предыдущей главой

Предыдущая глава объяснила Lexical Environment:

```text
Lexical Environment
│
├── Environment Record
│   └── identifier records
│
└── Outer Environment Reference
    └── link to outer environment
```

Теперь появляется следующий вопрос:

> Если Environment Record хранит identifiers, когда эти records появляются?

В главах про Execution Context и Lexical Environment уже была важная идея:

```text
Execution does not start immediately.
Before execution, engine prepares the environment.
```

Эта глава объясняет Hoisting как observable result этой подготовки.

Главная мысль:

```text
Hoisting is NOT moving code.

Hoisting is the observable result
of the engine preparing declarations
during the Creation Phase.
```

Source code не меняет position. Engine не берет строки и не переносит их вверх. Вместо этого до выполнения строк engine подготавливает records в Lexical Environment.

---

## Предварительные требования

Для этой главы нужно понимать:

* что JavaScript file проходит preparation перед execution;
* что Execution Context имеет Creation Phase и Execution Phase;
* что Lexical Environment хранит identifier records;
* что Variables создают identifiers;
* что `var`, `let`, `const` и function declaration создают разные виды declarations;
* что Scope определяет visibility identifiers.

Не требуется знать Temporal Dead Zone internals, Closures, modules, `this` или детали спецификации ECMAScript. TDZ будет объяснен в следующей главе; сейчас мы упомянем его только как причину поведения `let` и `const` до initialization.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            110-140 минут
Разбор схем:              50-70 минут
Запуск примеров:          25-35 минут
Практика:                 90-120 минут
Повторение материала:     30 минут
```

Уровень сложности: **L3**.

L3 означает фундаментальный уровень: Hoisting часто объясняют как "поднятие кода", но эта глава заменяет миф внутренней моделью Creation Phase и Lexical Environment.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/08-lexical-environment.md
```

Следующая глава:

```text
docs/01-javascript/10-temporal-dead-zone.md
```

Следующая глава объяснит Temporal Dead Zone: почему `let` и `const` registered during Creation Phase, но доступ к ним до initialization ведет себя иначе, чем `var`.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* почему Hoisting существует;
* какое поведение наблюдает программист;
* что engine actually делает до execution;
* как Creation Phase связана с Hoisting;
* как регистрируются function declarations;
* как регистрируется `var`;
* как регистрируются `let` и `const`;
* чем declaration отличается от initialization;
* почему functions behave differently;
* почему source code никогда не moves upward;
* как читать legacy JavaScript без мифа про "перенос строк";
* как Hoisting связан с Lexical Environment;
* почему следующая тема — TDZ.

---

## Мотивация

Начнем с кода, который удивляет многих.

```javascript
console.log(userName);

var userName = 'Anna';
```

Результат:

```text
undefined
```

Если думать, что JavaScript просто выполняет строки сверху вниз, возникает вопрос:

```text
Line 1 reads userName
│
▼
Line 2 declares userName
│
▼
Why is there no ReferenceError?
```

Теперь похожий пример:

```javascript
// console.log(userRole);

let userRole = 'admin';
```

Если раскомментировать первую строку, код не выведет `undefined`. Он упадет с ошибкой доступа до initialization. Подробности Temporal Dead Zone будут в следующей главе; сейчас важен факт:

```text
var before line
│
└── observable result: undefined

let before line
│
└── observable result: error
```

Еще один пример:

```javascript
printStatus();

function printStatus() {
  console.log('ready');
}
```

Результат:

```text
ready
```

Функцию можно вызвать до строки объявления.

Значит, разные declarations affect execution до того, как engine reaches their line. Но source code не двигается.

Главный вопрос главы:

> Что engine подготовил до начала execution?

---

## Теория

### Проблема мифа "код поднимается вверх"

Популярное объяснение:

```text
JavaScript moves declarations to the top.
```

Это удобная, но опасная фраза.

Она создает неправильную картину:

```text
Original source code
│
▼
Engine rewrites source code
│
▼
Declarations are moved upward
```

Так думать не нужно.

Правильная модель:

```text
Source Code
│
└── stays in the same order

Creation Phase
│
└── engine prepares declaration records

Execution Phase
│
└── engine executes source code in original order
```

Диаграмма Source Code:

```text
Source Code
│
├── line 1: console.log(userName)
├── line 2:
└── line 3: var userName = "Anna"

Source code position never changes.
```

Hoisting — это не movement. Hoisting — это observed behavior после preparation.

### Что программист наблюдает

Программист видит три разных поведения.

Function declaration:

```javascript
printStatus();

function printStatus() {
  console.log('ready');
}
```

Работает.

`var`:

```javascript
console.log(status);

var status = 'ready';
```

Выводит:

```text
undefined
```

`let` / `const`:

```javascript
// console.log(status);

let status = 'ready';
```

До строки initialization access fails. TDZ explains why; следующая глава будет полностью об этом.

Вопрос:

```text
Why does function declaration work?
Why does var produce undefined?
Why do let/const fail before initialization?
```

Ответ начинается в Creation Phase.

### Creation Phase revisited

Execution Context создается в два крупных шага:

```text
Execution Context
│
├── Creation Phase
└── Execution Phase
```

Creation Phase:

```text
Before running code lines
│
▼
prepare Lexical Environment
│
▼
register declarations
│
▼
prepare rules for later execution
```

Execution Phase:

```text
Run source code
│
▼
line by line in original order
│
▼
read / assign / call / compute
```

Диаграмма Creation Phase:

```text
Creation Phase
│
├── scan declarations conceptually
├── create / prepare Environment Records
├── register function declarations
├── register var declarations
├── register let declarations
└── register const declarations
```

Диаграмма Execution Phase:

```text
Execution Phase
│
├── execute line 1
├── execute line 2
├── execute line 3
└── continue in source order
```

Что engine подготовил до execution:

```text
Identifier records.
Initial access behavior.
Function declaration bindings.
var bindings with undefined.
let/const bindings not initialized yet.
```

### Lexical Environment before execution

Во время Creation Phase engine подготавливает Lexical Environment.

```text
Before Execution
│
▼
Lexical Environment
│
└── Environment Record prepared
```

Environment Record before execution:

```text
Environment Record
│
├── function printStatus → function object / callable binding
├── var userName         → undefined
├── let userRole         → registered but not initialized
└── const baseUrl        → registered but not initialized
```

Это conceptual diagram, не спецификация.

Важно:

```text
Registration happens before execution.
Initialization may happen later during execution.
```

### Function Declaration registration

Function declaration регистрируется во время Creation Phase так, что function can be called before its line.

```javascript
printStatus();

function printStatus() {
  console.log('ready');
}
```

Creation Phase:

```text
Source contains:
function printStatus() { ... }
│
▼
Creation Phase
│
▼
Environment Record
└── printStatus → function
```

Execution Phase:

```text
line 1: printStatus()
│
▼
lookup printStatus
│
▼
function already registered
│
▼
call function
```

Диаграмма Function Declaration registration:

```text
Function Declaration
│
▼
Creation Phase
│
▼
register identifier
│
▼
attach callable function
│
▼
Execution can call it before source line
```

Что engine подготовил до execution:

```text
Identifier printStatus.
Callable function binding.
```

### var registration

`var` declaration тоже учитывается во время Creation Phase.

```javascript
console.log(userName);

var userName = 'Anna';
```

Creation Phase:

```text
var userName
│
▼
Environment Record
└── userName → undefined
```

Execution Phase:

```text
line 1: console.log(userName)
│
▼
lookup userName
│
▼
found userName → undefined
│
▼
print undefined

line 3: userName = "Anna"
│
▼
assign "Anna"
```

Диаграмма var registration:

```text
Source Code
│
└── var userName = "Anna"

Creation Phase
│
└── register userName with undefined

Execution Phase
│
├── read userName → undefined
└── assignment userName = "Anna"
```

Здесь важно разделить declaration and initialization.

```text
var userName = "Anna"
│
├── declaration part handled in Creation Phase
└── assignment part happens in Execution Phase
```

### let registration

`let` declaration тоже регистрируется во время Creation Phase, но не behaves like `var`.

```javascript
// console.log(userRole);

let userRole = 'admin';
```

Creation Phase:

```text
let userRole
│
▼
Environment Record
└── userRole → registered, not initialized
```

Execution Phase:

```text
before line: let userRole = "admin"
│
└── access userRole fails

line: let userRole = "admin"
│
└── initialize userRole with "admin"
```

Диаграмма let registration:

```text
Source Code
│
└── let userRole = "admin"

Creation Phase
│
└── register userRole

Execution Phase
│
├── before initialization: access fails
└── declaration line: initialize with "admin"
```

Подробный механизм TDZ будет в следующей главе. Сейчас нужно запомнить:

```text
let is registered during Creation Phase.
It is not initialized like var.
```

### const registration

`const` похож на `let` в том, что identifier is registered during Creation Phase, but not initialized until execution reaches declaration line.

```javascript
// console.log(baseUrl);

const baseUrl = 'https://example.com';
```

Creation Phase:

```text
const baseUrl
│
▼
Environment Record
└── baseUrl → registered, not initialized
```

Execution Phase:

```text
line: const baseUrl = "https://example.com"
│
├── initialize baseUrl
└── disallow reassignment after initialization
```

Диаграмма const registration:

```text
Source Code
│
└── const baseUrl = "https://example.com"

Creation Phase
│
└── register baseUrl

Execution Phase
│
└── initialize baseUrl when declaration line runs
```

`const` must be initialized at declaration. Это уже было в главе Variables. Здесь важно другое: declaration record exists before execution, but usable value appears only at initialization line.

### Declaration vs initialization

Hoisting невозможно понять без разделения declaration и initialization.

```javascript
var userName = 'Anna';
```

Разделение:

```text
Declaration
│
└── var userName

Initialization / assignment
│
└── userName = "Anna"
```

Диаграмма declaration vs initialization:

```text
Creation Phase
│
└── declaration affects Environment Record

Execution Phase
│
└── initialization / assignment happens when line runs
```

Для function declaration:

```text
Creation Phase
│
└── function identifier registered with callable function
```

Для `var`:

```text
Creation Phase
│
└── identifier registered with undefined

Execution Phase
│
└── assignment happens on original line
```

Для `let` / `const`:

```text
Creation Phase
│
└── identifier registered but not initialized

Execution Phase
│
└── initialization happens on original line
```

### Why functions behave differently

Function declarations behave differently because during Creation Phase engine prepares a callable binding for them.

```javascript
runTest();

function runTest() {
  console.log('test started');
}
```

Before execution:

```text
Environment Record
└── runTest → function
```

Then line 1 can call `runTest`.

This is useful because function declarations describe reusable actions:

```text
Function Declaration
│
└── complete callable unit
```

`var userName = 'Anna'` is different:

```text
var declaration
│
└── name can be prepared

assignment
│
└── value appears when execution reaches the line
```

So:

```text
Function declaration
│
└── callable before line

var
│
└── exists before line, value is undefined

let / const
│
└── registered before line, unusable before initialization
```

### Complete Creation Phase timeline

Для кода:

```javascript
printStatus();

console.log(userName);

var userName = 'Anna';
let userRole = 'admin';
const baseUrl = 'https://example.com';

function printStatus() {
  console.log('ready');
}
```

Creation Phase timeline:

```text
Creation Phase starts
│
▼
prepare Lexical Environment
│
▼
create Environment Record
│
▼
register function printStatus → function
│
▼
register var userName → undefined
│
▼
register let userRole → not initialized
│
▼
register const baseUrl → not initialized
│
▼
Creation Phase finished
```

Environment Record before execution:

```text
Environment Record
│
├── printStatus → function
├── userName    → undefined
├── userRole    → registered, not initialized
└── baseUrl     → registered, not initialized
```

### Execution timeline

Execution runs source code in original order.

```text
Execution Phase starts
│
▼
line 1: printStatus()
│
├── lookup printStatus
│
└── call function
│
▼
line 3: console.log(userName)
│
├── lookup userName
│
└── read undefined
│
▼
line 5: var userName = "Anna"
│
└── assign "Anna"
│
▼
line 6: let userRole = "admin"
│
└── initialize userRole
│
▼
line 7: const baseUrl = "https://example.com"
│
└── initialize baseUrl
```

Execution timeline:

```text
Source code order is preserved.
No line moved.
No declaration moved.
Prepared records are used.
```

### Engine preparation movie

Ментальный фильм engine:

```text
"I received source code."
│
▼
"I parse and prepare it."
│
▼
"I create Execution Context."
│
▼
"I enter Creation Phase."
│
▼
"I prepare Lexical Environment."
│
▼
"I fill Environment Record with declarations."
│
▼
"I register functions as callable."
│
▼
"I register var as undefined."
│
▼
"I register let and const, but do not initialize them yet."
│
▼
"Creation Phase is complete."
│
▼
"I start Execution Phase."
│
▼
"I execute source code in original order."
```

### Current position in JavaScript model

Теперь модель курса выглядит так:

```text
Execution Context
│
├── Creation Phase
│   └── prepares Lexical Environment
│       └── registers declarations
│
└── Execution Phase
    └── executes source code in original order
```

Full position:

```text
JavaScript Engine
│
▼
Execution Context
│
▼
Call Stack
│
▼
Memory
│
▼
Variables
│
▼
Scope
│
▼
Lexical Environment
│
▼
Hoisting
```

### Переход к TDZ

После этой главы остается важный вопрос:

```text
If let and const are registered during Creation Phase,
why does accessing them before initialization throw an error?
```

Это вопрос Temporal Dead Zone.

TDZ — период между registration `let` / `const` during Creation Phase and initialization during Execution Phase, когда access is not allowed. Подробная глава о TDZ будет следующей.

```text
Creation Phase
│
└── let/const registered

Before initialization line
│
└── access fails

Execution reaches declaration
│
└── initialization happens
```

---

## Внутренний механизм

Hoisting — observable result подготовки declarations.

Внутренний механизм:

```text
Source Code
│
▼
Execution Context creation
│
▼
Creation Phase
│
▼
Lexical Environment prepared
│
▼
Environment Record filled with declaration records
│
▼
Execution Phase starts
│
▼
Source code runs in original order
```

Для function declaration:

```text
Creation Phase
│
└── function identifier → callable function
```

Для `var`:

```text
Creation Phase
│
└── var identifier → undefined

Execution Phase
│
└── assignment on source line
```

Для `let`:

```text
Creation Phase
│
└── let identifier → registered, not initialized

Execution Phase
│
└── initialization on declaration line
```

Для `const`:

```text
Creation Phase
│
└── const identifier → registered, not initialized

Execution Phase
│
└── required initialization on declaration line
```

Что engine подготовил до execution started:

```text
Function declarations.
var identifiers with undefined.
let identifiers in uninitialized state.
const identifiers in uninitialized state.
```

---

## Ментальная модель

### Preparing a classroom before students arrive

Представьте класс до начала занятия.

```text
Before students arrive
│
├── teacher prepares seats
├── writes names in registration list
├── puts materials on some desks
└── leaves some desks reserved but empty
```

Execution — это когда students arrive and work begins.

```text
Preparation
│
└── classroom is prepared

Execution
│
└── lesson actually starts
```

### Filling a registration list

Environment Record похож на registration list.

```text
Registration List before execution
│
├── printStatus → ready to use
├── userName    → registered as undefined
├── userRole    → reserved, not initialized
└── baseUrl     → reserved, not initialized
```

### Reserving places before work starts

`let` and `const` можно представить как reserved places:

```text
Reserved place
│
├── name is known
└── value cannot be used yet
```

`var`:

```text
Reserved place
│
├── name is known
└── default value: undefined
```

Function declaration:

```text
Prepared place
│
├── name is known
└── function is ready to call
```

### Preparation versus execution

Главное разделение:

```text
Preparation
│
└── engine prepares records

Execution
│
└── engine runs code lines
```

Никогда не заменяйте это на:

```text
Code moves upward
```

Правильная формула:

```text
Hoisting is not moving code.
Hoisting is preparation before execution.
```

---

## Примеры кода

Примеры к этой главе находятся в папке:

```text
examples/chapter-12/
```

Запускайте их из корня проекта.

### Пример 1. Function hoisting

Файл:

```text
examples/chapter-12/01-function-hoisting.js
```

Показывает, что function declaration can be called before its line because Creation Phase prepared it.

### Пример 2. var hoisting

Файл:

```text
examples/chapter-12/02-var-hoisting.js
```

Показывает, что `var` is registered with `undefined` before assignment line.

### Пример 3. let behavior

Файл:

```text
examples/chapter-12/03-let-behavior.js
```

Показывает safe access после initialization и содержит закомментированную строку, которая будет разобрана в следующей главе про TDZ.

### Пример 4. const behavior

Файл:

```text
examples/chapter-12/04-const-behavior.js
```

Показывает safe access после required initialization.

### Пример 5. Declaration vs initialization

Файл:

```text
examples/chapter-12/05-declaration-vs-initialization.js
```

Показывает, что declaration и assignment — разные части.

### Пример 6. Типичные ошибки

Файл:

```text
examples/chapter-12/06-common-mistakes.js
```

Показывает типичные мифы через безопасные comments and corrected code.

---

## Частые вопросы

### Hoisting действительно поднимает код?

Нет. Source code не меняет порядок. Engine подготавливает declarations during Creation Phase, а execution идет по исходным строкам.

### Почему function declaration можно вызвать до объявления?

Потому что Creation Phase registers function declaration as callable binding before Execution Phase starts.

### Почему `var` дает `undefined`?

Потому что `var` declaration registered during Creation Phase with `undefined`, а assignment happens later during Execution Phase.

### Почему `let` и `const` не дают `undefined` как `var`?

Они тоже registered during Creation Phase, but not initialized like `var`. Подробный ответ — TDZ — следующая глава.

### Нужно ли использовать Hoisting intentionally?

В новом коде лучше не писать так, чтобы reader relied on Hoisting. Понимать Hoisting нужно для чтения existing and legacy code.

---

## Распространенные мифы

### Миф 1. JavaScript переносит declarations вверх файла

Реальность:

Source code stays in place. Engine prepares declaration records before execution.

### Миф 2. Hoisting работает одинаково для всех declarations

Реальность:

Function declarations, `var`, `let` and `const` have different preparation behavior.

### Миф 3. `var a = 5` полностью выполняется до первой строки

Реальность:

Declaration part is prepared. Assignment `a = 5` happens when execution reaches the line.

### Миф 4. Hoisting — это редкая странность

Реальность:

Hoisting is a direct consequence of Creation Phase and Lexical Environment preparation.

---

## Типичные ошибки

### Ошибка 1. Говорить, что код "переехал наверх"

Неправильная модель:

```text
var userName = "Anna" moved to top.
```

Что произошло:

Код не moving. Engine prepared identifier record.

Исправленная модель:

```text
Creation Phase registered userName with undefined.
Execution Phase later assigned "Anna".
```

### Ошибка 2. Ожидать value у `var` до assignment

Неправильный код:

```javascript
console.log(userName);

var userName = 'Anna';
```

Ожидание:

```text
Anna
```

Реальность:

```text
undefined
```

Почему:

Only declaration is prepared with `undefined`; assignment happens later.

### Ошибка 3. Объяснять `let` / `const` как "not hoisted"

Неправильная модель:

```text
let and const are not hoisted.
```

Более точная модель:

```text
let and const are registered during Creation Phase,
but access before initialization is restricted.
```

TDZ explains this next.

### Ошибка 4. Полагаться на Hoisting в новом коде

Неправильный стиль:

```javascript
runTest();

function runTest() {
  console.log('test');
}
```

Такой код работает, но в больших проектах часто читается хуже.

Более читаемый стиль:

```javascript
function runTest() {
  console.log('test');
}

runTest();
```

---

## Практическое использование

При чтении кода задавайте вопросы:

```text
1. Какие declarations есть в scope?
2. Что Creation Phase подготовит?
3. Что будет в Environment Record before execution?
4. Что произойдет на каждой строке Execution Phase?
5. Где declaration, а где initialization / assignment?
```

Таблица анализа:

```text
Declaration                 | Creation Phase                 | Execution Phase
----------------------------|--------------------------------|-------------------------------
function printStatus() {}   | printStatus → function         | callable immediately
var userName = "Anna"       | userName → undefined           | assign "Anna" on line
let userRole = "admin"      | userRole registered            | initialize on line
const baseUrl = "..."       | baseUrl registered             | initialize on line
```

Мини-чек-лист:

```text
✓ Я не говорю "код поднимается".
✓ Я отделяю Creation Phase от Execution Phase.
✓ Я отделяю declaration от initialization.
✓ Я понимаю function declaration behavior.
✓ Я понимаю var as undefined before assignment.
✓ Я знаю, что let/const требуют следующей темы: TDZ.
```

---

## Использование в Automation QA

### Reading legacy JavaScript

В старых helper files можно встретить:

```javascript
runSetup();

function runSetup() {
  console.log('setup');
}
```

Это работает не потому, что code moved. Function declaration was prepared during Creation Phase.

### Debugging old helper files

Legacy code часто использует `var`:

```javascript
console.log(environmentName);

var environmentName = 'staging';
```

Если output is `undefined`, проблема не в `console.log`. Engine prepared `environmentName` as `undefined`, but assignment happens later.

### Understanding function declarations in frameworks

В существующих test frameworks могут быть function declarations below usage.

```text
test runner setup
│
├── call helper
└── helper declared later
```

Hoisting model помогает читать такой код without panic.

### Avoiding myths in Playwright or Node.js codebases

В Playwright tests лучше писать код так, чтобы reader did not need to mentally simulate Hoisting.

```javascript
function buildUserName() {
  return 'qa-user';
}

const userName = buildUserName();
```

Читаемость важнее демонстрации знания Hoisting.

Правило для Automation QA:

```text
Understand Hoisting to read existing code.
Avoid relying on Hoisting in new test code.
```

---

## Итоги

Hoisting — это не перемещение кода.

Главная модель:

```text
Hoisting is the observable result
of the engine preparing declarations
during the Creation Phase.
```

Source code остается в исходном порядке. Engine создает Execution Context, входит в Creation Phase, подготавливает Lexical Environment and Environment Records, registers declarations, and only then starts Execution Phase.

Разные declarations behave differently:

```text
function declaration
│
└── registered as callable function

var
│
└── registered with undefined

let / const
│
└── registered but not initialized
```

Следующая глава объяснит Temporal Dead Zone: почему `let` и `const` registered during Creation Phase, но access before initialization fails.

---

## Что нужно запомнить

✓ Hoisting is not moving code.

✓ Source code never changes position.

✓ Hoisting comes from Creation Phase.

✓ Creation Phase prepares Lexical Environment.

✓ Environment Record receives declaration records before execution.

✓ Function declarations are registered as callable.

✓ `var` is registered with `undefined`.

✓ `let` and `const` are registered but not initialized.

✓ Declaration and initialization are different operations.

✓ Execution Phase runs code in original order.

✓ TDZ explains `let` / `const` access before initialization in the next chapter.

---

## Проверьте себя

1. Почему Hoisting существует?

2. Почему неправильно говорить, что JavaScript moves code upward?

3. Что происходит during Creation Phase?

4. Что происходит during Execution Phase?

5. Как регистрируется function declaration?

6. Как регистрируется `var`?

7. Как регистрируется `let`?

8. Как регистрируется `const`?

9. Чем declaration отличается от initialization?

10. Почему следующая тема — TDZ?

---

## Практика

Практика к этой главе находится в файле:

```text
practice/chapter-12.md
```

Перед практикой запустите примеры из `examples/chapter-12/` и для каждого файла составьте Creation Phase / Execution Phase timeline.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-12.md
```

Открывайте решения после самостоятельной попытки. В этой главе важно сравнивать не только output, но и то, что было prepared before execution.
