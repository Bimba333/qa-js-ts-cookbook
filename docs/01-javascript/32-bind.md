# bind()

## Связь с предыдущей главой

Предыдущая глава объяснила `apply()`.

Главная модель была такой:

```text
apply()
│
├── receiver выбирается явно
└── arguments передаются одним array или array-like collection
```

До этого `call()` показал другой вариант:

```text
call()
│
├── receiver выбирается явно
└── arguments передаются отдельно
```

Оба механизма делают invocation сразу.

```text
functionObject.call(receiver, arg1, arg2)
│
▼
receiver выбран
│
▼
function выполняется сейчас
```

Теперь появляется следующий вопрос:

> Что делать, если объект выполнения нужно выбрать один раз, а function вызвать позже?

Или так:

```text
choose receiver
│
▼
do not invoke yet
│
▼
save prepared function
│
▼
invoke later
```

Для этого существует `bind()`.

Главный вопрос главы:

> Что отличается от `call()`?

Ответ:

```text
call()
│
├── chooses receiver
└── invokes immediately

bind()
│
├── chooses receiver
└── creates a new function for later invocation
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что function object можно хранить в переменной;
* что `this` определяется формой invocation;
* что обычный `object.method()` выбирает объект выполнения из формы вызова;
* что `call()` позволяет явно выбрать объект выполнения;
* что `apply()` отличается от `call()` способом передачи arguments;
* что функция начинает выполнение только при invocation;
* что один function object можно использовать с разными объект выполненияs.

Не требуется знать constructors with `bind`, `new`, classes, decorators, polyfills или внутреннее устройство `Function.prototype.bind`. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            130-160 минут
Разбор схем:             55-75 минут
Запуск примеров:         20-30 минут
Практика:                110-140 минут
Повторение материала:    30 минут
```

Уровень сложности: **L4**.

`bind()` сложен не синтаксисом. Сложность в том, что он не вызывает функцию сразу. Он создает новую function, у которой объект выполнения уже выбран заранее.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/31-apply.md
```

Текущая глава:

```text
docs/01-javascript/32-bind.md
```

Следующая глава:

```text
docs/01-javascript/33-objects.md
```

Следующая глава начнет новый раздел и вернется к object значения уже глубже:

> Как устроены objects как основная форма группировки данных и поведения?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `bind()`;
* почему `bind()` не выполняет function сразу;
* что `bind()` создает новую function;
* что объект выполнения в bound function выбран заранее;
* чем `bind()` отличается от `call()` и `apply()`;
* как работает delayed invocation;
* зачем нужна reusable bound function;
* что такое partial arguments на высоком уровне;
* какие ошибки чаще всего встречаются;
* как `bind()` используется в Automation QA.

---

## Мотивация

Начнем с проблемы.

Есть validator:

```javascript
'use strict';

function validateStatus(path, actualStatus, expectedStatus) {
  const message = this.environment + ' ' + path;

  if (actualStatus !== expectedStatus) {
    return message + ' failed';
  }

  return message + ' passed';
}

const stagingConfig = {
  environment: 'staging'
};
```

Через `call()` можно явно выбрать объект выполнения:

```javascript
validateStatus.call(stagingConfig, '/users', 200, 200);
validateStatus.call(stagingConfig, '/orders', 201, 201);
validateStatus.call(stagingConfig, '/profile', 200, 200);
```

Это работает.

Но объект выполнения повторяется каждый раз:

```text
validateStatus.call(stagingConfig, ...)
validateStatus.call(stagingConfig, ...)
validateStatus.call(stagingConfig, ...)
                 │
                 └── same receiver again and again
```

Проблема не в том, что `call()` плохой.

`call()` отлично подходит, когда объект выполнения нужен для одного конкретного invocation.

Проблема другая:

```text
Same receiver
│
▼
many future invocations
│
▼
repeating .call(receiver, ...)
│
▼
noise in code
```

Вопрос:

> Можно ли выбрать объект выполнения один раз и получить function, которую потом удобно вызывать?

`bind()` отвечает:

```text
yes
```

Зачем существует bind():

```text
Need explicit receiver
│
▼
Need delayed invocation
│
▼
Need reusable prepared function
│
▼
bind()
```

Центральная мысль:

```text
call()
│
▼
choose receiver
│
▼
invoke now

