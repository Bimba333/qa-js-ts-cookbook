# Практика: call()

## Проверка понимания

1. Зачем существует `call()`?

2. Кто выбирает receiver при ordinary invocation?

3. Кто выбирает receiver при `call()`?

4. Что означает первый argument в `functionObject.call(receiver)`?

5. Куда попадают arguments, которые идут после receiver?

6. Почему `call()` не привязывает receiver навсегда?

7. Чем `call()` отличается от обычного `object.method()` на уровне выбора receiver?

8. Почему `apply()` логически продолжает тему `call()`?

---

## Анализ кода

### Задание 1

Определите receiver и результат.

```javascript
function printServiceName() {
  return this.serviceName;
}

const service = {
  serviceName: 'users-api'
};

console.log(printServiceName.call(service));
```

Ответьте:

* кто выбирает receiver;
* что становится `this`;
* что будет выведено.

---

### Задание 2

Прочитайте код.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.call(apiClient, '/users'));
```

Ответьте:

* что становится `this`;
* что получает parameter `path`;
* какой будет результат.

---

## Перепишите ordinary invocation через call()

### Задание 3

Перепишите вызов:

```javascript
apiClient.buildUrl('/orders');
```

через `call()`.

Исходный object:

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};
```

---

### Задание 4

Перепишите вызов:

```javascript
assertions.statusMatches(response);
```

через `call()`.

Исходный object:

```javascript
const assertions = {
  expectedStatus: 200,
  statusMatches: function (response) {
    return response.status === this.expectedStatus;
  }
};

const response = {
  status: 200
};
```

---

## Предскажите результат выполнения кода

### Задание 5

Не запускайте код. Сначала предскажите вывод.

```javascript
function getExpectedStatus() {
  return this.expectedStatus;
}

const okConfig = {
  expectedStatus: 200
};

const createdConfig = {
  expectedStatus: 201
};

console.log(getExpectedStatus.call(okConfig));
console.log(getExpectedStatus.call(createdConfig));
```

---

### Задание 6

Не запускайте код. Сначала предскажите вывод.

```javascript
function formatRequest(method, path) {
  return method + ' ' + this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(formatRequest.call(apiClient, 'POST', '/orders'));
```

---

### Задание 7

Не запускайте код. Сначала предскажите вывод.

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

console.log(validateStatus.call(response, config));
```

Объясните, почему результат может быть неожиданным.

---

## Кто выбирает receiver?

### Задание 8

Для каждого вызова ответьте:

* кто выбирает receiver;
* что становится `this`;
* какие значения попадают в parameters.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl
};

apiClient.buildUrl('/users');
buildUrl.call(apiClient, '/orders');
```

---

## Отладка

### Задание 9

Код должен вывести:

```text
https://api.example.test/users
```

Но сейчас receiver выбран неправильно.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.call('/users'));
```

Исправьте код и объясните ошибку.

---

### Задание 10

Код должен вернуть `true`, но возвращает `false`.

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

console.log(validateStatus.call(response, config));
```

Исправьте порядок arguments в `call()`.

---

## QA-задачи

### Задание 11

Создайте function `statusMatches(response)`.

Она должна сравнивать:

```javascript
response.status === this.expectedStatus
```

Создайте два config objects:

* `okConfig` со status `200`;
* `createdConfig` со status `201`.

Вызовите одну и ту же function через `call()` с обоими configs.

---

### Задание 12

Создайте function `buildApiUrl(path)`.

Она должна возвращать:

```javascript
this.baseUrl + path
```

Создайте два client objects:

* `usersApi`;
* `ordersApi`.

Вызовите `buildApiUrl.call(...)` для обоих clients.

---

## Мини-проект

### Задание 13

Создайте небольшой набор reusable QA helpers через `call()`.

Требования:

1. Создайте function `formatRequest(method, path)`.
2. Она должна использовать `this.baseUrl`.
3. Создайте function `statusMatches(response)`.
4. Она должна использовать `this.expectedStatus`.
5. Создайте object `usersApiConfig`.
6. Создайте object `ordersApiConfig`.
7. Создайте object `okAssertionConfig`.
8. Вызовите functions через `call()`.
9. Для каждого вызова подпишите, кто выбирает receiver.
10. Нарисуйте схему:

```text
function.call(receiver, argument)
│
├── receiver -> this
└── argument -> parameter
```

Дополнительно объясните:

* почему `call()` подходит для этой задачи;
* где обычный method call был бы читаемее;
* почему `call()` не сохраняет receiver навсегда.
