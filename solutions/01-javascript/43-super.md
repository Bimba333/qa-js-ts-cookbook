# Решения: super

## 1. Концептуальные вопросы

### 1.1 Why does `super` exist?

**Ответ:** to call base class поведение from derived class поведение.

**Объяснение:** it is useful when derived method overrides base method but still wants to reuse base logic.

**Распространённая ошибка:** define `super` as just "parent access" without explaining поведение reuse.

**Связь с Automation QA:** `LoginPage.open()` can reuse `BasePage.open()` and add login-specific preparation.

### 1.2 What problem appears when derived method overrides base method?

**Ответ:** base поведение is no longer used for that method call unless derived method explicitly calls it.

**Объяснение:** overriding selects derived method first.

**Распространённая ошибка:** expect base and derived methods to run automatically.

**Связь с Automation QA:** overriding `open()` can accidentally skip common navigation logic.

### 1.3 What does `super.method()` call?

**Ответ:** it calls base class method.

**Объяснение:** the call happens through the class relationship created by inheritance.

**Распространённая ошибка:** think it copies method code.

**Связь с Automation QA:** service-specific client method can call base request formatting.

### 1.4 Does `super.method()` copy base method code?

**Ответ:** no.

**Объяснение:** `super.method()` calls base поведение; it does not duplicate the method body.

**Распространённая ошибка:** imagine inherited code inserted into derived class.

**Связь с Automation QA:** changing base поведение updates all derived methods that call it.

### 1.5 Why use `super` вместо copying base method code?

**Ответ:** to avoid duplication and keep common поведение in one place.

**Объяснение:** copied code must be updated manually in every derived class.

**Распространённая ошибка:** copy base method and add one line.

**Связь с Automation QA:** duplicated Page Object open logic quickly becomes inconsistent.

### 1.6 What is the difference between `super` and `this`?

**Ответ:** `super` selects base method; `this` is the объект выполнения object.

**Объяснение:** base method called through `super` still works with current объект выполнения.

**Распространённая ошибка:** think `super` changes `this` to base class.

**Связь с Automation QA:** base method can read data from concrete page/client instance.

### 1.7 What happens if override does not call `super`?

**Ответ:** derived method replaces base поведение for that call.

**Объяснение:** lookup finds derived method first, and base method is not called automatically.

**Распространённая ошибка:** assume base method always runs before derived method.

**Связь с Automation QA:** custom page поведение can skip common wait logic if `super` is omitted.

### 1.8 When can override without `super` be intentional?

**Ответ:** when derived поведение should fully replace base поведение.

**Объяснение:** not every override is extension; some are replacement.

**Распространённая ошибка:** always call `super` mechanically.

**Связь с Automation QA:** a special page may have completely different readiness check.

### 1.9 Why is constructor `super()` not part of this chapter?

**Ответ:** this chapter focuses on `super.method()` in methods.

**Объяснение:** constructor inheritance has additional rules and deserves separate explanation.

**Распространённая ошибка:** mix method `super` and constructor `super()` too early.

**Связь с Automation QA:** method reuse is enough to understand many Page Object overrides.

### 1.10 How is `super` useful in Automation QA?

**Ответ:** it keeps common framework поведение reusable while allowing specific classes to extend it.

**Объяснение:** derived classes can add page/API/validator-specific поведение after base поведение.

**Распространённая ошибка:** duplicate framework поведение in every specialized class.

**Связь с Automation QA:** BasePage, BaseApiClient and BaseValidator are common examples.

---

## 2. Identify base поведение

### 2.1

**Ответ:**

* Base поведение: `BasePage.open(pageName)`.
* Derived-specific поведение: `and focus form`.
* `super.open(pageName)` calls `BasePage.open(pageName)`.

**Объяснение:** derived `open` extends base `open`.

**Распространённая ошибка:** think `super.open` calls `LoginPage.open` again.

**Связь с Automation QA:** login page can reuse common open поведение and add form focus.

### 2.2

**Ответ:**

* Common formatting: `expected ${expected}, actual ${actual}`.
* Specialization: `Status mismatch: ...`.

**Объяснение:** base validator formats generic failure; status validator adds context.

**Распространённая ошибка:** duplicate formatting inside every validator.

