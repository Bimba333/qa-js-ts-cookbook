# call()

## Связь с предыдущей главой

Предыдущая глава объяснила `this`.

Главная модель была такой:

Для обычного вызова `object.method()` объект выполнения обычно выбирается из формы вызова.

Но detached function теряет объект выполнения:

```javascript
'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};

const buildUrl = apiClient.buildUrl;

buildUrl('/users');
```

Здесь вызов идет как standalone function:

Теперь появляется следующий вопрос:

> Можно ли выбрать объект выполнения вручную?

Да. Для этого существует `call()`.

Главный вопрос главы:

> Кто выбирает объект выполнения теперь?

---

## Предварительные требования

Для этой главы нужно понимать:

* что function object можно хранить в переменной;
* что object может хранить methods;
* что `this` определяется во время invocation;
* что обычный вызов `object.method()` выбирает объект выполнения из формы вызова;
* что detached function теряет объект выполнения;
* что parameters получают arguments по позиции;
* что `return` отправляет результат из функции.

Не требуется знать `apply()`, `bind()`, constructors, classes, `Reflect.apply()`, decorators или proxies. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            120-150 минут
Разбор схем:             45-65 минут
Запуск примеров:         20-30 минут
Практика:                100-130 минут
Повторение материала:    25 минут
```

Уровень сложности: **L4**.

`call()` выглядит как небольшой method, но концептуально это важный поворот: объект выполнения выбирает не форма обычного вызова, а разработчик.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/29-this.md
```

Текущая глава:

```text
docs/01-javascript/30-call.md
```

Следующая глава:

```text
docs/01-javascript/31-apply.md
```

Следующая глава ответит:

> Как передать arguments в ручной invocation, если они уже лежат в array?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `call()`;
* что такое manual объект выполнения selection;
* как `call(объект выполнения)` выбирает `this`;
* как передавать arguments через `call()`;
* как `call()` заменяет ordinary invocation;
* как `call()` помогает в ситуации с detached function;
* как один function object использовать с разными объект выполненияs;
* какие ошибки чаще всего встречаются;
* когда `call()` улучшает читаемость;
* как `call()` может применяться в Automation QA.

---

## Мотивация

Начнем с проблемы, где необходимость явного выбора объект выполнения видна особенно хорошо.

Есть helper object:

```javascript
'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};
```

Обычный method call работает:

```javascript
apiClient.buildUrl('/users');
```

Но если method detached:

```javascript
const buildUrl = apiClient.buildUrl;
```

то обычный вызов теряет объект выполнения:

```javascript
buildUrl('/users');
```

Detached function:

Потерянный объект выполнения:

Вопрос:

> Если ordinary invocation не выбрала объект выполнения, можем ли мы выбрать его сами?

`call()` отвечает:

```text
yes
```

Явный выбор объекта выполнения:

---

## Теория

### Зачем существует call()

`call()` существует для ручного вызова function object с явно указанным объект выполнения.

Обычный вызов:

```javascript
apiClient.buildUrl('/users');
```

Receiver выбирается из обычной формы вызова:

Вызов через `call()`:

```javascript
buildUrl.call(apiClient, '/users');
```

Receiver выбирает разработчик:

Зачем существует `call()`:

Центральная модель:

---

### call(объект выполнения)

Минимальная форма:

```javascript
function printBaseUrl() {
  console.log(this.baseUrl);
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

printBaseUrl.call(apiClient);
```

call() syntax:

Manual invocation:

Receiver replacement:

Главный вопрос:

> Кто выбирает объект выполнения теперь?

Ответ:

```text
developer
```

---

### Passing arguments

`call()` выбирает объект выполнения первым argument.

Остальные arguments передаются в вызываемую function.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.call(apiClient, '/users'));
```

Передача аргументов:

Если parameters несколько:

```javascript
function formatRequest(method, path) {
  return method + ' ' + this.baseUrl + path;
}

const usersApi = {
  baseUrl: 'https://api.example.test'
};

console.log(formatRequest.call(usersApi, 'GET', '/users'));
```

Arguments поток:

Важно:

---

### Replacing ordinary invocation

`call()` может выразить тот же объект выполнения, что и обычный method call.

```javascript
apiClient.buildUrl('/users');
```

Можно записать так:

```javascript
apiClient.buildUrl.call(apiClient, '/users');
```

Invocation comparison:

Before call():

After call():

Это не значит, что обычные method calls нужно заменять на `call()`. Обычно `object.method()` читается лучше.

`call()` нужен, когда объект выполнения нужно выбрать явно.

---

### Detached functions

Detached function - один из самых понятных случаев, где `call()` оказывается полезен.

Но важно не сужать модель:

```javascript
'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};

