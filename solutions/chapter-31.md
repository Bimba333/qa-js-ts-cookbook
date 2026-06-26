# Решения: Closures

## Проверка понимания

### 1. Почему функция может читать переменную после завершения outer function?

Ответ: потому что returned function object сохраняет доступ к lexical environment, где эта переменная была создана.

Рассуждение: outer function завершает выполнение, ее Execution Context больше не активен в Call Stack. Но если inner function использует identifier из outer scope и сама функция продолжает существовать, JavaScript сохраняет нужное lexical environment.

Типичная ошибка: думать, что завершение Execution Context всегда означает немедленное исчезновение всех данных.

Automation QA связь: так работают helper creators, которые запоминают configuration, expected status или base URL.

---

### 2. Что сохраняет Closure?

Ответ: Closure сохраняет доступ к lexical environment, а не frozen copy значения.

Рассуждение: если captured variable изменяется внутри returned function, следующий вызов видит новое состояние. Это показывает, что речь не о копии на каждый вызов.

Типичная ошибка: объяснять Closure как "функция скопировала переменные внутрь себя".

Automation QA связь: counter-like helpers и validators могут хранить состояние между вызовами, если это сделано намеренно.

---

### 3. Почему captured variable не становится global variable?

Ответ: captured variable остается в своем lexical environment. Она доступна только функциям, которые имеют к этому environment связь.

Рассуждение: global variable видна из global scope. Captured variable не появляется в global scope и не становится доступной по имени снаружи.

Типичная ошибка: считать, что если значение живет дольше функции, оно стало global.

Automation QA связь: это помогает избегать global mutable state в тестовом фреймворке.

---

### 4. Чем Scope отличается от Closure?

Ответ: Scope отвечает за видимость identifiers. Closure объясняет, почему outer environment может оставаться доступным позже.

Рассуждение: Scope говорит, где функция имеет право искать имя. Closure добавляет lifetime: нужное окружение сохраняется, если returned function все еще может его использовать.

Типичная ошибка: использовать слова Scope и Closure как синонимы.

Automation QA связь: при отладке helpers важно понимать не только где имя видно, но и почему старое значение все еще доступно.

---

### 5. Почему два вызова factory function создают независимые closures?

Ответ: каждый вызов factory function создает новое lexical environment.

Рассуждение: одна и та же function definition может выполняться много раз. Каждый вызов получает свои parameters и local variables. Если каждый вызов возвращает inner function, каждая returned function сохраняет свое окружение.

Типичная ошибка: думать, что все closures из одной factory function делят одну общую переменную.

Automation QA связь: можно создать `validateOk` и `validateCreated`, и каждый validator будет помнить свой expected status.

---

### 6. Что происходит с Execution Context outer function после return?

Ответ: выполнение outer function заканчивается, и ее Execution Context удаляется из Call Stack.

Рассуждение: Call Stack управляет активным выполнением. После `return` outer function больше не выполняется. Но нужное lexical environment может сохраниться.

Типичная ошибка: думать, что Closure сохраняет весь Execution Context активным.

Automation QA связь: helper factory не "продолжает выполняться"; она только создает configured helper.

---

### 7. Что может сохраниться после завершения outer function?

Ответ: lexical environment, нужное returned function.

Рассуждение: если inner function использует outer identifiers, JavaScript должен сохранить окружение, где эти identifiers находятся.

Типичная ошибка: говорить, что "сохраняется стек вызовов".

Automation QA связь: это объясняет, почему validator помнит expected value после создания.

---

### 8. Почему Closure нельзя объяснять как магию?

Ответ: потому что Closure следует из уже изученных механизмов: function object, Scope и Lexical Environment.

Рассуждение: функция создается в конкретном lexical environment. Если она используется позже, связь с этим окружением сохраняется.

Типичная ошибка: запоминать определение Closure без понимания Execution Context и Lexical Environment.

Automation QA связь: понимание механизма помогает читать сложные helper chains и factory functions.

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

Рассуждение:

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

Типичная ошибка: считать, что `value` исчезла сразу после `createReader()`.

Automation QA связь: аналогично helper может помнить expected value.

---

### Задание 2

Ответ:

