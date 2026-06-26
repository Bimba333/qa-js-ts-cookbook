# Class Inheritance

## Связь с предыдущей главой

Предыдущая глава объяснила Classes.

Главная модель была такой:

```text
Need many similar objects
│
▼
Class
│
▼
Creates instances
│
▼
Instances have own data
│
▼
Methods are shared through prototype
```

Мы специально не представляли class как новую объектную модель.

Главная мысль была:

```text
Classes
│
└── use prototypes
```

Теперь появляется следующий вопрос:

> Что если несколько classes нуждаются в одинаковом behavior?

Например, в Automation QA есть разные page classes:

```text
LoginPage
ProfilePage
OrdersPage
SettingsPage
```

И каждая повторяет:

```text
open()
waitReady()
formatError()
```

Вопрос:

> Should every class copy identical methods?

Class Inheritance отвечает:

```text
Common behavior
│
▼
Base class
│
▼
Derived classes reuse it
```

Важно: inheritance does not replace prototypes. Inheritance builds on prototype lookup.

---

## Предварительные требования

Для этой главы нужно понимать:

* что class creates instances;
* что class methods are shared through prototype lookup;
* что Prototype Chain is lookup algorithm;
* что own property or closer method wins;
* что method location and receiver are different concepts;
* что ordinary `object.method()` call uses object before dot as receiver;
* что class mental models are pedagogical analogies, not formal definitions.

Не требуется знать `super`, constructor inheritance, private fields, static members, `instanceof`, mixins, composition vs inheritance or advanced prototype internals. Эти темы будут изучаться позже.

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

Class Inheritance легко превратить в разговор о большой архитектуре. В этой главе мы держим фокус уже: duplicated class methods and behavior reuse through prototype lookup.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/41-classes.md
```

Текущая глава:

```text
docs/01-javascript/42-class-inheritance.md
```

Следующая глава:

```text
docs/01-javascript/43-super.md
```

Следующая глава ответит:

> How can a derived class call behavior from its base class?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем inheritance существует;
* какую проблему решает duplicated class behavior;
* что такое base class;
* что такое derived class;
* зачем нужен `extends`;
* как derived class получает inherited methods;
* как работает method overriding на базовом уровне;
* как inheritance связано с Prototype Chain;
* почему inheritance не копирует methods;
* где inheritance полезен in Automation QA architecture.

---

## Мотивация

Начнем с проблемы.

Есть несколько page classes:

```javascript
class LoginPage {
  open() {
    return 'open page';
  }

  waitReady() {
    return 'wait until page is ready';
  }

  login() {
    return 'submit login form';
  }
}

class ProfilePage {
  open() {
    return 'open page';
  }

  waitReady() {
    return 'wait until page is ready';
  }

  updateProfile() {
    return 'update profile';
  }
}
```

Код работает.

Но behavior duplicated:

```text
LoginPage
│
├── open()
└── waitReady()

ProfilePage
│
├── open()
└── waitReady()
```

Если изменится общая логика `waitReady()`, нужно обновить каждую class.

```text
duplicated class behavior
│
├── harder to update
├── easier to make inconsistent
├── noisy page classes
└── fragile framework design
```

Нужен общий place for common behavior:

```text
BasePage
│
├── open()
└── waitReady()

LoginPage
│
└── login()

ProfilePage
│
└── updateProfile()
```

Inheritance lets derived classes reuse behavior from base class.

---

## Теория

Class Inheritance is behavior reuse between classes.

Главная модель:

```text
Common behavior
│
▼
Base class
│
▼
Derived class
│
▼
Instances can use inherited methods
```

Base class contains shared behavior:

```javascript
class BasePage {
  open() {
    return 'open page';
  }

  waitReady() {
    return 'wait until page is ready';
  }
}
```

Derived class reuses it:

```javascript
class LoginPage extends BasePage {
  login() {
    return 'submit login form';
  }
}
```

Now instance can use both:

```javascript
const loginPage = new LoginPage();

