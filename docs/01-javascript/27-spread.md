# Spread

## Связь с предыдущей главой

Предыдущая глава объяснила Rest Parameters.

Теперь появляется обратный вопрос:

> Как один array снова превратить в много отдельных значений?

Например, функция ожидает три arguments:

```javascript
function compareStatuses(firstStatus, secondStatus, thirdStatus) {
  console.log(firstStatus, secondStatus, thirdStatus);
}
```

А значения уже лежат в одном array:

```javascript
const statuses = [200, 201, 204];
```

Как передать array так, чтобы функция получила три отдельных значения?

Главный вопрос этой главы:

> Как раскрываются значения?

---

## Предварительные требования

Для этой главы нужно понимать:

* что arguments передаются в function call;
* что parameters получают arguments по позиции;
* что Rest Parameter собирает many arguments into one array;
* что array хранит значения по порядку;
* что object хранит properties;
* что references и shallow copy уже были объяснены на концептуальном уровне.

Не требуется знать deep copy, `structuredClone`, recursion, destructuring with rest, immutable состояние management, React patterns или advanced object merging. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            110-140 минут
Разбор схем:             40-60 минут
Запуск примеров:         20-30 минут
Практика:                100-130 минут
Повторение материала:    25 минут
```

Уровень сложности: **L3**.

Spread использует те же три точки, что и Rest, но направление другое. Это главная мысль главы.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/26-rest.md
```

Текущая глава:

```text
docs/01-javascript/27-spread.md
```

Следующая глава:

```text
docs/01-javascript/28-closures.md
```

Следующая глава ответит:

> Как функция может помнить данные после выполнения?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует Spread syntax;
* чем Spread отличается от Rest;
* как раскрывать array значения;
* как раскрывать object properties;
* как использовать Spread в function call;
* как копировать arrays на высоком уровне;
* как копировать objects на высоком уровне;
* как объединять arrays;
* как объединять objects;
* что такое shallow copy на высоком уровне;
* какие ошибки встречаются чаще всего;
* как Spread используется в Automation QA.

---

## Мотивация

Начнем с проблемы.

Функция ожидает отдельные arguments:

```javascript
function validateThreeStatuses(firstStatus, secondStatus, thirdStatus) {
  console.log(firstStatus);
  console.log(secondStatus);
  console.log(thirdStatus);
}
```

Но данные уже собраны в array:

```javascript
const statuses = [200, 201, 204];
```

Проблема:

Зачем существует Spread:

Главный вопрос:

> Как раскрываются значения?

---

## Теория

### Rest vs Spread

Начнем с направления.

Rest:

Spread:

Complete Rest ↔ Spread picture:

Одинаковые три точки не означают одну универсальную операцию. Значение зависит от места в коде.

### Зачем существует Spread

Spread нужен, когда одно collection value должно раскрыться в отдельные значения.

Collection expansion:

Spread direction:

Это обратное направление относительно Rest.

### Expanding array значения

Array можно раскрыть через `...`.

```javascript
const statuses = [200, 201, 204];

console.log(...statuses);
```

Array expansion:

Spread не изменяет сам array. Он раскрывает его значения в текущем месте.

### Function calls with Spread

Spread часто используется в function call.

```javascript
function validateThreeStatuses(firstStatus, secondStatus, thirdStatus) {
  console.log(firstStatus, secondStatus, thirdStatus);
}

const statuses = [200, 201, 204];

validateThreeStatuses(...statuses);
```

Function call:

Вызов функции:

Parameters still receive значения by position.

### Expanding object properties

Spread can also expand object properties inside object literal.

```javascript
const baseUser = {
  role: 'user'
};

const adminUser = {
  ...baseUser,
  role: 'admin'
};
```

Object expansion:

Object spread expands properties, not function arguments.

### Copying arrays

Spread can create a shallow copy of an array.

```javascript
const statuses = [200, 201];
const copiedStatuses = [...statuses];
```

Copy array:

Это shallow copy. Deep copy будет отдельной темой.

### Copying objects

Object spread can create a shallow copy of an object.

```javascript
const basePayload = {
  role: 'user'
};

const copiedPayload = {
  ...basePayload
};
```

Copy object:

Again: this is shallow copy.

### Combining arrays

Spread can combine arrays.

```javascript
const smokeStatuses = [200, 201];
const regressionStatuses = [204, 301];

const allStatuses = [...smokeStatuses, ...regressionStatuses];
```

Merge arrays:

### Combining objects

Object spread can combine objects.

```javascript
const baseConfig = {
  retries: 1
};

const localConfig = {
  baseUrl: 'http://localhost'
};

const config = {
  ...baseConfig,
  ...localConfig
};
```

Merge objects:

If the same property appears later, later value wins at this high level.

Advanced object merging will be studied later.

### Shallow copy

Shallow copy means top-level container is new, but nested objects are not deeply copied.

Shallow copy:

Эта глава не учит deep copy или `structuredClone`.

### Читаемость

Spread is useful when expansion is visible and meaningful.

Читаемость:

Spread should answer:

```text
What collection is being expanded?
Where are values expanded into?
```

---

## Внутренний механизм

Spread is contextual.

Spread lifecycle:

Data expansion:

Function invocation with spread:

Текущее место в модели JavaScript:

Переход к Closures:

---

## Ментальная модель

### Opening a box

### Unpacking luggage

### Emptying a basket

Basket opening:

### Dealing cards

### Unpacking a delivery

Краткая ментальная модель:

```text
Spread expands one collection.
Array spread expands values.
Object spread expands properties.
Rest collects.
Spread expands.
```

Complete Spread model:

---

## Примеры кода

Все примеры находятся в:

```text
examples/01-javascript/chapter-27/
```

