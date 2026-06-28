# Variables

## Связь с предыдущей главой

В предыдущей главе была построена модель memory:

```text
Memory
│
├── stores values
├── lets the engine read values later
├── lets the engine update stored information
└── keeps information while the program runs
```

Теперь появляется следующий вопрос:

> Как программист создает named access к этой сохраненной информации?

Мы не можем напрямую сказать engine: "положи это значение в концептуальную location #42 и потом достань его оттуда". Такой стиль был бы неудобным и небезопасным для чтения программы.

Вместо этого JavaScript дает variables.

Variables — это не коробки. В этой главе variable будет рассматриваться как named access к информации, которой управляет JavaScript Engine.

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
└── дают именованный доступ к сохраненной информации
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что JavaScript выполняется engine;
* что Execution Context является рабочей средой выполнения;
* что Call Stack показывает активный Execution Context;
* что memory хранит значения и связанную с ними информацию;
* что identifier — имя, через которое программа обращается к сохраненной информации.

Не требуется знать Hoisting, Temporal Dead Zone, Scope, Closures или Lexical Environment. Если эти темы появляются в тексте, они объясняются одной фразой и будут подробно разобраны в отдельных главах.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            100-130 минут
Разбор схем:              40-50 минут
Запуск примеров:          25-35 минут
Практика:                 90-120 минут
Повторение материала:     30 минут
```

Уровень сложности: **L3**.

L3 означает фундаментальный уровень: глава объясняет не только синтаксис `var`, `let` и `const`, а саму причину существования variables и внутреннюю модель работы с named access.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/05-memory.md
```

Следующая глава:

```text
docs/01-javascript/07-scope.md
```

Следующая глава объяснит Scope: почему один identifier доступен в одном месте программы и недоступен в другом. Scope — это правила доступности имен; подробно он будет изучаться позже.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* что такое variable;
* почему variables существуют;
* почему variable не стоит представлять как коробку;
* что такое identifier;
* что такое declaration;
* что такое initialization;
* что такое assignment;
* что такое reassignment;
* чем declaration отличается от assignment;
* что означает declaration without initialization;
* как variable связана с memory;
* как variable связана с Execution Context;
* как variable связана с Call Stack;
* зачем в JavaScript есть `var`, `let` и `const`;
* почему `const` не означает "неизменяемое значение" в общем смысле;
* как выбирать `let` и `const` в тестовом коде;
* какие ошибки чаще всего встречаются при работе с variables.

---

## Мотивация

Начнем с наблюдаемого поведения.

```javascript
let userName = 'Anna';

console.log(userName);
```

Мы пишем не так:

```text
engine.store(value: "Anna", location: #1042)
engine.read(location: #1042)
```

Мы пишем проще:

```text
userName
```

Вопрос:

```text
Value exists
│
▼
Memory can store it
│
▼
Programmer needs readable access
│
▼
Identifier gives a name
│
▼
Variable connects code with stored information
```

Переменная нужна не потому, что программисту хочется "коробку". Переменная нужна потому, что программе нужен понятный способ:

* зарегистрировать имя;
* связать имя со значением;
* прочитать значение позже;
* иногда изменить связь с текущей информацией;
* сделать код читаемым для человека.

Рассмотрим сквозной пример, который будет проходить через главу:

```javascript
const baseUrl = 'https://example.com';
let testStatus = 'created';

testStatus = 'ready';

console.log(baseUrl);
console.log(testStatus);
```

На поверхности это простой код. Внутри engine происходит несколько разных действий:

```text
register identifier: baseUrl
initialize baseUrl with value

register identifier: testStatus
initialize testStatus with value

assign new value to testStatus

read baseUrl
read testStatus
```

Главный вопрос главы:

> Что engine делает прямо сейчас?

---

## Теория

### Проблема прямой работы с memory

Представим, что variables не существуют.

```text
Programmer
│
├── must remember where value is stored
├── must refer to internal locations
├── must track updates manually
└── must read code without meaningful names
```

