# Prototype

## Связь с предыдущей главой

Предыдущая глава объяснила Object Descriptors.

Главная модель была такой:

```text
Property
│
├── Value
└── Rules
    ├── writable
    ├── enumerable
    └── configurable
```

Теперь мы возвращаемся к behavior.

В главе про Object Methods мы видели, что object может хранить methods:

```text
Object
│
├── State
└── Behavior
```

Но появляется новый вопрос:

> Если много объектов нуждаются в одинаковом behavior, должен ли каждый object хранить собственную копию method?

Представьте 1000 user objects:

```text
user1 -> login(), logout(), rename()
user2 -> login(), logout(), rename()
user3 -> login(), logout(), rename()
...
user1000 -> login(), logout(), rename()
```

Data у каждого user своя.

Behavior одинаковый.

Prototype отвечает именно на этот вопрос:

```text
Many objects
│
▼
One shared behavior
```

В этой главе Prototype рассматривается как практический механизм sharing behavior. Мы не будем подробно изучать Prototype Chain, `constructor.prototype`, classes, `new` или inheritance. Эти темы идут позже.

---

## Предварительные требования

Для этой главы нужно понимать:

* что object stores related data;
* что object property has key and value;
* что method is property with function object value;
* что обычный вызов `object.method()` выбирает receiver из формы вызова;
* что `this` внутри обычного method call связан с receiver;
* что descriptor describes own property rules;
* что `Object` содержит встроенные helper methods.

Не требуется знать Prototype Chain in depth, classes, `new`, `constructor.prototype`, `hasOwnProperty()`, `Reflect` или `__proto__` internals. `__proto__` будет упомянут только как деталь, к которой не нужно привязывать основную модель.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            150-190 минут
Разбор схем:             70-90 минут
Запуск примеров:         25-35 минут
Практика:                130-160 минут
Повторение материала:    35 минут
```

Уровень сложности: **L4**.

Prototype кажется внутренней темой, но в этой главе он начинается с простой инженерной проблемы: repeated methods. Если много объектов хранят одинаковые function objects, код становится тяжелее читать, сложнее поддерживать и легче сломать.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/38-object-descriptors.md
```

Текущая глава:

```text
docs/01-javascript/39-prototype.md
```

Следующая глава:

```text
docs/01-javascript/40-prototype-chain.md
```

Следующая глава ответит:

> Что происходит, если requested property не найдена ни в object, ни в его prototype?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует Prototype;
* почему duplicated methods are a problem;
* что такое prototype object на концептуальном уровне;
* чем own property отличается от inherited property;
* как JavaScript ищет property через object and prototype;
* как `Object.getPrototypeOf()` помогает увидеть prototype;
* зачем существует `Object.setPrototypeOf()` на высоком уровне;
* почему Prototype прежде всего about shared behavior;
* почему не стоит начинать изучение Prototype с inheritance;
* как Prototype связан с Page Objects, API clients and framework utilities.

---

## Мотивация

Начнем с проблемы.

Есть три user objects:

```javascript
const userAnna = {
  name: 'Anna',
  role: 'admin',
  describe() {
    return this.name + ' [' + this.role + ']';
  }
};

const userKate = {
  name: 'Kate',
  role: 'editor',
  describe() {
    return this.name + ' [' + this.role + ']';
  }
};

const userMax = {
  name: 'Max',
  role: 'viewer',
  describe() {
    return this.name + ' [' + this.role + ']';
  }
};
```

Состояние разное:

```text
Anna / admin
Kate / editor
Max  / viewer
```

Но method одинаковый:

```text
describe()
│
└── same algorithm repeated
```

Проблема не в том, что код не работает.

Он работает.

Проблема в другом:

```text
duplicated behavior
│
├── harder to update
├── easier to make inconsistent
├── noisy objects
└── poor framework design
```

Если завтра формат описания изменится, нужно найти каждую копию:

```text
Anna.describe()
Kate.describe()
Max.describe()
...
```

Это плохая модель для framework code.

