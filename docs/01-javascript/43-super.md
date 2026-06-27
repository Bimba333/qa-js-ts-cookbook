# super

## Связь с предыдущей главой

Предыдущая глава объяснила Class Inheritance.

Главная модель была такой:

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

Мы увидели, что derived class can reuse base class behavior:

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }
}

class LoginPage extends BasePage {}

const loginPage = new LoginPage();

console.log(loginPage.open('LoginPage'));
```

Также мы увидели overriding:

```text
BasePage.open()
│
overridden by
│
LoginPage.open()
```

Теперь появляется следующий вопрос:

> Что если derived method переопределяет base method, но все еще хочет использовать base behavior?

Например:

```text
BasePage.open()
│
└── common opening procedure

LoginPage.open()
│
└── common opening procedure
    +
    login-page-specific step
```

Если просто override method, base method no longer runs for that call.

`super` отвечает на этот вопрос.

Главная модель главы:

```text
Derived method
│
▼
overrides base method
│
▼
super.method()
│
▼
calls base behavior
│
▼
derived method adds specific behavior
```

Важно: `super` does not copy base code. `super` calls base behavior through the class relationship.

---

## Предварительные требования

Для этой главы нужно понимать:

* что class methods are shared through prototype lookup;
* что inheritance reuses behavior between classes;
* что `extends` creates relationship between derived and base class;
* что overriding means closer method wins;
* что method location and receiver are different concepts;
* что `this` inside method refers to receiver during ordinary invocation.

Не требуется знать `super()` in constructors, constructor inheritance, private fields, static members, mixins, decorators, advanced prototype internals or `Reflect`. Constructor `super()` будет отдельной темой позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            130-170 минут
Разбор схем:             60-80 минут
Запуск примеров:         25-35 минут
Практика:                120-150 минут
Повторение материала:    30 минут
```

Уровень сложности: **L4**.

`super` часто кажется коротким синтаксисом. Но важно видеть механизм: derived method не хочет заменить base behavior полностью. Он хочет reuse base behavior and extend it.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/42-class-inheritance.md
```

Текущая глава:

```text
docs/01-javascript/43-super.md
```

Следующая глава:

```text
docs/01-javascript/44-arrays.md
```

Следующая глава начнет новый раздел:

> Как JavaScript работает с ordered collections значений?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `super`;
* почему override sometimes still needs base behavior;
* что делает `super.method()`;
* как derived method extends base method;
* как `super` связан с class relationship;
* как `super` связан с prototype lookup;
* почему `this` inside base method still refers to receiver;
* почему `super` не копирует base code;
* какие ошибки встречаются чаще всего;
* как `super` используется in Automation QA framework classes.

---

## Мотивация

Начнем с проблемы.

Есть base class:

```javascript
class BasePage {
  open(pageName) {
    return `open ${pageName}`;
  }
}
```

Есть derived class:

```javascript
class LoginPage extends BasePage {
  open(pageName) {
    return `open ${pageName} and focus login form`;
  }
}
```

Код работает.

Но common opening logic now duplicated conceptually:

```text
BasePage.open()
│
└── open page

LoginPage.open()
│
└── open page + login-specific step
```

Если base opening procedure changes, derived method must be updated manually.

Мы хотим другой flow:

```text
LoginPage.open()
│
├── use BasePage.open()
└── add login-specific behavior
```

Это не просто "доступ к родителю".

Это behavior reuse inside override.

```text
Override
│
▼
Использовать base behavior
│
▼
Add specific behavior
```

Для этого существует `super.method()`.

---

## Теория

`super.method()` calls base class method from derived class method.

Но не начинайте с синтаксиса.

Начинайте с вопроса:

> Какое base behavior используется повторно?

Example:

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
```

Now:

```text
LoginPage.open()
│
├── calls BasePage.open()
└── adds login-specific behavior
```

### Override without `super`

```text
Derived method
│
└── replaces base behavior for this lookup
```

### Override with `super`

```text
Derived method
│
├── calls base behavior
└── adds more behavior
```

### Base method call

`super.open(pageName)` means:

```text
from derived method
│
call base method with this receiver
```

It does not mean:

```text
copy BasePage.open()
```

It means:

```text
call BasePage behavior through class relationship
```

