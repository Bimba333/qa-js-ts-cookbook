# every()

## Связь с предыдущей главой

Предыдущая глава объяснила `some()`: проверку "есть ли хотя бы один match".

Для CI gate иногда этого недостаточно. Вопрос может быть строже: "Все ли tests готовы к запуску?"

## Главный вопрос

> Как проверить, что все elements подходят под condition?

Ответ этой главы: использовать `every()`.

## Предварительные требования

Для этой главы нужно понимать:

* что `some()` отвечает на Boolean question;
* что QA gate может требовать строгую проверку всех test cases;
* что test cases имеют поля `status` и `priority`.

Не требуется изучать новые pipeline methods. Здесь фокус на rule: all must match.

## Цели обучения

После главы вы будете понимать:

* зачем существует `every()`;
* что означает "all match";
* что возвращает `every()`;
* чем `every()` отличается от `some()`;
* как использовать `every()` для validation rules.

## Мотивация

Есть test cases:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
];
```

Перед release нужно проверить: все ли tests завершились passed?

Нужна операция:

## Теория

`every()` проверяет, выполняется ли condition для всех elements.

Общая форма:

```javascript
const allMatch = array.every(function (element) {
  return condition;
});
```

Result — Boolean.

## Внутренний механизм

Концептуальные шаги:

`every()` ищет не совпадение, а нарушение общего правила.

## Главная ментальная модель

Главная модель этой главы: **all must match**.

Вопрос: "Все ли подходят?"

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-57/
```

Запуск:

```bash
node examples/01-javascript/chapter-57/01-all-passed.js
node examples/01-javascript/chapter-57/02-all-have-priority.js
node examples/01-javascript/chapter-57/03-release-gate.js
node examples/01-javascript/chapter-57/04-empty-array.js
node examples/01-javascript/chapter-57/05-common-mistakes.js
```

## Примеры Automation QA

Release gate:

```javascript
const allPassed = testCases.every(function (testCase) {
  return testCase.status === 'passed';
});
```

Metadata validation:

```javascript
const allHavePriority = testCases.every(function (testCase) {
  return testCase.priority !== undefined;
});
```

`every()` хорошо выражает строгие правила: all tests must satisfy condition.

## Распространённые ошибки

### Ошибка 1. Путать `every()` и `some()`

`some()` спрашивает "есть ли хотя бы один", `every()` спрашивает "все ли".

### Ошибка 2. Ожидать список invalid tests

`every()` сообщает результат проверки, а не список invalid elements.

### Ошибка 3. Не понимать empty array

Для empty array `every()` возвращает `true`, потому что нет element, который нарушает condition.

## Краткие итоги

`every()` нужен для строгой проверки всех elements и хорошо подходит для release gates и metadata validation.

## Переход к следующей главе

Теперь мы умеем проверять conditions на объектах.

Следующий вопрос:

> Как проверить, что простое value существует в array?

Эта задача ведет к `includes()`.

Практика:

```text
practice/01-javascript/57-every.md
```

Решения:

```text
solutions/01-javascript/57-every.md
```