Нам нужен один shared place:

```text
user behavior
│
└── describe()

user objects
│
├── Anna data
├── Kate data
└── Max data
```

Prototype дает такой shared place.

---

## Теория

Prototype - это object, который может использоваться другим object как shared source of properties.

Главная идея:

```text
Object
│
├── Own properties
│   ├── own data
│   └── own methods if needed
│
└── Prototype
    └── shared properties
```

Важно:

Prototype is an object.

Не абстрактная магия.

Не отдельный тип значения.

Не synonym for class.

Так как prototype - обычный object, он может содержать любые properties:

```text
prototype object
│
├── data property
├── method property
└── any other ordinary property
```

Но на практике prototype чаще всего используют именно для shared behavior.

Причина простая: data обычно отличается у каждого конкретного object, а behavior часто повторяется.

```text
Own object
│
└── object-specific data

Prototype
│
└── commonly shared behavior
```

Поэтому в этой главе examples deliberately focus on methods.

Это не ограничение механизма языка.

Это наиболее частый и полезный способ его применения.

В нашем основном примере prototype содержит shared behavior:

```text
prototype object
│
├── describe()
├── rename()
└── canAccess()
```

Другие objects могут быть связаны с этим prototype:

```text
userAnna
│
├── name: "Anna"
├── role: "admin"
└── prototype ─────► userBehavior
                    │
                    └── describe()
```

Когда JavaScript читает property, он сначала смотрит в сам object:

```text
read userAnna.name
│
▼
look in userAnna
│
▼
found own property
```

Если property не найдена, JavaScript может посмотреть в prototype:

```text
read userAnna.describe
│
▼
look in userAnna
│
▼
not found
│
▼
look in prototype
│
▼
found shared method
```

В этой главе мы ограничиваемся одним prototype level. Полный Prototype Chain будет изучаться в следующей главе.

### Own property

Own property - property, которая находится directly on object.

```javascript
const user = {
  name: 'Anna'
};
```

`name` is own property:

```text
user
│
└── own property: name
```

### Inherited property

Inherited property - property, которую object получает через prototype lookup.

```text
user
│
├── own property: name
└── prototype
    └── inherited method: describe()
```

Термин "inherited" здесь означает:

```text
not stored directly on object
│
but available through prototype lookup
```

Это не значит, что мы уже изучаем inheritance как архитектурную тему. Inheritance будет обсуждаться позже вместе с Prototype Chain and Classes.

### `Object.getPrototypeOf()`

`Object.getPrototypeOf(object)` возвращает prototype object, связанный с object.

```javascript
const prototype = Object.getPrototypeOf(user);
```

Ментально:

```text
Object.getPrototypeOf(user)
│
▼
show the shared behavior object
```

### `Object.setPrototypeOf()`

`Object.setPrototypeOf(object, prototype)` может установить prototype manually.

В этой главе мы используем его только как понятный учебный инструмент:

```javascript
Object.setPrototypeOf(user, userBehavior);
```

Ментально:

```text
user
│
└── prototype link ───► userBehavior
```

Важно: в production code `Object.setPrototypeOf()` применяют осторожно. Он меняет связь уже существующего object and can make code harder to reason about. Более устойчивые способы создания объектов с нужным prototype будут изучаться позже.

---

## Внутренний механизм

Когда engine выполняет чтение property, он не сразу говорит `undefined`.

Он проходит lookup process.

Допустим:

```javascript
console.log(user.describe());
```

Engine видит:

```text
Need property: "describe"
Target object: user
```

Дальше:

```text
Step 1
│
▼
Look inside user own properties
│
▼
describe not found
```

Затем:

```text
Step 2
│
▼
Look inside user's prototype
│
▼
describe found
```

После этого method вызывается как обычный method:

```text
user.describe()
│
├── function found in prototype
└── receiver is still user
```

Это важный момент.

Method может быть stored in prototype, но ordinary invocation still uses object before dot as receiver:

```text
user.describe()
│
├── method location: prototype
└── receiver: user
```

