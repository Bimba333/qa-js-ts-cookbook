# Практика: reduce()

## Концептуальные вопросы

1. Зачем существует `reduce()`?
2. Что такое accumulator?
3. Зачем нужен initial value?
4. Что callback должен вернуть на каждом шаге?
5. Чем `reduce()` отличается от `map()`?
6. Чем `reduce()` отличается от `filter()`?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const passedCount = testCases.reduce(function (count, testCase) {
  if (testCase.status === 'passed') {
    return count + 1;
  }

  return count;
}, 0);

console.log(passedCount);
```

Ответьте:

* какое initial value используется;
* как меняется accumulator;
* что будет выведено.

## Предскажите результат выполнения

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const ids = testCases.reduce(function (accumulator, testCase) {
  return `${accumulator}${testCase.id} `;
}, '');

console.log(ids);
```

Сначала запишите ответ без запуска.

## Отладка

Автор хотел собрать ids в array.

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const ids = testCases.reduce(function (accumulator, testCase) {
  accumulator.push(testCase.id);
}, []);

console.log(ids);
```

Что не так? Исправьте код.

## QA-сценарий

Соберите status summary:

```javascript
{
  passed: 0,
  failed: 0,
  skipped: 0
}
```

Для каждого test case увеличивайте счетчик нужного status.

## Мини-проект

Создайте файл `playground/reduce-test-summary.js`.

Требования:

* создать array `testCases` из пяти objects;
* через `reduce()` посчитать total tests;
* через `reduce()` собрать status summary;
* через `reduce()` собрать priority summary;
* вывести все результаты.