console.log(loginPage.open());
console.log(loginPage.login());
```

Conceptually:

```text
loginPage instance
│
├── can use LoginPage methods
└── can use BasePage methods
```

### `extends`

`extends` creates relationship between classes.

```text
Derived class
│
extends
│
Base class
```

It means:

```text
LoginPage
│
reuses behavior from
│
BasePage
```

Do not read `extends` as copying methods.

More accurate model:

```text
extends
│
▼
sets up class relationship
│
▼
prototype lookup can find base methods
```

### Inherited methods

Inherited method is method available to derived class instance through the class/prototype relationship.

```text
loginPage.open()
│
▼
not found on LoginPage method layer?
│
▼
look in BasePage method layer
│
▼
found
```

This is why the previous chapters matter.

Inheritance is not a new search model.

```text
Prototype lookup still works
```

### Overriding

Derived class can define method with same name as base class.

```javascript
class LoginPage extends BasePage {
  open() {
    return 'open login page';
  }
}
```

Now:

```text
loginPage.open()
│
▼
LoginPage method found first
│
▼
BasePage open() is not used for this call
```

This is overriding.

It follows the same priority idea:

```text
closer method wins
```

We do not explain `super` in this chapter. Calling base behavior from overridden method is the next chapter.

---

## Внутренний механизм

When JavaScript sees:

```javascript
class LoginPage extends BasePage {}
```

High-level model:

```text
LoginPage
│
extends
│
BasePage
```

This creates a relationship that allows method lookup to continue from derived class behavior to base class behavior.

```text
loginPage instance
│
▼
LoginPage methods
│
▼
BasePage methods
```

If code calls:

```javascript
loginPage.waitReady();
```

Engine mentally follows:

```text
Need method: waitReady
│
▼
Start from loginPage
│
▼
Check LoginPage method layer
│
└── not found
    │
    ▼
Check BasePage method layer
│
└── found
```

Then call happens with the same receiver rule:

```text
loginPage.waitReady()
│
├── method found in BasePage behavior
└── receiver is loginPage
```

So inside inherited method:

```javascript
waitReady() {
  return `${this.pageName} is ready`;
}
```

`this` refers to the actual receiver:

```text
this
│
▼
loginPage
```

Method location and receiver are still different concepts.

### Prototype reminder

The exact internal structure is more detailed than this chapter needs.

But the important high-level connection is:

```text
extends
│
does not copy methods
│
builds on prototype lookup
```

That is enough for this chapter.

---

## Ментальная модель

Inheritance can be understood as shared manual.

```text
Base class
│
└── common manual

Derived class
│
└── specialized manual
```

When behavior is missing in specialized manual, JavaScript can use common manual.

```text
Need instruction
│
▼
Derived class
│
├── found? use it
└── not found?
    │
    ▼
    Base class
```

Other useful analogies:

```text
family recipe
│
├── common base recipe
└── specialized variation
```

```text
company handbook
│
├── common rules for all employees
└── team-specific rules
```

```text
common base toolkit
│
├── open()
├── waitReady()
└── formatError()
```

```text
reusable training program
│
├── shared foundation
└── specialized skills
```

These are mental models, not formal definitions.

The technical idea remains:

```text
extends
│
▼
class relationship
│
▼
prototype lookup still works
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-45/
```

Запуск:

```bash
node examples/chapter-45/01-first-inheritance.js
```

### Пример 1. First inheritance

Файл:

```text
examples/chapter-45/01-first-inheritance.js
```

Показывает `BasePage` and `LoginPage extends BasePage`.

### Пример 2. Shared methods

Файл:

```text
examples/chapter-45/02-shared-methods.js
```

Показывает several derived classes using same base methods.

### Пример 3. Overriding

Файл:

```text
examples/chapter-45/03-overriding.js
```

Показывает method with same name in derived class.

### Пример 4. Common mistakes

Файл:

```text
examples/chapter-45/04-common-mistakes.js
```

Показывает that inheritance does not copy methods into instance.

### Пример 5. Page Object

Файл:

```text
examples/chapter-45/05-page-object.js
```

Показывает realistic BasePage/LoginPage/ProfilePage model.

### Пример 6. QA example

Файл:

```text
examples/chapter-45/06-qa-example.js
```

Показывает base API client behavior reused by service clients.

---

## Частые вопросы

### `extends` копирует методы?

Нет.

Better mental model:

```text
extends
│
sets relationship
│
prototype lookup finds methods
```

### Inheritance заменяет Prototype Chain?

Нет.

Inheritance builds on prototype lookup.

```text
Derived class instance
│
▼
Derived behavior
│
▼
Base behavior
```

### Нужно ли всегда использовать inheritance?

Нет.

Inheritance полезен when there is real shared behavior between classes. Если общего behavior мало, inheritance может усложнить код.

Composition vs inheritance будет отдельной темой позже.

### Почему `super` не объясняется здесь?

Потому что сначала нужно понять simple behavior reuse.

Следующая глава объяснит:

```text
derived method
│
calls
│
base method
```

### Можно ли override inherited method?

Да.

Derived class method with same name is found first.

```text
Derived method
│
└── wins over base method
```

---

## Распространенные мифы

### Миф: inheritance copies methods into derived class

Реальность: methods are reused through class/prototype relationship.

### Миф: base class should contain everything

Реальность: base class should contain common behavior only.

### Миф: overriding removes base method

Реальность: overriding changes which method lookup finds first for this derived class.

### Миф: inheritance is always better than duplication

Реальность: inheritance can reduce duplication, but unclear hierarchies hurt readability.

---

## Типичные ошибки

### Ошибка 1. Копировать methods after creating base class

Неправильная модель:

```text
BasePage.open()
│
copied into
│
LoginPage
```

Что происходит:

```text
LoginPage instance
│
uses lookup
│
finds BasePage.open()
```

Исправленная модель:

```text
reuse through lookup
│
not copy
```

### Ошибка 2. Put page-specific behavior into base class

Неправильный дизайн:

```text
BasePage
│
├── open()
├── waitReady()
└── login()
```

Почему плохо:

`login()` belongs to `LoginPage`, not every page.

Исправленная модель:

```text
BasePage
│
├── open()
└── waitReady()

