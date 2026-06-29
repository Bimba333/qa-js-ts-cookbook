# super

## Связь с предыдущей главой

Предыдущая глава объяснила Class Inheritance.

Главная модель была такой:

Мы увидели, что derived class can reuse base class поведение:

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

Теперь появляется следующий вопрос:

> Что если derived method переопределяет base method, но все еще хочет использовать base поведение?

Например:

Если просто override method, base method no longer runs for that call.

`super` отвечает на этот вопрос.

Главная модель главы:

Важно: `super` does not copy base code. `super` calls base поведение through the class relationship.

---

## Предварительные требования

Для этой главы нужно понимать:

* что class methods are shared through prototype lookup;
* что inheritance reuses поведение between classes;
* что `extends` creates relationship between derived and base class;
* что overriding means closer method wins;
* что method location and объект выполнения are different concepts;
* что `this` inside method refers to объект выполнения during ordinary invocation.

Не требуется знать `super()` in constructors, constructor inheritance, private поля, static members, mixins, decorators, advanced prototype internals or `Reflect`. Constructor `super()` будет отдельной темой позже.

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

`super` часто кажется коротким синтаксисом. Но важно видеть механизм: derived method не хочет заменить base поведение полностью. Он хочет reuse base поведение and extend it.

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
* почему override sometimes still needs base поведение;
* что делает `super.method()`;
* как derived method extends base method;
* как `super` связан с class relationship;
* как `super` связан с prototype lookup;
* почему `this` inside base method still refers to объект выполнения;
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

Если base opening procedure changes, derived method must be updated manually.

Мы хотим другой поток:

Это не просто "доступ к родителю".

Это поведение reuse inside override.

Для этого существует `super.method()`.

---

## Теория

`super.method()` calls base class method from derived class method.

Но не начинайте с синтаксиса.

Начинайте с вопроса:

> Какое base поведение используется повторно?

Пример:

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

Теперь:

### Override without `super`

### Override with `super`

### Base method call

`super.open(pageName)` means:

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

`super` chooses where method is taken from.

`this` still describes which object the method works with.

### Relationship with prototype lookup

`super` does not erase prototype-chain model.

High-level:

The class relationship created by `extends` tells JavaScript where base поведение is.

We do not need advanced prototype internals in this chapter.

---

## Внутренний механизм

Consider:

```javascript
const loginPage = new LoginPage();

loginPage.open('LoginPage');
```

Шаг 1:

Шаг 2:

Шаг 3:

Шаг 4:

Шаг 5:

Шаг 6:

Шаг 7:

Complete поток:

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

This is why `super` and `this` must not be confused.

---

## Ментальная модель

`super` is like calling the base manual from specialized procedure.

Сначала использовать стандартную процедуру:

Extend common recipe:

Ask parent implementation:

Foundation and specialization:

Central idea:

Это ментальные модели, а не формальные определения.

The technical idea for this chapter:

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

Показывает that base method called through `super` still works with объект выполнения object.

### Пример 4. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-43/04-common-mistakes.js
```

Показывает override without `super`: base поведение is not reused.

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

`super.method()` calls base поведение. It does not copy method body into derived class.

### `super` и `this` - одно и то же?

Нет.

### Почему нельзя просто скопировать base method code?

Copy creates duplication.

If base поведение changes, copied code must be updated manually.

### Это то же самое, что `super()` in constructor?

Нет.

Эта глава объясняет `super.method()` внутри methods.

Constructor `super()` will be studied later when constructor inheritance becomes necessary.

### Можно ли использовать `super` without overriding?

`super.method()` is useful inside derived поведение when you need base поведение as part of derived поведение. The core case in this chapter is override plus extension.

---

## Распространенные мифы

### Миф: `super` means parent object

Реальность: in this chapter `super.method()` is a way to call base class поведение through class relationship.

### Миф: `super` changes `this`

Реальность: base method called through `super` still works with the current объект выполнения.

### Миф: `super` copies base method

Реальность: it calls base поведение.

### Миф: every override should call `super`

Реальность: иногда override намеренно заменяет поведение. Используйте `super`, когда base поведение нужно переиспользовать.

---

## Типичные ошибки

### Ошибка 1. Override and forget base поведение

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

`LoginPage.open()` replaced base поведение.

Исправленный вариант:

```javascript
open(pageName) {
  const baseResult = super.open(pageName);
  return `${baseResult} and focus form`;
}
```

### Ошибка 2. Think `super` changes объект выполнения

Неправильная модель:

Правильная модель:

### Ошибка 3. Использовать `super`, когда нужна замена поведение

Sometimes derived method should fully replace base поведение.

If so:

The decision is semantic:

### Ошибка 4. Try to use `super()` here

Эта глава не про constructor `super()`.

Wrong direction for this chapter:

Current topic:

---

## Практическое использование

Используйте `super.method()`, когда:

Good examples:

* base page open + page-specific preparation;
* base request description + service-specific label;
* base validation formatting + specialized validation message;
* base framework logging + feature-specific context.

Avoid `super` when:

Правило читаемости:

---

## Использование в Automation QA

### BasePage.open()

Base page:

Login page:

### API client

Base API client:

Users client:

### Validators

Base validator:

Status validator:

---

## Диаграммы главы

### 1. Зачем существует super

### 2. Base method

### 3. Derived override

### 4. Reuse base поведение

### 5. Extend поведение

### 6. `super.method()`

### 7. Base call flow

### 8. Derived method flow

### 9. Текущая модель JavaScript

### 10. Prototype lookup reminder

### 11. Receiver reminder

### 12. `this` inside base method

### 13. QA BasePage example

### 14. LoginPage example

### 15. API client example

### 16. Читаемость

### 17. Типичные ошибки

### 18. Override without super

### 19. Override with super

### 20. Method composition

### 21. Краткая ментальная модель

### 22. Complete super model

### 23. Base manual analogy

### 24. Recipe analogy

### 25. Procedure analogy

### 26. Object relationship

### 27. Class relationship

### 28. Lookup relationship

### 29. Receiver relationship

```text
method source: base
receiver: derived instance
```

### 30. Переход к constructor super

### 31. Переход к advanced inheritance

### 32. Framework example

### 33. Validation helper

### 34. Derived extension

### 35. Принадлежность поведения

### 36. Итоговая схема

---

## Итоги

`super` appears after Class Inheritance naturally.

Inheritance showed:

Overriding showed:

`super` отвечает:

```text
Как derived method может переопределить base method
but still reuse base behavior?
```

Основная модель:

`super` does not copy base code. It calls base поведение through the class relationship, while the объект выполнения model and prototype-chain mental model still matter.

The next chapter starts the Arrays section.

---

## Что нужно запомнить

✓ `super.method()` calls base class поведение from derived method.

✓ `super` is most useful when override should extend base поведение.

✓ `super` does not copy base code.

✓ `super` and `this` are different concepts.

✓ Base method called through `super` still uses current объект выполнения.

✓ Override without `super` replaces base поведение for that method call.

✓ Override with `super` reuses and extends base поведение.

✓ Constructor `super()` is a future topic.

✓ Prototype-chain mental model still matters.

✓ Next section begins Arrays.

---

## Проверьте себя

1. Какую проблему решает `super`?

2. В чем разница между override с `super` и без `super`?

3. Does `super.method()` copy base method code?

4. Какое base поведение переиспользуется в `LoginPage.open()`?

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
