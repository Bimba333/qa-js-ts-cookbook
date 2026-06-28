# Практика: some()

## Концептуальные вопросы

1. Зачем существует `some()`?
2. Что означает "at least one match"?
3. Что возвращает `some()`?
4. Чем `some()` отличается от `find()`?
5. Почему `some()` подходит для CI gate?
6. Что произойдет, если ни один element не подходит?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const hasFailedTests = testCases.some(function (testCase) {
  return testCase.status === 'failed';
});

console.log(hasFailedTests);
```

Ответьте:

* что будет выведено;
* вернет ли `some()` failed test object;
* какой вопрос задает этот код.

## Предскажите результат выполнения

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'passed', priority: 'high' },
];

const result = testCases.some(function (testCase) {
  return testCase.status === 'failed';
});

console.log(result);
```

Сначала запишите ответ без запуска.

## Отладка

Автор хотел проверить, есть ли failed tests.

```javascript
const hasFailedTests = testCases.some(function (testCase) {
  testCase.status === 'failed';
});

console.log(hasFailedTests);
```

Что не так? Исправьте код.

## QA-сценарий

Создайте Boolean `shouldBlockMerge`, который равен `true`, если есть хотя бы один failed test.

## Мини-проект

Создайте файл `playground/some-ci-gate.js`.

Требования:

* создать array `testCases` из пяти objects;
* проверить, есть ли failed tests;
* проверить, есть ли skipped tests;
* проверить, есть ли high priority tests;
* вывести решения для CI gate.