Код стал бы нечитаемым:

```text
location #101 → "https://example.com"
location #102 → "created"
location #102 → "ready"
read location #101
read location #102
```

Проблема:

```text
Memory can store information
│
▼
but code needs names
```

Variables решают эту проблему.

### Что такое variable

Variable — это named access к сохраненной информации, управляемой JavaScript Engine.

Важно:

```text
Variable is not a box.
Variable is not the value itself.
Variable is a named way to access stored information.
```

Концептуально:

```text
Identifier
│
▼
userName
│
▼
access to stored information
│
▼
"Anna"
```

Когда вы пишете:

```javascript
const userName = 'Anna';
```

engine не создает физическую коробку с наклейкой `userName` в том учебном смысле, который часто показывают новичкам. Более точная модель:

```text
Register identifier: userName
│
▼
Store value: "Anna"
│
▼
Allow code to read value through userName
```

Что происходит внутри engine прямо сейчас:

```text
Engine регистрирует имя.
Engine связывает имя с информацией.
Engine позволит читать эту информацию по имени.
```

### Identifier

Identifier — имя, которое используется в коде.

```javascript
const browserName = 'chromium';
```

Здесь:

```text
Identifier: browserName
Value:      "chromium"
```

Identifier должен быть понятным человеку, потому что он описывает смысл сохраненной информации.

Плохо:

```javascript
const x = 'chromium';
```

Лучше:

```javascript
const browserName = 'chromium';
```

В Automation QA identifier часто отражает роль данных:

```javascript
const baseUrl = 'https://example.com';
const expectedStatus = 'active';
const actualStatus = 'active';
```

Схема:

```text
Notebook of names
│
├── baseUrl        → "https://example.com"
├── expectedStatus → "active"
└── actualStatus   → "active"
```

### Declaration

Declaration — регистрация identifier в текущей среде выполнения.

```javascript
let testStatus;
```

Эта строка не дает meaningful value для теста. Она говорит engine:

```text
Register identifier
│
▼
testStatus exists as a name
│
▼
value can be assigned later
```

Диаграмма declaration:

```text
Before declaration
Registry
└── no testStatus

Declaration
let testStatus;

After declaration
Registry
└── testStatus registered
```

Declaration as registration:

```text
declaration
│
▼
identifier registry
│
▼
name becomes known to engine
```

Hoisting — это особенности того, как declarations учитываются во время подготовки к выполнению; отдельная глава будет позже. Сейчас достаточно понимать declaration как регистрацию имени.

### Declaration without initialization

Declaration without initialization — объявление имени без начального meaningful value.

```javascript
let testStatus;

console.log(testStatus);
```

Результат:

```text
undefined
```

`undefined` — специальное значение JavaScript, которое часто означает отсутствие присвоенного meaningful value. Primitive Types будут изучаться позже; сейчас важно только поведение.

Концептуально:

```text
let testStatus;
│
▼
Identifier registered
│
▼
No meaningful value assigned by programmer
│
▼
Reading gives undefined
```

Диаграмма:

```text
Identifier registry
└── testStatus → no meaningful assigned value

Read testStatus
└── undefined
```

Что происходит внутри engine прямо сейчас:

```text
Engine знает имя testStatus.
Engine не получил пользовательское значение для этого имени.
Read возвращает undefined.
```

### Initialization

Initialization — первое связывание variable с начальным value в момент объявления.

```javascript
let testStatus = 'created';
```

Здесь одновременно происходят две вещи:

```text
Declaration
│
└── register identifier: testStatus

Initialization
│
└── initial value: "created"
```

Диаграмма initialization:

```text
let testStatus = "created"
│
├── declare testStatus
└── initialize with "created"
```

Memory view:

```text
Variables + Memory
│
└── testStatus → "created"
```

Что происходит внутри engine прямо сейчас:

```text
Engine регистрирует identifier.
Engine получает initial value.
Engine делает значение доступным через identifier.
```

### Assignment

Assignment — запись value в уже существующий named access.

