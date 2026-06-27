# Решения. Глава 25. Function Expression

## Концептуальные вопросы

### 1. Зачем существуют Function Expressions

Ответ:

Function Expressions существуют, чтобы создавать функцию как значение и сохранять это значение в переменной.

Объяснение:

Function Declaration создает именованную функцию. Function Expression подчеркивает другую идею: справа от `=` появляется function object.

Распространённая ошибка:

Думать, что это просто другой способ написать тот же синтаксис без изменения модели.

Связь с Automation QA:

Так можно хранить validators и helper-функции в переменных.

### 2. Функция как значение

Ответ:

Это значит, что функция может быть сохранена в переменной.

Объяснение:

JavaScript позволяет работать с функцией как со значением: создать, сохранить и вызвать позже.

Распространённая ошибка:

Думать, что функция может только объявляться через `function name()`.

Связь с Automation QA:

Helper-функции могут быть частью набора utilities.

### 3. Что хранит переменная

Ответ:

Переменная хранит function object.

Объяснение:

В `const validateStatus = function () { ... };` справа создается function object, а слева переменная получает это значение.

Распространённая ошибка:

Думать, что переменная хранит результат выполнения тела.

Связь с Automation QA:

Validator можно сохранить и вызвать в нужном месте теста.

### 4. Выполнение при присваивании

Ответ:

Нет. Тело функции не выполняется при присваивании.

Объяснение:

Присваивание сохраняет function object. Вызов происходит только при `validateStatus()`.

Распространённая ошибка:

Ожидать вывод в консоль сразу после строки с Function Expression.

Связь с Automation QA:

Helper не выполняет setup или validation, пока его явно не вызвали.

### 5. Anonymous function expression

Ответ:

Это function expression без собственного имени после `function`.

Объяснение:

В `const validateStatus = function () {}` имя есть у переменной, но не у самого function object.

Распространённая ошибка:

Считать anonymous function всегда нечитаемой.

Связь с Automation QA:

Если переменная названа ясно, helper остается читаемым.

### 6. Named function expression

Ответ:

Это function expression, где function object имеет собственное имя.

Объяснение:

В `const validateStatus = function validateSuccessfulStatus() {}` имя переменной и имя function object не обязаны совпадать.

Распространённая ошибка:

Думать, что это то же самое, что Function Declaration.

Связь с Automation QA:

Может помогать в отладке, но подробно это будет полезнее после следующих глав.

### 7. Declaration vs Expression

Ответ:

Function Declaration объявляет функцию с именем. Function Expression создает function object, которое может быть сохранено в переменной.

Объяснение:

Оба варианта позволяют вызвать функцию, но путь создания отличается.

Распространённая ошибка:

Смешивать две формы и не видеть, где находится function object.

Связь с Automation QA:

Обычные helpers часто пишут declaration, а stored validators могут быть expressions.

### 8. Вызов через переменную

Ответ:

Потому что переменная хранит function object.

Объяснение:

`validateStatus()` сначала читает значение из `validateStatus`, а затем вызывает его как функцию.

Распространённая ошибка:

Писать `validateStatus;` и ожидать выполнение.

Связь с Automation QA:

Забытые скобки означают, что validation helper не был запущен.

### 9. Хорошее имя переменной

Ответ:

Имя переменной объясняет, какое поведение хранится внутри.

Объяснение:

`validateUserProfile` читается как действие. `fn` не дает смысла.

Распространённая ошибка:

Использовать короткое имя ради удобства набора.

Связь с Automation QA:

Хорошие имена utilities делают тесты похожими на сценарии.

### 10. Почему это не callback

Ответ:

Потому что функция здесь только хранится в переменной и вызывается напрямую.

Объяснение:

Callback - это функция, переданная в другую функцию. Эта глава еще не вводит такую модель.

Распространённая ошибка:

Сразу объяснять Function Expression через callbacks.

Связь с Automation QA:

Callbacks появятся позже в обработчиках, ожиданиях и более сложных helper-цепочках.

### 11. Automation QA

Ответ:

Function Expressions могут хранить validators, setup helpers, cleanup helpers и другие utilities.

Объяснение:

Тестовый код часто состоит из повторяемых действий с понятными именами.

Распространённая ошибка:

Хранить все в одной большой функции вместо набора ясных helper-функций.

Связь с Automation QA:

Это основа организованных test utilities.

## Определите declaration vs expression

### Задача 1

Ответ:

Это Function Declaration.

Объяснение:

Код начинается с `function validateStatus()`. Функция объявляется с именем.

Распространённая ошибка:

Искать переменную, которой здесь нет.

Связь с Automation QA:

Так часто пишут обычные helper-функции.

### Задача 2

Ответ:

Это Function Expression.

Переменная `validateStatus` хранит function object.

Объяснение:

Справа от `=` находится `function () { ... }`.

Распространённая ошибка:

Думать, что `validateStatus` хранит результат `console.log`.

Связь с Automation QA:

Так можно хранить reusable validator.

### Задача 3

Ответ:

Это named function expression.

Переменная `cleanupTestData` хранит function object, у которого есть внутреннее имя `cleanup`.

Объяснение:

Справа от `=` находится function expression с именем после `function`.

Распространённая ошибка:

Считать это Function Declaration из-за имени `cleanup`.

Связь с Automation QA:

Такой вариант может быть полезен для читаемости отладки, но не нужен механически везде.

## Определите сохраненный function objects

### Задача 1

Ответ:

Переменная `openProfile` хранит function object.

Function object создается справа от `=`.

Function object вызывается строкой `openProfile();`.

Объяснение:

Сначала значение сохраняется, затем вызывается через переменную.

Распространённая ошибка:

Считать, что тело выполняется сразу при создании.

