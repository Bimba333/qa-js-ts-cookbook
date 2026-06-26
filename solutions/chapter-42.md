# Решения: Prototype

## 1. Концептуальные вопросы

### 1.1 Why is shared behavior useful?

**Ответ:** shared behavior позволяет хранить один общий method вместо множества одинаковых copies.

**Объяснение:** если 100 objects use same behavior, удобнее изменить behavior в одном месте.

**Типичная ошибка:** думать только об экономии памяти. Важнее maintainability and consistency.

**Связь с Automation QA:** Page Objects, API clients and validators часто имеют разные data, но одинаковые actions.

### 1.2 Почему duplicated methods become a maintenance problem?

**Ответ:** каждый duplicated method must be updated separately.

**Объяснение:** если logic changes, one missed copy can create inconsistent behavior.

**Типичная ошибка:** считать duplication harmless because code still runs.

**Связь с Automation QA:** одинаковые validators in tests can diverge and produce flaky or misleading results.

### 1.3 Что такое prototype object?

**Ответ:** prototype object is an object used as shared source of properties.

**Объяснение:** when property is missing on object, JavaScript can look in its prototype.

**Типичная ошибка:** define prototype primarily as class or inheritance mechanism.

**Связь с Automation QA:** shared framework behavior can be modeled as shared object.

### 1.4 Чем own property отличается от inherited property?

**Ответ:** own property is stored directly on object; inherited property is found through prototype lookup.

**Объяснение:** inherited property is available to object but not copied into it.

**Типичная ошибка:** think lookup copies property into object.

**Связь с Automation QA:** Page Object may have own locator data and inherited shared actions.

### 1.5 Где JavaScript ищет property сначала?

**Ответ:** inside object itself, among own properties.

**Объяснение:** own properties have priority in lookup.

**Типичная ошибка:** expect prototype method to override own method automatically.

**Связь с Automation QA:** local test object settings can override shared defaults.

### 1.6 Что происходит, если property не найдена directly on object?

**Ответ:** JavaScript checks prototype.

**Объяснение:** this is prototype lookup. If property is not found there either, result can become `undefined` in this one-level model.

**Типичная ошибка:** assume missing property immediately becomes `undefined`.

**Связь с Automation QA:** a helper may use a shared method even if the method is not visible directly in object literal.

### 1.7 Почему Prototype не стоит объяснять primarily as inheritance?

**Ответ:** because the first practical problem is sharing behavior, not class hierarchy.

**Объяснение:** inheritance is a later architectural layer. Prototype begins with property lookup and shared behavior.

**Типичная ошибка:** start from classes and lose the mechanism.

**Связь с Automation QA:** framework code is easier to understand when shared behavior is separated from object-specific data.

### 1.8 Почему per-object state обычно должен быть own property?

**Ответ:** because per-object state belongs to a specific object.

**Объяснение:** prototype is shared. Putting changing user-specific data there makes ownership unclear.

**Типичная ошибка:** store `currentUser`, `lastResponse` or `lastAction` in shared behavior object.

**Связь с Automation QA:** shared mutable state is a common cause of flaky tests.

### 1.9 Что возвращает `Object.getPrototypeOf(object)`?

**Ответ:** it returns prototype object linked to `object`.

**Объяснение:** this lets you inspect the shared behavior object.

**Типичная ошибка:** expect it to return object's own properties.

**Связь с Automation QA:** useful for debugging framework objects and unexpected shared methods.

### 1.10 Почему `__proto__` не нужен для основной model?

**Ответ:** because the core idea can be understood through object, prototype and lookup.

**Объяснение:** `__proto__` is a detail of accessing prototype relation, not the reason Prototype exists.

**Типичная ошибка:** start learning from `__proto__` and miss shared behavior.

**Связь с Automation QA:** practical debugging benefits more from understanding lookup than from memorizing special access forms.

---

## 2. Identify own property

### 2.1

**Ответ:**

* Own properties of `user`: `name`, `role`.
* `describe` находится in `userBehavior`.
* `describe` is not copied into `user`.

**Объяснение:** `Object.setPrototypeOf(user, userBehavior)` connects user to prototype object. Lookup can find `describe`, but property remains on prototype.

**Типичная ошибка:** think inherited method becomes own method after first use.

**Связь с Automation QA:** Page Object instance can use shared methods without storing each method directly.

### 2.2

