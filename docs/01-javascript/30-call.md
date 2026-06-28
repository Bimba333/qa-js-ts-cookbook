# call()

## Связь с предыдущей главой

Предыдущая глава объяснила `this`.

Главная модель была такой:

```text
Ordinary invocation
│
▼
invocation form selects receiver
│
▼
this is set for this call
```

Для обычного вызова `object.method()` объект выполнения обычно выбирается из формы вызова.

```text
apiClient.buildUrl('/users')
│
└── receiver -> apiClient
```

Но detached function теряет объект выполнения:

```javascript
'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};

const buildUrl = apiClient.buildUrl;

buildUrl('/users');
```

Здесь вызов идет как standalone function:

```text
buildUrl('/users')
│
└── receiver: none
```

Теперь появляется следующий вопрос:

> Можно ли выбрать объект выполнения вручную?

Да. Для этого существует `call()`.

Главный вопрос главы:

> Кто выбирает объект выполнения теперь?

---

## Предварительные требования

Для этой главы нужно понимать:

* что function object можно хранить в переменной;
* что object может хранить methods;
* что `this` определяется во время invocation;
* что обычный вызов `object.method()` выбирает объект выполнения из формы вызова;
* что detached function теряет объект выполнения;
* что parameters получают arguments по позиции;
* что `return` отправляет результат из функции.

Не требуется знать `apply()`, `bind()`, constructors, classes, `Reflect.apply()`, decorators или proxies. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            120-150 минут
Разбор схем:             45-65 минут
Запуск примеров:         20-30 минут
Практика:                100-130 минут
Повторение материала:    25 минут
```

Уровень сложности: **L4**.

`call()` выглядит как небольшой method, но концептуально это важный поворот: объект выполнения выбирает не форма обычного вызова, а разработчик.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/29-this.md
```

Текущая глава:

```text
docs/01-javascript/30-call.md
```

Следующая глава:

```text
docs/01-javascript/31-apply.md
```

Следующая глава ответит:

> Как передать arguments в ручной invocation, если они уже лежат в array?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `call()`;
* что такое manual объект выполнения selection;
* как `call(объект выполнения)` выбирает `this`;
* как передавать arguments через `call()`;
* как `call()` заменяет ordinary invocation;
* как `call()` помогает в ситуации с detached function;
* как один function object использовать с разными объект выполненияs;
* какие ошибки чаще всего встречаются;
* когда `call()` улучшает читаемость;
* как `call()` может применяться в Automation QA.

---

## Мотивация

Начнем с проблемы, где необходимость явного выбора объект выполнения видна особенно хорошо.

Есть helper object:

```javascript
'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};
```

Обычный method call работает:

```javascript
apiClient.buildUrl('/users');
```

```text
apiClient.buildUrl('/users')
│
└── this -> apiClient
```

Но если method detached:

```javascript
const buildUrl = apiClient.buildUrl;
```

то обычный вызов теряет объект выполнения:

```javascript
buildUrl('/users');
```

Detached function:

```text
apiClient.buildUrl
│
▼
function object assigned to buildUrl
│
▼
buildUrl('/users')
│
▼
receiver: none
```

Потерянный объект выполнения:

```text
Function object still exists
│
▼
but call expression has no object receiver
│
▼
this is undefined in strict mode
```

Вопрос:

> Если ordinary invocation не выбрала объект выполнения, можем ли мы выбрать его сами?

`call()` отвечает:

```text
yes
```

Явный выбор объекта выполнения:

```text
Ordinary invocation
│
└── JavaScript chooses receiver from call form

call()
│
└── developer passes receiver explicitly
```

---

## Теория

### Зачем существует call()

`call()` существует для ручного вызова function object с явно указанным объект выполнения.

Обычный вызов:

```javascript
apiClient.buildUrl('/users');
```

Receiver выбирается из обычной формы вызова:

```text
apiClient.buildUrl('/users')
│
└── receiver: apiClient
```

Вызов через `call()`:

```javascript
buildUrl.call(apiClient, '/users');
```

Receiver выбирает разработчик:

```text
buildUrl.call(apiClient, '/users')
│
├── function object: buildUrl
├── receiver: apiClient
└── argument: '/users'
```

Зачем существует `call()`:

```text
Function object exists
│
▼
ordinary invocation is not enough
│
▼
developer needs to choose receiver
│
▼
call()
```

Центральная модель:

```text
Ordinary invocation
│
▼
JavaScript chooses receiver

call()
│
▼
Developer chooses receiver
```

