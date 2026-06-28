# Практика: Chaining basics

## Концептуальные вопросы

1. Зачем нужен chaining?
2. Почему после `filter()` можно вызвать `map()`?
3. Как читать chain слева направо?
4. Почему порядок `filter().map()` и `map().filter()` важен?
5. Когда лучше разбить chain на named variables?
6. Почему side effects лучше не смешивать с transformation chain?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const reportLines = testCases
  .filter(function (testCase) {
    return testCase.priority === 'high';
  })
  .map(function (testCase) {
    return `${testCase.id}: ${testCase.title}`;
  });

console.log(reportLines);
```

Ответьте:

* что делает первый step;
* что делает второй step;
* что будет в `reportLines`.

## Предскажите результат выполнения

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const result = testCases
  .filter(function (testCase) {
    return testCase.status === 'passed';
  })
  .map(function (testCase) {
    return testCase.id;
  });

console.log(result);
```

Сначала запишите ответ без запуска.

## Отладка

Автор хотел получить labels только для failed tests.

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const result = testCases
  .map(function (testCase) {
    return `${testCase.id}: ${testCase.title}`;
  })
  .filter(function (testCase) {
    return testCase.status === 'failed';
  });
```

Что не так? Исправьте порядок или shape данных.

## QA-сценарий

Создайте chain:

* выбрать tests, где `status !== 'skipped'`;
* преобразовать их в строки `id - title - status`.

## Мини-проект

Создайте файл `playground/chaining-ci-report.js`.

Требования:

* создать array `testCases` из пяти objects;
* построить chain `filter().map()` для high priority report;
* построить chain `filter().map()` для failed report;
* вывести оба report arrays;
* если chain становится трудно читать, разбить его на intermediate variables.
