# Решения. Глава 30. Spread

## Концептуальные вопросы

### 1. Зачем существует Spread

Ответ:

Spread нужен, чтобы раскрыть collection в отдельные значения или properties.

Объяснение:

Если функция ожидает отдельные arguments, а данные лежат в array, Spread раскрывает array в call site.

Распространённая ошибка:

Путать Spread с Rest.

Связь с Automation QA:

Можно передавать массив prepared значения в helper call.

### 2. Направление Spread

Ответ:

Spread идет от одного collection к многим значения.

Объяснение:

`...statuses` раскрывает `[200, 201]` в `200, 201`.

Распространённая ошибка:

Говорить, что Spread собирает.

Связь с Automation QA:

Status array можно раскрыть в helper arguments.

### 3. Направление Rest

Ответ:

Rest собирает many значения в one array.

Объяснение:

В parameter list `...значения` принимает remaining arguments.

Распространённая ошибка:

Запоминать только три точки без context.

Связь с Automation QA:

Rest полезен для flexible helpers, Spread - для раскрытия prepared data.

### 4. Почему `...` не универсальная операция

Ответ:

Потому что meaning depends on context.

Объяснение:

В parameter list это Rest, в function call, array literal и object literal это Spread.

Распространённая ошибка:

Объяснять все случаи одной фразой.

Связь с Automation QA:

Правильный context помогает читать helper signatures и calls.

### 5. Spread в function call

Ответ:

Он раскрывает array значения в separate arguments.

Объяснение:

`fn(...значения)` становится вызовом с отдельными значения.

Распространённая ошибка:

Думать, что функция получает array как один argument.

Связь с Automation QA:

Можно передать prepared status list в helper.

### 6. Spread в array literal

Ответ:

Он раскрывает array значения внутри нового array.

Объяснение:

`[...a, ...b]` создает array из значения обоих arrays.

Распространённая ошибка:

Ожидать nested arrays.

Связь с Automation QA:

Можно объединять test data lists.

### 7. Spread в object literal

Ответ:

Он раскрывает object properties внутри нового object.

Объяснение:

`{ ...base, role: 'admin' }` копирует top-level properties и добавляет override.

Распространённая ошибка:

Ожидать deep merge.

Связь с Automation QA:

Можно расширять request payloads и configs.

### 8. Shallow copy

Ответ:

Shallow copy создает новый top-level container, но не делает глубокую копию nested objects.

Объяснение:

Spread copy не равен deep copy.

Распространённая ошибка:

Использовать Spread как универсальное клонирование.

Связь с Automation QA:

Nested payloads требуют осторожности.

### 9. Порядок object properties

Ответ:

Later properties override earlier properties.

Объяснение:

Если `role` задан дважды, последнее значение победит.

Распространённая ошибка:

Поставить override перед spread и потерять его.

Связь с Automation QA:

Config overrides зависят от порядка.

### 10. Automation QA

Ответ:

Spread полезен для merging test data, copying request payloads, extending config и composing helper arguments.

Объяснение:

Эти задачи часто требуют взять базовое значение и раскрыть его в новый context.

Распространённая ошибка:

Делать слишком сложные spread expressions.

Связь с Automation QA:

Readable setup важнее короткого setup.

## Rest vs Spread

### Задача 1

Ответ:

Это Rest.

Объяснение:

`...значения` находится в parameter list и собирает incoming arguments.

Распространённая ошибка:

Назвать это Spread из-за трех точек.

Связь с Automation QA:

Так пишут flexible helper.

### Задача 2

Ответ:

Это Spread.

Объяснение:

`...значения` находится в function call и раскрывает array в arguments.

Распространённая ошибка:

Думать, что function получает array как один argument.

Связь с Automation QA:

Prepared значения раскрываются в helper call.

### Задача 3

Ответ:

Это Spread в array literal.

Объяснение:

Он раскрывает значения из `значения` внутрь нового array.

Распространённая ошибка:

Ожидать nested array.

Связь с Automation QA:

Так можно сделать shallow copy списка данных.

## Определите Spread direction

### Задача 1

Ответ:

Array `statuses` раскрывается в separate значения для `console.log`.

Объяснение:

Function call получает значения individually.

Распространённая ошибка:

Ожидать вывод array как одного значения.

Связь с Automation QA:

Так helper может получить prepared arguments.

### Задача 2

Ответ:

Оба arrays раскрываются внутрь нового array `allStatuses`.

Объяснение:

Array literal получает значения из двух collections.

Распространённая ошибка:

Получить nested arrays из-за отсутствия Spread.

Связь с Automation QA:

Combining status lists.

### Задача 3

Ответ:

Object `basePayload` раскрывает properties внутрь нового object.

Объяснение:

`email` добавляется после spread.

Распространённая ошибка:

Ожидать deep copy nested data.

Связь с Automation QA:

Request payload composition.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
[ 200, 201, 204 ]
```

Объяснение:

Spread раскрывает значения из `statuses`, затем добавляется `204`.

Распространённая ошибка:

Ожидать `[ [200, 201], 204 ]`.

Связь с Automation QA:

Можно дополнять status list.

### Задача 2

Ответ:

```text
200
201
```

Объяснение:

Array значения стали separate arguments.

Распространённая ошибка:

Ожидать, что первый parameter получит весь array.

Связь с Automation QA:

Function call receives individual statuses.

### Задача 3

Ответ:

```text
admin
```

Объяснение:

`role: 'admin'` идет после spread и overwrites previous `role`.

Распространённая ошибка:

Игнорировать порядок properties.

Связь с Automation QA:

Overrides in payloads depend on order.

### Задача 4

Ответ:

```text
1
```

Объяснение:

`...baseConfig` идет после `retries: 2`, поэтому значение `1` overwrites `2`.

Распространённая ошибка:

Ожидать, что first value wins.

Связь с Automation QA:

Config override order matters.

## Задачи на отладку

### Задача 1

Ответ:

В function call Spread раскрывает array в arguments. Он не собирает.

Объяснение:

Сбор происходит в parameter list через Rest.

Распространённая ошибка:

Путать direction.

Связь с Automation QA:

Важно различать helper definition и helper call.

### Задача 2

Ответ:

Потому что `...baseUser` идет после `role: 'admin'`.

Исправление:

```javascript
const user = {
  ...baseUser,
  role: 'admin'
};
```

Объяснение:

Later property wins.

Распространённая ошибка:

Не учитывать order in object literal.

Связь с Automation QA:

Payload overrides must be placed after base spread.

### Задача 3

Ответ:

Spread copy is shallow copy.

Объяснение:

Top-level object is new, nested objects are not deeply cloned here.

Распространённая ошибка:

Использовать Spread как deep clone.

Связь с Automation QA:

Nested request payloads требуют осторожности.

### Задача 4

Ответ:

Слишком много spread parts в одной строке скрывают порядок и смысл overrides.

Объяснение:

Читателю трудно быстро понять final payload.

Распространённая ошибка:

Считать компактность преимуществом всегда.

Связь с Automation QA:

Readable test setup важнее короткой строки.

## QA-задачи

### Сценарий 1

Ответ:

```javascript
const baseUser = {
  role: 'user',
  active: true
};

const adminUser = {
  ...baseUser,
  role: 'admin'
};
```

Объяснение:

Object spread copies top-level properties, later `role` overrides previous value.

Распространённая ошибка:

Поставить `role: 'admin'` перед `...baseUser`.

Связь с Automation QA:

Test data override.

### Сценарий 2

Ответ:

```javascript
const basePayload = {
  active: true
};

const requestPayload = {
  ...basePayload,
  email: 'anna@example.com'
};
```

Объяснение:

New payload gets base properties and scenario-specific email.

Распространённая ошибка:

Ожидать deep copy для nested data.

Связь с Automation QA:

API request payload composition.

### Сценарий 3

Ответ:

```javascript
function validateThreeStatuses(firstStatus, secondStatus, thirdStatus) {
  console.log(firstStatus, secondStatus, thirdStatus);
}

const statuses = [200, 201, 204];

validateThreeStatuses(...statuses);
```

Объяснение:

Spread expands array значения into separate arguments.

Распространённая ошибка:

Передать `statuses` без Spread и получить array as first argument.

Связь с Automation QA:

Prepared status data becomes helper arguments.

### Сценарий 4

Ответ:

```javascript
const baseConfig = {
  retries: 1
};

const localConfig = {
  ...baseConfig,
  baseUrl: 'http://localhost'
};
```

Объяснение:

Local config extends base config.

Распространённая ошибка:

Не учитывать property override order.

Связь с Automation QA:

Environment-specific config composition.

## Мини-проект

Возможное решение:

```javascript
const basePayload = {
  active: true,
  role: 'user'
};

const adminPayload = {
  ...basePayload,
  role: 'admin',
  email: 'anna@example.com'
};

const smokeStatuses = [200, 201];
const regressionStatuses = [204, 301];
const allStatuses = [...smokeStatuses, ...regressionStatuses];

function validateThreeStatuses(firstStatus, secondStatus, thirdStatus) {
  console.log(firstStatus, secondStatus, thirdStatus);
}

validateThreeStatuses(...allStatuses);
console.log(adminPayload);
console.log(allStatuses);
```

Отчет:

```text
Operation          | Input collection             | Spread result                  | QA meaning
------------------ | ---------------------------- | ------------------------------ | ----------------------
adminPayload       | basePayload                  | payload with admin override    | request test data
allStatuses        | smoke + regression statuses  | combined status list           | validation data
validate statuses  | allStatuses                  | separate helper arguments      | helper invocation
```

Объяснение:

Проект показывает три use cases: object composition, array merging и function call arguments.

Распространённая ошибка:

Смешать Rest и Spread в отчете.

Связь с Automation QA:

Такой setup похож на подготовку request payload и expected statuses для теста.
