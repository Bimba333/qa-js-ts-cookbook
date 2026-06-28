# Решения: Object Methods

## 1. Концептуальные вопросы

### 1.1 Почему object может содержать данные и поведение?

**Ответ:** потому что реальные сущности часто имеют состояние и действия, связанные с этим состоянием.

**Объяснение:** user имеет данные (`name`, `role`) и поведение (`describe`, `rename`), которое естественно относится к user.

**Распространённая ошибка:** store all поведение as unrelated functions.

**Связь с Automation QA:** API clients и Page Objects объединяют состояние и поведение.

### 1.2 Что такое состояние?

**Ответ:** состояние is data stored in object properties.

**Объяснение:** `baseUrl`, `timeout`, `role` are examples of состояние.

**Распространённая ошибка:** confuse method result with состояние.

**Связь с Automation QA:** config-значения и locators являются состоянием объекта.

### 1.3 Что такое поведение?

**Ответ:** поведение — это то, что object может делать через methods.

**Объяснение:** `buildUrl()`, `formatStatus()` и `describe()` являются поведением.

**Распространённая ошибка:** think поведение must always change состояние. It can only read состояние.

**Связь с Automation QA:** assertion helpers often format or validate without mutating.

### 1.4 Почему method является обычной функцией?

**Ответ:** method uses function object; it is not a separate magical function kind.

**Объяснение:** function становится method, когда используется как поведение через вызов объекта.

**Распространённая ошибка:** think methods ignore normal function invocation rules.

**Связь с Automation QA:** detached helper methods can still lose объект выполнения.

### 1.5 Почему method becomes method when called through object?

**Ответ:** because invocation form `object.method()` selects object as объект выполнения.

**Объяснение:** this connects method call with `this`.

**Распространённая ошибка:** think method is permanently bound to object just because it was written there.

**Связь с Automation QA:** Page Object methods обычно нужно вызывать через экземпляр page object.

### 1.6 Как `this` связан with ordinary method call?

**Ответ:** при обычном вызове `object.method()` `this` указывает на объект выполнения.

**Объяснение:** `apiClient.buildUrl()` makes `apiClient` объект выполнения.

**Распространённая ошибка:** assume `this` is decided where function was created.

**Связь с Automation QA:** API client methods use `this.baseUrl`.

### 1.7 Почему поведение should belong to object?

**Ответ:** когда поведение использует состояние объекта или представляет действие этой сущности.

**Объяснение:** `buildUrl()` относится к API client, потому что использует `baseUrl` клиента.

**Распространённая ошибка:** attach unrelated functions to object.

**Связь с Automation QA:** поведение request builder относится к builder object.

### 1.8 Когда ordinary function лучше?

**Ответ:** когда поведение не зависит от состояния объекта и не представляет ответственность сущности.

**Объяснение:** чистые utility-вычисления часто остаются обычными функциями.

**Распространённая ошибка:** put every helper into object.

**Связь с Automation QA:** общее форматирование строк может не требовать состояния объекта.

### 1.9 Почему arrow functions as methods требуют осторожности?

**Ответ:** arrow functions have different `this` поведение.

**Объяснение:** this chapter recommends regular method syntax.

**Распространённая ошибка:** писать arrow method и ожидать обычный объект выполнения в `this`.

**Связь с Automation QA:** method `this` bugs can break Page Object helpers.

### 1.10 Где полезны in Automation QA?

**Ответ:** API clients, Page Objects, assertion helpers, request builders and configuration helpers.

**Объяснение:** эти сущности владеют и данными, и действиями.

**Распространённая ошибка:** separate related поведение from its состояние.

**Связь с Automation QA:** object methods являются фундаментом framework architecture.

---

## 2. Identify methods

### 2.1

**Ответ:** состояние: `name`, `role`; method: `describe`.

**Объяснение:** `describe` хранит поведение функции и использует состояние объекта через `this`.

**Распространённая ошибка:** call `describe` a data поле only because it is a property.

**Связь с Automation QA:** test entity can describe itself for reports.

### 2.2

**Ответ:** `describe()` относится к `config`, потому что использует состояние `config`: `baseUrl` and `timeout`.

**Объяснение:** поведение describes same entity.

**Распространённая ошибка:** выносить поведение отдельно и везде передавать config вручную.

**Связь с Automation QA:** config helper can explain current environment setup.

