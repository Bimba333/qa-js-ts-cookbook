# Prototype Chain

## Связь с предыдущей главой

Предыдущая глава объяснила Prototype.

Главная модель была такой:

```text
Need property
│
▼
Current object
│
├── found?
│   └── use it
│
└── not found?
    │
    ▼
    Look in Prototype
```

Prototype был представлен как обычный object, который может быть shared source of properties. На практике мы чаще всего использовали его для shared behavior:

```text
object
│
├── own data
└── prototype
    └── shared methods
```

Теперь появляется следующий вопрос:

> Что происходит, если property не найдена и в prototype?

Например:

```text
object
│
└── property not found
    │
    ▼
prototype
│
└── property still not found
```

JavaScript не останавливается на слове "prototype" как на магической стене. Если у prototype тоже есть свой prototype, lookup может продолжиться.

Эта повторяющаяся последовательность называется Prototype Chain.

Главная модель главы:

```text
Need property
│
▼
Current object
│
▼
Not found
│
▼
Next prototype
│
▼
Repeat
│
▼
Found or undefined
```

Важно: Prototype Chain в этой главе - это lookup algorithm, not inheritance hierarchy.

---

## Предварительные требования

Для этой главы нужно понимать:

* что object has own properties;
* что prototype is ordinary object;
* что prototype can contain any properties;
* что на практике prototype часто содержит shared behavior;
* что property lookup сначала проверяет own properties;
* что inherited property is found through prototype lookup;
* что method location and receiver are different concepts;
* что ordinary `object.method()` invocation uses object before dot as receiver.

Не требуется знать `constructor.prototype`, classes, `new`, `instanceof`, `Reflect`, `Proxy`, `Symbol.hasInstance` или advanced inheritance. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            150-190 минут
Разбор схем:             70-95 минут
Запуск примеров:         25-35 минут
Практика:                130-160 минут
Повторение материала:    35 минут
```

Уровень сложности: **L4**.

Сложность Prototype Chain не в синтаксисе. Сложность в том, чтобы перестать думать "JavaScript где-то наследует" и начать видеть конкретный search algorithm.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/39-prototype.md
```

Текущая глава:

```text
docs/01-javascript/40-prototype-chain.md
```

Следующая глава:

```text
docs/01-javascript/41-classes.md
```

Следующая глава ответит:

> Как JavaScript может создавать много objects с одинаковым prototype удобнее?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует Prototype Chain;
* как lookup продолжается через несколько prototype levels;
* почему own property has priority;
* что такое shadowing;
* что такое property overriding на уровне lookup;
* где в цепочке находится `Object.prototype`;
* когда lookup ends;
* почему missing property дает `undefined`;
* почему Prototype Chain is lookup algorithm, not inheritance hierarchy;
* как эта модель помогает читать Page Objects, API clients and framework utilities.

---

## Мотивация

Начнем с уже знакомой модели.

Есть object:

```javascript
const loginPage = {
  name: 'LoginPage'
};
```

Есть shared page behavior:

```javascript
const pageBehavior = {
  describePage() {
    return this.name;
  }
};
```

Связь:

```text
loginPage
│
└── prototype ──► pageBehavior
```

Если JavaScript ищет `describePage`, все понятно:

```text
loginPage.describePage
│
├── loginPage: not found
└── pageBehavior: found
```

Но что если нужен method, которого нет и в `pageBehavior`?

```text
loginPage.formatError
│
├── loginPage: not found
└── pageBehavior: not found
```

Вопрос:

> Где следующий lookup step?

Если `pageBehavior` itself has prototype, JavaScript может продолжить поиск там:

```text
loginPage
│
▼
pageBehavior
│
▼
frameworkBehavior
```

Это уже chain.

Не hierarchy for design.

А последовательность lookup steps.

---

## Теория

Prototype Chain - это последовательность objects, по которой JavaScript ищет property.

Не начинаем с `Object.prototype`.

Не начинаем с `null`.

Начинаем с действия:

