# Rest Parameters

## Связь с предыдущей главой

Предыдущие главы объяснили две стороны функции:

```text
Parameters
│
└── данные входят в функцию

Return
│
└── данные выходят из функции
```

Теперь появляется следующий вопрос:

> Что если функция заранее не знает, сколько arguments получит?

Например, сегодня validator проверяет один status code:

```javascript
validateStatuses(200);
```

Завтра - три:

```javascript
validateStatuses(200, 201, 204);
```

Через неделю - десять.

Главный вопрос этой главы:

> Как функция собирает все входящие arguments?

---

## Предварительные требования

Для этой главы нужно понимать:

* что arguments передаются при вызове функции;
* что parameters получают arguments по позиции;
* что `return` отправляет результат вызывающий код;
* что array может хранить несколько значений на высоком уровне;
* что helper должен иметь читаемую сигнатуру.

Не требуется знать Spread syntax, destructuring with rest, `arguments` object, array methods, callbacks, higher-order functions или TypeScript tuple rest types. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            100-130 минут
Разбор схем:             35-55 минут
Запуск примеров:         20-30 минут
Практика:                90-120 минут
Повторение материала:    25 минут
```

Уровень сложности: **L3**.

Rest Parameters выглядят как три точки, но важно не заучить символы, а увидеть механизм сбора arguments.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/25-return.md
```

Текущая глава:

```text
docs/01-javascript/26-rest.md
```

Следующая глава:

```text
docs/01-javascript/27-spread.md
```

Следующая глава ответит:

> Как распаковать значения из array или object?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существуют Rest Parameters;
* что делать с неизвестным количеством arguments;
* что означает синтаксис `...rest`;
* как rest parameter собирает arguments;
* почему rest parameter становится array;
* как работает один rest parameter;
* где должен находиться rest parameter;
* что происходит при нуле собранных значений;
* как читать helper APIs с rest parameter;
* какие ошибки встречаются чаще всего;
* как Rest Parameters применяются в Automation QA.

---

## Мотивация

Начнем с обычных parameters.

```javascript
function compareStatus(actualStatus, expectedStatus) {
  return actualStatus === expectedStatus;
}
```

Эта функция знает заранее:

```text
Parameter 1 → actualStatus
Parameter 2 → expectedStatus
```

Но иногда количество arguments заранее неизвестно.

```javascript
validateStatuses(200);
validateStatuses(200, 201, 204);
validateStatuses(200, 201, 204, 301, 404);
```

Проблема:

```text
One helper
│
▼
unknown number of arguments
│
▼
need one receiving place
│
▼
Rest Parameter
```

Why Rest Parameters exist:

```text
Fixed parameters
│
└── good for known inputs

Unknown arguments
│
└── need collection mechanism

Rest parameter
│
└── collects remaining arguments
```

---

## Теория

### Зачем существуют Rest Parameters

Rest Parameters существуют, чтобы функция могла принять неизвестное количество arguments.

Fixed parameters:

```text
function validateStatus(statusCode)
                        │
                        └── one known value
```

Unknown number of arguments:

```text
validateStatuses(200)
validateStatuses(200, 201)
validateStatuses(200, 201, 204)
```

Rest collection:

```text
incoming arguments
│
├── 200
├── 201
└── 204
    │
    ▼
rest parameter
│
└── [200, 201, 204]
```

### Синтаксис ...rest

Rest parameter записывается с тремя точками перед именем.

```javascript
function validateStatuses(...statusCodes) {
  console.log(statusCodes);
}
```

Схема:

```text
...statusCodes
│  │
│  └── parameter name
└── rest syntax
```

Важно:

```text
...statusCodes
│
└── collect remaining arguments into array
```

Это не Spread syntax. Spread будет изучаться в следующей главе.

### Collecting arguments

При вызове все подходящие arguments собираются в rest parameter.

```javascript
validateStatuses(200, 201, 204);
```

Argument flow:

```text
200
201
204
│
▼
...statusCodes
│
▼
[200, 201, 204]
```

Rest array:

```text
statusCodes
│
└── array
    │
    ├── 200
    ├── 201
    └── 204
```

Внутри функции `statusCodes` - обычное имя parameter, но значение в нем array.

### Rest parameter as an array

Rest parameter получает array.

```javascript
function validateStatuses(...statusCodes) {
  console.log(Array.isArray(statusCodes));
}
```

Модель:

```text
Rest parameter
│
└── receives array
    │
    └── collected arguments
```

Эта глава не изучает array methods. Пока важно только понять форму данных:

```text
many arguments
│
▼
one array
```

### One rest parameter

Функция может иметь один rest parameter.

```javascript
function collectStatuses(...statusCodes) {
  console.log(statusCodes);
}
```

One rest parameter:

```text
function collectStatuses(...statusCodes)
                         │
                         └── one rest parameter
```

Не нужно добавлять второй rest parameter.

```text
Good
│
└── (...statusCodes)

Bad
│
└── (...statusCodes, ...messages)
```

Второй вариант недопустим синтаксически.

### Rest parameter position

Rest parameter должен быть последним в списке parameters.

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {
  console.log(expectedStatus);
  console.log(actualStatuses);
}
```

Rest position:

```text
expectedStatus
│
└── normal parameter

...actualStatuses
│
└── rest parameter at the end
```

Почему в конце:

```text
normal parameters
│
└── receive known positions

rest parameter
│
└── collects everything remaining
```

Если rest parameter не последний, JavaScript не сможет понять, что должно остаться для следующих parameters.

### One parameter + Rest

Можно сочетать обычный parameter и rest parameter.

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {
  console.log(expectedStatus);
  console.log(actualStatuses);
}

validateStatuses(200, 200, 201, 204);
```

Parameter matching:

```text
Argument 1 → expectedStatus
Arguments 2..n → actualStatuses
```

Схема:

```text
validateStatuses(200, 200, 201, 204)
                 │    │    │    │
                 │    └────┴────┴── collected by rest
                 └── expectedStatus
```

Результат:

```text
expectedStatus  → 200
actualStatuses  → [200, 201, 204]
```

### Zero collected values

Rest parameter может собрать ноль значений.

```javascript
function collectStatuses(...statusCodes) {
  console.log(statusCodes);
}

collectStatuses();
```

Zero arguments:

```text
no incoming arguments
│
▼
rest parameter
│
▼
[]
```

Это не `undefined`. Это empty array.

### Many arguments

Если arguments много, rest parameter соберет их в один array.

```javascript
collectStatuses(200, 201, 204, 301, 404);
```

Many arguments:

```text
200
201
204
301
404
│
▼
[200, 201, 204, 301, 404]
```

Function input model:

```text
Known inputs
│
└── normal parameters

Unknown remaining inputs
│
└── rest parameter
```

### Читаемость

Rest parameter должен быть назван как collection.

Плохо:

```javascript
function validateStatuses(...statusCode) {}
```

Лучше:

```javascript
function validateStatuses(...statusCodes) {}
```

Читаемость:

```text
Singular name
│
└── suggests one value

Plural name
│
└── suggests collection
```

Хорошие имена:

```text
statusCodes
userEmails
messages
locatorNames
```

---

## Внутренний механизм

На концептуальном уровне rest parameter работает после обычного positional matching.

Invocation lifecycle:

```text
Function call starts
│
▼
Arguments arrive one by one
│
▼
Normal parameters receive known positions
│
▼
Rest parameter collects remaining values
│
▼
Function body executes
```

Rest collection timeline:

```text
Call: validateStatuses(200, 200, 201)
│
├── argument 1 goes to expectedStatus
├── argument 2 goes into rest array
└── argument 3 goes into rest array
```

Function boundary:

```text
Outside function
│
└── many separate arguments
    │
    ▼
Function boundary
    │
    ▼
Inside function
│
└── one array parameter
```

Что делает движок:

```text
I see validateStatuses(200, 200, 201).
│
▼
I match first argument to expectedStatus.
│
▼
I collect remaining arguments.
│
▼
I create an array for actualStatuses.
│
▼
I run the function body.
```

