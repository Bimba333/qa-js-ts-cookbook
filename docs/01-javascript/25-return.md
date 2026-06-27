# Return

## Связь с предыдущей главой

Предыдущая глава объяснила, как данные входят в функцию.

```text
Function call
│
└── arguments
    │
    ▼
Function definition
│
└── parameters
```

Теперь появляется следующий вопрос:

> Как функция отправляет данные обратно?

Например, helper проверяет status code:

```javascript
function isSuccessfulStatus(statusCode) {
  statusCode === 200;
}
```

Внутри функции есть проверка. Но вызывающий код не получает ответ.

```text
Caller
│
├── calls function
└── needs result
```

Главный вопрос этой главы:

> Как результат выходит из функции?

---

## Предварительные требования

Для этой главы нужно понимать:

* что функция - это вызываемый function object;
* что arguments передаются при вызове;
* что parameters получают arguments внутри функции;
* что тело функции выполняется после invocation;
* что `console.log()` выводит значение в консоль.

Не требуется знать returning objects in detail, destructuring returned values, generators, async return, Promise, recursion или higher-order functions. Эти темы будут изучаться позже.

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

`return` выглядит как одно слово, но меняет роль функции: функция становится не только набором действий, а преобразованием входных данных в результат.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/24-parameters.md
```

Текущая глава:

```text
docs/01-javascript/25-return.md
```

Следующая глава:

```text
docs/01-javascript/26-rest.md
```

Следующая глава ответит:

> Как функция может получить неизвестное количество arguments?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `return`;
* что такое return value;
* как функция возвращает данные;
* почему выполнение останавливается после `return`;
* что происходит в функции без explicit return;
* что такое implicit `undefined`;
* как работает один `return`;
* как работают multiple return paths;
* почему `console.log()` не заменяет `return`;
* как писать читаемые return paths;
* как `return` используется в Automation QA.

---

## Мотивация

Начнем с проблемы.

Функция получает status code:

```javascript
function isSuccessfulStatus(statusCode) {
  statusCode === 200;
}
```

Внутри есть выражение:

```text
statusCode === 200
```

Но вызывающий код не получает результат.

```javascript
const result = isSuccessfulStatus(200);
console.log(result);
```

Что должен получить `result`?

```text
true?
false?
undefined?
```

Чтобы результат вышел из функции, нужен `return`.

Why return exists:

```text
Function receives input
│
▼
Function performs work
│
▼
Caller needs answer
│
▼
return sends answer back
```

Функции - это не только переиспользуемые алгоритмы. Часто это переиспользуемые преобразования данных.

```text
input
│
▼
function
│
▼
output
```

Главный вопрос:

> Как результат выходит из функции?

---

## Теория

### Зачем существует return

`return` нужен, чтобы функция могла отправить результат обратно в место вызова.

Без `return`:

```text
Function does work
│
▼
Caller receives no explicit result
```

С `return`:

```text
Function does work
│
▼
return value
│
▼
Caller receives result
```

Function input/output:

```text
Arguments
│
▼
Parameters
│
▼
Function body
│
▼
Возвращаемое значение
│
▼
Caller
```

### Возвращаемое значение

Возвращаемое значение - это значение, которое функция отправляет вызывающему коду.

```javascript
function isSuccessfulStatus(statusCode) {
  return statusCode === 200;
}
```

Схема:

```text
return statusCode === 200
│
└── return value
    │
    └── true or false
```

Вызов:

```javascript
const result = isSuccessfulStatus(200);
```

Схема:

```text
isSuccessfulStatus(200)
│
▼
return true
│
▼
result receives true
```

### Returning data

Функция может вернуть результат вычисления.

```javascript
function compareStatus(actualStatus, expectedStatus) {
  return actualStatus === expectedStatus;
}
```

Data flow:

```text
200, 200
│
▼
actualStatus, expectedStatus
│
▼
actualStatus === expectedStatus
│
▼
true
│
▼
return value
```

`return` делает результат доступным снаружи функции.

### Return boundary

Функция имеет границу.

```text
Outside function
│
▼
function call
│
▼
Inside function
│
▼
return
│
▼
Outside function receives result
```

Return boundary:

```text
Inside
│
└── calculated value
    │
    ▼