```text
Read property
│
▼
Where is the next lookup step?
```

Если property не найдена на current object, engine переходит к prototype.

Если property не найдена на prototype, engine переходит к prototype of that prototype.

```text
object
│
▼
prototype
│
▼
prototype of prototype
│
▼
...
```

Так появляется chain.

### Lookup algorithm

Упрощенная модель:

```text
Need property
│
▼
Check current object
│
├── found
│   └── return value
│
└── not found
    │
    ▼
    Move to next prototype
    │
    ▼
    Repeat
```

Если JavaScript дошел до конца chain and property was not found:

```text
not found anywhere
│
▼
undefined
```

### `Object.prototype`

Most ordinary objects eventually lead to `Object.prototype`.

```text
ordinary object
│
▼
some prototype
│
▼
Object.prototype
```

`Object.prototype` contains common properties available to many ordinary objects.

В этой главе не нужно запоминать его полный набор properties. Важно понять место:

```text
Object.prototype
│
└── near the end of ordinary object lookup
```

Если property не найдена и там, lookup ends.

### End of chain

У цепочки есть конец.

Концептуально:

```text
object
│
▼
prototype
│
▼
Object.prototype
│
▼
end
```

Когда next prototype больше нет, JavaScript stops searching.

Именно поэтому missing property becomes `undefined`.

```text
Search ended
│
└── no property found
    │
    ▼
    undefined
```

### Own property priority

Если property найдена на current object, JavaScript не идет дальше.

```text
object.status
│
├── object has own status
└── stop lookup
```

Prototype value с тем же name не используется.

```text
object
│
└── status: "own"

prototype
│
└── status: "shared"

result: "own"
```

### Shadowing

Shadowing happens when a property on a closer object hides property with same name later in chain.

```text
current object
│
└── name: "local"

prototype
│
└── name: "shared"
```

Lookup result:

```text
name -> "local"
```

Prototype property still exists.

It is just not reached for this lookup.

### Property overriding

Property overriding is practical effect of shadowing:

```text
shared method in prototype
│
but
│
own method with same name exists
│
▼
own method wins
```

Например, shared `describe()` можно override directly on one object:

```text
generic describe()
│
└── in prototype

special describe()
│
└── own property
```

Lookup chooses special one.

---

## Внутренний механизм

Рассмотрим chain from QA example:

```text
loginPage
│
▼
pageBehavior
│
▼
frameworkBehavior
│
▼
Object.prototype
│
▼
end
```

Engine receives:

```text
property name: "formatError"
start object: loginPage
```

Step by step:

```text
Step 1
│
▼
Check loginPage own properties
│
└── formatError not found
```

```text
Step 2
│
▼
Move to pageBehavior
│
└── formatError not found
```

```text
Step 3
│
▼
Move to frameworkBehavior
│
└── formatError found
```

Lookup stops immediately:

```text
found
│
▼
return property value
```

If returned value is a function and call form is:

```javascript
loginPage.formatError();
```

receiver reminder:

```text
method found in frameworkBehavior
│
but ordinary call is loginPage.formatError()
│
therefore receiver is loginPage
```

The method location does not automatically become receiver.

```text
Location: frameworkBehavior
Receiver: loginPage
```

This connects Prototype Chain with the previous chapters about `this`.

### Why does JavaScript stop searching?

JavaScript stops for two reasons:

```text
Reason 1
│
└── property found
```

or:

```text
Reason 2
│
└── chain ended
```

It does not keep searching after a found property because lookup has a clear priority rule:

```text
closer property wins
```

It does not search forever because every chain has an end.

```text
end reached
│
└── return undefined for simple property read
```

---

## Ментальная модель

Prototype Chain можно представить как chain of libraries.

Вы ищете instruction:

```text
Need instruction
│
▼
Local shelf
│
├── found? use it
└── not found? go to next library
```

Если в первой библиотеке нет нужной книги, вы идете в следующую:

```text
local library
│
▼
city library
│
▼
central archive
```

