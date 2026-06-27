# Scope

## Связь с предыдущей главой

Предыдущая глава ответила на вопрос:

> Как в программе появляются имена?

Variables дают named access к сохраненной информации:

```text
Variable
│
└── named access to stored information
```

Но после variables сразу появляется следующий вопрос:

> Где эти имена можно использовать?

Код ниже работает:

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
```

А такой код приводит к ошибке:

```javascript
function prepareUser() {
  const userName = 'Anna';
}

prepareUser();

// console.log(userName);
```

Почему `baseUrl` доступен после объявления, а `userName` снаружи функции недоступен?

На этот вопрос отвечает Scope.

Общая цепочка теперь такая:

```text
Execution Context
│
└── создает среду выполнения

Call Stack
│
└── управляет активным context

Memory
│
└── хранит информацию во время выполнения

Variables
│
└── объясняют, как появляются имена

Scope
│
└── объясняет, где эти имена видимы
```

Lexical Environment объяснит внутренний механизм Scope в следующей главе. Сейчас мы строим внешнюю, но точную mental model: какие identifiers engine может access прямо сейчас.

---

## Предварительные требования

Для этой главы нужно понимать:

* что Execution Context является рабочей средой выполнения;
* что Call Stack показывает активный Execution Context;
* что memory хранит информацию;
* что variables создают named access к сохраненной информации;
* что declaration регистрирует identifier;
* что `let`, `const` и `var` создают variables.

Не требуется знать Lexical Environment internals, Hoisting, Temporal Dead Zone, Closures, `this` или modules. Эти темы будут изучаться в отдельных главах.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            100-130 минут
Разбор схем:              45-60 минут
Запуск примеров:          25-35 минут
Практика:                 90-120 минут
Повторение материала:     30 минут
```

Уровень сложности: **L3**.

L3 означает фундаментальный уровень: Scope объясняет не синтаксис, а правила видимости identifiers. Без этой модели Hoisting, Closures, modules и архитектура тестового кода будут выглядеть как набор исключений.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/06-variables.md
```

Следующая глава:

```text
docs/01-javascript/08-lexical-environment.md
```

Следующая глава объяснит Lexical Environment: внутреннюю структуру, через которую engine реализует Scope и поиск identifiers.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует Scope;
* что означает visibility of identifiers;
* что такое Global Scope;
* что такое Function Scope;
* что такое Block Scope;
* как работают nested scopes;
* что такое parent и child scopes;
* как работает Scope Chain на концептуальном уровне;
* как engine выполняет variable lookup;
* что такое variable shadowing;
* чем variable lifetime отличается от visibility;
* как Scope связан с Execution Context;
* как Scope связан с Variables;
* как Scope помогает писать читаемые Playwright-тесты;
* почему global mutable state опасен для Automation QA.

---

## Мотивация

Начнем с кода.

```javascript
const baseUrl = 'https://example.com';

function printBaseUrl() {
  console.log(baseUrl);
}

printBaseUrl();
```

Результат:

```text
https://example.com
```

Функция смогла прочитать `baseUrl`, хотя `baseUrl` объявлен снаружи.

Теперь другой код:

```javascript
function prepareUser() {
  const userName = 'Anna';

  console.log(userName);
}

prepareUser();

// console.log(userName);
```

Внутри функции `userName` доступен. Снаружи — нет.

Наблюдаемое поведение:

```text
Some identifiers are visible here.
Some identifiers are not visible here.
```

Вопрос главы:

> Какие identifiers engine может access прямо сейчас?

Пока не нужно определение. Нужно почувствовать проблему:

```text
Program has many names
│
├── baseUrl
├── userName
├── expectedStatus
└── actualStatus

Current line wants one name
│
▼
Engine must decide:
Can this name be accessed from here?
```

Scope существует потому, что программе нужны границы видимости имен.

---

## Теория

### Проблема видимости identifiers

Если бы все identifiers были видимы везде, программа быстро стала бы опасной.

```text
All names visible everywhere
│
├── helper can accidentally change test variable
├── test can accidentally rely on helper-local detail
├── same names collide
└── code becomes hard to reason about
```

Представим тестовый проект:

```javascript
const status = 'global';

function createUser() {
  const status = 'created';

  console.log(status);
}

