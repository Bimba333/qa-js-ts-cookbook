# Parameters

## Связь с предыдущей главой

Предыдущие главы раздела **Functions** показали, как создавать function objects разными способами.

```text
Function Declaration
│
▼
Function Expression
│
▼
Arrow Functions
```

Теперь читатель уже знает:

```text
function object
│
├── можно создать
├── можно сохранить в переменной
└── можно вызвать
```

Но остается следующий вопрос:

> Как функция получает данные?

Например, helper проверяет status code.

```javascript
function validateStatus() {
  console.log('Validate status');
}
```

Но какой именно status code он должен проверить?

```text
200?
201?
404?
500?
```

Главный вопрос этой главы:

> Откуда пришло это значение?

---

## Предварительные требования

Для этой главы нужно понимать:

* что функция - это вызываемый function object;
* что тело функции выполняется только после вызова;
* что Function Declaration, Function Expression и Arrow Function создают функции;
* что переменная может хранить значение;
* что имя должно помогать читать код.

Не требуется знать default parameters, rest parameters, destructuring parameters, `arguments` object, spread, TypeScript parameter types, optional parameters или callbacks. Эти темы будут изучаться позже.

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

Параметры выглядят как маленькая синтаксическая деталь, но именно они превращают фиксированный helper в переиспользуемый инструмент.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/23-arrow-functions.md
```

Текущая глава:

```text
docs/01-javascript/24-parameters.md
```

Следующая глава:

```text
docs/01-javascript/25-return.md
```

Следующая глава ответит:

> Как функция отправляет данные обратно?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существуют параметры;
* что такое parameter;
* что такое argument;
* чем parameter отличается от argument;
* как вызов функции передает значения;
* как работает функция без параметров;
* как работает один параметр;
* как работают несколько параметров;
* почему сопоставление идет по позиции;
* что происходит при missing arguments на высоком уровне;
* что происходит при extra arguments на высоком уровне;
* почему имена параметров важны;
* как параметры используются в Automation QA.

---

## Мотивация

Начнем с реальной проблемы.

Есть helper:

```javascript
function validateStatus() {
  console.log('Validate status');
}
```

Он называется правильно, но данных ему не хватает.

```text
validateStatus
│
└── что проверять?
```

Если зашить значение внутрь:

```javascript
function validateStatus() {
  const statusCode = 200;
  console.log(statusCode);
}
```

helper всегда будет проверять только `200`.

Проблема:

```text
Один алгоритм
│
▼
разные входные значения
│
▼
нужен способ передать данные при вызове
```

Именно для этого существуют параметры.

Why parameters exist:

```text
Reusable function
│
▼
needs external data
│
▼
function receives data
│
▼
parameters
```

Главный вопрос:

> Откуда пришло это значение?

---

## Теория

### Зачем существуют параметры

Параметры нужны, чтобы функция могла получать данные извне.

Без параметров:

```text
function body
│
└── работает только с тем, что уже внутри
```

С параметрами:

```text
function call
│
▼
passes value
│
▼
function receives value
│
▼
body uses value
```

Function receives data:

```text
Outside function
│
└── statusCode = 200
    │
    ▼
Function boundary
    │
    ▼
Inside function
│
└── parameter receives value
```

Параметр делает helper гибким:

```text
validateStatus(200)
validateStatus(201)
validateStatus(404)
```

Один алгоритм. Разные входные значения.

### Parameter

Parameter - это имя внутри определения функции, через которое функция получает значение.

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}
```

Схема:

```text
function validateStatus(statusCode)
                        │
                        └── parameter
```

Parameter belongs to function definition:

```text
Function definition
│
└── parameter name
    │
    └── statusCode
```

Параметр похож на локальное имя для входного значения.

### Argument

Argument - это значение, которое передается при вызове функции.

```javascript
validateStatus(200);
```

Схема:

```text
validateStatus(200)
               │
               └── argument
```

Argument belongs to function call:

```text
Function invocation
│
└── argument value
    │
    └── 200
```

Главное различие:

```text
Parameter
│
└── имя в определении функции

Argument
│
└── значение в вызове функции
```

### Argument → Parameter

