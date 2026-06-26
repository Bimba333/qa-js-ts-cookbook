# Решения. Глава 29. Rest Parameters

## Концептуальные вопросы

### 1. Зачем существуют Rest Parameters

Ответ:

Rest Parameters нужны, чтобы функция могла принять неизвестное количество arguments.

Рассуждение:

Обычные parameters подходят, когда количество inputs известно. Rest parameter собирает remaining arguments в array.

Типичная ошибка:

Использовать rest везде, даже когда inputs fixed.

Связь с Automation QA:

Helper может принять любое количество status codes или log messages.

### 2. Неизвестное количество arguments

Ответ:

Это ситуация, когда caller может передать один, несколько или ноль values.

Рассуждение:

Функция не может заранее иметь отдельный parameter для каждого будущего argument.

Типичная ошибка:

Создавать много parameters вроде `status1`, `status2`, `status3`.

Связь с Automation QA:

Набор проверяемых значений может меняться от теста к тесту.

### 3. Синтаксис `...statusCodes`

Ответ:

Это rest parameter с именем `statusCodes`.

Рассуждение:

Три точки в parameter list означают сбор remaining arguments.

Типичная ошибка:

Объяснять это через Spread.

Связь с Automation QA:

`...statusCodes` показывает, что helper принимает collection.

### 4. Что собирает rest parameter

Ответ:

Он собирает remaining arguments.

Рассуждение:

Если перед ним есть normal parameters, они получают свои positions, а rest собирает остаток.

Типичная ошибка:

Думать, что rest собирает все arguments всегда.

Связь с Automation QA:

`expectedStatus` может быть обычным parameter, а actual statuses - rest array.

### 5. Почему array

Ответ:

Потому что нужно одно значение, которое хранит много collected values.

Рассуждение:

Array - естественная форма для collection.

Типичная ошибка:

Ожидать строку или отдельные variables.

Связь с Automation QA:

Collected test data удобно хранить как array.

### 6. Что внутри rest array

Ответ:

Внутри находятся collected arguments в порядке передачи.

Рассуждение:

`collect(200, 201)` дает `[200, 201]`.

Типичная ошибка:

Ожидать object или named values.

Связь с Automation QA:

Порядок values в проверках может быть важен.

### 7. Ноль arguments

Ответ:

Rest array будет пустым: `[]`.

Рассуждение:

Rest parameter всегда получает array.

Типичная ошибка:

Ожидать `undefined`.

Связь с Automation QA:

Flexible helper должен корректно читать empty collection.

### 8. Почему последний

Ответ:

Потому что rest parameter собирает все оставшиеся arguments.

Рассуждение:

Если после него есть parameter, непонятно, что должно остаться для этого parameter.

Типичная ошибка:

Писать `(...items, last)`.

Связь с Automation QA:

Helper signature должна быть предсказуемой.

### 9. Когда обычные parameters лучше

Ответ:

Когда количество inputs известно и имеет ясный смысл.

Рассуждение:

`compareStatus(actualStatus, expectedStatus)` читается лучше, чем `compareStatus(...statuses)`.

Типичная ошибка:

Делать API helper слишком гибким.

Связь с Automation QA:

Четкие helper signatures упрощают tests.

### 10. Имя во множественном числе

Ответ:

Rest parameter хранит collection, поэтому имя должно это показывать.

Рассуждение:

`statusCodes` понятнее, чем `statusCode`.

Типичная ошибка:

Назвать array singular name.

Связь с Automation QA:

Хорошие имена уменьшают путаницу.

### 11. Почему не смешивать Rest и Spread

Ответ:

Потому что эта глава объясняет только сбор incoming arguments.

Рассуждение:

Spread имеет другое направление и будет изучаться отдельно.

Типичная ошибка:

Запомнить "три точки" без понимания направления.

Связь с Automation QA:

Четкая модель предотвращает ошибки в helper calls.

## Identify collected arguments

### Задача 1

Ответ:

Обычных parameters нет.

Rest parameter: `statusCodes`.

Rest array: `[200, 201, 204]`.

Рассуждение:

Все arguments собираются rest parameter.

Типичная ошибка:

Ожидать только первый value.

Связь с Automation QA:

Validator может собрать все statuses.

### Задача 2

Ответ:

Normal parameter: `expectedStatus`.

Rest parameter: `actualStatuses`.

`expectedStatus = 200`.

`actualStatuses = [200, 201, 204]`.

Рассуждение:

Первый argument идет в normal parameter, остальные - в rest array.

Типичная ошибка:

Включить первый argument в rest array.

Связь с Automation QA:

Один expected status и много actual statuses.

### Задача 3

Ответ:

Normal parameter: `firstMessage`.

Rest parameter: `otherMessages`.

`firstMessage = 'start'`.

`otherMessages = ['validate', 'finish']`.

Рассуждение:

Rest собирает values после первого argument.

Типичная ошибка:

Думать, что rest всегда собирает абсолютно все values.

Связь с Automation QA:

Logger может выделить первое сообщение и собрать остальные.

## What is inside the rest array?

### Задача 1

Ответ:

```text
[]
```

Рассуждение:

Arguments не переданы, rest array пустой.

Типичная ошибка:

Ожидать `undefined`.

Связь с Automation QA:

Empty test data collection должна быть понятной.

### Задача 2

Ответ:

```text
['a']
```

Рассуждение:

Один argument собирается в array из одного элемента.

Типичная ошибка:

Ожидать просто `'a'`.

Связь с Automation QA:

Даже один collected value находится внутри array.

### Задача 3

Ответ:

```text
['b', 'c']
```

Рассуждение:

`firstValue` получает `'a'`, rest собирает remaining arguments.