createUser();
console.log(status);
```

Если не понимать Scope, непонятно, какой `status` будет прочитан в каждой строке.

Что должен решить engine:

```text
Current line asks for status
│
▼
Which status is visible here?
│
▼
Which value should be read?
```

### Что такое Scope

Теперь можно ввести термин.

Scope — область программы, в которой identifier видим и может быть использован.

```text
Scope
│
└── rules of identifier visibility
```

Главная формула главы:

```text
Variables answer:
"How do names appear?"

Scope answers:
"Where are those names visible?"
```

Scope не создает value сам по себе. Scope определяет, где name можно использовать для доступа к value.

```text
Variable
│
└── name exists

Scope
│
└── name is visible here or not visible here
```

Что engine делает прямо сейчас:

```text
Engine sees identifier.
Engine checks current scope.
If not found, engine searches outward.
If no visible identifier is found, access fails.
```

### Global Scope

Global Scope — внешний scope файла или программы.

```javascript
const baseUrl = 'https://example.com';

function printBaseUrl() {
  console.log(baseUrl);
}
```

`baseUrl` объявлен в Global Scope.

Диаграмма:

```text
Global Scope
│
├── baseUrl
└── printBaseUrl
```

Что видно в Global Scope:

```text
Global line
│
▼
can access global identifiers
```

Пример:

```javascript
const testName = 'login';

console.log(testName);
```

Схема:

```text
Global Scope
│
└── testName → "login"

console.log(testName)
│
└── lookup finds testName in Global Scope
```

Global Scope удобен для stable configuration в маленьких примерах, но в больших тестовых проектах global mutable state часто создает проблемы. Это будет разобрано в Automation QA разделе главы.

### Function Scope

Function Scope — область видимости внутри функции.

```javascript
function prepareUser() {
  const userName = 'Anna';

  console.log(userName);
}

prepareUser();
```

`userName` видим внутри `prepareUser`.

Диаграмма:

```text
Global Scope
│
└── prepareUser
    │
    ▼
    Function Scope: prepareUser
    └── userName
```

Снаружи функции `userName` не видим:

```text
Global Scope
│
└── no userName here

Function Scope
│
└── userName exists here
```

Что engine делает прямо сейчас:

```text
Inside prepareUser:
lookup userName starts in Function Scope.
userName is found.
```

Снаружи:

```text
Global line asks for userName.
lookup starts in Global Scope.
userName is not found.
access fails.
```

### Block Scope

Block Scope — область видимости внутри блока `{ ... }` для `let` и `const`.

```javascript
if (true) {
  const expectedStatus = 'active';

  console.log(expectedStatus);
}
```

`expectedStatus` видим внутри блока.

Диаграмма:

```text
Global Scope
│
└── Block Scope
    └── expectedStatus
```

Снаружи блока identifier не видим:

```javascript
if (true) {
  const expectedStatus = 'active';
}

// console.log(expectedStatus);
```

`var` ведет себя иначе по отношению к block scope; подробности будут разобраны в главах про Hoisting и Scope-related behavior. В этой главе основной focus — `let` и `const`, потому что это modern default.

### Nested scopes

Scopes могут быть вложенными.

```javascript
const baseUrl = 'https://example.com';

function buildLoginUrl() {
  const path = '/login';

  if (true) {
    const fullUrl = baseUrl + path;

    console.log(fullUrl);
  }
}

buildLoginUrl();
```

Диаграмма nested scopes:

```text
Global Scope
│
├── baseUrl
└── buildLoginUrl
    │
    ▼
    Function Scope
    │
    └── path
        │
        ▼
        Block Scope
        └── fullUrl
```

Внутренний scope может использовать identifiers из внешних scopes:

```text
Block Scope wants fullUrl
│
└── found in Block Scope

Block Scope wants path
│
└── not in Block Scope
    │
    ▼
    found in Function Scope

Block Scope wants baseUrl
│
└── not in Block Scope
    │
    ▼
    not in Function Scope
    │
    ▼
    found in Global Scope
```

### Parent and child scopes

Вложенный scope можно назвать child scope. Внешний scope — parent scope.

```text
Parent Scope
│
└── Child Scope
    │
    └── Nested Child Scope
```

В примере:

```text
Global Scope
│
└── parent for Function Scope

Function Scope
│
├── child of Global Scope
└── parent for Block Scope

Block Scope
│
└── child of Function Scope
```

Модель rooms inside a building:

```text
Building
│
└── Global room
    │
    └── Function room
        │
        └── Block room
```

Внутренняя комната может выйти взглядом наружу к parent rooms. Внешняя комната не видит private notes, лежащие внутри child room.

### Doors between rooms

Scope можно представить как комнаты с дверями.

```text
Global Room
│
└── door to Function Room
    │
    └── door to Block Room