bind()
│
▼
choose receiver
│
▼
create new function
│
▼
invoke later
```

---

## Теория

Не начинаем с определения. Сначала посмотрим на отличие поведения.

```javascript
const boundValidateStatus = validateStatus.bind(stagingConfig);
```

Эта строка не запускает `validateStatus`.

Она создает новую function:

```text
validateStatus
│
▼
.bind(stagingConfig)
│
▼
new function
│
▼
boundValidateStatus
```

Теперь новую function можно вызвать обычным образом:

```javascript
boundValidateStatus('/users', 200, 200);
boundValidateStatus('/orders', 201, 201);
```

При каждом таком вызове объект выполнения уже известен:

```text
boundValidateStatus('/users', 200, 200)
│
▼
uses fixed receiver
│
▼
this -> stagingConfig
```

### Что такое `bind()`

`bind()` - это method function object, который создает новую function с заранее выбранным объект выполнения.

Важно:

```text
bind()
│
├── does not call original function now
├── returns a new function
└── remembers selected receiver for future calls
```

Синтаксис:

```javascript
const boundFunction = originalFunction.bind(receiver);
```

Модель:

```text
originalFunction
│
▼
bind(receiver)
│
▼
boundFunction
│
▼
later invocation uses receiver
```

### Что отличается от `call()`

`call()`:

```javascript
validateStatus.call(stagingConfig, '/users', 200, 200);
```

```text
Receiver selected
│
▼
Arguments passed
│
▼
Function executes immediately
│
▼
Result returned now
```

`bind()`:

```javascript
const validateInStaging = validateStatus.bind(stagingConfig);
```

```text
Receiver selected
│
▼
New function created
│
▼
Nothing executed yet
│
▼
Function can be called later
```

### Что отличается от `apply()`

`apply()` решает задачу с ordered argument list:

```javascript
validateStatus.apply(stagingConfig, ['/users', 200, 200]);
```

```text
apply()
│
├── receiver: stagingConfig
├── arguments: array
└── invocation: now
```

`bind()` решает другую задачу:

```text
bind()
│
├── receiver: stagingConfig
├── new function: yes
└── invocation: later
```

### Bound function

Function, созданная через `bind()`, часто называется bound function.

Это не новый тип значения отдельно от objects.

Функция в JavaScript - это function object. `bind()` возвращает новый function object, который можно вызвать.

```text
JavaScript values
│
├── Primitive values
│
└── Object values
    │
    ├── Ordinary objects
    └── Function objects
        │
        └── bound function is also a function object
```

### Привязанный объект выполнения

Receiver, переданный в `bind()`, становится заранее выбранным объект выполнения для будущих вызовов.

```text
bind(stagingConfig)
│
▼
fixed receiver
│
▼
future invocation
│
▼
this -> stagingConfig
```

Ментальная модель: постоянный badge.

```text
Function object
│
▼
receives permanent badge
│
▼
"I work with stagingConfig"
```

### Delayed invocation

Delayed invocation означает:

```text
prepare function now
│
▼
call it later
```

Это особенно полезно, когда function нужно передать дальше, сохранить в переменной или использовать много раз.

В этой главе мы не изучаем callbacks подробно. Callback - это function, которую передают другому коду для будущего вызова. Эта тема будет отдельной позже.

### Partial arguments

`bind()` может заранее фиксировать не только объект выполнения, но и первые arguments.

```javascript
const validateUsers = validateStatus.bind(stagingConfig, '/users');

console.log(validateUsers(200, 200));
```

Высокоуровневая модель:

```text
bind(receiver, firstArgument)
│
▼
new function remembers:
│
├── receiver
└── first argument
│
▼
later call supplies remaining arguments
```

Подробные сценарии частичного применения arguments будут изучаться позже. Сейчас важно только увидеть, что `bind()` может подготовить function заранее.

---

## Внутренний механизм

Спросим главный вопрос главы:

> Что отличается от `call()`?

### Шаг 1. Есть исходная function

```javascript
function validateStatus(path, actualStatus, expectedStatus) {
  return this.environment + ' ' + path;
}
```

Концептуальное состояние:

```text
validateStatus
│
▼
function object
│
▼
can be invoked with different receivers
```

### Шаг 2. Вызывается `bind()`

```javascript
const validateInStaging = validateStatus.bind(stagingConfig);
```

Engine видит:

```text
function object
│
▼
bind(receiver)
│
▼
create another function object
```

### Шаг 3. Создается новая function

Это ключевой момент.

`bind()` не меняет исходную function.

```text
Before bind()

validateStatus
│
▼
original function object