Если нашли, поиск заканчивается.

Если не нашли нигде, результата нет.

Другие mental models:

```text
chain of managers
│
├── ask direct manager
├── ask senior manager
└── ask department head
```

```text
asking one colleague after another
│
├── colleague A
├── colleague B
└── colleague C
```

```text
linked instruction manuals
│
├── object manual
├── shared manual
└── base manual
```

Главная мысль:

```text
Prototype Chain
│
└── repeated lookup path
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-43/
```

Запуск:

```bash
node examples/chapter-43/01-basic-chain.js
```

### Пример 1. Basic chain

Файл:

```text
examples/chapter-43/01-basic-chain.js
```

Показывает:

```text
object
│
▼
first prototype
│
▼
second prototype
```

### Пример 2. Property lookup

Файл:

```text
examples/chapter-43/02-property-lookup.js
```

Показывает lookup order from own property to shared framework behavior.

### Пример 3. Shadowing

Файл:

```text
examples/chapter-43/03-shadowing.js
```

Показывает:

```text
own property
│
└── wins over inherited property
```

### Пример 4. Типичные ошибки

Файл:

```text
examples/chapter-43/04-common-mistakes.js
```

Показывает ошибку ожидания, что far prototype wins over closer property.

### Пример 5. Framework preview

Файл:

```text
examples/chapter-43/05-framework-preview.js
```

Показывает layered framework behavior.

### Пример 6. QA example

Файл:

```text
examples/chapter-43/06-qa-example.js
```

Показывает API client lookup through client-specific, service-level and framework-level behavior.

---

## Частые вопросы

### Prototype Chain - это inheritance hierarchy?

Нет.

В этой главе Prototype Chain is lookup algorithm.

```text
Need property
│
▼
Where to search next?
```

Inheritance as architecture will appear later. Здесь важно понять search path.

### Почему JavaScript не ищет property во всех objects проекта?

Потому что lookup follows only one connected chain.

```text
object
│
▼
its prototype
│
▼
next prototype
```

Unrelated objects are not searched.

### Почему own property wins?

Because lookup starts from current object.

```text
closer object
│
└── higher priority
```

Это делает local override predictable.

### Почему missing property gives `undefined`?

Because lookup ended without finding property.

```text
searched whole chain
│
└── not found
    │
    ▼
    undefined
```

### Что такое `Object.prototype`?

`Object.prototype` is common prototype near the end of many ordinary object chains.

В этой главе достаточно понимать его position in lookup. Detailed built-in behavior будет встречаться позже по мере необходимости.

---

## Распространенные мифы

### Миф: Prototype Chain копирует properties вниз

Реальность: lookup reads through the chain. It does not copy properties into object.

```text
lookup
│
≠
copy
```

### Миф: самый дальний prototype важнее

Реальность: closer property wins.

```text
object
│
└── first priority

prototype
│
└── second priority
```

### Миф: Prototype Chain нужен только для classes

Реальность: Prototype Chain exists for ordinary property lookup. Classes will use related mechanisms later, but the algorithm already exists now.

### Миф: missing property always throws

Реальность: simple property read returns `undefined` when lookup ends without result.

---

## Типичные ошибки

### Ошибка 1. Ожидать, что prototype overrides own property

Неправильная модель:

```text
prototype.status
│
└── wins over object.status
```

Что происходит:

```text
object.status found first
│
└── lookup stops
```

Исправленная модель:

```text
own property priority
│
└── closer property wins
```

### Ошибка 2. Думать, что method receiver is where method was found

Неправильная модель:

```text
method found in frameworkBehavior
│
▼
this = frameworkBehavior
```

Что происходит при ordinary call:

```text
loginPage.formatError()
│
├── method found through chain
└── receiver is loginPage
```

Исправленная модель:

```text
lookup location
│
≠
receiver
```

### Ошибка 3. Делать слишком глубокие chains

Неправильный дизайн:

```text
object
│
▼
level 1
│
▼
level 2
│
▼
level 3
│
▼
level 4
```

