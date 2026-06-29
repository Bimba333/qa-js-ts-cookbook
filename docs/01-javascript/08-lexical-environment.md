# Lexical Environment

## Связь с предыдущей главой

Предыдущая глава объяснила Scope:

```text
Variables answer:
"How do names appear?"

Scope answers:
"Where are those names visible?"
```

Мы уже умеем мысленно выполнять поиск:

```mermaid
flowchart TD
    N1["Current Scope"]
    N2["Parent Scope"]
    N3["Global Scope"]
    N1 --> N2
    N2 --> N3
```

Теперь появляется следующий вопрос:

> Как JavaScript Engine internally remembers, какие identifiers принадлежат какому Scope?

Scope объясняет правила. Но rules должны где-то храниться во время выполнения. Engine должен помнить:

* какие identifiers есть в current scope;
* какие значения доступны через эти identifiers;
* куда идти дальше, если identifier не найден;
* как связать function scope с outer scope;
* почему helper-local identifiers остаются isolated.

Эта глава вводит Lexical Environment — концептуальную внутреннюю структуру, с помощью которой engine реализует Scope и identifier lookup.

Важно: это не глава по спецификации ECMAScript. Мы не будем превращать Lexical Environment в набор формальных алгоритмов. Цель — построить mental model, достаточную для понимания Hoisting, TDZ, Closures и debugging. Эти темы будут изучаться позже.

---

## Предварительные требования

Для этой главы нужно понимать:

* что Execution Context является рабочей средой выполнения;
* что Call Stack управляет active Execution Contexts;
* что Memory хранит information during execution;
* что Variables создают named access к stored information;
* что Scope определяет, где identifiers visible;
* что Scope Chain — conceptual path поиска identifiers outward.

Не требуется знать Hoisting mechanics, Temporal Dead Zone internals, Closures, `this`, modules или optimization details. Эти темы будут изучаться в отдельных главах.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            100-130 минут
Разбор схем:              45-60 минут
Запуск примеров:          25-35 минут
Практика:                 90-120 минут
Повторение материала:     30 минут
```

Уровень сложности: **L3**.

L3 означает фундаментальный уровень: глава объясняет внутреннюю структуру, которая делает Scope работающим. Это один из мостов к Hoisting, TDZ и Closures.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/07-scope.md
```

Следующая глава:

```text
docs/01-javascript/09-hoisting.md
```

Следующая глава объяснит Hoisting: почему declarations учитываются до выполнения строк и как это связано с подготовкой Lexical Environment.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем Scope нужен внутренний механизм;
* что такое Lexical Environment на концептуальном уровне;
* что такое Environment Record;
* что такое Outer Environment Reference;
* как linked environments реализуют Scope Chain;
* как Lexical Environment связан со Scope;
* как Lexical Environment связан с Execution Context;
* как Lexical Environment связан с Variables;
* как Lexical Environment связан с Memory;
* как Lexical Environment связан с Call Stack;
* как identifier lookup conceptually использует Lexical Environment;
* почему helper-local identifiers остаются isolated;
* как эта модель помогает debugging в Automation QA.

---

## Мотивация

Начнем с уже знакомого поведения.

```javascript
const baseUrl = 'https://example.com';

function printLoginUrl() {
  const path = '/login';

  console.log(baseUrl + path);
}

printLoginUrl();
```

Результат:

```text
https://example.com/login
```

Из главы про Scope мы знаем:

```mermaid
flowchart TD
    N1["path"]
    N2["found in Function Scope"]
    N3["baseUrl"]
    N4["not found in Function Scope"]
    N5["found in Global Scope"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
```

Теперь вопрос глубже:

```mermaid
flowchart TD
    N1["How does the engine remember:"]
    N2["Function Scope has path"]
    N3["Global Scope has baseUrl"]
    N4["Function Scope is connected to Global Scope?"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Если представить Scope только как правило, модель неполная. Правило должно быть реализовано какой-то внутренней структурой.

```mermaid
flowchart TD
    N1["Scope rule:"]
    N2["&quot;Search current scope, then outer scope.&quot;"]
    N3["Engine needs structure:"]
    N4["&quot;Where are current identifiers stored?&quot;"]
    N5["&quot;Where is outer scope recorded?&quot;"]
    N2 --> N3
    N1 --> N2
    N3 --> N4
    N4 --> N5
