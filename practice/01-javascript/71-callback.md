# Практика: Callback

## Концептуальные вопросы

1. Что такое обратный вызов?
2. Почему обратный вызов передают как функцию, а не как готовое значение?
3. Как результат асинхронной операции попадает в обратный вызов?
4. Зачем в обратный вызов иногда передают ошибку?
5. Почему вложенные обратные вызовы могут усложнять код?

## Чтение кода

```javascript
function createReport(callback) {
  setTimeout(function finishReport() {
    callback('report ready');
  }, 100);
}

createReport(function printReport(report) {
  console.log(report);
});
```

Объясните, какая функция является обратным вызовом и когда она вызывается.

## Предскажите результат выполнения

```javascript
function runTest(callback) {
  console.log('test started');

  setTimeout(function finishTest() {
    callback('passed');
  }, 100);
}

runTest(function printStatus(status) {
  console.log(status);
});

console.log('runner continues');
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
function runTest(callback) {
  setTimeout(function finishTest() {
    callback('passed');
  }, 100);
}

runTest(console.log('test finished'));
```

Почему этот код работает неправильно? Исправьте передачу обратного вызова.

## Задание Automation QA

Создайте `runTest(testName, callback)`.

Требования:

* тест завершается через `setTimeout()`;
* результат имеет форму `{ testName, status }`;
* обратный вызов печатает результат.

## Мини-проект

Создайте поток:

1. `prepareEnvironment(callback)`;
2. `runTest(configuration, callback)`;
3. `createReport(result, callback)`.

Используйте обратные вызовы для передачи данных между шагами.