---

### call(объект выполнения)

Минимальная форма:

```javascript
function printBaseUrl() {
  console.log(this.baseUrl);
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

printBaseUrl.call(apiClient);
```

call() syntax:

```text
functionObject.call(receiver)
│
├── functionObject -> what to execute
└── receiver       -> what this should be
```

Manual invocation:

```text
printBaseUrl.call(apiClient)
│
├── execute printBaseUrl
└── inside function this -> apiClient
```

Receiver replacement:

```text
Without call
│
└── printBaseUrl()
    │
    └── receiver: none

With call
│
└── printBaseUrl.call(apiClient)
    │
    └── receiver: apiClient
```

Главный вопрос:

> Кто выбирает объект выполнения теперь?

Ответ:

```text
developer
```

---

### Passing arguments

`call()` выбирает объект выполнения первым argument.

Остальные arguments передаются в вызываемую function.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.call(apiClient, '/users'));
```

Передача аргументов:

```text
buildUrl.call(apiClient, '/users')
│
├── apiClient -> this
└── '/users'  -> path
```

Если parameters несколько:

```javascript
function formatRequest(method, path) {
  return method + ' ' + this.baseUrl + path;
}

const usersApi = {
  baseUrl: 'https://api.example.test'
};

console.log(formatRequest.call(usersApi, 'GET', '/users'));
```

Arguments поток:

```text
formatRequest.call(usersApi, 'GET', '/users')
│
├── usersApi -> this
├── 'GET'    -> method
└── '/users' -> path
```

Важно:

```text
First call argument
│
└── receiver for this

Remaining call arguments
│
└── normal function arguments
```

---

### Replacing ordinary invocation

`call()` может выразить тот же объект выполнения, что и обычный method call.

```javascript
apiClient.buildUrl('/users');
```

Можно записать так:

```javascript
apiClient.buildUrl.call(apiClient, '/users');
```

Invocation comparison:

```text
apiClient.buildUrl('/users')
│
├── JavaScript chooses receiver from ordinary method call
└── this -> apiClient

apiClient.buildUrl.call(apiClient, '/users')
│
├── developer passes receiver explicitly
└── this -> apiClient
```

Before call():

```text
object.method(argument)
│
├── receiver from method call
└── argument passed normally
```

After call():

```text
method.call(object, argument)
│
├── receiver passed explicitly
└── argument passed after receiver
```

Это не значит, что обычные method calls нужно заменять на `call()`. Обычно `object.method()` читается лучше.

`call()` нужен, когда объект выполнения нужно выбрать явно.

---

### Detached functions

Detached function - один из самых понятных случаев, где `call()` оказывается полезен.

Но важно не сужать модель:

```text
call()
│
└── general mechanism for explicit receiver selection

detached function
│
└── one practical case where this helps
```

```javascript
'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};

const buildUrl = apiClient.buildUrl;

console.log(buildUrl.call(apiClient, '/users'));
```

Явный выбор объекта выполнения:

```text
Detached function
│
└── buildUrl
    │
    └── receiver lost in ordinary call

Manual receiver selection
│
└── buildUrl.call(apiClient, '/users')
    │
    └── receiver selected explicitly
```

Receiver поток:

```text
buildUrl
│
└── function object
    │
    ▼
call(apiClient, '/users')
│
├── this -> apiClient
└── path -> '/users'
```

`call()` не приклеивает объект выполнения к функции навсегда.

```text
call()
│
└── chooses receiver for one invocation
```

Следующий вызов может выбрать другой объект выполнения.

---

### Same function, different объект выполнения

Один function object можно вызвать с разными объект выполненияs.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const usersApi = {
  baseUrl: 'https://users.example.test'
};

const ordersApi = {
  baseUrl: 'https://orders.example.test'
};

console.log(buildUrl.call(usersApi, '/list'));
console.log(buildUrl.call(ordersApi, '/list'));
```

Same function, different объект выполнения:

```text
buildUrl.call(usersApi, '/list')
│
└── this -> usersApi

buildUrl.call(ordersApi, '/list')
│
└── this -> ordersApi
```

Объект функции:

```text
buildUrl function object
│
├── can be called with usersApi
└── can be called with ordersApi
```

Это особенно полезно, когда поведение общий, а configuration хранится в разных objects.

---

## Внутренний механизм

### Что происходит при call()

В обычном method call объект выполнения выбирается из формы invocation, которую мы изучали в предыдущей главе.