After bind()

validateStatus
│
▼
original function object

validateInStaging
│
▼
new bound function object
```

### Шаг 4. Receiver фиксируется в новой function

```text
bound function
│
├── target function -> validateStatus
└── fixed receiver  -> stagingConfig
```

Это концептуальная схема. Мы не изучаем внутренние слоты ECMAScript и точную реализацию engine.

### Шаг 5. Ничего не выполняется

После `bind()` тело исходной function еще не запускалось.

```text
validateStatus.bind(stagingConfig)
│
▼
new function returned
│
▼
function body not executed
```

Это ответ на частую ошибку:

> Почему `bind()` ничего не вывел в консоль?

Потому что `bind()` готовит function. Invocation будет позже.

### Шаг 6. Bound function вызывается позже

```javascript
validateInStaging('/users', 200, 200);
```

Теперь происходит invocation:

```text
validateInStaging(...)
│
▼
uses target function validateStatus
│
▼
uses fixed receiver stagingConfig
│
▼
passes arguments
│
▼
executes body
```

### Execution Context revisit

Когда bound function вызывается, JavaScript все равно создает Execution Context для выполнения function.

Но объект выполнения берется не из обычной формы вызова:

```text
Ordinary method call
│
▼
receiver from object.method()

Bound function call
│
▼
receiver from bind()
```

Концептуальное выполнение:

```text
validateInStaging('/users', 200, 200)
│
▼
Function Execution Context
│
├── this -> stagingConfig
├── path -> '/users'
├── actualStatus -> 200
└── expectedStatus -> 200
```

### Function identity

`bind()` возвращает новую function. Поэтому identity отличается.

```javascript
const first = validateStatus.bind(stagingConfig);
const second = validateStatus.bind(stagingConfig);

console.log(first === second);
```

Результат:

```text
false
```

Почему:

```text
first
│
▼
bound function object #1

second
│
▼
bound function object #2
```

Receiver может быть тем же самым. Function objects все равно разные.

---

## Ментальная модель

`bind()` удобно понимать через preconfigured remote.

Обычная function:

```text
Remote control
│
▼
needs receiver every time
```

`call()`:

```text
Take remote
│
▼
choose device now
│
▼
press button now
```

`bind()`:

```text
Take remote
│
▼
configure device once
│
▼
save configured remote
│
▼
press button later many times
```

Еще одна модель: fixed driver.

```text
Car: function body
Driver: receiver

call()
│
▼
assign driver for this trip only

bind()
│
▼
assign fixed driver to prepared route
```

Модель assigned employee:

```text
Task template
│
▼
bind(employee)
│
▼
prepared task
│
▼
employee is known for every future execution
```

Главное не перепутать:

```text
bind() does not execute work
│
▼
bind() prepares work
```

---

## Примеры кода

Примеры находятся в:

```text
examples/01-javascript/chapter-32/
```

Запуск:

```bash
node examples/01-javascript/chapter-32/01-basic-bind.js
node examples/01-javascript/chapter-32/02-bound-function.js
node examples/01-javascript/chapter-32/03-call-vs-bind.js
node examples/01-javascript/chapter-32/04-common-mistakes.js
node examples/01-javascript/chapter-32/05-qa-example.js
node examples/01-javascript/chapter-32/06-reusable-helper.js
```

### Пример 1. Basic bind

```javascript
'use strict';

function printEnvironment() {
  console.log(this.environment);
}

const stagingConfig = {
  environment: 'staging'
};

const printStagingEnvironment = printEnvironment.bind(stagingConfig);

printStagingEnvironment();
```

Что делает engine:

```text
printEnvironment.bind(stagingConfig)
│
▼
create bound function
│
▼
printStagingEnvironment()
│
▼
this -> stagingConfig
```

### Пример 2. Bound function

```javascript
'use strict';

function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const buildApiUrl = buildUrl.bind(apiClient);

console.log(buildApiUrl('/users'));
console.log(buildApiUrl('/orders'));
```

Одна подготовленная function используется несколько раз.

```text
buildApiUrl
│
├── fixed receiver -> apiClient
└── reusable calls -> many paths
```

### Пример 3. call vs bind

```javascript
'use strict';

function formatStatus(path, status) {
  return this.environment + ' ' + path + ' ' + status;
}

const config = {
  environment: 'staging'
};

console.log(formatStatus.call(config, '/users', 200));

