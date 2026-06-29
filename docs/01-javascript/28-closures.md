# Closures

## Связь с предыдущей главой

Предыдущая глава объяснила Spread.

```mermaid
flowchart TD
    N1["Spread"]
    N2["раскрывает одну collection"]
    N3["в много отдельных значений"]
    N1 --> N2
    N1 --> N3
```

Теперь мы возвращаемся к функциям и к модели выполнения JavaScript.

К этому моменту уже известно:

```mermaid
flowchart TD
    N1["Execution Context"]
    N2["создает среду выполнения"]
    N3["имеет Creation Phase"]
    N4["имеет выполнение Phase"]
    N5["Scope"]
    N6["отвечает за видимость identifiers"]
    N7["Lexical Environment"]
    N8["хранит identifiers"]
    N9["связывает окружение с outer environment"]
    N10["Function"]
    N11["получает arguments через parameters"]
    N12["выполняет body"]
    N13["может вернуть value через return"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N5 --> N6
    N5 --> N7
    N7 --> N8
    N7 --> N9
    N7 --> N10
    N10 --> N11
    N10 --> N12
    N10 --> N13
```

Теперь появляется один из самых важных вопросов JavaScript:

> Функция уже завершила выполнение. Почему некоторые значения все еще существуют?

Это вопрос о Closures.

Главный вопрос главы:

> Почему это значение все еще существует?

---

## Предварительные требования

Для этой главы нужно понимать:

* что Execution Context создается при выполнении функции;
* что Call Stack управляет активными Execution Contexts;
* что Scope определяет, где identifier видим;
* что Lexical Environment хранит identifiers и связь с outer environment;
* что function object можно вернуть из функции;
* что `return` завершает выполнение функции и отправляет value обратно;
* что function body выполняется только после invocation.

Не требуется знать `this`, modules, private class поля, WeakMap privacy, Garbage Collector internals, React hooks, event listeners или async closures. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            150-190 минут
Разбор схем:             60-80 минут
Запуск примеров:         25-35 минут
Практика:                120-160 минут
Повторение материала:    35 минут
```

Уровень сложности: **L4**.

Closure часто кажется магией, потому что читатель ожидает, что все локальные данные функции исчезают сразу после ее завершения. На самом деле магии нет: function object удерживает ссылку на то Lexical Environment, где он был создан, если продолжает использовать identifiers из него.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/27-spread.md
```

Текущая глава:

```text
docs/01-javascript/28-closures.md
```

Следующая глава:

```text
docs/01-javascript/29-this.md
```

Следующая глава ответит:

> Как определяется контекст выполнения функции через `this`?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существуют Closures;
* почему функция может помнить outer variables;
* как Closure связана с Lexical Environment;
* почему outer scope может оставаться доступным после завершения функции;
* чем expected lifetime отличается от actual lifetime;
* как работают multiple closures;
* почему independent closures не мешают друг другу;
* как Closure связана с Execution Context и Call Stack;
* какие ошибки чаще всего возникают;
* как Closures применяются в Automation QA.

---

## Мотивация

Начнем с поведения, которое сначала кажется странным.

```javascript
function createStatusValidator() {
  const expectedStatus = 200;

  return function validateStatus(actualStatus) {
    return actualStatus === expectedStatus;
  };
}

const validateSuccess = createStatusValidator();

console.log(validateSuccess(200));
```

Функция `createStatusValidator()` уже завершилась.

```mermaid
flowchart TD
    N1["createStatusValidator()"]
    N2["created expectedStatus"]
    N3["returned validateStatus"]
    N4["finished"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Но `validateStatus()` все еще может прочитать `expectedStatus`.

```mermaid
flowchart TD
    N1["validateSuccess(200)"]
    N2["reads expectedStatus"]
    N1 --> N2
```

Ожидание читателя:

```mermaid
flowchart TD
    N1["Function finished"]
    N2["local variables disappeared"]
    N3["expectedStatus should be unavailable"]
    N1 --> N2
    N2 --> N3