**Ответ:**

* Own data: `baseUrl`.
* Shared behavior: `describeRequest(endpoint)`.
* Prototype for `apiClient`: `apiBehavior`.

**Объяснение:** `baseUrl` differs per client. `describeRequest` can be reused.

**Типичная ошибка:** put `baseUrl` into shared behavior object and accidentally share environment state.

**Связь с Automation QA:** API clients usually have own configuration and shared request helpers.

---

## 3. Identify inherited property

### 3.1

**Ответ:**

* `name` is own.
* `describePage` is inherited.
* `loginPage.describePage()` reads `loginPage.name` through `this`.

**Объяснение:** method location and receiver are different concepts. Method is found in prototype; receiver is `loginPage` during ordinary invocation.

**Типичная ошибка:** think `this` becomes `pageBehavior` because method is stored there.

**Связь с Automation QA:** shared Page Object action can operate on each concrete page instance.

### 3.2

**Ответ:**

* `testRun.status` is `'local'`.
* Own `status` is read first.
* It is not a Prototype Chain question because lookup stops at the object after finding own property.

**Объяснение:** own properties have priority over prototype properties.

**Типичная ошибка:** expect prototype value to override own value.

**Связь с Automation QA:** test-specific config can override shared defaults.

---

## 4. Property lookup

### 4.1

**Ответ:**

```text
read user.describe
│
├── check user own properties
│   └── describe not found
├── check userBehavior
│   └── describe found
└── call found function with receiver user
```

**Объяснение:** `describe` is inherited through prototype lookup, but `this` inside ordinary call is `user`.

**Типичная ошибка:** separate lookup from invocation poorly and assume `this` points to prototype.

**Связь с Automation QA:** shared validator methods can read instance-specific expected/actual values.

### 4.2

**Ответ:**

```text
read item.missing
│
├── item own properties
│   └── not found
├── behavior properties
│   └── not found
└── result: undefined
```

**Объяснение:** in this one-level model there is no matching own or prototype property.

**Типичная ошибка:** expect JavaScript to throw on every missing property. Simple property read returns `undefined`.

**Связь с Automation QA:** missing optional fields in response objects often produce `undefined`; assertions must account for that.

---

## 5. Предскажите результат выполнения

### 5.1

**Ответ:**

```text
Anna:admin
true
```

**Объяснение:** `describe` is found in prototype. `this` is `user`, so method reads `user.name` and `user.role`. `Object.getPrototypeOf(user)` returns `behavior`.

**Типичная ошибка:** expect `this.name` to be `undefined` because `behavior` has no `name`.

**Связь с Automation QA:** shared behavior reads concrete client or page data through receiver.

### 5.2

**Ответ:**

```text
own status
```

**Объяснение:** own property `status` exists on `object`, so lookup does not need prototype `status`.

**Типичная ошибка:** assume prototype value has higher priority.

**Связь с Automation QA:** local runtime status can override shared default status.

### 5.3

**Ответ:**

```text
true
Kate
```

**Объяснение:** both objects find the same `describe` function object in the same prototype. During `secondUser.describe()`, receiver is `secondUser`, so `this.name` is `'Kate'`.

**Типичная ошибка:** think each object gets its own method copy.

**Связь с Automation QA:** many Page Objects can use same shared action function with different page-specific data.

---

## 6. Debugging tasks

### 6.1

**Ответ:** output is:

```text
local method
```

**Объяснение:** `user` has own `describe`. Lookup finds own property first and stops before prototype.

**Типичная ошибка:** expect prototype method to win over own property.

**Связь с Automation QA:** page-specific method can override shared framework behavior if it is defined directly on object.

**Возможное улучшение:** remove own `describe` if shared behavior should be used.

### 6.2

**Ответ:**

```text
login
none
```

**Объяснение:** `setAction` is found in prototype. During `user.setAction('login')`, `this` is `user`. Assignment `this.lastAction = action` creates or updates own property on `user`, while `behavior.lastAction` remains `'none'`.

**Типичная ошибка:** think assignment inside prototype method always changes prototype object.

**Связь с Automation QA:** shared methods can update instance-specific state if receiver is the concrete object.

**Возможное улучшение:** initialize `lastAction` as own property on `user` to make ownership explicit.

### 6.3

**Ответ:**

```javascript
const behavior = {
  describe() {
    return `${this.name} [${this.role}]`;
  }
};
```

