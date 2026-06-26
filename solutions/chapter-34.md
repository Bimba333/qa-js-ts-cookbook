# Решения: apply()

## Проверка понимания

### 1. Зачем существует apply()?

Ответ: `apply()` нужен, чтобы вызвать function object с явно выбранным receiver и передать normal arguments как array или array-like ordered argument list.

Рассуждение: `call()` удобен, когда arguments уже отдельные. `apply()` удобен, когда arguments уже собраны в array или array-like collection.

Типичная ошибка: думать, что `apply()` решает новую проблему receiver.

Automation QA связь: test data часто приходит в виде подготовленного array значений.

---

### 2. Какую проблему решает apply()?

Ответ: проблему передачи arguments.

Рассуждение: receiver selection у `call()` и `apply()` одинаковый: первый argument становится `this`. Отличается второй argument: у `apply()` это array или array-like ordered argument list.

Типичная ошибка: объяснять `apply()` как другой способ определить `this`.

Automation QA связь: config object остается receiver, а request/response data могут лежать в array.

---

### 3. Что общего у call() и apply()?

Ответ: оба вызывают function immediately и позволяют явно выбрать receiver первым argument.

Рассуждение:

```text
fn.call(receiver, ...)
fn.apply(receiver, ...)
│
└── receiver -> this
```

Типичная ошибка: думать, что `apply()` сохраняет receiver навсегда.

Automation QA связь: оба механизма полезны для understanding helpers with explicit config receiver.

---

### 4. Чем отличается передача arguments?

Ответ:

```text
call(receiver, arg1, arg2)
│
└── arguments separately

apply(receiver, [arg1, arg2])
│
└── arguments as one ordered argument list
```

Рассуждение: `apply()` берет values из array или array-like list по positions и передает их parameters.

Типичная ошибка: передать array в `call()` и ожидать, что он автоматически разложится по parameters.

Automation QA связь: array test data лучше подходит для `apply()`.

---

### 5. Что становится this?

Ответ: первый argument `apply()`.

Рассуждение:

```text
functionObject.apply(receiver, values)
│
└── receiver -> this
```

Типичная ошибка: считать, что second argument влияет на `this`.

Automation QA связь: assertion config object обычно становится receiver.

---

### 6. Как values из array попадают в parameters?

Ответ: по позиции.

Рассуждение:

```text
values[0] -> first parameter
values[1] -> second parameter
values[2] -> third parameter
```

Типичная ошибка: думать, что весь array попадает в первый parameter.

Automation QA связь: порядок test data в array должен соответствовать function signature.

---

### 7. Что такое array-like collection?

Ответ: на высоком уровне это object-like value с indexed values и `length`.

Рассуждение: `apply()` может работать с array-like ordered argument lists. Подробности `arguments` object internals будут изучаться позже.

Типичная ошибка: углубляться в internals раньше времени.

Automation QA связь: некоторые tools и APIs возвращают array-like values.

---

### 8. Когда apply() удобнее call()?

Ответ: когда arguments уже собраны в array или array-like collection.

Рассуждение:

```text
Already separate values
│
└── call()

Already in array or array-like list
│
└── apply()
```

Типичная ошибка: использовать `apply()` везде механически.

Automation QA связь: data-driven tests часто подготавливают набор values заранее.

---

## Анализ кода

### Задание 1

Ответ:

```text
GET https://api.example.test/users
```

Mapping:

```text
apiClient       -> this
requestParts[0] -> method
requestParts[1] -> path
```

Рассуждение: первый argument `apply()` выбирает receiver. Второй argument содержит values для parameters.

Типичная ошибка: считать, что `requestParts` целиком станет `method`.

Automation QA связь: request parts часто хранятся в подготовленном наборе test data.

---

### Задание 2

Ответ:

Receiver одинаковый: `apiClient`.

Результат одинаковый:

```text
https://api.example.test/users
```

Отличается форма передачи arguments:

```text
call(apiClient, '/users')
apply(apiClient, ['/users'])
```

Рассуждение: receiver handling одинаковый. Argument passing разный.

Типичная ошибка: думать, что `apply()` отличается прежде всего receiver behavior.

Automation QA связь: выбирайте форму по тому, как уже представлены test data.

---

## Предскажите результат выполнения кода

### Задание 3

Ответ:

```text
users-api: 200 /users
```

Рассуждение:

```text
serviceConfig -> this
data[0]       -> status
data[1]       -> path
```

Типичная ошибка: перепутать receiver и `data`.

Automation QA связь: service config отделен от response data.

---

### Задание 4

Ответ:

```text
true
```

Рассуждение:

```text
config           -> this
responseParts[0] -> status
responseParts[1] -> path
responseParts[2] -> body
```

Все условия возвращают `true`.

Типичная ошибка: нарушить порядок values в `responseParts`.

Automation QA связь: порядок данных в data provider должен совпадать с signature helper.

---

### Задание 5

Ответ: код приведет к ошибке.

