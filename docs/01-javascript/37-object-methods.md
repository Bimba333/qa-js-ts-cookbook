# Object Methods

## Связь с предыдущей главой

Предыдущие главы раздела Objects показали, что object может хранить related data:

```text
Object
│
▼
one entity
│
▼
many named properties
```

Затем мы научились:

```text
Destructuring
│
└── extract selected properties

Optional Chaining
│
└── safely read optional property paths

Nullish Coalescing
│
└── choose fallback for null/undefined
```

Теперь появляется следующий вопрос:

> Может ли object хранить behavior, связанное с его data?

Например, есть user:

```javascript
const user = {
  name: 'Anna',
  email: 'anna@example.test',
  role: 'admin'
};
```

Data already belongs together.

Но behavior тоже может belong to the same entity:

```text
user
│
├── name
├── email
├── role
├── rename()
└── describe()
```

Главная модель главы:

```text
Object
│
├── State
└── Behavior
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что object stores related data;
* что property has key and value;
* что property value can be any JavaScript value;
* что function object можно хранить в variable;
* что `this` определяется при invocation;
* что ordinary `object.method()` invocation выбирает receiver из формы вызова;
* что `call()`, `apply()` and `bind()` связаны с receiver selection.

Не требуется знать descriptors, prototypes, classes, inheritance, `Object.create()`, method borrowing, `super` или arrow functions as methods in depth. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            130-160 минут
Разбор схем:             55-75 минут
Запуск примеров:         20-30 минут
Практика:                110-140 минут
Повторение материала:    30 минут
```

Уровень сложности: **L3-L4**.

Object methods кажутся простыми, но они связывают несколько важных идей: objects, functions, properties, receiver and `this`.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/36-nullish-coalescing.md
```

Текущая глава:

```text
docs/01-javascript/37-object-methods.md
```

Следующая глава:

```text
docs/01-javascript/38-object-descriptors.md
```

Следующая глава ответит:

> Почему некоторые object properties behave differently from others?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существуют object methods;
* почему behavior может belong to object;
* как method связан с object state;
* как выглядит method syntax;
* как calling method differs from calling ordinary function;
* как method invocation связан с `this`;
* почему method is still an ordinary function;
* почему не стоит определять method только как "function inside object";
* какие ошибки встречаются чаще всего;
* как object methods используются in Automation QA.

---

## Мотивация

Начнем с проблемы.

Есть user data:

```javascript
const user = {
  name: 'Anna',
  email: 'anna@example.test',
  role: 'admin'
};
```

И есть behavior:

```javascript
function describeUser(user) {
  return user.name + ' <' + user.email + '> [' + user.role + ']';
}

function renameUser(user, newName) {
  user.name = newName;
}
```

Такой код работает.

Но behavior живет отдельно от entity:

```text
user data
│
├── name
├── email
└── role

functions elsewhere
│
├── describeUser(user)
└── renameUser(user, newName)
```

Вопрос:

> Почему behavior, который работает только с user, живет отдельно от user?

Object method позволяет показать ownership:

```javascript
const user = {
  name: 'Anna',
  email: 'anna@example.test',
  role: 'admin',
  describe() {
    return this.name + ' <' + this.email + '> [' + this.role + ']';
  }
};
```

Теперь behavior belongs to the same entity:

```text
user
│
├── state
│   ├── name
│   ├── email
│   └── role
│
└── behavior
    └── describe()
```

Главный вопрос главы:

> Why does this behavior belong to this object?

---

## Теория

Object method is behavior associated with an object.

Но важно не начинать и не заканчивать определением "method is a function inside object". Это слишком механическое описание.

Лучше:

```text
Method
│
▼
behavior that belongs to an entity
```

### Why methods exist

Objects started as data grouping:

```text
user
│
├── name
├── email
└── role
```

But entities often have actions:

```text
user
│
├── can describe itself
├── can rename itself
└── can check its role
```

Methods let object expose behavior near the data it uses.

### State and behavior

State is data stored in object:

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};
```

Behavior is what object can do:

```javascript
const user = {
  name: 'Anna',
  role: 'admin',
  isAdmin() {
    return this.role === 'admin';
  }
};
```

Model:

```text
Object
│
├── State: role = 'admin'
└── Behavior: isAdmin()
```

### Method syntax

Modern method syntax:

```javascript
const user = {
  describe() {
    return this.name;
  }
};
```

Older equivalent style:

```javascript
const user = {
  describe: function () {
    return this.name;
  }
};
```

