# Решения: Class Inheritance

## 1. Концептуальные вопросы

### 1.1 Why does inheritance exist?

**Ответ:** to reuse common behavior between classes.

**Объяснение:** if several classes repeat the same methods, common methods can live in base class.

**Распространённая ошибка:** think inheritance exists to make code look more object-oriented.

**Связь с Automation QA:** `BasePage` can keep common page actions.

### 1.2 Why copying identical methods is bad?

**Ответ:** because every copy must be maintained separately.

**Объяснение:** one missed update can make classes behave inconsistently.

**Распространённая ошибка:** accept duplication because tests still pass today.

**Связь с Automation QA:** duplicated `waitReady()` in many Page Objects becomes fragile.

### 1.3 What is a base class?

**Ответ:** class that contains common behavior for derived classes.

**Объяснение:** base class should hold methods that truly belong to all derived classes.

**Распространённая ошибка:** put page-specific methods into base class.

**Связь с Automation QA:** `BasePage` may contain `open()` and `waitReady()`.

### 1.4 What is a derived class?

**Ответ:** class that extends base class and adds specific behavior.

**Объяснение:** derived class can use inherited methods and define its own methods.

**Распространённая ошибка:** make derived class empty when it needs specific behavior.

**Связь с Automation QA:** `LoginPage` can extend `BasePage` and add `login()`.

### 1.5 What does `extends` express?

**Ответ:** relationship between derived class and base class.

**Объяснение:** this relationship allows method lookup to reach base class behavior.

**Распространённая ошибка:** think `extends` copies methods.

**Связь с Automation QA:** `LoginPage extends BasePage` means LoginPage can reuse common page behavior.

### 1.6 Does inheritance copy methods?

**Ответ:** no.

**Объяснение:** methods are found through lookup based on the class/prototype relationship.

**Распространённая ошибка:** imagine each derived class receives physical method copies.

**Связь с Automation QA:** one base method can be reused by many page classes.

### 1.7 How is inheritance related to Prototype Chain?

**Ответ:** inheritance builds on prototype lookup.

**Объяснение:** if method is not found closer to instance, lookup can continue to base class behavior.

**Распространённая ошибка:** think inheritance creates a separate lookup mechanism.

**Связь с Automation QA:** inherited Page Object methods still follow lookup rules.

### 1.8 What is method overriding?

**Ответ:** derived class defines method with same name as base class.

**Объяснение:** derived method is found first and base method is not used for that call.

**Распространённая ошибка:** think overriding deletes base method.

**Связь с Automation QA:** specific page can override generic behavior when needed.

### 1.9 Why should base class contain only common behavior?

**Ответ:** because every derived class receives access to base behavior.

**Объяснение:** if base contains specific behavior, unrelated classes get confusing methods.

**Распространённая ошибка:** turn base class into a storage place for random helpers.

**Связь с Automation QA:** `login()` should not be available on `ProfilePage`.

### 1.10 Why is `super` not needed here?

**Ответ:** because this chapter explains simple inherited method lookup.

**Объяснение:** `super` is needed when derived class wants to call base class behavior explicitly; that is next chapter.

**Распространённая ошибка:** introduce `super` before understanding basic inheritance.

**Связь с Automation QA:** first understand that `LoginPage` can use `BasePage.open()`.

---

## 2. Identify inherited methods

### 2.1

**Ответ:**

* `BasePage`: `open`, `waitReady`.
* `LoginPage`: `login`.
* `new LoginPage()` can use `open`, `waitReady`, `login`.

**Объяснение:** `open` and `waitReady` are inherited through `extends`.

**Распространённая ошибка:** think `LoginPage` instance can use only methods written directly in `LoginPage`.

**Связь с Automation QA:** Page Object inherits common actions and adds page-specific actions.

### 2.2

**Ответ:**

* `describeRequest`: inherited method from `BaseApiClient`.
* `userEndpoint`: specific method from `UsersClient`.

**Объяснение:** common request description belongs to base client; user endpoint belongs to specific service client.

**Распространённая ошибка:** duplicate `describeRequest` in every service client.

