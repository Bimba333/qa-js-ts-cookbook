# Function Expression

## Связь с предыдущей главой

В предыдущей главе функция была представлена как именованный переиспользуемый алгоритм.

```text
Function Declaration
│
├── создает функцию с именем
├── тело не выполняется при объявлении
└── выполнение начинается при вызове
```

Теперь появляется следующий вопрос:

> Может ли сама функция быть значением?

Мы уже знаем, что переменные могут хранить значения:

```text
number
string
boolean
object
```

Но JavaScript идет дальше:

```text
переменная
│
└── может хранить функцию
```

Главный вопрос этой главы:

> Какое значение хранит эта переменная?

---

## Предварительные требования

Для этой главы нужно понимать:

* что функция - это переиспользуемый алгоритм;
* что объявление функции не запускает ее тело;
* что переменная может хранить значение;
* что объектные значения отличаются от примитивных;
* что имя помогает читать код;
* что вызов функции выполняет ее тело.

Не требуется знать arrow functions, callbacks, higher-order functions, closures, `this`, IIFE, параметры в глубину или возвращаемые значения в глубину. Эти темы будут изучаться позже.

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

Function Expression кажется небольшим изменением синтаксиса, но на самом деле это переход к важной идее JavaScript: функция может быть значением.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/21-function-declaration.md
```

Текущая глава:

```text
docs/01-javascript/22-function-expression.md
```

Следующая глава:

```text
docs/01-javascript/23-arrow-functions.md
```

Следующая глава ответит:

> Есть ли более короткий синтаксис для создания function object?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существуют Function Expressions;
* что функция может быть значением;
* как переменная может хранить функцию;
* что такое anonymous function expression;
* что такое named function expression на высоком уровне;
* чем function declaration отличается от function expression;
* как создать и вызвать Function Expression;
* почему вызов идет через переменную;
* как выбирать читаемый вариант;
* какие ошибки чаще всего встречаются;
* как эта идея применяется в Automation QA.

---

## Мотивация

Начнем не с синтаксиса, а с уже знакомой идеи.

Переменная может хранить число:

```javascript
const statusCode = 200;
```

Переменная может хранить строку:

```javascript
const userRole = 'admin';
```

Переменная может хранить object:

```javascript
const user = {
  name: 'Anna'
};
```

Возникает вопрос:

```text
Если функция тоже значение,
может ли переменная хранить функцию?
```

Ответ JavaScript:

```text
да
```

Это и приводит к Function Expression.

Проблема:

```text
Мы хотим создать функцию
и сохранить ее как значение
под именем переменной.
```

Схема мотивации:

```text
Нужен переиспользуемый алгоритм
│
▼
Этот алгоритм должен быть значением
│
▼
Значение нужно сохранить в переменной
│
▼
Function Expression
```

Главный вопрос остается тем же:

> Какое значение хранит эта переменная?

---

## Теория

### Зачем существуют Function Expressions

Function Expressions существуют потому, что JavaScript позволяет обращаться с функциями как со значениями.

Это значит:

```text
функцию можно создать
│
▼
получить function object
│
▼
сохранить это значение в переменной
│
▼
вызвать через переменную
```

Схема "зачем expressions":

```text
Function Declaration
│
└── функция создается через объявление

Function Expression
│
└── функция создается как значение выражения
```

Function Expression не заменяет Function Declaration. Это другой способ создать function object.

### Функция как значение

В JavaScript функция - это специальный объект, который можно вызывать.

```text
Значения JavaScript
│
├── Primitive values
│
└── Object values
    │
    ├── Ordinary objects
    └── Function objects
```

Функция остается алгоритмом, но теперь мы смотрим на нее с другой стороны:

```text
Функция как алгоритм
│
└── что выполняется при вызове

Функция как значение
│
└── специальный object value, который можно сохранить в переменной
```

Function object model:

```text
function object
│
├── содержит тело
├── может быть сохранено
├── может быть вызвано
└── может иметь имя или быть anonymous
```

В этой главе мы не изучаем callbacks. Позже станет важно, что function object можно не только хранить, но и передавать в другие функции.

### Присваивание функции переменной

Function Expression часто выглядит так:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Здесь переменная `validateStatus` хранит function object.

Схема:

```text
const validateStatus
│
▼
переменная
│
▼
хранит function object
```

Variable storing function:

```text
validateStatus
│
└── function object
    │
    └── console.log('Status is valid')