const buildUrl = apiClient.buildUrl;

console.log(buildUrl.call(apiClient, '/users'));
```

Явный выбор объекта выполнения:

Receiver поток:

`call()` не приклеивает объект выполнения к функции навсегда.

Следующий вызов может выбрать другой объект выполнения.

---

### Same function, different объект выполнения

Один function object можно вызвать с разными объект выполненияs.

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const usersApi = {
  baseUrl: 'https://users.example.test'
};

const ordersApi = {
  baseUrl: 'https://orders.example.test'
};

console.log(buildUrl.call(usersApi, '/list'));
console.log(buildUrl.call(ordersApi, '/list'));
```

Same function, different объект выполнения:

Объект функции:

Это особенно полезно, когда поведение общий, а configuration хранится в разных objects.

---

## Внутренний механизм

### Что происходит при call()

В обычном method call объект выполнения выбирается из формы invocation, которую мы изучали в предыдущей главе.

При `call()` объект выполнения передается явно.

call lifecycle:

Execution Context revisit:

`call()` не меняет function body.

---

### call() vs ordinary invocation

call vs ordinary invocation:

Выбор объекта выполнения:

Явный выбор объекта выполнения:

Именно поэтому вопрос главы звучит так:

> Кто выбирает объект выполнения теперь?

---

### Timeline

Временная шкала:

Manual invocation временная шкала:

Полная модель call():

---

## Ментальная модель

### Ручное управление

Обычный вызов похож на автоматический выбор объект выполнения.

`call()` похож на manual steering.

Manual steering:

---

### Remote control

Представьте function object как устройство, а объект выполнения как выбранный target.

`call()` говорит:

Remote control model:

---

### Selecting a speaker

В главе про `this` была модель current speaker.

`call()` выбирает speaker вручную.

Choosing an actor:

Function body - это script.

Receiver - это actor, который исполняет script в данном вызове.

---

### Краткая ментальная модель

Итоговая схема:

---

### Текущее место в модели JavaScript

Переход к apply():

`apply()` решает похожую задачу, но с другой формой передачи arguments. Подробности будут в следующей главе.

---

## Примеры кода

Примеры находятся в папке:

```text
examples/01-javascript/chapter-30/
```

Запуск:

```bash
node examples/01-javascript/chapter-30/01-basic-call.js
node examples/01-javascript/chapter-30/02-detached-method.js
node examples/01-javascript/chapter-30/03-call-with-arguments.js
node examples/01-javascript/chapter-30/04-reusing-methods.js
node examples/01-javascript/chapter-30/05-common-mistakes.js
node examples/01-javascript/chapter-30/06-qa-example.js
```

### Basic call

```javascript
function printBaseUrl() {
  console.log(this.baseUrl);
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

printBaseUrl.call(apiClient);
```

Что происходит:

---

### Detached method

```javascript
'use strict';

const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};

const buildUrl = apiClient.buildUrl;

console.log(buildUrl.call(apiClient, '/users'));
```

Явный выбор объекта выполнения:

---

### call with arguments

```javascript
function formatRequest(method, path) {
  return method + ' ' + this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(formatRequest.call(apiClient, 'GET', '/users'));
```

Передача аргументов:

---

## Частые вопросы

### call() создает новую функцию?

Нет. `call()` сразу вызывает existing function object.

`bind()` будет изучаться позже. Он решает связанную, но другую задачу.

### call() меняет this навсегда?

Нет. `call()` выбирает объект выполнения только для одного invocation.

### Первый argument call() становится обычным parameter?

Нет. Первый argument `call()` становится `this`.

Обычные parameters получают arguments, которые идут после объект выполнения.

### Нужно ли заменять все method calls на call()?

Нет. Если обычный `object.method()` читается ясно, он обычно лучше. `call()` нужен, когда объект выполнения надо выбрать явно.

### Чем call() отличается от apply()?

Обе темы связаны с ручным объект выполнения. В этой главе изучается `call()`, где arguments передаются по одному. `apply()` будет изучаться в следующей главе.

---

## Распространенные мифы

### Миф 1. call() нужен только для исправления ошибок

Реальность: `call()` является общим механизмом явного выбора объект выполнения. Detached function - один из случаев, где этот механизм особенно заметен.

### Миф 2. call() permanently привязывает this

