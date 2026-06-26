# this

## Связь с предыдущей главой

Предыдущая глава объяснила Closures.

Главная модель была такой:

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

Closure отвечает на вопрос:

```text
Which variables can the function access?
```

Теперь появляется другой вопрос.

Одна и та же функция может быть вызвана по-разному:

```javascript
function printName() {
  console.log(this.name);
}

const user = {
  name: 'Anna',
  printName
};

const admin = {
  name: 'Kate',
  printName
};

user.printName();
admin.printName();
```

Код функции один и тот же.

Но результат зависит от вызова.

Главный вопрос этой главы:

> Кто решил, чем будет `this`?

---

## Предварительные требования

Для этой главы нужно понимать:

* что функция - это function object;
* что function object можно хранить в переменной;
* что object может хранить properties;
* что property value может быть function object;
* что Closure связана с Lexical Environment;
* что Execution Context создается при вызове функции;
* что Call Stack управляет активными вызовами.

Не требуется знать `call()`, `apply()`, `bind()`, classes, constructors, `new`, DOM event handlers или async callbacks. Эти темы будут изучаться позже.

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

`this` сложен не из-за синтаксиса. Он сложен потому, что многие пытаются определить `this` по месту создания функции. В обычных function declarations и function expressions это неверная модель.

Главная мысль главы:

```text
Function creation
│
≠
Function invocation
```

`this` определяется во время invocation.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/28-closures.md
```

Текущая глава:

```text
docs/01-javascript/29-this.md
```

Следующая глава:

```text
docs/01-javascript/30-call.md
```

Следующая глава ответит:

> Можно ли выбрать receiver вручную?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `this`;
* что такое execution receiver;
* почему `this` определяется во время вызова;
* чем global invocation отличается от method invocation;
* почему detached function теряет receiver;
* почему Creation Phase не решает значение `this` заранее;
* чем Closure отличается от `this`;
* как Arrow Function связана с `this` на высоком уровне;
* какие ошибки чаще всего возникают;
* как `this` встречается в Automation QA коде.

---

## Мотивация

Начнем с неожиданного поведения.

```javascript
const apiClient = {
  name: 'staging client',
  printName: function () {
    console.log(this.name);
  }
};

const localClient = {
  name: 'local client',
  printName: apiClient.printName
};

apiClient.printName();
localClient.printName();
```

Function object один:

```text
apiClient.printName
│
└── same function object

localClient.printName
│
└── same function object
```

Но вызовы разные:

```text
apiClient.printName()
│
└── receiver is apiClient

localClient.printName()
│
└── receiver is localClient
```

Same function, different invocation:

```text
Same code
│
├── called as apiClient.printName()
│   └── this -> apiClient
│
└── called as localClient.printName()
    └── this -> localClient
```

Если думать, что `this` определяется там, где функция была создана, этот пример невозможно объяснить.

Правильный вопрос:

> Как функция была вызвана?

Why `this` exists:

```text
One reusable function
│
▼
can work for different objects
│
▼
needs current receiver
│
▼
this
```

---

## Теория

### Зачем существует this

Функция часто описывает действие, которое должно выполняться для конкретного object.

```javascript
const response = {
  status: 200,
  isSuccessful: function () {
    return this.status === 200;
  }
};
```

Внутри `isSuccessful` нужно обратиться к текущему response object.

Без `this` пришлось бы явно указывать имя объекта:

```javascript
const response = {
  status: 200,
  isSuccessful: function () {
    return response.status === 200;
  }
};
```

Но тогда функция жестко привязана к имени `response`.

`this` решает другую задачу:

```text
method body
│
└── needs current object
    │
    ▼
    this points to current receiver
```

Receiver model:

```text
object.method()
│
├── object  -> receiver
└── method  -> function object

inside method
│
└── this -> receiver
```

`this` нужен, чтобы один function object мог работать с тем object, для которого он вызван.

---

### Execution receiver

Execution receiver - это object, для которого выполняется function call.

В выражении:

```javascript
apiClient.printName();
```

receiver:

```text
apiClient.printName()
│
├── apiClient -> receiver
└── printName -> function object
```

Current receiver:

```text
Current function call
│
└── has current receiver
    │
    └── available as this
