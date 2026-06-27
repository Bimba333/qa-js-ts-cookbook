# Arrow Functions

## Связь с предыдущей главой

Предыдущая глава ввела Function Expression.

Главная модель была такой:

```text
Function Expression
│
▼
создает function object
│
▼
переменная хранит function object
│
▼
вызов через variableName()
```

Теперь появляется следующий вопрос:

> Можно ли создать такой же function object более коротким синтаксисом?

Function Expression уже работает:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Но в JavaScript есть более компактная форма:

```javascript
const validateStatus = () => {
  console.log('Status is valid');
};
```

Главный вопрос этой главы:

> Какую проблему решает этот синтаксис?

---

## Предварительные требования

Для этой главы нужно понимать:

* что функция - это специальный object value, который можно вызывать;
* что Function Expression создает function object;
* что переменная может хранить function object;
* что вызов `name()` выполняет тело функции;
* что читаемость важнее механического сокращения кода.

Не требуется знать lexical `this`, constructors, prototype differences, `arguments`, callbacks, higher-order functions или async arrows. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            110-140 минут
Разбор схем:             40-55 минут
Запуск примеров:         20-30 минут
Практика:                90-120 минут
Повторение материала:    25 минут
```

Уровень сложности: **L3**.

Arrow Functions выглядят как короткая запись, но важно увидеть не только форму, а смысл: в этой главе мы рассматриваем их как еще один способ создать function object. Другие особенности Arrow Functions будут разобраны позже.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/22-function-expression.md
```

Текущая глава:

```text
docs/01-javascript/23-arrow-functions.md
```

Следующая глава:

```text
docs/01-javascript/24-parameters.md
```

Следующая глава ответит:

> Как передавать данные внутрь функции?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем появились Arrow Functions;
* что Arrow Function создает function object;
* чем Arrow Function похожа на Function Expression;
* как записывать пустой список параметров;
* как записывать один параметр;
* как записывать несколько параметров;
* что такое explicit return;
* что такое implicit return на высоком уровне;
* как вызвать Arrow Function;
* почему компактный синтаксис стал одной из причин появления Arrow Functions;
* когда короткая запись улучшает читаемость;
* когда короткая запись ухудшает читаемость;
* как Arrow Functions используются в Automation QA без callbacks.

---

## Мотивация

Начнем со сравнения.

Function Expression уже решает задачу:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Вопрос:

```text
Если Function Expression уже работает,
зачем понадобилась еще одна форма записи?
```

Ответ:

```text
Некоторые функции часто бывают короткими.
Для них длинная форма function () { ... }
может быть шумной.
```

Схема проблемы:

```text
Нужно создать function object
│
▼
Function Expression работает
│
▼
Но запись иногда длинная
│
▼
Компактная запись решает часть проблемы
│
▼
Arrow Function
```

Arrow Function не отменяет Function Declaration и Function Expression.

В этой главе мы смотрим на нее через узкий вопрос:

> Можно ли создать function object короче?

---

## Теория

### Зачем появились Arrow Functions

Компактная запись была одной из причин появления Arrow Functions. В этой главе мы рассматриваем именно эту сторону: arrow-синтаксис как способ создать function object более короткой формой.

Эволюция синтаксиса:

```text
Function Declaration
│
└── function validateStatus() { ... }

Function Expression
│
└── const validateStatus = function () { ... };

Arrow Function
│
└── const validateStatus = () => { ... };
```

Почему компактная форма полезна:

```text
Тот же function object
│
▼
меньше синтаксического шума
│
▼
короче запись
│
▼
удобнее для некоторых маленьких функций
```

Важно:

```text
Arrow Function
│
└── не "новый вид значения"
    │
    └── в этой главе рассматривается как способ создать function object
```

У Arrow Functions есть и другие особенности. Здесь они не раскрываются, потому что требуют отдельных тем: `this`, constructors, `arguments` и более сложные сценарии будут изучаться позже.

### Function Expression vs Arrow Function

Function Expression:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Arrow Function:

```javascript
const validateStatus = () => {
  console.log('Status is valid');
};
```

Сравнение:

```text
Function Expression
│
├── function keyword
├── parentheses
└── body

Arrow Function
│
├── parentheses
├── =>
└── body
```

Главная замена:

```text
function () { ... }
│
▼
() => { ... }
```

Обе формы создают function object, который можно сохранить в переменной.

```text
const validateStatus = ...
│
└── variable stores function object
```

### Syntax simplification

Arrow Function убирает слово `function`.

```text
function () {
  ...
}
```

становится:

```text
() => {
  ...
}
```

Схема упрощения:

```text
function keyword
│
└── removed

arrow =>
│
└── separates parameters and body
```

Compact syntax model:

```text
parameters
│
▼
=>
│
▼
body
```

### Создание Arrow Function

Базовая форма:

```javascript
const validateStatus = () => {
  console.log('Status is valid');
};
```

Схема создания:

```text
const validateStatus
│
▼
переменная
│
▼
() => { ... }
│
▼
создает function object
```

Arrow creation timeline:

```text
Engine reaches assignment
│
▼
evaluates right side
│
▼
right side creates function object
│
▼
stores object in variable
│
▼
body waits for invocation
```

### Вызов Arrow Function

Arrow Function вызывается так же, как function object из Function Expression:

```javascript
validateStatus();
```

Invocation diagram:

```text
validateStatus
│
▼
read variable
│
▼
get function object
│
▼
()
│
▼
execute body
```

Объявление переменной с Arrow Function не выполняет тело.

```text
const validateStatus = () => { ... };
│
└── creates and stores function object

validateStatus();
│
└── invokes function object
```

### Empty parameter list

Если функция не получает данные, пишутся пустые скобки:

```javascript
const validateStatus = () => {
  console.log('Status is valid');
};
```

Схема:

```text
()
│
└── empty parameter list
```

В этой главе параметры объясняются только на уровне формы записи. Следующая глава будет подробно отвечать, как данные попадают внутрь функции.

### One parameter

Если параметр один, скобки можно опустить:

```javascript
const validateStatus = statusCode => {
  console.log(statusCode);
};
```

Схема:

```text
statusCode => { ... }
│
└── one parameter
```

Также можно оставить скобки:

```javascript
const validateStatus = (statusCode) => {
  console.log(statusCode);
};
```

Оба варианта работают.

Важно:

```text
one parameter
│
├── statusCode => { ... }
└── (statusCode) => { ... }
```

### Multiple parameters

Если параметров несколько, скобки обязательны:

```javascript
const compareStatus = (actualStatus, expectedStatus) => {
  console.log(actualStatus === expectedStatus);
};
```

Схема:

```text
(actualStatus, expectedStatus)
│
└── multiple parameters require parentheses
```

Подробная работа параметров будет изучаться в следующей главе.

### Explicit return

Explicit return означает, что значение возвращается через `return`.

```javascript
const isSuccessfulStatus = () => {
  return true;
};
```

Схема:

```text
() => {
  return value;
}
│
└── explicit return
```

В этой главе `return` рассматривается только на высоком уровне. Отдельная глава о `return` будет позже.

### Implicit return

Implicit return означает, что короткая Arrow Function возвращает результат выражения без слова `return`.

```javascript
const isSuccessfulStatus = () => true;
```

Схема:

```text
() => expression
│
└── result of expression is returned
```

Сравнение:

```text
Explicit return
│
└── () => { return true; }

Implicit return
│
└── () => true
```

Важно не превращать implicit return в головоломку. Если короткая запись ухудшает читаемость, лучше использовать тело с `{}` и `return`.

### Читаемость

Arrow Function полезна, когда сокращение делает код яснее.

Readability comparison:

```text
Хороший случай
│
└── короткая функция, понятное имя

Плохой случай
│
└── длинное тело, много условий, неочевидный implicit return
```

Пример читаемой формы:

```javascript
const isSuccessfulStatus = () => true;
```

Пример, где лучше не сжимать:

```javascript
const validateStatus = () => {
  console.log('Read status');
  console.log('Compare status');
  console.log('Report result');
};
```

Arrow Function не требует всегда использовать самую короткую форму.

---

## Внутренний механизм

На концептуальном уровне Arrow Function проходит тот же путь, что и Function Expression:

```text
Arrow syntax
│
▼
creates function object
│
▼
function object stored in variable
│
▼
function object invoked later
```

Что делает движок:

```text
I see const validateStatus.
│
▼
I evaluate the right side.
│
▼
The right side is an Arrow Function.
│
▼
I create a function object.
│
▼
I store it in validateStatus.
│
▼
I wait until validateStatus() appears.
```

Function object remains the same conceptual result:

```text
Function Expression
│
└── creates function object

Arrow Function
│
└── creates function object
```

Эта глава не объясняет отличия Arrow Functions в поведении `this`, constructors, prototype и `arguments`. Эти темы требуют отдельной внутренней модели и будут изучаться позже.

### Current position in JavaScript model

```text
Functions
│
├── Function Declaration
│   └── named reusable algorithm
│
├── Function Expression
│   └── function object stored in variable
│
└── Arrow Function
    └── shorter syntax for function object
```

Модель values остается такой:

```text
JavaScript values
│
├── Primitive values
│
└── Object values
    │
    ├── Ordinary objects
    └── Function objects
        │
        ├── can be created with function syntax
        └── can be created with arrow syntax
```