const formatStagingStatus = formatStatus.bind(config);
console.log(formatStagingStatus('/orders', 201));
```

Сравнение:

```text
call()
│
└── result now

bind()
│
└── function now, result later
```

### Пример 4. Типичные ошибки

```javascript
'use strict';

function printBaseUrl() {
  console.log(this.baseUrl);
}

const client = {
  baseUrl: 'https://api.example.test'
};

const preparedPrint = printBaseUrl.bind(client);

console.log('After bind');
preparedPrint();
```

`bind()` не выводит `baseUrl`. Вывод происходит только при вызове `preparedPrint()`.

### Пример 5. QA example

```javascript
'use strict';

function validateResponse(path, actualStatus, expectedStatus) {
  const prefix = this.project + ' ' + this.environment;

  if (actualStatus === expectedStatus) {
    return prefix + ' ' + path + ' passed';
  }

  return prefix + ' ' + path + ' failed';
}

const qaConfig = {
  project: 'billing',
  environment: 'staging'
};

const validateBillingStaging = validateResponse.bind(qaConfig);

console.log(validateBillingStaging('/invoices', 200, 200));
console.log(validateBillingStaging('/payments', 500, 200));
```

QA смысл:

```text
One validator
│
▼
one config bound once
│
▼
many endpoint checks
```

### Пример 6. Reusable helper

```javascript
'use strict';

function createReportLine(testName, status) {
  return this.suite + ': ' + testName + ' -> ' + status;
}

const smokeSuite = {
  suite: 'smoke'
};

const createSmokeReportLine = createReportLine.bind(smokeSuite);

console.log(createSmokeReportLine('login', 'passed'));
console.log(createSmokeReportLine('checkout', 'failed'));
```

Такой helper удобно передавать или использовать повторно без постоянного `.call(smokeSuite, ...)`.

---

## Частые вопросы

### `bind()` вызывает функцию?

Нет.

```text
bind()
│
▼
returns new function
│
▼
does not execute target function immediately
```

Вызов происходит позже, когда вызывается returned function.

### `bind()` меняет исходную function?

Нет.

```text
original function
│
└── remains original

bound function
│
└── new function object
```

### Можно ли вызвать bound function много раз?

Да.

Именно поэтому `bind()` полезен:

```text
configure once
│
▼
invoke many times
```

### Чем `bind()` отличается от `call()`?

```text
call()
│
└── invoke immediately

bind()
│
└── create function for later invocation
```

### Чем `bind()` отличается от `apply()`?

`apply()` вызывает function сразу и передает arguments через array или array-like collection.

`bind()` возвращает новую function и откладывает invocation.

---

## Распространенные мифы

### Миф: `bind()` просто устанавливает `this` внутри существующей function

Реальность:

```text
bind()
│
▼
creates new function object
│
▼
with fixed receiver
```

Исходная function остается доступной как раньше.

### Миф: после `bind()` объект выполнения можно легко заменить обычным вызовом

Реальность:

```text
bound function
│
▼
uses receiver selected by bind()
```

В этой главе достаточно помнить: объект выполнения выбран заранее. Продвинутые особенности с constructors будут изучаться позже.

### Миф: `bind()` нужен только для detached functions

Реальность:

Detached function - один полезный сценарий.

Более общая идея:

```text
bind()
│
▼
explicit receiver selection
│
▼
prepared for future calls
```

---

## Типичные ошибки

### Ошибка 1. Ожидать немедленного выполнения

Неправильно:

```javascript
const result = validateStatus.bind(stagingConfig);
console.log(result);
```

Что произошло:

```text
result
│
▼
function object
```

`result` - это function, а не результат выполнения validation.

Исправление:

```javascript
const validateInStaging = validateStatus.bind(stagingConfig);
const result = validateInStaging('/users', 200, 200);
console.log(result);
```

### Ошибка 2. Создавать bound function и не сохранять ее

Неправильно:

```javascript
validateStatus.bind(stagingConfig);
validateStatus('/users', 200, 200);
```

`bind()` вернул новую function, но она потерялась.

Исправление:

```javascript
const validateInStaging = validateStatus.bind(stagingConfig);
validateInStaging('/users', 200, 200);
```

### Ошибка 3. Думать, что `bind()` меняет original function

Неправильная модель:

```text
original function
│
▼
modified by bind()
```

Правильная модель:

```text
original function
│
└── unchanged