Рассуждение: второй argument `apply()` должен быть array или array-like ordered argument list. Строка `'/users'` передана как обычное primitive value, а не как array для arguments.

Исправленный вариант:

```javascript
console.log(buildUrl.apply(apiClient, ['/users']));
```

Типичная ошибка: использовать `apply()` как `call()`.

Automation QA связь: если argument один, его все равно нужно положить в array или array-like list.

---

## call vs apply

### Задание 6

Решение:

```javascript
formatRequest.apply(apiClient, ['POST', '/orders', '{"id":1}']);
```

Рассуждение:

```text
apiClient -> this
array[0]  -> method
array[1]  -> path
array[2]  -> body
```

Типичная ошибка: написать `apply(apiClient, 'POST', '/orders', body)`.

Automation QA связь: useful when request data already exists as array.

---

### Задание 7

Решение:

```javascript
validateResponse.call(config, 200, '/users', '{"name":"Anna"}');
```

Рассуждение: `call()` принимает arguments отдельно.

Типичная ошибка: передать array в `call()` вторым argument и ожидать автоматический mapping.

Automation QA связь: если values уже распакованы, `call()` может быть читаемее.

---

## Отладка

### Задание 8

Решение:

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.apply(apiClient, ['/users']));
```

Результат:

```text
https://api.example.test/users
```

Рассуждение: `'/users'` должен быть inside argument list.

Типичная ошибка: забыть, что second argument of `apply()` is array or array-like ordered argument list.

Automation QA связь: даже один value в data-driven helper должен быть передан в expected shape.

---

### Задание 9

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

console.log(validateStatus.apply(config, [response]));
```

Результат:

```text
true
```

Рассуждение:

```text
config     -> this
[response] -> argument list
response   -> first parameter
```

Типичная ошибка: поставить array with data на место receiver.

Automation QA связь: config object и actual data должны занимать разные позиции.

---

## QA-задачи

### Задание 10

Решение:

```javascript
function validateResponse(status, path, body) {
  return status === this.expectedStatus &&
    path === this.expectedPath &&
    body !== '';
}

const config = {
  expectedStatus: 200,
  expectedPath: '/users'
};

const responseParts = [200, '/users', '{"name":"Anna"}'];

console.log(validateResponse.apply(config, responseParts));
```

Результат:

```text
true
```

Рассуждение: receiver содержит expected values, array содержит actual values.

Типичная ошибка: хранить expected и actual values в одном object без явного разделения ролей.

Automation QA связь: это типичная структура reusable API validator.

---

### Задание 11

Решение:

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}

const usersApi = {
  baseUrl: 'https://users.example.test'
};

const ordersApi = {
  baseUrl: 'https://orders.example.test'
};

const createUserRequest = ['POST', '/users', '{"name":"Anna"}'];
const createOrderRequest = ['POST', '/orders', '{"id":1}'];

console.log(formatRequest.apply(usersApi, createUserRequest));
console.log(formatRequest.apply(ordersApi, createOrderRequest));
```

Результат:

```text
POST https://users.example.test/users {"name":"Anna"}
POST https://orders.example.test/orders {"id":1}
```

Рассуждение: same function, different receiver and different arrays with arguments.

Типичная ошибка: использовать один config для разных services.

Automation QA связь: request builders часто получают service config и prepared request data.

---

## Мини-проект

### Задание 12

Решение:

```javascript
function buildRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}

function validateRequest(status, path, body) {
  return status === this.expectedStatus &&
    path === this.expectedPath &&
    body !== '';
}

const apiConfig = {
  baseUrl: 'https://api.example.test'
};

const assertionConfig = {
  expectedStatus: 200,
  expectedPath: '/users'
};

const requestParts = ['POST', '/users', '{"name":"Anna"}'];
const responseParts = [200, '/users', '{"name":"Anna"}'];

console.log(buildRequest.apply(apiConfig, requestParts));
console.log(validateRequest.apply(assertionConfig, responseParts));
```

Результат:

```text
POST https://api.example.test/users {"name":"Anna"}
true
```

Mapping:

```text
buildRequest.apply(apiConfig, requestParts)
│
├── apiConfig       -> this
├── requestParts[0] -> method
├── requestParts[1] -> path
└── requestParts[2] -> body

validateRequest.apply(assertionConfig, responseParts)
│
├── assertionConfig -> this
├── responseParts[0] -> status
├── responseParts[1] -> path
└── responseParts[2] -> body
```

Почему `apply()` удобен: arguments уже представлены arrays.

Где `call()` был бы читаемее: если `method`, `path`, `body` уже лежат в отдельных variables.

Почему receiver handling не отличается от `call()`: первый argument в обоих methods становится `this`.

Типичная ошибка: воспринимать `apply()` как механизм receiver, а не как механизм передачи ordered argument list.

Automation QA связь: mini-project показывает request builder и validator, работающие с configuration objects и test data arrays.

Возможное улучшение: следующая глава `bind()` покажет, как создать reusable function с заранее выбранным receiver.
