# Решения: Object Methods

## 1. Концептуальные вопросы

### 1.1 Почему object может содержать data and behavior?

**Ответ:** because real entities often have state and actions related to that state.

**Объяснение:** user has data (`name`, `role`) and behavior (`describe`, `rename`) that naturally belongs to user.

**Типичная ошибка:** store all behavior as unrelated functions.

**Связь с Automation QA:** API clients and Page Objects combine state and behavior.

### 1.2 Что такое state?

**Ответ:** state is data stored in object properties.

**Объяснение:** `baseUrl`, `timeout`, `role` are examples of state.

**Типичная ошибка:** confuse method result with state.

**Связь с Automation QA:** config values and locators are object state.

### 1.3 Что такое behavior?

**Ответ:** behavior is what object can do through methods.

**Объяснение:** `buildUrl()`, `formatStatus()` and `describe()` are behavior.

**Типичная ошибка:** think behavior must always change state. It can only read state.

**Связь с Automation QA:** assertion helpers often format or validate without mutating.

### 1.4 Почему method is ordinary function?

**Ответ:** method uses function value; it is not a separate magical function kind.

**Объяснение:** function becomes method when used as behavior through object invocation.

**Типичная ошибка:** think methods ignore normal function invocation rules.

**Связь с Automation QA:** detached helper methods can still lose receiver.

### 1.5 Почему method becomes method when called through object?

**Ответ:** because invocation form `object.method()` selects object as receiver.

**Объяснение:** this connects method call with `this`.

**Типичная ошибка:** think method is permanently bound to object just because it was written there.

**Связь с Automation QA:** Page Object methods should usually be called through page object instance.

### 1.6 Как `this` связан with ordinary method call?

**Ответ:** in ordinary `object.method()` invocation, `this` points to receiver object.

**Объяснение:** `apiClient.buildUrl()` makes `apiClient` receiver.

**Типичная ошибка:** assume `this` is decided where function was created.

**Связь с Automation QA:** API client methods use `this.baseUrl`.

### 1.7 Почему behavior should belong to object?

**Ответ:** when behavior uses object state or represents action of that entity.

**Объяснение:** `buildUrl()` belongs to API client because it uses client `baseUrl`.

**Типичная ошибка:** attach unrelated functions to object.

**Связь с Automation QA:** request builder behavior belongs to builder object.

### 1.8 Когда ordinary function лучше?

**Ответ:** when behavior does not depend on object state and does not represent entity responsibility.

**Объяснение:** pure utility calculations often stay ordinary functions.

**Типичная ошибка:** put every helper into object.

**Связь с Automation QA:** generic string formatting may not need object state.

### 1.9 Почему arrow functions as methods требуют осторожности?

**Ответ:** arrow functions have different `this` behavior.

**Объяснение:** this chapter recommends regular method syntax.

**Типичная ошибка:** write arrow method and expect ordinary receiver `this`.

**Связь с Automation QA:** method `this` bugs can break Page Object helpers.

### 1.10 Где полезны in Automation QA?

**Ответ:** API clients, Page Objects, assertion helpers, request builders and configuration helpers.

**Объяснение:** these entities own both data and actions.

**Типичная ошибка:** separate related behavior from its state.

**Связь с Automation QA:** object methods are foundation for framework architecture.

---

## 2. Identify methods

### 2.1

**Ответ:** state: `name`, `role`; method: `describe`.

**Объяснение:** `describe` stores function behavior and uses object state via `this`.

**Типичная ошибка:** call `describe` a data field only because it is a property.

**Связь с Automation QA:** test entity can describe itself for reports.

### 2.2

**Ответ:** `describe()` belongs to `config` because it uses `config` state: `baseUrl` and `timeout`.

**Объяснение:** behavior describes same entity.

**Типичная ошибка:** move behavior away and pass config manually everywhere.

**Связь с Automation QA:** config helper can explain current environment setup.

### 2.3

**Ответ:** `buildUrl` uses object state; `requestName` does not use object state.

**Объяснение:** `buildUrl` reads `this.baseUrl`; `requestName` uses only arguments.

**Типичная ошибка:** assume every method uses `this`.

**Связь с Automation QA:** some helper methods may be better as ordinary functions if they do not belong to object state.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
Anna is admin
```

**Объяснение:** `user.describe()` makes `user` receiver; `this.name` and `this.role` read user state.

**Типичная ошибка:** think `this` is undefined in any function. In ordinary method call receiver is selected.

**Связь с Automation QA:** entity methods can format readable labels.

### 3.2

**Ответ:**

```text
150
```

**Объяснение:** `deposit(50)` updates `this.balance`; `getBalance()` returns updated state.

**Типичная ошибка:** forget that methods can change object state.

**Связь с Automation QA:** request builders may update internal state before building payload.

### 3.3

**Ответ:**

```text
https://api.example.test/users
```

**Объяснение:** `this.baseUrl` reads apiClient state.

**Типичная ошибка:** use `baseUrl` without `this`.

**Связь с Automation QA:** API clients build endpoint URLs this way.

---

## 4. Debugging tasks

### 4.1

Исправление:

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  }
};

console.log(apiClient.buildUrl('/users'));
```

