# apply()

## Связь с предыдущей главой

Предыдущая глава объяснила `call()`.

Главная модель была такой:

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

В `call()` receiver передается первым argument:

```text
functionObject.call(receiver, arg1, arg2)
│
├── receiver -> this
├── arg1     -> first parameter
└── arg2     -> second parameter
```

Теперь появляется следующий вопрос:

> Что делать, если arguments уже лежат в одном array?

Например, function ожидает отдельные parameters:

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}
```

Но данные уже подготовлены как array:

```javascript
const requestParts = ['POST', '/users', '{"name":"Anna"}'];
```

Главный вопрос этой главы:

> Что изменилось по сравнению с `call()`?

Ответ:

```text
Receiver selection
│
└── same as call()

Argument passing
│
└── different
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что `this` - receiver текущего invocation;
* что `call()` позволяет явно выбрать receiver;
* что первый argument `call()` становится `this`;
* что остальные arguments в `call()` передаются в parameters по позиции;
* что array хранит values по порядку;
* что parameters получают values по позиции.

Не требуется знать Spread syntax replacement, `Reflect.apply()`, `bind()`, constructors, classes, `arguments` object internals или proxies. Эти темы будут изучаться позже.

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

`apply()` легко запомнить как "`call()`, но с array". Но для понимания этого мало. Важно увидеть проблему: receiver выбирается так же, а arguments уже лежат в одном ordered argument list.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/30-call.md
```

Текущая глава:

```text
docs/01-javascript/31-apply.md
```

Следующая глава:

```text
docs/01-javascript/32-bind.md
```

Следующая глава ответит:

> Как создать новую function с заранее выбранным receiver?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `apply()`;
* почему `apply()` решает проблему передачи arguments;
* почему receiver selection у `call()` и `apply()` одинаковый;
* как array values попадают в parameters;
* что такое array-like collections на высоком уровне;
* чем `call()` отличается от `apply()`;
* когда `apply()` может быть удобнее `call()`;
* какие ошибки чаще всего встречаются;
* как `apply()` применим в Automation QA;
* почему `bind()` логически продолжает эту тему.

---

## Мотивация

Начнем с проблемы.

Есть function:

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}
```

Она ожидает три отдельных arguments:

```text
formatRequest(method, path, body)
│
├── method
├── path
└── body
```

Но test data уже подготовлены как array:

```javascript
const requestParts = ['POST', '/users', '{"name":"Anna"}'];
```

Packaged arguments:

```text
requestParts
│
├── [0] 'POST'
├── [1] '/users'
└── [2] '{"name":"Anna"}'
```

Через `call()` пришлось бы вручную распаковать values:

```javascript
formatRequest.call(apiClient, requestParts[0], requestParts[1], requestParts[2]);
```

Это работает, но плохо выражает намерение.

Проблема:

```text
Function expects separate arguments
│
▼
Data already exists as one array
│
▼
Need to pass array items as arguments
│
▼
apply()
```

Why apply() exists:

```text
Receiver is still needed
│
▼
Arguments are already in an array
│
▼
Need manual invocation with ordered argument list
│
▼
apply()
```

Центральная мысль:

```text
call()
│
└── arguments separately

apply()
│
└── arguments as one ordered argument list
```

---

## Теория

### Зачем существует apply()

`apply()` существует для вызова function object с явно выбранным receiver и arguments, переданными как array или array-like collection.

```javascript
formatRequest.apply(apiClient, requestParts);
```

Complete apply() model:

```text
functionObject.apply(receiver, argumentsList)
│
├── receiver       -> this
└── argumentsList  -> values for parameters
```

Receiver identical:

```text
call(receiver, ...)
│
└── receiver -> this

apply(receiver, ...)
│
└── receiver -> this
```

Arguments differ:

```text
call(receiver, arg1, arg2, arg3)
│
└── arguments passed separately

apply(receiver, [arg1, arg2, arg3])
│
└── arguments passed as one ordered argument list
```

`apply()` решает не новую проблему receiver.

Он решает проблему формы arguments.

```text
Receiver problem
│
└── already solved by call()

Argument packaging problem
│
└── solved by apply()
```

---

### Receiver selection

Receiver в `apply()` работает так же, как в `call()`.

```javascript
function getBaseUrl() {
  return this.baseUrl;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(getBaseUrl.apply(apiClient));
```

Receiver flow:

```text
getBaseUrl.apply(apiClient)
│
├── getBaseUrl -> function object
└── apiClient  -> this
```

Same receiver:

```text
getBaseUrl.call(apiClient)
│
└── this -> apiClient

getBaseUrl.apply(apiClient)
│
└── this -> apiClient
```