```

Когда engine находится внутри Block Room, он может искать наружу:

```text
Block Room
│
▼
Function Room
│
▼
Global Room
```

Но поиск не идет внутрь sibling или child rooms, в которых текущий код не находится.

```text
Current room: Global
│
├── cannot inspect Function local names
└── cannot inspect Block local names
```

Это ключевой принцип:

```text
Identifier lookup searches outward only.
```

### Local workspace

Function Scope похож на local workspace функции.

```javascript
function createUser() {
  const userName = 'Anna';
  const userRole = 'admin';

  console.log(userName);
  console.log(userRole);
}
```

Диаграмма:

```text
Function local workspace: createUser
│
├── userName
└── userRole
```

Эти identifiers помогают функции выполнить работу, но не становятся автоматически видимыми для всей программы.

```text
Local workspace
│
├── useful inside function
└── hidden from outside code
```

Для Automation QA это особенно важно: helper-local variables должны оставаться деталями helper.

### Scope Chain на концептуальном уровне

Scope Chain — цепочка scopes, по которой engine ищет identifier.

```text
Current Scope
│
▼
Parent Scope
│
▼
Parent of Parent
│
▼
Global Scope
```

Это концептуальная модель. Lexical Environment internals объяснят, как engine представляет эту связь внутри, в следующей главе.

Пример:

```javascript
const baseUrl = 'https://example.com';

function printLoginUrl() {
  const path = '/login';

  console.log(baseUrl + path);
}

printLoginUrl();
```

Lookup для `path`:

```text
Current Scope: printLoginUrl
│
└── path found
```

Lookup для `baseUrl`:

```text
Current Scope: printLoginUrl
│
└── baseUrl not found
    │
    ▼
Global Scope
│
└── baseUrl found
```

### Identifier lookup

Identifier lookup — процесс поиска visible identifier.

Алгоритм:

```text
1. Start in current scope.
2. If identifier exists here, use it.
3. If not, move to parent scope.
4. Repeat until Global Scope.
5. If not found, access fails.
```

Полный lookup process:

```text
Identifier requested: userName
│
▼
Current Scope
│
├── found? yes → use current identifier
│
└── found? no
    │
    ▼
    Parent Scope
    │
    ├── found? yes → use parent identifier
    │
    └── found? no
        │
        ▼
        Global Scope
        │
        ├── found? yes → use global identifier
        └── found? no → ReferenceError
```

ReferenceError — runtime error, который возникает, когда код обращается к identifier, который не найден в доступной цепочке. Error Handling будет изучаться позже.

### Variable shadowing

Shadowing происходит, когда inner scope объявляет identifier с тем же именем, что и outer scope.

```javascript
const status = 'global';

function printStatus() {
  const status = 'local';

  console.log(status);
}

printStatus();
console.log(status);
```

Результат:

```text
local
global
```

Диаграмма shadowing:

```text
Global Scope
│
└── status → "global"
    │
    ▼
    Function Scope
    └── status → "local"
```

Когда engine находится внутри function scope:

```text
lookup status
│
▼
Function Scope
│
└── found local status
```

Поиск останавливается на ближайшем найденном identifier. Внешний `status` не исчезает, но он shadowed внутри функции.

Что engine может access прямо сейчас:

```text
Inside printStatus:
status means local status.

Outside printStatus:
status means global status.
```

### Visibility vs lifetime

Visibility и lifetime не одно и то же.

Visibility отвечает:

```text
Can this identifier be accessed from here?
```

Lifetime отвечает:

```text
How long is this information needed or active?
```

Диаграмма:

```text
Variable lifetime
│
└── when information exists / remains relevant

Variable visibility
│
└── where identifier can be used
```

Пример:

```javascript
function prepareUser() {
  const userName = 'Anna';

  console.log(userName);
}

prepareUser();
```

`userName` visible внутри function scope. Снаружи оно не visible.

```text
Inside prepareUser
│
└── userName visible

Outside prepareUser
│
└── userName not visible
```

Точные детали lifetime и memory cleanup будут связаны с будущими темами про Lexical Environment, Closures и Garbage Collector. Сейчас важна граница: visibility — это вопрос "где можно обратиться к имени".

### Execution Context + Scope

Execution Context — рабочая среда выполнения. Scope определяет, какие identifiers видимы для кода в этой среде.

```text
Execution Context
│
├── current code is running
├── current scope is known
└── identifier lookup follows scope chain
```

Когда вызывается функция:

```text
Function Execution Context
│
├── function body runs
├── function scope is current
└── outer scopes can be searched conceptually
```

Диаграмма:

```text
Call Stack
├── Function Execution Context
│   └── Current Scope: function
└── Global Execution Context
    └── Global Scope