LoginPage
│
└── login()
```

### Ошибка 3. Override accidentally

Неправильный код:

```javascript
class BasePage {
  open() {
    return 'base open';
  }
}

class LoginPage extends BasePage {
  open() {
    return 'login open';
  }
}
```

Что произошло:

`LoginPage.open()` shadows inherited `BasePage.open()`.

Если это было intentional, fine.

Если accidental, method name should be changed.

### Ошибка 4. Forget receiver

Неправильная модель:

```text
method found in BasePage
│
▼
this = BasePage
```

Правильная модель:

```text
loginPage.open()
│
├── method found through inheritance
└── receiver is loginPage
```

---

## Практическое использование

Inheritance useful when:

```text
several classes
│
share same behavior
```

Examples:

* base page actions;
* common API client behavior;
* shared validator formatting;
* framework reporting helpers;
* common test data builders.

Good inheritance:

```text
Base class
│
└── truly common behavior

Derived class
│
└── specific behavior
```

Bad inheritance:

```text
Base class
│
└── everything that seemed convenient
```

Readability question:

> Does the hierarchy explain the domain, or only hide duplicated code?

This chapter does not compare inheritance with composition in depth. That discussion belongs later.

---

## Использование в Automation QA

### BasePage

Common page behavior:

```text
BasePage
│
├── open()
├── waitReady()
└── formatError()
```

Specific pages:

```text
LoginPage extends BasePage
│
└── login()

ProfilePage extends BasePage
│
└── updateProfile()
```

This keeps common actions in one place.

### API base client

Common API behavior:

```text
BaseApiClient
│
├── buildUrl()
└── describeRequest()
```

Specific clients:

```text
UsersClient
│
└── userEndpoint()

OrdersClient
│
└── orderEndpoint()
```

### Reusable validators

Base validator:

```text
BaseValidator
│
├── formatExpected()
└── formatActual()
```

Specific validators:

```text
StatusValidator
RoleValidator
SchemaValidator
```

The goal is not to build deep hierarchies.

The goal is to keep shared framework behavior explicit and readable.

---

## Диаграммы главы

### 1. Why inheritance exists

```text
many classes
│
└── same methods repeated
    │
    ▼
    need shared behavior