```javascript
let testStatus;

testStatus = 'created';
```

Первая строка — declaration. Вторая строка — assignment.

Диаграмма assignment:

```text
Step 1
let testStatus;
│
▼
testStatus registered

Step 2
testStatus = "created";
│
▼
stored information becomes "created"
```

Declaration vs assignment:

```text
Declaration
│
└── create/register name

Assignment
│
└── write value for that name
```

Что происходит внутри engine прямо сейчас:

```text
Engine видит existing identifier.
Engine записывает value, которое будет читаться через этот identifier.
```

### Reassignment

Reassignment — новое assignment для variable, которая уже имела value.

```javascript
let testStatus = 'created';

testStatus = 'ready';
```

Концептуально:

```text
Initial state
└── testStatus → "created"

Reassignment
└── testStatus = "ready"

Current state
└── testStatus → "ready"
```

Диаграмма reassignment:

```text
testStatus
│
├── was: "created"
│
▼
assigned: "ready"
│
▼
now: "ready"
```

Важно: один identifier не означает, что через него одновременно читаются все прошлые значения.

```text
Read after reassignment
│
▼
current stored information
│
▼
"ready"
```

### Declaration vs assignment

Эти операции часто смешивают.

```javascript
let testStatus;          // declaration
testStatus = 'created';  // assignment
testStatus = 'ready';    // reassignment
```

Схема:

```text
Line 1
│
└── declare identifier

Line 2
│
└── assign first meaningful value

Line 3
│
└── assign new value
```

Сравнение:

```text
Operation       | What happens
----------------|-------------------------------
Declaration     | name is registered
Initialization  | initial value is provided
Assignment      | value is written
Reassignment    | existing value is replaced
```

### Variable lifecycle

На высоком уровне lifecycle variable можно представить так:

```text
Declaration
│
▼
Initialization
│
▼
Read
│
▼
Assignment / Reassignment
│
▼
Read updated value
│
▼
Variable no longer needed
```

Не каждая variable проходит все этапы.

```javascript
const baseUrl = 'https://example.com';
```

Здесь есть declaration и initialization, но нет reassignment.

```javascript
let testStatus;

testStatus = 'created';
testStatus = 'ready';
```

Здесь declaration отделена от assignment, а затем есть reassignment.

Variable lifetime — период, когда named access существует и может использоваться в своей области доступности. Scope объяснит правила этой доступности в следующей главе.

### `const`

`const` создает variable, которую нельзя reassignment-ить.

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
```

Модель:

```text
const baseUrl = "https://example.com"
│
├── declare baseUrl
├── initialize with value
└── disallow reassignment of baseUrl
```

Нельзя:

```javascript
const baseUrl = 'https://example.com';

// baseUrl = 'https://staging.example.com';
```

Строка reassignment закомментирована, потому что такой код приведет к runtime error.

Важно: `const` запрещает reassignment identifier. Он не означает, что любое сложное value становится полностью неизменяемым. Object Type и mutability будут изучаться позже.

Что происходит внутри engine прямо сейчас:

```text
Engine регистрирует identifier.
Engine требует initial value.
Engine запрещает later reassignment для этого identifier.
```

### `let`

`let` создает variable, которую можно reassignment-ить.

```javascript
let testStatus = 'created';

testStatus = 'ready';

console.log(testStatus);
```

Модель:

```text
let testStatus = "created"
│
├── declare testStatus
├── initialize with "created"
└── allow reassignment

testStatus = "ready"
│
└── update current stored information
```

`let` подходит, когда значение действительно меняется по ходу выполнения.

Пример из Automation QA:

```javascript
let retryCount = 0;