Поэтому inside method:

```javascript
describe() {
  return this.name;
}
```

`this` points to `user` при обычном вызове `user.describe()`.

```text
shared method
│
▼
uses this
│
▼
reads data from actual receiver
```

Так одна function object может работать с разными objects:

```text
Anna object ──┐
              ├── uses same describe()
Kate object ──┘
```

### Что делает engine прямо сейчас?

Для чтения `user.describe`:

```text
Engine
│
├── receives property name: "describe"
├── checks own properties of user
├── does not find it
├── follows prototype link
├── checks prototype properties
├── finds function object
└── returns it as property value
```

Для вызова `user.describe()`:

```text
Engine
│
├── finds function through lookup
├── sees ordinary method invocation
├── chooses user as receiver
├── creates Function Execution Context
└── executes shared function with this = user
```

Мы пока не разбираем, что будет, если prototype itself has another prototype. Это Prototype Chain, следующая глава.

---

## Ментальная модель

Prototype удобно представить как shared toolbox.

Каждый object хранит свои данные:

```text
userAnna
│
├── name: "Anna"
└── role: "admin"
```

Но tools лежат в общей комнате:

```text
shared toolbox
│
├── describe()
├── rename()
└── canAccess()
```

Object не копирует каждый tool внутрь себя.

Он knows where shared toolbox is:

```text
userAnna
│
└── link to shared toolbox
```

Если нужен own data:

```text
look in userAnna
│
└── found name
```

Если нужен shared behavior:

```text
look in userAnna
│
└── not found describe
    │
    ▼
    look in shared toolbox
    │
    └── found describe()
```

Другие mental models:

```text
library
│
├── many readers
└── one shared book of instructions
```

```text
central instruction manual
│
├── object A reads instruction
├── object B reads instruction
└── object C reads instruction
```

```text
blueprint shelf
│
├── shared method A
├── shared method B
└── shared method C
```

Главное:

```text
Prototype
│
└── place for shared behavior
```

Не начинайте с мысли "Prototype is inheritance".

В этой главе точнее:

```text
Prototype
│
└── shared behavior repository
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-42/
```

Запуск:

```bash
node examples/chapter-42/01-duplicated-methods.js
```

### Пример 1. Дублированные методы

Файл:

```text
examples/chapter-42/01-duplicated-methods.js
```

Идея:

```text
many objects
│
└── same method copied many times
```

Такой код работает, но плохо масштабируется.

### Пример 2. Shared method через prototype

Файл:

```text
examples/chapter-42/02-shared-method.js
```

Идея:

```text
object data
│
└── own properties

shared behavior
│
└── prototype method
```

### Пример 3. Property lookup

Файл:

```text
examples/chapter-42/03-property-lookup.js
```

Идея:

```text
read property
│
├── first: own object
└── then: prototype
```

### Пример 4. Типичные ошибки

Файл:

```text
examples/chapter-42/04-common-mistakes.js
```

Идея:

```text
shared prototype object
│
└── should not store per-user changing state
```

### Пример 5. Page Object preview

Файл:

```text
examples/chapter-42/05-page-object-preview.js
```

Идея:

```text
Page Object instances
│
├── own page name
└── shared actions
```

### Пример 6. QA example

Файл:

```text
examples/chapter-42/06-qa-example.js
```

Идея:

```text
API clients
│
├── own baseUrl
└── shared request description behavior
```

---

## Частые вопросы

### Prototype - это то же самое, что class?

Нет.

Prototype is object used for shared property lookup.

Class будет изучаться позже как синтаксис и модель создания objects. Не нужно смешивать эти темы сейчас.

### Prototype - это hidden object?

Prototype не виден как обычная own property, но его можно получить через `Object.getPrototypeOf()`.

```text
object
│
└── prototype link
```

Главная мысль: prototype is connected to object, but not stored as ordinary data property like `name`.

### В prototype могут быть только методы?

Нет.

Prototype - обычный object, поэтому он может содержать любые properties.