```text
true
```

`validateAdmin` хранит returned function object `validateUser`.

`validateUser` берет `expectedRole` из preserved lexical environment вызова `createValidator('admin')`.

Рассуждение:

```text
createValidator('admin')
│
└── expectedRole = 'admin'
    │
    └── captured by validateUser
```

Типичная ошибка: искать `expectedRole` внутри object `user`.

Automation QA связь: так можно создавать validators для ролей, статусов, типов ответа.

---

## Предскажите результат выполнения кода

### Задание 3

Ответ:

```text
1
2
3
```

Рассуждение: `count` создан один раз при вызове `createCounter()`. Returned function `increment` сохраняет доступ к этому `count` и обновляет его при каждом вызове.

Типичная ошибка: ожидать `1 1 1`, как будто `count` создается заново при каждом вызове `counter()`.

Automation QA связь: если helper сохраняет состояние, каждый вызов может зависеть от предыдущего. Это нужно делать осознанно.

---

### Задание 4

Ответ:

```text
1
11
2
12
```

Рассуждение:

```text
first
│
└── count starts at 0

second
│
└── count starts at 10
```

Каждый вызов `createCounter(start)` создает отдельное lexical environment.

Типичная ошибка: думать, что `first` и `second` используют один общий `count`.

Automation QA связь: независимые validators или builders не должны мешать друг другу.

---

## Expected lifetime vs Actual lifetime

### Задание 5

Ответ:

Expected lifetime без учета Closure:

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

Actual lifetime:

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

Рассуждение: `token` нужен returned function, поэтому lexical environment с `token` сохраняется.

Типичная ошибка: говорить, что сохраняется "переменная в стеке". В этой главе используется conceptual model: сохраняется нужное lexical environment.

Automation QA связь: token readers, URL builders и configured validators часто работают именно так.

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

Рассуждение: Closure лучше всего видно, когда функция создана внутри другой функции и возвращена наружу.

Типичная ошибка: считать, что Closure существует только там, где есть слово `return`. `return function` просто делает механизм хорошо видимым.

Automation QA связь: factory functions дают наиболее практичный и контролируемый способ использовать Closures.

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

Рассуждение: каждый validator сохраняет свой `expectedStatus` в отдельном lexical environment.

Типичная ошибка: оставлять `expectedStatus` как global mutable state.

Automation QA связь: global mutable state часто приводит к flaky tests, когда один тест меняет состояние для другого.

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

Рассуждение: inner function должна использовать `prefix` из outer lexical environment и `text`, который приходит как argument при вызове.

Типичная ошибка: создать Closure, но не использовать captured variable.

Automation QA связь: такие builders полезны для логирования, отчетов и сообщений assertion errors.

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

Рассуждение: `expectedStatus` captured один раз при создании validator. `response` приходит каждый раз как argument.

Типичная ошибка: передавать `expectedStatus` в каждый вызов, хотя цель factory function - сохранить его заранее.

Automation QA связь: этот паттерн полезен для REST API assertions.

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

Рассуждение: `baseUrl` captured, а `path` передается при каждом вызове.

Типичная ошибка: хранить `baseUrl` в global variable и менять его между тестами.

Automation QA связь: так можно создать URL builders для staging, production-like и local environments.

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

Рассуждение: `validateAdmin` и `validateGuest` имеют разные preserved lexical environments.

Типичная ошибка: использовать один общий `expectedRole` для всех validators.

Automation QA связь: role validators полезны при проверке API responses, fixtures и test data.

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

Рассуждение: factory functions создают specialized helpers. Одни значения captured при создании helper, другие приходят позже как arguments.

Captured values:

* `expectedStatus`;
* `headerName`.

Arguments:

* `response`;
* `headers`.

Почему helpers независимы: каждый вызов factory function создает отдельное lexical environment.

Типичная ошибка: сделать один общий `expectedStatus` или `headerName` снаружи и менять его между проверками.

Automation QA связь: такой подход помогает строить reusable validators для API tests без глобального изменяемого состояния.

Возможное улучшение: добавить понятные сообщения об ошибке или возвращать object с результатом проверки. Это будет полезно в будущих главах про framework architecture и assertions.
