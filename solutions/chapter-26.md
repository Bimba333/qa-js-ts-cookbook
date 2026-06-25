# Решения. Глава 26. Arrow Functions

## Концептуальные вопросы

### 1. Зачем появились Arrow Functions

Ответ:

Компактная запись была одной из причин появления Arrow Functions. В этой главе они рассматриваются как arrow-синтаксис для создания function object.

Рассуждение:

Function Expression уже работает, но форма `function () { ... }` бывает слишком длинной для коротких функций. Arrow-синтаксис решает эту часть проблемы, но не сводится только к сокращению записи.

Типичная ошибка:

Думать, что Arrow Function создает новый тип значения или полностью равна Function Expression "только короче".

Связь с Automation QA:

Короткие validators и helpers часто читаются удобнее в arrow-форме.

### 2. Проблема компактной записи

Ответ:

Компактная запись уменьшает синтаксический шум в тех случаях, где функция действительно короткая.

Рассуждение:

`const validate = () => { ... }` короче, чем `const validate = function () { ... }`. В этой главе мы рассматриваем именно этот аспект Arrow Functions.

Типичная ошибка:

Считать, что меньше символов всегда означает лучше, или что компактность объясняет все особенности Arrow Functions.

Связь с Automation QA:

Тесты должны быть краткими, но не загадочными.

### 3. Что создает Arrow Function

Ответ:

Arrow Function создает function object.

Рассуждение:

Результат можно сохранить в переменной и вызвать через `()`.

Типичная ошибка:

Представлять Arrow Function как отдельную категорию значений.

Связь с Automation QA:

Helper остается function object независимо от синтаксиса создания.

### 4. Не новый тип значения

Ответ:

Arrow Function не является новым типом значения, потому что она создает function object, относящийся к object values.

Рассуждение:

Меняется синтаксис создания, а не общая модель значений.

Типичная ошибка:

Рисовать `Function` отдельно от `Object`.

Связь с Automation QA:

Это помогает не путаться при чтении utilities и helpers.

### 5. Сходство с Function Expression

Ответ:

Обе формы создают function object и часто сохраняют его в переменной.

Рассуждение:

Разница видна справа от `=`, но результат концептуально похож.

Типичная ошибка:

Думать, что Arrow Function выполняется сразу.

Связь с Automation QA:

Arrow helper тоже нужно вызвать.

### 6. Отличие записи

Ответ:

Arrow Function использует `=>` и не использует слово `function`.

Рассуждение:

`function () { ... }` заменяется на `() => { ... }`.

Типичная ошибка:

Смешивать обе формы в одной записи.

Связь с Automation QA:

Единый стиль helpers делает код понятнее.

### 7. Explicit return

Ответ:

Explicit return использует слово `return` внутри тела `{}`.

Рассуждение:

Если тело блочное, значение нужно вернуть явно.

Типичная ошибка:

Написать выражение внутри `{}` и ожидать автоматический возврат.

Связь с Automation QA:

Validator может неожиданно вернуть `undefined`.

### 8. Implicit return

Ответ:

Implicit return возвращает результат выражения без `return`.

Рассуждение:

Это работает в форме `() => expression`.

Типичная ошибка:

Использовать implicit return для слишком сложной логики.

Связь с Automation QA:

Подходит для коротких boolean validators.

### 9. Один параметр без скобок

Ответ:

Скобки можно убрать, когда параметр ровно один.

Рассуждение:

`statusCode => { ... }` и `(statusCode) => { ... }` допустимы.

Типичная ошибка:

Убирать скобки при нескольких параметрах.

Связь с Automation QA:

Короткий validator может принимать один status code.

### 10. Когда скобки обязательны

Ответ:

Скобки обязательны для пустого списка параметров и для нескольких параметров.

Рассуждение:

`()` обозначает отсутствие параметров, `(actual, expected)` - несколько параметров.

Типичная ошибка:

Писать `actual, expected => {}`.

Связь с Automation QA:

Сравнение expected/actual обычно требует двух значений.

### 11. Короткая запись не всегда лучше

Ответ:

Короткая запись хуже, если скрывает смысл.

Рассуждение:

