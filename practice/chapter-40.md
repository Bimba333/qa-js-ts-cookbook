# Практика: Object Methods

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существуют object methods;
* отличать state from behavior;
* определять methods in object;
* понимать ordinary method call;
* связывать method invocation with receiver and `this`;
* предсказывать output;
* находить ошибки with detached methods;
* применять methods in Automation QA helpers.

---

## 1. Концептуальные вопросы

1. Почему object может содержать не только data, но и behavior?
2. Что такое state?
3. Что такое behavior?
4. Почему method is ordinary function?
5. Почему method становится method because it is called through object?
6. Как `this` связан with ordinary `object.method()` call?
7. Почему behavior should belong to the object?
8. Когда ordinary function лучше, чем method?
9. Почему arrow functions as methods требуют осторожности?
10. Где object methods полезны in Automation QA?

---

## 2. Identify methods

### Задание 2.1

```javascript
const user = {
  name: 'Anna',
  role: 'admin',
  describe() {
    return this.name + ' is ' + this.role;
  }
};
```

Какие properties are state? Какая property is method?

### Задание 2.2

```javascript
const config = {
  baseUrl: 'https://api.example.test',
  timeout: 5000,
  describe() {
    return this.baseUrl + ' timeout=' + this.timeout;
  }
};
```

Почему `describe()` belongs to `config`?

### Задание 2.3

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  },
  requestName(method, path) {
    return method + ' ' + path;
  }
};
```

Какие methods use object state?

---

## 3. Предскажите результат выполнения

### Задание 3.1

```javascript
const user = {
  name: 'Anna',
  role: 'admin',
  describe() {
    return this.name + ' is ' + this.role;
  }
};

console.log(user.describe());
```

### Задание 3.2

```javascript
const account = {
  owner: 'Anna',
  balance: 100,
  deposit(amount) {
    this.balance = this.balance + amount;
  },
  getBalance() {
    return this.balance;
  }
};

account.deposit(50);

console.log(account.getBalance());
```

### Задание 3.3

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  }
};

console.log(apiClient.buildUrl('/users'));
```

---

## 4. Debugging tasks

### Задание 4.1

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return baseUrl + path;
  }
};

console.log(apiClient.buildUrl('/users'));
```

Исправьте method.

### Задание 4.2

```javascript
const user = {
  name: 'Anna',
  describe() {
    return this.name;
  }
};

const describe = user.describe;

console.log(describe());
```

Объясните проблему. Используйте знания из глав `this` and `bind()`.

### Задание 4.3

```javascript
const assertionHelper = {
  suite: 'smoke',
  formatStatus(testName, passed) {
    return suite + ': ' + testName + ' -> ' + passed;
  }
};
```

Исправьте method.

---

## 5. QA-oriented tasks

### Задание 5.1

Создайте `apiClient` object with:

* `baseUrl`;
* method `buildUrl(path)`;
* method `describeRequest(method, path)`.

### Задание 5.2

Создайте `assertionHelper` object with:

* `suite`;
* method `formatStatus(testName, actualStatus, expectedStatus)`.

### Задание 5.3

Создайте `requestBuilder` object with:

* `defaultRole`;
* method `createUser(name, email)`, который returns user payload object.

### Задание 5.4

Ответьте:

> Why should this behavior belong to the object?

Для каждого объекта из заданий 5.1-5.3.

---

## 6. Мини-проект

Создайте small QA helper module.

Требования:

1. Создайте `apiClient` with `baseUrl`, `buildUrl(path)`, `describeRequest(method, path)`.
2. Создайте `assertions` with `suite`, `statusLine(testName, actualStatus, expectedStatus)`.
3. Создайте `testUser` with `name`, `email`, `role`, `describe()`.
4. Вызовите все methods.
5. Объясните, где state and где behavior.
6. Объясните, почему methods belong to their objects.

---

## 7. Контрольные вопросы

1. Что делает `object.method()`?
2. Что является receiver in `apiClient.buildUrl('/users')`?
3. Почему method can use `this.baseUrl`?
4. Что произойдет conceptually if method is detached?
5. Почему Page Object naturally uses object methods?
