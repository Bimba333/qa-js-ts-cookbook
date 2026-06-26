# Практика: Class Inheritance

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существует class inheritance;
* находить duplicated class behavior;
* отличать base class from derived class;
* понимать `extends` на базовом уровне;
* определять inherited methods;
* предсказывать overriding behavior;
* связывать inheritance with prototype lookup;
* применять inheritance в QA framework examples.

---

## 1. Концептуальные вопросы

1. Why does inheritance exist?
2. Why copying identical methods into every class is a bad idea?
3. What is a base class?
4. What is a derived class?
5. What does `extends` express?
6. Does inheritance copy methods?
7. How is inheritance related to Prototype Chain?
8. What is method overriding?
9. Why should base class contain only common behavior?
10. Why is `super` not needed to understand basic inherited method lookup?

---

## 2. Identify inherited methods

### Задание 2.1

```javascript
class BasePage {
  open() {
    return 'open page';
  }

  waitReady() {
    return 'ready';
  }
}

class LoginPage extends BasePage {
  login() {
    return 'login';
  }
}
```

Ответьте:

* Which methods belong to `BasePage`?
* Which method belongs to `LoginPage`?
* Which methods can `new LoginPage()` use?

### Задание 2.2

```javascript
class BaseApiClient {
  describeRequest() {
    return 'request';
  }
}

class UsersClient extends BaseApiClient {
  userEndpoint() {
    return '/users';
  }
}
```

Classify:

* `describeRequest`;
* `userEndpoint`.

---

## 3. Предскажите результат выполнения

### Задание 3.1

```javascript
class BasePage {
  open() {
    return 'open page';
  }
}

class LoginPage extends BasePage {}

const loginPage = new LoginPage();

console.log(loginPage.open());
```

### Задание 3.2

```javascript
class BasePage {
  describe() {
    return 'base';
  }
}

class LoginPage extends BasePage {
  describe() {
    return 'login';
  }
}

const loginPage = new LoginPage();

console.log(loginPage.describe());
```

### Задание 3.3

```javascript
class BaseValidator {
  format() {
    return 'base format';
  }
}

class StatusValidator extends BaseValidator {
  isValid() {
    return false;
  }
}

const validator = new StatusValidator();

console.log(validator.format());
console.log(validator.isValid());
```

---

## 4. Debugging tasks

### Задание 4.1

```javascript
class BasePage {
  open() {
    return 'open page';
  }
}

class LoginPage {
  login() {
    return 'login';
  }
}

const loginPage = new LoginPage();

console.log(loginPage.open());
```

Автор ожидал inherited `open()`. Исправьте код.

### Задание 4.2

```javascript
class BasePage {
  login() {
    return 'base login';
  }
}

class LoginPage extends BasePage {}
```

Объясните, почему `login()` probably should not be in `BasePage`.

### Задание 4.3

```javascript
class BasePage {
  describe() {
    return 'base page';
  }
}

class LoginPage extends BasePage {
  describe() {
    return 'login page';
  }
}
```

Объясните what method is used and why.

---

## 5. QA-oriented tasks

### Задание 5.1

Create `BasePage` with:

* `open(pageName)`;
* `waitReady(pageName)`.

Create `LoginPage extends BasePage` with:

* `login()`.

Show that `LoginPage` instance can use inherited and own methods.

### Задание 5.2

Create `BaseApiClient` with:

* `describeRequest(serviceName, endpoint)`.

Create:

* `UsersClient extends BaseApiClient`;
* `OrdersClient extends BaseApiClient`.

Each derived class should have its own endpoint method.

### Задание 5.3

Create `BaseValidator` with:

* `formatExpected(value)`;
* `formatActual(value)`.

Create `StatusValidator extends BaseValidator` with:

* `isValid(expected, actual)`.

### Задание 5.4

Explain:

> Why should inheritance describe real shared behavior, not just hide random duplication?

---

## 6. Mini-project

Create small Page Object inheritance model.

Requirements:

1. Create `BasePage`.
2. Add shared method `open(pageName)`.
3. Add shared method `waitReady(pageName)`.
4. Create `LoginPage extends BasePage`.
5. Add method `login()`.
6. Create `ProfilePage extends BasePage`.
7. Add method `updateProfile()`.
8. Create instances of both pages.
9. Call inherited methods on both instances.
10. Call specific methods on each instance.
11. Explain where common behavior lives.
12. Explain why methods are reused, not copied.

Do not use `super`.
