# Arrow Functions

## Связь с предыдущей главой

Предыдущая глава ввела Function Expression.

Главная модель была такой: функция может быть значением, которое присваивают переменной.

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
function () { return true; }   длинная форма
() => true                     та же идея короче
```

Arrow Function не отменяет Function Declaration и Function Expression.

В этой главе мы смотрим на нее через узкий вопрос:

> Можно ли создать function object короче?

---

## Теория

### Зачем появились Arrow Functions

Компактная запись была одной из причин появления Arrow Functions. В этой главе мы рассматриваем именно эту сторону: arrow-синтаксис как способ создать function object более короткой формой.

Эволюция синтаксиса:

Почему компактная форма полезна:

```text
function () { ... }   →   () => { ... }   →   () => значение
```

Важно:

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

| Запись | Форма |
| --- | --- |
| `function () { ... }` | function expression |
| `() => { ... }` | arrow с телом |
| `() => значение` | arrow с неявным возвратом |

Главная замена:

Обе формы создают function object, который можно сохранить в переменной.

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
список параметров  =>  тело
```

Compact syntax model:

### Создание Arrow Function

Базовая форма:

```javascript
const validateStatus = () => {
  console.log('Status is valid');
};
```

Схема создания:

```text
validateStatus  ──→  [ function object ]
```

Arrow creation временная шкала:

### Вызов Arrow Function

Arrow Function вызывается так же, как function object из Function Expression:

```javascript
validateStatus();
```

Invocation схема:

```text
вызов arrow-функции ничем не отличается от вызова обычной
```

Объявление переменной с Arrow Function не выполняет тело.

### Empty parameter list

Если функция не получает данные, пишутся пустые скобки:

```javascript
const validateStatus = () => {
  console.log('Status is valid');
};
```

Схема:

```text
() => { ... }        без параметров — скобки обязательны
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
statusCode => { ... }    один параметр — скобки можно опустить
```

Также можно оставить скобки:

```javascript
const validateStatus = (statusCode) => {
  console.log(statusCode);
};
```

Оба варианта работают.

Важно:

### Multiple parameters

Если параметров несколько, скобки обязательны:

```javascript
const compareStatus = (actualStatus, expectedStatus) => {
  console.log(actualStatus === expectedStatus);
};
```

Схема:

```text
(a, b) => { ... }        несколько параметров — скобки обязательны
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
() => { return true; }   тело с явным return
```

В этой главе `return` рассматривается только на высоком уровне. Отдельная глава о `return` будет позже.

### Implicit return

Implicit return означает, что короткая Arrow Function возвращает результат выражения без слова `return`.

```javascript
const isSuccessfulStatus = () => true;
```

Схема:

```text
() => true               значение возвращается без слова return
```

Сравнение: запись с `{}` требует `return`, запись без фигурных скобок возвращает результат выражения автоматически.

Важно не превращать implicit return в головоломку. Если короткая запись ухудшает читаемость, лучше использовать тело с `{}` и `return`.

### Читаемость

Arrow Function полезна, когда сокращение делает код яснее.

Сравнение читаемости: короткая форма хороша для одного выражения, а для нескольких шагов понятнее тело с `{}` и явным `return`.

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

Короткая запись — не единственное отличие:

```mermaid
flowchart TD
    A["стрелочная функция"] --> B["короткая запись"]
    A --> C["нет своего this"]
    C --> D["this берётся из окружающего кода"]
    A --> E["нет arguments"]
    A --> F["нельзя вызвать через new"]
```

## Внутренний механизм

На концептуальном уровне Arrow Function проходит тот же путь, что и Function Expression:

Что делает движок:

Function object remains the same conceptual result:

Эта глава не объясняет отличия Arrow Functions в поведении `this`, constructors, prototype и `arguments`. Эти темы требуют отдельной внутренней модели и будут изучаться позже.

### Текущее место в модели JavaScript

Модель значения остаётся такой: создаётся function object, и переменная хранит на него ссылку — независимо от выбранной формы записи.

Переход к Parameters:

---

## Ментальная модель

### Shorthand notation

Arrow Function похожа на сокращенную запись.

Сокращение не меняет главную цель: создать function object.

### Compressed recipe

Обе формы описывают инструкцию, которую можно выполнить позже.

### Simplified blueprint

Arrow Function - это упрощенный чертеж создания function object.

### Compact instruction card

### Abbreviated command

Complete Arrow Function overview:

---

## Примеры кода

Все примеры находятся в:

```text
examples/01-javascript/chapter-23/
```

Запуск:

```bash
node examples/01-javascript/chapter-23/01-arrow-basic.js
node examples/01-javascript/chapter-23/02-parameters.js
node examples/01-javascript/chapter-23/03-return.js
node examples/01-javascript/chapter-23/04-expression-vs-arrow.js
node examples/01-javascript/chapter-23/05-common-mistakes.js
node examples/01-javascript/chapter-23/06-qa-example.js
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

## Распространённые мифы

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

---

## Распространённые ошибки

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

Практический чек-лист:

```text
1. Какой function object создается?
2. Где он хранится?
3. Где он вызывается?
4. Нужен explicit return или implicit return?
5. Стало ли читателю проще?
```

Правило читаемости:

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

Пример QA-helper: `const isSuccess = (status) => status === 200;` — короткий предикат, который удобно передавать в методы массивов.

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

Arrow Functions полезны, но тестовый код читают люди. Читаемость важнее демонстрации знания короткого синтаксиса.

---

## Итоги

Arrow Functions продолжают линию:

Главная модель: arrow-функция — это другая форма записи того же function object, а не отдельный вид функции.

В рамках этой главы Arrow Functions важны как компактная форма создания function object.

Это не означает, что Arrow Function равна Function Expression "только короче". У arrow-синтаксиса есть другие особенности, но они требуют отдельного объяснения и будут изучаться позже.

Они не заменяют все остальные формы функций.

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
practice/01-javascript/23-arrow-functions.md
```

Сначала решайте задания на предсказание вывода без запуска. Главная цель - видеть, что Arrow Function создает function object, а компактная запись не отменяет обычную модель вызова.

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/23-arrow-functions.md
```

Читайте решения после самостоятельной попытки. Проверяйте рассуждение: какую проблему решает этот синтаксис?