При вызове JavaScript сопоставляет argument с parameter.

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus(200);
```

Схема:

```text
Argument
│
└── 200
    │
    ▼
Parameter
│
└── statusCode
```

Data flow:

```text
validateStatus(200)
│              │
│              └── argument
│
▼
function validateStatus(statusCode)
                        │
                        └── parameter receives 200
```

Внутри функции имя `statusCode` становится способом обратиться к переданному значению.

### Invocation with arguments

Вызов с аргументами выглядит так:

```javascript
validateStatus(200);
```

Invocation lifecycle:

```text
Program reaches function call
│
▼
evaluates argument value
│
▼
enters function
│
▼
parameter receives value
│
▼
body executes
```

Главный вопрос:

```text
Where did this value come from?
│
└── from the argument in the call
```

### Zero parameters

Функция может не получать данные.

```javascript
function printTestStart() {
  console.log('Test started');
}

printTestStart();
```

Zero parameters:

```text
function printTestStart()
                       │
                       └── no parameters

printTestStart()
              │
              └── no arguments
```

Такая функция выполняет фиксированное действие.

### One parameter

Функция может получать одно значение.

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus(200);
```

One parameter:

```text
parameter
│
└── statusCode

argument
│
└── 200
```

Matching:

```text
200
│
▼
statusCode
```

### Multiple parameters

Функция может получать несколько значений.

```javascript
function compareStatus(actualStatus, expectedStatus) {
  console.log(actualStatus === expectedStatus);
}

compareStatus(200, 200);
```

Multiple parameters:

```text
function compareStatus(actualStatus, expectedStatus)
                       │             │
                       │             └── parameter 2
                       └── parameter 1
```

Arguments:

```text
compareStatus(200, 200)
              │    │
              │    └── argument 2
              └── argument 1
```

### Matching by position

JavaScript сопоставляет arguments и parameters по позиции.

```text
compareStatus(200, 201)
              │    │
              │    └── goes to expectedStatus
              └── goes to actualStatus
```

Схема:

```text
Argument 1 → Parameter 1
Argument 2 → Parameter 2
Argument 3 → Parameter 3
```

Для примера:

```text
200 → actualStatus
201 → expectedStatus
```

Имена аргументов не передаются. Передаются значения, и JavaScript кладет их по порядку.

### Missing arguments

Если аргумент не передан, параметр получает `undefined` на высоком уровне.

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus();
```

Схема:

```text
parameter exists
│
└── statusCode

argument missing
│
▼
statusCode receives undefined
```

Это не default parameter. Default parameters будут изучаться позже.

### Extra arguments

Если аргументов больше, чем параметров, лишние значения на этом уровне просто не получают имени параметра.

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus(200, 201);
```

Схема:

```text
200 → statusCode
201 → no parameter name here
```

Extra argument:

```text
Argument 1
│
└── used

Argument 2
│
└── extra at this level
```

Объект `arguments`, rest parameters и spread будут изучаться позже.

### Parameter names

Имя параметра должно объяснять, какое значение ожидает функция.

Плохо:

```javascript
function validateStatus(x) {
  console.log(x);
}
```

Лучше:

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}
```

Parameter naming:

```text
Bad name
│
└── x

Good name
│
└── statusCode
```

Хорошее имя отвечает на вопрос:

```text
Что за значение пришло в функцию?
```

---

## Внутренний механизм

На концептуальном уровне вызов функции создает момент передачи данных.

```text
Function call
│
├── function object
├── argument values
└── invocation
```

Function boundary:

```text
Outside
│
├── actual value: 200
│
▼
Boundary: function call
│
▼
Inside
│
└── parameter name: statusCode
```

Что делает движок:

```text
I reach validateStatus(200).
│
▼
I identify the function object.
│
▼
I evaluate the argument 200.
│
▼
I enter the function body.
│
▼
I make 200 available as statusCode.
│
▼
I execute the body.
```

Current position in JavaScript model:

```text
Functions
│
├── Function Declaration
├── Function Expression
├── Arrow Functions
└── Parameters
    │
    └── function receives data
```

Complete parameter model:

```text
Function definition
│
└── parameters
    │
    ▼
Function call
│
└── arguments
    │
    ▼