```

Важно:

```text
Function object
│
└── does not permanently belong to one object

Function invocation
│
└── selects receiver for this call
```

Один function object может быть property разных objects.

```text
same function object
│
├── user.printName()
│   └── this -> user
│
└── admin.printName()
    └── this -> admin
```

---

### Как определяется this

Для обычных function calls, которые рассматриваются в этой главе, используем рабочее правило:

```text
this is determined by invocation
```

Invocation determines `this`:

```text
How function is called
│
▼
receiver is selected
│
▼
this receives receiver
│
▼
function body executes
```

Creation vs invocation:

```text
Function creation
│
├── creates function object
└── does not decide this forever

Function invocation
│
├── starts execution
└── determines this for this call
```

Для обычного вызова вида `object.method()` ключевой вопрос для чтения кода:

```text
Who is on the left side of the dot at call time?
```

Пример:

```javascript
client.printName();
```

```text
client.printName()
│
└── left side before dot is client
    │
    ▼
    this -> client
```

Это не универсальное правило для всех форм вызова в JavaScript. Сейчас мы строим базовую модель receiver для обычных вызовов `object.method()` и standalone calls. Другие формы вызова будут изучаться в следующих главах.

---

### Global invocation

Global invocation - это вызов функции без object receiver.

```javascript
'use strict';

function printThis() {
  console.log(this);
}

printThis();
```

Global call:

```text
printThis()
│
├── no object before dot
└── no receiver
```

В strict mode:

```text
No receiver
│
▼
this -> undefined
```

В старом non-strict поведении `this` мог указывать на global object. В этом курсе мы строим современную практическую модель и будем избегать зависимости от non-strict поведения.

Global invocation diagram:

```text
Function call
│
└── printThis()
    │
    ├── receiver: none
    └── this: undefined in strict mode
```

---

### Method invocation

Method invocation - это вызов function object как property object.

```javascript
const user = {
  name: 'Anna',
  printName: function () {
    console.log(this.name);
  }
};

user.printName();
```

Object method:

```text
user
│
├── name: 'Anna'
└── printName: function object
```

Method call:

```text
user.printName()
│
├── receiver: user
└── this inside function: user
```

Current object:

```text
Inside printName
│
├── this.name
│
└── means user.name for this invocation
```

Same code, different receiver:

```text
printName body
│
└── console.log(this.name)

user.printName()
│
└── this.name -> user.name

admin.printName()
│
└── this.name -> admin.name
```

---

### Detached function

Detached function - это function object, который взяли из object property и вызвали отдельно.

```javascript
'use strict';

const apiClient = {
  name: 'staging',
  printName: function () {
    console.log(this.name);
  }
};

const printClientName = apiClient.printName;

printClientName();
```

Method extraction:

```text
apiClient.printName
│
└── function object copied into variable
```

Function reference:

```text
printClientName
│
└── references same function object
```

Lost receiver:

```text
apiClient.printName()
│
└── receiver: apiClient

printClientName()
│
└── receiver: none
```

В strict mode `this` будет `undefined`, поэтому попытка прочитать `this.name` приведет к ошибке.

Detached function diagram:

```text
Object property access
│
▼
function object extracted
│
▼
called without object
│
▼
receiver lost
│
▼
this is undefined in strict mode
```

Это одна из самых частых ошибок в JavaScript.

---

### Arrow Function overview

Arrow Functions ведут себя с `this` иначе, но в этой главе мы не разбираем lexical `this` глубоко.

Достаточно зафиксировать:

```text
Regular function
│
└── this depends on invocation