### Relationship with `this`

Важно:

```text
loginPage.open()
│
├── derived method runs
├── super.open(...) calls base method
└── inside base method, this is still loginPage
```

`super` chooses where method is taken from.

`this` still describes which object the method works with.

```text
super
│
└── where to find base method

this
│
└── receiver object
```

### Relationship with prototype lookup

`super` does not erase prototype-chain model.

High-level:

```text
Derived method
│
▼
super.method()
│
▼
base class behavior
│
▼
called with same receiver
```

The class relationship created by `extends` tells JavaScript where base behavior is.

We do not need advanced prototype internals in this chapter.

---

## Внутренний механизм

Consider:

```javascript
const loginPage = new LoginPage();

loginPage.open('LoginPage');
```

Шаг 1:

```text
Нужен method: open
│
▼
Start from loginPage
```

Шаг 2:

```text
Lookup finds LoginPage.open()
│
▼
derived method is selected
```

Шаг 3:

```text
Run LoginPage.open()
│
▼
receiver is loginPage
```

Шаг 4:

```text
Inside LoginPage.open()
│
▼
super.open('LoginPage')
```

Шаг 5:

```text
super.open()
│
▼
calls BasePage.open()
│
▼
with same receiver
```

Шаг 6:

```text
BasePage.open()
│
▼
returns common result
```

Шаг 7:

```text
LoginPage.open()
│
▼
adds specific behavior
│
▼
returns final result
```

Complete flow:

```text
loginPage.open()
│
▼
LoginPage.open()
│
▼
super.open()
│
▼
BasePage.open()
│
▼
back to LoginPage.open()
│
▼
final result
```

### Что происходит с `this`?

If base method uses `this`:

```javascript
class BasePage {
  label(pageName) {
    return `${this.prefix}: ${pageName}`;
  }
}
```

And derived instance has `prefix`:

```javascript
const loginPage = new LoginPage();
loginPage.prefix = 'page';
```

Then `super.label('LoginPage')` still uses `this` as `loginPage`.

```text
super.label()
│
calls BasePage.label
│
but
│
this -> loginPage
```

This is why `super` and `this` must not be confused.

---

## Ментальная модель

`super` is like calling the base manual from specialized procedure.

```text
Specialized procedure
│
├── call base manual
└── add special step
```

Сначала использовать стандартную процедуру:

```text
Derived method
│
├── use standard base procedure
└── extend it
```

Extend common recipe:

```text
common recipe
│
▼
special recipe adds ingredient
```

Ask parent implementation:

```text
derived method
│
asks base method
│
then continues
```

Foundation and specialization:

```text
foundation
│
▼
specialization
```

Central idea:

```text
Override
│
▼
Использовать base behavior
│
▼
Add specific behavior
```

These are mental models, not formal definitions.

The technical idea for this chapter:

```text
super.method()
│
calls base method
│
through class relationship
```

---

## Примеры кода

Примеры находятся в:

```text
examples/01-javascript/chapter-43/
```

Запуск:

```bash
node examples/01-javascript/chapter-43/01-basic-super.js
```

### Пример 1. Basic super

Файл:

```text
examples/01-javascript/chapter-43/01-basic-super.js
```

Показывает `super.open()` inside derived `open()`.

### Пример 2. Extend method

Файл:

```text
examples/01-javascript/chapter-43/02-extend-method.js
```

Показывает base result plus derived-specific text.

### Пример 3. this with super

Файл:

```text
examples/01-javascript/chapter-43/03-this-with-super.js
```

Показывает that base method called through `super` still works with receiver object.

### Пример 4. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-43/04-common-mistakes.js
```

Показывает override without `super`: base behavior is not reused.

### Пример 5. Page Object

Файл:

```text
examples/01-javascript/chapter-43/05-page-object.js
```

Показывает `BasePage.open()` and `LoginPage.open()` extending it.

### Пример 6. QA example

Файл:

```text
examples/01-javascript/chapter-43/06-qa-example.js
```

Показывает base API client request description extended by service client.

---

## Частые вопросы

### `super` копирует код base method?

Нет.

`super.method()` calls base behavior. It does not copy method body into derived class.

```text
super.method()
│
└── call base behavior
```

### `super` и `this` - одно и то же?

Нет.

```text
super
│
└── where to find base method