Both store function value in object property.

In this chapter we use method syntax because it expresses intention clearly.

### Calling methods

```javascript
user.describe();
```

This is method invocation:

```text
object.method()
│
├── object -> receiver
└── method -> function called
```

This reconnects to the earlier chapter on `this`:

```text
ordinary object.method() invocation
│
▼
receiver is object before dot
│
▼
this inside method points to receiver
```

This is the working model for ordinary method calls in this chapter. Other invocation forms were studied in `call()`, `apply()` and `bind()`, and deeper mechanics will return in Prototype chapters.

### Methods vs ordinary functions

Ordinary function:

```javascript
function describeUser(user) {
  return user.name;
}
```

Method:

```javascript
const user = {
  name: 'Anna',
  describe() {
    return this.name;
  }
};
```

Difference is not that method is a magical new kind of function.

Important:

```text
Methods are ordinary functions.
They become methods because they are accessed and called through an object.
```

### Relationship with `this`

Inside method, `this` lets behavior read the current receiver's state:

```javascript
const account = {
  owner: 'Anna',
  balance: 100,
  getLabel() {
    return this.owner + ': ' + this.balance;
  }
};
```

Method call:

```javascript
account.getLabel();
```

Receiver reminder:

```text
account.getLabel()
│
└── this -> account
```

### Arrow functions as methods

Arrow functions have special `this` behavior. This course already introduced arrow functions and `this` separately, but this chapter does not teach arrow methods in depth.

For now:

```text
Use regular method syntax for object methods.
```

Detailed edge cases come later.

---

## Внутренний механизм

Рассмотрим:

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  }
};

apiClient.buildUrl('/users');
```

Conceptual flow:

```text
1. Read identifier apiClient
2. Find property "buildUrl"
3. Get function value stored in that property
4. Call it through apiClient
5. Set receiver for this invocation
6. Inside method: this -> apiClient
7. Read this.baseUrl
8. Return final URL
```

### Method lifecycle

```text
create object
│
▼
store data properties
│
▼
store method property
│
▼
call object.method()
│
▼
method executes with receiver
```

### Method execution

```text
object.method(args)
│
▼
function execution starts
│
▼
this points to receiver
│
▼
method reads/uses object state
```

### Function vs method internally

The function value itself remains a function object.

```text
function object
│
├── can be stored in variable
├── can be stored in object property
└── can be called
```

It becomes a method in practical terms when used as behavior of an object:

```text
object property contains function
│
▼
called as object.method()
│
▼
method invocation
```

### State change preview

Some methods only read state:

```javascript
describe() {
  return this.name;
}
```

Some methods update state:

```javascript
rename(newName) {
  this.name = newName;
}
```

This chapter only previews state-changing methods. Object descriptors, immutability patterns and deeper property behavior will be studied later.

---

## Ментальная модель

Employee profile:

```text
Employee profile
│
├── State
│   ├── name
│   └── role
│
└── Behavior
    ├── describe()
    └── promote()
```

Control panel:

```text
Device
│
├── state: power, mode
└── buttons: turnOn(), changeMode()
```

Game character:

```text
Character
│
├── health
├── level
├── move()
└── takeDamage()
```

Bank account:

```text
Account
│
├── owner
├── balance
├── deposit()
└── getBalance()
```

Главная модель:

```text
Object
│
├── State
└── Behavior
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-40/
```

Запуск:

```bash
node examples/chapter-40/01-basic-method.js
node examples/chapter-40/02-method-call.js
node examples/chapter-40/03-this-preview.js
node examples/chapter-40/04-common-mistakes.js
node examples/chapter-40/05-api-client.js
node examples/chapter-40/06-qa-example.js
```

### Пример 1. Basic method

```javascript
const user = {
  name: 'Anna',
  role: 'admin',
  describe() {
    return this.name + ' is ' + this.role;
  }
};

console.log(user.describe());
```

### Пример 2. Method call

```javascript
const account = {
  owner: 'Anna',
  balance: 100,
  getBalance() {
    return this.balance;
  }
};

console.log(account.getBalance());
```

### Пример 3. this preview

```javascript
const stagingClient = {
  baseUrl: 'https://staging.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  }
};

console.log(stagingClient.buildUrl('/users'));
```

### Пример 4. Common mistakes

```javascript
const user = {
  name: 'Anna',
  describe() {
    return this.name;
  }
};

const describe = user.describe;