```text
apiClient.buildUrl('/users')
│
└── ordinary method call selects apiClient
```

При `call()` объект выполнения передается явно.

```text
buildUrl.call(apiClient, '/users')
│
└── call receives apiClient as manual receiver
```

call lifecycle:

```text
1. Read function object
   │
   ▼
2. Read call method from function object
   │
   ▼
3. Pass receiver as first argument
   │
   ▼
4. Pass normal arguments after receiver
   │
   ▼
5. Execute original function
   │
   ▼
6. Inside original function this -> receiver
```

Execution Context revisit:

```text
buildUrl.call(apiClient, '/users')
│
▼
Function Execution Context for buildUrl
│
├── this -> apiClient
└── path -> '/users'
```

`call()` не меняет function body.

```text
function body
│
└── still says this.baseUrl + path

call()
│
└── decides what this is for this invocation
```

---

### call() vs ordinary invocation

call vs ordinary invocation:

```text
Ordinary invocation
│
├── object.method(value)
│
├── receiver selected by ordinary call form
│
└── arguments passed inside parentheses

call()
│
├── method.call(receiver, value)
│
├── receiver passed manually
│
└── arguments passed after receiver
```

Выбор объекта выполнения:

```text
object.method()
│
└── receiver comes from ordinary method call

function.call(receiver)
│
└── receiver comes from developer
```

Явный выбор объекта выполнения:

```text
Developer
│
▼
chooses object
│
▼
passes object into call()
│
▼
function executes with this object as this
```

Именно поэтому вопрос главы звучит так:

> Кто выбирает объект выполнения теперь?

---

### Timeline

Временная шкала:

```text
T1  Function object exists
│
T2  Function may be stored in object
│
T3  Function may become detached
│
T4  Developer calls functionObject.call(receiver)
│
T5  call() receives receiver
│
T6  original function starts execution
│
T7  this inside original function points to receiver
│
T8  function returns result
```

Manual invocation временная шкала:

```text
detached function
│
▼
call(receiver)
│
▼
receiver selected manually
│
▼
body executes
│
▼
result returned
```

Полная модель call():

```text
Function object
│
▼
.call(receiver, arg1, arg2)
│
▼
receiver becomes this
│
▼
arg1, arg2 become normal arguments
│
▼
function body executes
```

---

## Ментальная модель

### Ручное управление

Обычный вызов похож на автоматический выбор объект выполнения.

```text
object.method()
│
└── JavaScript reads ordinary call form
    │
    └── selects receiver
```

`call()` похож на manual steering.

```text
function.call(receiver)
│
└── developer manually steers this
```

Manual steering:

```text
Steering wheel
│
└── developer chooses direction

call()
│
└── developer chooses receiver
```

---

### Remote control

Представьте function object как устройство, а объект выполнения как выбранный target.

```text
Remote control
│
├── function to run
└── target object
```

`call()` говорит:

```text
Run this function
│
▼
as if this object is the current receiver
```

Remote control model:

```text
functionObject.call(receiver)
│
├── functionObject -> command
└── receiver       -> target
```

---

### Selecting a speaker

В главе про `this` была модель current speaker.

`call()` выбирает speaker вручную.

```text
printName.call(user)
│
└── speaker: user

printName.call(admin)
│
└── speaker: admin
```

Choosing an actor:

```text
Same script
│
└── different actor
    │
    └── different this
```

Function body - это script.

Receiver - это actor, который исполняет script в данном вызове.

---

### Краткая ментальная модель

```text
call()
│
├── does not create a new function
├── does not permanently bind receiver
├── invokes function immediately
└── sets this for this one invocation
```

Итоговая схема:

```text
function object
│
▼
call(receiver, ...arguments)
│
▼
this -> receiver
│
▼
parameters receive arguments
│
▼
function executes
```

---

### Текущее место в модели JavaScript

```text
Functions
│
├── Function Declaration
├── Function Expression
├── Arrow Functions
├── Parameters
├── Return
├── Rest
├── Spread
├── Closures
├── this
└── call()
    └── manual receiver selection
```

Переход к apply():

```text
call()
│
└── receiver + arguments one by one

apply()
│
└── receiver + arguments as array-like collection
```

`apply()` решает похожую задачу, но с другой формой передачи arguments. Подробности будут в следующей главе.

---

## Примеры кода

Примеры находятся в папке:

```text
examples/01-javascript/chapter-30/
```

Запуск:

```bash
node examples/01-javascript/chapter-30/01-basic-call.js
node examples/01-javascript/chapter-30/02-detached-method.js
node examples/01-javascript/chapter-30/03-call-with-arguments.js
node examples/01-javascript/chapter-30/04-reusing-methods.js
node examples/01-javascript/chapter-30/05-common-mistakes.js
node examples/01-javascript/chapter-30/06-qa-example.js
```

### Basic call

```javascript
function printBaseUrl() {
  console.log(this.baseUrl);
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

printBaseUrl.call(apiClient);
```

Что происходит:

```text
printBaseUrl.call(apiClient)
│
├── receiver: apiClient
└── this.baseUrl -> apiClient.baseUrl
```

---

### Detached method

```javascript
'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};

const buildUrl = apiClient.buildUrl;

console.log(buildUrl.call(apiClient, '/users'));
```

Явный выбор объекта выполнения:

```text
buildUrl
│
└── detached function object

buildUrl.call(apiClient, '/users')
│
└── receiver selected manually
```

---

### call with arguments

```javascript
function formatRequest(method, path) {
  return method + ' ' + this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(formatRequest.call(apiClient, 'GET', '/users'));
```

Передача аргументов:

```text
formatRequest.call(apiClient, 'GET', '/users')
│
├── apiClient -> this
├── 'GET'    -> method
└── '/users' -> path
```

---

## Частые вопросы

### call() создает новую функцию?

Нет. `call()` сразу вызывает existing function object.

```text
call()
│
└── invokes immediately
```

`bind()` будет изучаться позже. Он решает связанную, но другую задачу.

### call() меняет this навсегда?

Нет. `call()` выбирает объект выполнения только для одного invocation.

```text
first call()
│
└── receiver A

second call()
│
└── receiver B
```

### Первый argument call() становится обычным parameter?

Нет. Первый argument `call()` становится `this`.

Обычные parameters получают arguments, которые идут после объект выполнения.

### Нужно ли заменять все method calls на call()?

Нет. Если обычный `object.method()` читается ясно, он обычно лучше. `call()` нужен, когда объект выполнения надо выбрать явно.

### Чем call() отличается от apply()?

Обе темы связаны с ручным объект выполнения. В этой главе изучается `call()`, где arguments передаются по одному. `apply()` будет изучаться в следующей главе.

---

## Распространенные мифы

### Миф 1. call() нужен только для исправления ошибок

Реальность: `call()` является общим механизмом явного выбора объект выполнения. Detached function - один из случаев, где этот механизм особенно заметен.

### Миф 2. call() permanently привязывает this

Реальность:

```text
call()
│
└── one invocation only
```

Постоянное связывание объект выполнения будет изучаться позже в главе `bind()`.

### Миф 3. call() и apply() - одно и то же

Реальность: они решают похожие задачи, но отличаются способом передачи arguments. Подробно `apply()` будет изучен в следующей главе.

---

## Типичные ошибки

### Ошибка 1. Забыть первый argument объект выполнения

Неправильный код:

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

