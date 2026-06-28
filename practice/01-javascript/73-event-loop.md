# Практика: Event Loop

## Концептуальные вопросы

1. Зачем нужен Event Loop?
2. Почему Event Loop нельзя считать JavaScript Engine?
3. Что должно произойти с Call Stack перед выполнением отложенного кода?
4. Почему асинхронность не означает параллельное выполнение JavaScript-кода?
5. Как Event Loop помогает объяснять порядок логов в тестовом фреймворке?

## Чтение кода

```javascript
console.log('runner: start');

setTimeout(function generateReport() {
  console.log('report: generated');
}, 0);

console.log('runner: finish');
```

Объясните, почему отчет выводится после `runner: finish`.

## Предскажите результат выполнения

```javascript
console.log('A');

setTimeout(function task() {
  console.log('B');
}, 0);

console.log('C');
```

Сначала запишите вывод без запуска.

## Отладка

Разработчик ожидал, что `setTimeout(..., 0)` выполнится между двумя синхронными строками:

```javascript
console.log('prepare');

setTimeout(function uploadReport() {
  console.log('upload');
}, 0);

console.log('execute tests');
```

Объясните ошибку в ожидании.

## Задание Automation QA

Напишите код, который выводит:

1. начало тестового раннера;
2. синхронное выполнение теста;
3. отложенную генерацию отчета через `setTimeout()`.

Затем объясните порядок вывода через Call Stack и Event Loop.

## Мини-проект

Смоделируйте тестовый фреймворк:

* `prepareEnvironment()` выполняется синхронно;
* `executeTests()` выполняется синхронно;
* `generateReport()` планируется через `setTimeout()`;
* `notifyCompletion()` планируется через Promise.

Запишите ожидаемый порядок выполнения.
