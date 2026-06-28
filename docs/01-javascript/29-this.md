# this

## Связь с предыдущей главой

Предыдущая глава объяснила Closures.

Главная модель была такой:

```mermaid
flowchart TD
    N1["Function object"]
    N2["holds reference to"]
    N3["Lexical Environment"]
    N4["where it was created"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Closure отвечает на вопрос:

```text
Which variables can the function access?
```

Теперь появляется другой вопрос.

Одна и та же функция может быть вызвана по-разному:

```javascript
function printName() {
  console.log(this.name);
}

const user = {
  name: 'Anna',
  printName
};

const admin = {
  name: 'Kate',
  printName
};

user.printName();
admin.printName();
```

Код функции один и тот же.

Но результат зависит от вызова.

Главный вопрос этой главы:

> Кто решил, чем будет `this`?

---

## Предварительные требования

Для этой главы нужно понимать:

* что функция - это function object;
* что function object можно хранить в переменной;
* что object может хранить properties;
* что property value может быть function object;
* что Closure связана с Lexical Environment;
* что Execution Context создается при вызове функции;
* что Call Stack управляет активными вызовами.

Не требуется знать `call()`, `apply()`, `bind()`, classes, constructors, `new`, DOM event handlers или async callbacks. Эти темы будут изучаться позже.

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

`this` сложен не из-за синтаксиса. Он сложен потому, что многие пытаются определить `this` по месту создания функции. В обычных function declarations и function expressions это неверная модель.

Главная мысль главы:

```mermaid
flowchart TD
    N1["Function creation"]
    N2["≠"]
    N3["Function invocation"]
    N1 --> N2
    N2 --> N3
```

`this` определяется во время invocation.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/28-closures.md
```

Текущая глава:

```text
docs/01-javascript/29-this.md
```

Следующая глава:

```text
docs/01-javascript/30-call.md
```

Следующая глава ответит:

> Можно ли выбрать объект выполнения вручную?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `this`;
* что такое execution объект выполнения;
* почему `this` определяется во время вызова;
* чем global invocation отличается от method invocation;
* почему detached function теряет объект выполнения;
* почему Creation Phase не решает значение `this` заранее;
* чем Closure отличается от `this`;
* как Arrow Function связана с `this` на высоком уровне;
* какие ошибки чаще всего возникают;
* как `this` встречается в Automation QA коде.

---

## Мотивация

Начнем с неожиданного поведения.

```javascript
const apiClient = {
  name: 'staging client',
  printName: function () {
    console.log(this.name);
  }
};

const localClient = {
  name: 'local client',
  printName: apiClient.printName
};

apiClient.printName();
localClient.printName();
```

Function object один:

```mermaid
flowchart TD
    N1["apiClient.printName"]
    N2["same function object"]
    N3["localClient.printName"]
    N4["same function object"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Но вызовы разные:

```mermaid
flowchart TD
    N1["apiClient.printName()"]
    N2["receiver is apiClient"]
    N3["localClient.printName()"]
    N4["receiver is localClient"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Same function, different invocation:

```mermaid
flowchart TD
    N1["Same code"]
    N2["called as apiClient.printName()"]
    N3["this → apiClient"]
    N4["called as localClient.printName()"]
    N5["this → localClient"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

Если думать, что `this` определяется там, где функция была создана, этот пример невозможно объяснить.

Правильный вопрос:

> Как функция была вызвана?

Зачем существует `this`:

```mermaid
flowchart TD
    N1["One reusable function"]
    N2["can work for different objects"]
    N3["needs current receiver"]
    N4["this"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

---

## Теория

### Зачем существует this

Функция часто описывает действие, которое должно выполняться для конкретного object.

```javascript
const response = {
  status: 200,
  isSuccessful: function () {
    return this.status === 200;
  }
};
```

Внутри `isSuccessful` нужно обратиться к текущему response object.

Без `this` пришлось бы явно указывать имя объекта:

```javascript
const response = {
  status: 200,
  isSuccessful: function () {
    return response.status === 200;
  }
};
```

Но тогда функция жестко привязана к имени `response`.

`this` решает другую задачу:

```mermaid
flowchart TD
    N1["method body"]
    N2["needs current object"]
    N3["this points to current receiver"]
    N1 --> N2
    N1 --> N3
```

Receiver model:

```mermaid
flowchart TD
    N1["object.method()"]
    N2["object → receiver"]
    N3["method → function object"]
    N4["inside method"]
    N5["this → receiver"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

`this` нужен, чтобы один function object мог работать с тем object, для которого он вызван.

---

### Execution объект выполнения

Execution объект выполнения - это object, для которого выполняется function call.

В выражении:

```javascript
apiClient.printName();
```

объект выполнения:

```mermaid
flowchart TD
    N1["apiClient.printName()"]
    N2["apiClient → receiver"]
    N3["printName → function object"]
    N1 --> N2
    N1 --> N3
```

Current объект выполнения:

```mermaid
flowchart TD
    N1["Current вызов функции"]
    N2["has current receiver"]
    N3["available as this"]
    N1 --> N2
    N2 --> N3
```

Важно:

```mermaid
flowchart TD
    N1["Function object"]
    N2["does not permanently belong to one object"]
    N3["Function invocation"]
    N4["selects receiver for this call"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Один function object может быть property разных objects.

```mermaid
flowchart TD
    N1["same function object"]
    N2["user.printName()"]
    N3["this → user"]
    N4["admin.printName()"]
    N5["this → admin"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

---

### Как определяется this

Для обычных function calls, которые рассматриваются в этой главе, используем рабочее правило:

```text
this is determined by invocation
```

Invocation determines `this`:

```mermaid
flowchart TD
    N1["How function is called"]
    N2["receiver is selected"]
    N3["this receives receiver"]
    N4["тело функции выполняется"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Creation vs invocation:

```mermaid
flowchart TD
    N1["Function creation"]
    N2["создает function object"]
    N3["не фиксирует this навсегда"]
    N4["Function invocation"]
    N5["запускает выполнение"]
    N6["определяет this для этого вызова"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
    N4 --> N6
```

Для обычного вызова вида `object.method()` ключевой вопрос для чтения кода:

```text
Кто находится слева от точки в момент вызова?
```

Пример:

```javascript
client.printName();
```

```mermaid
flowchart TD
    N1["client.printName()"]
    N2["left side before dot is client"]
    N3["this → client"]
    N1 --> N2
    N1 --> N3
```

Это не универсальное правило для всех форм вызова в JavaScript. Сейчас мы строим базовую модель объект выполнения для обычных вызовов `object.method()` и standalone calls. Другие формы вызова будут изучаться в следующих главах.

---

### Global invocation

Global invocation - это вызов функции без object объект выполнения.

```javascript
'use strict';

function printThis() {
  console.log(this);
}

printThis();
```

Глобальный вызов:

```mermaid
flowchart TD
    N1["printThis()"]
    N2["нет object before dot"]
    N3["нет receiver"]
    N1 --> N2
    N1 --> N3
```

В strict mode:

```mermaid
flowchart TD
    N1["нет receiver"]
    N2["this → undefined"]
    N1 --> N2
```

В старом non-strict поведении `this` мог указывать на global object. В этом курсе мы строим современную практическую модель и будем избегать зависимости от non-strict поведения.

Global invocation схема:

```mermaid
flowchart TD
    N1["вызов функции"]
    N2["printThis()"]
    N3["receiver: none"]
    N4["this: undefined in strict mode"]
    N1 --> N2
    N2 --> N3
    N2 --> N4
```

---

### Method invocation

Method invocation - это вызов function object как property object.

```javascript
const user = {
  name: 'Anna',
  printName: function () {
    console.log(this.name);
  }
};

user.printName();
```

Object method:

```mermaid
flowchart TD
    N1["user"]
    N2["name: 'Anna'"]
    N3["printName: function object"]
    N1 --> N2
    N1 --> N3
```

Вызов метода:

```mermaid
flowchart TD
    N1["user.printName()"]
    N2["receiver: user"]
    N3["this inside function: user"]
    N1 --> N2
    N1 --> N3
```

Current object:

```mermaid
flowchart TD
    N1["Inside printName"]
    N2["this.name"]
    N3["means user.name for this invocation"]
    N1 --> N2
    N1 --> N3
```

Same code, different объект выполнения:

```mermaid
flowchart TD
    N1["printName body"]
    N2["console.log(this.name)"]
    N3["user.printName()"]
    N4["this.name → user.name"]
    N5["admin.printName()"]
    N6["this.name → admin.name"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
    N3 --> N5
    N5 --> N6
```

---

### Detached function

Detached function - это function object, который взяли из object property и вызвали отдельно.

```javascript
'use strict';

const apiClient = {
  name: 'staging',
  printName: function () {
    console.log(this.name);
  }
};

const printClientName = apiClient.printName;

printClientName();
```

Method extraction:

```mermaid
flowchart TD
    N1["apiClient.printName"]
    N2["function object copied into variable"]
    N1 --> N2
```

Function reference:

```mermaid
flowchart TD
    N1["printClientName"]
    N2["references same function object"]
    N1 --> N2
```

Потерянный объект выполнения:

```mermaid
flowchart TD
    N1["apiClient.printName()"]
    N2["receiver: apiClient"]
    N3["printClientName()"]
    N4["receiver: none"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

В strict mode `this` будет `undefined`, поэтому попытка прочитать `this.name` приведет к ошибке.

Detached function схема:

```mermaid
flowchart TD
    N1["Object property access"]
    N2["function object extracted"]
    N3["called without object"]
    N4["receiver lost"]
    N5["this is undefined in strict mode"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Это одна из самых частых ошибок в JavaScript.

---

### Arrow Function overview

Arrow Functions ведут себя с `this` иначе, но в этой главе мы не разбираем lexical `this` глубоко.

Достаточно зафиксировать:

```mermaid
flowchart TD
    N1["Regular function"]
    N2["this depends on invocation"]
    N3["Arrow function"]
    N4["this is not determined by its own invocation"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Arrow function preview:

```mermaid
flowchart TD
    N1["Arrow Function"]
    N2["useful compact syntax"]
    N3["has special this behavior"]
    N4["detailed mechanics later"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Не используйте Arrow Function как "просто короткую method syntax" для object methods, если внутри нужен `this`.

Подробности lexical `this` будут изучаться позже, когда появятся callbacks и более сложные function patterns.

---

## Внутренний механизм

### Execution Context revisit

Когда function call начинается, JavaScript создает Function Execution Context.

В главах раньше мы смотрели на:

```mermaid
flowchart TD
    N1["Function Execution Context"]
    N2["local identifiers"]
    N3["параметры"]
    N4["link to lexical environment"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Теперь добавляем еще один вопрос:

```mermaid
flowchart TD
    N1["Function Execution Context"]
    N2["variables available through Lexical Environment"]
    N3["this value for current invocation"]
    N1 --> N2
    N1 --> N3
```

Execution Context revisit:

```mermaid
flowchart TD
    N1["вызов функции starts"]
    N2["receiver is determined for this invocation form"]
    N3["Function Execution Context is created"]
    N4["this value is available during выполнение"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Важно: `this` не ищется как обычная variable через Scope Chain.

`this` поиск:

```mermaid
flowchart TD
    N1["Need this"]
    N2["Use this value of current function invocation"]
    N3["Do not search outer scopes like normal identifier"]
    N1 --> N2
    N2 --> N3
```

---

### Invocation flow

Разберем вызов:

```javascript
client.printStatus();
```

Invocation поток:

```mermaid
flowchart TD
    N1["1. Evaluate client"]
    N2["2. Read property printStatus"]
    N3["3. Get function object"]
    N4["4. Call function as method of client"]
    N5["5. For this ordinary method call, receiver is client"]
    N6["6. Execute тело функции"]
    N7["7. Inside body this → client"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 --> N7
```

Выбор объекта выполнения:

```mermaid
flowchart TD
    N1["For ordinary calls in this chapter"]
    N2["object.method()"]
    N3["receiver: object"]
    N4["functionName()"]
    N5["receiver: none"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

Other invocation forms:

```mermaid
flowchart TD
    N1["call / apply / bind / new / classes"]
    N2["later chapters"]
    N1 --> N2
```

Полная картина выполнения:

```mermaid
flowchart TD
    N1["client.printStatus()"]
    N2["receiver selected: client"]
    N3["Function Execution Context"]
    N4["this → client"]
    N5["параметры"]
    N6["local identifiers"]
    N7["тело функции выполняется"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N3 --> N5
    N3 --> N6
    N3 --> N7
```

---

### Closure vs this

Closures и `this` часто путают, потому что обе темы связаны с функциями.

Но они отвечают на разные вопросы.

Closure vs `this`:

```mermaid
flowchart TD
    N1["Closure"]
    N2["Which variables can the function access?"]
    N3["this"]
    N4["Who is the current receiver of this call?"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Environment vs объект выполнения:

```mermaid
flowchart TD
    N1["Lexical Environment"]
    N2["determined by where function was created"]
    N3["this"]
    N4["determined by how function is invoked"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Пример:

```javascript
function createPrinter(prefix) {
  return function printName() {
    console.log(prefix + ': ' + this.name);
  };
}
```

Внутри `printName` есть две разные зависимости:

```mermaid
flowchart TD
    N1["prefix"]
    N2["comes from Closure"]
    N3["this.name"]
    N4["comes from current receiver"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Одна функция может одновременно использовать Closure и `this`, но механизмы разные.

---

### Timeline

Временная шкала:

```mermaid
flowchart TD
    N1["T1 Function object is created"]
    N2["T2 Function may get Lexical Environment reference"]
    N3["T3 Function is stored as object property"]
    N4["T4 Later object.method() is called"]
    N5["T5 Receiver is selected from вызвать expression"]
    N6["T6 this value is set for this invocation"]
    N7["T7 тело функции выполняется"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 --> N7
```

Function creation:

```mermaid
flowchart TD
    N1["Create function object"]
    N2["does not permanently choose this"]
    N1 --> N2
```

Вызов функции:

```mermaid
flowchart TD
    N1["Call function"]
    N2["chooses this for this call"]
    N1 --> N2
```

Это центральная граница главы.

---

## Ментальная модель

### Current объект выполнения

Думайте о `this` как о current объект выполнения card, которую JavaScript кладет перед функцией на время вызова.

Current context card:

```mermaid
flowchart TD
    N1["вызов функции"]
    N2["function object"]
    N3["receiver card"]
    N4["this"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Для `apiClient.request()`:

```mermaid
flowchart TD
    N1["receiver card"]
    N2["apiClient"]
    N1 --> N2
```

Для `request()`:

```mermaid
flowchart TD
    N1["receiver card"]
    N2["none"]
    N1 --> N2
```

---

### Current owner

Модель "current owner" полезна, если не понимать ее буквально.

```mermaid
flowchart TD
    N1["object.method()"]
    N2["object is current owner for this call"]
    N1 --> N2
```

Функция не принадлежит object навсегда.

```mermaid
flowchart TD
    N1["Function object"]
    N2["can be stored in user"]
    N3["can be stored in admin"]
    N4["can be called without object"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Active object:

```mermaid
flowchart TD
    N1["Call expression"]
    N2["chooses active object"]
    N3["this"]
    N1 --> N2
    N2 --> N3
```

---

### Current speaker

Еще одна модель:

```mermaid
flowchart TD
    N1["method body"]
    N2["says &quot;this&quot;"]
    N3["&quot;the object speaking right now&quot;"]
    N1 --> N2
    N1 --> N3
```

Current speaker:

```mermaid
flowchart TD
    N1["user.sayName()"]
    N2["speaker: user"]
    N3["admin.sayName()"]
    N4["speaker: admin"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Эта модель помогает читать Page Object methods:

```mermaid
flowchart TD
    N1["loginPage.open()"]
    N2["this → loginPage"]
    N1 --> N2
```

Но помните: если method extracted, speaker теряется.

---

### Краткая ментальная модель

```mermaid
flowchart TD
    N1["this"]
    N2["not where function was created"]
    N3["not the function itself"]
    N4["not always the object where function is stored"]
    N5["receiver of current invocation"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
```

Итоговая схема:

```mermaid
flowchart TD
    N1["Call expression"]
    N2["receiver selection"]
    N3["this value"]
    N4["тело функции"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

---

### Текущее место в модели JavaScript

```mermaid
flowchart TD
    N1["JavaScript function model"]
    N2["Function Declaration"]
    N3["Function Expression"]
    N4["Arrow Functions"]
    N5["Parameters"]
    N6["Return"]
    N7["Rest"]
    N8["Spread"]
    N9["Closures"]
    N10["lexical variables"]
    N11["this"]
    N12["current receiver"]
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
    N11 --> N12
```

Переход к call/apply/bind:

```mermaid
flowchart TD
    N1["Regular call"]
    N2["receiver comes from the ordinary invocation form studied here"]
    N3["call / apply / bind"]
    N4["will let us control receiver manually"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

---

## Примеры кода

Примеры находятся в папке:

```text
examples/01-javascript/chapter-29/
```

Запуск:

```bash
node examples/01-javascript/chapter-29/01-global-call.js
node examples/01-javascript/chapter-29/02-method-call.js
node examples/01-javascript/chapter-29/03-detached-function.js
node examples/01-javascript/chapter-29/04-arrow-preview.js
node examples/01-javascript/chapter-29/05-common-mistakes.js
node examples/01-javascript/chapter-29/06-qa-example.js
```

### Global call

```javascript
'use strict';

function showReceiver() {
  console.log(this);
}

showReceiver();
```

Глобальный вызов:

```mermaid
flowchart TD
    N1["showReceiver()"]
    N2["нет receiver"]
    N3["this → undefined"]
    N1 --> N2
    N2 --> N3
```

---

### Method call

```javascript
const apiClient = {
  name: 'staging',
  printName: function () {
    console.log(this.name);
  }
};

apiClient.printName();
```

Вызов метода:

```mermaid
flowchart TD
    N1["apiClient.printName()"]
    N2["this → apiClient"]
    N1 --> N2
```

---

### Detached function

```javascript
'use strict';

const apiClient = {
  name: 'staging',
  getName: function () {
    return this.name;
  }
};

const getClientName = apiClient.getName;

console.log(getClientName());
```

Этот пример intentionally demonstrates an error. Detached function вызывается без объект выполнения, поэтому `this` равен `undefined` в strict mode.

---

### Arrow preview

```javascript
const apiClient = {
  name: 'staging',
  getName: () => {
    return this.name;
  }
};

console.log(apiClient.getName());
```

В Node.js этот пример обычно выводит `undefined`, потому что Arrow Function не получает `this` от вызова `apiClient.getName()`.

Подробная механика Arrow Function и `this` будет разобрана позже.

---

## Частые вопросы

### this - это то же самое, что Closure?

Нет.

```mermaid
flowchart TD
    N1["Closure"]
    N2["variables from Lexical Environment"]
    N3["this"]
    N4["receiver of current invocation"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### this указывает на функцию?

Нет. `this` указывает на объект выполнения текущего вызова, а не на function object.

### this определяется там, где функция написана?

Для обычных functions - нет. `this` определяется тем, как функция вызвана.

### Почему detached function теряет this?

В модели обычных вызовов из этой главы `functionName()` вызывается без object объект выполнения. Поэтому такой вызов не выбирает объект выполнения так же, как `object.method()`.

### Нужно ли всегда избегать this?

Нет. `this` полезен в object methods, page objects, API clients и helper objects. Проблема не в `this`, а в неправильной mental model.

---

## Распространенные мифы

### Миф 1. this всегда указывает на object, где функция была создана

Реальность:

```mermaid
flowchart TD
    N1["Function creation"]
    N2["does not fix this"]
    N3["Function invocation"]
    N4["determines this"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Миф 2. this и Scope Chain работают одинаково

Реальность:

```mermaid
flowchart TD
    N1["identifier lookup"]
    N2["uses Scope Chain"]
    N3["this"]
    N4["uses receiver of current invocation"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Миф 3. Arrow Functions - лучший метод для object methods

Реальность: если method должен использовать объект выполнения через `this`, обычная function часто понятнее. Arrow Functions имеют особое поведение `this`, которое будет изучаться позже.

---

## Типичные ошибки

### Ошибка 1. Потерять объект выполнения

Неправильный код:

```javascript
'use strict';

const helper = {
  prefix: 'API',
  log: function (message) {
    console.log(this.prefix + ': ' + message);
  }
};

const log = helper.log;

log('Request failed');
```

Что произошло:

```mermaid
flowchart TD
    N1["helper.log()"]
    N2["receiver: helper"]
    N3["log()"]
    N4["receiver: none"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Почему это произошло:

```mermaid
flowchart TD
    N1["function object was detached"]
    N2["called without object"]
    N3["this became undefined in strict mode"]
    N1 --> N2
    N2 --> N3
```

Исправленный вариант в рамках уже изученного:

```javascript
helper.log('Request failed');
```

`call()`, `apply()` и `bind()` дадут другие способы управления объект выполнения в следующих главах.

---

### Ошибка 2. Думать, что this берется из Closure

```javascript
function createPrinter(prefix) {
  return function printName() {
    console.log(prefix + ': ' + this.name);
  };
}
```

`prefix` приходит из Closure.

`this.name` приходит из объект выполнения текущего вызова.

Типичные ошибки:

```mermaid
flowchart TD
    N1["prefix"]
    N2["lexical environment"]
    N3["this"]
    N4["current receiver"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

---

### Ошибка 3. Использовать Arrow Function как method с this

```javascript
const user = {
  name: 'Anna',
  getName: () => {
    return this.name;
  }
};
```

Что произошло:

```mermaid
flowchart TD
    N1["apiClient.getName()"]
    N2["method-like call"]
    N3["but arrow does not receive this this way"]
    N1 --> N2
    N2 --> N3
```

Исправленный вариант:

```javascript
const user = {
  name: 'Anna',
  getName: function () {
    return this.name;
  }
};
```

---

## Практическое использование

`this` полезен, когда object хранит данные и поведение рядом.

```javascript
const response = {
  status: 200,
  isSuccessful: function () {
    return this.status === 200;
  }
};
```

Практическая модель:

```mermaid
flowchart TD
    N1["response"]
    N2["data: status"]
    N3["behavior: isSuccessful()"]
    N4["uses this.status"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

`this` делает method reusable внутри object model:

```mermaid
flowchart TD
    N1["объект"]
    N2["state"]
    N3["method"]
    N4["reads current receiver state"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

В обычном прикладном коде это встречается в clients, builders, validators и page objects.

---

## Использование в Automation QA

### Page Object methods

Page Object часто хранит locators, page reference и methods.

```mermaid
flowchart TD
    N1["LoginPage"]
    N2["page"]
    N3["usernameInput"]
    N4["open()"]
    N5["this.page"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

Если method вызывается как `loginPage.open()`, объект выполнения - `loginPage`.

```mermaid
flowchart TD
    N1["loginPage.open()"]
    N2["this → loginPage"]
    N1 --> N2
```

Если method detached, объект выполнения может потеряться.

---

### API client objects

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};
```

QA object example:

```mermaid
flowchart TD
    N1["apiClient.buildUrl('/users')"]
    N2["receiver: apiClient"]
    N3["this.baseUrl → apiClient.baseUrl"]
    N1 --> N2
    N1 --> N3
```

Это помогает держать configuration и поведение рядом.

---

### Helper objects

Helper object:

```mermaid
flowchart TD
    N1["assertions"]
    N2["expectedStatus"]
    N3["validateStatus()"]
    N4["this.expectedStatus"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Понимание `this` помогает:

* читать page object methods;
* находить потерянный объект выполнения;
* понимать ошибки в helper objects;
* не путать Closure configuration и объект выполнения состояние;
* аккуратно проектировать API clients.

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/29-this.md
```

Выполняйте задания после запуска примеров из `examples/01-javascript/chapter-29/`.

Главное упражнение этой главы - для каждого вызова задавать вопрос:

```text
Who is the receiver of this invocation?
```

---

## Решения

Файл с решениями:

```text
solutions/01-javascript/29-this.md
```

В решениях обращайте внимание на reasoning. Для `this` недостаточно назвать результат; нужно объяснить, какая форма invocation выбрала объект выполнения.

---

## Итоги

`this` отвечает на вопрос:

```text
Who is the current receiver?
```

Полная модель:

```mermaid
flowchart TD
    N1["Function object exists"]
    N2["Function is invoked"]
    N3["Invocation form selects receiver"]
    N4["this is set for this call"]
    N5["тело функции выполняется"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Closure и `this` решают разные задачи:

```mermaid
flowchart TD
    N1["Closure"]
    N2["which variables are available?"]
    N3["this"]
    N4["who is the current receiver?"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Следующая глава про `call()` покажет, как выбрать объект выполнения вручную.

---

## Что нужно запомнить

* `this` определяется во время invocation.
* Function creation не фиксирует `this` навсегда.
* В обычном вызове `object.method()` объект выполнения обычно object слева от точки.
* В detached function объект выполнения теряется.
* В strict mode global call дает `this === undefined`.
* Closure отвечает про variables, `this` отвечает про объект выполнения.
* Arrow Functions имеют особое поведение `this`; подробно оно будет изучаться позже.
* Следующие главы покажут другие формы вызова и ручной выбор объект выполнения.

---

## Проверьте себя

Ответьте без запуска кода:

1. Чем Closure отличается от `this`?
2. Что является объект выполнения в вызове `apiClient.buildUrl('/users')`?
3. Почему `const fn = object.method; fn()` может сломать `this`?
4. Когда определяется `this`: при создании функции или при вызове?
5. Почему Arrow Function не стоит механически использовать как object method с `this`?
6. Какую проблему будет решать следующая глава про `call()`?
