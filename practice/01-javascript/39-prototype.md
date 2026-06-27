# Практика: Prototype

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем Prototype существует;
* видеть duplicated methods;
* отличать own property from inherited property;
* описывать property lookup;
* понимать, где живет shared behavior;
* использовать `Object.getPrototypeOf()` для проверки prototype;
* применять Prototype model к Page Objects and API clients.

---

## 1. Концептуальные вопросы

1. Why is shared behavior useful?
2. Почему duplicated methods become a maintenance problem?
3. Что такое prototype object на концептуальном уровне?
4. Чем own property отличается от inherited property?
5. Где JavaScript ищет property сначала?
6. Что происходит, если property не найдена directly on object?
7. Почему Prototype не стоит объяснять primarily as inheritance?
8. Почему per-object state обычно должен быть own property?
9. Что возвращает `Object.getPrototypeOf(object)`?
10. Почему `__proto__` не нужен для основной mental model этой главы?

---

## 2. Identify own property

### Задание 2.1

```javascript
const userBehavior = {
  describe() {
    return `${this.name} [${this.role}]`;
  }
};

const user = {
  name: 'Anna',
  role: 'admin'
};

Object.setPrototypeOf(user, userBehavior);
```

Ответьте:

* Какие properties are own properties of `user`?
* Где находится `describe`?
* Is `describe` copied into `user`?

### Задание 2.2

```javascript
const apiBehavior = {
  describeRequest(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  }
};

const apiClient = {
  baseUrl: 'https://api.example.test'
};

Object.setPrototypeOf(apiClient, apiBehavior);
```

Ответьте:

* Which value is own data?
* Which behavior is shared?
* What object is prototype for `apiClient`?

---

## 3. Identify inherited property

### Задание 3.1

```javascript
const pageBehavior = {
  describePage() {
    return this.name;
  }
};

const loginPage = {
  name: 'LoginPage'
};

Object.setPrototypeOf(loginPage, pageBehavior);
```

Ответьте:

* Is `name` own or inherited?
* Is `describePage` own or inherited?
* What does `loginPage.describePage()` read through `this`?

### Задание 3.2

```javascript
const behavior = {
  status: 'shared',
  printStatus() {
    return this.status;
  }
};

const testRun = {
  status: 'local'
};

Object.setPrototypeOf(testRun, behavior);
```

Ответьте:

* What is `testRun.status`?
* Which `status` is read first?
* Why is this not a Prototype Chain question yet?

---

## 4. Property lookup

### Задание 4.1

Для кода:

```javascript
const userBehavior = {
  describe() {
    return `${this.name} [${this.role}]`;
  }
};

const user = {
  name: 'Anna',
  role: 'admin'
};

Object.setPrototypeOf(user, userBehavior);

console.log(user.describe());
```

Опишите lookup steps для `describe`.

### Задание 4.2

Для кода:

```javascript
const behavior = {
  format() {
    return 'formatted';
  }
};

const item = {
  name: 'report'
};

Object.setPrototypeOf(item, behavior);

console.log(item.missing);
```

Опишите, где JavaScript ищет `missing` and what result is produced.

---

## 5. Предскажите результат выполнения

### Задание 5.1

```javascript
const behavior = {
  describe() {
    return `${this.name}:${this.role}`;
  }
};

const user = {
  name: 'Anna',
  role: 'admin'
};

Object.setPrototypeOf(user, behavior);

console.log(user.describe());
console.log(Object.getPrototypeOf(user) === behavior);
```

Предскажите результат до запуска.

### Задание 5.2

```javascript
const behavior = {
  status: 'from prototype'
};

const object = {
  status: 'own status'
};

Object.setPrototypeOf(object, behavior);

console.log(object.status);
```

Предскажите результат до запуска.

### Задание 5.3

```javascript
const behavior = {
  describe() {
    return this.name;
  }
};

const firstUser = {
  name: 'Anna'
};

const secondUser = {
  name: 'Kate'
};

Object.setPrototypeOf(firstUser, behavior);
Object.setPrototypeOf(secondUser, behavior);

console.log(firstUser.describe === secondUser.describe);
console.log(secondUser.describe());
```

Предскажите результат до запуска.

---

## 6. Debugging tasks

### Задание 6.1

```javascript
const behavior = {
  describe() {
    return this.name;
  }
};

const user = {
  name: 'Anna',
  describe() {
    return 'local method';
  }
};

Object.setPrototypeOf(user, behavior);

console.log(user.describe());
```

Автор ожидал, что будет вызван method from prototype. Объясните, почему результат другой.

### Задание 6.2

```javascript
const behavior = {
  lastAction: 'none',
  setAction(action) {
    this.lastAction = action;
  }
};

const user = {
  name: 'Anna'
};

Object.setPrototypeOf(user, behavior);

user.setAction('login');

console.log(user.lastAction);
console.log(behavior.lastAction);
```

Объясните, где появляется `lastAction` after assignment through `this`.

### Задание 6.3

```javascript
const behavior = {
  describe() {
    return `${name} [${role}]`;
  }
};

const user = {
  name: 'Anna',
  role: 'admin'
};

Object.setPrototypeOf(user, behavior);

console.log(user.describe());
```

Исправьте ошибку and explain why shared method should use `this`.

---

## 7. QA-oriented tasks

### Задание 7.1

Создайте `apiClientBehavior` with method `describeRequest(endpoint)`.

Создайте два clients:

* `stagingClient`;
* `productionClient`.

У каждого client должен быть own `baseUrl`. Behavior должен быть shared.

### Задание 7.2

Создайте `pageBehavior` with method `describePage()`.

Создайте `loginPage` and `profilePage` with own `name`.

Покажите, что оба page objects use same shared method.

### Задание 7.3

Объясните:

> Почему Prototype model полезна для Page Objects, даже если в реальном проекте чаще используются classes?

### Задание 7.4

Опишите, какие данные API client должны быть own properties, а какое behavior можно вынести в shared prototype.

---

## 8. Мини-проект

Создайте small QA framework model.

Требования:

1. Создайте `validatorBehavior`.
2. Добавьте method `describeExpectation()` to shared behavior.
3. Добавьте method `describeActual()` to shared behavior.
4. Создайте `statusValidator` with own `expected` and `actual`.
5. Создайте `roleValidator` with own `expected` and `actual`.
6. Свяжите оба validators with `validatorBehavior`.
7. Выведите results of both methods for both validators.
8. Проверьте через `Object.getPrototypeOf()`, что both validators use same prototype.

После выполнения объясните:

* where own data lives;
* where shared behavior lives;
* why shared behavior is useful here.
