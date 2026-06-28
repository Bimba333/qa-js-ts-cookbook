# Решения: Classes

## 1. Концептуальные вопросы

### 1.1 What repetitive work does class remove?

**Ответ:** repeated object creation setup.

**Объяснение:** class combines constructor for own data and shared methods in one readable template.

**Распространённая ошибка:** think class exists only to make syntax look familiar.

**Связь с Automation QA:** Page Objects and API clients often need many similar objects.

### 1.2 Why does class not replace prototypes?

**Ответ:** class uses prototypes for methods.

**Объяснение:** instances have own data, while class methods are available through prototype lookup.

**Распространённая ошибка:** think JavaScript becomes class-based after `class` syntax.

**Связь с Automation QA:** debugging Page Object methods still requires prototype mental model.

### 1.3 What is a constructor?

**Ответ:** constructor is special method that runs during instance creation.

**Объяснение:** it usually initializes own data on the new object.

**Распространённая ошибка:** put heavy test actions or assertions into constructor.

**Связь с Automation QA:** constructor can store `page`, `baseUrl`, config or expected значения.

### 1.4 What is an instance?

**Ответ:** instance is object created from class.

**Объяснение:** `new PageObject(...)` creates an instance.

**Распространённая ошибка:** confuse class template with object instance.

**Связь с Automation QA:** `loginPage` is an instance of `LoginPage` class.

### 1.5 Where does instance own data live?

**Ответ:** directly on the instance.

**Объяснение:** assignments like `this.name = name` create or update own properties.

**Распространённая ошибка:** think all class data lives in prototype.

**Связь с Automation QA:** each API client instance can have its own `baseUrl`.

### 1.6 Are class methods copied into every instance?

**Ответ:** no.

**Объяснение:** methods are shared through prototype lookup.

**Распространённая ошибка:** imagine every object stores separate method copy.

**Связь с Automation QA:** many Page Objects can share the same method implementation.

### 1.7 Why is class useful for Page Objects?

**Ответ:** Page Objects often share structure and поведение.

**Объяснение:** class makes repeated page object creation readable and consistent.

**Распространённая ошибка:** put all test logic into Page Object constructor.

**Связь с Automation QA:** class can model pages with own locators/config and shared actions.

### 1.8 When can object literal be clearer?

**Ответ:** when only one simple object is needed.

**Объяснение:** class is useful for repeated creation, not for every object.

**Распространённая ошибка:** wrap every helper in class automatically.

**Связь с Automation QA:** simple expected API response can remain plain object.

### 1.9 Why should constructor not run heavy business logic?

**Ответ:** because object creation should stay predictable.

**Объяснение:** constructor should usually initialize object состояние; heavy actions make instances hard to create and test.

**Распространённая ошибка:** send requests or assert inside constructor.

**Связь с Automation QA:** creating `ApiClient` should not automatically call API.

### 1.10 What topic comes next?

**Ответ:** Class Inheritance.

**Объяснение:** after creating objects with shared prototype поведение, next question is how one class can reuse поведение from another class.

**Распространённая ошибка:** start using `extends` before understanding basic class/prototype relationship.

**Связь с Automation QA:** shared base Page Object поведение will be easier to discuss after this chapter.

---

## 2. Identify constructor поведение

### 2.1

**Ответ:**

* Values entering constructor: `'LoginPage'`, `'/login'`.
* Own properties: `name`, `url`.
* Removed work: manually creating object and assigning the same property structure every time.

**Объяснение:** `this.name = name` and `this.url = url` write data to the new instance.

**Распространённая ошибка:** think constructor parameters automatically become properties.

**Связь с Automation QA:** Page Object constructor commonly stores page name, URL or Playwright page reference.

### 2.2

**Ответ:**

* Different data: `baseUrl`.
* It fits constructor because each client instance needs its own configuration.

**Объяснение:** общие methods могут оставаться на class prototype, а `baseUrl` относится к каждому instance.

**Распространённая ошибка:** store environment-specific `baseUrl` as shared method data.