retryCount = 1;
```

Если значение не должно меняться, обычно лучше `const`.

### `var`

`var` — старый способ объявления variables.

```javascript
var legacyStatus = 'created';
```

На базовом уровне:

```text
var
│
├── declares identifier
├── can be initialized
└── allows reassignment
```

Но `var` имеет исторические особенности поведения, связанные с Hoisting и Scope. Hoisting — поведение declarations во время подготовки execution; Scope — правила доступности identifiers. Эти темы будут изучаться позже.

В современном коде курса и Automation QA проектах мы будем предпочитать:

```text
const by default
let when reassignment is needed
var mainly for reading legacy code
```

### Почему в JavaScript есть `var`, `let` и `const`

Исторически сначала был `var`. Он появился в раннем JavaScript и долго был единственным способом объявлять variables.

Позже появились `let` и `const`, потому что практике разработки понадобились более явные правила:

* `let` — когда named access должен позволять reassignment;
* `const` — когда named access не должен переназначаться;
* `var` — старый механизм, который остается в языке для совместимости.

Временная шкала:

```text
Early JavaScript
│
└── var

Modern JavaScript
│
├── let
└── const

Current practice
│
├── const by default
├── let when needed
└── var for legacy code
```

Comparison:

```text
Keyword | Requires initialization | Allows reassignment | Modern default
--------|-------------------------|---------------------|---------------
var     | no                      | yes                 | no
let     | no                      | yes                 | when needed
const   | yes                     | no                  | yes
```

`const` requires initialization:

```javascript
// const baseUrl;
```

Эта строка закомментирована, потому что `const` без initial value является syntax error. Syntax error возникает до выполнения кода; этот механизм был разобран в главе про выполнение JavaScript.

### Variables + Memory

Variables дают readable access к memory.

```text
Memory
│
├── stored value: "https://example.com"
└── stored value: "ready"

Variables
│
├── baseUrl    → "https://example.com"
└── testStatus → "ready"
```

Более точно:

```text
Identifier registry
│
├── baseUrl
└── testStatus
        │
        ▼
Stored information
│
├── "https://example.com"
└── "ready"
```

Variables не заменяют memory. Они являются способом работать с information, которая хранится и управляется engine.

### Variables + Execution Context

Execution Context — среда, в которой engine выполняет код. Variables регистрируются для выполнения в этой среде.

```text
Execution Context
│
├── current code
├── registered identifiers
└── access to stored information
```

Для global-кода:

```text
Global Execution Context
│
├── baseUrl
├── testStatus
└── console.log reads values
```

Для function execution:

```text
Function Execution Context
│
├── identifiers for this function execution
└── values used by this function execution
```

Подробная структура Lexical Environment будет изучаться позже. Сейчас важно только: variables не существуют "в воздухе"; они существуют внутри модели execution.

### Variables + Call Stack

Call Stack показывает, какой Execution Context активен прямо сейчас. Active context определяет, с какими registered identifiers engine работает в данный момент.

```text
Call Stack
├── Function Context: buildLoginUrl
│   └── variables used now
└── Global Context
    └── variables waiting below
```

Когда вызывается функция:

```text
call function
│
▼
push Function Execution Context
│
▼
register variables for that execution
│
▼
read / assign values
│
▼
pop Function Execution Context
```

Это не объяснение Scope. Это связь уже изученных механизмов:

```text
Call Stack
│
└── active context
    │
    ▼
    variables available for current execution model
```

### Переход к Scope

После variables возникает новый вопрос:

```javascript
const baseUrl = 'https://example.com';

function printBaseUrl() {
  console.log(baseUrl);
}
```

Почему function может прочитать `baseUrl`?

И другой вопрос:

```javascript
function prepareUser() {
  const userName = 'Anna';
}

// console.log(userName);
```

Почему `userName` нельзя читать снаружи функции?

Ответ даст Scope.

Scope — правила, которые определяют, где identifier доступен. Это следующая глава. В текущей главе мы изучаем, как identifier создается и связывается с information; в следующей — где этот identifier можно использовать.

```text
Variables
│
└── how names are created and assigned values