```text
Prototype
│
├── data property
└── method property
```

Но practical convention usually differs:

```text
object
│
└── own data

prototype
│
└── shared behavior
```

В этой главе акцент сделан на methods, потому что именно shared behavior чаще всего объясняет, зачем Prototype нужен в реальном коде.

### Нужно ли использовать `__proto__`?

В этой главе нет.

`__proto__` часто встречается в статьях и DevTools, но для учебной модели достаточно `Object.getPrototypeOf()` and `Object.setPrototypeOf()`. Детали `__proto__` будут обсуждаться позже.

### Prototype нужен только для экономии памяти?

Нет.

Memory intuition полезна:

```text
one shared function
│
instead of many copied functions
```

Но главная польза шире:

* меньше дублирования;
* единое место для behavior;
* более читаемая архитектура;
* проще обновлять shared logic.

### Если method находится в prototype, чей `this` внутри method?

При обычном вызове:

```javascript
user.describe();
```

receiver is `user`.

```text
method found in prototype
│
but
│
receiver is user
```

Другие формы вызова уже изучались в главах про `call()`, `apply()` and `bind()`.

---

## Распространенные мифы

### Миф: Prototype - это про classes

Реальность: Prototype exists independently of classes.

В этой главе Prototype is about sharing behavior between objects.

### Миф: inherited property copied into object

Реальность: property is not copied during lookup.

```text
object
│
└── missing property
    │
    ▼
    prototype
    │
    └── property found there
```

### Миф: Prototype should store all data

Реальность: prototype is good for shared behavior. Per-object changing state should usually remain own data.

```text
own object
│
└── user-specific state

prototype
│
└── shared behavior
```

### Миф: Prototype Chain нужно знать сразу

Реальность: сначала нужно понять one object + one prototype. Chain is the next layer.

---

## Типичные ошибки

### Ошибка 1. Хранить per-object state в prototype

Неправильный код:

```javascript
const userBehavior = {
  lastLogin: null,
  login() {
    this.lastLogin = '2026-06-26';
  }
};
```

Что произошло:

```text
lastLogin looks like user-specific state
│
but placed in shared behavior object
```

Почему это опасно:

* читатель кода ожидает shared methods in prototype;
* changing state in shared object can confuse ownership;
* framework objects become harder to debug.

Исправленный вариант:

```javascript
const user = {
  name: 'Anna',
  lastLogin: null
};
```

```text
user-specific data
│
└── own property
```

### Ошибка 2. Думать, что inherited property стала own property

Неправильная модель:

```text
user.describe()
│
└── describe copied into user
```

Что происходит на самом деле:

```text
user
│
└── no own describe
    │
    ▼
    prototype
    │
    └── describe found
```

Исправленная модель:

```text
lookup
│
≠
copy
```

### Ошибка 3. Начинать изучение Prototype с `__proto__`

Неправильный подход:

```text
Prototype
│
└── start with __proto__
```

Почему это мешает:

* внимание уходит в деталь доступа;
* теряется главная проблема duplicated behavior;
* сложнее понять, зачем механизм существует.

Исправленный подход:

```text
duplicated methods
│
▼
shared behavior
│
▼
prototype object
```

### Ошибка 4. Путать receiver and method location

Неправильная модель:

```text
method stored in prototype
│
▼
this is prototype
```

Правильная модель для ordinary invocation:

```text
user.describe()
│
├── method found in prototype
└── receiver is user
```

---

## Практическое использование

Prototype полезен, когда:

```text
many objects
│
├── different data
└── same behavior
```

Типичные случаи:

* common object behavior;
* framework utilities;
* shared validators;
* objects created from same pattern;
* internal architecture of many JavaScript features.

Пример без prototype:

```text
clientA
│
├── baseUrl
└── describeRequest()

clientB
│
├── baseUrl
└── describeRequest()
```

Пример with shared behavior:

```text
clientA ──┐
          ├── prototype ──► apiClientBehavior
clientB ──┘                 └── describeRequest()
```