Что произошло:

* сложно понять, где property found;
* сложно debug;
* сложно explain behavior to team.

Исправленный подход:

```text
prefer shallow, readable object relationships
```

### Ошибка 4. Считать missing property ошибкой всегда

Неправильное ожидание:

```text
object.missing
│
└── throw error
```

Реальность:

```text
object.missing
│
└── undefined
```

Ошибка появится later if code tries to use `undefined` incorrectly.

---

## Практическое использование

Prototype Chain помогает читать код, где behavior organized in layers.

```text
specific object
│
├── specific state
└── lookup to shared behavior
```

Например:

```text
loginPage
│
▼
pageBehavior
│
▼
frameworkBehavior
```

Такая модель может быть полезной, если нужно:

* separate object-specific data from shared actions;
* provide default behavior;
* override behavior locally;
* understand where method was found;
* debug unexpected property values.

Но deep chain is not automatically good architecture.

Readable code matters:

```text
short clear chain
│
└── easier to debug

deep unclear chain
│
└── harder to maintain
```

---

## Использование в Automation QA

### Layered Page Objects

Page Objects may have layers:

```text
loginPage
│
├── own: page name, selectors
│
▼
pageBehavior
│
├── open()
└── assertLoaded()
│
▼
frameworkBehavior
│
└── formatError()
```

Lookup explains why `loginPage.formatError()` can work even if `formatError` is not own property.

### API client hierarchy

API clients often combine:

```text
client-specific config
│
service-level behavior
│
framework-level helpers
```

Example model:

```text
usersClient
│
├── own baseUrl
├── own serviceName
│
▼
serviceBehavior
│
└── buildEndpoint()
│
▼
frameworkBehavior
│
└── describeRequest()
```

### Assertion infrastructure

Assertion helpers may share:

```text
specific validator
│
▼
validator behavior
│
▼
reporting behavior
```

This can help reuse formatting and error reporting.

### Debugging unexpected methods

If method exists but not directly in object:

```text
method is callable
│
but
│
not visible as own property
```

Prototype Chain gives the mental route:

```text
start from object
│
▼
walk prototypes
│
▼
find method location
```

---

## Диаграммы главы

### 1. Why Prototype Chain exists

```text
Object
│
└── not found
    │
    ▼
Prototype
│
└── not found
    │
    ▼
Need next lookup step
```

### 2. Lookup continuation

```text
not found here
│
▼
try next prototype
```

### 3. Multiple prototype levels

```text
object
│
▼
prototype A
│
▼
prototype B
```

### 4. Property search

```text
property name
│
▼
search current object
│
▼
search next prototype
```

### 5. Lookup timeline

```text
t1 object
t2 prototype A
t3 prototype B
t4 result
```

### 6. Current object

```text
current object
│
└── first lookup step
```

### 7. First prototype

```text
current object
│
▼
first prototype
```

### 8. Second prototype

```text
first prototype
│
▼
second prototype
```

### 9. Object.prototype

```text
ordinary object
│
▼
Object.prototype
```

### 10. End of chain

```text
Object.prototype
│
▼
end
```

### 11. Property found

```text
search
│
▼
found
│
▼
stop
```

### 12. Property missing

```text
search all chain
│
▼
not found
│
▼
undefined
```

### 13. Shadowing

```text
object.name: "local"
│
shadows
│
prototype.name: "shared"
```

### 14. Own property priority

```text
own property
│
└── wins first
```

### 15. Shared behavior

```text
object
│
▼
prototype
│
└── shared method
```

### 16. QA framework example

```text
test helper
│
▼
validator behavior
│
▼
reporting behavior
```

### 17. API client example

```text
usersClient
│
▼
serviceBehavior
│
▼
frameworkBehavior
```

### 18. Page Object example

```text
loginPage
│
▼
pageBehavior
│
▼
frameworkBehavior
```

### 19. Читаемость

```text
short chain
│
└── readable

deep chain
│
└── harder to debug
```

