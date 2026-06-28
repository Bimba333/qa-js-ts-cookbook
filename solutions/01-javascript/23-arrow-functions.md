# Решения. Глава 26. Arrow Functions

## Концептуальные вопросы

### 1. Зачем появились Arrow Functions

Ответ:

Компактная запись была одной из причин появления Arrow Functions. В этой главе они рассматриваются как arrow-синтаксис для создания function object.

Объяснение:

Function Expression уже работает, но форма `function () { ... }` бывает слишком длинной для коротких функций. Arrow-синтаксис решает эту часть проблемы, но не сводится только к сокращению записи.

Распространённая ошибка:

Думать, что Arrow Function создает новый тип значения или полностью равна Function Expression "только короче".

Связь с Automation QA:

Короткие validators и helpers часто читаются удобнее в arrow-форме.

### 2. Проблема компактной записи

Ответ:

Компактная запись уменьшает синтаксический шум в тех случаях, где функция действительно короткая.

Объяснение:

`const validate = () => { ... }` короче, чем `const validate = function () { ... }`. В этой главе мы рассматриваем именно этот аспект Arrow Functions.

Распространённая ошибка:

Считать, что меньше символов всегда означает лучше, или что компактность объясняет все особенности Arrow Functions.

Связь с Automation QA:

Тесты должны быть краткими, но не загадочными.

### 3. Что создает Arrow Function

Ответ:

Arrow Function создает function object.

Объяснение:

Результат можно сохранить в переменной и вызвать через `()`.

Распространённая ошибка:

Представлять Arrow Function как отдельную категорию значений.

Связь с Automation QA:

Helper остается function object независимо от синтаксиса создания.

### 4. Не новый тип значения

Ответ:

Arrow Function не является новым типом значения, потому что она создает function object, относящийся к object значения.

Объяснение:

Меняется синтаксис создания, а не общая модель значений.

Распространённая ошибка:

Рисовать `Function` отдельно от `Object`.

Связь с Automation QA:

Это помогает не путаться при чтении utilities и helpers.

### 5. Сходство с Function Expression

Ответ:

Обе формы создают function object и часто сохраняют его в переменной.

Объяснение:

Разница видна справа от `=`, но результат концептуально похож.

Распространённая ошибка:

Думать, что Arrow Function выполняется сразу.

Связь с Automation QA:

Arrow helper тоже нужно вызвать.

### 6. Отличие записи

Ответ:

Arrow Function использует `=>` и не использует слово `function`.

Объяснение:

`function () { ... }` заменяется на `() => { ... }`.

Распространённая ошибка:

Смешивать обе формы в одной записи.

Связь с Automation QA:

Единый стиль helpers делает код понятнее.

### 7. Explicit return

Ответ:

Explicit return использует слово `return` внутри тела `{}`.

Объяснение:

Если тело блочное, значение нужно вернуть явно.

Распространённая ошибка:

Написать выражение внутри `{}` и ожидать автоматический возврат.

Связь с Automation QA:

Validator может неожиданно вернуть `undefined`.

### 8. Implicit return

Ответ:

Implicit return возвращает результат выражения без `return`.

Объяснение:

Это работает в форме `() => expression`.

Распространённая ошибка:

Использовать implicit return для слишком сложной логики.

Связь с Automation QA:

Подходит для коротких boolean validators.

### 9. Один параметр без скобок

Ответ:

Скобки можно убрать, когда параметр ровно один.

Объяснение:

`statusCode => { ... }` и `(statusCode) => { ... }` допустимы.

Распространённая ошибка:

Убирать скобки при нескольких параметрах.

Связь с Automation QA:

Короткий validator может принимать один status code.

### 10. Когда скобки обязательны

Ответ:

Скобки обязательны для пустого списка параметров и для нескольких параметров.

Объяснение:

`()` обозначает отсутствие параметров, `(actual, expected)` - несколько параметров.

Распространённая ошибка:

Писать `actual, expected => {}`.

Связь с Automation QA:

Сравнение expected/actual обычно требует двух значений.

### 11. Короткая запись не всегда лучше

Ответ:

Короткая запись хуже, если скрывает смысл.

Объяснение:

Сложная проверка с conditionals может стать нечитаемой в одну строку.