Arrow function
│
└── this is not determined by its own invocation
```

Arrow function preview:

```text
Arrow Function
│
├── useful compact syntax
├── has special this behavior
└── detailed mechanics later
```

Не используйте Arrow Function как "просто короткую method syntax" для object methods, если внутри нужен `this`.

Подробности lexical `this` будут изучаться позже, когда появятся callbacks и более сложные function patterns.

---

## Внутренний механизм

### Execution Context revisit

Когда function call начинается, JavaScript создает Function Execution Context.

В главах раньше мы смотрели на:

```text
Function Execution Context
│
├── local identifiers
├── parameters
└── link to lexical environment
```

Теперь добавляем еще один вопрос:

```text
Function Execution Context
│
├── variables available through Lexical Environment
└── this value for current invocation
```

Execution Context revisit:

```text
Function call starts
│
▼
receiver is determined for this invocation form
│
▼
Function Execution Context is created
│
▼
this value is available during execution
```

Важно: `this` не ищется как обычная variable через Scope Chain.

`this` lookup:

```text
Need this
│
▼
Use this value of current function invocation
│
▼
Do not search outer scopes like normal identifier
```

---

### Invocation flow

Разберем вызов:

```javascript
client.printStatus();
```

Invocation flow:

```text
1. Evaluate client
   │
   ▼
2. Read property printStatus
   │
   ▼
3. Get function object
   │
   ▼
4. Call function as method of client
   │
   ▼
5. For this ordinary method call, receiver is client
   │
   ▼
6. Execute function body
   │
   ▼
7. Inside body this -> client
```

Receiver selection:

```text
For ordinary calls in this chapter
│
├── object.method()
│   └── receiver: object
│
└── functionName()
    └── receiver: none
```

Other invocation forms:

```text
call / apply / bind / new / classes
│
└── later chapters
```

Complete execution picture:

```text
client.printStatus()
│
▼
receiver selected: client
│
▼
Function Execution Context
│
├── this -> client
├── parameters
└── local identifiers
│
▼
function body executes
```

---

### Closure vs this

Closures и `this` часто путают, потому что обе темы связаны с функциями.

Но они отвечают на разные вопросы.

Closure vs `this`:

```text
Closure
│
└── Which variables can the function access?

this
│
└── Who is the current receiver of this call?
```

Environment vs receiver:

```text
Lexical Environment
│
└── determined by where function was created

this
│
└── determined by how function is invoked
```

Пример:

```javascript
function createPrinter(prefix) {
  return function printName() {
    console.log(prefix + ': ' + this.name);
  };
}
```

Внутри `printName` есть две разные зависимости:

```text
prefix
│
└── comes from Closure

this.name
│
└── comes from current receiver
```

Одна функция может одновременно использовать Closure и `this`, но механизмы разные.

---

### Timeline

Timeline:

```text
T1  Function object is created
│
T2  Function may get Lexical Environment reference
│
T3  Function is stored as object property
│
T4  Later object.method() is called
│
T5  Receiver is selected from call expression
│
T6  this value is set for this invocation
│
T7  Function body executes
```

Function creation:

```text
Create function object
│
└── does not permanently choose this
```

Function invocation:

```text
Call function
│
└── chooses this for this call
```

Это центральная граница главы.

---

## Ментальная модель

### Current receiver

Думайте о `this` как о current receiver card, которую JavaScript кладет перед функцией на время вызова.

Current context card:

```text
Function call
│
├── function object
└── receiver card
    │
    └── this
```

Для `apiClient.request()`:

```text
receiver card
│
└── apiClient
```

Для `request()`:

```text
receiver card
│
└── none
```

---

### Current owner

Модель "current owner" полезна, если не понимать ее буквально.

```text
object.method()
│
└── object is current owner for this call
```

Функция не принадлежит object навсегда.

```text
Function object
│
├── can be stored in user
├── can be stored in admin
└── can be called without object
```

Active object:

```text
Call expression
│
└── chooses active object
    │
    └── this
```

---

### Current speaker

Еще одна модель:

```text
method body
│
└── says "this"
    │
    ▼
    "the object speaking right now"
```

Current speaker:

```text
user.sayName()
│
└── speaker: user

admin.sayName()
│
└── speaker: admin
```

Эта модель помогает читать Page Object methods:

```text
loginPage.open()
│
└── this -> loginPage
```

Но помните: если method extracted, speaker теряется.

---

### Mental model summary

```text
this
│
├── not where function was created
├── not the function itself
├── not always the object where function is stored
└── receiver of current invocation
```

Summary diagram:

```text
Call expression
│
▼
receiver selection
│
▼
this value
│
▼
function body
```

---

### Current position in JavaScript model

```text
JavaScript function model
│
├── Function Declaration
├── Function Expression
├── Arrow Functions
├── Parameters
├── Return
├── Rest
├── Spread
├── Closures
│   └── lexical variables
└── this
    └── current receiver
