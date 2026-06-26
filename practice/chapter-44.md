# Практика: Classes

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем classes существуют;
* отличать class from instance;
* понимать constructor behavior;
* видеть own data on instances;
* понимать, что class methods use prototypes;
* предсказывать output of class-based code;
* применять classes к Page Objects and API clients.

---

## 1. Концептуальные вопросы

1. What repetitive work does class remove?
2. Why does class not replace prototypes?
3. What is a constructor?
4. What is an instance?
5. Where does instance own data live?
6. Are class methods copied into every instance?
7. Why is class useful for Page Objects?
8. When can object literal be clearer than class?
9. Why should constructor usually initialize data, not run heavy business logic?
10. What topic comes after classes in this course?

---

## 2. Identify constructor behavior

### Задание 2.1

```javascript
class PageObject {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
}

const loginPage = new PageObject('LoginPage', '/login');
```

Ответьте:

* What values enter constructor?
* What own properties appear on `loginPage`?
* What repetitive work did class remove?

### Задание 2.2

```javascript
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
}

const stagingClient = new ApiClient('https://staging.example.test');
const productionClient = new ApiClient('https://api.example.test');
```

Ответьте:

* Which data is different between instances?
* Why does this fit constructor?

---

## 3. Предскажите результат выполнения

### Задание 3.1

```javascript
class TestUser {
  constructor(email, role) {
    this.email = email;
    this.role = role;
  }

  describe() {
    return `${this.email} [${this.role}]`;
  }
}

const user = new TestUser('anna@example.test', 'admin');

console.log(user.describe());
```

### Задание 3.2

```javascript
class PageObject {
  constructor(name) {
    this.name = name;
  }

  describePage() {
    return this.name;
  }
}

const loginPage = new PageObject('LoginPage');
const profilePage = new PageObject('ProfilePage');

console.log(loginPage.describePage === profilePage.describePage);
```

### Задание 3.3

```javascript
class Validator {
  constructor(expected, actual) {
    this.expected = expected;
    this.actual = actual;
  }

  isValid() {
    return this.expected === this.actual;
  }
}

const statusValidator = new Validator(200, 201);

console.log(statusValidator.isValid());
```

---

## 4. Debugging tasks

### Задание 4.1

```javascript
class PageObject {
  constructor(name) {
    this.name = name;
  }
}

const loginPage = PageObject('LoginPage');
```

Объясните ошибку and fix code.

### Задание 4.2

```javascript
class PageObject {
  constructor(name) {
    this.name = name;
  }

  describePage() {
    return name;
  }
}

const loginPage = new PageObject('LoginPage');

console.log(loginPage.describePage());
```

Объясните проблему and fix method.

### Задание 4.3

```javascript
class ApiClient {
  constructor(baseUrl) {
    baseUrl = baseUrl;
  }
}

const client = new ApiClient('https://api.example.test');

console.log(client.baseUrl);
```

Объясните, почему `client.baseUrl` is not set correctly.

---

## 5. QA-oriented tasks

### Задание 5.1

Создайте `LoginPage` class.

Requirements:

* constructor receives `url`;
* instance stores own `url`;
* method `describePage()` returns readable page description.

### Задание 5.2

Создайте `ApiClient` class.

Requirements:

* constructor receives `name` and `baseUrl`;
* method `describeRequest(endpoint)` returns full request description;
* create staging and production clients.

### Задание 5.3

Создайте `StatusValidator` class.

Requirements:

* constructor receives `expected` and `actual`;
* method `isValid()` returns comparison result;
* method `describe()` returns expected/actual summary.

### Задание 5.4

Объясните:

> Why does class not replace prototypes?

---

## 6. Mini-project

Создайте small QA framework object model.

Requirements:

1. Create `ApiClient` class.
2. Constructor receives `name`, `baseUrl`.
3. Add method `buildUrl(endpoint)`.
4. Add method `describeRequest(endpoint)`.
5. Create `stagingClient`.
6. Create `productionClient`.
7. Print request descriptions for `/users`.
8. Show that both clients share same method function.
9. Explain where own data lives.
10. Explain where shared methods live at high level.

Do not use inheritance.