```

Главный вопрос главы:

> Какая структура внутри engine используется прямо сейчас?

---

## Теория

### Почему Scope нужен внутренний механизм

Scope говорит:

```text
Identifier visible here.
Identifier not visible there.
```

Но engine не может работать с абстрактным словом "видимость". Во время выполнения ему нужна конкретная внутренняя организация:

```mermaid
flowchart TD
    N1["Current code asks for identifier"]
    N2["Engine needs a record of current identifiers"]
    N3["If not found, engine needs a link to outer identifiers"]
    N1 --> N2
    N2 --> N3
```

Без такой структуры engine не смог бы ответить:

* есть ли `path` в current function;
* где искать `baseUrl`;
* почему `userName` из helper не visible снаружи;
* какой `status` использовать при shadowing.

Нужна структура, которая хранит identifiers текущей области и знает, где находится outer environment.

### Наблюдаемое поведение перед термином

Рассмотрим код:

```javascript
const baseUrl = 'https://example.com';

function buildLoginUrl() {
  const path = '/login';
  const fullUrl = baseUrl + path;

  console.log(fullUrl);
}

buildLoginUrl();
```

Во время выполнения `fullUrl` engine должен сделать поиск:

```mermaid
flowchart TD
    N1["fullUrl"]
    N2["current function information"]
    N3["path"]
    N4["current function information"]
    N5["baseUrl"]
    N6["outer global information"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
```

Значит, для function execution у engine есть не только code и call stack frame. Ему нужна таблица local identifiers и ссылка outward.

### Что такое Lexical Environment

Теперь можно ввести термин.

Lexical Environment — концептуальная внутренняя структура, которая хранит identifiers для текущей области и ссылку на outer environment.

Коротко:

Overview:

Главная модель:

```text
Scope explains the rules.
Lexical Environment is the internal structure
that allows the engine to implement those rules.
```

Что engine делает прямо сейчас:

```text
Engine uses current Lexical Environment.
Engine checks its Environment Record.
If needed, engine follows Outer Environment Reference.
```

### Environment Record

Environment Record — часть Lexical Environment, где хранятся records identifiers текущей области.

Для global-кода:

```javascript
const baseUrl = 'https://example.com';
const testName = 'login';
```

Концептуально:

Для функции:

```javascript
function buildLoginUrl() {
  const path = '/login';
}
```

Концептуально:

Environment Record — это не "объект, который вы можете вывести в console". Это conceptual model of internal records.

### Outer Environment Reference

Outer Environment Reference — ссылка из текущего Lexical Environment на внешний Lexical Environment.

Для global environment outer reference обычно указывает на отсутствие внешнего environment:

Это и есть внутренняя основа outward lookup.

### Linked environments

Nested scopes создают linked environments.

```javascript
const baseUrl = 'https://example.com';

function buildLoginUrl() {
  const path = '/login';

  if (true) {
    const fullUrl = baseUrl + path;

    console.log(fullUrl);
  }
}
```

Диаграмма:

Это linked folders:

Scope Chain из предыдущей главы теперь получает внутреннюю основу:

### Relationship with Scope

Scope — правило видимости. Lexical Environment — структура, которая позволяет это правило выполнять.

Пример:

```javascript
const baseUrl = 'https://example.com';

function printBaseUrl() {
  console.log(baseUrl);
}
```

Scope explanation:

```text
Function can access outer global identifier.
```

Lexical Environment explanation:

### Relationship with Execution Context

Execution Context — рабочая среда выполнения. Lexical Environment — важная часть этой среды, связанная с identifiers и scope lookup.

Для global execution:

Для function execution:

Что engine делает прямо сейчас:

### Relationship with Variables

Variables создают identifiers. Lexical Environment хранит records об этих identifiers.

```javascript
const userName = 'Anna';
let status = 'created';
```

Концептуально:

При reassignment:

```javascript
status = 'ready';
```

Модель:

`const`, `let`, `var` имеют разные правила регистрации и доступа. Hoisting и TDZ объяснят часть этих различий позже.

### Relationship with Memory

Memory хранит information. Lexical Environment хранит records named access к этой information.

Учебная схема:

Это не физическая карта памяти. Это conceptual relationship: Lexical Environment помогает engine понять, какой identifier к какой stored information относится.

### Relationship with Call Stack

Call Stack показывает active Execution Context.

Каждый relevant Execution Context имеет свою Lexical Environment information.

Что важно:

Это разные механизмы, но они работают вместе во время execution.

### Identifier lookup через Lexical Environment

Рассмотрим код:

```javascript
const baseUrl = 'https://example.com';

function buildLoginUrl() {
  const path = '/login';
  const fullUrl = baseUrl + path;

  console.log(fullUrl);
}
```

Lookup для `fullUrl`:

Lookup для `path`:

Lookup для `baseUrl`:

Полный процесс поиска:

### Nested environments

Nested functions and blocks add more environments.

```javascript
const baseUrl = 'https://example.com';

function testLogin() {
  const userName = 'qa-user';

  if (true) {
    const expectedStatus = 'active';

    console.log(baseUrl);
    console.log(userName);
    console.log(expectedStatus);
  }
}
```

Схема:

This is the chain of records:

### Текущее место главы в модели JavaScript

Теперь модель выполнения стала глубже:

Цепочка курса:

### Переход к Hoisting

Следующий вопрос:

> Если Environment Record хранит identifiers, когда эти records появляются?

Этот вопрос ведет к Hoisting.

Hoisting — поведение, связанное с тем, как declarations учитываются во время подготовки execution. В следующей главе мы увидим, что часть "магии" Hoisting становится понятнее, если помнить про creation phase и Lexical Environment.

---

## Внутренний механизм

Внутренний механизм главы можно представить так:

Что structure inside engine is being used right now:

Для shadowing:

Для missing identifier:

ReferenceError — runtime error при обращении к identifier, который не найден в accessible environments. Error Handling будет изучаться позже.

---

## Ментальная модель

### Office with folders

Представьте office, где у каждого scope есть folder.

В каждом folder лежит список identifiers.

### Registry of identifiers

Environment Record — registry identifiers текущего folder.

### Linked folders

Outer Environment Reference — link к outer folder.

### Address book

Lexical Environment похож на address book:

Если entry нет в current address book, engine открывает parent address book.

### Chain of records

Lookup идет по chain of records.

Итоговая модель:

---

## Примеры кода

Примеры к этой главе находятся в папке:

```text
examples/01-javascript/chapter-08/
```

Запускайте их из корня проекта.

### Пример 1. Global environment

Файл:

```text
examples/01-javascript/chapter-08/01-global-environment.js
```

Показывает identifiers, которые conceptually попадают в global environment record.

### Пример 2. Function environment

Файл:

```text
examples/01-javascript/chapter-08/02-function-environment.js
```

Показывает function-local environment record.

### Пример 3. Nested environments

Файл:

```text
examples/01-javascript/chapter-08/03-nested-environments.js
```

Показывает linked environments: global → function → block.

### Пример 4. Environment Record

Файл:

```text
examples/01-javascript/chapter-08/04-environment-record.js
```

Показывает, какие identifiers local function использует из своего record.

### Пример 5. Lookup

Файл:

```text
examples/01-javascript/chapter-08/05-lookup.js
```

Показывает lookup local identifier и outer identifier.

### Пример 6. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-08/06-common-mistakes.js
```

Показывает типичные ошибки через безопасные закомментированные строки.

---

## Частые вопросы

### Lexical Environment и Scope — одно и то же?

Нет. Scope — правила видимости. Lexical Environment — internal structure, которая позволяет engine реализовать эти правила.

### Можно ли увидеть Lexical Environment в коде?

Нет напрямую. Это внутренняя структура engine. Мы строим conceptual model, чтобы объяснять поведение JavaScript.

### Environment Record — это обычный object?

Нет. Это не обычный JavaScript object для работы в коде. Это учебная модель внутреннего record identifiers.

### Outer Environment Reference — это reference из главы про objects?

Нет. Здесь слово reference означает link на outer environment в conceptual internal model. Object references будут изучаться отдельно.

### Почему не изучаем Hoisting сразу?

Потому что сначала нужно понять, где identifiers хранятся концептуально. Hoisting объяснит, когда records появляются и как declarations влияют на них до execution.

---

## Распространенные мифы

### Миф 1. Scope Chain существует только в голове программиста

Реальность:

Scope Chain — conceptual view, но за ним стоит internal structure linked Lexical Environments.

### Миф 2. Function-local variables исчезают из-за Call Stack

Реальность:

Call Stack управляет active contexts. Видимость identifiers объясняется Lexical Environment and Scope.

### Миф 3. Engine ищет identifier во всех functions

Реальность:

Engine checks current Environment Record and follows Outer Environment Reference outward.

### Миф 4. Lexical Environment нужно знать как спецификацию

Реальность:

Для курса важна mental model: record identifiers + outer link. Формальные детали спецификации не нужны на этом этапе.

---

## Типичные ошибки

### Ошибка 1. Путать Environment Record и Memory

Неправильная модель:

```text
Environment Record is all memory.
```

Что произошло:

Environment Record хранит identifier records. Memory model шире и связана с хранением information during execution.

Исправленная модель:

### Ошибка 2. Путать Outer Environment Reference и Call Stack

Неправильная модель:

```text
Outer link follows the вызывающий код.
```

Что произошло:

Outer Environment Reference связан с lexical nesting, а не просто с тем, кто вызвал функцию. Подробности Closures будут изучаться позже.

Исправленная модель:

### Ошибка 3. Объяснять lookup поиском по всему файлу

Неправильная модель:

```text
Engine scans the whole file for matching name.
```

Исправленная модель:

### Ошибка 4. Углубляться в TDZ раньше времени

Что произошло:

Читатель пытается объяснить все особенности `let` и `const` через TDZ до изучения Hoisting.

Исправленная модель:

```text
First:
Lexical Environment stores identifier records.

Next:
Hoisting and TDZ explain timing and access restrictions.
```

---

## Практическое использование

При чтении кода задавайте вопросы:

```text
1. What is the current Lexical Environment?
2. What identifiers are in its Environment Record?
3. What is the Outer Environment Reference?
4. Where will lookup go if identifier is not local?
5. Where will lookup stop?
```

Таблица анализа:

Мини-чек-лист:

```text
✓ Я отличаю Scope от Lexical Environment.
✓ Я вижу Environment Record текущей области.
✓ Я понимаю Outer Environment Reference.
✓ Я могу пройти lookup outward.
✓ Я не путаю lookup с Call Stack.
```

---

## Использование в Automation QA

### Helper-local identifiers remain isolated

Helper-local identifiers находятся в environment helper execution.

```javascript
function buildUserName() {
  const prefix = 'qa';
  const userName = prefix + '-user';

  return userName;
}
```

Концептуальная модель:

Тест не должен access `prefix`, потому что он не находится в accessible outer environment теста.

### Nested helper calls still access configuration

Configuration может быть global stable value:

```javascript
const baseUrl = 'https://example.com';

function buildLoginUrl() {
  const path = '/login';

  return baseUrl + path;
}
```

Lookup:

Так nested helper может читать configuration, не передавая ее через global mutable состояние.

### Runtime lookup during debugging

Когда тест падает из-за неправильного identifier или unexpected value, полезно разделять:

Stack trace показывает call chain. Lexical Environment помогает понять, какой `status`, `baseUrl` или `userName` был найден lookup-ом.

### Reading Playwright stack traces together with Scope

Playwright stack trace может привести в helper:

Но вопрос "какое значение прочитал helper?" требует Scope/Lexical Environment model:

Для debugging нужно смотреть оба слоя:

---

## Итоги

Scope объясняет rules visibility. Lexical Environment объясняет conceptual internal structure behind these rules.

Главная модель:

Identifier lookup conceptually идет так:

Execution Context использует Lexical Environment для resolving identifiers. Call Stack показывает active context, но не заменяет environment lookup. Variables создают identifiers, Environment Records хранят records об этих identifiers, а Memory хранит information, с которой программа работает.

Следующая глава объяснит Hoisting: как declarations влияют на Environment Records до того, как execution дойдет до соответствующей строки.

---

## Что нужно запомнить

✓ Scope объясняет правила видимости identifiers.

✓ Lexical Environment — conceptual internal structure, реализующая Scope.

✓ Environment Record хранит records identifiers текущей области.

✓ Outer Environment Reference связывает текущий environment с outer environment.

✓ Linked Lexical Environments реализуют Scope Chain.

✓ Identifier lookup checks current Environment Record first.

✓ Если identifier не найден, lookup follows Outer Environment Reference.

✓ Call Stack и Lexical Environment отвечают на разные вопросы.

✓ Lexical Environment помогает понять Hoisting, TDZ и Closures позже.

✓ Следующая тема — Hoisting.

---

## Проверьте себя

1. Почему Scope нужен внутренний механизм?

2. Что такое Lexical Environment?

3. Что хранит Environment Record?

4. Зачем нужен Outer Environment Reference?

5. Как linked environments связаны со Scope Chain?

6. Как Lexical Environment связан с Execution Context?

7. Как Lexical Environment связан с Variables?

8. Чем Lexical Environment отличается от Memory?

9. Почему Call Stack не объясняет identifier lookup?

10. Как Lexical Environment подготавливает понимание Hoisting?

---

## Практика

Практика к этой главе находится в файле:

```text
practice/01-javascript/08-lexical-environment.md
```

Перед практикой запустите примеры из `examples/01-javascript/chapter-08/` и для каждого identifier составьте lookup path.

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/08-lexical-environment.md
```

Открывайте решения после самостоятельной попытки. В этой главе важно сравнивать не только результат выполнения, но и Environment Record / Outer Environment Reference path.