```

Lexical Environment объяснит внутреннюю структуру этой связи позже. Сейчас достаточно понимать: execution happens somewhere, and that "somewhere" has visible identifiers.

### Variables + Scope

Variables создают identifiers. Scope определяет, где identifiers видимы.

```text
Variable declaration
│
▼
identifier appears
│
▼
Scope determines visibility
```

Пример:

```javascript
function testLogin() {
  const userName = 'qa-user';

  console.log(userName);
}
```

```text
Variable
│
└── userName is declared

Scope
│
└── userName visible inside testLogin
```

Снаружи:

```text
Global Scope
│
└── userName not visible
```

### Переход к Lexical Environment

Мы уже можем объяснить поведение:

```text
Engine searches current scope.
Then parent scope.
Then parent of parent.
```

Но пока это concept.

Следующая глава ответит на вопрос:

> Как engine internally stores scope information?

Lexical Environment — внутренняя структура, которая помогает engine хранить identifiers текущей области и ссылку на outer environment. Это будет следующая глава.

```text
Scope
│
└── rules of visibility

Lexical Environment
│
└── internal mechanism behind those rules
```

---

## Внутренний механизм

Внутренний механизм Scope в этой главе остается концептуальным.

Когда engine встречает identifier:

```text
Identifier appears in code
│
▼
Engine asks:
"What identifiers can I access right now?"
│
▼
Check current scope
│
▼
If not found, search parent scope
│
▼
Continue outward
│
▼
Use first matching identifier
```

Для nested scopes:

```text
Block Scope
│
├── local identifiers
└── parent → Function Scope
              │
              ├── local identifiers
              └── parent → Global Scope
```

Для shadowing:

```text
lookup status
│
▼
Current Scope has status
│
▼
use current status
│
▼
do not continue to outer status
```

Что engine делает прямо сейчас:

```text
Engine does not search everywhere.
Engine searches current scope first.
Engine moves outward only when needed.
Engine stops at the first visible matching identifier.
```

---

## Ментальная модель

### Rooms inside a building

Scope — это комнаты внутри здания.

```text
Building
│
└── Global Room
    │
    └── Function Room
        │
        └── Block Room
```

Identifiers — записи, лежащие в комнатах.

```text
Global Room
│
└── baseUrl

Function Room
│
└── userName

Block Room
│
└── expectedStatus
```

### Doors between rooms

Из внутренней комнаты можно смотреть наружу.

```text
Block Room
│
▼
Function Room
│
▼
Global Room
```

Из внешней комнаты нельзя автоматически смотреть внутрь child room.

```text
Global Room
│
└── cannot inspect Function Room local names
```

### Local workspace

Функция имеет local workspace.

```text
Helper local workspace
│
├── requestBody
├── responseStatus
└── normalizedUser
```

Эти names помогают helper, но не должны загрязнять весь тест.

### Nested rooms

Nested scopes — вложенные комнаты.

```text
test scope
│
└── helper scope
    │
    └── block scope
```

Чем глубже текущий код, тем больше outer scopes он может conceptually search.

### Parent room

Parent scope — внешняя область.

```text
Child Scope
│
└── can search Parent Scope
```

### Searching outward only

Главное правило:

```text
Search starts here.
Search goes outward.
Search never jumps into unrelated rooms.
```

Итоговая модель:

```text
Variables answer:
"How do names appear?"

Scope answers:
"Where are those names visible?"

Scope Chain answers conceptually:
"In what outward order does lookup happen?"
```

---

## Примеры кода

Примеры к этой главе находятся в папке:

```text
examples/01-javascript/chapter-07/
```

Запускайте их из корня проекта.

### Пример 1. Global Scope

Файл:

```text
examples/01-javascript/chapter-07/01-global-scope.js
```

Показывает identifier, объявленный в Global Scope.

### Пример 2. Function Scope

Файл:

```text
examples/01-javascript/chapter-07/02-function-scope.js
```

Показывает function-local identifier.

### Пример 3. Block Scope

Файл:

```text
examples/01-javascript/chapter-07/03-block-scope.js
```

Показывает block-local identifier для `const`.

### Пример 4. Shadowing

Файл:

```text
examples/01-javascript/chapter-07/04-shadowing.js
```

Показывает, как inner identifier shadow-ит outer identifier.

### Пример 5. Scope Chain

Файл:

```text
examples/01-javascript/chapter-07/05-scope-chain.js
```

Показывает lookup из block scope во function scope и global scope.

### Пример 6. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-07/06-common-mistakes.js
```