**Объяснение:** `baseUrl` is object property, so method reads it through `this.baseUrl`.

**Типичная ошибка:** treat property as local variable.

**Связь с Automation QA:** API client methods commonly access object config through `this`.

### 4.2

**Ответ:** `describe` is detached from `user`. Called as `describe()`, it no longer has ordinary receiver `user`.

One fix:

```javascript
const describe = user.describe.bind(user);
```

**Объяснение:** `bind()` creates function with fixed receiver.

**Типичная ошибка:** assume method remains bound forever.

**Связь с Automation QA:** detached Page Object methods can fail when passed around.

### 4.3

Исправление:

```javascript
const assertionHelper = {
  suite: 'smoke',
  formatStatus(testName, passed) {
    return this.suite + ': ' + testName + ' -> ' + passed;
  }
};
```

**Объяснение:** `suite` is object state, not local variable.

**Типичная ошибка:** forget `this` inside method.

**Связь с Automation QA:** assertion helpers often use suite/reporting state.

---

## 5. QA-oriented tasks

### 5.1

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  },
  describeRequest(method, path) {
    return method + ' ' + this.buildUrl(path);
  }
};
```

**Объяснение:** URL behavior belongs to API client because it uses `baseUrl`.

**Типичная ошибка:** duplicate baseUrl logic outside client.

**Связь с Automation QA:** API layer often starts from client objects.

### 5.2

```javascript
const assertionHelper = {
  suite: 'smoke',
  formatStatus(testName, actualStatus, expectedStatus) {
    return this.suite + ': ' + testName + ' -> ' + (actualStatus === expectedStatus);
  }
};
```

**Объяснение:** formatting behavior belongs to helper because it uses suite state.

**Типичная ошибка:** hardcode suite in every assertion.

**Связь с Automation QA:** reporting helpers often own prefixes and labels.

### 5.3

```javascript
const requestBuilder = {
  defaultRole: 'user',
  createUser(name, email) {
    return {
      name,
      email,
      role: this.defaultRole
    };
  }
};
```

**Объяснение:** builder owns default role and behavior for creating payload.

**Типичная ошибка:** pass default role manually every time.

**Связь с Automation QA:** request builders reduce payload duplication.

### 5.4

**Ответ:** behavior belongs to object when it uses object state or represents responsibility of that entity.

**Объяснение:** `buildUrl` uses `baseUrl`; `formatStatus` uses `suite`; `createUser` uses `defaultRole`.

**Типичная ошибка:** group behavior by convenience rather than responsibility.

**Связь с Automation QA:** good framework architecture is responsibility-based.

---

## 6. Mini-project

Один из возможных вариант:

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  },
  describeRequest(method, path) {
    return method + ' ' + this.buildUrl(path);
  }
};

const assertions = {
  suite: 'smoke',
  statusLine(testName, actualStatus, expectedStatus) {
    return this.suite + ': ' + testName + ' -> ' + (actualStatus === expectedStatus);
  }
};

const testUser = {
  name: 'Anna',
  email: 'anna@example.test',
  role: 'admin',
  describe() {
    return this.name + ' <' + this.email + '> [' + this.role + ']';
  }
};

console.log(apiClient.buildUrl('/users'));
console.log(apiClient.describeRequest('GET', '/users'));
console.log(assertions.statusLine('login', 200, 200));
console.log(testUser.describe());
```

**Объяснение:** state is stored data: `baseUrl`, `suite`, user fields. Behavior is methods: `buildUrl`, `describeRequest`, `statusLine`, `describe`.

**Типичная ошибка:** move related behavior into unrelated utility functions.

**Связь с Automation QA:** this pattern is a small preview of API clients, assertion helpers and Page Objects.

**Возможное улучшение:** later classes and prototypes can help share methods across many similar objects.

---

## 7. Контрольные вопросы

1. `object.method()` reads method function from object and calls it with object as ordinary receiver.
2. Receiver is `apiClient`.
3. Because ordinary method call sets `this` to receiver.
4. Detached method may lose receiver and `this` may not point to original object.
5. Page Object naturally uses methods because page actions belong to page entity and use page state such as locators.

**Общий вывод:** object method is behavior owned by object, implemented as ordinary function and invoked through object.