return boundary
    │
    ▼
Outside
│
└── вызывающий код receives value
```

### Returning immediately

`return` завершает выполнение функции сразу.

```javascript
function validateStatus(statusCode) {
  return statusCode === 200;
  console.log('This will not run');
}
```

Execution stops:

```text
Line before return
│
▼
return value
│
▼
function exits
│
▼
lines after return are skipped
```

После `return` тело функции дальше не выполняется.

### Execution stops after return

Это не рекомендация стиля, а механизм выполнения.

```text
Function body
│
├── step 1
├── return
└── step 2 is unreachable
```

Пример:

```javascript
function getStatusMessage(statusCode) {
  if (statusCode === 200) {
    return 'OK';
  }

  return 'Not OK';
}
```

Если первый `return` выполнен, функция завершилась.

Return path:

```text
statusCode === 200
│
├── true  → return 'OK'     → exit function
└── false → return 'Not OK' → exit function
```

### Function without explicit return

Функция может не содержать `return`.

```javascript
function logStatus(statusCode) {
  console.log(statusCode);
}
```

Она может выполнить действие, но не отправить явный результат назад.

Function without return:

```text
Function body
│
└── console.log(statusCode)
    │
    ▼
prints to console
    │
    ▼
no explicit return value
```

### Implicit undefined

Если функция завершилась без explicit `return`, результатом вызова будет `undefined`.

```javascript
function logStatus(statusCode) {
  console.log(statusCode);
}

const result = logStatus(200);
console.log(result);
```

Implicit undefined:

```text
function ends
│
▼
no explicit return
│
▼
вызывающий код receives undefined
```

Важно:

```text
console.log(value)
│
└── prints value

return value
│
└── sends value back
```

### One return statement

Функция может иметь один `return`.

```javascript
function isSuccessfulStatus(statusCode) {
  return statusCode === 200;
}
```

One return:

```text
input
│
▼
calculation
│
▼
one return value
```

Это удобно для простых преобразований.

### Multiple return paths

Функция может иметь несколько путей возврата.

```javascript
function getStatusMessage(statusCode) {
  if (statusCode === 200) {
    return 'Success';
  }

  return 'Failure';
}
```

Multiple returns:

```text
Condition
│
├── path A → return 'Success'
└── path B → return 'Failure'
```

Важно, чтобы каждый путь был понятен.

```text
Readable return paths
│
├── clear condition
├── clear returned value
└── no hidden work after return
```

### Readability of return

`return` должен помогать читать поток данных.

Плохо:

```javascript
function check(statusCode) {
  if (statusCode === 200) return true;
  if (statusCode === 201) return true;
  if (statusCode === 204) return true;
  return false;
}
```

Лучше на этом уровне:

```javascript
function isSuccessfulStatus(statusCode) {
  return statusCode === 200;
}
```

Читаемость:

```text
Good return
│
├── clear function name
├── clear returned value
└── clear вызывающий код usage
```

---

## Внутренний механизм

На концептуальном уровне `return` завершает текущий function execution и передает значение наружу.

Function lifecycle:

```text
Function is called
│
▼
Arguments enter
│
▼
Parameters receive values
│
▼
Body executes
│
▼
return sends result
│
▼
Function exits
```

Что делает движок:

```text
I reach isSuccessfulStatus(200).
│
▼
I pass 200 into statusCode.
│
▼
I execute the body.
│
▼
I evaluate statusCode === 200.
│
▼
I reach return.
│
▼
I send the value back to the вызывающий код.
│
▼
I stop executing this function.
```

Complete input/output model:

```text
Caller
│
├── sends arguments
│
▼
Function
│
├── receives parameters
├── performs work
├── creates result
└── returns value
│
▼
Caller
│
└── receives return value
```

Current position in JavaScript model:

```text
Functions
│
├── Function Declaration
├── Function Expression
├── Arrow Functions
├── Parameters
│   └── data enters function
└── Return
    └── data leaves function