Переход к Parameters:

```text
Arrow Functions
│
└── show different parameter forms
    │
    ▼
Next question
│
└── how does data enter a function?
    │
    ▼
Parameters
```

---

## Ментальная модель

### Shorthand notation

Arrow Function похожа на сокращенную запись.

```text
Полная запись
│
└── function () { ... }

Сокращенная запись
│
└── () => { ... }
```

Сокращение не меняет главную цель: создать function object.

### Compressed recipe

```text
Recipe
│
├── long form: function () { steps }
└── compact form: () => { steps }
```

Обе формы описывают инструкцию, которую можно выполнить позже.

### Simplified blueprint

```text
Blueprint
│
├── inputs
├── arrow
└── body
```

Arrow Function - это упрощенный чертеж создания function object.

### Compact instruction card

```text
Instruction card
│
├── ()       no input
├── =>       create arrow function
└── { ... }  body
```

### Abbreviated command

```text
validateStatus = () => { ... }
│
└── abbreviated command for creating function object
```

Complete Arrow Function overview:

```text
Arrow Function
│
├── creates function object
├── can be stored in variable
├── can be invoked
├── can use explicit return
├── can use implicit return
└── should remain readable
```

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-26/
```

Запуск:

```bash
node examples/chapter-26/01-arrow-basic.js
node examples/chapter-26/02-parameters.js
node examples/chapter-26/03-return.js
node examples/chapter-26/04-expression-vs-arrow.js
node examples/chapter-26/05-common-mistakes.js
node examples/chapter-26/06-qa-example.js
```

### 01-arrow-basic.js

Показывает базовую Arrow Function без параметров.

### 02-parameters.js

Показывает пустой список параметров, один параметр и несколько параметров на уровне синтаксиса.

### 03-return.js

Показывает explicit return и implicit return.

### 04-expression-vs-arrow.js

Сравнивает Function Expression и Arrow Function.

### 05-common-mistakes.js

Показывает распространенную ошибку: function object создан, но не вызван.

### 06-qa-example.js

Показывает concise validators и helper-функции для QA-сценария.

---

## Частые вопросы

### Arrow Function заменяет Function Declaration?

Нет. Arrow Function - еще один способ создать function object. Она не отменяет Function Declaration и Function Expression.

### Arrow Function всегда лучше?

Нет. Короткий синтаксис полезен только тогда, когда он улучшает читаемость.

### Почему у одной функции есть `return`, а у другой нет?

Если тело записано в `{}`, нужен explicit return. Если после `=>` идет одно выражение без `{}`, используется implicit return.

### Можно ли всегда убирать скобки у параметров?

Нет. Скобки можно опустить только для одного параметра. Для пустого списка и нескольких параметров скобки нужны.

### Это уже callbacks?

Нет. В этой главе Arrow Functions только создаются, сохраняются в переменные и вызываются. Callbacks будут изучаться позже.

### Здесь нужно понимать lexical `this`?

Нет. Lexical `this` - важное отличие Arrow Functions, но оно будет объясняться позже, когда появится достаточная база.

---

## Распространенные мифы

### Миф: Arrow Function - это другой тип значения

Реальность:

Arrow Function создает function object.

### Миф: Arrow Functions всегда короче и лучше

Реальность:

Короткая запись может ухудшить читаемость, если функция сложная.

### Миф: implicit return всегда предпочтительнее

Реальность:

Implicit return хорош для коротких выражений. Для сложной логики лучше explicit return.

### Миф: Arrow Functions нужно использовать везде

Реальность:

Function Declaration, Function Expression и Arrow Function решают разные задачи чтения и организации кода.

Схема типичных ошибок:

```text
Ошибка
│
├── забыть вызвать функцию
├── перепутать explicit и implicit return
├── убрать скобки там, где они нужны
├── сделать слишком длинную Arrow Function
└── считать Arrow Function заменой всех функций
```

---

## Типичные ошибки

### Ошибка 1. Забыть вызов

Неправильно:

```javascript
const validateStatus = () => {
  console.log('Status is valid');
};

