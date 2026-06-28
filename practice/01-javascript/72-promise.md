# Практика: Promise

## Концептуальные вопросы

1. Что представляет Promise?
2. Почему Promise возвращают из асинхронной вспомогательной функции?
3. Когда выполняется функция, переданная в `then()`?
4. Для чего нужен `catch()`?
5. Какую проблему обратных вызовов решает Promise?

## Чтение кода

```javascript
function createReport() {
  return new Promise(function resolveReport(resolve) {
    setTimeout(function finishReport() {
      resolve('report ready');
    }, 100);
  });
}

createReport().then(function printReport(report) {
  console.log(report);
});
```

Объясните, что возвращает `createReport()` и когда вызывается `printReport`.

## Предскажите результат выполнения

```javascript
function runTest() {
  return new Promise(function resolveTest(resolve) {
    setTimeout(function finishTest() {
      resolve('passed');
    }, 100);
  });
}

console.log('before');

runTest().then(function printStatus(status) {
  console.log(status);
});

console.log('after');
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
function runTest() {
  new Promise(function resolveTest(resolve) {
    setTimeout(function finishTest() {
      resolve('passed');
    }, 100);
  });
}

runTest().then(function printStatus(status) {
  console.log(status);
});
```

Почему этот код падает? Исправьте вспомогательную функцию.

## Задание Automation QA

Создайте `runTest(testName)`, который возвращает Promise.

Требования:

* Promise завершается объектом `{ testName, status }`;
* `then()` печатает результат;
* `catch()` обрабатывает ошибку, если имя теста пустое.

## Мини-проект

Перепишите мини-проект из главы про обратные вызовы на Promise.

Поток:

1. `prepareEnvironment()`;
2. `runTest(configuration)`;
3. `createReport(result)`.

Каждая функция должна возвращать Promise.