Реальность:

Постоянное связывание объект выполнения будет изучаться позже в главе `bind()`.

### Миф 3. call() и apply() - одно и то же

Реальность: они решают похожие задачи, но отличаются способом передачи arguments. Подробно `apply()` будет изучен в следующей главе.

---

## Типичные ошибки

### Ошибка 1. Забыть первый argument объект выполнения

Неправильный код:

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

buildUrl.call('/users');
```

Что произошло:

Почему это произошло:

Исправленный вариант:

```javascript
buildUrl.call(apiClient, '/users');
```

---

### Ошибка 2. Думать, что call() сохраняет объект выполнения навсегда

```javascript
function getBaseUrl() {
  return this.baseUrl;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

getBaseUrl.call(apiClient);
getBaseUrl();
```

Первый вызов выбирает объект выполнения manually.

Второй вызов снова standalone.

---

### Ошибка 3. Путать объект выполнения и normal arguments

```javascript
function validateStatus(response) {
  return response.status === this.expectedStatus;
}

const assertionConfig = {
  expectedStatus: 200
};

const response = {
  status: 200
};

validateStatus.call(response, assertionConfig);
```

Что произошло:

Исправленный вариант:

```javascript
validateStatus.call(assertionConfig, response);
```

Типичные ошибки:

---

## Практическое использование

`call()` полезен, когда function object уже есть, но объект выполнения нужно выбрать явно.

Практическое использование:

Пример:

```javascript
function validateStatus(response) {
  return response.status === this.expectedStatus;
}

const okAssertion = {
  expectedStatus: 200
};

const createdAssertion = {
  expectedStatus: 201
};

console.log(validateStatus.call(okAssertion, { status: 200 }));
console.log(validateStatus.call(createdAssertion, { status: 200 }));
```

Читаемость:

`call()` должен улучшать понимание механизма, а не превращать код в головоломку.

---

## Использование в Automation QA

### Reusable assertion helpers

Один validator можно использовать с разными assertion configs.

```javascript
function statusMatches(response) {
  return response.status === this.expectedStatus;
}

const okConfig = {
  expectedStatus: 200
};

const serverErrorConfig = {
  expectedStatus: 500
};
```

Пример QA-helper:

---

### API client methods

Если API client method оказался detached, `call()` позволяет явно выбрать нужный config object как объект выполнения.

Это полезно для понимания механизма, хотя в обычном production-коде чаще читается прямой method call:

```text
stagingClient.buildUrl('/users')
```

---

### Helper reuse

`call()` может помочь переиспользовать общий helper с разными configuration objects.

Для Automation QA это может встречаться в:

* reusable assertion helpers;
* API client utilities;
* configuration objects;
* shared validators;
* debugging detached methods.

При этом главное назначение `call()` шире:

Важно: не строить всю архитектуру вокруг `call()` без причины. В большинстве случаев ясные objects и methods читаются лучше.

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/30-call.md
```

Выполняйте задания после запуска примеров из `examples/01-javascript/chapter-30/`.

Главный вопрос практики:

```text
Who chooses the receiver?
```

---

## Решения

Файл с решениями:

```text
solutions/01-javascript/30-call.md
```

В решениях важно смотреть не только на результат, но и на объект выполнения поток:

---

## Итоги

`call()` вводит ручной выбор объект выполнения.

Итоговая модель:

Полная модель call():

`call()` вызывает function immediately и выбирает объект выполнения только для этого invocation.

Следующая глава про `apply()` покажет похожую идею, но arguments будут передаваться иначе.

---

## Что нужно запомнить

* `call()` вызывает function object immediately.
* Первый argument `call()` становится `this`.
* Остальные arguments передаются в function parameters.
* `call()` выбирает объект выполнения только для одного invocation.
* `call()` помогает в ситуации с detached function, но не сводится к ней.
* `call()` не заменяет обычные method calls там, где `object.method()` читается лучше.
* `apply()` будет изучаться в следующей главе и продолжит тему manual объект выполнения selection.

Краткая ментальная модель:

---

## Проверьте себя

Ответьте без запуска кода:

1. Кто выбирает объект выполнения при ordinary invocation?
2. Кто выбирает объект выполнения при `call()`?
3. Что становится `this` в `buildUrl.call(apiClient, '/users')`?
4. Что получает parameter `path` в `buildUrl.call(apiClient, '/users')`?
5. Почему `call()` не сохраняет объект выполнения навсегда?
6. Почему `apply()` логически продолжает эту тему?