Scope
│
└── where those names can be used
```

---

## Внутренний механизм

Для каждой variable engine выполняет набор операций.

```text
Source code
│
▼
declaration keyword
│
▼
identifier
│
▼
optional initial value
│
▼
registered named access
```

Если есть initialization:

```text
const baseUrl = "https://example.com"
│
├── register baseUrl
└── store initial value
```

Если declaration отделена от assignment:

```text
let testStatus;
│
└── register testStatus

testStatus = "created";
│
└── assign value
```

Если есть reassignment:

```text
testStatus = "ready";
│
└── update current stored information for testStatus
```

Сквозной пример:

```javascript
const baseUrl = 'https://example.com';
let testStatus = 'created';

testStatus = 'ready';

console.log(baseUrl);
console.log(testStatus);
```

Engine diary:

```text
"I see const baseUrl."
│
▼
"I register baseUrl."
│
▼
"I initialize it with https://example.com."
│
▼
"I see let testStatus."
│
▼
"I register testStatus."
│
▼
"I initialize it with created."
│
▼
"I see assignment to testStatus."
│
▼
"I update its current value to ready."
│
▼
"I read baseUrl."
│
▼
"I read testStatus."
```

Что происходит внутри engine прямо сейчас:

```text
Declaration → register identifier.
Initialization → provide first value.
Assignment → write value.
Reassignment → replace current value for that identifier.
Read → retrieve current value.
```

---

## Ментальная модель

### Labels on storage shelves

Не используйте модель "variable is a box". Более точная учебная модель — label on storage shelf.

```text
Shelf label
│
▼
baseUrl
│
▼
Stored information
│
▼
"https://example.com"
```

Label помогает найти информацию. Label не является самой информацией.

### Notebook of names

Можно представить variables как записи в блокноте имен.

```text
Notebook
│
├── baseUrl: "https://example.com"
├── testStatus: "ready"
└── retryCount: 1
```

Когда происходит reassignment, запись обновляется:

```text
Before
testStatus: "created"

After
testStatus: "ready"
```

### Registry of identifiers

Declaration — это регистрация имени.

```text
Identifier registry
│
├── baseUrl
├── testStatus
└── retryCount
```

После registration engine знает, что такое имя существует в текущей модели выполнения.

### Declaration as registration

```text
let retryCount;
│
▼
register identifier
│
▼
retryCount is known
```

### Assignment as changing stored information

```text
retryCount = 1
│
▼
retryCount → 1

retryCount = 2
│
▼
retryCount → 2
```

Итоговая модель:

```text
Variable
│
└── named access to stored information

Declaration
│
└── register name

Initialization
│
└── first value

Assignment
│
└── write value

Reassignment
│
└── write new value to existing named access
```

---

## Примеры кода

Примеры к этой главе находятся в папке:

```text
examples/01-javascript/chapter-06/
```

Запускайте их из корня проекта.

### Пример 1. Declaration

Файл:

```text
examples/01-javascript/chapter-06/01-declaration.js
```

Показывает declaration without initialization.

### Пример 2. Initialization

Файл:

```text
examples/01-javascript/chapter-06/02-initialization.js
```

Показывает declaration вместе с initial value.

### Пример 3. Assignment

Файл:

```text
examples/01-javascript/chapter-06/03-assignment.js
```

Показывает declaration отдельно от assignment.

### Пример 4. Reassignment

Файл:

```text
examples/01-javascript/chapter-06/04-reassignment.js
```

Показывает изменение current value через `let`.

### Пример 5. `var`, `let`, `const`

Файл:

```text
examples/01-javascript/chapter-06/05-var-let-const.js
```

Показывает базовое поведение трех declaration keywords без углубления в Hoisting и Scope.

### Пример 6. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-06/06-common-mistakes.js
```

Показывает типичные ошибки через безопасные закомментированные строки и корректный вариант.

---

## Частые вопросы

### Variable — это коробка?

Нет. Модель коробки слишком рано создает неправильное ощущение, будто variable физически содержит value. В этой книге variable рассматривается как named access к информации, которой управляет engine.

### Чем declaration отличается от initialization?

Declaration регистрирует identifier. Initialization дает initial value в момент объявления.

