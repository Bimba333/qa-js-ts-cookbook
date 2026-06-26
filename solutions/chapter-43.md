# Решения: Prototype Chain

## 1. Концептуальные вопросы

### 1.1 What problem does Prototype Chain solve?

**Ответ:** it answers where JavaScript continues searching if property is not found on object or first prototype.

**Объяснение:** lookup can repeat through several prototype levels.

**Типичная ошибка:** think JavaScript checks only one prototype.

**Связь с Automation QA:** framework helpers may find methods through several shared behavior layers.

### 1.2 Why is Prototype Chain a lookup algorithm, not an inheritance hierarchy?

**Ответ:** because it describes the order of property search.

**Объяснение:** design inheritance is an architectural topic. Prototype Chain here is about "where does lookup go next?"

**Типичная ошибка:** start from class hierarchy and miss actual property lookup.

**Связь с Automation QA:** debugging Page Objects requires knowing where method was found, not drawing class diagrams first.

### 1.3 Where does property lookup start?

**Ответ:** on the current object.

**Объяснение:** own properties have first priority.

**Типичная ошибка:** expect prototype property to be checked first.

**Связь с Automation QA:** test-specific object data can override shared defaults.

### 1.4 What happens when property is found on current object?

**Ответ:** lookup stops and JavaScript uses that property.

**Объяснение:** closer property wins.

**Типичная ошибка:** think JavaScript still checks farther prototypes and compares values.

**Связь с Automation QA:** local helper method can override shared behavior.

### 1.5 What happens when property is not found on current object?

**Ответ:** JavaScript moves to the next prototype.

**Объяснение:** this step repeats until property is found or chain ends.

**Типичная ошибка:** expect immediate `undefined` after current object miss.

**Связь с Automation QA:** API client methods can come from service-level or framework-level behavior.

### 1.6 Why does JavaScript stop searching?

**Ответ:** because property is found or chain reaches its end.

**Объяснение:** lookup has both a success stop and a final stop.

**Типичная ошибка:** think JavaScript searches unrelated objects.

**Связь с Automation QA:** only linked framework layers participate in lookup.

### 1.7 What is shadowing?

**Ответ:** shadowing is when closer property hides farther property with same name.

**Объяснение:** own `status` wins over prototype `status`.

**Типичная ошибка:** think the farther property is removed.

**Связь с Automation QA:** local environment config may shadow shared default config.

### 1.8 Why does own property win over inherited property?

**Ответ:** because lookup starts on current object and stops when found.

**Объяснение:** inherited property is checked only if own property is missing.

**Типичная ошибка:** expect inherited defaults to override local values.

**Связь с Automation QA:** test-specific values should naturally override framework defaults.

### 1.9 What role does `Object.prototype` play?

**Ответ:** it is near the end of many ordinary object chains.

**Объяснение:** if property is not found earlier, lookup can reach `Object.prototype`.

**Типичная ошибка:** begin learning chain from `Object.prototype` instead of lookup problem.

**Связь с Automation QA:** understanding it helps explain why ordinary objects share some base behavior.

### 1.10 Why can deep chains hurt readability?

**Ответ:** because it becomes harder to know where property was found.

**Объяснение:** every extra level adds a lookup place to inspect.

**Типичная ошибка:** treat deeper chain as more advanced design.

**Связь с Automation QA:** deep helper chains can make failed assertions harder to debug.

---

## 2. Identify lookup order

### 2.1

**Ответ:**

`loginPage.name`:

```text
loginPage -> found
```

`loginPage.describePage`:

```text
loginPage -> pageBehavior -> found
```

`loginPage.formatError`:

```text
loginPage -> pageBehavior -> frameworkBehavior -> found
```

`loginPage.missingProperty`:

```text
loginPage -> pageBehavior -> frameworkBehavior -> later prototypes -> not found -> undefined
```

**Объяснение:** lookup starts from current object and continues through linked prototypes.

**Типичная ошибка:** skip `pageBehavior` and jump straight to `frameworkBehavior`.

**Связь с Automation QA:** this is exactly how layered Page Object behavior can be debugged.

### 2.2

**Ответ:** `client.format` is found in `baseBehavior`.

**Объяснение:**

```text
client
│
└── not found
    │
    ▼
serviceBehavior
│
└── not found
    │
    ▼
baseBehavior
│
└── found
```

**Типичная ошибка:** think empty `serviceBehavior` stops lookup.

**Связь с Automation QA:** intermediate framework layers can be empty for some methods and still pass lookup upward.

---

## 3. Identify own vs inherited property

### 3.1

**Ответ:**

* Own property: `testRun.status`.
* Inherited property: `describeStatus`.
* Winning `status`: own `'local'`.

**Объяснение:** `describeStatus` is found in prototype, but `this.status` starts lookup from receiver `testRun`, so own `status` wins.

**Типичная ошибка:** expect `this.status` to read from `behavior`.

**Связь с Automation QA:** shared validator methods read concrete assertion state from receiver.

### 3.2

**Ответ:**

* `validator.name`: own.
* `validator.isValid`: inherited from `validatorBehavior`.
* `validator.formatFailure`: inherited through `validatorBehavior` from `reportingBehavior`.

**Объяснение:** lookup may continue past first prototype.

**Типичная ошибка:** classify all callable methods as own methods.

**Связь с Automation QA:** validators can have own data and shared validation/reporting behavior.

---

## 4. Предскажите результат выполнения

### 4.1

**Ответ:**

```text
first
```

**Объяснение:** `object` has no `value`, so lookup goes to `first`. `first.value` exists, so lookup stops before `second`.

