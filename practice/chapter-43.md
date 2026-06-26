# Практика: Prototype Chain

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существует Prototype Chain;
* определять lookup order;
* отличать own properties from inherited properties;
* объяснять shadowing;
* предсказывать результат property lookup;
* понимать, почему JavaScript stops searching;
* применять модель к QA framework objects.

---

## 1. Концептуальные вопросы

1. What problem does Prototype Chain solve?
2. Why is Prototype Chain a lookup algorithm, not an inheritance hierarchy?
3. Where does property lookup start?
4. What happens when property is found on current object?
5. What happens when property is not found on current object?
6. Why does JavaScript stop searching?
7. What is shadowing?
8. Why does own property win over inherited property?
9. What role does `Object.prototype` play in ordinary object lookup?
10. Why can deep chains hurt readability?

---

## 2. Identify lookup order

### Задание 2.1

```javascript
const frameworkBehavior = {
  formatError() {
    return `${this.name}: error`;
  }
};

const pageBehavior = {
  describePage() {
    return this.name;
  }
};

const loginPage = {
  name: 'LoginPage'
};

Object.setPrototypeOf(pageBehavior, frameworkBehavior);
Object.setPrototypeOf(loginPage, pageBehavior);
```

Опишите lookup order для:

* `loginPage.name`;
* `loginPage.describePage`;
* `loginPage.formatError`;
* `loginPage.missingProperty`.

### Задание 2.2

```javascript
const baseBehavior = {
  format() {
    return 'base';
  }
};

const serviceBehavior = {};

const client = {};

Object.setPrototypeOf(serviceBehavior, baseBehavior);
Object.setPrototypeOf(client, serviceBehavior);
```

Где JavaScript найдет `client.format`?

---

## 3. Identify own vs inherited property

### Задание 3.1

```javascript
const behavior = {
  status: 'shared',
  describeStatus() {
    return this.status;
  }
};

const testRun = {
  status: 'local'
};

Object.setPrototypeOf(testRun, behavior);
```

Ответьте:

* Which property is own?
* Which property is inherited?
* Which `status` wins?

### Задание 3.2

```javascript
const reportingBehavior = {
  formatFailure() {
    return 'failure';
  }
};

const validatorBehavior = {
  isValid() {
    return true;
  }
};

const validator = {
  name: 'StatusValidator'
};

Object.setPrototypeOf(validatorBehavior, reportingBehavior);
Object.setPrototypeOf(validator, validatorBehavior);
```

Classify:

* `validator.name`;
* `validator.isValid`;
* `validator.formatFailure`.

---

## 4. Предскажите результат выполнения

### Задание 4.1

```javascript
const first = {
  value: 'first'
};

const second = {
  value: 'second'
};

const object = {};

Object.setPrototypeOf(first, second);
Object.setPrototypeOf(object, first);

console.log(object.value);
```

### Задание 4.2

```javascript
const frameworkBehavior = {
  describe() {
    return 'framework';
  }
};

const pageBehavior = {
  describe() {
    return 'page';
  }
};

const loginPage = {};

Object.setPrototypeOf(pageBehavior, frameworkBehavior);
Object.setPrototypeOf(loginPage, pageBehavior);

console.log(loginPage.describe());
```

### Задание 4.3

```javascript
const behavior = {
  getName() {
    return this.name;
  }
};

const object = {
  name: 'local'
};

Object.setPrototypeOf(object, behavior);

console.log(object.getName());
```

---

## 5. Debugging tasks

### Задание 5.1

```javascript
const sharedBehavior = {
  role: 'shared role'
};

const user = {
  role: 'admin'
};

Object.setPrototypeOf(user, sharedBehavior);

console.log(user.role);
```

Автор ожидал `shared role`. Объясните проблему.

### Задание 5.2

```javascript
const frameworkBehavior = {
  formatError() {
    return `${name}: error`;
  }
};

const page = {
  name: 'LoginPage'
};

Object.setPrototypeOf(page, frameworkBehavior);

console.log(page.formatError());
```

Исправьте ошибку.

### Задание 5.3

```javascript
const base = {
  describe() {
    return 'base';
  }
};

const middle = {};
const object = {};

Object.setPrototypeOf(middle, base);
Object.setPrototypeOf(object, middle);

console.log(object.missing());
```

Объясните, почему эта ошибка появляется не во время property lookup, а во время call.

---

## 6. QA-oriented tasks

### Задание 6.1

Создайте chain:

```text
loginPage
│
▼
pageBehavior
│
▼
frameworkBehavior
```

Requirements:

* `loginPage` has own `name`;
* `pageBehavior` has `describePage()`;
* `frameworkBehavior` has `formatError()`;
* both methods should work through `loginPage`.

### Задание 6.2

Создайте API client chain:

```text
usersClient
│
▼
serviceBehavior
│
▼
frameworkBehavior
```

Requirements:

* `usersClient` has own `baseUrl` and `serviceName`;
* `serviceBehavior` has `buildEndpoint(id)`;
* `frameworkBehavior` has `describeRequest(endpoint)`.

### Задание 6.3

Объясните:

> Why can Prototype Chain make debugging harder if it is too deep?

### Задание 6.4

Ответьте:

> Why does JavaScript stop searching?

---

## 7. Mini-project

Создайте small assertion infrastructure model.

Requirements:

1. `reportingBehavior` contains `formatFailure()`.
2. `validatorBehavior` contains `isValid()`.
3. `statusValidator` has own `name`, `expected`, `actual`.
4. `roleValidator` has own `name`, `expected`, `actual`.
5. `validatorBehavior` should use `reportingBehavior` as prototype.
6. Both validators should use `validatorBehavior` as prototype.
7. Print `isValid()` and `formatFailure()` for both validators.
8. Explain lookup order for `statusValidator.formatFailure`.

Do not use classes.