### 20. Типичные ошибки

```text
far property
│
does not beat
│
near property
```

### 21. Escalation analogy

```text
ask first person
│
▼
ask next person
│
▼
ask final person
```

### 22. Library analogy

```text
local library
│
▼
city library
│
▼
central archive
```

### 23. Manager analogy

```text
team lead
│
▼
manager
│
▼
director
```

### 24. Complete lookup model

```text
Need property
│
▼
Current object
│
├── found -> use it
└── not found -> next prototype
```

### 25. Object relationship

```text
object
│
└── prototype link
    │
    ▼
    next object
```

### 26. Search flow

```text
start
│
▼
check
│
▼
move
│
▼
check
```

### 27. Undefined result

```text
end reached
│
└── no property
    │
    ▼
    undefined
```

### 28. Property ownership

```text
own
│
└── stored here

inherited
│
└── found later
```

### 29. Receiver reminder

```text
object.method()
│
├── method found anywhere in chain
└── receiver is object
```

### 30. Method lookup

```text
method name
│
▼
lookup chain
│
▼
function object
```

### 31. Краткая ментальная модель

```text
Prototype Chain
│
└── escalation path for property search
```

### 32. Complete chain

```text
object
│
▼
prototype A
│
▼
prototype B
│
▼
Object.prototype
│
▼
end
```

### 33. Object evolution

```text
own methods
│
▼
prototype
│
▼
prototype chain
```

### 34. Переход к Classes

```text
Prototype Chain
│
▼
Classes later create objects with shared prototypes more conveniently
```

### 35. Переход к new

```text
object creation question
│
▼
how to set prototype conveniently?
```

### 36. Internal lookup

```text
engine
│
├── property name
├── current object
└── next prototype pointer
```

### 37. Property override

```text
own describe()
│
└── overrides inherited describe()
```

### 38. Итоговая схема

```text
Need property
│
▼
Current object
│
├── Found? use it
└── Not found
    │
    ▼
    Next prototype
    │
    ▼
    Repeat until found or undefined
```

## Итоги

Prototype Chain продолжает модель Prototype.

Prototype отвечал:

```text
Missing property?
│
▼
Look in Prototype
```

Prototype Chain отвечает:

```text
Prototype also missing?
│
▼
Continue to next prototype
```

Это не скрытая магия и не обязательная class hierarchy.

Это lookup algorithm:

```text
Need property
│
▼
Current object
│
├── Found? use it
└── Not found
    │
    ▼
    Next prototype
    │
    ▼
    Repeat
```

Own properties have priority. Closer properties shadow farther properties. If lookup reaches the end of chain without result, simple property read returns `undefined`.

Следующая глава покажет, как classes make object creation with shared prototypes more convenient.

---

## Что нужно запомнить

✓ Prototype Chain is repeated property lookup through prototypes.

✓ JavaScript checks current object before prototypes.

✓ Own property wins over inherited property.

✓ Shadowing means closer property hides farther property with same name.

✓ Lookup stops when property is found.

✓ Lookup also stops when chain ends.

✓ Missing property after full lookup gives `undefined`.

✓ `Object.prototype` is near the end of many ordinary object chains.

✓ Method location and receiver are different concepts.

✓ Prototype Chain is lookup algorithm, not inheritance hierarchy.

---

## Проверьте себя

1. What problem does Prototype Chain solve?

2. Where does lookup start?

3. What happens if property is found on current object?

4. What happens if property is not found on current object?

5. Why does JavaScript stop searching?

6. What is shadowing?

7. Why does own property win over inherited property?

8. What is the role of `Object.prototype` in this chapter?

9. What result appears when property is not found anywhere?

10. Why is Prototype Chain not primarily an inheritance hierarchy?

---

## Практика

Практические задания находятся в отдельном файле:

```text
practice/chapter-43.md
```

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/chapter-43.md
```

Сначала выполните практику самостоятельно. Затем сравните reasoning, not only final answer.