Запуск:

```bash
node examples/01-javascript/chapter-27/01-array-spread.js
node examples/01-javascript/chapter-27/02-function-call.js
node examples/01-javascript/chapter-27/03-object-spread.js
node examples/01-javascript/chapter-27/04-copy-merge.js
node examples/01-javascript/chapter-27/05-common-mistakes.js
node examples/01-javascript/chapter-27/06-qa-example.js
```

### 01-array-spread.js

Показывает array spread.

### 02-function-call.js

Показывает function call с Spread.

### 03-object-spread.js

Показывает object spread.

### 04-copy-merge.js

Показывает shallow copy и merge arrays/objects на высоком уровне.

### 05-common-mistakes.js

Показывает направление Rest vs Spread.

### 06-qa-example.js

Показывает merging test data и request payload.

---

## Частые вопросы

### Spread и Rest - это одно и то же?

Нет. Rest собирает значения. Spread раскрывает collection.

### Почему у них одинаковые три точки?

Синтаксис похож, но значение зависит от context. В parameter list это Rest. В call, array literal и object literal это Spread.

### Spread делает deep copy?

Нет. На этом уровне нужно помнить: Spread делает shallow copy. Deep copy будет изучаться позже.

### Можно ли Spread использовать с object?

Да, внутри object literal он раскрывает properties.

### Что произойдет при одинаковых object properties?

На высоком уровне later property value overwrites earlier property value.

### Нужно ли сейчас знать React или immutable состояние?

Нет. Эти patterns будут изучаться отдельно, если понадобятся.

---

## Распространённые мифы

### Миф: три точки всегда означают одно и то же

Реальность:

Значение зависит от context.

### Миф: Spread собирает значения

Реальность:

Spread раскрывает collection. Rest собирает.

### Миф: Spread делает deep copy

Реальность:

Spread создает shallow copy на этом уровне.

### Миф: Object spread всегда безопасно объединяет любые objects

Реальность:

Object spread выполняет top-level merge. Advanced object merging будет позже.

Схема типичных ошибок:

---

## Распространённые ошибки

### Ошибка 1. Путать направление

Rest:

```javascript
function collect(...values) {}
```

Spread:

```javascript
collect(...values);
```

Direction:

### Ошибка 2. Ожидать deep copy

```javascript
const copiedPayload = {
  ...basePayload
};
```

Это shallow copy на высоком уровне.

### Ошибка 3. Забыть порядок properties

```javascript
const user = {
  role: 'user',
  role: 'admin'
};
```

Later value wins.

### Ошибка 4. Слишком сложный Spread

Если expression трудно читать, лучше разбить на несколько шагов.

### Ошибка 5. Использовать Spread там, где проще передать значения явно

Если значения уже отдельные и их мало, явный вызов может быть понятнее.

---

## Практическое использование

Spread полезен, когда нужно:

Практический чек-лист:

```text
1. Что раскрывается?
2. Это array или object?
3. В какой context раскрываются values?
4. Нужно ли помнить порядок?
5. Не ожидаю ли я deep copy?
```

---

## Использование в Automation QA

### Merging test data

```javascript
const baseUser = {
  role: 'user'
};

const adminUser = {
  ...baseUser,
  role: 'admin'
};
```

### Copying request payloads

```javascript
const basePayload = {
  active: true
};

const requestPayload = {
  ...basePayload,
  email: 'anna@example.com'
};
```

### Extending configuration

```javascript
const baseConfig = {
  retries: 1
};

const localConfig = {
  ...baseConfig,
  baseUrl: 'http://localhost'
};
```

### Composing helper arguments

```javascript
function validateThreeStatuses(firstStatus, secondStatus, thirdStatus) {
  console.log(firstStatus, secondStatus, thirdStatus);
}

const statuses = [200, 201, 204];

validateThreeStatuses(...statuses);
```

### Readable test setup

Пример QA-helper: `validateThreeStatuses(...statuses)` раскладывает массив на отдельные аргументы — это обратная операция к rest из предыдущей главы.

Spread helps compose data, but test setup must remain readable.

---

## Итоги

Spread отвечает:

```text
How can one collection become many values?
```

Главная модель:

```text
Rest collects many values into one collection.
Spread expands one collection into many values.
```

Complete Rest ↔ Spread picture:

Следующая глава ответит:

```text
Как функция может помнить данные после выполнения?
```

Это тема Closures.

---

## Что нужно запомнить

* Spread раскрывает collection.
* Rest собирает значения, Spread раскрывает значения.
* В function call array spread становится separate arguments.
* В array literal Spread раскрывает array значения.
* В object literal Spread раскрывает properties.
* Spread copy - shallow copy на этом уровне.
* При object merge later properties override earlier properties.
* `...` не является одной универсальной операцией: meaning depends on context.
* В Automation QA Spread полезен для payloads, configs и helper arguments.
* Deep copy, structuredClone, destructuring with rest и advanced merging будут позже.

---

## Проверьте себя

Ответьте без запуска кода.

1. Зачем существует Spread?
2. Чем Spread отличается от Rest?
3. Что делает Spread в function call?
4. Что делает Spread в array literal?
5. Что делает Spread в object literal?
6. Что такое shallow copy на высоком уровне?
7. Почему порядок object properties важен?
8. Где Spread полезен в Automation QA?
9. Почему `...` нельзя понимать как одну универсальную операцию?
10. Какая тема идет следующей?

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/27-spread.md
```

Сначала решайте задания на предсказание вывода без запуска. Главная цель - видеть направление: Rest собирает, Spread раскрывает.

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/27-spread.md
```

Читайте решения после самостоятельной попытки. Проверяйте главный вопрос: как раскрываются значения?
