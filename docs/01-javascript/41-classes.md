# Classes

## Связь с предыдущей главой

Предыдущие главы объяснили три связанные идеи.

Сначала Object Methods:

Затем Prototype:

Затем Prototype Chain:

Теперь появляется следующий практический вопрос:

> Как удобно создать много похожих objects, которые имеют own data and shared prototype methods?

Вручную это возможно:

Но repeated setup быстро становится шумным.

Classes дают более удобную форму для этой задачи:

Важно: classes do not replace prototypes. Classes use prototypes.

---

## Предварительные требования

Для этой главы нужно понимать:

* что object can contain own data;
* что methods are function object properties;
* что обычный вызов метода выбирает объект выполнения из формы вызова;
* что prototype is ordinary object used as shared source of properties;
* что Prototype Chain is lookup algorithm;
* что own property wins over inherited property;
* что method location and объект выполнения are different concepts.

Не требуется знать inheritance, `extends`, `super`, private поля, static members, decorators, `instanceof`, advanced constructor поведение or transpilation. Эти темы будут изучаться позже.

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

Classes выглядят как новая большая тема, но в этой главе они изучаются как следующий слой над уже понятной моделью: object creation + own data + shared prototype methods.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/40-prototype-chain.md
```

Текущая глава:

```text
docs/01-javascript/41-classes.md
```

Следующая глава:

```text
docs/01-javascript/42-class-inheritance.md
```

Следующая глава ответит:

> Как one class can reuse поведение from another class?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем classes появились в JavaScript;
* какую повторяющуюся работу class убирает;
* что такое class declaration;
* зачем нужен constructor;
* что такое instance;
* как создаются own data properties;
* где находятся class methods на высоком уровне;
* почему class does not replace prototype;
* почему class improves readability for repeated object creation;
* как classes применяются in Automation QA architecture.

---

## Мотивация

Начнем не с `class`.

Начнем с проблемы.

Есть Page Объект:

```javascript
const loginPage = {
  name: 'LoginPage',
  url: '/login'
};
```

Есть общее поведение:

```javascript
const pageBehavior = {
  describePage() {
    return `${this.name}: ${this.url}`;
  }
};
```

Можно вручную связать object with prototype:

```javascript
Object.setPrototypeOf(loginPage, pageBehavior);
```

Для одного object это нормально.

Но теперь нужно много pages:

```text
LoginPage
ProfilePage
OrdersPage
SettingsPage
AdminPage
...
```

Для каждого object повторяется setup:

Проблема:

Нужен object recipe:

Class gives this recipe a language-level form.

---

## Теория

Class is a convenient syntax for creating similar objects with shared prototype methods.

Главная модель:

Class declaration:

```javascript
class PageObject {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }

  describePage() {
    return `${this.name}: ${this.url}`;
  }
}
```

Создание instance:

```javascript
const loginPage = new PageObject('LoginPage', '/login');
```

В этой главе `new` рассматривается только как syntax for creating class instance. Advanced поведение of `new` will be studied later.

Что важно сейчас:

### Constructor

Constructor is special method that runs when new instance is created.

Constructor отвечает:

> What own data should each new object receive?

### Instance

Instance is object created from class.

Например:

```javascript
const loginPage = new PageObject('LoginPage', '/login');
const profilePage = new PageObject('ProfilePage', '/profile');
```

Each instance has own data:

But methods are shared:

### Relationship with prototypes

Class does not remove prototype lookup.

Модель высокого уровня:

You do not need to manually write `PageObject.prototype` in this chapter.

But you must understand the relationship:

This is why classes fit naturally after Prototype and Prototype Chain.

---

## Внутренний механизм

When JavaScript evaluates:

```javascript
const loginPage = new PageObject('LoginPage', '/login');
```

Mentally:

After creation:

When code calls:

```javascript
loginPage.describePage();
```

Lookup still works:

Напоминание про объект выполнения:

Inside method:

```javascript
return `${this.name}: ${this.url}`;
```

`this.name` reads from instance:

This is the same model from `this`, Prototype and Prototype Chain chapters.

### Syntactic sugar

After the mental model is clear, we can say the common phrase:

Class syntax is often described as syntactic sugar over prototype-based object creation.

Значение:

Do not reduce the whole chapter to this phrase. It is useful only after you understand what repetitive work class removes.

---

## Ментальная модель

Class is an object recipe.

Важно отделять учебную аналогию от технического определения.

В этой главе слова `recipe`, `blueprint`, `template`, `factory` and `cookie cutter` используются как mental models.

Они помогают понять назначение classes:

Но это не формальное определение class в JavaScript.

Мы используем эти аналогии, чтобы увидеть проблему repeated object creation and the role of class syntax. Внутренние детали языка здесь не раскрываются и будут появляться только тогда, когда станут нужны для следующих тем.

Factory blueprint:

Cookie cutter:

Building template:

Production line:

Важное различие:

---

## Примеры кода

Примеры находятся в:

```text
examples/01-javascript/chapter-41/
```

Запуск:

```bash
node examples/01-javascript/chapter-41/01-first-class.js
```

### Пример 1. First class

Файл:

```text
examples/01-javascript/chapter-41/01-first-class.js
```

Показывает minimal class and instance creation.

### Пример 2. Constructor

Файл:

```text
examples/01-javascript/chapter-41/02-constructor.js
```

Показывает how constructor writes own data.

### Пример 3. Methods

Файл:

```text
examples/01-javascript/chapter-41/03-methods.js
```

Показывает shared methods used by different instances.

### Пример 4. Prototype reminder

Файл:

```text
examples/01-javascript/chapter-41/04-prototype-reminder.js
```

Показывает high-level relationship between class method and prototype lookup.

### Пример 5. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-41/05-common-mistakes.js
```