Показывает типичные ошибки через безопасные закомментированные строки и корректные варианты.

---

## Частые вопросы

### Scope и Execution Context — это одно и то же?

Нет. Execution Context — среда выполнения. Scope — правила видимости identifiers для кода. Они связаны, но отвечают на разные вопросы.

### Scope Chain — это Call Stack?

Нет. Call Stack управляет активными Execution Contexts. Scope Chain описывает conceptual path поиска identifiers outward through scopes.

### Почему функция видит global variable?

Потому что lookup может идти из function scope во внешний global scope, если identifier не найден локально.

### Почему global code не видит function-local variable?

Потому что lookup идет outward only. Global Scope не ищет identifiers внутри child function scopes.

### Почему мы не изучаем Lexical Environment здесь?

Сначала нужно понять поведение Scope. Lexical Environment объяснит внутреннюю структуру этого поведения в следующей главе.

---

## Распространенные мифы

### Миф 1. Если функция была вызвана, ее variables становятся global

Реальность:

Function-local identifiers остаются видимыми только внутри function scope.

### Миф 2. Engine ищет identifier по всему файлу

Реальность:

Engine ищет в current scope и затем outward по Scope Chain.

### Миф 3. Shadowing удаляет внешнюю variable

Реальность:

Outer identifier не исчезает. Он просто hidden внутри inner scope с таким же именем.

### Миф 4. Lifetime и visibility — одно и то же

Реальность:

Visibility отвечает "где имя доступно". Lifetime отвечает "как долго информация существует или нужна".

---

## Типичные ошибки

### Ошибка 1. Читать function-local variable снаружи

Неправильный код:

```javascript
function prepareUser() {
  const userName = 'Anna';
}

prepareUser();

// console.log(userName);
```

Что произошло:

`userName` visible only inside `prepareUser`.

Почему:

Global Scope не ищет identifiers внутри Function Scope.

Исправленный вариант:

```javascript
function prepareUser() {
  const userName = 'Anna';

  console.log(userName);
}

prepareUser();
```

### Ошибка 2. Ожидать block variable снаружи блока

Неправильный код:

```javascript
if (true) {
  const expectedStatus = 'active';
}

// console.log(expectedStatus);
```

Что произошло:

`expectedStatus` visible only inside block.

Исправленный вариант:

```javascript
const expectedStatus = 'active';

if (true) {
  console.log(expectedStatus);
}
```

### Ошибка 3. Не замечать shadowing

Код:

```javascript
const status = 'global';

function printStatus() {
  const status = 'local';

  console.log(status);
}
```

Что произошло:

Inside function `status` refers to local identifier.

Исправленная модель:

```text
Current Scope has status
│
▼
use local status
│
▼
do not read global status
```

### Ошибка 4. Использовать global mutable state в тестах

Неправильная модель:

```text
One global variable can safely store current test data for all tests.
```

Что произошло:

Global mutable state может связывать тесты между собой и усложнять debugging.

Исправленная модель:

```text
Keep test data local to test / fixture / helper when possible.
```

---

## Практическое использование

При чтении кода задавайте вопрос:

```text
What identifiers can the engine access right now?
```

Алгоритм:

```text
1. Найти текущую строку.
2. Определить current scope.
3. Выписать identifiers current scope.
4. Если identifier не найден, идти в parent scope.
5. Повторять outward.
6. Остановиться на первом найденном identifier.
```

Таблица анализа:

```text
Identifier | Current Scope | Found where?     | Value used
-----------|---------------|------------------|------------
fullUrl    | block         | block            | local
path       | block         | function         | parent
baseUrl    | block         | global           | outer
```

Чек-лист:

```text
✓ Я понимаю current scope.
✓ Я вижу parent scope.
✓ Я могу пройти lookup outward.
✓ Я замечаю shadowing.
✓ Я не путаю visibility и lifetime.
```

---

## Использование в Automation QA

### Helper-local variables

Helper должен скрывать внутренние детали.

```javascript
function buildUserName() {
  const prefix = 'qa';
  const userName = prefix + '-user';

  return userName;
}
```