Типичная ошибка:

Включить `'a'` в rest array.

Связь с Automation QA:

Known value и remaining values часто имеют разный смысл.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
[ 200, 201 ]
```

Рассуждение:

Rest parameter собирает оба arguments.

Типичная ошибка:

Ожидать два отдельных вывода.

Связь с Automation QA:

Statuses collected as array.

### Задача 2

Ответ:

```text
[]
```

Рассуждение:

Rest parameter получает empty array.

Типичная ошибка:

Ожидать `undefined`.

Связь с Automation QA:

No statuses means empty collection.

### Задача 3

Ответ:

```text
200
[ 200, 201 ]
```

Рассуждение:

Первый argument идет в `expectedStatus`, остальные - в `actualStatuses`.

Типичная ошибка:

Ожидать `[200, 200, 201]`.

Связь с Automation QA:

Expected отдельно, actual values collection отдельно.

### Задача 4

Ответ:

```text
start
[]
```

Рассуждение:

Первый argument получает `firstMessage`, remaining arguments отсутствуют.

Типичная ошибка:

Ожидать, что rest array содержит `'start'`.

Связь с Automation QA:

Logger может получить first message без дополнительных messages.

## Задачи на отладку

### Задача 1

Ответ:

Rest parameter не последний.

Исправление:

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {}
```

Рассуждение:

Rest должен собрать все remaining arguments, поэтому после него parameters быть не должно.

Типичная ошибка:

Ставить rest там, где хочется визуально.

Связь с Automation QA:

Helper signature должна быть валидной.

### Задача 2

Ответ:

`statusCode` выглядит как одно значение, но rest parameter хранит array.

Исправление:

```javascript
function collectStatuses(...statusCodes) {
  console.log(statusCodes);
}
```

Рассуждение:

Collection лучше называть во множественном числе.

Типичная ошибка:

Использовать singular name для array.

Связь с Automation QA:

Читаемость helper зависит от имен.

### Задача 3

Ответ:

Здесь inputs fixed: actual и expected.

Лучше:

```javascript
function compareStatus(actualStatus, expectedStatus) {
  console.log(actualStatus === expectedStatus);
}
```

Рассуждение:

Rest нужен для неизвестного количества values.

Типичная ошибка:

Использовать rest ради гибкости без причины.

Связь с Automation QA:

Явные actual/expected улучшают диагностику.

### Задача 4

Ответ:

Объяснение описывает Spread, а не Rest.

Рассуждение:

Rest собирает arguments в array. Spread будет изучаться позже.

Типичная ошибка:

Смешивать направление трех точек.

Связь с Automation QA:

Правильная модель важна при чтении helper APIs.

## QA-oriented tasks

### Сценарий 1

Ответ:

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {
  console.log('Expected:', expectedStatus);
  console.log('Actual:', actualStatuses);
}

validateStatuses(200, 200, 201, 204);
```

Рассуждение:

`expectedStatus` получает первый argument, rest собирает остальные.

Типичная ошибка:

Поставить rest parameter первым.

Связь с Automation QA:

Один expected value и много observed values.

### Сценарий 2

Ответ:

```javascript
function logMessages(...messages) {
  console.log(messages);
}

logMessages('start');
logMessages('start', 'validate');
logMessages('start', 'validate', 'finish');
```

Рассуждение:

Rest parameter собирает любое количество messages.

Типичная ошибка:

Ожидать строку вместо array.

Связь с Automation QA:

Flexible logging helper.

### Сценарий 3

Ответ:

```javascript
function collectUserEmails(...userEmails) {
  return userEmails;
}

const emails = collectUserEmails('a@example.com', 'b@example.com', 'c@example.com');
console.log(emails);
```

Рассуждение:

Rest parameter собирает emails в array и функция возвращает этот array.

Типичная ошибка:

Путать collection с одним email.

Связь с Automation QA:

Collecting test data.

### Сценарий 4

Ответ:

```text
...statusCode → ...statusCodes
...email      → ...emails или ...userEmails
...locator    → ...locators или ...locatorNames
...message    → ...messages
```

Рассуждение:

Rest parameter хранит collection.

Типичная ошибка:

Оставить singular names.

Связь с Automation QA:

Имена показывают, что helper принимает много values.

## Мини-проект

Возможное решение:

```javascript
function validateStatuses(expectedStatus, ...actualStatuses) {
  console.log('Expected:', expectedStatus);
  console.log('Actual:', actualStatuses);
}

function logMessages(...messages) {
  console.log('Messages:', messages);
}

function collectUserEmails(...userEmails) {
  return userEmails;
}

function collectLocatorNames(...locatorNames) {
  return locatorNames;
}

validateStatuses(200, 200, 201, 204);
logMessages('start', 'validate', 'finish');
const emails = collectUserEmails('a@example.com', 'b@example.com');
const locators = collectLocatorNames('profile button', 'save button');

console.log(emails);
console.log(locators);
```

Отчет:

```text
Function            | Normal parameters | Rest parameter | Collected values              | QA meaning
------------------- | ----------------- | -------------- | ----------------------------- | ----------------
validateStatuses    | expectedStatus    | actualStatuses | 200, 201, 204                 | status validator
logMessages         | none              | messages       | start, validate, finish       | logging helper
collectUserEmails   | none              | userEmails     | a@example.com, b@example.com  | test data helper
collectLocatorNames | none              | locatorNames   | profile button, save button   | UI helper
```

Рассуждение:

Каждый rest parameter собирает incoming arguments в array.

Типичная ошибка:

Считать collected values отдельными variables, а не array.

Связь с Automation QA:

Мини-проект показывает flexible helper APIs без Spread.