```

Важно:

```text
function () { ... }
│
▼
создает функцию как значение
│
▼
это значение присваивается переменной
```

### Anonymous Function Expression

Anonymous Function Expression - это function expression без собственного имени после слова `function`.

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Схема:

```text
const validateStatus = function () { ... };
                       │
                       └── anonymous function expression
```

У function object нет собственного имени, но переменная дает доступ к нему.

```text
function object
│
└── anonymous
    │
    ▼
stored in validateStatus
```

Когда мы пишем:

```javascript
validateStatus();
```

JavaScript берет function object из переменной и выполняет его тело.

### Named Function Expression

Named Function Expression содержит имя после `function`.

```javascript
const validateStatus = function validateSuccessfulStatus() {
  console.log('Status is valid');
};
```

Схема:

```text
const validateStatus = function validateSuccessfulStatus() { ... };
                       │        │
                       │        └── внутреннее имя function object
                       └── function expression
```

В этой главе достаточно понимать идею:

```text
переменная хранит function object
сам function object может иметь собственное имя
```

Подробные причины использования named function expressions будут понятнее после глав о функциях, `this`, closures и отладке.

### Declaration vs Expression

Function Declaration:

```javascript
function validateStatus() {
  console.log('Status is valid');
}
```

Function Expression:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Главное различие:

```text
Function Declaration
│
└── объявляет функцию с именем

Function Expression
│
└── создает function object
    │
    └── значение сохраняется в переменной
```

Declaration vs Expression:

```text
function validateStatus() { ... }
│
└── declaration

const validateStatus = function () { ... };
│                    │
│                    └── expression creates function object
└── variable stores that value
```

Обе формы позволяют получить функцию, которую можно вызвать:

```text
validateStatus()
│
▼
execute function body
```

Но путь создания отличается.

### Создание и вызов Function Expression

Создание:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Вызов:

```javascript
validateStatus();
```

Invocation through variable:

```text
validateStatus
│
▼
read variable value
│
▼
value is function
│
▼
call it with ()
│
▼
execute body
```

Функция выполняется не в момент присваивания, а в момент вызова.

```text
const validateStatus = function () { ... };
│
└── function object created and stored

validateStatus();
│
└── function object invoked
```

### Function Expression structure

Структура:

```text
const validateStatus = function () {
  console.log('Status is valid');
};
│     │              │
│     │              └── function object
│     └── variable name
└── declaration keyword
```

Еще одна схема:

```text
const validateStatus = function () { ... };
      │              │
      │              └── значение справа
      └── имя переменной слева
```

Вопрос, который нужно задавать:

> Какое значение находится справа от `=`?

В данном случае справа находится function object.

### Multiple variables

Function object можно сохранить в одну переменную.

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Концептуально несколько переменных могут указывать на одно function object:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};

const checkStatus = validateStatus;
```

Схема:

```text
validateStatus
│
├── function object
│
checkStatus
│
└── same function object
```

Это связано с темой references и function objects. Подробное поведение будет глубже понятно после следующих глав о функциях.

### Читаемость

Function Expression полезен, но не каждый код становится лучше от его использования.

Сравнение читаемости:

```text
Function Declaration
│
└── хорошо подходит для именованного верхнеуровневого helper

Function Expression
│
└── хорошо показывает, что функция хранится как значение
```

Пример:

```javascript
function validateStatus() {
  console.log('Status is valid');
}
```

и:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Оба варианта читаемы, но подчеркивают разные идеи.

```text
Declaration
│
└── "в программе есть функция validateStatus"

Expression
│
└── "переменная validateStatus хранит function object"
```

---

## Внутренний механизм

Важно не запоминать форму, а видеть последовательность действий движка.

### Lifecycle Function Declaration

```text
Engine reads declaration
│
▼
registers function name
│
▼
function can be called by name
│
▼
call executes body
```

На концептуальном уровне Function Declaration связывает имя функции с function object.

### Lifecycle Function Expression

```text
Engine reaches variable declaration
│
▼
prepares variable
│
▼
evaluates right side
│
▼
creates function object
│
▼
stores function object in variable
```

Expression lifecycle:

```text
const validateStatus = function () { ... };
│
├── create variable name
├── create function object
└── store value in variable
```

Function creation временная шкала:

```text
Line with Function Expression
│
▼
right side is evaluated
│
▼
function object appears
│
▼
variable receives that value
│
▼
later call uses stored value
```

### Что делает движок прямо сейчас

Код:

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};