console.log(user.describe());
console.log(typeof describe);
```

Detached function is not called here to avoid intentional runtime error. The example shows that method value can be detached as function value.

### Пример 5. API client

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

console.log(apiClient.describeRequest('GET', '/users'));
```

### Пример 6. QA example

```javascript
const assertionHelper = {
  suite: 'smoke',
  formatStatus(testName, actualStatus, expectedStatus) {
    const passed = actualStatus === expectedStatus;

    return this.suite + ': ' + testName + ' -> ' + passed;
  }
};

console.log(assertionHelper.formatStatus('login', 200, 200));
console.log(assertionHelper.formatStatus('checkout', 500, 200));
```

---

## Частые вопросы

### Method - это отдельный тип function?

Нет.

```text
method
│
└── ordinary function used as object behavior
```

### Почему не говорить просто "function inside object"?

Потому что такая фраза описывает форму, но не объясняет ownership.

Better question:

```text
Why does this behavior belong to this object?
```

### Method всегда использует `this`?

Нет. Method может не использовать `this`, but many useful methods read or update object state through `this`.

### Можно ли использовать arrow function as method?

Синтаксически можно хранить arrow function in property, but arrow functions have different `this` behavior. This chapter recommends regular method syntax. Details later.

### Method может менять object?

Да, если method assigns to object properties through `this` or another reference. This chapter shows the idea but does not go deep into descriptors or immutability.

---

## Распространенные мифы

### Миф: methods are special magic functions

Реальность:

Methods are ordinary functions used through objects.

### Миф: method belongs to object only because it is written inside braces

Реальность:

The important design idea is behavior ownership. Syntax should express that ownership.

### Миф: every object should have methods

Реальность:

Some objects should be pure data: payloads, expected data, simple configs. Methods are useful when behavior naturally belongs to entity.

### Миф: `this` is always obvious

Реальность:

For ordinary `object.method()` calls the receiver model is clear. Other invocation forms were covered in `call()`, `apply()` and `bind()`.

---

## Типичные ошибки

### Ошибка 1. Отделять behavior that belongs to object

```javascript
function buildUrl(client, path) {
  return client.baseUrl + path;
}
```

If behavior belongs to API client, method can be clearer:

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  }
};
```

### Ошибка 2. Использовать method where pure function is clearer

Not every function should become method.

If behavior does not need object state, ordinary function may be simpler.

### Ошибка 3. Detached method loses receiver

```javascript
const buildUrl = apiClient.buildUrl;
```

Now function value is detached. If called as `buildUrl('/users')`, ordinary receiver is gone. This was studied in `this`, `call()` and `bind()`.

### Ошибка 4. Использовать arrow function for method without understanding `this`

Use regular method syntax until arrow `this` behavior is fully clear.

---

## Практическое использование

### Entity behavior

```javascript
const user = {
  name: 'Anna',
  rename(newName) {
    this.name = newName;
  }
};
```

### API client

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl(path) {
    return this.baseUrl + path;
  }
};
```

### Assertion helper

```javascript
const assertions = {
  suite: 'smoke',
  statusLine(testName, passed) {
    return this.suite + ': ' + testName + ' -> ' + passed;
  }
};
```

### Configuration helper

```javascript
const config = {
  baseUrl: 'https://api.example.test',
  timeout: 5000,
  describe() {
    return this.baseUrl + ' timeout=' + this.timeout;
  }
};
```

---

## Использование в Automation QA

### API client objects

API client naturally owns behavior for URL building and request description:

```text
apiClient
│
├── state: baseUrl
└── behavior: buildUrl()
```

### Page Object preview

Page Object will be studied deeply later.

High-level preview:

```text
LoginPage
│
├── state: locators
└── behavior: login()
```

### Assertion helpers

Assertion helper object can own suite name or reporting prefix:

```text
assertions
│
├── state: suite
└── behavior: format result
```

### Request builders

Request builder object can own base payload and behavior for building requests.

### Configuration helpers

Configuration object can expose methods that describe or normalize configuration. Advanced patterns will appear in framework architecture chapters.

---

## Диаграммы главы

### 1. Why methods exist

```text
data belongs together
│
▼
behavior uses that data
│
▼
method belongs to object
```

### 2. Data only

```text
user
│
├── name
├── email
└── role
```

### 3. Data + behavior

```text
user
│
├── state
└── methods
```

### 4. Method call

```text
object.method()
│
▼
execute behavior
```

### 5. State and behavior

```text
Object
│
├── State
└── Behavior
```

### 6. Object model

