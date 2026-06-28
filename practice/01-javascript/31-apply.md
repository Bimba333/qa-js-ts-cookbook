# Практика: apply()

## Проверка понимания

1. Зачем существует `apply()`?

2. Какую проблему решает `apply()`: объект выполнения или arguments?

3. Что общего у `call()` и `apply()`?

4. Чем отличается передача arguments в `call()` и `apply()`?

5. Что становится `this` в `functionObject.apply(объект выполнения, argumentsList)`?

6. Как значения из array попадают в parameters?

7. Что такое array-like collection на высоком уровне?

8. Когда `apply()` удобнее `call()`?

---

## Анализ кода

### Задание 1

Определите объект выполнения и parameters.

```javascript
function formatRequest(method, path) {
  return method + ' ' + this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const requestParts = ['GET', '/users'];

console.log(formatRequest.apply(apiClient, requestParts));
```

Ответьте:

* что становится `this`;
* что получает parameter `method`;
* что получает parameter `path`;
* какой будет результат.

---

### Задание 2

Сравните два вызова.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

buildUrl.call(apiClient, '/users');
buildUrl.apply(apiClient, ['/users']);
```

Ответьте:

* одинаковый ли объект выполнения;
* одинаковый ли результат;
* что отличается.

---

## Предскажите результат выполнения кода

### Задание 3

Не запускайте код. Сначала предскажите вывод.

```javascript
function describeStatus(status, path) {
  return this.serviceName + ': ' + status + ' ' + path;
}

const serviceConfig = {
  serviceName: 'users-api'
};

const data = [200, '/users'];

console.log(describeStatus.apply(serviceConfig, data));
```

---

### Задание 4

Не запускайте код. Сначала предскажите вывод.

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

---

### Задание 5

Не запускайте код. Сначала предскажите, что произойдет.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.apply(apiClient, '/users'));
```

Объясните ошибку.

---

## call vs apply

### Задание 6

Перепишите вызов через `apply()`.

```javascript
formatRequest.call(apiClient, 'POST', '/orders', '{"id":1}');
```

Исходные данные:

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};
```

---

### Задание 7

Перепишите вызов через `call()`.

```javascript
validateResponse.apply(config, [200, '/users', '{"name":"Anna"}']);
```

Исходные данные:

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
```

---

## Отладка

### Задание 8

Код должен вернуть:

```text
https://api.example.test/users
```

Но сейчас arguments переданы неправильно.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.apply(apiClient, '/users'));
```

Исправьте код.

---

### Задание 9

Код должен вернуть `true`, но объект выполнения и array со списком arguments перепутаны.

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

console.log(validateStatus.apply([response], config));
```

Исправьте вызов `apply()`.

---

## QA-задачи

### Задание 10

Создайте функцию `validateResponse(status, path, body)`.

Она должна использовать:

```javascript
this.expectedStatus
this.expectedPath
```

Создайте config object и array `responseParts`.

Вызовите function через `apply()`.

---

### Задание 11

Создайте функцию `formatRequest(method, path, body)`.

Она должна использовать:

```javascript
this.baseUrl
```

Создайте два config objects:

* `usersApi`;
* `ordersApi`.

Создайте два arrays с request data.

Вызовите одну function через `apply()` для обоих configs.

---

## Мини-проект

### Задание 12

Создайте небольшой QA request runner.

Требования:

1. Создайте функцию `buildRequest(method, path, body)`.
2. Function должна использовать `this.baseUrl`.
3. Создайте функцию `validateRequest(status, path, body)`.
4. Function должна использовать `this.expectedStatus` и `this.expectedPath`.
5. Создайте объект `apiConfig`.
6. Создайте объект `assertionConfig`.
7. Создайте array `requestParts`.
8. Создайте array `responseParts`.
9. Вызовите обе functions через `apply()`.
10. Для каждого вызова подпишите объект выполнения и parameter mapping.

Нарисуйте схему:

```text
function.apply(receiver, values)
│
├── receiver  -> this
├── values[0] -> first parameter
├── values[1] -> second parameter
└── values[2] -> third parameter
```

Дополнительно ответьте:

* почему `apply()` удобен в этой задаче;
* где `call()` был бы читаемее;
* почему объект выполнения handling не отличается от `call()`.