**Связь с Automation QA:** assertion messages often share a base format.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
open LoginPage and focus form
```

**Объяснение:** derived method calls base method and appends specific поведение.

**Распространённая ошибка:** expect only `open LoginPage`.

**Связь с Automation QA:** page-specific open can extend base navigation.

### 3.2

**Ответ:**

```text
QA: failed [run]
```

**Объяснение:** `super.label(message)` calls base method, but `this.prefix` is read from `reporter`.

**Распространённая ошибка:** think `this.prefix` is read from `BaseReporter`.

**Связь с Automation QA:** shared reporter methods can use concrete reporter состояние.

### 3.3

**Ответ:**

```text
focus LoginPage
```

**Объяснение:** override does not call `super`, so base `open` is not reused.

**Распространённая ошибка:** expect base method to run automatically.

**Связь с Automation QA:** skipping `super` can accidentally skip common page setup.

---

## 4. Задания на отладку

### 4.1

**Ответ:**

```javascript
class LoginPage extends BasePage {
  open(pageName) {
    const baseResult = super.open(pageName);
    return `${baseResult} and focus form`;
  }
}
```

**Объяснение:** `super.open(pageName)` preserves base поведение; derived method adds login-specific поведение.

**Распространённая ошибка:** replace base поведение while intending to extend it.

**Связь с Automation QA:** common navigation remains centralized in `BasePage`.

### 4.2

**Ответ:** вывод contains `undefined` because `this.prefix` is not set on `reporter`.

**Объяснение:** `super.label()` calls base method with `this` still pointing to `reporter`. If `reporter.prefix` is missing, `this.prefix` is `undefined`.

**Распространённая ошибка:** think missing value is related to `super` itself.

**Связь с Automation QA:** base helper methods need required instance data to be initialized.

### 4.3

**Ответ:**

```javascript
class StatusValidator extends BaseValidator {
  formatFailure(expected, actual) {
    const baseMessage = super.formatFailure(expected, actual);
    return `Status mismatch: ${baseMessage}`;
  }
}
```

**Объяснение:** this chapter uses `super.method()`, not constructor `super()`.

**Распространённая ошибка:** write `super()` when you need to call a named base method.

**Связь с Automation QA:** specialized validator should call base formatting method explicitly.

---

## 5. QA-задачи

### 5.1

**Ответ:**

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }
}

class LoginPage extends BasePage {
  open(pageName) {
    const baseResult = super.open(pageName);
    return `${baseResult} and focus login form`;
  }
}

const loginPage = new LoginPage();

console.log(loginPage.open('LoginPage'));
```

**Объяснение:** `LoginPage.open` reuses base opening and adds login-specific step.

**Распространённая ошибка:** duplicate base opening text in derived method.

**Связь с Automation QA:** Page Object open flow often has common and page-specific parts.

### 5.2

**Ответ:**

```javascript
class BaseApiClient {
  describeRequest(serviceName, endpoint) {
    return `${serviceName}: ${endpoint}`;
  }
}

class UsersClient extends BaseApiClient {
  describeRequest(endpoint) {
    const baseDescription = super.describeRequest('users', endpoint);
    return `${baseDescription} [authenticated]`;
  }
}

const usersClient = new UsersClient();

console.log(usersClient.describeRequest('/users'));
```

**Объяснение:** base client handles common request description; users client adds service-specific marker.

**Распространённая ошибка:** repeat common request formatting in every API client.

**Связь с Automation QA:** API clients often extend base logging or request description.

### 5.3

**Ответ:**

```javascript
class BaseValidator {
  formatFailure(expected, actual) {
    return `expected ${expected}, actual ${actual}`;
  }
}

class StatusValidator extends BaseValidator {
  formatFailure(expected, actual) {
    const baseMessage = super.formatFailure(expected, actual);
    return `Status mismatch: ${baseMessage}`;
  }
}

const validator = new StatusValidator();

console.log(validator.formatFailure(200, 201));
```

**Объяснение:** base formatting remains reusable; status validator adds status context.

**Распространённая ошибка:** make base validator know about status-specific language.

**Связь с Automation QA:** assertion framework can share formatting and specialize messages.

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
  open(pageName) {
    const baseResult = super.open(pageName);
    return `${baseResult}, then focus username field`;
  }
}

class ProfilePage extends BasePage {
  waitReady(pageName) {
    const baseResult = super.waitReady(pageName);
    return `${baseResult}, then verify profile header`;
  }
}

const loginPage = new LoginPage();
const profilePage = new ProfilePage();

console.log(loginPage.open('LoginPage'));
console.log(loginPage.waitReady('LoginPage'));

console.log(profilePage.open('ProfilePage'));
console.log(profilePage.waitReady('ProfilePage'));
```

Возможный вывод:

```text
open LoginPage, then focus username field
LoginPage is ready
open ProfilePage
ProfilePage is ready, then verify profile header
```

**Объяснение:** base поведение lives in `BasePage`. Derived поведение lives in `LoginPage.open` and `ProfilePage.waitReady`. `super.method()` calls base поведение, then derived method adds specialization.

**Распространённая ошибка:** copy `open` and `waitReady` code into derived classes.

**Связь с Automation QA:** this is a realistic pattern for extending base Page Object поведение without duplicating common logic.

**Возможное улучшение:** keep overrides short; if derived method becomes long, split page-specific work into separate methods.