Показывает mistake: forgetting `this` inside class method.

### Пример 6. QA example

Файл:

```text
examples/01-javascript/chapter-41/06-qa-example.js
```

Показывает API client class with own config and shared methods.

---

## Частые вопросы

### Class заменяет prototype?

Нет.

Class does not replace prototype. Class uses prototype.

### JavaScript стал class-based language?

Нет.

В этой главе важно не менять mental model. Objects still use prototypes.

### Constructor - это обычный method?

Constructor has special role during instance creation. It runs when the new instance is created and prepares own data.

Advanced constructor поведение будет изучаться позже.

### Methods inside class copied into every instance?

Нет.

Модель высокого уровня:

### Нужно ли всегда использовать classes?

Нет.

Classes useful when you need many similar objects. For one small object, object literal may be clearer.

---

## Распространенные мифы

### Миф: class создает новый object model

Реальность: class gives convenient syntax over prototype-based object creation.

### Миф: class methods are copied to every instance

Реальность: methods are shared through prototype lookup.

### Миф: constructor is for business logic

Реальность: constructor should primarily initialize the new object. Heavy business logic makes instances harder to create and test.

### Миф: classes are required for Automation QA

Реальность: classes are useful for Page Objects and framework objects, but not every helper must be a class.

---

## Типичные ошибки

### Ошибка 1. Забыть `new`

Неправильный код:

```javascript
const loginPage = PageObject('LoginPage', '/login');
```

Что произошло:

`class` must be called with `new`.

Исправленный вариант:

```javascript
const loginPage = new PageObject('LoginPage', '/login');
```

Почему:

Class describes how to create instance. `new` starts instance creation.

### Ошибка 2. Забыть `this` inside method

Неправильный код:

```javascript
class PageObject {
  constructor(name) {
    this.name = name;
  }

  describePage() {
    return name;
  }
}
```

Что произошло:

`name` is variable lookup, not instance property lookup.

Исправленный вариант:

```javascript
describePage() {
  return this.name;
}
```

### Ошибка 3. Думать, что class method is own property

Неправильная модель:

Правильная модель:

### Ошибка 4. Перегружать constructor

Неправильная модель:

Почему плохо:

Instance creation becomes unpredictable.

Исправленная модель:

---

## Практическое использование

Use class when:

Примеры:

* Page Objects;
* API clients;
* validators;
* request builders;
* configuration wrappers;
* framework service objects.

Do not use class only because it looks serious.

Good class design:

---

## Использование в Automation QA

### Page Objects

Page Objects are natural class candidates:

This creates readable test code:

```javascript
const loginPage = new LoginPage('/login');
```

### API clients

API client class can keep environment config as own data:

### Reusable validators

Validator class:

### Request builders

Request builder class can collect request data and provide methods for building payloads.

Detailed builder patterns will appear later in Automation QA architecture sections.

### Framework objects

Classes help make framework objects explicit:

```text
Reporter
ConfigProvider
ApiClient
DatabaseClient
PageObject
```

But they should still be small and readable.

---

## Диаграммы главы

### 1. Why classes exist

### 2. Manual creation

### 3. Repeated setup

```text
object A setup
object B setup
object C setup
```

### 4. Class template

### 5. Instance creation

### 6. Constructor

### 7. Methods

### 8. Prototype reminder

### 9. Текущая модель JavaScript

### 10. Object creation flow

### 11. QA Page Object example

### 12. API client example

### 13. Test user example

### 14. Читаемость

### 15. Типичные ошибки

### 16. Blueprint analogy

### 17. Cookie cutter analogy

### 18. Factory analogy

### 19. Recipe analogy

### 20. Constructor flow

### 21. Instance lifecycle

### 22. Shared methods

### 23. Own data

### 24. Prototype behind class

### 25. Class to prototype

### 26. Object relationship

### 27. Краткая ментальная модель

### 28. Complete class model

### 29. Build process

### 30. Receiver reminder

### 31. Constructor execution

### 32. Shared поведение reuse

### 33. Переход к Inheritance

### 34. Переход к extends

### 35. Object evolution

### 36. Production line

### 37. Object identity

### 38. Prototype lookup still works

### 39. Hidden prototype

### 40. Итоговая схема

---

## Итоги

Classes appear after Prototype and Prototype Chain naturally.

Prototype showed:

Prototype Chain showed:

Classes answer:

```text
How to create many similar objects more conveniently?
```

Class gives object creation a readable template:

Classes do not replace prototypes. Classes use prototypes.

The next chapter will explain class inheritance: how one class can reuse поведение from another class.

---

## Что нужно запомнить

✓ Class is a convenient template for creating similar objects.

✓ Constructor runs during instance creation.

✓ Constructor usually initializes own data.

✓ Instance is object created from class.

✓ Class methods are shared through prototype lookup.

✓ Classes do not replace prototypes.

✓ Classes use prototypes.

✓ `this` inside method refers to объект выполнения during ordinary invocation.

✓ Use classes when repeated object creation becomes clearer.

✓ Inheritance is a separate topic for the next chapter.

---

## Проверьте себя

1. What repetitive work does class remove?

2. What does constructor usually do?

3. What is an instance?

4. Where does instance own data live?

5. Are class methods copied into every instance?

6. Why does class not replace prototypes?

7. What does `new Class(...)` start?

8. Why should constructor not contain too much business logic?

9. How are classes useful for Page Objects?

10. What topic comes next after classes?

---

## Практика

Практические задания находятся в отдельном файле:

```text
practice/01-javascript/41-classes.md
```

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/01-javascript/41-classes.md
```

Сначала выполните практику самостоятельно. Затем сравните ход рассуждения, а не только итоговый ответ.
