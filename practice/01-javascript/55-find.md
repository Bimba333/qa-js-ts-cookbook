# Практика: find()

## Концептуальные вопросы

1. Зачем существует `find()`?
2. Что возвращает `find()`, если match найден?
3. Что возвращает `find()`, если match не найден?
4. Чем `find()` отличается от `filter()`?
5. Почему после `find()` иногда нужно проверять `undefined`?
6. Когда `find()` полезен в CI validation?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

const result = testCases.find(function (testCase) {
  return testCase.status === 'failed';
});

console.log(result);
```

Ответьте:

* какой element будет найден;
* будет ли result array;
* что произойдет, если failed test отсутствует.

## Предскажите результат выполнения

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const result = testCases.find(function (testCase) {
  return testCase.id === 'T-99';
});

console.log(result);
```

Сначала запишите ответ без запуска.

## Debugging

Автор хотел вывести title test case `T-99`.

```javascript
const targetTest = testCases.find(function (testCase) {
  return testCase.id === 'T-99';
});

console.log(targetTest.title);
```

Что не так? Исправьте код так, чтобы он был безопасным.

## QA scenario

Найдите первый high priority test case и выведите его `id` и `title`.

## Мини-проект

Создайте файл `playground/find-test-case.js`.

Требования:

* создать array `testCases` из пяти objects;
* найти test case by id;
* найти первый failed test;
* найти missing test case;
* безопасно обработать `undefined`;
* вывести результаты.