**Связь с Automation QA:** staging and production clients should not accidentally share mutable environment состояние.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
anna@example.test [admin]
```

**Объяснение:** constructor stores `email` and `role`; method reads them through `this`.

**Распространённая ошибка:** think `describe()` receives constructor arguments directly.

**Связь с Automation QA:** test user objects can format readable debug вывод.

### 3.2

**Ответ:**

```text
true
```

**Объяснение:** both instances use same method through prototype lookup.

**Распространённая ошибка:** expect `false` because instances are different objects.

**Связь с Automation QA:** many Page Object instances can share the same action methods.

### 3.3

**Ответ:**

```text
false
```

**Объяснение:** `200 === 201` is false. Constructor stores значения as own properties.

**Распространённая ошибка:** confuse expected and actual значения.

**Связь с Automation QA:** validators often compare expected and actual test results.

---

## 4. Задания на отладку

### 4.1

**Ответ:**

```javascript
const loginPage = new PageObject('LoginPage');
```

**Объяснение:** class must be called with `new`; `new` starts instance creation.

**Распространённая ошибка:** treat class as ordinary function call.

**Связь с Automation QA:** Page Object instances are usually created with `new`.

### 4.2

**Ответ:**

```javascript
describePage() {
  return this.name;
}
```

**Объяснение:** `name` alone is variable lookup. `this.name` reads instance property.

**Распространённая ошибка:** forget that constructor properties do not become local variables in methods.

**Связь с Automation QA:** methods should read page/client-specific data through `this`.

### 4.3

**Ответ:**

```javascript
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
}
```

**Объяснение:** `baseUrl = baseUrl` only assigns parameter to itself. `this.baseUrl` writes property to instance.

**Распространённая ошибка:** forget `this` in constructor assignment.

**Связь с Automation QA:** API client config must be stored on the client instance.

---

## 5. QA-задачи

### 5.1

**Ответ:**

```javascript
class LoginPage {
  constructor(url) {
    this.url = url;
  }

  describePage() {
    return `LoginPage: ${this.url}`;
  }
}

const loginPage = new LoginPage('/login');

console.log(loginPage.describePage());
```

**Объяснение:** `url` is own data. `describePage` is shared class method.

**Распространённая ошибка:** hardcode URL inside method and lose instance flexibility.

**Связь с Automation QA:** Page Object can store route or selectors as instance data.

### 5.2

**Ответ:**

```javascript
class ApiClient {
  constructor(name, baseUrl) {
    this.name = name;
    this.baseUrl = baseUrl;
  }

  describeRequest(endpoint) {
    return `${this.name}: ${this.baseUrl}${endpoint}`;
  }
}

const stagingClient = new ApiClient('staging', 'https://staging.example.test');
const productionClient = new ApiClient('production', 'https://api.example.test');

console.log(stagingClient.describeRequest('/users'));
console.log(productionClient.describeRequest('/users'));
```

**Объяснение:** each instance stores own config; method is reused.

**Распространённая ошибка:** create separate duplicated methods for every environment.

**Связь с Automation QA:** useful for REST API testing across environments.

### 5.3

**Ответ:**

```javascript
class StatusValidator {
  constructor(expected, actual) {
    this.expected = expected;
    this.actual = actual;
  }

  isValid() {
    return this.expected === this.actual;
  }

  describe() {
    return `expected ${this.expected}, actual ${this.actual}`;
  }
}

const validator = new StatusValidator(200, 201);

console.log(validator.isValid());
console.log(validator.describe());
```

**Объяснение:** expected/actual are own data; validation and description are общее поведение.

**Распространённая ошибка:** make `expected` and `actual` shared data.

**Связь с Automation QA:** validators are common framework objects.

### 5.4

**Ответ:** class does not replace prototypes because class methods are still available through prototype lookup.

**Объяснение:** class improves object creation syntax, but objects still use prototype relationships.

**Распространённая ошибка:** think class introduces separate class-based object model.

**Связь с Automation QA:** understanding prototypes helps debug methods on Page Object classes.

---

## 6. Мини-проект

**Ответ:**

```javascript
class ApiClient {
  constructor(name, baseUrl) {
    this.name = name;
    this.baseUrl = baseUrl;
  }

  buildUrl(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  }

  describeRequest(endpoint) {
    return `${this.name}: ${this.buildUrl(endpoint)}`;
  }
}

const stagingClient = new ApiClient('staging', 'https://staging.example.test');
const productionClient = new ApiClient('production', 'https://api.example.test');

console.log(stagingClient.describeRequest('/users'));
console.log(productionClient.describeRequest('/users'));
console.log(stagingClient.describeRequest === productionClient.describeRequest);
```

Возможный вывод:

```text
staging: https://staging.example.test/users
production: https://api.example.test/users
true
```

**Объяснение:** `name` and `baseUrl` live as own data on each instance. `buildUrl` and `describeRequest` are shared methods available through prototype lookup.

**Распространённая ошибка:** expect method comparison to be `false` because instances are different.

**Связь с Automation QA:** one API client class can create clients for multiple environments without duplicating methods.

**Возможное улучшение:** keep request execution separate from constructor so client creation remains cheap and predictable.