Arguments become available
through parameters
```

Переход к Return:

```text
Parameters
│
└── data enters function
    │
    ▼
Next question
│
└── how does data leave function?
    │
    ▼
Return
```

---

## Ментальная модель

### Package delivery

Аргумент похож на посылку.

```text
Call site
│
└── sends package: 200
    │
    ▼
Function
│
└── receives package as statusCode
```

### Mailbox

Параметр похож на почтовый ящик с именем.

```text
Mailbox name: statusCode
│
└── received value: 200
```

### Form fields

Функция похожа на форму.

```text
Form field
│
└── statusCode

Submitted value
│
└── 200
```

### Machine input

```text
Machine: validateStatus
│
├── input slot: statusCode
└── input value: 200
```

### Recipe ingredients

```text
Recipe
│
└── needs ingredient: statusCode

Invocation
│
└── gives ingredient: 200
```

Краткая ментальная модель:

```text
Parameter
│
└── named receiving place

Argument
│
└── value sent during call

Function body
│
└── uses parameter name
```

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-27/
```

Запуск:

```bash
node examples/chapter-27/01-no-parameters.js
node examples/chapter-27/02-one-parameter.js
node examples/chapter-27/03-multiple-parameters.js
node examples/chapter-27/04-missing-extra-arguments.js
node examples/chapter-27/05-common-mistakes.js
node examples/chapter-27/06-qa-example.js
```

### 01-no-parameters.js

Показывает функцию без параметров.

### 02-one-parameter.js

Показывает один parameter и один argument.

### 03-multiple-parameters.js

Показывает сопоставление нескольких arguments с parameters по позиции.

### 04-missing-extra-arguments.js

Показывает missing argument и extra argument на высоком уровне.

### 05-common-mistakes.js

Показывает ошибку порядка аргументов.

### 06-qa-example.js

Показывает QA validator, который получает expected и actual values.

---

## Частые вопросы

### Parameter и argument - это одно и то же?

Нет. Parameter находится в определении функции. Argument находится в вызове функции.

### Почему важно различать эти слова?

Потому что они отвечают за разные места кода. Parameter говорит, как функция назовет полученное значение. Argument говорит, какое значение реально передано.

### Что будет, если argument не передать?

На этом уровне можно считать, что parameter получит `undefined`. Более сложные способы обработки отсутствующих значений будут изучаться позже.

### Что будет, если передать лишний argument?

Если для него нет parameter, в обычном чтении функции он не получает имени. Rest parameters и `arguments` object будут изучаться позже.

### Можно ли использовать parameters в Arrow Functions?

Да. Параметры есть у Function Declaration, Function Expression и Arrow Functions.

### Можно ли указать тип parameter?

В JavaScript - нет. TypeScript parameter types будут изучаться в части TypeScript.

---

## Распространенные мифы

### Миф: parameter и argument - синонимы

Реальность:

Parameter принадлежит определению функции. Argument принадлежит вызову функции.

### Миф: JavaScript сопоставляет значения по именам

Реальность:

Arguments сопоставляются с parameters по позиции.

### Миф: missing argument всегда ошибка

Реальность:

На уровне JavaScript это допустимо, но parameter получит `undefined`, если нет другого механизма.

### Миф: extra arguments всегда ломают функцию

Реальность:

На этом уровне лишний argument просто не получает имени parameter.

Схема типичных ошибок:

```text
Ошибка
│
├── путать parameter и argument
├── передать значения в неправильном порядке
├── использовать неясные имена параметров
├── забыть argument
└── ожидать проверку типов от JavaScript
```

---

## Типичные ошибки

### Ошибка 1. Путать parameter и argument

Неправильное объяснение:

```text
В validateStatus(statusCode) значение statusCode - это argument.
```

Правильно:

```text
statusCode в определении функции - parameter.
200 в validateStatus(200) - argument.
```

### Ошибка 2. Неправильный порядок arguments

```javascript
function compareStatus(actualStatus, expectedStatus) {
  console.log(actualStatus === expectedStatus);
}

compareStatus(200, 201);
```

Сопоставление:

```text
200 → actualStatus
201 → expectedStatus
```