Это улучшает maintainability:

```text
change shared method once
│
▼
all linked objects use updated behavior
```

Но Prototype не нужно применять везде.

Если object один и behavior уникален, own method может быть читаемее.

```text
one object
│
└── unique behavior
    │
    ▼
    own method is fine
```

---

## Использование в Automation QA

В Automation QA Prototype важен не как академическая тема, а как база для понимания framework architecture.

### Page Objects

Page Objects часто имеют:

```text
LoginPage
│
├── own data
│   ├── page
│   └── locators
│
└── shared behavior
    ├── open()
    ├── login()
    └── assertLoaded()
```

Пока мы не изучаем classes, но idea уже видна:

```text
many page objects
│
└── shared page behavior
```

### API clients

API clients часто различаются state:

```text
stagingClient.baseUrl
productionClient.baseUrl
localClient.baseUrl
```

Но behavior одинаковый:

```text
buildUrl()
describeRequest()
validateStatus()
```

Prototype помогает понять, почему behavior can live in shared place:

```text
API client objects
│
├── own configuration
└── shared request behavior
```

### Assertion helpers

Shared validators:

```text
statusValidator
schemaValidator
businessValidator
```

могут использовать common behavior:

```text
shared assertion behavior
│
├── formatError()
├── describeExpected()
└── describeActual()
```

### Framework utilities

В framework code важно отделять:

```text
per-test state
│
└── own properties

shared utility behavior
│
└── prototype or shared object
```

Это помогает избегать случайного shared mutable state.

---

## Диаграммы главы

### 1. Why Prototype exists

```text
Many objects
│
├── same method A
├── same method A
├── same method A
└── same method A
        │
        ▼
Need shared behavior
```

### 2. Duplicated methods

```text
userAnna
│
└── describe()

userKate
│
└── describe()

userMax
│
└── describe()
```

### 3. Shared methods

```text
userAnna ──┐
userKate ──┼──► userBehavior
userMax  ──┘    └── describe()
```

### 4. Object before prototype

```text
user
│
├── name
├── role
└── describe()
```

### 5. Object after prototype

```text
user
│
├── name
├── role
└── prototype ──► behavior
                  └── describe()
```

### 6. Prototype object

```text
prototype object
│
├── shared method
├── shared method
└── shared method
```

### 7. Own properties

```text
user
│
├── own: name
└── own: role
```

### 8. Shared behavior

```text
behavior
│
├── describe()
├── rename()
└── canAccess()
```

### 9. Property lookup

```text
read user.describe
│
├── user own properties
│   └── not found
└── prototype
    └── found
```

### 10. Current JavaScript model

```text
Object model
│
├── properties
├── descriptors
├── methods
└── prototype
    └── shared behavior
```

### 11. QA Page Objects

```text
LoginPage ──┐
ProfilePage ┼──► pageBehavior
OrdersPage ─┘    ├── open()
                 └── assertLoaded()
```

### 12. API client sharing

```text
stagingClient ─────┐
productionClient ──┼──► apiClientBehavior
localClient ───────┘    └── describeRequest()
```

### 13. Readability

```text
object
│
├── business data
└── link to shared behavior
```

### 14. Common mistakes

```text
prototype
│
├── shared method        OK
└── user-specific state  risky
```

### 15. Property search

```text
property name
│
▼
object
│
▼
prototype
```

### 16. Missing property

```text
object
│
└── not found
    │
    ▼
prototype
│
└── not found
    │
    ▼
undefined
```

### 17. Prototype lookup

```text
lookup
│
├── own first
└── prototype second
```

### 18. Memory intuition

```text
Without prototype
│
├── many copies of same behavior
│
▼
With prototype
│
└── one shared function
```

### 19. Shared function

```text
describe()
│
├── used by userAnna
├── used by userKate
└── used by userMax
```

### 20. Object relationship

```text
object
│
└── has prototype link
    │
    ▼
    prototype object
```

### 21. Method location

```text
user.describe()
│
├── location: prototype
└── receiver: user
```