**Связь с Automation QA:** API framework clients often share request formatting.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
open page
```

**Объяснение:** `LoginPage` does not define `open`, so lookup finds inherited `BasePage.open`.

**Распространённая ошибка:** expect error because `open` is not written in `LoginPage`.

**Связь с Automation QA:** page instance can use common base page methods.

### 3.2

**Ответ:**

```text
login
```

**Объяснение:** `LoginPage.describe` is closer and overrides `BasePage.describe`.

**Распространённая ошибка:** expect base method to win because it is "base".

**Связь с Automation QA:** page-specific behavior can override generic behavior.

### 3.3

**Ответ:**

```text
base format
false
```

**Объяснение:** `format` is inherited from `BaseValidator`; `isValid` belongs to `StatusValidator`.

**Распространённая ошибка:** think inherited and own methods are called differently.

**Связь с Automation QA:** validators can share formatting and keep specific validation.

---

## 4. Debugging tasks

### 4.1

**Ответ:**

```javascript
class LoginPage extends BasePage {
  login() {
    return 'login';
  }
}
```

**Объяснение:** without `extends`, `LoginPage` has no relationship with `BasePage`, so lookup cannot find `open`.

**Распространённая ошибка:** define base class but forget to connect derived class.

**Связь с Automation QA:** Page Object must explicitly extend base class to reuse base behavior.

### 4.2

**Ответ:** `login()` should be in `LoginPage`, not `BasePage`.

**Объяснение:** base class behavior becomes available to all derived pages. Not every page can log in.

**Распространённая ошибка:** put specific methods into base class because it is convenient.

**Связь с Automation QA:** `ProfilePage` should not inherit `login()` if it is not meaningful there.

### 4.3

**Ответ:** `LoginPage.describe()` is used.

**Объяснение:** derived method overrides base method because lookup finds closer method first.

**Распространённая ошибка:** think overriding calls both methods automatically.

**Связь с Automation QA:** specific page can customize description without changing base page.

---

## 5. QA-oriented tasks

### 5.1

**Ответ:**

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }

  waitReady(pageName) {
    return `${pageName} is ready`;
  }
}

class LoginPage extends BasePage {
  login() {
    return 'login';
  }
}

const loginPage = new LoginPage();

console.log(loginPage.open('LoginPage'));
console.log(loginPage.waitReady('LoginPage'));
console.log(loginPage.login());
```

**Объяснение:** common page actions are inherited; login action is specific.

**Распространённая ошибка:** repeat `open` and `waitReady` inside `LoginPage`.

**Связь с Automation QA:** this is a basic BasePage pattern.

### 5.2

**Ответ:**

```javascript
class BaseApiClient {
  describeRequest(serviceName, endpoint) {
    return `${serviceName}: ${endpoint}`;
  }
}

class UsersClient extends BaseApiClient {
  userEndpoint(userId) {
    return `/users/${userId}`;
  }
}

class OrdersClient extends BaseApiClient {
  orderEndpoint(orderId) {
    return `/orders/${orderId}`;
  }
}

const usersClient = new UsersClient();
const ordersClient = new OrdersClient();

console.log(usersClient.describeRequest('users', usersClient.userEndpoint('42')));
console.log(ordersClient.describeRequest('orders', ordersClient.orderEndpoint('100')));
```

**Объяснение:** request description is shared; endpoints are service-specific.

**Распространённая ошибка:** put `userEndpoint` into base API client.

**Связь с Automation QA:** API layers often share request utilities and specialize by resource.

### 5.3

**Ответ:**

```javascript
class BaseValidator {
  formatExpected(value) {
    return `expected: ${value}`;
  }

  formatActual(value) {
    return `actual: ${value}`;
  }
}

class StatusValidator extends BaseValidator {
  isValid(expected, actual) {
    return expected === actual;
  }
}

const validator = new StatusValidator();

console.log(validator.formatExpected(200));
console.log(validator.formatActual(201));
console.log(validator.isValid(200, 201));
```

**Объяснение:** formatting is shared; status comparison is specific.

**Распространённая ошибка:** duplicate formatting in each validator class.

**Связь с Automation QA:** assertion infrastructure often shares message formatting.

### 5.4

**Ответ:** inheritance should express meaningful shared behavior.

**Объяснение:** if classes are connected only to hide random duplication, hierarchy becomes confusing.

**Распространённая ошибка:** create base class for unrelated helpers.

**Связь с Automation QA:** unclear Page Object hierarchies make test failures harder to debug.

---

## 6. Мини-проект

**Ответ:**

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }

  waitReady(pageName) {
    return `${pageName} is ready`;
  }
}

class LoginPage extends BasePage {
  login() {
    return 'login with user credentials';
  }
}

class ProfilePage extends BasePage {
  updateProfile() {
    return 'update user profile';
  }
}

const loginPage = new LoginPage();
const profilePage = new ProfilePage();

console.log(loginPage.open('LoginPage'));
console.log(loginPage.waitReady('LoginPage'));
console.log(loginPage.login());

console.log(profilePage.open('ProfilePage'));
console.log(profilePage.waitReady('ProfilePage'));
console.log(profilePage.updateProfile());
```

Possible output:

```text
open LoginPage
LoginPage is ready
login with user credentials
open ProfilePage
ProfilePage is ready
update user profile
```

**Объяснение:** common behavior lives in `BasePage`. Specific behavior lives in `LoginPage` and `ProfilePage`. Methods are reused through inheritance and prototype lookup, not copied into each derived class.

**Распространённая ошибка:** put `login()` and `updateProfile()` into `BasePage`.

**Связь с Automation QA:** this is the core mental model behind simple Page Object inheritance.

**Возможное улучшение:** keep the hierarchy shallow and move only truly common behavior to the base class.