Сложная проверка с conditionals может стать нечитаемой в одну строку.

Типичная ошибка:

Делать код "умным" вместо понятного.

Связь с Automation QA:

Автотесты должны быстро объяснять причину проверки.

### 12. Почему не callbacks и не lexical this

Ответ:

Потому что эта глава объясняет только создание function object через arrow-синтаксис.

Рассуждение:

Callbacks и lexical `this` требуют отдельных моделей.

Типичная ошибка:

Перегружать первую главу про Arrow Functions будущими темами.

Связь с Automation QA:

Эти темы появятся позже в helper-цепочках и Playwright-коде.

## Rewrite Function Expressions as Arrow Functions

### Задача 1

Ответ:

```javascript
const validateStatus = () => {
  console.log('Status is valid');
};
```

Рассуждение:

`function ()` заменено на `() =>`.

Типичная ошибка:

Забыть `=>`.

Связь с Automation QA:

Это простой validation helper.

### Задача 2

Ответ:

```javascript
const validateUserProfile = () => {
  console.log('Validate user profile');
};
```

Рассуждение:

Function object сохраняется в той же переменной.

Типичная ошибка:

Переименовать helper без необходимости.

Связь с Automation QA:

Имя helper сохраняет смысл проверки.

### Задача 3

Ответ:

```javascript
const isSuccessfulStatus = () => {
  return true;
};
```

или:

```javascript
const isSuccessfulStatus = () => true;
```

Рассуждение:

Первый вариант использует explicit return, второй - implicit return.

Типичная ошибка:

Написать `{ true; }` без `return`.

Связь с Automation QA:

Boolean validator должен действительно вернуть boolean.

### Задача 4

Ответ:

```javascript
const compareStatus = (actualStatus, expectedStatus) => {
  return actualStatus === expectedStatus;
};
```

или:

```javascript
const compareStatus = (actualStatus, expectedStatus) => actualStatus === expectedStatus;
```

Рассуждение:

Для двух параметров скобки обязательны.

Типичная ошибка:

Убрать скобки вокруг двух параметров.

Связь с Automation QA:

Сравнение actual и expected часто встречается в assertions.

## Identify implicit return

### Задача 1

Ответ:

Implicit return.

Рассуждение:

После `=>` идет выражение без `{}`.

Типичная ошибка:

Искать слово `return`.

Связь с Automation QA:

Хорошо подходит для короткого status validator.

### Задача 2

Ответ:

Explicit return.

Рассуждение:

Есть тело `{}` и слово `return`.

Типичная ошибка:

Считать любую Arrow Function implicit.

Связь с Automation QA:

Блочное тело удобно для более подробной проверки.

### Задача 3

Ответ:

Implicit return.

Рассуждение:

Строка возвращается как результат выражения.

Типичная ошибка:

Добавить `{}` и забыть `return`.

Связь с Automation QA:

Можно использовать для коротких сообщений.

### Задача 4

Ответ:

Explicit return.

Рассуждение:

Значение возвращается словом `return` из блочного тела.

Типичная ошибка:

Пытаться уместить много шагов в implicit return.

Связь с Automation QA:

Для нескольких шагов явная форма читабельнее.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
Before
Validate status
After
```

Рассуждение:

Тело выполняется на строке `validateStatus()`.

Типичная ошибка:

Ожидать вывод при создании Arrow Function.

Связь с Automation QA:

Helper работает только после вызова.

### Задача 2

Ответ:

```text
true
```

Рассуждение:

Implicit return возвращает `true`.

Типичная ошибка:

Думать, что нужен `return` в любой Arrow Function.

Связь с Automation QA:

Короткий validator возвращает boolean.

### Задача 3

Ответ:

```text
undefined
```

Рассуждение:

В `{}` нет `return`, поэтому значение не возвращается.

Типичная ошибка:

Путать expression body и block body.

Связь с Automation QA:

Такой validator сломает assertion.

### Задача 4

Ответ:

```text
200
```

Рассуждение:

Один параметр получает значение `200`.

Типичная ошибка:

Думать, что скобки вокруг одного параметра всегда обязательны.

Связь с Automation QA:

Status code часто передается в validator.

## Задачи на отладку

### Задача 1

Ответ:

Функция не вызвана.

Исправление:

```javascript
const validateStatus = () => {
  console.log('Validate status');
};