**Типичная ошибка:** expect `'second'` because it is farther in chain.

**Связь с Automation QA:** nearest config layer wins over base defaults.

### 4.2

**Ответ:**

```text
page
```

**Объяснение:** `describe` is found in `pageBehavior`, so `frameworkBehavior.describe` is shadowed.

**Типичная ошибка:** think framework-level behavior always wins.

**Связь с Automation QA:** page-specific behavior can override generic framework behavior.

### 4.3

**Ответ:**

```text
local
```

**Объяснение:** method is found in prototype, but ordinary invocation receiver is `object`; `this.name` reads from `object`.

**Типичная ошибка:** confuse method location with receiver.

**Связь с Automation QA:** shared methods act on concrete Page Object or API client instance.

---

## 5. Debugging tasks

### 5.1

**Ответ:** output is:

```text
admin
```

**Объяснение:** own `role` exists on `user`, so lookup stops before `sharedBehavior.role`.

**Типичная ошибка:** expect prototype defaults to override local data.

**Связь с Automation QA:** local test data should usually have priority over shared defaults.

### 5.2

**Ответ:**

```javascript
const frameworkBehavior = {
  formatError() {
    return `${this.name}: error`;
  }
};
```

**Объяснение:** `name` without `this` is variable lookup, not property lookup on receiver. The shared method should read from current receiver.

**Типичная ошибка:** assume object properties automatically become local variables.

**Связь с Automation QA:** shared framework methods must use receiver data explicitly.

### 5.3

**Ответ:** `object.missing` lookup returns `undefined`; then code tries to call `undefined` as a function.

**Объяснение:**

```text
object.missing
│
└── undefined

undefined()
│
└── TypeError
```

**Типичная ошибка:** think missing property read itself always throws.

**Связь с Automation QA:** errors often happen one step after lookup, when missing helper is invoked.

---

## 6. QA-oriented tasks

### 6.1

**Ответ:**

```javascript
const frameworkBehavior = {
  formatError() {
    return `${this.name}: error`;
  }
};

const pageBehavior = {
  describePage() {
    return `Page: ${this.name}`;
  }
};

const loginPage = {
  name: 'LoginPage'
};

Object.setPrototypeOf(pageBehavior, frameworkBehavior);
Object.setPrototypeOf(loginPage, pageBehavior);

console.log(loginPage.describePage());
console.log(loginPage.formatError());
```

**Объяснение:** `describePage` is found in first prototype. `formatError` is found in second prototype.

**Типичная ошибка:** duplicate `formatError` on every page object.

**Связь с Automation QA:** shared reporting behavior can be reused by all Page Objects.

### 6.2

**Ответ:**

```javascript
const frameworkBehavior = {
  describeRequest(endpoint) {
    return `${this.serviceName}: ${this.baseUrl}${endpoint}`;
  }
};

const serviceBehavior = {
  buildEndpoint(id) {
    return `/users/${id}`;
  }
};

const usersClient = {
  serviceName: 'users',
  baseUrl: 'https://api.example.test'
};

Object.setPrototypeOf(serviceBehavior, frameworkBehavior);
Object.setPrototypeOf(usersClient, serviceBehavior);

const endpoint = usersClient.buildEndpoint('42');

console.log(usersClient.describeRequest(endpoint));
```

**Объяснение:** own data lives on `usersClient`; service behavior is one level up; generic framework behavior is another level up.

**Типичная ошибка:** put `baseUrl` into shared behavior and accidentally share environment state.

**Связь с Automation QA:** API client layers often separate config, service actions and framework helpers.

### 6.3

**Ответ:** deep chains make it harder to find method source and understand override rules.

**Объяснение:** each level can contain property with same name.

**Типичная ошибка:** think more levels means better reuse.

**Связь с Automation QA:** deep Page Object inheritance-style structures often make test failures harder to diagnose.

### 6.4

**Ответ:** JavaScript stops when property is found or when the chain ends.

**Объяснение:** lookup has deterministic stopping rules.

**Типичная ошибка:** think lookup searches all objects in memory.

**Связь с Automation QA:** only linked helper layers participate in method lookup.

---

## 7. Mini-project

**Ответ:**

```javascript
const reportingBehavior = {
  formatFailure() {
    return `${this.name}: expected ${this.expected}, actual ${this.actual}`;
  }
};

const validatorBehavior = {
  isValid() {
    return this.expected === this.actual;
  }
};

const statusValidator = {
  name: 'StatusValidator',
  expected: 200,
  actual: 201
};

const roleValidator = {
  name: 'RoleValidator',
  expected: 'admin',
  actual: 'viewer'
};

Object.setPrototypeOf(validatorBehavior, reportingBehavior);
Object.setPrototypeOf(statusValidator, validatorBehavior);
Object.setPrototypeOf(roleValidator, validatorBehavior);

console.log(statusValidator.isValid());
console.log(statusValidator.formatFailure());

console.log(roleValidator.isValid());
console.log(roleValidator.formatFailure());
```

Possible output:

```text
false
StatusValidator: expected 200, actual 201
false
RoleValidator: expected admin, actual viewer
```

Lookup for `statusValidator.formatFailure`:

```text
statusValidator
│
└── not found
    │
    ▼
validatorBehavior
│
└── not found
    │
    ▼
reportingBehavior
│
└── found
```

**Объяснение:** validation and reporting behavior are separated into two shared layers.

**Типичная ошибка:** expect `formatFailure` to be found in `validatorBehavior`.

**Связь с Automation QA:** assertion frameworks often separate validation logic from reporting/error formatting.

**Возможное улучшение:** keep the chain shallow and document where shared behavior lives.
