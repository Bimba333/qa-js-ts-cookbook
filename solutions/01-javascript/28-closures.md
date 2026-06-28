# Решения: Closures

## Проверка понимания

### 1. Почему функция может читать переменную после завершения outer function?

Ответ: потому что returned function object сохраняет доступ к lexical environment, где эта переменная была создана.

Объяснение: outer function завершает выполнение, ее Execution Context больше не активен в Call Stack. Но если inner function использует identifier из outer scope и сама функция продолжает существовать, JavaScript сохраняет нужное lexical environment.

Распространённая ошибка: думать, что завершение Execution Context всегда означает немедленное исчезновение всех данных.

Связь с Automation QA: так работают helper creators, которые запоминают configuration, expected status или base URL.

---

### 2. Что сохраняет Closure?

Ответ: Closure сохраняет доступ к lexical environment, а не frozen copy значения.

Объяснение: если captured variable изменяется внутри returned function, следующий вызов видит новое состояние. Это показывает, что речь не о копии на каждый вызов.

Распространённая ошибка: объяснять Closure как "функция скопировала переменные внутрь себя".

Связь с Automation QA: counter-like helpers и validators могут хранить состояние между вызовами, если это сделано намеренно.

---

### 3. Почему captured variable не становится global variable?

Ответ: captured variable остается в своем lexical environment. Она доступна только функциям, которые имеют к этому environment связь.

Объяснение: global variable видна из global scope. Captured variable не появляется в global scope и не становится доступной по имени снаружи.

Распространённая ошибка: считать, что если значение живет дольше функции, оно стало global.

Связь с Automation QA: это помогает избегать global mutable состояние в тестовом фреймворке.

---

### 4. Чем Scope отличается от Closure?

Ответ: Scope отвечает за видимость identifiers. Closure объясняет, почему outer environment может оставаться доступным позже.

Объяснение: Scope говорит, где функция имеет право искать имя. Closure добавляет lifetime: нужное окружение сохраняется, если returned function все еще может его использовать.

Распространённая ошибка: использовать слова Scope и Closure как синонимы.

Связь с Automation QA: при отладке helpers важно понимать не только где имя видно, но и почему старое значение все еще доступно.

---

### 5. Почему два вызова factory function создают независимые closures?

Ответ: каждый вызов factory function создает новое lexical environment.

Объяснение: одна и та же function definition может выполняться много раз. Каждый вызов получает свои parameters и local variables. Если каждый вызов возвращает inner function, каждая returned function сохраняет свое окружение.

Распространённая ошибка: думать, что все closures из одной factory function делят одну общую переменную.

Связь с Automation QA: можно создать `validateOk` и `validateCreated`, и каждый validator будет помнить свой expected status.

---

### 6. Что происходит с Execution Context outer function после return?

Ответ: выполнение outer function заканчивается, и ее Execution Context удаляется из Call Stack.

Объяснение: Call Stack управляет активным выполнением. После `return` outer function больше не выполняется. Но нужное lexical environment может сохраниться.

Распространённая ошибка: думать, что Closure сохраняет весь Execution Context активным.

Связь с Automation QA: helper factory не "продолжает выполняться"; она только создает configured helper.

---

### 7. Что может сохраниться после завершения outer function?

Ответ: lexical environment, нужное returned function.

Объяснение: если inner function использует outer identifiers, JavaScript должен сохранить окружение, где эти identifiers находятся.

Распространённая ошибка: говорить, что "сохраняется стек вызовов".

Связь с Automation QA: это объясняет, почему validator помнит expected value после создания.

---

### 8. Почему Closure нельзя объяснять как магию?

Ответ: потому что Closure следует из уже изученных механизмов: function object, Scope и Lexical Environment.

Объяснение: функция создается в конкретном lexical environment. Если она используется позже, связь с этим окружением сохраняется.

Распространённая ошибка: запоминать определение Closure без понимания Execution Context и Lexical Environment.

Связь с Automation QA: понимание механизма помогает читать сложные helper chains и factory functions.

---

## Анализ кода

### Задание 1

Ответ:

```javascript
function createReader() {
  const value = 'saved';

  return function readValue() {
    return value;
  };
}
```

Inner function: `readValue`.

Captured variable: `value`.

`value` доступна при вызове `reader()`, потому что returned function object сохраняет доступ к lexical environment функции `createReader`.

Объяснение:

```text
createReader()
│
├── creates value
├── creates readValue
└── returns readValue

reader()
│
└── reads value from preserved environment
```

Распространённая ошибка: считать, что `value` исчезла сразу после `createReader()`.

Связь с Automation QA: аналогично helper может помнить expected value.

---

### Задание 2

Ответ:

```text
true
```

`validateAdmin` хранит returned function object `validateUser`.

`validateUser` берет `expectedRole` из preserved lexical environment вызова `createValidator('admin')`.

Объяснение:

```text
createValidator('admin')
│
└── expectedRole = 'admin'
    │
    └── captured by validateUser
```

Распространённая ошибка: искать `expectedRole` внутри object `user`.

Связь с Automation QA: так можно создавать validators для ролей, статусов, типов ответа.

---

## Предскажите результат выполнения кода

### Задание 3

Ответ:

```text
1
2
3
```

Объяснение: `count` создан один раз при вызове `createCounter()`. Returned function `increment` сохраняет доступ к этому `count` и обновляет его при каждом вызове.

Распространённая ошибка: ожидать `1 1 1`, как будто `count` создается заново при каждом вызове `counter()`.

Связь с Automation QA: если helper сохраняет состояние, каждый вызов может зависеть от предыдущего. Это нужно делать осознанно.

---

### Задание 4

Ответ:

```text
1
11
2
12
```

Объяснение:

```text
first
│
└── count starts at 0

second
│
└── count starts at 10
```

Каждый вызов `createCounter(start)` создает отдельное lexical environment.

Распространённая ошибка: думать, что `first` и `second` используют один общий `count`.

Связь с Automation QA: независимые validators или builders не должны мешать друг другу.

---

## Ожидаемое время жизни vs Фактическое время жизни

### Задание 5

Ответ:

Ожидаемое время жизни без учета Closure:

```text
createTokenReader starts
│
▼
token created
│
▼
createTokenReader finishes
│
▼
token expected to disappear
```

Фактическое время жизни:

```text
createTokenReader starts
│
▼
token created
│
▼
readToken function object created
│
▼
readToken uses token
│
▼
createTokenReader returns readToken
│
▼
token remains available through preserved environment
```

Объяснение: `token` нужен returned function, поэтому lexical environment с `token` сохраняется.

Распространённая ошибка: говорить, что сохраняется "переменная в стеке". В этой главе используется conceptual model: сохраняется нужное lexical environment.

Связь с Automation QA: token readers, URL builders и configured validators часто работают именно так.

---

## Поиск Closure

### Задание 6

Ответ:

Пример A:

```javascript
function getStatus() {
  const status = 200;
  return status;
}
```

Здесь нет показательного Closure: функция возвращает primitive value, а не function object, который использует outer variable позже.

Пример B:

```javascript
function createStatusReader() {
  const status = 200;

  return function readStatus() {
    return status;
  };
}
```

Здесь есть Closure: `readStatus` использует `status` из outer lexical environment.

Пример C:

```javascript
const status = 200;

function readStatus() {
  return status;
}
```

Функция использует outer scope. Но для учебной модели этой главы самый важный случай - когда функция продолжает использовать outer environment после завершения outer function. Здесь outer scope - global scope, он и так живет до конца программы.

Объяснение: Closure лучше всего видно, когда функция создана внутри другой функции и возвращена наружу.

Распространённая ошибка: считать, что Closure существует только там, где есть слово `return`. `return function` просто делает механизм хорошо видимым.

Связь с Automation QA: factory functions дают наиболее практичный и контролируемый способ использовать Closures.

---

## Отладка

### Задание 7

Решение:

```javascript
function createStatusValidator(expectedStatus) {
  return function validateStatus(actualStatus) {
    return actualStatus === expectedStatus;
  };
}

const validateOk = createStatusValidator(200);
const validateCreated = createStatusValidator(201);

console.log(validateOk(200));
console.log(validateCreated(200));
```

Ожидаемый вывод:

```text
true
false
```

Объяснение: каждый validator сохраняет свой `expectedStatus` в отдельном lexical environment.

Распространённая ошибка: оставлять `expectedStatus` как global mutable состояние.

Связь с Automation QA: global mutable состояние часто приводит к flaky tests, когда один тест меняет состояние для другого.

---

### Задание 8

Решение:

```javascript
function createMessage(prefix) {
  return function buildMessage(text) {
    return prefix + ': ' + text;
  };
}

const buildApiMessage = createMessage('API');

console.log(buildApiMessage('Request failed'));
```

Ожидаемый вывод:

```text
API: Request failed
```

Объяснение: inner function должна использовать `prefix` из outer lexical environment и `text`, который приходит как argument при вызове.

Распространённая ошибка: создать Closure, но не использовать captured variable.

Связь с Automation QA: такие builders полезны для логирования, отчетов и сообщений assertion errors.

---

## QA-задачи

### Задание 9

Решение:

```javascript
function createStatusValidator(expectedStatus) {
  return function validateResponse(response) {
    return response.status === expectedStatus;
  };
}

const validateOk = createStatusValidator(200);

console.log(validateOk({ status: 200 }));
console.log(validateOk({ status: 404 }));
```

Ожидаемый вывод:

```text
true
false
```

Объяснение: `expectedStatus` captured один раз при создании validator. `response` приходит каждый раз как argument.

Распространённая ошибка: передавать `expectedStatus` в каждый вызов, хотя цель factory function - сохранить его заранее.

Связь с Automation QA: этот паттерн полезен для REST API assertions.

---

### Задание 10

Решение:

```javascript
function createUrlBuilder(baseUrl) {
  return function buildUrl(path) {
    return baseUrl + path;
  };
}

const buildApiUrl = createUrlBuilder('https://api.example.test');

console.log(buildApiUrl('/users'));
console.log(buildApiUrl('/orders'));
```

Ожидаемый вывод:

```text
https://api.example.test/users
https://api.example.test/orders
```

Объяснение: `baseUrl` captured, а `path` передается при каждом вызове.

Распространённая ошибка: хранить `baseUrl` в global variable и менять его между тестами.

Связь с Automation QA: так можно создать URL builders для staging, production-like и local environments.

---

### Задание 11

Решение:

```javascript
function createRoleValidator(expectedRole) {
  return function validateRole(user) {
    return user.role === expectedRole;
  };
}

const validateAdmin = createRoleValidator('admin');
const validateGuest = createRoleValidator('guest');

console.log(validateAdmin({ role: 'admin' }));
console.log(validateAdmin({ role: 'guest' }));
console.log(validateGuest({ role: 'guest' }));
```

Ожидаемый вывод:

```text
true
false
true
```

Объяснение: `validateAdmin` и `validateGuest` имеют разные preserved lexical environments.

Распространённая ошибка: использовать один общий `expectedRole` для всех validators.

Связь с Automation QA: role validators полезны при проверке API responses, fixtures и test data.

---

## Мини-проект

### Задание 12

Решение:

```javascript
function createResponseValidator(expectedStatus) {
  return function validateResponse(response) {
    return response.status === expectedStatus;
  };
}

function createHeaderValidator(headerName) {
  return function validateHeaders(headers) {
    return headers[headerName] !== undefined;
  };
}

const validateOk = createResponseValidator(200);
const validateCreated = createResponseValidator(201);
const validateRequestId = createHeaderValidator('x-request-id');

const okResponse = {
  status: 200
};

const createdResponse = {
  status: 201
};

const headers = {
  'x-request-id': 'request-123'
};

console.log(validateOk(okResponse));
console.log(validateOk(createdResponse));
console.log(validateCreated(createdResponse));
console.log(validateRequestId(headers));
```

Ожидаемый вывод:

```text
true
false
true
true
```

Схема:

```text
validateOk
│
└── preserved lexical environment
    │
    └── expectedStatus = 200

validateCreated
│
└── preserved lexical environment
    │
    └── expectedStatus = 201

validateRequestId
│
└── preserved lexical environment
    │
    └── headerName = 'x-request-id'
```

Объяснение: factory functions создают specialized helpers. Одни значения captured при создании helper, другие приходят позже как arguments.

Captured значения:

* `expectedStatus`;
* `headerName`.

Аргументы:

* `response`;
* `headers`.

Почему helpers независимы: каждый вызов factory function создает отдельное lexical environment.

Распространённая ошибка: сделать один общий `expectedStatus` или `headerName` снаружи и менять его между проверками.

Связь с Automation QA: такой подход помогает строить reusable validators для API tests без глобального изменяемого состояния.

Возможное улучшение: добавить понятные сообщения об ошибке или возвращать object с результатом проверки. Это будет полезно в будущих главах про framework architecture и assertions.