### Чем assignment отличается от initialization?

Initialization — первое значение при объявлении. Assignment — запись value в уже существующий named access.

### Почему `const` должен сразу получить value?

Потому что `const` запрещает reassignment. Если не дать initial value, потом нельзя будет корректно записать значение через reassignment.

### Почему вообще использовать `let`, если есть `const`?

`let` нужен, когда value действительно меняется по ходу выполнения: счетчик попыток, текущий статус, промежуточный результат, который будет обновлен.

### Нужно ли использовать `var`?

В новом коде обычно нет. Но `var` нужно понимать, потому что он встречается в legacy-коде и имеет особенности, которые будут изучаться позже.

---

## Распространенные мифы

### Миф 1. Variable хранит value внутри себя как коробка

Реальность:

Variable лучше понимать как named access к stored information.

### Миф 2. `const` делает любое значение неизменяемым

Реальность:

`const` запрещает reassignment identifier. Сложные значения и mutability будут изучаться позже в главах про objects и references.

### Миф 3. Declaration и assignment — одно и то же

Реальность:

Declaration регистрирует имя. Assignment записывает value.

### Миф 4. `var`, `let` и `const` отличаются только стилем

Реальность:

У них разные правила. В этой главе важны initialization и reassignment; Hoisting и Scope отличия будут изучаться позже.

---

## Типичные ошибки

### Ошибка 1. Использовать `let` там, где значение не меняется

Неправильный код:

```javascript
let baseUrl = 'https://example.com';

console.log(baseUrl);
```

Что произошло:

`baseUrl` не reassignment-ится, но `let` говорит читателю, что изменение возможно.

Почему это проблема:

Код становится менее очевидным.

Исправленный вариант:

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
```

### Ошибка 2. Ожидать старое значение после reassignment

Неправильная модель:

```javascript
let testStatus = 'created';

testStatus = 'ready';

console.log(testStatus);
```

Ожидание:

```text
created
```

Реальность:

```text
ready
```

Почему:

Read получает current value после reassignment.

### Ошибка 3. Объявлять `const` без initial value

Неправильный код:

```javascript
// const userName;
```

Что произошло:

Такой код является syntax error, потому что `const` должен быть initialized сразу.

Исправленный вариант:

```javascript
const userName = 'Anna';
```

Если value появится позже, нужен другой дизайн или `let`:

```javascript
let userName;

userName = 'Anna';
```

### Ошибка 4. Переобъявлять один и тот же identifier через `let` или `const`

Неправильный код:

```javascript
const status = 'created';
// const status = 'ready';
```

Что произошло:

Один и тот же identifier нельзя заново объявить в том же месте выполнения через `const`. Подробные правила места выполнения объяснит Scope.

Исправленный вариант:

```javascript
let status = 'created';

status = 'ready';
```

Если status должен изменяться, используйте reassignment, а не повторную declaration.

### Ошибка 5. Использовать плохие identifiers

Неправильный код:

```javascript
const data = 'active';
```

Что произошло:

Имя `data` не объясняет, что именно хранится.

Исправленный вариант:

```javascript
const expectedUserStatus = 'active';
```

---

## Практическое использование

При чтении variables задавайте пять вопросов:

```text
1. Где identifier объявлен?
2. Есть ли initialization?
3. Есть ли assignment позже?
4. Есть ли reassignment?
5. Что будет прочитано в текущей строке?
```

Таблица анализа:

```text
Line | Code                         | Operation
-----|------------------------------|------------------------
1    | const baseUrl = "..."        | declaration + initialization
2    | let testStatus = "created"   | declaration + initialization
3    | testStatus = "ready"         | reassignment
4    | console.log(testStatus)      | read
```

Практическое правило:

```text
Use const
│
└── when value should not be reassigned

Use let
│
└── when value must change