```text
entity
│
├── properties with data
└── properties with functions
```

### 7. Current JavaScript model

```text
Objects
│
├── properties
├── safe access
├── fallback values
└── methods
```

### 8. Method execution

```text
call method
│
▼
create function execution
│
▼
use receiver as this
```

### 9. Receiver reminder

```text
apiClient.buildUrl()
│
└── receiver -> apiClient
```

### 10. this inside method

```text
this
│
└── current receiver
```

### 11. Function vs method

```text
function value
│
├── called alone -> ordinary function call
└── called through object -> method call
```

### 12. QA API client

```text
apiClient
│
├── baseUrl
└── buildUrl()
```

### 13. Assertion helper object

```text
assertions
│
├── suite
└── formatStatus()
```

### 14. Configuration object

```text
config
│
├── baseUrl
├── timeout
└── describe()
```

### 15. Readability

```text
behavior near data
│
▼
reader sees responsibility
```

### 16. Common mistakes

```text
detach method
│
▼
receiver lost
```

### 17. Method lifecycle

```text
define object
│
▼
store method
│
▼
call method
│
▼
method returns result
```

### 18. Object responsibility

```text
object owns data
│
▼
object owns related behavior
```

### 19. Behavior ownership

```text
behavior uses object state
│
▼
behavior belongs to object
```

### 20. Complete object model

```text
Object
│
├── State
│   └── data properties
└── Behavior
    └── methods
```

### 21. Method invocation

```text
object.method(args)
│
├── receiver
└── arguments
```

### 22. State change preview

```text
method
│
▼
updates property
│
▼
state changes
```

### 23. Bridge to descriptors

```text
properties can behave differently
│
▼
Object Descriptors
```

### 24. Bridge to prototypes

```text
methods can be shared
│
▼
Prototype later
```

### 25. Mental model summary

```text
employee profile
control panel
device buttons
```

### 26. Entity behavior

```text
entity
│
├── what it knows
└── what it can do
```

### 27. Device buttons

```text
device state
│
└── buttons operate on state
```

### 28. Game character

```text
character
│
├── health
└── takeDamage()
```

### 29. Bank account

```text
account
│
├── balance
└── deposit()
```

### 30. QA Page Object preview

```text
Page Object
│
├── locators
└── actions
```

### 31. Object evolution

```text
data object
│
▼
object with behavior
│
▼
future: prototypes/classes
```

### 32. Summary diagram

```text
Object
│
├── State
└── Behavior
```

---

## Практика

Практика находится в:

```text
practice/chapter-40.md
```

Рекомендуемый порядок:

```text
1. Ответить на концептуальные вопросы.
2. Определить methods.
3. Предсказать output.
4. Запустить examples/chapter-40/.
5. Выполнить debugging tasks.
6. Сделать QA mini-project.
7. Свериться с solutions/chapter-40.md.
```

---

## Решения

Решения находятся в:

```text
solutions/chapter-40.md
```

Не открывайте решения до самостоятельной попытки. Главный вопрос практики:

```text
Why should this behavior belong to the object?
```

---

## Итоги

Object Methods продолжают Objects section:

```text
Objects
│
▼
Destructuring
│
▼
Optional Chaining
│
▼
Nullish Coalescing
│
▼
Object Methods
```

Главная модель:

```text
Object
│
├── State
└── Behavior
```

Method is ordinary function used as object behavior. It is called as `object.method()`, and in ordinary method invocation `this` points to receiver.

---

## Что нужно запомнить

* Object can store state and behavior.
* Method represents behavior belonging to one entity.
* Method is an ordinary function used through an object.
* Do not define method only as "function inside object".
* Ordinary `object.method()` invocation sets receiver from object before dot.
* `this` inside regular method usually reads or updates receiver state.
* Detached method can lose receiver.
* Use regular method syntax unless arrow `this` behavior is intentionally needed.
* In Automation QA, methods appear in API clients, assertion helpers, request builders and Page Objects.
* Object Descriptors are next: they explain why properties can behave differently.

---

## Quick Check

Ответьте без запуска кода.

1. Зачем существуют object methods?
2. Что такое object state?
3. Что такое object behavior?
4. Почему method не стоит определять только как "function inside object"?
5. Чем method отличается от ordinary function на уровне invocation?
6. Как `this` связан с ordinary method call?
7. Почему detached method может быть проблемой?
8. Когда behavior should belong to object?
9. Где object methods используются в Automation QA?
10. Какая следующая тема логически продолжает Object Methods?