### 22. Object evolution

```text
separate data
│
▼
object with own methods
│
▼
object with shared prototype behavior
```

### 23. Prototype object again

```text
Prototype
│
└── ordinary object used as shared source
```

### 24. Shared repository

```text
behavior repository
│
├── method A
├── method B
└── method C
```

### 25. Bridge to Prototype Chain

```text
object
│
└── prototype
    │
    └── next question:
        what if not found here?
```

### 26. Bridge to Classes

```text
Prototype understanding
│
▼
Classes later become easier
```

### 27. Mental model summary

```text
Object
│
├── own data
└── shared toolbox
```

### 28. Complete prototype model

```text
Object
│
├── own properties
│
└── prototype link
    │
    ▼
    Prototype object
    │
    └── shared behavior
```

### 29. Lookup timeline

```text
read property
│
├── check object
├── check prototype
└── return value or undefined
```

### 30. Property ownership

```text
own property
│
└── stored on object

inherited property
│
└── found through prototype
```

### 31. Shared state warning

```text
prototype
│
└── shared place
    │
    ▼
avoid per-object changing state here
```

### 32. Function reuse

```text
one function object
│
├── receiver A
├── receiver B
└── receiver C
```

### 33. Object vs prototype

```text
object
│
└── specific data

prototype
│
└── shared behavior
```

### 34. Shared behavior flow

```text
call method
│
▼
lookup finds prototype method
│
▼
execute with actual receiver
```

### 35. Library analogy

```text
many readers
│
└── one library book
```

### 36. Summary diagram

```text
Object
│
├── Own data
├── Own methods if needed
└── Missing property?
    │
    ▼
    Look in Prototype
```

## Итоги

Prototype появляется не из желания усложнить JavaScript.

Он решает конкретную проблему:

```text
many objects
│
└── same behavior
```

Без Prototype одинаковые methods приходится хранить directly inside every object. Это создает duplication and maintenance cost.

Prototype дает shared object, в котором может жить common behavior:

```text
object
│
├── own data
└── prototype
    └── shared properties
```

Когда JavaScript читает property, он сначала проверяет own properties. Если property не найдена, engine смотрит в prototype.

Prototype can contain any properties because it is an ordinary object.

В practical code его чаще всего используют for shared methods, because methods are the behavior that many objects can reuse safely.

Главная модель главы:

```text
Object
│
├── Own data
├── Own methods if needed
└── Missing property?
    │
    ▼
    Look in Prototype
```

Следующая глава расширит эту модель:

```text
Object
│
▼
Prototype
│
▼
Prototype of prototype
│
▼
...
```

Это будет Prototype Chain.

---

## Что нужно запомнить

✓ Prototype is an object used as shared source of properties.

✓ Prototype может содержать любые properties, но в этой главе главный practical focus - shared methods.

✓ Own property находится directly on object.

✓ Inherited property находится through prototype lookup.

✓ Lookup сначала проверяет object, затем prototype.

✓ Method can be found in prototype, while receiver can still be original object.

✓ Prototype не копирует method into every object.

✓ Per-object state should usually remain own property.

✓ `Object.getPrototypeOf()` показывает prototype object.

✓ Prototype Chain будет изучаться в следующей главе.

---

## Quick Check

1. Why is duplicated behavior a problem?

2. What kind of value is a prototype?

3. Чем own property отличается от inherited property?

4. Where does JavaScript look first during property lookup?

5. What happens if property is not found on object?

6. Why is Prototype about sharing behavior, not primarily inheritance?

7. If method is found in prototype during `user.describe()`, what is the receiver?

8. Why should per-object state usually not live in prototype?

9. What does `Object.getPrototypeOf()` return?

10. What question will Prototype Chain answer?

---

## Практика

Практические задания находятся в отдельном файле:

```text
practice/chapter-42.md
```

Выполняйте их после чтения главы и запуска examples.

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/chapter-42.md
```

Сначала выполните задания самостоятельно. Затем сравните не только answer, но и reasoning.