this
│
└── receiver object
```

### Почему нельзя просто скопировать base method code?

Copy creates duplication.

If base behavior changes, copied code must be updated manually.

```text
copy
│
└── duplicated maintenance

super
│
└── reuse base behavior
```

### Это то же самое, что `super()` in constructor?

Нет.

This chapter explains `super.method()` inside methods.

Constructor `super()` will be studied later when constructor inheritance becomes necessary.

### Можно ли использовать `super` without overriding?

`super.method()` is useful inside derived behavior when you need base behavior as part of derived behavior. The core case in this chapter is override plus extension.

---

## Распространенные мифы

### Миф: `super` means parent object

Реальность: in this chapter `super.method()` is a way to call base class behavior through class relationship.

### Миф: `super` changes `this`

Реальность: base method called through `super` still works with the current receiver.

### Миф: `super` copies base method

Реальность: it calls base behavior.

### Миф: every override should call `super`

Реальность: иногда override намеренно заменяет behavior. Используйте `super`, когда base behavior нужно переиспользовать.

---

## Типичные ошибки

### Ошибка 1. Override and forget base behavior

Неправильный код:

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

Что произошло:

`LoginPage.open()` replaced base behavior.

Исправленный вариант:

```javascript
open(pageName) {
  const baseResult = super.open(pageName);
  return `${baseResult} and focus form`;
}
```

### Ошибка 2. Think `super` changes receiver

Неправильная модель:

```text
super.open()
│
▼
this = BasePage
```

Правильная модель:

```text
loginPage.open()
│
└── super.open()
    │
    └── this is still loginPage