**Объяснение:** `name` and `role` without `this` are variable lookups, not property reads from receiver. Shared method should read data from current receiver.

**Типичная ошибка:** forget that shared method does not automatically receive object fields as variables.

**Связь с Automation QA:** shared helper methods must read instance/client/page data through explicit receiver or parameters.

**Возможное улучшение:** keep shared method small and name fields clearly.

---

## 7. QA-oriented tasks

### 7.1

**Ответ:**

```javascript
const apiClientBehavior = {
  describeRequest(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  }
};

const stagingClient = {
  baseUrl: 'https://staging.example.test'
};

const productionClient = {
  baseUrl: 'https://api.example.test'
};

Object.setPrototypeOf(stagingClient, apiClientBehavior);
Object.setPrototypeOf(productionClient, apiClientBehavior);

console.log(stagingClient.describeRequest('/users'));
console.log(productionClient.describeRequest('/users'));
```

**Объяснение:** `baseUrl` is own per client. `describeRequest` is shared behavior.

**Типичная ошибка:** duplicate `describeRequest` in every client.

**Связь с Automation QA:** this model fits API clients for different environments.

**Возможное улучшение:** later classes or factory functions can create these objects more ergonomically.

### 7.2

**Ответ:**

```javascript
const pageBehavior = {
  describePage() {
    return `Page: ${this.name}`;
  }
};

const loginPage = {
  name: 'LoginPage'
};

const profilePage = {
  name: 'ProfilePage'
};

Object.setPrototypeOf(loginPage, pageBehavior);
Object.setPrototypeOf(profilePage, pageBehavior);

console.log(loginPage.describePage());
console.log(profilePage.describePage());
console.log(loginPage.describePage === profilePage.describePage);
```

**Объяснение:** both pages use same method from `pageBehavior`.

**Типичная ошибка:** store all page-specific locators in prototype instead of on each page object.

**Связь с Automation QA:** Page Objects share actions but keep page-specific state.

**Возможное улучшение:** use a clearer object creation pattern after learning classes.

### 7.3

**Ответ:** Prototype model explains how shared behavior can be available to many objects.

**Объяснение:** even if production code uses classes, the underlying mental model still involves objects, shared methods and lookup.

**Типичная ошибка:** think classes remove the need to understand prototypes.

**Связь с Automation QA:** debugging Page Object methods often requires knowing where method comes from.

**Возможное улучшение:** revisit this answer after Classes chapter.

### 7.4

**Ответ:**

Own properties:

```text
baseUrl
token
timeout
clientName
```

Shared behavior:

```text
buildUrl()
describeRequest()
validateStatus()
formatError()
```

**Объяснение:** configuration differs between clients; request behavior can be reused.

**Типичная ошибка:** put environment-specific state in shared behavior object.

**Связь с Automation QA:** prevents tests for staging and production from accidentally sharing mutable data.

**Возможное улучшение:** use immutable config objects for environment-specific data.

---

## 8. Mini-project

**Ответ:**

```javascript
const validatorBehavior = {
  describeExpectation() {
    return `Expected: ${this.expected}`;
  },
  describeActual() {
    return `Actual: ${this.actual}`;
  }
};

const statusValidator = {
  expected: 200,
  actual: 201
};

const roleValidator = {
  expected: 'admin',
  actual: 'viewer'
};

Object.setPrototypeOf(statusValidator, validatorBehavior);
Object.setPrototypeOf(roleValidator, validatorBehavior);

console.log(statusValidator.describeExpectation());
console.log(statusValidator.describeActual());

console.log(roleValidator.describeExpectation());
console.log(roleValidator.describeActual());

console.log(Object.getPrototypeOf(statusValidator) === validatorBehavior);
console.log(Object.getPrototypeOf(roleValidator) === validatorBehavior);
```

Possible output:

```text
Expected: 200
Actual: 201
Expected: admin
Actual: viewer
true
true
```

**Объяснение:** `expected` and `actual` are own properties because they differ per validator. `describeExpectation()` and `describeActual()` are shared because formatting logic is the same.

**Типичная ошибка:** duplicate both methods in every validator object.

**Связь с Automation QA:** validators in a test framework often share reporting behavior while keeping expected/actual values per assertion.

**Возможное улучшение:** add more shared methods later, for example `describeMismatch()`, after learning more object patterns.