Главный вопрос для receiver:

```text
Who becomes this?
```

Ответ одинаковый:

```text
first argument of call/apply
│
└── receiver
```

---

### Arguments from array

Главное отличие `apply()` - второй argument.

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const requestParts = ['POST', '/users', '{"name":"Anna"}'];

console.log(formatRequest.apply(apiClient, requestParts));
```

Array to parameters:

```text
requestParts
│
├── [0] 'POST'          -> method
├── [1] '/users'        -> path
└── [2] '{"name":"Anna"}' -> body
```

Parameter mapping:

```text
formatRequest.apply(apiClient, requestParts)
│
├── apiClient       -> this
├── requestParts[0] -> method
├── requestParts[1] -> path
└── requestParts[2] -> body
```

Array expansion concept:

```text
One array
│
▼
values are taken by position
│
▼
parameters receive separate values
```

Мы не объясняем Spread syntax заново. В современном JavaScript часто встречаются альтернативные формы передачи array values, но в этой главе важно понять сам механизм `apply()`.

---

### Array-like collections

`apply()` исторически полезен не только с arrays, но и с array-like collections.

На высоком уровне:

```text
Array-like collection
│
├── has indexed values
└── has length
```

Array-like collections:

```text
array-like value
│
├── [0] first value
├── [1] second value
└── length
```

Мы не разбираем `arguments` object internals. Это отдельная тема. Сейчас достаточно понимать:

```text
apply()
│
└── expects an array or array-like ordered argument list
```

---

### call() vs apply()

Сравним на одном примере.

```javascript
function validateRequest(status, path, body) {
  return this.expectedStatus === status &&
    path === this.expectedPath &&
    body !== '';
}
```

Через `call()`:

```javascript
validateRequest.call(config, 200, '/users', '{"name":"Anna"}');
```

Через `apply()`:

```javascript
const requestData = [200, '/users', '{"name":"Anna"}'];

validateRequest.apply(config, requestData);
```

call/apply comparison:

```text
call(config, 200, '/users', body)
│
├── config -> this
└── arguments listed one by one

apply(config, requestData)
│
├── config -> this
└── arguments taken from requestData
```

Different argument passing:

```text
call()
│
└── separate arguments

apply()
│
└── arguments as array or array-like list
```

Receiver identical:

```text
call(config, ...)
│
└── this -> config

apply(config, ...)
│
└── this -> config
```

---

## Внутренний механизм

### Invocation lifecycle

Разберем:

```javascript
formatRequest.apply(apiClient, requestParts);
```

Invocation lifecycle:

```text
1. Read function object: formatRequest
   │
   ▼
2. Read apply method
   │
   ▼
3. Receive first argument: apiClient
   │
   ▼
4. Use apiClient as receiver
   │
   ▼
5. Receive second argument: requestParts
   │
   ▼
6. Take values from requestParts by position
   │
   ▼
7. Start function execution
   │
   ▼
8. Parameters receive extracted values
```

Function execution:

```text
Function Execution Context
│
├── this   -> apiClient
├── method -> requestParts[0]
├── path   -> requestParts[1]
└── body   -> requestParts[2]
```

Receiver flow:

```text
apply(apiClient, requestParts)
│
└── apiClient -> this
```

Arguments flow:

```text
apply(apiClient, requestParts)
│
└── requestParts -> parameters by position
```

---

### Function object

Как и `call()`, `apply()` вызывается у function object.

```text
functionObject.apply(...)
│
└── functionObject is what will execute
```

Function object:

```text
formatRequest
│
└── function object
    │
    └── has apply available
```

Мы не углубляемся в prototype mechanics. Prototype будет изучаться позже. Сейчас важно только:

```text
Function objects
│
└── can be invoked through apply()
```

---

### Timeline

Timeline:

```text
T1  Function object exists
│
T2  Receiver object exists
│
T3  Arguments array exists
│
T4  apply(receiver, argumentsList) is called
│
T5  Receiver becomes this
│
T6  Array values map to parameters
│
T7  Function body executes
│
T8  Function returns result
```

Complete receiver model:

```text
this chapter
│
├── this        -> receiver concept
├── call()      -> manual receiver + separate arguments
└── apply()     -> manual receiver + array/array-like arguments
```

Итоговая схема:

```text
apply(receiver, [a, b, c])
│
├── receiver -> this
├── a        -> first parameter
├── b        -> second parameter
└── c        -> third parameter
```

---

## Ментальная модель

### Tray with prepared items

Представьте, что arguments уже лежат на подносе.

```text
Tray
│
├── method
├── path
└── body
```

`call()` требует передавать items по одному.

```text
call(receiver, method, path, body)
```

`apply()` принимает весь tray.

```text
apply(receiver, tray)
```

Tray model:

```text
Prepared tray
│
▼
apply receives tray
│
▼
function parameters receive items by position
```

---

### Package of arguments

`apply()` можно представить как delivery box.

```text
Delivery box
│
├── item 0
├── item 1
└── item 2
```

Function получает не box целиком в первый parameter, а items из box по positions.

```text
apply(receiver, box)
│
├── box[0] -> parameter 1
├── box[1] -> parameter 2
└── box[2] -> parameter 3
```

Envelope containing arguments:

```text
Envelope
│
└── contains prepared argument list
    │
    ▼
    apply opens it for function call