### 2.3

**Ответ:** `buildUrl` использует состояние объекта; `requestName` не использует состояние объекта.

**Объяснение:** `buildUrl` reads `this.baseUrl`; `requestName` uses only arguments.

**Распространённая ошибка:** assume every method uses `this`.

**Связь с Automation QA:** некоторые helper methods лучше оставить обычными функциями, если они не относятся к состоянию объекта.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
Anna is admin
```

**Объяснение:** `user.describe()` делает `user` объектом выполнения; `this.name` и `this.role` читают состояние user.

**Распространённая ошибка:** думать, что `this` всегда `undefined` в любой функции. При обычном вызове метода объект выполнения выбирается формой вызова.

**Связь с Automation QA:** entity methods can format readable labels.

### 3.2

**Ответ:**

```text
150
```

**Объяснение:** `deposit(50)` updates `this.balance`; `getBalance()` returns updated состояние.

**Распространённая ошибка:** забывать, что methods могут менять состояние объекта.

**Связь с Automation QA:** request builders may update internal состояние before building payload.

### 3.3

**Ответ:**

```text
https://api.example.test/users
```

**Объяснение:** `this.baseUrl` reads apiClient состояние.

**Распространённая ошибка:** use `baseUrl` without `this`.

**Связь с Automation QA:** API clients build endpoint URLs this way.

---

## 4. Задания на отладку

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

**Объяснение:** `baseUrl` является свойством объекта, поэтому method читает его через `this.baseUrl`.

**Распространённая ошибка:** treat property as local variable.

**Связь с Automation QA:** API client methods часто обращаются к config объекта через `this`.

### 4.2

**Ответ:** `describe` отделён от `user`. При вызове `describe()` у него больше нет обычного объекта выполнения `user`.

One fix:

```javascript
const describe = user.describe.bind(user);
```

**Объяснение:** `bind()` creates function with fixed объект выполнения.

**Распространённая ошибка:** assume method remains bound forever.

**Связь с Automation QA:** отделённые Page Object methods могут падать при передаче как значения.

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

**Объяснение:** `suite` является состоянием объекта, а не локальной переменной.

**Распространённая ошибка:** forget `this` inside method.

**Связь с Automation QA:** assertion helpers often use suite/reporting состояние.

---

## 5. QA-задачи

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

**Объяснение:** поведение построения URL относится к API client, потому что использует `baseUrl`.

**Распространённая ошибка:** duplicate baseUrl logic outside client.

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

**Объяснение:** поведение форматирования относится к helper, потому что использует состояние suite.

**Распространённая ошибка:** hardcode suite in every assertion.

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

**Объяснение:** builder владеет ролью по умолчанию и поведением для создания payload.

**Распространённая ошибка:** pass default role manually every time.

**Связь с Automation QA:** request builders reduce payload duplication.

### 5.4

**Ответ:** поведение относится к объекту, когда использует состояние объекта или представляет ответственность этой сущности.

**Объяснение:** `buildUrl` uses `baseUrl`; `formatStatus` uses `suite`; `createUser` uses `defaultRole`.

**Распространённая ошибка:** group поведение by convenience rather than responsibility.

**Связь с Automation QA:** good framework architecture is responsibility-based.

---

## 6. Мини-проект

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

**Объяснение:** состояние is stored data: `baseUrl`, `suite`, user поля. Behavior is methods: `buildUrl`, `describeRequest`, `statusLine`, `describe`.

**Распространённая ошибка:** move related поведение into unrelated utility functions.

**Связь с Automation QA:** этот паттерн является маленьким предварительным взглядом на API clients, assertion helpers и Page Objects.

**Возможное улучшение:** позже classes и prototypes помогут разделять методы между многими похожими объектами.

---

## 7. Контрольные вопросы

1. `object.method()` читает функцию метода из объекта и вызывает её с объектом как обычным объектом выполнения.
2. Receiver is `apiClient`.
3. Потому что обычный вызов метода устанавливает `this` в объект выполнения.
4. Отделённый метод может потерять объект выполнения, и `this` может не указывать на исходный объект.
5. Page Object естественно использует methods, потому что действия страницы относятся к сущности страницы и используют её состояние, например locators.

**Общий вывод:** object method — это поведение, принадлежащее объекту, реализованное как обычная функция и вызванное через объект.