```

Bridge to call/apply/bind:

```text
Regular call
│
└── receiver comes from the ordinary invocation form studied here

call / apply / bind
│
└── will let us control receiver manually
```

---

## Примеры кода

Примеры находятся в папке:

```text
examples/chapter-32/
```

Запуск:

```bash
node examples/chapter-32/01-global-call.js
node examples/chapter-32/02-method-call.js
node examples/chapter-32/03-detached-function.js
node examples/chapter-32/04-arrow-preview.js
node examples/chapter-32/05-common-mistakes.js
node examples/chapter-32/06-qa-example.js
```

### Global call

```javascript
'use strict';

function showReceiver() {
  console.log(this);
}

showReceiver();
```

Global call:

```text
showReceiver()
│
└── no receiver
    │
    └── this -> undefined
```

---

### Method call

```javascript
const apiClient = {
  name: 'staging',
  printName: function () {
    console.log(this.name);
  }
};

apiClient.printName();
```

Method call:

```text
apiClient.printName()
│
└── this -> apiClient
```

---

### Detached function

```javascript
'use strict';

const apiClient = {
  name: 'staging',
  getName: function () {
    return this.name;
  }
};

const getClientName = apiClient.getName;

console.log(getClientName());
```

Этот пример intentionally demonstrates an error. Detached function вызывается без receiver, поэтому `this` равен `undefined` в strict mode.

---

### Arrow preview

```javascript
const apiClient = {
  name: 'staging',
  getName: () => {
    return this.name;
  }
};

console.log(apiClient.getName());
```

В Node.js этот пример обычно выводит `undefined`, потому что Arrow Function не получает `this` от вызова `apiClient.getName()`.

Подробная механика Arrow Function и `this` будет разобрана позже.

---

## Частые вопросы

### this - это то же самое, что Closure?

Нет.

```text
Closure
│
└── variables from Lexical Environment

this
│
└── receiver of current invocation
```

### this указывает на функцию?

Нет. `this` указывает на receiver текущего вызова, а не на function object.

### this определяется там, где функция написана?

Для обычных functions - нет. `this` определяется тем, как функция вызвана.

### Почему detached function теряет this?

В модели обычных вызовов из этой главы `functionName()` вызывается без object receiver. Поэтому такой вызов не выбирает receiver так же, как `object.method()`.

### Нужно ли всегда избегать this?

Нет. `this` полезен в object methods, page objects, API clients и helper objects. Проблема не в `this`, а в неправильной mental model.

---

## Распространенные мифы

### Миф 1. this всегда указывает на object, где функция была создана

Реальность:

```text
Function creation
│
└── does not fix this

Function invocation
│
└── determines this
```

### Миф 2. this и Scope Chain работают одинаково

Реальность:

```text
identifier lookup
│
└── uses Scope Chain

this
│
└── uses receiver of current invocation
```

### Миф 3. Arrow Functions - лучший метод для object methods

Реальность: если method должен использовать receiver через `this`, обычная function часто понятнее. Arrow Functions имеют особое поведение `this`, которое будет изучаться позже.

---

## Типичные ошибки

### Ошибка 1. Потерять receiver

Неправильный код:

```javascript
'use strict';

const helper = {
  prefix: 'API',
  log: function (message) {
    console.log(this.prefix + ': ' + message);
  }
};

const log = helper.log;

log('Request failed');
```

Что произошло:

```text
helper.log()
│
└── receiver: helper

log()
│
└── receiver: none
```

Почему это произошло:

```text
function object was detached
│
▼
called without object
│
▼
this became undefined in strict mode
```

Исправленный вариант в рамках уже изученного:

```javascript
helper.log('Request failed');
```

`call()`, `apply()` и `bind()` дадут другие способы управления receiver в следующих главах.

---

### Ошибка 2. Думать, что this берется из Closure

```javascript
function createPrinter(prefix) {
  return function printName() {
    console.log(prefix + ': ' + this.name);
  };
}
```

`prefix` приходит из Closure.

`this.name` приходит из receiver текущего вызова.

Common mistakes:

```text
prefix
│
└── lexical environment