```

---

### Краткая ментальная модель

```text
call()
│
├── receiver
└── arguments separately

apply()
│
├── receiver
└── arguments as ordered argument list
```

Читаемость:

```text
Use call()
│
└── when arguments are already separate

Use apply()
│
└── when arguments are already in array or array-like list
```

Не нужно превращать `apply()` в механическую замену `call()`. Выбор зависит от формы данных.

---

### Текущая модель JavaScript

```text
Functions
│
├── this
│   └── current receiver
│
├── call()
│   ├── manual receiver
│   └── arguments separately
│
└── apply()
    ├── manual receiver
    └── arguments as array or array-like list
```

Переход к bind():

```text
call()
│
└── invoke immediately with chosen receiver

apply()
│
└── invoke immediately with chosen receiver and array/array-like arguments

bind()
│
└── next chapter: create a new function with chosen receiver
```

---

## Примеры кода

Примеры находятся в папке:

```text
examples/chapter-34/
```

Запуск:

```bash
node examples/chapter-34/01-basic-apply.js
node examples/chapter-34/02-array-arguments.js
node examples/chapter-34/03-call-vs-apply.js
node examples/chapter-34/04-common-mistakes.js
node examples/chapter-34/05-qa-example.js
node examples/chapter-34/06-parameter-mapping.js
```

### Basic apply

```javascript
function getBaseUrl() {
  return this.baseUrl;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(getBaseUrl.apply(apiClient));
```

Receiver:

```text
getBaseUrl.apply(apiClient)
│
└── this -> apiClient
```

---

### Array arguments

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const requestParts = ['POST', '/users', '{"name":"Anna"}'];

console.log(formatRequest.apply(apiClient, requestParts));
```

Parameter mapping:

```text
requestParts[0] -> method
requestParts[1] -> path
requestParts[2] -> body
```

---

### call vs apply

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.call(apiClient, '/users'));
console.log(buildUrl.apply(apiClient, ['/users']));
```

Difference:

```text
call(apiClient, '/users')
│
└── argument separately

apply(apiClient, ['/users'])
│
└── argument inside array
```

---

## Частые вопросы

### apply() решает новую проблему receiver?

Нет. Receiver selection такая же, как у `call()`.

```text
call(receiver, ...)
apply(receiver, ...)
│
└── receiver -> this
```

Разница в arguments.

### apply() устарел?

Нет. В современном JavaScript часто есть альтернативные способы передавать values из array, но `apply()` остается важным механизмом языка и помогает понять Function API.

### apply() передает array как первый parameter?

Нет. Array используется как ordered argument list.

```text
apply(receiver, [a, b])
│
├── a -> first parameter
└── b -> second parameter
```

### Можно ли использовать apply() без arguments?

Да, если function не ожидает arguments или если нужно только явно выбрать receiver.

```javascript
fn.apply(receiver);
```

### Чем apply() отличается от bind()?

`apply()` вызывает function immediately. `bind()` будет изучаться в следующей главе и создаст новую function с выбранным receiver.

---

## Распространенные мифы

### Миф 1. apply() существует только как старая версия Spread

Реальность: `apply()` - самостоятельный механизм manual invocation с receiver и ordered argument list. Современные альтернативы существуют, но они не отменяют полезность модели `apply()`.

### Миф 2. apply() меняет receiver иначе, чем call()

Реальность:

```text
Receiver selection
│
├── call()  -> first argument
└── apply() -> first argument
```

### Миф 3. apply() всегда делает код сложнее

Реальность: если arguments уже лежат в ordered argument list, `apply()` может выражать намерение яснее, чем ручное обращение к indexes.

---

## Типичные ошибки

### Ошибка 1. Передать arguments не array или array-like collection

Неправильный код:

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

buildUrl.apply(apiClient, '/users');
```

Что произошло:

```text
Second argument of apply()
│
└── should be array or array-like ordered argument list
```

Исправленный вариант:

```javascript
buildUrl.apply(apiClient, ['/users']);
```