buildUrl.call('/users');
```

Что произошло:

```text
buildUrl.call('/users')
│
└── '/users' becomes this
```

Почему это произошло:

```text
first argument of call()
│
└── receiver
```

Исправленный вариант:

```javascript
buildUrl.call(apiClient, '/users');
```

---

### Ошибка 2. Думать, что call() сохраняет объект выполнения навсегда

```javascript
function getBaseUrl() {
  return this.baseUrl;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

getBaseUrl.call(apiClient);
getBaseUrl();
```

Первый вызов выбирает объект выполнения manually.

Второй вызов снова standalone.

```text
getBaseUrl.call(apiClient)
│
└── this -> apiClient

getBaseUrl()
│
└── receiver: none
```

---

### Ошибка 3. Путать объект выполнения и normal arguments

```javascript
function validateStatus(response) {
  return response.status === this.expectedStatus;
}

const assertionConfig = {
  expectedStatus: 200
};

const response = {
  status: 200
};

validateStatus.call(response, assertionConfig);
```

Что произошло:

```text
response -> this
assertionConfig -> response parameter
```

Исправленный вариант:

```javascript
validateStatus.call(assertionConfig, response);
```

Типичные ошибки:

```text
call(receiver, arg1)
│
├── receiver -> this
└── arg1     -> first parameter
```

---

## Практическое использование

`call()` полезен, когда function object уже есть, но объект выполнения нужно выбрать явно.

Практическое использование:

```text
shared function
│
▼
different configuration objects
│
▼
call(configObject, data)
│
▼
same behavior, different receiver
```

Пример:

```javascript
function validateStatus(response) {
  return response.status === this.expectedStatus;
}

const okAssertion = {
  expectedStatus: 200
};

const createdAssertion = {
  expectedStatus: 201
};

console.log(validateStatus.call(okAssertion, { status: 200 }));
console.log(validateStatus.call(createdAssertion, { status: 200 }));
```

Читаемость:

```text
Use call()
│
└── when manual receiver is the main idea

Avoid call()
│
└── when ordinary method call is clearer
```

`call()` должен улучшать понимание механизма, а не превращать код в головоломку.

---

## Использование в Automation QA

### Reusable assertion helpers

Один validator можно использовать с разными assertion configs.

```javascript
function statusMatches(response) {
  return response.status === this.expectedStatus;
}

const okConfig = {
  expectedStatus: 200
};

const serverErrorConfig = {
  expectedStatus: 500
};
```

Пример QA-helper:

```text
statusMatches.call(okConfig, response)
│
├── this -> okConfig
└── response -> response

statusMatches.call(serverErrorConfig, response)
│
├── this -> serverErrorConfig
└── response -> response
```

---

### API client methods

Если API client method оказался detached, `call()` позволяет явно выбрать нужный config object как объект выполнения.

```text
buildUrl.call(stagingClient, '/users')
│
└── this.baseUrl -> stagingClient.baseUrl
```

Это полезно для понимания механизма, хотя в обычном production-коде чаще читается прямой method call:

```text
stagingClient.buildUrl('/users')
```

---

### Helper reuse

`call()` может помочь переиспользовать общий helper с разными configuration objects.

```text
shared validator
│
├── config A via call()
└── config B via call()
```

Для Automation QA это может встречаться в:

* reusable assertion helpers;
* API client utilities;
* configuration objects;
* shared validators;
* debugging detached methods.

При этом главное назначение `call()` шире:

```text
call()
│
└── explicit receiver selection
    │
    ├── detached methods
    ├── shared validators
    └── reusable helper functions
```

Важно: не строить всю архитектуру вокруг `call()` без причины. В большинстве случаев ясные objects и methods читаются лучше.

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/30-call.md
```

Выполняйте задания после запуска примеров из `examples/01-javascript/chapter-30/`.

Главный вопрос практики:

```text
Who chooses the receiver?
```

---

## Решения

Файл с решениями:

```text
solutions/01-javascript/30-call.md
```

В решениях важно смотреть не только на результат, но и на объект выполнения поток:

```text
call(receiver, arg1, arg2)
│
├── receiver -> this
├── arg1     -> first parameter
└── arg2     -> second parameter
```

---

## Итоги

`call()` вводит ручной выбор объект выполнения.

Итоговая модель:

```text
Ordinary invocation
│
▼
JavaScript chooses receiver from ordinary invocation form

call()
│
▼
Developer chooses receiver explicitly
```

Полная модель call():

```text
functionObject.call(receiver, arg1, arg2)
│
├── functionObject -> function to execute
├── receiver       -> this
├── arg1           -> first parameter
└── arg2           -> second parameter
```

`call()` вызывает function immediately и выбирает объект выполнения только для этого invocation.

Следующая глава про `apply()` покажет похожую идею, но arguments будут передаваться иначе.

---

## Что нужно запомнить

* `call()` вызывает function object immediately.
* Первый argument `call()` становится `this`.
* Остальные arguments передаются в function parameters.
* `call()` выбирает объект выполнения только для одного invocation.
* `call()` помогает в ситуации с detached function, но не сводится к ней.
* `call()` не заменяет обычные method calls там, где `object.method()` читается лучше.
* `apply()` будет изучаться в следующей главе и продолжит тему manual объект выполнения selection.

Краткая ментальная модель:

```text
call()
│
├── manual receiver
├── immediate invocation
└── arguments one by one
```

---

## Проверьте себя

Ответьте без запуска кода:

1. Кто выбирает объект выполнения при ordinary invocation?
2. Кто выбирает объект выполнения при `call()`?
3. Что становится `this` в `buildUrl.call(apiClient, '/users')`?
4. Что получает parameter `path` в `buildUrl.call(apiClient, '/users')`?
5. Почему `call()` не сохраняет объект выполнения навсегда?
6. Почему `apply()` логически продолжает эту тему?