validateStatus;
```

Что произошло:

```text
Переменная прочитана,
но function object не вызван.
```

Исправление:

```javascript
validateStatus();
```

### Ошибка 2. Неправильно использовать implicit return

Неправильно:

```javascript
const isSuccessfulStatus = () => {
  true;
};
```

Здесь нет `return`, поэтому результат не возвращается.

Исправление:

```javascript
const isSuccessfulStatus = () => {
  return true;
};
```

или:

```javascript
const isSuccessfulStatus = () => true;
```

### Ошибка 3. Убрать скобки у нескольких параметров

Неправильно:

```javascript
const compareStatus = actualStatus, expectedStatus => {
  console.log(actualStatus === expectedStatus);
};
```

Исправление:

```javascript
const compareStatus = (actualStatus, expectedStatus) => {
  console.log(actualStatus === expectedStatus);
};
```

### Ошибка 4. Слишком умная короткая запись

Плохо:

```javascript
const validateStatus = statusCode => statusCode === 200 ? 'ok' : 'fail';
```

Для учебного и тестового кода часто читаемее:

```javascript
const validateStatus = (statusCode) => {
  return statusCode === 200;
};
```

### Ошибка 5. Начать объяснять Arrow Function через `this`

`this` действительно связан с Arrow Functions, но это отдельная тема. Сейчас главная модель проще:

```text
Arrow Function creates function object with concise syntax.
```

---

## Практическое использование

Arrow Functions полезны, когда:

```text
функция короткая
│
▼
имя переменной понятное
│
▼
тело легко прочитать
│
▼
короткая форма не скрывает смысл
```

Практический чек-лист:

```text
1. Какой function object создается?
2. Где он хранится?
3. Где он вызывается?
4. Нужен explicit return или implicit return?
5. Стало ли читателю проще?
```

Правило читаемости:

```text
Shorter
│
└── не всегда clearer

Clearer
│
└── всегда важнее shorter
```

---

## Использование в Automation QA

### Helper functions

```javascript
const setupTestData = () => {
  console.log('Create test user');
};
```

Arrow Function создает helper как function object.

### Concise validators

```javascript
const isSuccessfulStatus = () => true;
```

QA helper example:

```text
isSuccessfulStatus
│
└── arrow function object
    │
    └── concise validator
```

### Readable utilities

```javascript
const openUserProfile = () => {
  console.log('Open user profile');
};
```

Хорошее имя переменной остается обязательным. Короткий синтаксис не спасает плохое имя.

### Organizing assertions

```javascript
const assertUserProfileVisible = () => {
  console.log('Assert user profile is visible');
};
```

В реальных тестах assertions должны оставаться явными. Не стоит превращать проверки в слишком короткие и неочевидные выражения.

### Avoiding overly clever syntax

```text
Automation QA code
│
├── should be clear
├── should be maintainable
└── should explain test intention
```

Arrow Functions полезны, но тестовый код читают люди. Читаемость важнее демонстрации знания короткого синтаксиса.

---

## Итоги

Arrow Functions продолжают линию:

```text
Function Declaration
│
▼
Function Expression
│
▼
Arrow Functions
```

Главная модель:

```text
Arrow Function
│
▼
creates function object
│
▼
stores it in variable
│
▼
invocation executes body
```

В рамках этой главы Arrow Functions важны как компактная форма создания function object.

Это не означает, что Arrow Function равна Function Expression "только короче". У arrow-синтаксиса есть другие особенности, но они требуют отдельного объяснения и будут изучаться позже.

Они не заменяют все остальные формы функций.

```text
Function Declaration
│
└── good for named reusable algorithms

Function Expression
│
└── shows function object as value

Arrow Function
│
└── creates function object with arrow syntax
```

Следующая глава ответит:

```text
Как передавать данные внутрь функции?
```

Это тема Parameters.

---

## Что нужно запомнить

* Arrow Function создает function object.
* В этой главе Arrow Function рассматривается как компактная форма создания function object.
* Function Declaration и Function Expression не исчезают.
* Пустой список параметров пишется как `()`.
* Один параметр можно писать без скобок.
* Несколько параметров требуют скобок.
* Explicit return использует `return`.
* Implicit return возвращает результат выражения без `return`.
* Короткая запись не всегда лучше читаемой.
* В Automation QA Arrow Functions полезны для коротких helpers и validators.
* У Arrow Functions есть и другие особенности; lexical `this`, constructors, `arguments`, callbacks и async arrows будут изучаться позже.

---

## Проверьте себя

Ответьте без запуска кода.

1. Зачем появились Arrow Functions?
2. Что создает Arrow Function?
3. Заменяет ли Arrow Function Function Declaration?
4. Как записать Arrow Function без параметров?
5. Когда можно убрать скобки вокруг параметра?
6. Когда скобки обязательны?
7. Чем explicit return отличается от implicit return?
8. Почему короткая запись может ухудшить читаемость?
9. Как Arrow Functions используются в Automation QA?
10. Какая тема идет следующей?

---

## Практика

Практика находится в файле:

```text
practice/chapter-26.md
```

Сначала решайте задания на предсказание вывода без запуска. Главная цель - видеть, что Arrow Function создает function object, а компактная запись не отменяет обычную модель вызова.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-26.md
```

Читайте решения после самостоятельной попытки. Проверяйте рассуждение: какую проблему решает этот синтаксис?
