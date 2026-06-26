# Практика: super

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существует `super`;
* отличать override with `super` from override without `super`;
* определять base behavior;
* предсказывать result of `super.method()`;
* понимать relationship between `super` and `this`;
* применять `super` в Page Objects, API clients and validators.

---

## 1. Концептуальные вопросы

1. Why does `super` exist?
2. What problem appears when derived method overrides base method?
3. What does `super.method()` call?
4. Does `super.method()` copy base method code?
5. Why use `super` instead of copying base method code?
6. What is the difference between `super` and `this`?
7. What happens if override does not call `super`?
8. When can override without `super` be intentional?
9. Why is constructor `super()` not part of this chapter?
10. How is `super` useful in Automation QA?

---

## 2. Identify base behavior

### Задание 2.1

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }
}

class LoginPage extends BasePage {
  open(pageName) {
    const baseResult = super.open(pageName);
    return `${baseResult} and focus form`;
  }
}
```

Ответьте:

* What is the base behavior?
* What is the derived-specific behavior?
* What does `super.open(pageName)` call?

### Задание 2.2

```javascript
class BaseValidator {
  formatFailure(expected, actual) {
    return `expected ${expected}, actual ${actual}`;
  }
}

class StatusValidator extends BaseValidator {
  formatFailure(expected, actual) {
    const message = super.formatFailure(expected, actual);
    return `Status mismatch: ${message}`;
  }
}
```

Ответьте:

* Which part is common formatting?
* Which part is specialization?

---

## 3. Предскажите результат выполнения

### Задание 3.1

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }
}

class LoginPage extends BasePage {
  open(pageName) {
    return `${super.open(pageName)} and focus form`;
  }
}

const page = new LoginPage();

console.log(page.open('LoginPage'));
```

### Задание 3.2

```javascript
class BaseReporter {
  label(message) {
    return `${this.prefix}: ${message}`;
  }
}

class TestReporter extends BaseReporter {
  label(message) {
    return `${super.label(message)} [run]`;
  }
}

const reporter = new TestReporter();
reporter.prefix = 'QA';

console.log(reporter.label('failed'));
```

### Задание 3.3

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }
}

class LoginPage extends BasePage {
  open(pageName) {
    return `focus ${pageName}`;
  }
}

const page = new LoginPage();

console.log(page.open('LoginPage'));
```

---

## 4. Debugging tasks

### Задание 4.1

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }
}

class LoginPage extends BasePage {
  open(pageName) {
    return `focus form on ${pageName}`;
  }
}
```

Автор хотел preserve base opening behavior and add login-specific behavior. Исправьте method.

### Задание 4.2

```javascript
class BaseReporter {
  label(message) {
    return `${this.prefix}: ${message}`;
  }
}

class TestReporter extends BaseReporter {
  label(message) {
    return `${super.label(message)} [test]`;
  }
}

const reporter = new TestReporter();

console.log(reporter.label('failed'));
```

Объясните, why output contains `undefined`.

### Задание 4.3

```javascript
class BaseValidator {
  formatFailure(expected, actual) {
    return `expected ${expected}, actual ${actual}`;
  }
}

class StatusValidator extends BaseValidator {
  formatFailure(expected, actual) {
    return super();
  }
}
```

Explain why this is wrong for this chapter and fix the method.

---

## 5. QA-oriented tasks

### Задание 5.1

Create:

* `BasePage.open(pageName)`;
* `LoginPage extends BasePage`;
* `LoginPage.open(pageName)` that calls base open and adds login-specific behavior.

### Задание 5.2

Create:

* `BaseApiClient.describeRequest(serviceName, endpoint)`;
* `UsersClient extends BaseApiClient`;
* `UsersClient.describeRequest(endpoint)` that calls base behavior and adds `[authenticated]`.

### Задание 5.3

Create:

* `BaseValidator.formatFailure(expected, actual)`;
* `StatusValidator extends BaseValidator`;
* `StatusValidator.formatFailure(expected, actual)` that calls base formatting and adds status-specific prefix.

---

## 6. Mini-project

Create small QA framework model.

Requirements:

1. Create `BasePage`.
2. Add method `open(pageName)`.
3. Add method `waitReady(pageName)`.
4. Create `LoginPage extends BasePage`.
5. Override `open(pageName)`.
6. Inside override, call `super.open(pageName)`.
7. Add login-specific behavior after base behavior.
8. Create `ProfilePage extends BasePage`.
9. Override `waitReady(pageName)`.
10. Inside override, call `super.waitReady(pageName)`.
11. Add profile-specific behavior.
12. Print results.
13. Explain which behavior is base and which is derived.

Do not use constructor `super()`.
