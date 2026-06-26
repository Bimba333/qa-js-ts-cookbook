# Решения. Глава 27. Parameters

## Концептуальные вопросы

### 1. Зачем существуют параметры

Ответ:

Параметры позволяют функции получать данные извне.

Рассуждение:

Без параметров helper работает только с фиксированными значениями. С параметрами один helper можно вызвать с разными arguments.

Типичная ошибка:

Думать, что функция должна сама знать все значения.

Связь с Automation QA:

Validators получают actual и expected values через параметры.

### 2. Parameter

Ответ:

Parameter - это имя в определении функции.

Рассуждение:

В `function validateStatus(statusCode)` имя `statusCode` является parameter.

Типичная ошибка:

Называть parameter аргументом.

Связь с Automation QA:

`expectedStatus` в helper signature показывает, какое значение нужно передать.

### 3. Argument

Ответ:

Argument - это значение в вызове функции.

Рассуждение:

В `validateStatus(200)` значение `200` является argument.

Типичная ошибка:

Называть argument параметром.

Связь с Automation QA:

Статус из API response передается как argument.

### 4. Parameter принадлежит определению

Ответ:

Потому что parameter задает имя, которое будет доступно внутри функции.

Рассуждение:

Это часть function signature.

Типичная ошибка:

Искать parameter в строке вызова.

Связь с Automation QA:

Readable helper signature начинается с хороших parameter names.

### 5. Argument принадлежит вызову

Ответ:

Потому что argument - это конкретное значение, переданное при invocation.

Рассуждение:

Одна и та же функция может быть вызвана с разными arguments.

Типичная ошибка:

Считать argument постоянной частью функции.

Связь с Automation QA:

Один validator можно вызвать с разными status codes.

### 6. Argument становится доступным

Ответ:

JavaScript сопоставляет argument с parameter, и внутри функции значение доступно через имя parameter.

Рассуждение:

`validateStatus(200)` передает `200` в `statusCode`.

Типичная ошибка:

Думать, что имя argument передается внутрь.

Связь с Automation QA:

Переданное expected value становится доступно в helper.

### 7. Ноль параметров

Ответ:

Функция без параметров не получает данные через вызов.

Рассуждение:

Она выполняет фиксированное действие.

Типичная ошибка:

Ожидать, что функция сама получит внешнее значение.

Связь с Automation QA:

Например, `printTestStart()` может просто вывести фиксированное сообщение.

### 8. Один parameter

Ответ:

Один parameter получает первое значение из вызова.

Рассуждение:

`validateStatus(200)` передает `200` в `statusCode`.

Типичная ошибка:

Путать имя parameter и значение argument.

Связь с Automation QA:

`statusCode` получает статус ответа.

### 9. Несколько parameters

Ответ:

Несколько parameters получают arguments по позиции.

Рассуждение:

Первый argument идет в первый parameter, второй - во второй.

Типичная ошибка:

Думать, что сопоставление идет по имени.

Связь с Automation QA:

`actualStatus` и `expectedStatus` должны передаваться в правильном порядке.

### 10. Matching by position

Ответ:

Это сопоставление arguments и parameters по порядку.

Рассуждение:

В `compareStatus(200, 201)` `200` попадает в первый parameter, `201` - во второй.

Типичная ошибка:

Поменять arguments местами.

Связь с Automation QA:

Перепутанные actual/expected ухудшают диагностику ошибки.

### 11. Missing argument

Ответ:

Parameter получает `undefined` на высоком уровне.

Рассуждение:

Если значение не передано, JavaScript не может положить реальное значение в parameter.

Типичная ошибка:

Ожидать автоматическую ошибку.

Связь с Automation QA:

Helper может вывести `undefined` вместо expected data.

### 12. Extra argument

Ответ:

Лишний argument не получает имени parameter на этом уровне.

Рассуждение:

Если у функции один parameter, второй argument не используется через обычное имя parameter.

Типичная ошибка:

Думать, что extra argument всегда ломает функцию.

Связь с Automation QA:

Лишние arguments могут скрывать ошибку вызова helper.

### 13. Имена parameters

Ответ:

Имена должны объяснять, какие данные функция ожидает.

Рассуждение:

`actualStatus` понятнее, чем `a`.

Типичная ошибка:

Использовать короткие бессмысленные имена.

Связь с Automation QA:

Хорошие helper signatures делают тесты поддерживаемыми.

## Parameter vs argument

### Задача 1

Ответ:

Parameter: `statusCode`.

Argument: `200`.

`200` попадет в `statusCode`.

Рассуждение:

Parameter находится в определении функции, argument - в вызове.

Типичная ошибка:

Назвать `statusCode` argument.

Связь с Automation QA:

Так status code передается в validator.

### Задача 2

Ответ:

Parameters: `actualStatus`, `expectedStatus`.

Arguments: `200`, `201`.

`200 → actualStatus`, `201 → expectedStatus`.

Рассуждение:

Сопоставление идет по позиции.

Типичная ошибка:

Думать, что JavaScript смотрит на имена.

Связь с Automation QA:

Порядок actual/expected важен для корректного отчета.

### Задача 3

Ответ:

Parameter: `userEmail`.

Argument: `'anna@example.com'`.

Строка попадет в `userEmail`.

Рассуждение:

Arrow Function тоже может иметь parameters.

Типичная ошибка:

Считать параметры особенностью только Function Declaration.

Связь с Automation QA:

Email тестового пользователя передается в helper.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
200
```

Рассуждение:

Argument `200` попадает в parameter `statusCode`.

Типичная ошибка:

Искать значение внутри тела функции.

Связь с Automation QA:

API status передан в validator.

### Задача 2

Ответ:

```text
200
201
```

Рассуждение:

Arguments сопоставляются по позиции.

Типичная ошибка:

Перепутать порядок values.

Связь с Automation QA:

actual и expected должны быть понятны в выводе.

### Задача 3

Ответ:

```text
undefined
```

Рассуждение:

Argument не передан, поэтому `statusCode` получает `undefined`.

Типичная ошибка:

Ожидать ошибку вызова.

Связь с Automation QA:

Так можно случайно пропустить test data.

### Задача 4

Ответ:

```text
200
```

Рассуждение:

Первый argument попадает в `statusCode`, второй лишний на этом уровне.

Типичная ошибка:

Ожидать вывод обоих arguments.

Связь с Automation QA:

Лишнее значение в helper call может быть незамеченной ошибкой.

## Задачи на отладку

### Задача 1

Ответ:

`undefined` выводится, потому что argument не передан.

Исправление:

```javascript
validateStatus(200);
```

Рассуждение:

Parameter есть, но значение для него не пришло.

Типичная ошибка:

Проверять тело функции, хотя проблема в вызове.

Связь с Automation QA:

Test data не была передана в helper.

### Задача 2

Ответ:

Arguments переданы как `201, 200`, поэтому `actualStatus = 201`, `expectedStatus = 200`.

Рассуждение:

Порядок влияет на смысл.

Типичная ошибка:

Поменять actual и expected местами.

Связь с Automation QA:

Отчет о проверке станет менее понятным.

### Задача 3

Ответ:

`a` и `b` не объясняют смысл значений.

Исправление:

```javascript
function validateStatus(actualStatus, expectedStatus) {
  console.log(actualStatus === expectedStatus);
}
```

Рассуждение:

Parameter names должны объяснять входные данные.

Типичная ошибка:

Экономить символы в ущерб читаемости.

Связь с Automation QA:

Читаемые helper signatures важны для фреймворка.

### Задача 4

Ответ:

`actualStatus` и `expectedStatus` в определении функции являются parameters, не arguments.

Рассуждение:

Arguments появляются в вызове функции.

Типичная ошибка:

Смешивать термины.

Связь с Automation QA:

Точное понимание терминов помогает читать ошибки и документацию.

## QA-oriented tasks

### Сценарий 1

Ответ:

```javascript
function validateApiStatus(actualStatus, expectedStatus) {
  console.log('Actual:', actualStatus);
  console.log('Expected:', expectedStatus);
  console.log('Passed:', actualStatus === expectedStatus);
}

validateApiStatus(200, 200);
```

Рассуждение:

Parameters описывают входные данные validator.

Типичная ошибка:

Назвать параметры `a` и `b`.

Связь с Automation QA:

Это базовый API status validator.

### Сценарий 2

Ответ:

```javascript
function createUser(userEmail) {
  console.log(userEmail);
}

createUser('anna@example.com');
```

Рассуждение:

Email передается как argument.

Типичная ошибка:

Зашить email внутрь функции.

Связь с Automation QA:

Так helper работает с разными test users.

### Сценарий 3

Ответ:

```javascript
const clickElement = (locatorName) => {
  console.log(locatorName);
};

clickElement('profile button');
```

Рассуждение:

Arrow Function получает parameter так же, как другие функции.

Типичная ошибка:

Думать, что Arrow Functions не имеют parameters.

Связь с Automation QA:

Locator value передается в helper.

### Сценарий 4

Ответ:

```text
a, b   → actualStatus, expectedStatus
x      → userEmail
v      → locatorName
data   → userProfile
```

Рассуждение:

Имена должны описывать доменное значение.

Типичная ошибка:

Оставить слишком общие имена.

Связь с Automation QA:

Хорошие имена сокращают стоимость чтения тестов.

## Мини-проект

Возможное решение:

```javascript
function validateStatus(actualStatus, expectedStatus) {
  console.log('Status passed:', actualStatus === expectedStatus);
}

function createUser(userEmail) {
  console.log('Create user:', userEmail);
}

const openProfile = (userId) => {
  console.log('Open profile:', userId);
};

const clickElement = (locatorName) => {
  console.log('Click:', locatorName);
};

validateStatus(200, 200);
createUser('anna@example.com');
openProfile(101);
clickElement('profile button');
```

Отчет:

```text
Function       | Parameters                    | Arguments              | QA meaning
-------------- | ----------------------------- | ---------------------- | ----------------
validateStatus | actualStatus, expectedStatus  | 200, 200               | API assertion
createUser     | userEmail                     | anna@example.com       | test data setup
openProfile    | userId                        | 101                    | navigation helper
clickElement   | locatorName                   | profile button         | UI helper
```

Рассуждение:

Каждая функция получает данные через parameters, а вызовы передают concrete arguments.

Типичная ошибка:

Смешать parameter names и argument values в отчете.

Связь с Automation QA:

Мини-проект показывает основу readable helper signatures.