Avoid var
│
└── in new code
```

Это правило не заменяет понимание. Оно просто помогает писать более читаемый код.

---

## Использование в Automation QA

### Storing configuration

Configuration значения обычно не должны reassignment-иться внутри теста.

```javascript
const baseUrl = 'https://example.com';
const browserName = 'chromium';
```

Почему `const`:

```text
Reader sees const
│
▼
expects no reassignment
│
▼
configuration looks stable
```

### Storing test data

Test data может быть stable:

```javascript
const userName = 'qa-user';
const password = 'secret';
```

Если значение строится постепенно, может понадобиться `let`, но это должно быть осознанно.

```javascript
let userStatus = 'created';

userStatus = 'activated';
```

### Expected vs actual значения

В assertions часто полезно явно разделять expected и actual.

```javascript
const expectedStatus = 'active';
const actualStatus = 'active';

console.log(expectedStatus);
console.log(actualStatus);
```

Схема:

```text
expectedStatus
│
└── what test expects

actualStatus
│
└── what system returned
```

Хорошие identifiers уменьшают количество ошибок при чтении теста.

### Helper results

Helper может вернуть value, которое нужно сохранить.

```javascript
function buildUserName() {
  return 'qa-user';
}

const userName = buildUserName();
```

`return` будет подробно изучаться позже. Сейчас важно: результат helper получает readable name.

```text
helper result
│
▼
stored through variable
│
▼
used by test step
```

### Fixture variables

Fixture часто подготавливает значения для теста.

```text
fixture
│
├── declares userName
├── initializes userName
└── test reads userName later
```

Если fixture меняет status, это должно быть видно через `let`.

```text
let setupStatus
│
└── reader expects updates
```

### Почему выбор `let` или `const` улучшает читаемость

`const` сообщает:

```text
This named access will not be reassigned.
```

`let` сообщает:

```text
This named access may change.
```

Для Automation QA это важно, потому что тесты читаются как сценарии. Если значение меняется, это должно быть видно. Если значение не меняется, `const` снижает когнитивную нагрузку.

---

## Итоги

Variables нужны, чтобы программист мог работать с stored information через понятные names.

Главная модель:

```text
Variable
│
└── named access to information managed by the engine
```

В этой главе были разобраны:

```text
Declaration
│
└── register identifier

Initialization
│
└── first value at declaration

Assignment
│
└── write value to existing name

Reassignment
│
└── write new value to existing name
```

`const` запрещает reassignment. `let` разрешает reassignment. `var` остается в языке по историческим причинам и будет важен при изучении Hoisting и Scope.

Следующая глава объяснит Scope: где объявленные identifiers доступны и почему одно имя можно прочитать в одном месте программы, но нельзя прочитать в другом.

---

## Что нужно запомнить

✓ Variable — named access к сохраненной информации.

✓ Variable не нужно представлять как коробку.

✓ Identifier — имя, используемое в коде.

✓ Declaration регистрирует identifier.

✓ Initialization дает initial value при declaration.

✓ Assignment записывает value в существующий named access.

✓ Reassignment заменяет current value.

✓ `const` запрещает reassignment.

✓ `let` разрешает reassignment.

✓ `var` нужен для понимания legacy-кода и будущих тем.

✓ Следующая тема — Scope, то есть правила доступности identifiers.

---

## Проверьте себя

1. Почему variables существуют?

2. Почему variable не стоит объяснять как коробку?

3. Что такое identifier?

4. Что делает declaration?

5. Что делает initialization?

6. Чем assignment отличается от declaration?

7. Что такое reassignment?

8. Почему `const` должен получить initial value сразу?

9. Когда уместен `let`?

10. Почему `var` не является modern default?

---

## Практика

Практика к этой главе находится в файле:

```text
practice/01-javascript/06-variables.md
```

Перед практикой запустите примеры из `examples/01-javascript/chapter-06/` и для каждого файла выпишите операции:

```text
declaration
initialization
assignment
reassignment
read
```

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/06-variables.md
```

Открывайте решения после самостоятельной попытки. В этой главе важно сравнивать не только вывод программы, но и список операций, которые engine выполняет с identifiers и значения.
