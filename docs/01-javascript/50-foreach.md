# forEach()

## Связь с предыдущей главой

Предыдущая глава объяснила iteration через `for...of`.

Главная модель была такой:

```text
Array
│
▼
walk through collection
│
▼
one element at a time
```

Теперь мы хотим выразить похожую идею через array method:

```text
Array
│
▼
for each element
│
▼
execute same action
```

## Главный вопрос

> Как выполнить одинаковое действие для каждого element?

Ответ этой главы: использовать `forEach()`.

## Предварительные требования

Для этой главы нужно понимать:

* что array stores ordered elements;
* что iteration проходит по elements;
* что function can be passed as value;
* что action can be represented by function.

Не требуется знать `map()`, `filter()`, `reduce()`, async callbacks, promises or test runner internals. Эти темы будут изучаться позже.

## Цели обучения

После главы вы будете понимать:

* зачем существует `forEach()`;
* как он проходит по array;
* что action передается как function;
* что `forEach()` выполняет side effect;
* почему `forEach()` не возвращает новый array;
* когда `forEach()` читается уместно;
* как использовать его в Automation QA.

## Мотивация

Есть prepared test run:

```javascript
const testRun = [
  'login smoke',
  'create order',
  'apply discount',
  'pay order'
];
```

Нужно для каждого test case выполнить одинаковое действие: зарегистрировать запуск.

```text
test case
│
▼
log execution
```

Можно использовать `for...of`.

Но array also provides method for this shape:

```javascript
testRun.forEach(function (testCase) {
  console.log(`Running: ${testCase}`);
});
```

## Теория

`forEach()` вызывает function для каждого element array.

Общая форма:

```javascript
array.forEach(function (element) {
  // action
});
```

Смысл:

```text
Array
│
▼
take element
│
▼
call function with element
│
▼
repeat for next element
```

`forEach()` обычно используют для side effects:

* log;
* register;
* send command;
* collect report line;
* execute action.

## Внутренний механизм

Conceptual steps:

```text
Array
│
▼
start from first element
│
▼
pass element into function
│
▼
execute action
│
▼
move to next element
│
▼
finish after last element
```

Важно: `forEach()` не создает новый array с результатами.

```text
forEach()
│
▼
execute side effect
│
▼
return value is not used as new collection
```

## Главная ментальная модель

Главная модель этой главы: **side-effect execution**.

```text
Array
│
▼
forEach()
│
▼
same action for each element
│
▼
side effect
```

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-50/
```

Запуск:

```bash
node examples/01-javascript/chapter-50/01-foreach-basic.js
node examples/01-javascript/chapter-50/02-test-case-action.js
node examples/01-javascript/chapter-50/03-index-argument.js
node examples/01-javascript/chapter-50/04-no-returned-array.js
node examples/01-javascript/chapter-50/05-qa-runner.js
```

## Примеры Automation QA

Registering test cases:

```javascript
testRun.forEach(function (testCase) {
  console.log(`Register test: ${testCase}`);
});
```

Executing prepared runner action:

```javascript
testRun.forEach(function (testCase) {
  console.log(`Run test case: ${testCase.title}`);
});
```

Главное: `forEach()` хорошо выражает действие "сделать это для каждого".

## Распространённые ошибки

### Ошибка 1. Ожидать новый array

`forEach()` не предназначен для преобразования collection в новую collection.

### Ошибка 2. Использовать `forEach()` для вычисления value

Если нужен result, будущие главы объяснят другие methods.

### Ошибка 3. Смешивать слишком сложную логику внутри callback

Если action становится большим, лучше вынести его в named function.

## Краткие итоги

`forEach()` нужен, когда для каждого element нужно выполнить action.

Он:

* проходит по array;
* вызывает function для каждого element;
* удобен для side effects;
* не возвращает новый array.

## Переход к следующей главе

Теперь мы умеем выполнять action for each test case.

Следующий вопрос:

> Как преобразовать каждый element и получить новый array?

Эта задача ведет к `map()`.

Практика:

```text
practice/01-javascript/50-foreach.md
```

Решения:

```text
solutions/01-javascript/50-foreach.md
```