Если перепутать порядок, функция будет сравнивать не то.

### Ошибка 3. Неясные имена parameters

Плохо:

```javascript
function compare(a, b) {
  console.log(a === b);
}
```

Лучше:

```javascript
function compareStatus(actualStatus, expectedStatus) {
  console.log(actualStatus === expectedStatus);
}
```

### Ошибка 4. Missing argument

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus();
```

`statusCode` получает `undefined`.

### Ошибка 5. Extra argument

```javascript
function validateStatus(statusCode) {
  console.log(statusCode);
}

validateStatus(200, 201);
```

`200` попадает в `statusCode`. `201` лишний на этом уровне.

---

## Практическое использование

Параметры нужны, когда один helper должен работать с разными данными.

```text
Один helper
│
├── validateStatus(200)
├── validateStatus(201)
└── validateStatus(404)
```

Практический чек-лист:

```text
1. Какие данные нужны функции?
2. Как назвать parameter?
3. Где передается argument?
4. Совпадает ли порядок arguments с parameters?
5. Понятна ли сигнатура helper?
```

Readable parameter naming:

```text
statusCode
expectedStatus
actualStatus
userEmail
profileLocator
```

---

## Использование в Automation QA

### Validators receiving expected values

```javascript
function validateStatus(actualStatus, expectedStatus) {
  console.log(actualStatus === expectedStatus);
}

validateStatus(200, 200);
```

QA validator:

```text
actualStatus
│
└── value from API response

expectedStatus
│
└── value from test expectation
```

### API status validation

```javascript
function validateApiStatus(statusCode) {
  console.log(statusCode);
}

validateApiStatus(200);
```

### Reusable helpers

```javascript
function openUserProfile(userId) {
  console.log(userId);
}
```

`userId` делает helper переиспользуемым.

### Passing locators

```javascript
function clickElement(locatorName) {
  console.log(locatorName);
}

clickElement('profile button');
```

Playwright locators будут изучаться позже. Здесь важно увидеть саму идею передачи значения.

### Passing test data

```javascript
function createUser(userEmail) {
  console.log(userEmail);
}

createUser('anna@example.com');
```

### Readable helper signatures

```text
Good helper signature
│
└── validateStatus(actualStatus, expectedStatus)

Poor helper signature
│
└── validate(a, b)
```

Сигнатура helper должна объяснять, какие данные нужны функции.

---

## Итоги

Параметры отвечают на вопрос:

```text
Как функция получает данные?
```

Главная модель:

```text
Function definition
│
└── parameters

Function call
│
└── arguments

Argument value
│
▼
Parameter name
│
▼
Function body uses value
```

Самое важное:

```text
Parameters belong to the function definition.
Arguments belong to the function call.
Arguments become available inside the function through parameters.
```

Следующая глава ответит:

```text
Как функция отправляет данные обратно?
```

Это тема Return.

---

## Что нужно запомнить

* Parameter - имя в определении функции.
* Argument - значение в вызове функции.
* Function receives data through parameters.
* Invocation supplies arguments.
* Arguments сопоставляются с parameters по позиции.
* Missing argument дает parameter значение `undefined` на высоком уровне.
* Extra argument может не получить имени parameter.
* Имена parameters должны объяснять входные данные.
* В Automation QA параметры делают helpers и validators переиспользуемыми.
* Default parameters, rest parameters, destructuring, spread, TypeScript types и callbacks будут позже.

---

## Проверьте себя

Ответьте без запуска кода.

1. Зачем существуют параметры?
2. Что такое parameter?
3. Что такое argument?
4. Где находится parameter: в определении или вызове?
5. Где находится argument: в определении или вызове?
6. Как argument становится доступным внутри функции?
7. Как JavaScript сопоставляет arguments и parameters?
8. Что происходит при missing argument?
9. Что происходит при extra argument?
10. Почему имя parameter важно для Automation QA?

---

## Практика

Практика находится в файле:

```text
practice/chapter-27.md
```

Сначала решайте задания на предсказание вывода без запуска. Главная цель - не смешивать parameter и argument.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-27.md
```

Читайте решения после самостоятельной попытки. Проверяйте главный вопрос: откуда пришло это значение?