```

### 2. Duplicated class methods

```text
LoginPage.open()
ProfilePage.open()
OrdersPage.open()
```

### 3. Base class

```text
BasePage
│
├── open()
└── waitReady()
```

### 4. Derived class

```text
LoginPage
│
└── login()
```

### 5. Shared behavior

```text
Base class
│
└── common methods
```

### 6. extends

```text
LoginPage
│
extends
│
BasePage
```

### 7. Method reuse

```text
loginPage.open()
│
▼
BasePage.open()
```

### 8. Overriding

```text
BasePage.open()
│
shadowed by
│
LoginPage.open()
```

### 9. Current JavaScript model

```text
Objects
│
├── Prototype
├── Prototype Chain
├── Classes
└── Class Inheritance
```

### 10. Prototype reminder

```text
extends
│
└── prototype lookup still works
```

### 11. QA Page Objects

```text
BasePage
│
├── LoginPage
└── ProfilePage
```

### 12. API client hierarchy

```text
BaseApiClient
│
├── UsersClient
└── OrdersClient
```

### 13. Readability

```text
common behavior
│
└── one clear base class
```

### 14. Common mistakes

```text
base class
│
└── too much responsibility
```

### 15. Method lookup

```text
instance
│
▼
derived methods
│
▼
base methods
```

### 16. Prototype behind extends

```text
extends
│
▼
class relationship
│
▼
prototype lookup
```

### 17. Object creation

```text
new LoginPage()
│
▼
instance
│
▼
can use inherited methods
```

### 18. Shared toolkit

```text
BasePage toolkit
│
├── open()
└── waitReady()
```

### 19. Family recipe

```text
base recipe
│
└── page-specific variation
```

### 20. Company handbook

```text
company handbook
│
└── team handbook
```

### 21. Base responsibility

```text
Base class
│
└── common behavior only
```

### 22. Derived responsibility

```text
Derived class
│
└── specific behavior
```

### 23. Override flow

```text
call method
│
▼
check derived
│
▼
found? stop
```

### 24. Mental model summary

```text
Common behavior
│
▼
Base class
│
▼
Derived classes reuse it
```

### 25. Complete inheritance model

```text
Base class
│
├── shared methods
│
└── Derived class
    └── specific methods
```

### 26. Object relationship

```text
instance
│
└── uses derived and base behavior
```

### 27. Class relationship

```text
Derived class
│
extends
│
Base class
```

### 28. Lookup reminder

```text
not found closer
│
▼
look farther
```

### 29. Receiver reminder

```text
loginPage.open()
│
└── this is loginPage
```

### 30. Bridge to super

```text
override method
│
▼
next: call base method
```

### 31. Bridge to composition

```text
inheritance
│
not always best design
│
composition later
```

### 32. Framework example

```text
BaseFrameworkObject
│
├── Reporter
└── ApiClient
```

### 33. Shared validator

```text
BaseValidator
│
├── StatusValidator
└── RoleValidator
```

### 34. Build hierarchy

```text
common
│
▼
specific
```

### 35. Object evolution

```text
object methods
│
▼
prototype
│
▼
class
│
▼
class inheritance
```

### 36. Behavior ownership

```text
common behavior -> base
specific behavior -> derived
```

### 37. Prototype connection

```text
extends
│
└── does not remove prototypes
```

### 38. Override lookup

```text
derived method exists
│
└── base method not reached
```

### 39. Shared methods

```text
one base method
│
├── used by LoginPage
└── used by ProfilePage
```

### 40. Summary diagram

```text
Shared behavior
│
▼
Base class
│
▼
extends
│
▼
Derived class
│
▼
Prototype lookup still works
```

---

## Итоги

Class Inheritance continues the Classes chapter.

Classes answered:

```text
How to create many similar objects conveniently?
```

Class Inheritance answers:

```text
What if several classes need the same behavior?
```

The core model:

```text
Shared behavior
│
▼
Base class
│
▼
extends
│
▼
Derived class
│
▼
Prototype lookup still works
```

Inheritance does not copy methods. It creates a relationship between classes, while the already-learned prototype mechanism continues to perform property lookup.

The next chapter will explain `super`: how a derived class can call behavior from its base class.

---

## Что нужно запомнить

✓ Inheritance reuses behavior between classes.

✓ Base class contains common behavior.

✓ Derived class contains specific behavior.

✓ `extends` creates relationship between classes.

✓ Inherited methods are found through lookup, not copied.

✓ Derived method can override base method.

✓ Closer method wins during lookup.

✓ Receiver remains the actual object used in method call.

✓ Inheritance builds on prototype lookup.

✓ `super` is the next chapter.

---

## Quick Check

1. What problem does class inheritance solve?

2. What behavior belongs in a base class?

3. What behavior belongs in a derived class?

4. Does `extends` copy methods?

5. How is inheritance related to Prototype Chain?

6. What is method overriding?

7. Which method wins if derived and base class define the same name?

8. What is the receiver during `loginPage.open()`?

9. Why can copying identical methods into every class be a bad idea?

10. What will the next chapter explain?

---

## Практика

Практические задания находятся в отдельном файле:

```text
practice/chapter-45.md
```

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/chapter-45.md
```

Сначала выполните практику самостоятельно. Затем сравните reasoning, not only final answer.