bound function
│
└── new function
```

### Ошибка 4. Скрывать намерение

Иногда `bind()` ухудшает читаемость, если объект выполнения нужен только один раз.

```javascript
const once = validateStatus.bind(stagingConfig);
console.log(once('/users', 200, 200));
```

Если invocation одноразовый, `call()` может быть понятнее:

```javascript
console.log(validateStatus.call(stagingConfig, '/users', 200, 200));
```

---

## Практическое использование

`bind()` полезен, когда есть:

```text
same receiver
│
▼
many future calls
```

Типичные случаи:

* заранее настроенный formatter;
* reusable validator;
* helper, привязанный к configuration object;
* function, которую нужно передать дальше без потери объект выполнения;
* подготовленная операция для конкретной среды.

Сравнение:

```text
Need one invocation?
│
└── call() or apply()

Need reusable prepared function?
│
└── bind()
```

Модель читаемости:

```text
Repeated .call(config, ...)
│
▼
receiver noise
│
▼
bind once
│
▼
clear helper name
```

Пример именования:

```javascript
const validateStagingResponse = validateResponse.bind(stagingConfig);
```

Такое имя говорит:

```text
this helper validates staging responses
```

---

## Использование в Automation QA

В Automation QA `bind()` встречается там, где helper должен работать с заранее выбранным context object.

### Reusable validators

```javascript
'use strict';

function validateStatus(path, actualStatus, expectedStatus) {
  return this.environment + ' ' + path + ': ' + (actualStatus === expectedStatus);
}

const staging = {
  environment: 'staging'
};

const validateStagingStatus = validateStatus.bind(staging);
```

Модель:

```text
validateStatus
│
▼
bind(staging)
│
▼
validateStagingStatus
│
▼
used across many tests
```

### Assertion helpers

Helper может использовать configuration:

```text
assert helper
│
├── suite name
├── environment
└── reporting prefix
```

Вместо того чтобы передавать config каждый раз, можно подготовить bound helper.

### API client helpers

API client method может зависеть от `baseUrl`.

```text
client method
│
▼
needs receiver with baseUrl
│
▼
bind(client)
│
▼
safe reusable helper
```

### Page Object helpers

В будущих главах про Automation QA мы будем изучать Page Object подробно. Сейчас достаточно одной идеи:

```text
method uses object state
│
▼
detached usage can lose receiver
│
▼
bind can prepare stable helper
```

### Configuration binding

Для разных окружений можно подготовить разные helpers:

```text
validateResponse
│
├── bind(stagingConfig) -> validateStaging
└── bind(prodConfig)    -> validateProd
```

Это делает тестовый код выразительнее:

```text
validateStaging('/users', 200, 200)
validateProd('/health', 200, 200)
```

---

## Диаграммы главы

### 1. Why bind() exists

```text
Same receiver
│
▼
many future invocations
│
▼
need prepared function
│
▼
bind()
```

### 2. call vs bind

```text
call()
│
├── select receiver
└── invoke now

bind()
│
├── select receiver
└── return new function
```

### 3. apply vs bind

```text
apply()
│
├── receiver
├── array arguments
└── invoke now

bind()
│
├── receiver
└── invoke later
```

### 4. New function creation

```text
original function
│
▼
.bind(receiver)
│
▼
new function object
```

### 5. Receiver fixing

```text
bound function
│
└── fixed receiver -> config
```

### 6. Delayed invocation

```text
bind now
│
▼
store function
│
▼
invoke later
```

### 7. Function factory

```text
function template
│
▼
bind(config)
│
▼
configured function
```

### 8. Текущая модель JavaScript

```text
Functions
│
├── declaration
├── expression
├── arrow
├── parameters
├── return
├── closure
├── this
├── call
├── apply
└── bind
```

### 9. Receiver timeline

```text
bind()
│
▼
receiver selected
│
▼
later call
│
▼
receiver used
```

### 10. Invocation timeline

```text
create bound function
│
▼
wait
│
▼
call bound function
│
▼
execute target
```

### 11. Bound function

```text
bound function
│
├── target function
├── fixed receiver
└── future arguments
```

### 12. Receiver comparison

```text
ordinary call -> receiver from call form
call()        -> receiver from first argument
apply()       -> receiver from first argument
bind()        -> receiver from earlier binding
```

### 13. Execution Context revisit

```text
boundFunction()
│
▼
Function Execution Context
│
└── this from bind()
```

### 14. Типичные ошибки

```text
bind()
│
▼
returns function
│
▼
not result
```

### 15. Читаемость

```text
many .call(config, ...)
│
▼
bind once
│
▼
named helper
```

### 16. QA helper example

```text
validateResponse
│
▼
bind(stagingConfig)
│
▼
validateStagingResponse
```

### 17. Reusable validator

```text
one validator
│
├── /users
├── /orders
└── /profile
```

### 18. Preconfigured helper

```text
helper
│
▼
configuration saved by bind
│
▼
ready helper
```

### 19. Bound объект выполнения

```text
receiver
│
▼
attached to returned function
│
▼
used on invocation
```

### 20. Function identity

```text
bind()
│
├── bound function #1
└── bound function #2

