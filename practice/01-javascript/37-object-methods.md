# Практика: Object Methods

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существуют object methods;
* отличать состояние from поведение;
* определять methods in object;
* понимать обычный вызов метода;
* связывать вызов метода с объектом выполнения и `this`;
* предсказывать вывод;
* находить ошибки with detached methods;
* применять methods in Automation QA helpers.

---

## 1. Концептуальные вопросы

1. Почему object может содержать не только data, но и поведение?
2. Что такое состояние?
3. Что такое поведение?
4. Почему method является обычной функцией?
5. Почему function становится method при вызове через объект?
6. Как `this` связан с обычным вызовом `object.method()`?
7. Почему поведение должно относиться к объекту?
8. Когда обычная функция лучше, чем method?
9. Почему arrow functions as methods требуют осторожности?
10. Где object methods полезны в Automation QA?

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

Какие properties are состояние? Какая property is method?

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

Почему `describe()` относится к `config`?

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

Какие methods используют состояние объекта?

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

## 4. Задания на отладку

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

Объясните проблему. Используйте знания из глав `this` и `bind()`.

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

## 5. QA-задачи

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

> Why should this поведение belong to the object?

Для каждого объекта из заданий 5.1-5.3.

---

## 6. Мини-проект

Создайте small QA helper module.

Требования:

1. Создайте `apiClient` with `baseUrl`, `buildUrl(path)`, `describeRequest(method, path)`.
2. Создайте `assertions` with `suite`, `statusLine(testName, actualStatus, expectedStatus)`.
3. Создайте `testUser` with `name`, `email`, `role`, `describe()`.
4. Вызовите все methods.
5. Объясните, где состояние и где поведение.
6. Объясните, почему methods относятся к своим объектам.

---

## 7. Контрольные вопросы

1. Что делает `object.method()`?
2. Что является объект выполнения in `apiClient.buildUrl('/users')`?
3. Почему method can use `this.baseUrl`?
4. Что произойдет conceptually if method is detached?
5. Почему Page Object естественно использует object methods?