```

### Ошибка 3. Использовать `super`, когда нужна замена behavior

Sometimes derived method should fully replace base behavior.

If so:

```text
override without super
│
can be intentional
```

The decision is semantic:

```text
reuse base behavior?
│
├── yes -> super.method()
└── no  -> no super
```

### Ошибка 4. Try to use `super()` here

This chapter is not about constructor `super()`.

Wrong direction for this chapter:

```text
constructor super()
│
└── future topic
```

Current topic:

```text
super.method()
│
└── call base behavior inside method
```

---

## Практическое использование

Используйте `super.method()`, когда:

```text
derived method
│
needs base behavior
│
plus
│
specific behavior
```

Good examples:

* base page open + page-specific preparation;
* base request description + service-specific label;
* base validation formatting + specialized validation message;
* base framework logging + feature-specific context.

Avoid `super` when:

```text
derived behavior
│
should fully replace base behavior
```

Правило читаемости:

```text
super.method()
│
should make behavior easier to follow
│
not hide important work
```

---

## Использование в Automation QA

### BasePage.open()

Base page:

```text
BasePage.open()
│
└── common open behavior
```

Login page:

```text
LoginPage.open()
│
├── super.open()
└── focus login form
```

### API client

Base API client:

```text
BaseApiClient.describeRequest()
│
└── common request description
```

Users client:

```text
UsersClient.describeRequest()
│
├── super.describeRequest()
└── add users service context
```

### Validators

Base validator:

```text
BaseValidator.formatFailure()
│
└── common expected/actual formatting
```

Status validator:

```text
StatusValidator.formatFailure()
│
├── super.formatFailure()
└── add status-specific explanation
```

---

## Диаграммы главы

### 1. Зачем существует super

```text
override
│
but still need base behavior
│
▼
super
```

### 2. Base method

```text
BasePage
│
└── open()
```

### 3. Derived override

```text
LoginPage
│
└── open()
```

### 4. Reuse base behavior

```text
LoginPage.open()
│
└── calls BasePage.open()
```

### 5. Extend behavior

```text
base behavior
│
+
│
specific behavior
```

### 6. `super.method()`

```text
super.open()
│
└── call base open()
```

### 7. Base call flow

```text
derived method
│
▼
super.method()
│
▼
base method
```

### 8. Derived method flow

```text
start derived
│
call base
│
add specific
│
return result
```

### 9. Текущая модель JavaScript

```text
Classes
│
├── Inheritance
└── super
```

### 10. Prototype lookup reminder

```text
derived behavior
│
▼
base behavior
```

### 11. Receiver reminder

```text
loginPage.open()
│
└── receiver is loginPage
```

### 12. `this` inside base method

```text
super.open()
│
calls base method
│
but this -> loginPage
```

### 13. QA BasePage example

```text
BasePage.open()
│
└── common navigation
```

### 14. LoginPage example

```text
LoginPage.open()
│
├── super.open()
└── focus login form
```

### 15. API client example

```text
UsersClient.describeRequest()
│
├── super.describeRequest()
└── add service name
```

### 16. Читаемость

```text
common behavior stays common
│
specific behavior stays specific
```

### 17. Типичные ошибки

```text
override
│
└── forget super
```

### 18. Override without super

```text
derived method
│
└── replaces base behavior
```

### 19. Override with super

```text
derived method
│
├── base behavior
└── specific behavior
```

### 20. Method composition

```text
base result
│
▼
derived result
```

### 21. Краткая ментальная модель

```text
Использовать base behavior
│
then add specialization
```

### 22. Complete super model

```text
Derived method
│
▼
super.method()
│
▼
Base method
│
▼
Derived method continues
```

### 23. Base manual analogy

```text
special manual
│
calls
│
base manual
```

### 24. Recipe analogy

```text
common recipe
│
▼
special recipe extension
```

### 25. Procedure analogy

```text
standard procedure
│
then
│
special step
```

### 26. Object relationship

```text
loginPage
│
uses derived and base behavior
```

### 27. Class relationship

```text
LoginPage
│
extends
│
BasePage
```

### 28. Lookup relationship

```text
derived method
│
can refer to
│
base method
```

### 29. Receiver relationship

```text
method source: base
receiver: derived instance
```

### 30. Переход к constructor super

```text
super.method()
│
now
│
super() in constructors later
```

### 31. Переход к advanced inheritance

```text
basic super
│
before
│
advanced inheritance details
```

### 32. Framework example

```text
BaseFrameworkObject.log()
│
▼
FeatureObject.log()
```

### 33. Validation helper

```text
BaseValidator.formatFailure()
│
▼
StatusValidator.formatFailure()
```

### 34. Derived extension

```text
base
│
plus
│
derived addition
```

### 35. Behavior ownership

```text
common part -> base
specific part -> derived
```

### 36. Итоговая схема

```text
Derived method
│
▼
overrides base method
│
▼
super.method()
│
▼
calls base behavior
│
▼
adds specific behavior
```

---

## Итоги

`super` appears after Class Inheritance naturally.

Inheritance showed:

```text
Derived class
│
reuses
│
Base class behavior
```

Overriding showed:

```text
Derived method
│
can replace
│
Base method
```

`super` answers:

```text
Как derived method может переопределить base method
but still reuse base behavior?
```

The core model:

```text
Derived method
│
▼
super.method()
│
▼
base behavior
│
▼
derived method adds specialization
```

`super` does not copy base code. It calls base behavior through the class relationship, while the receiver model and prototype-chain mental model still matter.

The next chapter starts the Arrays section.

---

## Что нужно запомнить

✓ `super.method()` calls base class behavior from derived method.

✓ `super` is most useful when override should extend base behavior.

✓ `super` does not copy base code.

✓ `super` and `this` are different concepts.

✓ Base method called through `super` still uses current receiver.

✓ Override without `super` replaces base behavior for that method call.

✓ Override with `super` reuses and extends base behavior.

✓ Constructor `super()` is a future topic.

✓ Prototype-chain mental model still matters.

✓ Next section begins Arrays.

---

## Проверьте себя

1. Какую проблему решает `super`?

2. В чем разница между override с `super` и без `super`?

3. Does `super.method()` copy base method code?

4. Какое base behavior переиспользуется в `LoginPage.open()`?

5. На что указывает `this` внутри base method, вызванного через `super`?

6. Почему использовать `super`, а не копировать код base method?

7. When should an override avoid `super`?

8. Почему constructor `super()` здесь не рассматривается?

9. Чем `super` полезен в Page Objects?

10. Какой раздел идет дальше?

---

## Практика

Практические задания находятся в отдельном файле:

```text
practice/01-javascript/43-super.md
```

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/01-javascript/43-super.md
```

Сначала выполните практику самостоятельно. Затем сравните объяснение, а не только финальный ответ.
