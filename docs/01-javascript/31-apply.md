# apply()

## Связь с предыдущей главой

Предыдущая глава объяснила `call()`.

Главная модель была такой:

В `call()` объект выполнения передается первым argument:

Теперь появляется следующий вопрос:

> Что делать, если arguments уже лежат в одном array?

Например, function ожидает отдельные parameters:

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}
```

Но данные уже подготовлены как array:

```javascript
const requestParts = ['POST', '/users', '{"name":"Anna"}'];
```

Главный вопрос этой главы:

> Что изменилось по сравнению с `call()`?

Ответ:

---

## Предварительные требования

Для этой главы нужно понимать:

* что `this` - объект выполнения текущего invocation;
* что `call()` позволяет явно выбрать объект выполнения;
* что первый argument `call()` становится `this`;
* что остальные arguments в `call()` передаются в parameters по позиции;
* что array хранит значения по порядку;
* что parameters получают значения по позиции.

Не требуется знать Spread syntax replacement, `Reflect.apply()`, `bind()`, constructors, classes, `arguments` object internals или proxies. Эти темы будут изучаться позже.

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

`apply()` легко запомнить как "`call()`, но с array". Но для понимания этого мало. Важно увидеть проблему: объект выполнения выбирается так же, а arguments уже лежат в одном ordered argument list.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/30-call.md
```

Текущая глава:

```text
docs/01-javascript/31-apply.md
```

Следующая глава:

```text
docs/01-javascript/32-bind.md
```

Следующая глава ответит:

> Как создать новую function с заранее выбранным объект выполнения?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `apply()`;
* почему `apply()` решает проблему передачи arguments;
* почему объект выполнения selection у `call()` и `apply()` одинаковый;
* как array значения попадают в parameters;
* что такое array-like collections на высоком уровне;
* чем `call()` отличается от `apply()`;
* когда `apply()` может быть удобнее `call()`;
* какие ошибки чаще всего встречаются;
* как `apply()` применим в Automation QA;
* почему `bind()` логически продолжает эту тему.

---

## Мотивация

Начнем с проблемы.