---

### Ошибка 2. Перепутать receiver и arguments array

```javascript
function validateStatus(response) {
  return response.status === this.expectedStatus;
}

const config = {
  expectedStatus: 200
};

const response = {
  status: 200
};

validateStatus.apply([response], config);
```

Что произошло:

```text
[response] -> this
config     -> expected argument list
```

Исправленный вариант:

```javascript
validateStatus.apply(config, [response]);
```

---

### Ошибка 3. Думать, что apply() сохраняет receiver

```javascript
function getBaseUrl() {
  return this.baseUrl;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

getBaseUrl.apply(apiClient);
getBaseUrl();
```

Первый вызов выбирает receiver.

Второй вызов снова ordinary standalone invocation.

```text
apply()
│
└── one invocation only
```

---

## Практическое использование

`apply()` полезен, когда arguments уже подготовлены как array или array-like ordered argument list.

Практическое использование:

```text
Test data array
│
▼
apply(receiver, values)
│
▼
function receives separate parameters
```

Пример:

```javascript
function validateRequest(status, path, body) {
  return status === this.expectedStatus &&
    path === this.expectedPath &&
    body !== '';
}

const config = {
  expectedStatus: 200,
  expectedPath: '/users'
};

const requestData = [200, '/users', '{"name":"Anna"}'];

console.log(validateRequest.apply(config, requestData));
```

Читаемость:

```text
apply()
│
└── clearer when arguments are already collected

call()
│
└── clearer when arguments are already separate
```

---

## Использование в Automation QA

### Reusable validators

В Automation QA test data часто существует как array.

```javascript
function validateResponse(status, path, body) {
  return status === this.expectedStatus &&
    path === this.expectedPath &&
    body !== '';
}

const assertionConfig = {
  expectedStatus: 200,
  expectedPath: '/users'
};

const responseParts = [200, '/users', '{"name":"Anna"}'];
```

QA helper example:

```text
validateResponse.apply(assertionConfig, responseParts)
│
├── assertionConfig -> this
├── responseParts[0] -> status
├── responseParts[1] -> path
└── responseParts[2] -> body
```

---

### Request builders

Request formatter:

```text
formatRequest.apply(apiClient, requestParts)
│
├── apiClient -> this.baseUrl
└── requestParts -> method, path, body
```

Это полезно, когда data provider уже подготовил array values для helper.

---

### Configuration objects

`apply()` помогает разделить:

```text
Configuration
│
└── receiver / this

Test data array
│
└── ordered argument list
```

Для Automation QA это важно в:

* reusable validators;
* request builders;
* helper functions;
* configuration objects;
* test data arrays.

---

## Практика

Практика находится в файле:

```text
practice/chapter-34.md
```

Выполняйте задания после запуска примеров из `examples/chapter-34/`.

Главный вопрос практики:

```text
What changed compared to call()?
```

---

## Решения

Файл с решениями:

```text
solutions/chapter-34.md
```

В решениях важно отдельно отслеживать:

```text
receiver
│
└── first argument of apply()

parameters
│
└── values from second argument array or array-like list
```

---

## Итоги

`apply()` продолжает тему `call()`.

Receiver selection:

```text
call()
│
└── first argument -> this

apply()
│
└── first argument -> this
```

Difference:

```text
call()
│
└── arguments separately

apply()
│
└── arguments as one ordered argument list
```

Complete apply() model:

```text
functionObject.apply(receiver, argumentsList)
│
├── receiver         -> this
├── argumentsList[0] -> first parameter
├── argumentsList[1] -> second parameter
└── argumentsList[2] -> third parameter
```

Следующая глава про `bind()` ответит:

> Как создать новую function с заранее выбранным receiver?

---

## Что нужно запомнить

* `apply()` вызывает function immediately.
* Первый argument `apply()` становится `this`.
* Второй argument `apply()` содержит array или array-like ordered argument list.
* Receiver selection у `call()` и `apply()` одинаковый.
* Главное отличие - способ передачи arguments.
* `apply()` удобен, когда arguments уже собраны в array или array-like collection.
* `bind()` будет изучаться дальше и решит другую задачу: создать новую function с выбранным receiver.

Краткая ментальная модель:

```text
apply()
│
├── manual receiver
├── immediate invocation
└── ordered argument list
```

---

## Проверьте себя

Ответьте без запуска кода:

1. Что общего у `call()` и `apply()`?
2. Что отличается у `call()` и `apply()`?
3. Что становится `this` в `fn.apply(config, values)`?
4. Откуда берутся normal parameters при `apply()`?
5. Когда `apply()` удобнее `call()`?
6. Почему `bind()` логически следует после `apply()`?
