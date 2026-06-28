# Практика: Microtasks

## Концептуальные вопросы

1. Что такое Microtasks?
2. Почему обработчик Promise выполняется раньше таймера?
3. Когда выполняется `queueMicrotask()`?
4. Почему Microtasks не прерывают текущий синхронный код?
5. Как Microtasks могут влиять на порядок операций в тестовом фреймворке?

## Чтение кода

```javascript
console.log('start');

Promise.resolve().then(function saveResult() {
  console.log('save result');
});

console.log('finish');
```

Объясните порядок вывода.

## Предскажите результат выполнения

```javascript
console.log('A');

setTimeout(function timer() {
  console.log('B');
}, 0);

queueMicrotask(function microtask() {
  console.log('C');
});

console.log('D');
```

Сначала запишите вывод без запуска.

## Отладка

Разработчик ожидал, что таймер выполнится раньше Promise, потому что `setTimeout()` написан выше:

```javascript
setTimeout(function uploadReport() {
  console.log('upload report');
}, 0);

Promise.resolve().then(function notifyCompletion() {
  console.log('notify completion');
});
```

Объясните, почему ожидание неверное.

## Задание Automation QA

Напишите код:

* синхронно выполнить тест;
* через `queueMicrotask()` сохранить результат;
* через `setTimeout()` сгенерировать отчет.

Запишите ожидаемый порядок вывода.

## Мини-проект

Создайте тестовый поток:

* `executeTests()` выводит синхронный лог;
* Promise-обработчик отмечает запуск завершенным;
* `setTimeout()` загружает отчет;
* `queueMicrotask()` сохраняет итоговый статус.

Предскажите порядок выполнения.