Есть function:

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}
```

Она ожидает три отдельных arguments:

Но test data уже подготовлены как array:

```javascript
const requestParts = ['POST', '/users', '{"name":"Anna"}'];
```

Packaged arguments:

Через `call()` пришлось бы вручную распаковать значения:

```javascript
formatRequest.call(apiClient, requestParts[0], requestParts[1], requestParts[2]);
```

Это работает, но плохо выражает намерение.

Проблема:

Зачем существует apply():

Центральная мысль:

---

## Теория

### Зачем существует apply()

`apply()` существует для вызова function object с явно выбранным объект выполнения и arguments, переданными как array или array-like collection.

```javascript
formatRequest.apply(apiClient, requestParts);
```

Полная модель apply():

Объект выполнения тот же:

Arguments differ:

`apply()` решает не новую проблему объект выполнения.

Он решает проблему формы arguments.

---

### Receiver selection

Receiver в `apply()` работает так же, как в `call()`.

```javascript
function getBaseUrl() {
  return this.baseUrl;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(getBaseUrl.apply(apiClient));
```

Receiver поток:

Same объект выполнения:

Главный вопрос для объект выполнения:

```text
Who becomes this?
```

Ответ одинаковый:

---

### Arguments from array

Главное отличие `apply()` - второй argument.

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const requestParts = ['POST', '/users', '{"name":"Anna"}'];

console.log(formatRequest.apply(apiClient, requestParts));
```

Array to parameters:

Сопоставление параметров:

Array expansion concept:

Мы не объясняем Spread syntax заново. В современном JavaScript часто встречаются альтернативные формы передачи array значения, но в этой главе важно понять сам механизм `apply()`.

---

### Array-like collections

`apply()` исторически полезен не только с arrays, но и с array-like collections.

На высоком уровне:

Array-like collections:

Мы не разбираем `arguments` object internals. Это отдельная тема. Сейчас достаточно понимать:

---

### call() vs apply()

Сравним на одном примере.

```javascript
function validateRequest(status, path, body) {
  return this.expectedStatus === status &&
    path === this.expectedPath &&
    body !== '';
}
```

Через `call()`:

```javascript
validateRequest.call(config, 200, '/users', '{"name":"Anna"}');
```

Через `apply()`:

```javascript
const requestData = [200, '/users', '{"name":"Anna"}'];

validateRequest.apply(config, requestData);
```

call/apply comparison:

Different argument passing:

Объект выполнения тот же:

---

## Внутренний механизм

### Invocation lifecycle

Разберем:

```javascript
formatRequest.apply(apiClient, requestParts);
```

Жизненный цикл вызова:

Выполнение функции:

Receiver поток:

Arguments поток:

---

### Function object

Как и `call()`, `apply()` вызывается у function object.

Объект функции:

Мы не углубляемся в prototype mechanics. Prototype будет изучаться позже. Сейчас важно только:

---

### Timeline

Временная шкала:

Complete объект выполнения model:

Итоговая схема:

---

## Ментальная модель

### Tray with prepared items

Представьте, что arguments уже лежат на подносе.

`call()` требует передавать items по одному.

```text
call(receiver, method, path, body)
```

`apply()` принимает весь tray.

```text
apply(receiver, tray)
```

Tray model:

---

### Package of arguments

`apply()` можно представить как delivery box.

Function получает не box целиком в первый parameter, а items из box по positions.

Envelope containing arguments:

---

### Краткая ментальная модель

Читаемость:

Не нужно превращать `apply()` в механическую замену `call()`. Выбор зависит от формы данных.

---

### Текущая модель JavaScript

Переход к bind():

---

## Примеры кода

Примеры находятся в папке:

```text
examples/01-javascript/chapter-31/
```

Запуск:

```bash
node examples/01-javascript/chapter-31/01-basic-apply.js
node examples/01-javascript/chapter-31/02-array-arguments.js
node examples/01-javascript/chapter-31/03-call-vs-apply.js
node examples/01-javascript/chapter-31/04-common-mistakes.js
node examples/01-javascript/chapter-31/05-qa-example.js
node examples/01-javascript/chapter-31/06-parameter-mapping.js
```

### Basic apply

```javascript
function getBaseUrl() {
  return this.baseUrl;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(getBaseUrl.apply(apiClient));
```

Receiver:

---

### Array arguments

```javascript
function formatRequest(method, path, body) {
  return method + ' ' + this.baseUrl + path + ' ' + body;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const requestParts = ['POST', '/users', '{"name":"Anna"}'];

console.log(formatRequest.apply(apiClient, requestParts));
```

Сопоставление параметров:

---

### call vs apply

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.call(apiClient, '/users'));
console.log(buildUrl.apply(apiClient, ['/users']));
```

Разница:

---

## Частые вопросы

### apply() решает новую проблему объект выполнения?

Нет. Receiver selection такая же, как у `call()`.

Разница в arguments.

### apply() устарел?

Нет. В современном JavaScript часто есть альтернативные способы передавать значения из array, но `apply()` остается важным механизмом языка и помогает понять Function API.

### apply() передает array как первый parameter?

Нет. Array используется как ordered argument list.

### Можно ли использовать apply() без arguments?

Да, если function не ожидает arguments или если нужно только явно выбрать объект выполнения.

```javascript
fn.apply(receiver);
```

### Чем apply() отличается от bind()?

`apply()` вызывает function immediately. `bind()` будет изучаться в следующей главе и создаст новую function с выбранным объект выполнения.

---

## Распространенные мифы

### Миф 1. apply() существует только как старая версия Spread

Реальность: `apply()` - самостоятельный механизм manual invocation с объект выполнения и ordered argument list. Современные альтернативы существуют, но они не отменяют полезность модели `apply()`.

### Миф 2. apply() меняет объект выполнения иначе, чем call()

Реальность:

### Миф 3. apply() всегда делает код сложнее

Реальность: если arguments уже лежат в ordered argument list, `apply()` может выражать намерение яснее, чем ручное обращение к indexes.

---

## Типичные ошибки

### Ошибка 1. Передать arguments не array или array-like collection

Неправильный код:

```javascript
function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