Распространённая ошибка:

Делать код "умным" вместо понятного.

Связь с Automation QA:

Автотесты должны быстро объяснять причину проверки.

### 12. Почему не callbacks и не lexical this

Ответ:

Потому что эта глава объясняет только создание function object через arrow-синтаксис.

Объяснение:

Callbacks и lexical `this` требуют отдельных моделей.

Распространённая ошибка:

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

Объяснение:

`function ()` заменено на `() =>`.

Распространённая ошибка:

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

Объяснение:

Function object сохраняется в той же переменной.

Распространённая ошибка:

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

Объяснение:

Первый вариант использует explicit return, второй - implicit return.

Распространённая ошибка:

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

Объяснение:

Для двух параметров скобки обязательны.

Распространённая ошибка:

Убрать скобки вокруг двух параметров.

Связь с Automation QA:

Сравнение actual и expected часто встречается в assertions.

## Определите implicit return

### Задача 1

Ответ:

Implicit return.

Объяснение:

После `=>` идет выражение без `{}`.

Распространённая ошибка:

Искать слово `return`.

Связь с Automation QA:

Хорошо подходит для короткого status validator.

### Задача 2

Ответ:

Explicit return.

Объяснение:

Есть тело `{}` и слово `return`.

Распространённая ошибка:

Считать любую Arrow Function implicit.

Связь с Automation QA:

Блочное тело удобно для более подробной проверки.

### Задача 3

Ответ:

Implicit return.

Объяснение:

Строка возвращается как результат выражения.

Распространённая ошибка:

Добавить `{}` и забыть `return`.

Связь с Automation QA:

Можно использовать для коротких сообщений.

### Задача 4

Ответ:

Explicit return.

Объяснение:

Значение возвращается словом `return` из блочного тела.

Распространённая ошибка:

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

Объяснение:

Тело выполняется на строке `validateStatus()`.

Распространённая ошибка:

Ожидать вывод при создании Arrow Function.

Связь с Automation QA:

Helper работает только после вызова.

### Задача 2

Ответ:

```text
true
```

Объяснение:

Implicit return возвращает `true`.

Распространённая ошибка:

Думать, что нужен `return` в любой Arrow Function.

Связь с Automation QA:

Короткий validator возвращает boolean.

### Задача 3

Ответ:

```text
undefined
```

Объяснение:

В `{}` нет `return`, поэтому значение не возвращается.

Распространённая ошибка:

Путать expression body и block body.

Связь с Automation QA:

Такой validator сломает assertion.

### Задача 4

Ответ:

```text
200
```

Объяснение:

Один параметр получает значение `200`.

Распространённая ошибка:

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

Объяснение:

`validateStatus;` только читает переменную.

Распространённая ошибка:

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

Объяснение:

В блочном теле нужен explicit return.

Распространённая ошибка:

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

Объяснение:

Без скобок допустим только один параметр.

Распространённая ошибка:

Применить правило одного параметра к нескольким.

Связь с Automation QA:

Сравнение actual/expected требует корректной формы параметров.

### Задача 4

Ответ:

Код может быть хуже для чтения из-за условного выражения в одну строку.

Объяснение:

Короткая форма скрывает шаги проверки.

Распространённая ошибка:

Считать, что компактность важнее ясности.

Связь с Automation QA:

Тестовый код должен ясно показывать причину результата.

## QA-задачи

### Сценарий 1

Ответ:

```javascript
const isSuccessfulStatus = () => true;

console.log(isSuccessfulStatus());
```

Объяснение:

Используется implicit return.

Распространённая ошибка:

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

Объяснение:

Тело содержит действие, поэтому блочная форма читаема.

Распространённая ошибка:

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

Объяснение:

`function ()` заменяется на `() =>`.

Распространённая ошибка:

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

Объяснение:

Выбор синтаксиса зависит от читаемости.

Распространённая ошибка:

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

Объяснение:

Мини-проект показывает два варианта arrow-синтаксиса: блочное тело для действий и implicit return для короткого boolean validator.

Распространённая ошибка:

Сделать все функции однострочными, даже когда это ухудшает чтение.

Связь с Automation QA:

Так строится набор читаемых utilities для тестового сценария.