validateStatus();
```

Мысленный дневник движка:

```text
Я вижу const validateStatus.
│
▼
Я подготавливаю переменную.
│
▼
Я вычисляю правую часть.
│
▼
Правая часть создает function object.
│
▼
Я сохраняю function object в validateStatus.
│
▼
Я дохожу до validateStatus().
│
▼
Я читаю значение из validateStatus.
│
▼
Значение можно вызвать.
│
▼
Я выполняю его тело.
```

### Текущее место в модели JavaScript

```text
Functions
│
├── Function Declaration
│   └── named reusable algorithm
│
└── Function Expression
    └── function as value
```

Полная картина:

```text
Value model
│
├── Primitive values
│
└── Object values
    │
    ├── Ordinary objects
    └── Function objects
        │
        ├── can be declared
        ├── can be stored in variables
        └── can be invoked
```

Переход к Arrow Functions:

```text
Function Expression
│
└── создает function object через function syntax
    │
    ▼
Next question
│
└── можно ли создать function object короче?
    │
    ▼
Arrow Functions
```

Arrow Functions будут изучаться в следующей главе.

---

## Ментальная модель

### Labeled toolbox

Представьте ящик инструментов:

```text
validateStatus
│
└── инструмент проверки статуса
```

Переменная - это подпись на ящике. Function object - инструмент внутри.

### Value on a shelf

```text
Полка значений
│
├── 200
├── 'admin'
├── { name: 'Anna' }
└── function object
```

Function Expression кладет function object на полку и подписывает его переменной.

### Tool stored in a drawer

```text
Drawer: validateStatus
│
└── stored tool: function object
```

Вызов `validateStatus()` означает:

```text
open drawer
│
▼
take сохраненный function object
│
▼
run it
```

### Reusable machine stored under a name

```text
Name: validateStatus
│
▼
Machine: function object
│
▼
Start machine with ()
```

### Library catalog

```text
Catalog record
│
├── key: validateStatus
└── item: function object
```

Главная модель:

```text
Function Expression creates a function object.
Variable stores that value.
Invocation reads the value and executes it.
```

---

## Примеры кода

Все примеры находятся в:

```text
examples/01-javascript/chapter-22/
```

Запуск:

```bash
node examples/01-javascript/chapter-22/01-function-value.js
node examples/01-javascript/chapter-22/02-function-expression.js
node examples/01-javascript/chapter-22/03-call-expression.js
node examples/01-javascript/chapter-22/04-declaration-vs-expression.js
node examples/01-javascript/chapter-22/05-common-mistakes.js
node examples/01-javascript/chapter-22/06-qa-example.js
```

### 01-function-value.js

Показывает, что переменная может хранить function object.

### 02-function-expression.js

Показывает базовый Function Expression.

### 03-call-expression.js

Показывает вызов функции через переменную.

### 04-declaration-vs-expression.js

Сравнивает Function Declaration и Function Expression.

### 05-common-mistakes.js

Показывает частую ошибку: переменная хранит функцию, но функция не вызвана.

### 06-qa-example.js

Показывает хранение QA helper-функций в переменных.

---

## Частые вопросы

### Function Expression запускается сразу?

Нет. Function Expression создает function object. Тело выполняется только при вызове через `()`.

### Переменная хранит результат функции или саму функцию?

Если справа написано `function () { ... }`, переменная хранит сам function object. Если справа написан вызов `someFunction()`, это уже другая ситуация, которая будет изучаться глубже позже.

### Anonymous function хуже named function?

Не обязательно. Anonymous function expression часто читается нормально, если переменная имеет хорошее имя. Named function expression полезен в отдельных сценариях отладки и самоссылки, но подробно это будет изучаться позже.

### Нужно ли всегда использовать Function Expression?

Нет. Function Declaration остается хорошим выбором для обычных именованных helper-функций.

### Это уже callback?

Нет. В этой главе функция только хранится в переменной и вызывается. Callback - это функция, переданная в другую функцию; эта тема будет изучаться позже.

---

## Распространенные мифы

### Миф: функция не может быть значением

Реальность:

В JavaScript функция может быть значением.

### Миф: Function Expression всегда лучше Function Declaration

Реальность:

Это разные инструменты. Выбор зависит от читаемости и задачи.

### Миф: если функция сохранена в переменной, она уже выполнилась

Реальность:

Переменная хранит function object. Выполнение начинается только после вызова.

### Миф: anonymous значит непонятная

Реальность:

Если переменная названа хорошо, код может быть понятным.

Схема типичных ошибок:

```text
Ошибка
│
├── забыть ()
├── вызвать до присваивания
├── думать, что переменная хранит результат
├── дать переменной расплывчатое имя
└── путать declaration и expression
```

---

## Типичные ошибки

### Ошибка 1. Забыть вызов

Неправильно:

```javascript
const validateStatus = function () {
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

### Ошибка 2. Думать, что функция выполнилась при присваивании

```javascript
const validateStatus = function () {
  console.log('Status is valid');
};
```

Этот код создает и сохраняет function object. Он не выводит текст.

### Ошибка 3. Путать Function Declaration и Function Expression

```javascript
function validateStatus() {}
```

и:

```javascript
const validateStatus = function () {};
```

Оба создают функцию, но делают это разными способами.

### Ошибка 4. Использовать плохое имя переменной

Плохо:

```javascript
const fn = function () {
  console.log('Validate user profile');
};
```

Лучше:

```javascript
const validateUserProfile = function () {
  console.log('Validate user profile');
};
```

### Ошибка 5. Объяснять Function Expression через callbacks

Callbacks будут позже. Сейчас достаточно модели:

```text
переменная хранит function object
```

---

## Практическое использование

Function Expression полезен, когда нужно явно показать, что функция является объектным значением, которое можно вызвать.

Практический чек-лист:

```text
1. Что находится справа от =?
2. Это function object?
3. В какую переменную он сохраняется?
4. Где эта переменная вызывается с ()?
5. Помогает ли имя переменной понять поведение?
```

Readability decision:

```text
Нужен обычный верхнеуровневый helper
│
└── Function Declaration часто подходит

Нужно подчеркнуть функцию как значение
│
└── Function Expression подходит
```

---

## Использование в Automation QA

### Helper assignment

```javascript
const validateStatus = function () {
  console.log('Validate status code');
};

validateStatus();
```

Переменная `validateStatus` хранит helper-функцию.

### Reusable validators

```javascript
const validateUserProfile = function () {
  console.log('Validate user profile');
};
```

Пример QA-helper:

```text
validateUserProfile
│
└── function object
    │
    └── reusable validation
```

### Configurable поведение

На высоком уровне Function Expression помогает думать о поведении как о значении.

```text
validator variable
│
└── stores validation behavior
```

Подробно передача поведения в другие функции будет изучаться в главах о callbacks и higher-order functions.

### Storing helper functions

```text
test utils
│
├── validateStatus
├── validateUserProfile
└── cleanupTestData
```

Каждая переменная может хранить function object.

### Organizing test utilities

Function Expressions помогают видеть utilities как набор значений:

```text
utilities module
│
├── const validateStatus = function () { ... }
├── const openProfile = function () { ... }
└── const cleanupData = function () { ... }
```

Модули и экспорт будут изучаться позже. Здесь важно только увидеть модель хранения функции в переменной.

---

## Итоги

Function Expression вводит новую важную идею:

```text
Функция может быть объектным значением.
```

Полная модель главы:

```text
Function Expression
│
▼
creates function object
│
▼
variable stores that value
│
▼
invocation reads value from variable
│
▼
function body executes
```

Function Declaration и Function Expression создают функции разными способами.

```text
Function Declaration
│
└── function validateStatus() { ... }

Function Expression
│
└── const validateStatus = function () { ... };
```

Следующая глава естественно продолжит вопрос:

```text
Есть ли более короткий синтаксис
для создания function object?
```

Ответом будут Arrow Functions.

---

## Что нужно запомнить

* Function Expression создает function object.
* Function object относится к object значения, а не к отдельной третьей категории значений.
* Переменная может хранить function object.
* Тело функции не выполняется при присваивании.
* Вызов происходит через `variableName()`.
* Anonymous Function Expression не имеет собственного имени.
* Named Function Expression имеет имя function object.
* Function Declaration и Function Expression создают функции разными способами.
* Хорошее имя переменной критично для читаемости.
* В Automation QA Function Expressions могут использоваться для helper-функций и validators.
* Callbacks, arrow functions, closures и `this` будут изучаться позже.

---

## Проверьте себя

Ответьте без запуска кода.

1. Может ли функция быть значением?
2. Что хранит переменная в Function Expression?
3. Выполняется ли тело при присваивании Function Expression?
4. Что делает `validateStatus()`?
5. Чем anonymous function expression отличается от named function expression?
6. Чем Function Declaration отличается от Function Expression?
7. Почему хорошее имя переменной важно?
8. Почему это не callback?
9. Где Function Expression может использоваться в Automation QA?
10. Какая тема идет следующей?

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/22-function-expression.md
```

Сначала решайте задания на предсказание вывода без запуска. Главная цель - видеть, где создается function object, где он хранится и где вызывается.

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/22-function-expression.md
```

Читайте решения после самостоятельной попытки. Проверяйте главный вопрос: какое значение хранит переменная?