Current position in JavaScript model:

```text
Functions
│
├── Parameters
│   └── known inputs
├── Return
│   └── output
└── Rest Parameters
    └── unknown number of inputs
```

Переход к Spread:

```text
Rest Parameters
│
└── collect many arguments into array
    │
    ▼
Next question
│
└── how to unpack array values?
    │
    ▼
Spread
```

Spread будет изучаться в следующей главе. В этой главе важно только направление Rest: many incoming arguments → one array.

---

## Ментальная модель

### Корзина

Rest parameter похож на корзину.

```text
Arguments
│
├── 200
├── 201
└── 204
    │
    ▼
Basket
│
└── [200, 201, 204]
```

### Коробка

```text
Box: statusCodes
│
├── item 1: 200
├── item 2: 201
└── item 3: 204
```

### Пакет для покупок

```text
At checkout
│
├── item
├── item
└── item
    │
    ▼
One shopping bag
```

### Лоток для сбора

```text
Incoming values
│
▼
Collection tray
│
└── rest array
```

### Mailbox receiving many letters

```text
Mailbox: messages
│
├── letter 1
├── letter 2
└── letter 3
```

Краткая ментальная модель:

```text
Arguments arrive one by one.
Normal parameters receive known values.
Rest parameter collects remaining arguments.
Collected values become one array.
```

Complete Rest model:

```text
function helper(first, ...rest)
│
├── first argument → first
└── remaining arguments → rest array
```

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-29/
```

Запуск:

```bash
node examples/chapter-29/01-rest-basic.js
node examples/chapter-29/02-rest-array.js
node examples/chapter-29/03-rest-position.js
node examples/chapter-29/04-zero-many-arguments.js
node examples/chapter-29/05-common-mistakes.js
node examples/chapter-29/06-qa-example.js
```

### 01-rest-basic.js

Показывает базовый rest parameter.

### 02-rest-array.js

Показывает, что rest parameter получает array.

### 03-rest-position.js

Показывает обычный parameter плюс rest parameter в конце.

### 04-zero-many-arguments.js

Показывает empty array при нуле arguments и array при многих arguments.

### 05-common-mistakes.js

Показывает ошибку чтения: rest parameter - collection, а не одно значение.

### 06-qa-example.js

Показывает QA helper, который принимает много actual statuses.

---

## Частые вопросы

### Rest Parameter и Spread - это одно и то же?

Нет. В этой главе Rest собирает incoming arguments в array. Spread будет изучаться в следующей главе.

### Rest parameter получает undefined, если arguments нет?

Нет. Он получает empty array.

### Можно ли поставить rest parameter первым?

Нет, если после него есть другие parameters. Rest parameter должен быть последним.

### Можно ли иметь два rest parameters?

Нет. Один rest parameter собирает все оставшиеся arguments.

### Rest parameter - это arguments object?

Нет. `arguments` object будет изучаться позже. Rest parameter дает обычный array.

### Нужно ли знать array methods?

Пока нет. В этой главе важно понять сбор values в array.

---

## Распространенные мифы

### Миф: rest parameter собирает только один argument

Реальность:

Rest parameter собирает все remaining arguments в array.

### Миф: если arguments нет, rest parameter равен undefined

Реальность:

Он равен empty array.

### Миф: rest parameter можно поставить где угодно

Реальность:

Он должен быть последним parameter.

### Миф: Rest и Spread можно изучить как одну тему

Реальность:

У них одинаковые три точки, но направление разное. Spread будет изучаться отдельно.

Схема типичных ошибок:

```text
Ошибка
│
├── поставить rest не последним
├── ждать undefined вместо []
├── назвать collection singular name
├── объяснять Rest через Spread
└── использовать rest там, где inputs fixed
```

---

## Типичные ошибки

### Ошибка 1. Rest parameter не последний

Неправильно:

```javascript
function validateStatuses(...actualStatuses, expectedStatus) {}
```

Правильно:

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {}
```

### Ошибка 2. Ожидать undefined

```javascript
function collectStatuses(...statusCodes) {
  console.log(statusCodes);
}

collectStatuses();
```