```

Переход к Rest Parameters:

```text
Parameters
│
└── known number of inputs
    │
    ▼
Return
│
└── output from function
    │
    ▼
Next question
│
└── unknown number of arguments
    │
    ▼
Rest Parameters
```

---

## Ментальная модель

### Автомат с выдачей

Функция похожа на автомат.

```text
Insert input
│
▼
Machine works
│
▼
Machine gives output
```

Arguments входят. Возвращаемое значение выходит.

### Калькулятор

```text
Calculator
│
├── receives numbers
├── calculates
└── returns result
```

Если калькулятор только показывает число на экране, это похоже на `console.log`. Если он отдает число другой части программы, это похоже на `return`.

### Input/output machine

```text
Input
│
▼
Function
│
▼
Output
```

### Request/response

```text
Request
│
└── function call with arguments

Response
│
└── return value
```

### Служба доставки

```text
Caller sends package
│
▼
Function processes package
│
▼
Function sends result back
```

Краткая ментальная модель:

```text
Arguments enter the function.
Parameters receive them.
The function performs work.
Return sends the result back.
Execution stops immediately after return.
```

Complete Return overview:

```text
return
│
├── sends value to вызывающий код
├── stops function execution
├── can appear in one path
├── can appear in multiple paths
└── differs from console.log()
```

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-28/
```

Запуск:

```bash
node examples/chapter-28/01-basic-return.js
node examples/chapter-28/02-return-value.js
node examples/chapter-28/03-multiple-return.js
node examples/chapter-28/04-implicit-undefined.js
node examples/chapter-28/05-common-mistakes.js
node examples/chapter-28/06-qa-example.js
```

### 01-basic-return.js

Показывает базовый `return`.

### 02-return-value.js

Показывает, как вызывающий код получает return value.

### 03-multiple-return.js

Показывает несколько return paths.

### 04-implicit-undefined.js

Показывает implicit `undefined` в функции без explicit return.

### 05-common-mistakes.js

Показывает различие между `console.log()` и `return`.

### 06-qa-example.js

Показывает QA validator, который возвращает boolean.

---

## Частые вопросы

### console.log возвращает значение?

`console.log()` выводит значение в консоль. Он не заменяет `return`.

### Что получает вызывающий код, если в функции нет return?

Caller получает `undefined`.

### Можно ли писать несколько return?

Да. Главное, чтобы return paths были понятными.

### Выполняется ли код после return?

Нет. Когда `return` выполнен, функция сразу завершается.

### Может ли функция вернуть object?

Да, но возвращение objects в деталях будет изучаться позже. В этой главе достаточно понимать сам механизм выхода значения.

### Как return работает с async functions?

Async return связан с Promise и будет изучаться позже.

---

## Распространенные мифы

### Миф: console.log и return делают одно и то же

Реальность:

`console.log()` печатает. `return` отправляет значение вызывающему коду.

### Миф: функция без return ничего не возвращает

Реальность:

Она возвращает `undefined` на уровне результата вызова.

### Миф: после return код продолжает выполняться

Реальность:

`return` завершает выполнение функции немедленно.

### Миф: много return всегда плохо

Реальность:

Несколько return paths допустимы, если они читаемы и объясняют логику.

Схема типичных ошибок:

```text
Ошибка
│
├── путать console.log и return
├── забыть return
├── писать код после return
├── не сохранить return value
└── сделать return paths неочевидными
```

---

## Типичные ошибки

### Ошибка 1. Путать console.log и return

Неправильно:

```javascript
function isSuccessfulStatus(statusCode) {
  console.log(statusCode === 200);
}
```

Функция печатает результат, но вызывающий код получает `undefined`.

Исправление:

```javascript
function isSuccessfulStatus(statusCode) {
  return statusCode === 200;
}
```

### Ошибка 2. Забыть return

```javascript
function isSuccessfulStatus(statusCode) {
  statusCode === 200;
}
```

Выражение вычисляется, но не отправляется наружу.

### Ошибка 3. Код после return

```javascript
function validateStatus(statusCode) {
  return statusCode === 200;
  console.log('Done');
}
```

`console.log('Done')` не выполнится.