this
│
└── current receiver
```

---

### Ошибка 3. Использовать Arrow Function как method с this

```javascript
const user = {
  name: 'Anna',
  getName: () => {
    return this.name;
  }
};
```

Что произошло:

```text
apiClient.getName()
│
└── method-like call
    │
    └── but arrow does not receive this this way
```

Исправленный вариант:

```javascript
const user = {
  name: 'Anna',
  getName: function () {
    return this.name;
  }
};
```

---

## Практическое использование

`this` полезен, когда object хранит данные и behavior рядом.

```javascript
const response = {
  status: 200,
  isSuccessful: function () {
    return this.status === 200;
  }
};
```

Практическая модель:

```text
response
│
├── data: status
└── behavior: isSuccessful()
    │
    └── uses this.status
```

`this` делает method reusable внутри object model:

```text
object
│
├── state
└── method
    │
    └── reads current receiver state
```

В обычном прикладном коде это встречается в clients, builders, validators и page objects.

---

## Использование в Automation QA

### Page Object methods

Page Object часто хранит locators, page reference и methods.

```text
LoginPage
│
├── page
├── usernameInput
└── open()
    │
    └── this.page
```

Если method вызывается как `loginPage.open()`, receiver - `loginPage`.

```text
loginPage.open()
│
└── this -> loginPage
```

Если method detached, receiver может потеряться.

---

### API client objects

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};
```

QA object example:

```text
apiClient.buildUrl('/users')
│
├── receiver: apiClient
└── this.baseUrl -> apiClient.baseUrl
```

Это помогает держать configuration и behavior рядом.

---

### Helper objects

Helper object:

```text
assertions
│
├── expectedStatus
└── validateStatus()
    │
    └── this.expectedStatus
```

Понимание `this` помогает:

* читать page object methods;
* находить потерянный receiver;
* понимать ошибки в helper objects;
* не путать Closure configuration и receiver state;
* аккуратно проектировать API clients.

---

## Практика

Практика находится в файле:

```text
practice/chapter-32.md
```

Выполняйте задания после запуска примеров из `examples/chapter-32/`.

Главное упражнение этой главы - для каждого вызова задавать вопрос:

```text
Who is the receiver of this invocation?
```

---

## Решения

Файл с решениями:

```text
solutions/chapter-32.md
```

В решениях обращайте внимание на reasoning. Для `this` недостаточно назвать результат; нужно объяснить, какая форма invocation выбрала receiver.

---

## Итоги

`this` отвечает на вопрос:

```text
Who is the current receiver?
```

Полная модель:

```text
Function object exists
│
▼
Function is invoked
│
▼
Invocation form selects receiver
│
▼
this is set for this call
│
▼
Function body executes
```

Closure и `this` решают разные задачи:

```text
Closure
│
└── which variables are available?

this
│
└── who is the current receiver?
```

Следующая глава про `call()` покажет, как выбрать receiver вручную.

---

## Что нужно запомнить

* `this` определяется во время invocation.
* Function creation не фиксирует `this` навсегда.
* В обычном вызове `object.method()` receiver обычно object слева от точки.
* В detached function receiver теряется.
* В strict mode global call дает `this === undefined`.
* Closure отвечает про variables, `this` отвечает про receiver.
* Arrow Functions имеют особое поведение `this`; подробно оно будет изучаться позже.
* Следующие главы покажут другие формы вызова и ручной выбор receiver.

---

## Quick Check

Ответьте без запуска кода:

1. Чем Closure отличается от `this`?
2. Что является receiver в вызове `apiClient.buildUrl('/users')`?
3. Почему `const fn = object.method; fn()` может сломать `this`?
4. Когда определяется `this`: при создании функции или при вызове?
5. Почему Arrow Function не стоит механически использовать как object method с `this`?
6. Какую проблему будет решать следующая глава про `call()`?