Результат:

```text
[]
```

### Ошибка 3. Плохое имя

Плохо:

```javascript
function collectStatuses(...statusCode) {}
```

Лучше:

```javascript
function collectStatuses(...statusCodes) {}
```

### Ошибка 4. Использовать rest для fixed inputs

Если функция всегда получает `actualStatus` и `expectedStatus`, обычные parameters читаются лучше.

```javascript
function compareStatus(actualStatus, expectedStatus) {}
```

### Ошибка 5. Объяснять Rest через Spread

В этой главе модель простая:

```text
Rest
│
└── many arguments into one array
```

Spread будет позже.

---

## Практическое использование

Rest Parameters полезны, когда helper должен принимать переменное количество значений.

```text
validateStatuses(200)
validateStatuses(200, 201)
validateStatuses(200, 201, 204)
```

Практический чек-лист:

```text
1. Количество arguments заранее известно?
2. Если известно, нужны обычные parameters.
3. Если неизвестно, может помочь rest parameter.
4. Rest parameter стоит последним?
5. Имя rest parameter выглядит как collection?
```

Readable helper API:

```text
logMessages(...messages)
collectUserEmails(...userEmails)
validateStatuses(expectedStatus, ...actualStatuses)
```

---

## Использование в Automation QA

### Validators receiving many values

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {
  console.log(expectedStatus);
  console.log(actualStatuses);
}
```

QA helper example:

```text
expectedStatus
│
└── known value

actualStatuses
│
└── collected actual values
```

### Collecting test data

```javascript
function collectUserEmails(...userEmails) {
  console.log(userEmails);
}
```

### Helper APIs

Rest parameter делает API helper гибким, но не должен скрывать смысл.

```text
Good
│
└── logMessages(...messages)

Questionable
│
└── validateEverything(...items)
```

### Flexible logging helpers

```javascript
function logMessages(...messages) {
  console.log(messages);
}
```

### Reusable utility functions

```javascript
function collectLocatorNames(...locatorNames) {
  return locatorNames;
}
```

Spread не нужен для понимания этих examples. Здесь функция только собирает incoming arguments.

---

## Итоги

Rest Parameters отвечают на вопрос:

```text
Что если функция заранее не знает,
сколько arguments получит?
```

Главная модель:

```text
Arguments enter a function.
Normal parameters receive known values.
Rest Parameter collects all remaining arguments into one array.
```

Ключевой поток:

```text
arg1, arg2, arg3
│
▼
...rest
│
▼
[arg1, arg2, arg3]
```

Следующая глава ответит:

```text
Как распаковать значения из array или object?
```

Это тема Spread.

---

## Что нужно запомнить

* Rest parameter собирает remaining arguments.
* Синтаксис rest parameter: `...name`.
* Rest parameter получает array.
* Если values нет, rest parameter получает `[]`.
* Rest parameter должен быть последним.
* Обычные parameters получают known values.
* Rest parameter получает unknown remaining values.
* Имя rest parameter должно звучать как collection.
* В Automation QA Rest полезен для flexible helpers и logging utilities.
* Spread syntax, destructuring, `arguments` object, callbacks и TypeScript tuple rest types будут позже.

---

## Проверьте себя

Ответьте без запуска кода.

1. Зачем существуют Rest Parameters?
2. Что означает `...statusCodes` в parameter list?
3. Что собирает rest parameter?
4. Какой тип значения получает rest parameter?
5. Что будет внутри rest array при нуле arguments?
6. Почему rest parameter должен быть последним?
7. Что получает обычный parameter перед rest parameter?
8. Почему имя rest parameter лучше писать во множественном числе?
9. Где Rest Parameters полезны в Automation QA?
10. Какая тема идет следующей?

---

## Практика

Практика находится в файле:

```text
practice/chapter-29.md
```

Сначала решайте задания на предсказание вывода без запуска. Главная цель - видеть, что находится внутри rest array.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-29.md
```

Читайте решения после самостоятельной попытки. Проверяйте главный вопрос: как функция собирает все входящие arguments?