### Ошибка 4. Не использовать return value

```javascript
function isSuccessfulStatus(statusCode) {
  return statusCode === 200;
}

isSuccessfulStatus(200);
```

Результат возвращен, но вызывающий код его не использовал.

### Ошибка 5. Неочевидные return paths

Если в функции много условий и много return, читатель должен легко понимать, какой путь выполнится.

```text
Readable returns
│
├── clear condition
├── clear value
└── no hidden side effects
```

---

## Практическое использование

`return` нужен, когда результат функции должен быть использован дальше.

```text
Function calculates value
│
▼
return sends value
│
▼
вызывающий код stores or checks value
```

Практический чек-лист:

```text
1. Что функция получает?
2. Что функция должна вычислить?
3. Что вызывающий код должен получить?
4. Где находится return?
5. Есть ли код после return?
6. Не перепутан ли console.log с return?
```

Функция как преобразование:

```text
statusCode
│
▼
isSuccessfulStatus
│
▼
boolean
```

---

## Использование в Automation QA

### Validators, возвращающие boolean

```javascript
function isSuccessfulStatus(statusCode) {
  return statusCode === 200;
}
```

QA validator:

```text
statusCode
│
▼
validator
│
▼
boolean result
```

### Helper functions

```javascript
function getStatusMessage(statusCode) {
  if (statusCode === 200) {
    return 'Status is successful';
  }

  return 'Status is not successful';
}
```

### Reusable checks

```javascript
const passed = isSuccessfulStatus(200);
console.log(passed);
```

Возвращаемое значение можно сохранить и использовать дальше.

### Возврат parsed values

На высоком уровне helper может вернуть подготовленное значение:

```javascript
function getUserEmail() {
  return 'anna@example.com';
}
```

Подробная работа с parsed objects будет изучаться позже.

### Возврат locators

На высоком уровне helper может вернуть locator name:

```javascript
function getProfileButtonName() {
  return 'profile button';
}
```

Настоящие Playwright locators будут изучаться позже.

### Читаемые helper APIs

Хороший helper API показывает, что входит и что выходит.

```text
isSuccessfulStatus(statusCode) → boolean
getUserEmail()                → string
getStatusMessage(statusCode)  → string
```

Async helpers, Promise и async return будут изучаться позже.

---

## Итоги

`return` отвечает на вопрос:

```text
Как функция отправляет данные обратно?
```

Главная модель:

```text
Arguments enter the function.
Parameters receive them.
The function performs work.
Return sends the result back.
Execution stops immediately after return.
```

Критическое различие:

```text
console.log(value)
│
└── prints value

return value
│
└── sends value back to вызывающий код
```

Следующая глава ответит:

```text
Как функция может получить неизвестное количество arguments?
```

Это тема Rest Parameters.

---

## Что нужно запомнить

* `return` отправляет значение вызывающему коду.
* Возвращаемое значение - значение, которое получает вызывающий код.
* `return` немедленно завершает выполнение функции.
* Код после выполненного `return` не запускается.
* Функция без explicit return возвращает `undefined`.
* `console.log()` печатает значение, но не возвращает его вызывающий код.
* Функция может иметь один return statement.
* Функция может иметь multiple return paths.
* В Automation QA validators часто возвращают boolean.
* Returning objects, async return, Promise, generators, recursion и higher-order functions будут изучаться позже.

---

## Проверьте себя

Ответьте без запуска кода.

1. Зачем существует `return`?
2. Что такое return value?
3. Что получает вызывающий код?
4. Что происходит после выполнения `return`?
5. Что возвращает функция без explicit return?
6. Чем `console.log()` отличается от `return`?
7. Может ли функция иметь несколько return paths?
8. Почему return paths должны быть читаемыми?
9. Как `return` используется в Automation QA?
10. Какая тема идет следующей?

---

## Практика

Практика находится в файле:

```text
practice/chapter-28.md
```

Сначала решайте задания на предсказание вывода без запуска. Главная цель - отличать вывод в консоль от возвращения значения.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-28.md
```

Читайте решения после самостоятельной попытки. Проверяйте главный вопрос: как результат выходит из функции?