Связь с Automation QA:

Navigation helper запускается только в месте вызова.

### Задача 2

Ответ:

С function object связаны `validateUser` и `checkUser`.

Для вызова используется `checkUser`.

Тело выполняется, потому что `checkUser()` вызывает сохраненное function object.

Объяснение:

`const checkUser = validateUser;` сохраняет то же function object в другой переменной.

Распространённая ошибка:

Думать, что копируется результат выполнения.

Связь с Automation QA:

Один validator может быть доступен под разными именами, но это может ухудшить читаемость.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
Before
Validate status
After
```

Объяснение:

Function Expression создает значение, но тело выполняется только на строке `validateStatus()`.

Распространённая ошибка:

Ожидать `Validate status` до `Before`.

Связь с Automation QA:

Validator выполняется там, где он вызван.

### Задача 2

Ответ:

```text
function
```

Объяснение:

`validateStatus` хранит function object, а `typeof` для функции возвращает `function`.

Распространённая ошибка:

Ожидать `object` из-за того, что функции связаны с объектной моделью JavaScript.

Связь с Automation QA:

`typeof` помогает быстро проверить, что helper действительно является функцией.

### Задача 3

Ответ:

```text
Cleanup
Setup
```

Объяснение:

Порядок выполнения определяется порядком вызовов, а не порядком "правильного" сценария.

Распространённая ошибка:

Считать, что setup обязан выполниться первым из-за имени.

Связь с Automation QA:

Неверный порядок вызовов helpers ломает тестовый сценарий.

### Задача 4

Ответ:

```text
Stored
```

Объяснение:

Функция сохранена, но не вызвана.

Распространённая ошибка:

Ожидать `Validate status`.

Связь с Automation QA:

Объявленный validator не проверяет ничего без вызова.

## Задачи на отладку

### Задача 1

Ответ:

Нет вызова функции. Нужно написать `validateStatus();`.

Исправление:

```javascript
const validateStatus = function () {
  console.log('Validate status');
};

validateStatus();
```

Объяснение:

`validateStatus;` только читает значение переменной.

Распространённая ошибка:

Забыть круглые скобки.

Связь с Automation QA:

Validation helper не был запущен.

### Задача 2

Ответ:

Имя `fn` не объясняет, какое поведение хранится в переменной.

Исправление:

```javascript
const validateUserProfile = function () {
  console.log('Validate user profile');
};

validateUserProfile();
```

Объяснение:

Переменная хранит function object, поэтому ее имя должно описывать поведение.

Распространённая ошибка:

Использовать техническое имя вместо доменного.

Связь с Automation QA:

Читаемые helper names снижают стоимость поддержки тестов.

### Задача 3

Ответ:

Ошибка в том, что присваивание не выполняет тело функции.

Объяснение:

Строка создает function object и сохраняет его в `validateStatus`.

Распространённая ошибка:

Путать создание function object и invocation.

Связь с Automation QA:

Setup или validation не произойдут без явного вызова.

## QA-задачи

### Сценарий 1

Ответ:

```javascript
const validateApiStatus = function () {
  console.log('Validate API status');
};

validateApiStatus();
```

Объяснение:

Переменная `validateApiStatus` хранит function object.

Распространённая ошибка:

Объявить переменную, но не вызвать ее как функцию.

Связь с Automation QA:

Это reusable API validator.

### Сценарий 2

Ответ:

```javascript
const setupTestData = function () {
  console.log('Create test user');
};

const openUserProfile = function () {
  console.log('Open user profile');
};

const cleanupTestData = function () {
  console.log('Delete test user');
};

setupTestData();
openUserProfile();
cleanupTestData();
```

Объяснение:

Каждая переменная хранит отдельное function object для отдельного действия.

Распространённая ошибка:

Объединить все действия в одну расплывчатую функцию.

Связь с Automation QA:

Это структура простых test utilities.

### Сценарий 3

Ответ:

```javascript
const validateUserProfile = function () {
  console.log('Validate user profile');
};
```

Объяснение:

Function Declaration заменен на Function Expression, где function object сохраняется в переменной.

Распространённая ошибка:

Оставить `function validateUserProfile()` и считать, что это expression.

Связь с Automation QA:

Оба варианта могут использоваться для helper-функций.

### Сценарий 4

Ответ:

```text
validateResponseStatus
createTestUser
openProfilePage
deleteTestData
```

Объяснение:

Имена описывают действие, которое хранится как function object.

Распространённая ошибка:

Выбрать имена `fn`, `handler`, `doIt` без доменного смысла.

Связь с Automation QA:

Хорошие имена делают test utilities понятными.

## Мини-проект

Возможное решение:

```javascript
const setupTestData = function () {
  console.log('Create test user');
};

const validateUserProfile = function () {
  console.log('Validate user profile');
};

const validateUserSettings = function () {
  console.log('Validate user settings');
};

const cleanupTestData = function () {
  console.log('Delete test user');
};

setupTestData();
validateUserProfile();
validateUserSettings();
validateUserProfile();
cleanupTestData();
```

Отчет:

```text
Имя переменной       | Хранимое значение | Вызвана? | QA-смысл
-------------------- | ----------------- | -------- | -----------------------
setupTestData        | function object    | да       | setup helper
validateUserProfile  | function object    | да       | profile validator
validateUserSettings | function object    | да       | settings validator
cleanupTestData      | function object    | да       | cleanup helper
```

Объяснение:

Каждая переменная хранит отдельное function object. `validateUserProfile` вызвана дважды, чтобы показать переиспользование.

Распространённая ошибка:

Создать функции, но забыть вызвать одну из них.

Связь с Automation QA:

Такой мини-проект похож на набор utilities для тестового сценария.
