# Решения: call()

## Проверка понимания

### 1. Зачем существует call()?

Ответ: `call()` нужен, чтобы вызвать function object и вручную выбрать receiver для `this`.

Рассуждение: ordinary invocation выбирает receiver из формы вызова. `call()` позволяет передать receiver явно первым argument.

Типичная ошибка: думать, что `call()` создает новую функцию.

Automation QA связь: `call()` помогает явно выбирать config object для reusable validators; detached helper methods - только один из случаев, где это полезно.

---

### 2. Кто выбирает receiver при ordinary invocation?

Ответ: JavaScript выбирает receiver по ordinary invocation form, изученной в главе про `this`.

Рассуждение:

```text
object.method()
│
└── receiver comes from ordinary method call
```

Типичная ошибка: считать это универсальным правилом для всех форм вызова.

Automation QA связь: page object methods обычно вызываются как `pageObject.method()`.

---

### 3. Кто выбирает receiver при call()?

Ответ: разработчик.

Рассуждение:

```text
functionObject.call(receiver)
│
└── receiver passed manually
```

Типичная ошибка: ждать, что receiver будет взят из object, где function была создана.

Automation QA связь: можно вызвать общий validator с разными config objects.

---

### 4. Что означает первый argument в call()?

Ответ: первый argument становится `this` внутри вызываемой function.

Рассуждение:

```text
validate.call(config, response)
│
├── config   -> this
└── response -> first parameter
```

Типичная ошибка: передать обычный function argument первым и случайно сделать его receiver.

Automation QA связь: особенно важно не путать config object и response object.

---

### 5. Куда попадают arguments после receiver?

Ответ: они передаются в parameters вызываемой function по позиции.

Рассуждение:

```text
format.call(client, 'GET', '/users')
│
├── client   -> this
├── 'GET'    -> method
└── '/users' -> path
```

Типичная ошибка: думать, что все arguments `call()` становятся parameters.

Automation QA связь: так можно передавать response, path, method и другие test data.

---

### 6. Почему call() не привязывает receiver навсегда?

Ответ: `call()` выбирает receiver только для одного invocation.

Рассуждение: следующий вызов той же function может быть ordinary invocation, another `call()` или standalone call.

Типичная ошибка: вызвать `fn.call(object)` один раз и ожидать, что `fn()` дальше будет использовать тот же object.

Automation QA связь: если нужен устойчиво привязанный helper, следующая тема `bind()` будет важнее.

---

### 7. Чем call() отличается от object.method()?

Ответ: в ordinary `object.method()` receiver выбирается из формы вызова. В `call()` receiver передается явно.

Рассуждение:

```text
object.method(value)
│
└── JavaScript chooses receiver from ordinary call form

method.call(object, value)
│
└── developer chooses receiver
```

Типичная ошибка: заменять все method calls на `call()` без причины.

Automation QA связь: обычный method call часто лучше читается в page objects и API clients.

---

### 8. Почему apply() продолжает тему call()?

Ответ: `apply()` тоже связан с ручным выбором receiver, но передает arguments другой формой.

Рассуждение: `call()` передает arguments по одному. `apply()` будет изучаться дальше и покажет, что делать, если arguments уже собраны в collection.

Типичная ошибка: пытаться подробно объяснить `apply()` до понимания `call()`.

Automation QA связь: массивы test data часто возникают в automation code, поэтому `apply()` будет естественным продолжением.

---

## Анализ кода

### Задание 1

Ответ:

```text
users-api
```

Receiver выбирает разработчик через `call(service)`.

`this` становится `service`.

Рассуждение:

```text
printServiceName.call(service)
│
├── service -> this
└── no normal arguments
```

Типичная ошибка: думать, что `service` станет parameter. У функции нет parameters, а `service` становится `this`.

Automation QA связь: похожим образом можно вызывать shared helper с конкретным config object.

---

### Задание 2

Ответ:

```text
https://api.example.test/users
```

`this` становится `apiClient`.

`path` получает `'/users'`.

Рассуждение:

```text
buildUrl.call(apiClient, '/users')
│
├── apiClient -> this
└── '/users'  -> path
```

Типичная ошибка: забыть, что normal arguments начинаются после receiver.

Automation QA связь: это типичный URL builder для API tests.

---

## Перепишите ordinary invocation через call()

### Задание 3

Решение:

```javascript
apiClient.buildUrl.call(apiClient, '/orders');
```

Рассуждение: function object находится в `apiClient.buildUrl`, а receiver передается первым argument в `call()`.

Типичная ошибка: написать `apiClient.buildUrl.call('/orders')`, сделав `'/orders'` receiver.

Automation QA связь: такой rewrite полезен для понимания, но в реальном коде `apiClient.buildUrl('/orders')` обычно читается лучше.

---

### Задание 4

Решение:

```javascript
assertions.statusMatches.call(assertions, response);
```

Рассуждение:

```text
assertions -> this
response   -> response parameter
```

Типичная ошибка: поменять местами `assertions` и `response`.

Automation QA связь: assertion helper получает config через `this`, а проверяемый response как обычный argument.

---

## Предскажите результат выполнения кода

### Задание 5

Ответ:

```text
200
201
```

Рассуждение: каждый `call()` выбирает receiver для одного invocation.

```text
getExpectedStatus.call(okConfig)
│
└── this -> okConfig

getExpectedStatus.call(createdConfig)
│
└── this -> createdConfig
```

Типичная ошибка: думать, что первый `call()` навсегда меняет function.

Automation QA связь: один helper можно вызывать с разными expected configs.

