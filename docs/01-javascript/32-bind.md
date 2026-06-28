# bind()

## Связь с предыдущей главой

Предыдущая глава объяснила `apply()`.

Главная модель была такой:

```mermaid
flowchart TD
    N1["apply()"]
    N2["receiver выбирается явно"]
    N3["arguments передаются одним array или array-like collection"]
    N1 --> N2
    N1 --> N3
```

До этого `call()` показал другой вариант:

```mermaid
flowchart TD
    N1["call()"]
    N2["receiver выбирается явно"]
    N3["arguments передаются отдельно"]
    N1 --> N2
    N1 --> N3
```

Оба механизма делают invocation сразу.

```mermaid
flowchart TD
    N1["functionObject.call(receiver, arg1, arg2)"]
    N2["receiver выбран"]
    N3["function выполняется сейчас"]
    N1 --> N2
    N2 --> N3
```

Теперь появляется следующий вопрос:

> Что делать, если объект выполнения нужно выбрать один раз, а function вызвать позже?

Или так:

```mermaid
flowchart TD
    N1["choose receiver"]
    N2["do not invoke yet"]
    N3["save prepared function"]
    N4["invoke later"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Для этого существует `bind()`.

Главный вопрос главы:

> Что отличается от `call()`?

Ответ:

```mermaid
flowchart TD
    N1["call()"]
    N2["chooses receiver"]
    N3["invokes immediately"]
    N4["bind()"]
    N5["chooses receiver"]
    N6["создает a new function for later invocation"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
    N4 --> N6
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что function object можно хранить в переменной;
* что `this` определяется формой invocation;
* что обычный `object.method()` выбирает объект выполнения из формы вызова;
* что `call()` позволяет явно выбрать объект выполнения;
* что `apply()` отличается от `call()` способом передачи arguments;
* что функция начинает выполнение только при invocation;
* что один function object можно использовать с разными объект выполненияs.

Не требуется знать constructors with `bind`, `new`, classes, decorators, polyfills или внутреннее устройство `Function.prototype.bind`. Эти темы будут изучаться позже.

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

Уровень сложности: **L4**.

`bind()` сложен не синтаксисом. Сложность в том, что он не вызывает функцию сразу. Он создает новую function, у которой объект выполнения уже выбран заранее.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/31-apply.md
```

Текущая глава:

```text
docs/01-javascript/32-bind.md
```

Следующая глава:

```text
docs/01-javascript/33-objects.md
```

Следующая глава начнет новый раздел и вернется к object значения уже глубже:

> Как устроены objects как основная форма группировки данных и поведения?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `bind()`;
* почему `bind()` не выполняет function сразу;
* что `bind()` создает новую function;
* что объект выполнения в bound function выбран заранее;
* чем `bind()` отличается от `call()` и `apply()`;
* как работает delayed invocation;
* зачем нужна reusable bound function;
* что такое partial arguments на высоком уровне;
* какие ошибки чаще всего встречаются;
* как `bind()` используется в Automation QA.

---

## Мотивация

Начнем с проблемы.

Есть validator:

```javascript
'use strict';

function validateStatus(path, actualStatus, expectedStatus) {
  const message = this.environment + ' ' + path;

  if (actualStatus !== expectedStatus) {
    return message + ' failed';
  }

  return message + ' passed';
}

const stagingConfig = {
  environment: 'staging'
};
```

Через `call()` можно явно выбрать объект выполнения:

```javascript
validateStatus.call(stagingConfig, '/users', 200, 200);
validateStatus.call(stagingConfig, '/orders', 201, 201);
validateStatus.call(stagingConfig, '/profile', 200, 200);
```

Это работает.

Но объект выполнения повторяется каждый раз:

```mermaid
flowchart TD
    N1["validateStatus.call(stagingConfig, ...)"]
    N2["validateStatus.call(stagingConfig, ...)"]
    N3["validateStatus.call(stagingConfig, ...)"]
    N4["same receiver again and again"]
    N3 --> N4
    N1 --> N2
    N2 --> N3
```

Проблема не в том, что `call()` плохой.

`call()` отлично подходит, когда объект выполнения нужен для одного конкретного invocation.

Проблема другая:

```mermaid
flowchart TD
    N1["Same receiver"]
    N2["many future invocations"]
    N3["repeating .call(receiver, ...)"]
    N4["noise in code"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Вопрос:

> Можно ли выбрать объект выполнения один раз и получить function, которую потом удобно вызывать?

`bind()` отвечает:

```text
yes
```

Зачем существует bind():

```mermaid
flowchart TD
    N1["Need explicit receiver"]
    N2["Need delayed invocation"]
    N3["Need reusable prepared function"]
    N4["bind()"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Центральная мысль:

```mermaid
flowchart TD
    N1["call()"]
    N2["choose receiver"]
    N3["invoke now"]
    N4["bind()"]
    N5["choose receiver"]
    N6["создать new function"]
    N7["invoke later"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 --> N7
```

---

## Теория

Не начинаем с определения. Сначала посмотрим на отличие поведения.

```javascript
const boundValidateStatus = validateStatus.bind(stagingConfig);
```

Эта строка не запускает `validateStatus`.

Она создает новую function:

```mermaid
flowchart TD
    N1["validateStatus"]
    N2[".bind(stagingConfig)"]
    N3["new function"]
    N4["boundValidateStatus"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Теперь новую function можно вызвать обычным образом:

```javascript
boundValidateStatus('/users', 200, 200);
boundValidateStatus('/orders', 201, 201);
```

При каждом таком вызове объект выполнения уже известен:

```mermaid
flowchart TD
    N1["boundValidateStatus('/users', 200, 200)"]
    N2["uses fixed receiver"]
    N3["this → stagingConfig"]
    N1 --> N2
    N2 --> N3
```

### Что такое `bind()`

`bind()` - это method function object, который создает новую function с заранее выбранным объект выполнения.

Важно:

```mermaid
flowchart TD
    N1["bind()"]
    N2["does not вызвать original function now"]
    N3["возвращает a new function"]
    N4["remembers selected receiver for future calls"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Синтаксис:

```javascript
const boundFunction = originalFunction.bind(receiver);
```

Модель:

```mermaid
flowchart TD
    N1["originalFunction"]
    N2["bind(receiver)"]
    N3["boundFunction"]
    N4["later invocation uses receiver"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### Что отличается от `call()`

`call()`:

```javascript
validateStatus.call(stagingConfig, '/users', 200, 200);
```

```mermaid
flowchart TD
    N1["Receiver selected"]
    N2["Arguments passed"]
    N3["Function выполняется immediately"]
    N4["Result returned now"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

`bind()`:

```javascript
const validateInStaging = validateStatus.bind(stagingConfig);
```

```mermaid
flowchart TD
    N1["Receiver selected"]
    N2["New function created"]
    N3["Nothing executed yet"]
    N4["Function can be called later"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### Что отличается от `apply()`

`apply()` решает задачу с ordered argument list:

```javascript
validateStatus.apply(stagingConfig, ['/users', 200, 200]);
```

```mermaid
flowchart TD
    N1["apply()"]
    N2["receiver: stagingConfig"]
    N3["arguments: array"]
    N4["invocation: now"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

`bind()` решает другую задачу:

```mermaid
flowchart TD
    N1["bind()"]
    N2["receiver: stagingConfig"]
    N3["new function: да"]
    N4["invocation: later"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

### Bound function

Function, созданная через `bind()`, часто называется bound function.

Это не новый тип значения отдельно от objects.

Функция в JavaScript - это function object. `bind()` возвращает новый function object, который можно вызвать.

```mermaid
flowchart TD
    N1["JavaScript values"]
    N2["Primitive values"]
    N3["Object values"]
    N4["Ordinary objects"]
    N5["Function objects"]
    N6["bound function is also a function object"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
```

### Привязанный объект выполнения

Receiver, переданный в `bind()`, становится заранее выбранным объект выполнения для будущих вызовов.

```mermaid
flowchart TD
    N1["bind(stagingConfig)"]
    N2["fixed receiver"]
    N3["future invocation"]
    N4["this → stagingConfig"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Ментальная модель: постоянный badge.

```mermaid
flowchart TD
    N1["Function object"]
    N2["receives permanent badge"]
    N3["&quot;I work with stagingConfig&quot;"]
    N1 --> N2
    N2 --> N3
```

### Delayed invocation

Delayed invocation означает:

```mermaid
flowchart TD
    N1["prepare function now"]
    N2["вызвать it later"]
    N1 --> N2
```

Это особенно полезно, когда function нужно передать дальше, сохранить в переменной или использовать много раз.

В этой главе мы не изучаем callbacks подробно. Callback - это function, которую передают другому коду для будущего вызова. Эта тема будет отдельной позже.

### Partial arguments

`bind()` может заранее фиксировать не только объект выполнения, но и первые arguments.

```javascript
const validateUsers = validateStatus.bind(stagingConfig, '/users');

console.log(validateUsers(200, 200));
```

Высокоуровневая модель:

```mermaid
flowchart TD
    N1["bind(receiver, firstArgument)"]
    N2["new function remembers:"]
    N3["receiver"]
    N4["first argument"]
    N5["later вызвать supplies remaining arguments"]
    N1 --> N2
    N2 --> N3
    N2 --> N4
    N2 --> N5
```

Подробные сценарии частичного применения arguments будут изучаться позже. Сейчас важно только увидеть, что `bind()` может подготовить function заранее.

---

## Внутренний механизм

Спросим главный вопрос главы:

> Что отличается от `call()`?

### Шаг 1. Есть исходная function

```javascript
function validateStatus(path, actualStatus, expectedStatus) {
  return this.environment + ' ' + path;
}
```

Концептуальное состояние:

```mermaid
flowchart TD
    N1["validateStatus"]
    N2["function object"]
    N3["can be invoked with different receivers"]
    N1 --> N2
    N2 --> N3
```

### Шаг 2. Вызывается `bind()`

```javascript
const validateInStaging = validateStatus.bind(stagingConfig);
```

Engine видит:

```mermaid
flowchart TD
    N1["function object"]
    N2["bind(receiver)"]
    N3["создать другой объект функции"]
    N1 --> N2
    N2 --> N3
```

### Шаг 3. Создается новая function

Это ключевой момент.

`bind()` не меняет исходную function.

```mermaid
flowchart TD
    N1["До: bind()"]
    N2["validateStatus"]
    N3["original function object"]
    N4["После: bind()"]
    N5["validateStatus"]
    N6["original function object"]
    N7["validateInStaging"]
    N8["new bound function object"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 --> N7
    N7 --> N8
```

### Шаг 4. Receiver фиксируется в новой function

```mermaid
flowchart TD
    N1["bound function"]
    N2["target function → validateStatus"]
    N3["fixed receiver → stagingConfig"]
    N1 --> N2
    N1 --> N3
```

Это концептуальная схема. Мы не изучаем внутренние слоты ECMAScript и точную реализацию engine.

### Шаг 5. Ничего не выполняется

После `bind()` тело исходной function еще не запускалось.

```mermaid
flowchart TD
    N1["validateStatus.bind(stagingConfig)"]
    N2["new function returned"]
    N3["тело функции not executed"]
    N1 --> N2
    N2 --> N3
```

Это ответ на частую ошибку:

> Почему `bind()` ничего не вывел в консоль?

Потому что `bind()` готовит function. Invocation будет позже.

### Шаг 6. Bound function вызывается позже

```javascript
validateInStaging('/users', 200, 200);
```

Теперь происходит invocation:

```mermaid
flowchart TD
    N1["validateInStaging(...)"]
    N2["uses target function validateStatus"]
    N3["uses fixed receiver stagingConfig"]
    N4["passes arguments"]
    N5["выполняется body"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

### Execution Context revisit

Когда bound function вызывается, JavaScript все равно создает Execution Context для выполнения function.

Но объект выполнения берется не из обычной формы вызова:

```mermaid
flowchart TD
    N1["Ordinary method call"]
    N2["receiver from object.method()"]
    N3["Bound вызов функции"]
    N4["receiver from bind()"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Концептуальное выполнение:

```mermaid
flowchart TD
    N1["validateInStaging('/users', 200, 200)"]
    N2["Function Execution Context"]
    N3["this → stagingConfig"]
    N4["path → '/users'"]
    N5["actualStatus → 200"]
    N6["expectedStatus → 200"]
    N1 --> N2
    N2 --> N3
    N2 --> N4
    N2 --> N5
    N2 --> N6
```

### Function identity

`bind()` возвращает новую function. Поэтому identity отличается.

```javascript
const first = validateStatus.bind(stagingConfig);
const second = validateStatus.bind(stagingConfig);

console.log(first === second);
```

Результат:

```text
false
```

Почему:

```mermaid
flowchart TD
    N1["first"]
    N2["bound function object #1"]
    N3["second"]
    N4["bound function object #2"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Receiver может быть тем же самым. Function objects все равно разные.

---

## Ментальная модель

`bind()` удобно понимать через preconfigured remote.

Обычная function:

```mermaid
flowchart TD
    N1["Remote control"]
    N2["needs receiver every time"]
    N1 --> N2
```

`call()`:

```mermaid
flowchart TD
    N1["Take remote"]
    N2["choose device now"]
    N3["press button now"]
    N1 --> N2
    N2 --> N3
```

`bind()`:

```mermaid
flowchart TD
    N1["Take remote"]
    N2["configure device once"]
    N3["save configured remote"]
    N4["press button later many times"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Еще одна модель: fixed driver.

```mermaid
flowchart TD
    N1["Car: тело функции"]
    N2["Driver: receiver"]
    N3["call()"]
    N4["assign driver for this trip only"]
    N5["bind()"]
    N6["assign fixed driver to prepared route"]
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N1 --> N2
```

Модель assigned employee:

```mermaid
flowchart TD
    N1["Task template"]
    N2["bind(employee)"]
    N3["prepared task"]
    N4["employee is known for every future выполнение"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Главное не перепутать:

```mermaid
flowchart TD
    N1["bind() does not выполнить work"]
    N2["bind() prepares work"]
    N1 --> N2
```

---

## Примеры кода

Примеры находятся в:

```text
examples/01-javascript/chapter-32/
```

Запуск:

```bash
node examples/01-javascript/chapter-32/01-basic-bind.js
node examples/01-javascript/chapter-32/02-bound-function.js
node examples/01-javascript/chapter-32/03-call-vs-bind.js
node examples/01-javascript/chapter-32/04-common-mistakes.js
node examples/01-javascript/chapter-32/05-qa-example.js
node examples/01-javascript/chapter-32/06-reusable-helper.js
```

### Пример 1. Basic bind

```javascript
'use strict';

function printEnvironment() {
  console.log(this.environment);
}

const stagingConfig = {
  environment: 'staging'
};

const printStagingEnvironment = printEnvironment.bind(stagingConfig);

printStagingEnvironment();
```

Что делает engine:

```mermaid
flowchart TD
    N1["printEnvironment.bind(stagingConfig)"]
    N2["создать bound function"]
    N3["printStagingEnvironment()"]
    N4["this → stagingConfig"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### Пример 2. Bound function

```javascript
'use strict';

function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const buildApiUrl = buildUrl.bind(apiClient);

console.log(buildApiUrl('/users'));
console.log(buildApiUrl('/orders'));
```

Одна подготовленная function используется несколько раз.

```mermaid
flowchart TD
    N1["buildApiUrl"]
    N2["fixed receiver → apiClient"]
    N3["reusable calls → many paths"]
    N1 --> N2
    N1 --> N3
```

### Пример 3. call vs bind

```javascript
'use strict';

function formatStatus(path, status) {
  return this.environment + ' ' + path + ' ' + status;
}

const config = {
  environment: 'staging'
};

console.log(formatStatus.call(config, '/users', 200));

const formatStagingStatus = formatStatus.bind(config);
console.log(formatStagingStatus('/orders', 201));
```

Сравнение:

```mermaid
flowchart TD
    N1["call()"]
    N2["результат сейчас"]
    N3["bind()"]
    N4["функция сейчас, результат позже"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Пример 4. Типичные ошибки

```javascript
'use strict';

function printBaseUrl() {
  console.log(this.baseUrl);
}

const client = {
  baseUrl: 'https://api.example.test'
};

const preparedPrint = printBaseUrl.bind(client);

console.log('After bind');
preparedPrint();
```

`bind()` не выводит `baseUrl`. Вывод происходит только при вызове `preparedPrint()`.

### Пример 5. QA example

```javascript
'use strict';

function validateResponse(path, actualStatus, expectedStatus) {
  const prefix = this.project + ' ' + this.environment;

  if (actualStatus === expectedStatus) {
    return prefix + ' ' + path + ' passed';
  }

  return prefix + ' ' + path + ' failed';
}

const qaConfig = {
  project: 'billing',
  environment: 'staging'
};

const validateBillingStaging = validateResponse.bind(qaConfig);

console.log(validateBillingStaging('/invoices', 200, 200));
console.log(validateBillingStaging('/payments', 500, 200));
```

QA смысл:

```mermaid
flowchart TD
    N1["One validator"]
    N2["one config bound once"]
    N3["many endpoint checks"]
    N1 --> N2
    N2 --> N3
```

### Пример 6. Reusable helper

```javascript
'use strict';

function createReportLine(testName, status) {
  return this.suite + ': ' + testName + ' -> ' + status;
}

const smokeSuite = {
  suite: 'smoke'
};

const createSmokeReportLine = createReportLine.bind(smokeSuite);

console.log(createSmokeReportLine('login', 'passed'));
console.log(createSmokeReportLine('checkout', 'failed'));
```

Такой helper удобно передавать или использовать повторно без постоянного `.call(smokeSuite, ...)`.

---

## Частые вопросы

### `bind()` вызывает функцию?

Нет.

```mermaid
flowchart TD
    N1["bind()"]
    N2["возвращает new function"]
    N3["does not выполнить target function immediately"]
    N1 --> N2
    N2 --> N3
```

Вызов происходит позже, когда вызывается returned function.

### `bind()` меняет исходную function?

Нет.

```mermaid
flowchart TD
    N1["original function"]
    N2["remains original"]
    N3["bound function"]
    N4["new function object"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Можно ли вызвать bound function много раз?

Да.

Именно поэтому `bind()` полезен:

```mermaid
flowchart TD
    N1["configure once"]
    N2["invoke many times"]
    N1 --> N2
```

### Чем `bind()` отличается от `call()`?

```mermaid
flowchart TD
    N1["call()"]
    N2["invoke immediately"]
    N3["bind()"]
    N4["создать function for later invocation"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Чем `bind()` отличается от `apply()`?

`apply()` вызывает function сразу и передает arguments через array или array-like collection.

`bind()` возвращает новую function и откладывает invocation.

---

## Распространенные мифы

### Миф: `bind()` просто устанавливает `this` внутри существующей function

Реальность:

```mermaid
flowchart TD
    N1["bind()"]
    N2["создает new function object"]
    N3["with fixed receiver"]
    N1 --> N2
    N2 --> N3
```

Исходная function остается доступной как раньше.

### Миф: после `bind()` объект выполнения можно легко заменить обычным вызовом

Реальность:

```mermaid
flowchart TD
    N1["bound function"]
    N2["uses receiver selected by bind()"]
    N1 --> N2
```

В этой главе достаточно помнить: объект выполнения выбран заранее. Продвинутые особенности с constructors будут изучаться позже.

### Миф: `bind()` нужен только для detached functions

Реальность:

Detached function - один полезный сценарий.

Более общая идея:

```mermaid
flowchart TD
    N1["bind()"]
    N2["explicit receiver selection"]
    N3["prepared for future calls"]
    N1 --> N2
    N2 --> N3
```

---

## Типичные ошибки

### Ошибка 1. Ожидать немедленного выполнения

Неправильно:

```javascript
const result = validateStatus.bind(stagingConfig);
console.log(result);
```

Что произошло:

```mermaid
flowchart TD
    N1["результат"]
    N2["function object"]
    N1 --> N2
```

`result` - это function, а не результат выполнения validation.

Исправление:

```javascript
const validateInStaging = validateStatus.bind(stagingConfig);
const result = validateInStaging('/users', 200, 200);
console.log(result);
```

### Ошибка 2. Создавать bound function и не сохранять ее

Неправильно:

```javascript
validateStatus.bind(stagingConfig);
validateStatus('/users', 200, 200);
```

`bind()` вернул новую function, но она потерялась.

Исправление:

```javascript
const validateInStaging = validateStatus.bind(stagingConfig);
validateInStaging('/users', 200, 200);
```

### Ошибка 3. Думать, что `bind()` меняет original function

Неправильная модель:

```mermaid
flowchart TD
    N1["original function"]
    N2["modified by bind()"]
    N1 --> N2
```

Правильная модель:

```mermaid
flowchart TD
    N1["original function"]
    N2["unchanged"]
    N3["bound function"]
    N4["new function"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Ошибка 4. Скрывать намерение

Иногда `bind()` ухудшает читаемость, если объект выполнения нужен только один раз.

```javascript
const once = validateStatus.bind(stagingConfig);
console.log(once('/users', 200, 200));
```

Если invocation одноразовый, `call()` может быть понятнее:

```javascript
console.log(validateStatus.call(stagingConfig, '/users', 200, 200));
```

---

## Практическое использование

`bind()` полезен, когда есть:

```mermaid
flowchart TD
    N1["same receiver"]
    N2["many future calls"]
    N1 --> N2
```

Типичные случаи:

* заранее настроенный formatter;
* reusable validator;
* helper, привязанный к configuration object;
* function, которую нужно передать дальше без потери объект выполнения;
* подготовленная операция для конкретной среды.

Сравнение:

```mermaid
flowchart TD
    N1["Need one invocation?"]
    N2["call() or apply()"]
    N3["Need reusable prepared function?"]
    N4["bind()"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Модель читаемости:

```mermaid
flowchart TD
    N1["Repeated .call(config, ...)"]
    N2["receiver noise"]
    N3["bind once"]
    N4["clear helper name"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Пример именования:

```javascript
const validateStagingResponse = validateResponse.bind(stagingConfig);
```

Такое имя говорит:

```text
this helper validates staging responses
```

---

## Использование в Automation QA

В Automation QA `bind()` встречается там, где helper должен работать с заранее выбранным context object.

### Reusable validators

```javascript
'use strict';

function validateStatus(path, actualStatus, expectedStatus) {
  return this.environment + ' ' + path + ': ' + (actualStatus === expectedStatus);
}

const staging = {
  environment: 'staging'
};

const validateStagingStatus = validateStatus.bind(staging);
```

Модель:

```mermaid
flowchart TD
    N1["validateStatus"]
    N2["bind(staging)"]
    N3["validateStagingStatus"]
    N4["used across many tests"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### Assertion helpers

Helper может использовать configuration:

```mermaid
flowchart TD
    N1["assert helper"]
    N2["suite name"]
    N3["environment"]
    N4["reporting prefix"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Вместо того чтобы передавать config каждый раз, можно подготовить bound helper.

### API client helpers

API client method может зависеть от `baseUrl`.

```mermaid
flowchart TD
    N1["client method"]
    N2["needs receiver with baseUrl"]
    N3["bind(client)"]
    N4["safe reusable helper"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### Page Object helpers

В будущих главах про Automation QA мы будем изучать Page Object подробно. Сейчас достаточно одной идеи:

```mermaid
flowchart TD
    N1["method uses object state"]
    N2["detached usage can lose receiver"]
    N3["bind can prepare stable helper"]
    N1 --> N2
    N2 --> N3
```

### Configuration binding

Для разных окружений можно подготовить разные helpers:

```mermaid
flowchart TD
    N1["validateResponse"]
    N2["bind(stagingConfig) → validateStaging"]
    N3["bind(prodConfig) → validateProd"]
    N1 --> N2
    N1 --> N3
```

Это делает тестовый код выразительнее:

```text
validateStaging('/users', 200, 200)
validateProd('/health', 200, 200)
```

---

## Диаграммы главы

### 1. Why bind() exists

```mermaid
flowchart TD
    N1["Same receiver"]
    N2["many future invocations"]
    N3["need prepared function"]
    N4["bind()"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### 2. call vs bind

```mermaid
flowchart TD
    N1["call()"]
    N2["select receiver"]
    N3["invoke now"]
    N4["bind()"]
    N5["select receiver"]
    N6["вернуть new function"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
    N4 --> N6
```

### 3. apply vs bind

```mermaid
flowchart TD
    N1["apply()"]
    N2["receiver"]
    N3["array arguments"]
    N4["invoke now"]
    N5["bind()"]
    N6["receiver"]
    N7["invoke later"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N5 --> N6
    N5 --> N7
```

### 4. New function creation

```mermaid
flowchart TD
    N1["original function"]
    N2[".bind(receiver)"]
    N3["new function object"]
    N1 --> N2
    N2 --> N3
```

### 5. Receiver fixing

```mermaid
flowchart TD
    N1["bound function"]
    N2["fixed receiver → config"]
    N1 --> N2
```

### 6. Delayed invocation

```mermaid
flowchart TD
    N1["bind now"]
    N2["store function"]
    N3["invoke later"]
    N1 --> N2
    N2 --> N3
```

### 7. Function factory

```mermaid
flowchart TD
    N1["function template"]
    N2["bind(config)"]
    N3["configured function"]
    N1 --> N2
    N2 --> N3
```

### 8. Текущая модель JavaScript

```mermaid
flowchart TD
    N1["Functions"]
    N2["declaration"]
    N3["expression"]
    N4["arrow"]
    N5["параметры"]
    N6["return"]
    N7["closure"]
    N8["this"]
    N9["call"]
    N10["apply"]
    N11["bind"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N1 --> N6
    N1 --> N7
    N1 --> N8
    N1 --> N9
    N1 --> N10
    N1 --> N11
```

### 9. Receiver timeline

```mermaid
flowchart TD
    N1["bind()"]
    N2["receiver selected"]
    N3["later call"]
    N4["receiver used"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### 10. Invocation timeline

```mermaid
flowchart TD
    N1["создать bound function"]
    N2["wait"]
    N3["вызвать bound function"]
    N4["выполнить target"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### 11. Bound function

```mermaid
flowchart TD
    N1["bound function"]
    N2["target function"]
    N3["fixed receiver"]
    N4["future arguments"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

### 12. Receiver comparison

```mermaid
flowchart TD
    N1["ordinary call → receiver from вызвать form"]
    N2["call() → receiver from first argument"]
    N3["apply() → receiver from first argument"]
    N4["bind() → receiver from earlier binding"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### 13. Execution Context revisit

```mermaid
flowchart TD
    N1["boundFunction()"]
    N2["Function Execution Context"]
    N3["this from bind()"]
    N1 --> N2
    N2 --> N3
```

### 14. Типичные ошибки

```mermaid
flowchart TD
    N1["bind()"]
    N2["возвращает function"]
    N3["не результат"]
    N1 --> N2
    N2 --> N3
```

### 15. Читаемость

```mermaid
flowchart TD
    N1["many .call(config, ...)"]
    N2["bind once"]
    N3["named helper"]
    N1 --> N2
    N2 --> N3
```

### 16. QA helper example

```mermaid
flowchart TD
    N1["validateResponse"]
    N2["bind(stagingConfig)"]
    N3["validateStagingResponse"]
    N1 --> N2
    N2 --> N3
```

### 17. Reusable validator

```mermaid
flowchart TD
    N1["one validator"]
    N2["/users"]
    N3["/orders"]
    N4["/profile"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

### 18. Preconfigured helper

```mermaid
flowchart TD
    N1["helper"]
    N2["configuration saved by bind"]
    N3["ready helper"]
    N1 --> N2
    N2 --> N3
```

### 19. Bound объект выполнения

```mermaid
flowchart TD
    N1["receiver"]
    N2["attached to возвращенная функция"]
    N3["used on invocation"]
    N1 --> N2
    N2 --> N3
```

### 20. Function identity

```mermaid
flowchart TD
    N1["bind()"]
    N2["bound function #1"]
    N3["bound function #2"]
    N4["#1 !== #2"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

### 21. Краткая ментальная модель

```mermaid
flowchart TD
    N1["permanent badge"]
    N2["fixed driver"]
    N3["saved configuration"]
    N1 --> N2
    N2 --> N3
```

### 22. Complete bind model

```mermaid
flowchart TD
    N1["original function"]
    N2["bind(receiver)"]
    N3["bound function"]
    N4["later invocation"]
    N5["target function runs with receiver"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

### 23. Переход к object methods

```mermaid
flowchart TD
    N1["object method"]
    N2["function stored in property"]
    N3["receiver matters"]
    N1 --> N2
    N2 --> N3
```

Objects will be studied in more detail in the next section.

### 24. Переход к callbacks

```mermaid
flowchart TD
    N1["prepared function"]
    N2["can be passed somewhere"]
    N3["called later"]
    N1 --> N2
    N2 --> N3
```

Callbacks will be studied later.

### 25. Function lifecycle

```mermaid
flowchart TD
    N1["declare function"]
    N2["bind receiver"]
    N3["store bound function"]
    N4["invoke bound function"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### 26. Receiver persistence

```mermaid
flowchart TD
    N1["selected once"]
    N2["available for every future call"]
    N1 --> N2
```

### 27. One-time configuration

```mermaid
flowchart TD
    N1["configuration object"]
    N2["bind once"]
    N3["reuse many times"]
    N1 --> N2
    N2 --> N3
```

### 28. call/apply/bind comparison

```mermaid
flowchart TD
    N1["call → receiver + separate args + now"]
    N2["apply → receiver + array args + now"]
    N3["bind → receiver + new function + later"]
    N1 --> N2
    N2 --> N3
```

### 29. Complete объект выполнения picture

```mermaid
flowchart TD
    N1["this"]
    N2["ordinary invocation"]
    N3["call()"]
    N4["apply()"]
    N5["bind()"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
```

### 30. Итоговая схема

```mermaid
flowchart TD
    N1["Need receiver for one call?"]
    N2["separate args → call()"]
    N3["array args → apply()"]
    N4["Need receiver for future calls?"]
    N5["bind()"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

---

## Практика

Практика находится в:

```text
practice/01-javascript/32-bind.md
```

Рекомендуемый порядок:

```text
1. Ответить на концептуальные вопросы.
2. Предсказать вывод кода.
3. Запустить examples/01-javascript/chapter-32/.
4. Выполнить debugging tasks.
5. Сделать QA mini-project.
6. Свериться с solutions/01-javascript/32-bind.md.
```

---

## Решения

Решения находятся в:

```text
solutions/01-javascript/32-bind.md
```

Не открывайте решения до самостоятельной попытки. В этой теме особенно важно самому различить:

```mermaid
flowchart TD
    N1["function returned by bind"]
    N2["≠"]
    N3["result returned by function выполнение"]
    N1 --> N2
    N2 --> N3
```

---

## Итоги

`bind()` завершает цепочку:

```mermaid
flowchart TD
    N1["this"]
    N2["call()"]
    N3["apply()"]
    N4["bind()"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Теперь модель объект выполнения стала полной на базовом уровне:

```mermaid
flowchart TD
    N1["Ordinary invocation"]
    N2["invocation form chooses receiver"]
    N3["call()"]
    N4["developer chooses receiver and invokes now"]
    N5["apply()"]
    N6["developer chooses receiver and passes arguments as array"]
    N7["bind()"]
    N8["developer chooses receiver and создает function for later"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
    N5 --> N7
    N7 --> N8
```

Главное отличие `bind()`:

```text
bind() returns a function
```

Он не выполняет исходную function сразу.

---

## Что нужно запомнить

* `bind()` нужен для явного выбора объект выполнения заранее.
* `bind()` создает новую function.
* `bind()` не вызывает исходную function немедленно.
* Bound function можно вызвать позже.
* Receiver в bound function выбран заранее.
* `call()` и `apply()` выполняют invocation сразу.
* `bind()` удобен, когда один объект выполнения нужен для многих будущих вызовов.
* `bind()` не изменяет original function.
* Каждый вызов `bind()` создает новый function object.
* Partial arguments возможны, но в этой главе это только высокоуровневая идея.

---

## Проверьте себя

Ответьте без запуска кода.

1. Что возвращает `bind()`?
2. Выполняет ли `bind()` исходную function сразу?
3. Чем `bind()` отличается от `call()`?
4. Чем `bind()` отличается от `apply()`?
5. Почему два вызова `sameFunction.bind(объект выполнения)` создают разные значения?
6. Когда `bind()` улучшает читаемость?
7. Почему объект выполнения в bound function считается заранее выбранным?
8. Что произойдет, если вызвать `bind()` и не сохранить результат?
9. Как `bind()` может помочь в Automation QA helper?
10. Какая следующая тема логически продолжает этот раздел?