`prefix` и `userName` — helper-local variables. Test code не должен зависеть от них напрямую.

```text
Test Scope
│
└── calls helper
    │
    ▼
    Helper Scope
    ├── prefix
    └── userName
```

### Fixture-local variables

Fixture может иметь local setup values:

```text
Fixture Scope
│
├── authToken
├── userId
└── setupStatus
```

Если эти values не нужны тесту напрямую, они должны оставаться внутри fixture logic.

### Test-local variables

Test-local variables делают сценарий изолированным.

```javascript
function testLogin() {
  const userName = 'qa-user';
  const expectedStatus = 'active';

  console.log(userName);
  console.log(expectedStatus);
}
```

```text
testLogin Scope
│
├── userName
└── expectedStatus
```

Такой код проще читать и безопаснее менять.

### Avoiding global mutable state

Опасная модель:

```javascript
let currentUserName = 'unknown';

function testA() {
  currentUserName = 'user-a';
}

function testB() {
  console.log(currentUserName);
}
```

Проблема:

```text
Global mutable state
│
├── can be changed by many places
├── makes tests dependent on order
└── complicates debugging
```

Лучше держать данные ближе к месту использования:

```text
test-local data
fixture-local data
helper-local temporary data
```

### Readability of Playwright tests

Scope помогает делать тесты читаемыми:

```text
Global configuration
│
└── stable values

Fixture scope
│
└── setup details

Test scope
│
└── scenario data

Helper scope
│
└── implementation details
```

Читатель понимает, где искать identifier и почему он не должен быть доступен везде.

### Preventing accidental variable collisions

Shadowing иногда полезен, но часто в тестах делает код мутным.

```javascript
const status = 'global';

function assertStatus() {
  const status = 'active';

  console.log(status);
}
```

Лучше использовать точные names:

```javascript
const defaultStatus = 'global';

function assertStatus() {
  const expectedStatus = 'active';

  console.log(expectedStatus);
}
```

Good scope design снижает accidental collisions и делает ошибки очевиднее.

---

## Итоги

Scope объясняет, где identifiers видимы.

Главная модель:

```text
Variables answer:
"How do names appear?"

Scope answers:
"Where are those names visible?"
```

Global Scope видим из многих мест через outward lookup, но global mutable state нужно использовать осторожно. Function Scope скрывает local variables функции. Block Scope ограничивает visibility identifiers внутри `{ ... }` для `let` и `const`.

Scope Chain — концептуальный путь поиска identifier:

```text
Current Scope
│
▼
Parent Scope
│
▼
Global Scope
```

Engine ищет outward only и останавливается на первом найденном matching identifier. Поэтому shadowing не удаляет outer variable, а скрывает ее внутри inner scope.

Следующая глава объяснит Lexical Environment: внутренний механизм, который делает правила Scope возможными.

---

## Что нужно запомнить

✓ Scope отвечает на вопрос, где identifier видим.

✓ Global Scope — внешний scope программы.

✓ Function Scope — область видимости внутри функции.

✓ Block Scope — область видимости внутри `{ ... }` для `let` и `const`.

✓ Inner scope может искать identifiers outward.

✓ Outer scope не ищет identifiers inside child scopes.

✓ Scope Chain — conceptual chain поиска identifiers.

✓ Lookup начинается в current scope.

✓ Shadowing скрывает outer identifier внутри inner scope.

✓ Visibility и lifetime — разные вопросы.

✓ Следующая тема — Lexical Environment, внутренний механизм Scope.

---

## Проверьте себя

1. Зачем существует Scope?

2. Что означает visibility of identifiers?

3. Чем Global Scope отличается от Function Scope?

4. Что такое Block Scope?

5. Почему inner scope может читать outer identifier?

6. Почему outer scope не читает function-local identifier?

7. Что такое Scope Chain на концептуальном уровне?

8. Как engine выполняет identifier lookup?

9. Что такое shadowing?

10. Чем visibility отличается от lifetime?

---

## Практика

Практика к этой главе находится в файле:

```text
practice/01-javascript/07-scope.md
```

Перед практикой запустите примеры из `examples/01-javascript/chapter-07/` и для каждого identifier ответьте:

```text
Where is it declared?
Where is it visible?
Where is it read?
```

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/07-scope.md
```

Открывайте решения после самостоятельной попытки. В этой главе важно сравнивать не только вывод, но и путь lookup для каждого identifier.