---

### Задание 6

Ответ:

```text
POST https://api.example.test/orders
```

Рассуждение:

```text
formatRequest.call(apiClient, 'POST', '/orders')
│
├── apiClient -> this
├── 'POST'    -> method
└── '/orders' -> path
```

Типичная ошибка: забыть, что receiver не передается в `method`.

Automation QA связь: request formatters могут использовать client configuration через `this`.

---

### Задание 7

Ответ:

```text
true
```

Рассуждение:

```text
validateStatus.call(response, config)
│
├── response -> this
└── config   -> response parameter
```

Внутри:

```text
response.status === this.expectedStatus
│
├── response parameter is config
│   └── config.status is undefined
│
└── this is original response
    └── response.expectedStatus is undefined
```

Обе стороны сравнения становятся `undefined`, поэтому результат неожиданно оказывается `true`.

Именно поэтому код опасен: wrong objects are in the wrong roles, но проверка случайно проходит.

Correct version:

```javascript
console.log(validateStatus.call(config, response));
```

Результат corrected version:

```text
true
```

Типичная ошибка: поменять receiver и data argument местами.

Automation QA связь: в тестах такая ошибка может дать ложноположительный результат, если object shapes случайно совпали.

---

## Кто выбирает receiver?

### Задание 8

Ответ:

```text
apiClient.buildUrl('/users')
│
├── receiver selected by ordinary method call
├── this -> apiClient
└── path -> '/users'

buildUrl.call(apiClient, '/orders')
│
├── receiver selected by developer
├── this -> apiClient
└── path -> '/orders'
```

Рассуждение: первый вызов использует ordinary invocation. Второй вызов использует manual receiver selection.

Типичная ошибка: не различать механизм выбора receiver, если результат одинаковый.

Automation QA связь: понимание разницы важно при явном выборе config object и при отладке detached methods.

---

## Отладка

### Задание 9

Решение:

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.call(apiClient, '/users'));
```

Результат:

```text
https://api.example.test/users
```

Рассуждение: `apiClient` должен быть receiver, а `'/users'` должен быть normal argument.

Типичная ошибка: забыть первый receiver argument.

Automation QA связь: это частая ошибка в reusable API helper functions.

---

### Задание 10

Решение:

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

console.log(validateStatus.call(config, response));
```

Результат:

```text
true
```

Рассуждение:

```text
config   -> this
response -> response parameter
```

Типичная ошибка: ставить data object на место receiver.

Automation QA связь: config и actual response должны играть разные роли.

---

## QA-задачи

### Задание 11

Решение:

```javascript
function statusMatches(response) {
  return response.status === this.expectedStatus;
}

const okConfig = {
  expectedStatus: 200
};

const createdConfig = {
  expectedStatus: 201
};

const response = {
  status: 200
};

console.log(statusMatches.call(okConfig, response));
console.log(statusMatches.call(createdConfig, response));
```

Результат:

```text
true
false
```

Рассуждение: один function object вызывается с двумя receivers.

Типичная ошибка: создавать две одинаковые functions вместо одной reusable function.

Automation QA связь: удобно для shared assertion helpers.

---

### Задание 12

Решение:

```javascript
function buildApiUrl(path) {
  return this.baseUrl + path;
}

const usersApi = {
  baseUrl: 'https://users.example.test'
};

const ordersApi = {
  baseUrl: 'https://orders.example.test'
};

console.log(buildApiUrl.call(usersApi, '/list'));
console.log(buildApiUrl.call(ordersApi, '/list'));
```

Результат:

```text
https://users.example.test/list
https://orders.example.test/list
```

Рассуждение: `call()` выбирает different receiver for each invocation.

Типичная ошибка: ожидать, что function remembers previous receiver.

Automation QA связь: один URL builder может работать с разными API configs.

---

## Мини-проект

### Задание 13

Решение:

```javascript
function formatRequest(method, path) {
  return method + ' ' + this.baseUrl + path;
}

function statusMatches(response) {
  return response.status === this.expectedStatus;
}

const usersApiConfig = {
  baseUrl: 'https://users.example.test'
};

const ordersApiConfig = {
  baseUrl: 'https://orders.example.test'
};

const okAssertionConfig = {
  expectedStatus: 200
};

const response = {
  status: 200
};

console.log(formatRequest.call(usersApiConfig, 'GET', '/users'));
console.log(formatRequest.call(ordersApiConfig, 'POST', '/orders'));
console.log(statusMatches.call(okAssertionConfig, response));
```

Результат:

```text
GET https://users.example.test/users
POST https://orders.example.test/orders
true
```

Схема:

```text
formatRequest.call(usersApiConfig, 'GET', '/users')
│
├── usersApiConfig -> this
├── 'GET'          -> method
└── '/users'       -> path

statusMatches.call(okAssertionConfig, response)
│
├── okAssertionConfig -> this
└── response          -> response parameter
```

Рассуждение: `call()` подходит, потому что function behavior общий, а receiver configuration меняется.

Где ordinary method call читается лучше:

```javascript
usersApiConfig.formatRequest('/users');
```

если function действительно является частью object API.

Почему `call()` не сохраняет receiver навсегда: каждый invocation выбирает receiver отдельно.

Типичная ошибка: использовать `call()` там, где обычный object method сделал бы код проще.

Automation QA связь: pattern полезен для понимания shared validators, но в framework architecture часто лучше выбирать более читаемую структуру helpers.

Возможное улучшение: после главы `apply()` можно будет передавать список arguments из array-like структуры.
