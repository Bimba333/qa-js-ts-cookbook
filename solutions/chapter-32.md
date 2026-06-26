# Решения: this

## Проверка понимания

### 1. Зачем существует this?

Ответ: `this` нужен, чтобы функция могла работать с current receiver, то есть с object, для которого она вызвана.

Рассуждение: один function object может быть method разных objects. `this` позволяет function body обращаться к receiver текущего вызова.

Типичная ошибка: считать, что `this` навсегда привязан к object, где функция была создана.

Automation QA связь: Page Object methods и API client methods часто используют `this.page`, `this.baseUrl`, `this.expectedStatus`.

---

### 2. Что такое execution receiver?

Ответ: execution receiver - это object, для которого выполняется function call.

Рассуждение:

```text
apiClient.buildUrl('/users')
│
└── receiver: apiClient
```

Типичная ошибка: путать receiver с function object.

Automation QA связь: если `apiClient.buildUrl()` вызывается как method, `this` внутри method указывает на `apiClient`.

---

### 3. Когда определяется this?

Ответ: `this` определяется при invocation.

Рассуждение:

```text
Function creation
│
└── creates function object

Function invocation
│
└── determines this
```

Типичная ошибка: искать `this` по месту объявления функции.

Automation QA связь: method может сломаться, если передать ее как отдельную функцию и потерять receiver.

---

### 4. Почему this не ищется через Scope Chain?

Ответ: `this` связан с current function invocation, а не с ordinary identifier lookup.

Рассуждение: обычные identifiers ищутся через Lexical Environment. `this` определяется формой вызова.

Типичная ошибка: думать, что `this` работает как variable из Closure.

Automation QA связь: это помогает различать configuration, captured через Closure, и state object, доступный через `this`.

---

### 5. Чем method invocation отличается от global invocation?

Ответ: method invocation имеет receiver, global invocation вызывается без object receiver.

Рассуждение:

```text
object.method()
│
└── receiver: object

functionName()
│
└── receiver: none
```

Типичная ошибка: ожидать, что standalone call сохранит receiver от прежнего object.

Automation QA связь: detached Page Object methods часто теряют `this`.

---

### 6. Что такое detached function?

Ответ: detached function - это function object, взятый из object property и вызванный отдельно.

Рассуждение:

```javascript
const method = object.method;
method();
```

Для обычной модели вызова из этой главы здесь нет object receiver: вызов идет как `method()`, а не как `object.method()`.

Типичная ошибка: думать, что переменная `method` помнит object, из которого функция была взята.

Automation QA связь: это частая причина ошибок в helper objects и page objects.

---

### 7. Почему Arrow Function нельзя считать простой заменой method?

Ответ: Arrow Function имеет особое поведение `this` и не получает receiver так же, как обычная function.

Рассуждение: `object.arrowMethod()` выглядит как method call, но arrow не определяет `this` через этот вызов.

Типичная ошибка: механически заменять `function () {}` на `() => {}` внутри object methods.

Automation QA связь: object methods с `this.page` или `this.baseUrl` лучше писать обычной function, пока не изучена полная механика lexical `this`.

---

### 8. Чем Closure отличается от this?

Ответ:

```text
Closure
│
└── which variables are available?

this
│
└── who is the current receiver?
```

Рассуждение: Closure связана с Lexical Environment, где function object был создан. `this` связан с тем, как function object был вызван.

Типичная ошибка: объяснять `this` через Scope Chain.

Automation QA связь: helper factory может использовать Closure для expected status, а method может использовать `this.baseUrl` для current client.

---

## Анализ кода

### Задание 1

Ответ:

```text
Anna
```

Форма invocation:

```text
user.printName()
```

Receiver: `user`.

Рассуждение: function object вызывается как property object `user`, поэтому внутри function `this -> user`.

Типичная ошибка: говорить, что `this` указывает на function `printName`.

Automation QA связь: так же читаются методы page objects: `loginPage.open()` означает `this -> loginPage`.

---

### Задание 2

Ответ:

```text
first
second
```

Используется один function object, но два разных invocation.

Рассуждение:

```text
firstClient.printName()
│
└── this -> firstClient

secondClient.printName()
│
└── this -> secondClient
```

Типичная ошибка: думать, что функция навсегда привязана к `firstClient`, потому что была взята из `firstClient.printName`.

Automation QA связь: один method implementation может работать для разных client objects, если receiver выбран правильно.

---

## Предскажите результат выполнения кода

### Задание 3

Ответ:

```text
undefined
```

Рассуждение: в strict mode standalone function call не имеет receiver, поэтому `this` равен `undefined`.

Типичная ошибка: ожидать global object.

Automation QA связь: современные проекты обычно работают в режимах, где лучше не зависеть от non-strict global `this`.

---

### Задание 4

Ответ:

```text
true
```

Рассуждение:

```text
response.isSuccessful()
│
└── this -> response
```

`this.status` равен `200`.

Типичная ошибка: читать `this.status` как неизвестную variable, а не как property receiver.

Automation QA связь: такой pattern может использоваться в response helper objects.

---

### Задание 5

Ответ: код приводит к `TypeError`.

Рассуждение:

```text
const format = helper.format
│
└── function object extracted

format('Failed')
│
└── receiver: none
```

В strict mode `this` равен `undefined`, поэтому `this.prefix` вызывает ошибку.

Типичная ошибка: думать, что `format` помнит `helper`.

Automation QA связь: это типичная ошибка при передаче methods из helper objects.

---

## Closure vs this

### Задание 6

Ответ:

```text
admin: Anna
```

`prefix` берется через Closure.

`this.name` берется из receiver текущего вызова.

Рассуждение:

```text
createPrinter('admin')
│
└── printName function object references lexical environment with prefix

user.print()
│
└── this -> user
```

Closure отвечает:

```text
Which variables are available?
```

`this` отвечает:

```text
Who is the current receiver?
```

Типичная ошибка: думать, что `this.name` тоже берется из Closure.

Automation QA связь: factory может captured expected label, а receiver может быть конкретным page object или client object.

---

## Определите receiver

### Задание 7

Ответ:

```text
apiClient.buildUrl('/users')
│
└── receiver: apiClient

buildUrl('/orders')
│
└── receiver: none
```

Рассуждение: в обычной модели `object.method()` первый вызов имеет receiver `apiClient`. Второй вызов идет через standalone variable, поэтому receiver не выбирается как object method receiver.

Типичная ошибка: считать, что `buildUrl` хранит receiver вместе с function object.

Automation QA связь: если method API client извлечь в переменную, `this.baseUrl` может стать недоступным.

---

## Отладка

### Задание 8

Решение:

```javascript
'use strict';

const logger = {
  prefix: 'API',
  log: function (message) {
    console.log(this.prefix + ': ' + message);
  }
};

logger.log('Request failed');
```

Результат:

```text
API: Request failed
```

Рассуждение: для обычного method call `logger.log()` receiver выбирается из формы вызова, поэтому внутри method `this -> logger`.

Типичная ошибка: делать `const log = logger.log` и ожидать, что receiver сохранится.

Automation QA связь: logging helpers и assertion helpers часто ломаются при detached methods.

Возможное улучшение: после изучения `bind()` можно будет создавать function с заранее выбранным receiver.

---

### Задание 9

Решение:

```javascript
const user = {
  name: 'Anna',
  getName: function () {
    return this.name;
  }
};

console.log(user.getName());
```

Результат:

```text
Anna
```

Рассуждение: обычная function получает `this` из method invocation `user.getName()`.

Типичная ошибка: считать Arrow Function полной заменой method syntax.

Automation QA связь: methods с `this.page`, `this.baseUrl`, `this.expectedStatus` не стоит механически писать как arrows.

---

## QA-задачи

### Задание 10

Решение:

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  },
  validateStatus: function (response) {
    return response.status === 200;
  }
};

console.log(apiClient.buildUrl('/users'));
console.log(apiClient.validateStatus({ status: 200 }));
```

Результат:

```text
https://api.example.test/users
true
```

Рассуждение: `buildUrl` вызывается как method, поэтому `this.baseUrl` читает property `apiClient.baseUrl`.

Типичная ошибка: извлечь `buildUrl` в переменную и потерять receiver.

Automation QA связь: API clients часто хранят base URL и methods рядом.

---

### Задание 11

Решение:

```javascript
const assertions = {
  expectedStatus: 200,
  statusIsExpected: function (response) {
    return response.status === this.expectedStatus;
  }
};

console.log(assertions.statusIsExpected({ status: 200 }));
console.log(assertions.statusIsExpected({ status: 500 }));
```

Результат:

```text
true
false
```

Рассуждение: receiver в обоих вызовах - `assertions`.

Типичная ошибка: писать Arrow Function и ожидать method receiver.

Automation QA связь: assertion helper objects могут хранить expected configuration.

---

## Мини-проект

### Задание 12

Решение:

```javascript
'use strict';

const responseHelper = {
  expectedStatus: 200,
  serviceName: 'users-api',
  isExpectedStatus: function (response) {
    return response.status === this.expectedStatus;
  },
  formatError: function (response) {
    return this.serviceName +
      ': expected ' +
      this.expectedStatus +
      ', received ' +
      response.status;
  }
};

const response = {
  status: 500
};

console.log(responseHelper.isExpectedStatus(response));
console.log(responseHelper.formatError(response));

const formatError = responseHelper.formatError;

try {
  console.log(formatError(response));
} catch (error) {
  console.log(error.name + ': receiver is lost');
}

console.log(responseHelper.formatError(response));
```

Возможный вывод:

```text
false
users-api: expected 200, received 500
TypeError: receiver is lost
users-api: expected 200, received 500
```

Схема:

```text
responseHelper.formatError(response)
│
└── this -> responseHelper

formatError(response)
│
└── this -> undefined in strict mode
```

Рассуждение: `responseHelper.formatError()` имеет receiver. `formatError()` после извлечения вызывается как standalone function.

Типичная ошибка: думать, что переменная `formatError` хранит не только function object, но и receiver.

Automation QA связь: это помогает понимать ошибки в Page Object methods, API client helpers и assertion helpers.

Возможное улучшение: после главы `bind()` можно будет сохранить receiver заранее.