validateStatus();
```

Рассуждение:

`validateStatus;` только читает переменную.

Типичная ошибка:

Забыть `()`.

Связь с Automation QA:

Проверка не выполнится.

### Задача 2

Ответ:

Результат будет `undefined`.

Исправление:

```javascript
const isSuccessfulStatus = () => {
  return true;
};
```

или:

```javascript
const isSuccessfulStatus = () => true;
```

Рассуждение:

В блочном теле нужен explicit return.

Типичная ошибка:

Думать, что любое выражение внутри `{}` возвращается автоматически.

Связь с Automation QA:

Assertion может получить `undefined` вместо boolean.

### Задача 3

Ответ:

Для нескольких параметров нужны скобки.

Исправление:

```javascript
const compareStatus = (actualStatus, expectedStatus) => {
  return actualStatus === expectedStatus;
};
```

Рассуждение:

Без скобок допустим только один параметр.

Типичная ошибка:

Применить правило одного параметра к нескольким.

Связь с Automation QA:

Сравнение actual/expected требует корректной формы параметров.

### Задача 4

Ответ:

Код может быть хуже для чтения из-за условного выражения в одну строку.

Рассуждение:

Короткая форма скрывает шаги проверки.

Типичная ошибка:

Считать, что компактность важнее ясности.

Связь с Automation QA:

Тестовый код должен ясно показывать причину результата.

## QA-oriented tasks

### Сценарий 1

Ответ:

```javascript
const isSuccessfulStatus = () => true;

console.log(isSuccessfulStatus());
```

Рассуждение:

Используется implicit return.

Типичная ошибка:

Добавить `{}` и забыть `return`.

Связь с Automation QA:

Короткий status validator.

### Сценарий 2

Ответ:

```javascript
const validateUserProfile = () => {
  console.log('Validate user profile');
};

validateUserProfile();
```

Рассуждение:

Тело содержит действие, поэтому блочная форма читаема.

Типичная ошибка:

Объявить helper и не вызвать.

Связь с Automation QA:

Reusable profile validation helper.

### Сценарий 3

Ответ:

```javascript
const cleanupTestData = () => {
  console.log('Delete test user');
};
```

Рассуждение:

`function ()` заменяется на `() =>`.

Типичная ошибка:

Оставить старую форму и добавить `=>`.

Связь с Automation QA:

Cleanup helper остается явным.

### Сценарий 4

Ответ:

```text
короткий validator, который возвращает boolean → implicit return
длинная проверка из нескольких действий → block body with explicit steps
helper с понятным именем и одним console.log → arrow with block body
сложная проверка с условием → readable block body
```

Рассуждение:

Выбор синтаксиса зависит от читаемости.

Типичная ошибка:

Использовать implicit return везде.

Связь с Automation QA:

Ясные helpers легче поддерживать в тестовом фреймворке.

## Мини-проект

Возможное решение:

```javascript
const setupTestData = () => {
  console.log('Create test user');
};

const isSuccessfulStatus = () => true;

const validateUserProfile = () => {
  console.log('Validate user profile');
};

const cleanupTestData = () => {
  console.log('Delete test user');
};

setupTestData();
console.log('Status is successful:', isSuccessfulStatus());
validateUserProfile();
cleanupTestData();
```

Отчет:

```text
Имя переменной        | Синтаксис       | Возврат         | QA-смысл
--------------------- | --------------- | --------------- | -----------------------
setupTestData         | arrow block     | no explicit use | setup helper
isSuccessfulStatus    | arrow expression| implicit return | status validator
validateUserProfile   | arrow block     | no explicit use | profile validator
cleanupTestData       | arrow block     | no explicit use | cleanup helper
```

Рассуждение:

Мини-проект показывает два варианта arrow-синтаксиса: блочное тело для действий и implicit return для короткого boolean validator.

Типичная ошибка:

Сделать все функции однострочными, даже когда это ухудшает чтение.

Связь с Automation QA:

Так строится набор читаемых utilities для тестового сценария.
