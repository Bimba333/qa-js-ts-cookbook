# Практика: every()

## Концептуальные вопросы

1. Зачем существует `every()`?
2. Что означает "all must match"?
3. Что возвращает `every()`?
4. Чем `every()` отличается от `some()`?
5. Почему `every()` подходит для release gate?
6. Что возвращает `every()` для empty array?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const allPassed = testCases.every(function (testCase) {
  return testCase.status === 'passed';
});

console.log(allPassed);
```

Ответьте:

* что будет выведено;
* какой element нарушает condition;
* вернет ли `every()` invalid test object.

## Предскажите результат выполнения

```javascript
const testCases = [];

const result = testCases.every(function (testCase) {
  return testCase.status === 'passed';
});

console.log(result);
```

Сначала запишите ответ без запуска.

## Отладка

Автор хотел проверить, что все tests имеют priority.

```javascript
const allHavePriority = testCases.every(function (testCase) {
  testCase.priority !== undefined;
});

console.log(allHavePriority);
```

Что не так? Исправьте код.

## QA-сценарий

Создайте Boolean `canRelease`, который равен `true` только если все tests имеют `status: 'passed'`.

## Мини-проект

Создайте файл `playground/every-release-gate.js`.

Требования:

* создать array `testCases` из пяти objects;
* проверить, все ли tests passed;
* проверить, все ли tests имеют priority;
* проверить, все ли tests имеют непустой title;
* вывести решение release gate.
