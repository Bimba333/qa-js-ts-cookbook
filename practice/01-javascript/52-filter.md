# Практика: filter()

## Концептуальные вопросы

1. Зачем существует `filter()`?
2. Что должен вернуть callback внутри `filter()`?
3. Что происходит, если callback возвращает `true`?
4. Что происходит, если callback возвращает `false`?
5. Изменяет ли `filter()` исходный array?
6. Чем `filter()` отличается от `map()`?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const failedTests = testCases.filter(function (testCase) {
  return testCase.status === 'failed';
});

console.log(failedTests);
```

Ответьте:

* сколько elements будет в `failedTests`;
* какой test case будет выбран;
* изменился ли `testCases`.

## Предскажите результат выполнения

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const highPriorityTests = testCases.filter(function (testCase) {
  return testCase.priority === 'high';
});

console.log(highPriorityTests.length);
```

Сначала запишите ответ без запуска.

## Отладка

Автор хотел выбрать failed tests.

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const failedTests = testCases.filter(function (testCase) {
  testCase.status === 'failed';
});

console.log(failedTests);
```

Что не так? Исправьте код.

## QA-сценарий

Создайте `ciReadyTests`, который содержит все test cases, кроме `status: 'skipped'`.

## Мини-проект

Создайте файл `playground/filter-ci-tests.js`.

Требования:

* создать array `testCases` из пяти objects;
* выбрать failed tests;
* выбрать high priority tests;
* выбрать tests, которые не skipped;
* вывести все три subsets;
* не изменять исходный `testCases`.