buildUrl.apply(apiClient, '/users');
```

Что произошло:

Исправленный вариант:

```javascript
buildUrl.apply(apiClient, ['/users']);
```

---

### Ошибка 2. Перепутать объект выполнения и arguments array

```javascript
function validateStatus(response) {
  return response.status === this.expectedStatus;
}

const config = {
  expectedStatus: 200
};

const response = {
  status: 200
};

validateStatus.apply([response], config);
```

Что произошло:

Исправленный вариант:

```javascript
validateStatus.apply(config, [response]);
```

---

### Ошибка 3. Думать, что apply() сохраняет объект выполнения

```javascript
function getBaseUrl() {
  return this.baseUrl;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

getBaseUrl.apply(apiClient);
getBaseUrl();
```

Первый вызов выбирает объект выполнения.

Второй вызов снова ordinary standalone invocation.

---

## Практическое использование

`apply()` полезен, когда arguments уже подготовлены как array или array-like ordered argument list.

Практическое использование:

Пример:

```javascript
function validateRequest(status, path, body) {
  return status === this.expectedStatus &&
    path === this.expectedPath &&
    body !== '';
}

const config = {
  expectedStatus: 200,
  expectedPath: '/users'
};

const requestData = [200, '/users', '{"name":"Anna"}'];

console.log(validateRequest.apply(config, requestData));
```

Читаемость:

---

## Использование в Automation QA

### Reusable validators

В Automation QA test data часто существует как array.

```javascript
function validateResponse(status, path, body) {
  return status === this.expectedStatus &&
    path === this.expectedPath &&
    body !== '';
}

const assertionConfig = {
  expectedStatus: 200,
  expectedPath: '/users'
};

const responseParts = [200, '/users', '{"name":"Anna"}'];
```

Пример QA-helper:

---

### Request builders

Request formatter:

Это полезно, когда data provider уже подготовил array значения для helper.

---

### Configuration objects

`apply()` помогает разделить:

Для Automation QA это важно в:

* reusable validators;
* request builders;
* helper functions;
* configuration objects;
* test data arrays.

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/31-apply.md
```

Выполняйте задания после запуска примеров из раздела «Примеры кода».

Главный вопрос практики:

```text
What changed compared to call()?
```

---

## Решения

Файл с решениями:

```text
solutions/01-javascript/31-apply.md
```

В решениях важно отдельно отслеживать:

---

## Итоги

`apply()` продолжает тему `call()`.

Выбор объекта выполнения:

Разница:

Полная модель apply():

Следующая глава про `bind()` ответит:

> Как создать новую function с заранее выбранным объект выполнения?

---

## Что нужно запомнить

* `apply()` вызывает function immediately.
* Первый argument `apply()` становится `this`.
* Второй argument `apply()` содержит array или array-like ordered argument list.
* Receiver selection у `call()` и `apply()` одинаковый.
* Главное отличие - способ передачи arguments.
* `apply()` удобен, когда arguments уже собраны в array или array-like collection.
* `bind()` будет изучаться дальше и решит другую задачу: создать новую function с выбранным объект выполнения.

Краткая ментальная модель:

---

## Проверьте себя

Ответьте без запуска кода:

1. Что общего у `call()` и `apply()`?
2. Что отличается у `call()` и `apply()`?
3. Что становится `this` в `fn.apply(config, значения)`?
4. Откуда берутся normal parameters при `apply()`?
5. Когда `apply()` удобнее `call()`?
6. Почему `bind()` логически следует после `apply()`?