```

Фактическое поведение:

```mermaid
flowchart TD
    N1["Function finished"]
    N2["возвращенная функция still needs expectedStatus"]
    N3["Function object holds reference to required environment"]
    N4["expectedStatus is still available"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Главный вопрос:

> Почему `expectedStatus` все еще существует?

Closure отвечает именно на этот вопрос.

---

## Теория

### Проблема исчезающих локальных данных

Обычная функция выполняется так:

```mermaid
flowchart TD
    N1["вызов функции"]
    N2["Function Execution Context created"]
    N3["Local identifiers prepared"]
    N4["тело функции executed"]
    N5["Function returns"]
    N6["Execution Context removed from Call Stack"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
```

Выполнение функции:

```mermaid
flowchart TD
    N1["Call Stack"]
    N2["Global Execution Context"]
    N3["createStatusValidator()"]
    N1 --> N2
    N1 --> N3
```

Function finishes:

После завершения функции ее Execution Context больше не активен.

Но важно не смешивать две идеи:

Execution Context отвечает за выполнение.

Lexical Environment хранит identifiers, которые могут понадобиться function object позже.

---

### Наблюдаемое противоречие

Посмотрим на минимальный пример:

```javascript
function outer() {
  const message = 'Saved value';

  function inner() {
    return message;
  }

  return inner;
}

const readMessage = outer();

console.log(readMessage());
```

Reader expectation:

Фактическое поведение:

Вот момент, где рождается Closure.

Closure creation:

Closure - это не отдельная синтаксическая конструкция.

Это поведение, которое возникает, когда function object удерживает ссылку на lexical environment, где он был создан.

---

### Что такое Closure

Теперь можно дать рабочее определение.

Closure - это поведение function object, который удерживает ссылку на Lexical Environment, где он был создан.

Более практичная формулировка:

> Closure позволяет функции использовать variables из outer scope даже после того, как outer function завершила выполнение.

Важно:

Миф -> Реальность:

---

### Lexical Environment revisit

В главе про Lexical Environment мы видели:

Теперь эта модель становится особенно важной.

Когда функция создается, она создается не в пустоте.

Функция `validateStatus` была создана внутри `createStatusValidator`.

Значит, ее lexical position выглядит так:

Scope Chain revisit:

Closure появляется потому, что `validateStatus` удерживает доступ к outer environment, где лежит `expectedStatus`.

---

### Outer scope access

Функция ищет identifier так же, как раньше:

Outer scope:

После завершения `createStatusValidator()` меняется не правило поиска, а lifetime нужного environment.

Главный вопрос остается тем же:

> Почему это значение все еще существует?

Потому что function object все еще существует и все еще ссылается на environment, где находится это значение.

---

## Внутренний механизм

### Полная последовательность

Разберем пример как фильм.

```javascript
function createValidator(expectedStatus) {
  return function validate(actualStatus) {
    return actualStatus === expectedStatus;
  };
}

const validateOk = createValidator(200);

console.log(validateOk(200));
console.log(validateOk(404));
```

Complete Closure model:

Execution Context revisit:

Function returned:

Returned function called later:

---

### Как удерживается доступ

Closure не означает, что JavaScript сохраняет весь Call Stack.

Call Stack interaction:

Сохраняется не "активный вызов функции".

Function object удерживает ссылку на нужное lexical environment.

Интуитивная модель памяти:

Мы не углубляемся в Garbage Collector. Важно только одно:

Garbage Collector будет изучаться позже. Сейчас достаточно понимать: пока function object доступен и ему нужен outer environment, это окружение остается достижимым через ссылку function object.

---

### Lifetime captured variables

Обычная локальная переменная:

Captured variable:

Ожидаемое время жизни vs Фактическое время жизни:

Data reachability:

---

### Multiple closures

Одна factory function может создать несколько closures.

```javascript
function createCounter(start) {
  let count = start;

  return function increment() {
    count = count + 1;
    return count;
  };
}

const firstCounter = createCounter(0);
const secondCounter = createCounter(10);

console.log(firstCounter());
console.log(firstCounter());
console.log(secondCounter());
```

Multiple counters:

Independent closures:

Они не делят один `count`, потому что каждый вызов `createCounter()` создает новое lexical environment.

---

### Closure timeline

Closure временная шкала:

Environment lifetime:

Closure lifetime:

---

## Ментальная модель

### Рюкзак

Представьте функцию, которая выходит из комнаты, но берет с собой рюкзак.

В рюкзаке не лежит копия всего мира. Эта модель означает, что у function object остается ссылка на то окружение, которое функции нужно.

Backpack analogy:

Когда функция вызывается позже:

Эта модель полезна, но ее нужно понимать аккуратно:

---

### Запомненная комната

Другая модель - linked room.

Когда outer function завершилась, комната не уничтожается, если inner function все еще может туда вернуться за нужным identifier.

Remembered room:

Invisible link:

---

### Notebook

Closure можно представить как notebook с записями, которые функция может использовать позже.

Объект функции:

Notebook помогает понять, почему helper factory удобна в тестах:

---

### Текущее место в модели JavaScript

Текущее место в модели JavaScript:

Переход к this:

Closure отвечает:

```text
What variables can this function still access?
```

`this` ответит:

```text
How is this function called and what is its receiver?
```

---

## Примеры кода

Примеры находятся в папке:

```text
examples/01-javascript/chapter-28/
```

Запуск:

```bash
node examples/01-javascript/chapter-28/01-first-closure.js
node examples/01-javascript/chapter-28/02-counter.js
node examples/01-javascript/chapter-28/03-independent-closures.js
node examples/01-javascript/chapter-28/04-common-mistakes.js
node examples/01-javascript/chapter-28/05-memory-intuition.js
node examples/01-javascript/chapter-28/06-qa-example.js
```

### Первый Closure

```javascript
function createMessageReader() {
  const message = 'Environment is reachable';

  return function readMessage() {
    return message;
  };
}

const readMessage = createMessageReader();

console.log(readMessage());
```

Что происходит:

Позже:

---

### Counter

```javascript
function createCounter() {
  let count = 0;

  return function increment() {
    count = count + 1;
    return count;
  };
}

const counter = createCounter();

console.log(counter());
console.log(counter());
console.log(counter());
```

Complete counter picture:

`count` не становится global variable. Он остается доступным только через returned function.

---

### Independent closures

```javascript
function createCounter(start) {
  let count = start;

  return function increment() {
    count = count + 1;
    return count;
  };
}

const smallCounter = createCounter(0);
const largeCounter = createCounter(100);

console.log(smallCounter());
console.log(smallCounter());
console.log(largeCounter());
console.log(largeCounter());
```

Independent environment picture:

Каждый вызов `createCounter()` создает отдельное lexical environment.

---

### Memory intuition

```javascript
function createUserReader(userName) {
  return function readUserName() {
    return userName;
  };
}

const readAdminName = createUserReader('Anna');
const readGuestName = createUserReader('Ivan');

console.log(readAdminName());
console.log(readGuestName());
```

Интуитивная модель памяти:

Это концептуальная модель, а не описание внутренней памяти конкретного engine.

---

### QA-пример

```javascript
function createStatusValidator(expectedStatus) {
  return function validateResponse(response) {
    return response.status === expectedStatus;
  };
}

const validateSuccess = createStatusValidator(200);
const validateCreated = createStatusValidator(201);

const response = {
  status: 200
};

console.log(validateSuccess(response));
console.log(validateCreated(response));
```

Пример QA-helper:

Так можно создавать читаемые validators без дублирования expected значения в каждом тесте.

---

## Частые вопросы

### Closure копирует значения?

Нет. Полезнее думать так: function object удерживает ссылку на lexical environment, где лежат нужные identifiers.

### Closure появляется только при return function?

Нет. Но в этой главе мы используем `return function`, потому что это самый понятный способ увидеть поведение. Другие применения будут встречаться позже, например в callbacks и event listeners.

### Closure делает переменную global?

Нет. Captured variable не становится global variable.

### Closure всегда плохо влияет на память?

Нет. Closure - нормальный механизм языка. Проблемы появляются, когда код случайно сохраняет больше данных, чем нужно. Garbage Collector и memory management будут изучаться позже.

---

## Распространенные мифы

### Миф 1. Closure - это редкая продвинутая техника

Реальность: Closures встречаются в обычном JavaScript-коде постоянно, особенно в helper creators, validators и factory functions.

### Миф 2. Closure хранит копию всех переменных outer function

Реальность: правильнее мыслить через ссылку function object на нужное lexical environment.

### Миф 3. Closure делает код непредсказуемым

Реальность: Closure предсказуема, если вручную отслеживать:

Closure становится сложной только тогда, когда разработчик пытается запомнить определение вместо того, чтобы рисовать environment.

---

## Типичные ошибки

### Ошибка 1. Думать, что outer variable исчезла всегда

Неправильная модель:

Что произошло:

Исправленная модель:

---

### Ошибка 2. Думать, что Closure хранит копию значения

```javascript
function createCounter() {
  let count = 0;

  return function increment() {
    count = count + 1;
    return count;
  };
}
```

Если бы Closure хранила копию, `count` каждый раз был бы `0`.

Фактическое поведение:

---

### Ошибка 3. Создавать общий состояние случайно

```javascript
let sharedStatus = 200;

function validateStatus(actualStatus) {
  return actualStatus === sharedStatus;
}
```

Это не factory. Это global mutable состояние.

Более контролируемый вариант:

```javascript
function createStatusValidator(expectedStatus) {
  return function validateStatus(actualStatus) {
    return actualStatus === expectedStatus;
  };
}
```

Типичные ошибки:

---

### Ошибка 4. Путать Closure и Scope

Scope отвечает на вопрос:

```text
Where is identifier visible?
```

Closure отвечает на вопрос:

```text
Why can function still reach outer environment later?
```

Они связаны, но это не одно и то же.

---

## Практическое использование

Closure полезна, когда нужно создать функцию, которая имеет доступ к части настройки из Lexical Environment, где была создана.

Factory function:

Пример:

```javascript
function createPrefixLogger(prefix) {
  return function logMessage(message) {
    console.log(prefix + ': ' + message);
  };
}

const logApi = createPrefixLogger('API');
const logUi = createPrefixLogger('UI');

logApi('Request started');
logUi('Button clicked');
```

Complete practical picture:

Closure помогает:

* создавать specialized helpers;
* избегать лишних global variables;
* хранить configuration рядом с поведение;
* делать код выразительнее;
* уменьшать дублирование.

---

## Использование в Automation QA

### Factory functions

В Automation QA часто нужны helpers, которые отличаются только настройкой.

```javascript
function createHeaderValidator(expectedHeaderName) {
  return function validateHeaders(headers) {
    return headers[expectedHeaderName] !== undefined;
  };
}
```

QA factory:

---

### Reusable validators

```javascript
function createResponseValidator(expectedStatus) {
  return function validateResponse(response) {
    return response.status === expectedStatus;
  };
}

const validateOk = createResponseValidator(200);
const validateCreated = createResponseValidator(201);
```

Automation QA object:

Такой подход полезен для REST API проверок, где один и тот же алгоритм применяется к разным expected значения.

---

### Configuration capture

```javascript
function createApiUrlBuilder(baseUrl) {
  return function buildUrl(path) {
    return baseUrl + path;
  };
}

const buildStagingUrl = createApiUrlBuilder('https://staging.example.test');

console.log(buildStagingUrl('/users'));
```

Configuration capture:

Это удобно для helpers, которые должны помнить environment configuration.

---

### Locator factories

В Playwright locator factories часто строятся вокруг контекста страницы или selector prefix, к которым helper получает доступ через environment reference. Подробно Playwright будет изучаться позже, но сама идея Closure уже понятна.

Важно: callbacks, async поведение и event listeners будут разобраны позже. Здесь достаточно понять: Closure позволяет helper иметь доступ к данным из Lexical Environment, где он был создан.

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/28-closures.md
```

Выполняйте задания после запуска примеров из `examples/01-javascript/chapter-28/`.

Решения находятся отдельно:

```text
solutions/01-javascript/28-closures.md
```

Сначала решите задания самостоятельно. Для Closures особенно важно не угадывать ответ, а вручную рисовать environment:

---

## Решения

Файл с решениями:

```text
solutions/01-javascript/28-closures.md
```

В решениях важно смотреть не только на итоговый код, но и на reasoning: для Closures главный навык - объяснять, почему function object все еще имеет доступ к конкретному lexical environment.

---

## Итоги

Closure объясняет, почему функция может использовать outer variables после завершения outer function.

Главная идея:

Полная картина:

Closure не является магией. Function object удерживает ссылку на Lexical Environment, где он был создан, потому что продолжает использовать identifiers из этого окружения.

---

## Что нужно запомнить

* Closure - это поведение function object, который удерживает ссылку на Lexical Environment, где был создан.
* Closure появляется, когда функция использует variables из outer scope.
* Outer function может завершиться, но нужное lexical environment может оставаться достижимым через function object.
* Captured variable не становится global variable.
* Closure не копирует значения как frozen snapshot.
* Каждый вызов factory function может создать независимое lexical environment.
* Closures полезны для factory functions, validators, configuration capture и QA helpers.
* Следующая глава про `this` объяснит другой вопрос: не какие variables видны функции, а как определяется ее execution объект выполнения.

Краткая ментальная модель:

---

## Проверьте себя

Ответьте без запуска кода:

1. Почему `expectedStatus` доступен после завершения `createStatusValidator()`?
2. Closure копирует значение переменной или function object удерживает ссылку на environment?
3. Почему два вызова `createCounter()` создают независимые counters?
4. Чем Scope отличается от Closure?
5. Почему captured variable не является global variable?
6. Какая тема логически следует после Closures и почему?