#1 !== #2
```

### 21. Краткая ментальная модель

```text
permanent badge
│
▼
fixed driver
│
▼
saved configuration
```

### 22. Complete bind model

```text
original function
│
▼
bind(receiver)
│
▼
bound function
│
▼
later invocation
│
▼
target function runs with receiver
```

### 23. Переход к object methods

```text
object method
│
▼
function stored in property
│
▼
receiver matters
```

Objects will be studied in more detail in the next section.

### 24. Переход к callbacks

```text
prepared function
│
▼
can be passed somewhere
│
▼
called later
```

Callbacks will be studied later.

### 25. Function lifecycle

```text
declare function
│
▼
bind receiver
│
▼
store bound function
│
▼
invoke bound function
```

### 26. Receiver persistence

```text
selected once
│
▼
available for every future call
```

### 27. One-time configuration

```text
configuration object
│
▼
bind once
│
▼
reuse many times
```

### 28. call/apply/bind comparison

```text
call  -> receiver + separate args + now
apply -> receiver + array args    + now
bind  -> receiver + new function  + later
```

### 29. Complete объект выполнения picture

```text
this
│
├── ordinary invocation
├── call()
├── apply()
└── bind()
```

### 30. Итоговая схема

```text
Need receiver for one call?
│
├── separate args -> call()
└── array args    -> apply()

Need receiver for future calls?
│
└── bind()
```

---

## Практика

Практика находится в:

```text
practice/01-javascript/32-bind.md
```

Рекомендуемый порядок:

```text
1. Ответить на концептуальные вопросы.
2. Предсказать вывод кода.
3. Запустить examples/01-javascript/chapter-32/.
4. Выполнить debugging tasks.
5. Сделать QA mini-project.
6. Свериться с solutions/01-javascript/32-bind.md.
```

---

## Решения

Решения находятся в:

```text
solutions/01-javascript/32-bind.md
```

Не открывайте решения до самостоятельной попытки. В этой теме особенно важно самому различить:

```text
function returned by bind
│
≠
result returned by function execution
```

---

## Итоги

`bind()` завершает цепочку:

```text
this
│
▼
call()
│
▼
apply()
│
▼
bind()
```

Теперь модель объект выполнения стала полной на базовом уровне:

```text
Ordinary invocation
│
└── invocation form chooses receiver

call()
│
└── developer chooses receiver and invokes now

apply()
│
└── developer chooses receiver and passes arguments as array

bind()
│
└── developer chooses receiver and creates function for later
```

Главное отличие `bind()`:

```text
bind() returns a function
```

Он не выполняет исходную function сразу.

---

## Что нужно запомнить

* `bind()` нужен для явного выбора объект выполнения заранее.
* `bind()` создает новую function.
* `bind()` не вызывает исходную function немедленно.
* Bound function можно вызвать позже.
* Receiver в bound function выбран заранее.
* `call()` и `apply()` выполняют invocation сразу.
* `bind()` удобен, когда один объект выполнения нужен для многих будущих вызовов.
* `bind()` не изменяет original function.
* Каждый вызов `bind()` создает новый function object.
* Partial arguments возможны, но в этой главе это только высокоуровневая идея.

---

## Проверьте себя

Ответьте без запуска кода.

1. Что возвращает `bind()`?
2. Выполняет ли `bind()` исходную function сразу?
3. Чем `bind()` отличается от `call()`?
4. Чем `bind()` отличается от `apply()`?
5. Почему два вызова `sameFunction.bind(объект выполнения)` создают разные значения?
6. Когда `bind()` улучшает читаемость?
7. Почему объект выполнения в bound function считается заранее выбранным?
8. Что произойдет, если вызвать `bind()` и не сохранить результат?
9. Как `bind()` может помочь в Automation QA helper?
10. Какая следующая тема логически продолжает этот раздел?
