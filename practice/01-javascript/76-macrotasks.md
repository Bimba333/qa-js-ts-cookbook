# Практика: Macrotasks

## Концептуальные вопросы

1. Что такое Macrotasks?
2. Почему `setTimeout(..., 0)` не выполняется сразу?
3. Чем macrotask отличается от microtask?
4. Как `setInterval()` связан с macrotasks?
5. Почему знание macrotasks помогает читать логи тестового раннера?

## Чтение кода

```javascript
console.log('start');

setTimeout(function uploadReport() {
  console.log('upload report');
}, 0);

Promise.resolve().then(function saveResult() {
  console.log('save result');
});

console.log('finish');
```

Объясните порядок выполнения.

## Предскажите результат выполнения

```javascript
console.log('A');

setTimeout(function firstTimer() {
  console.log('B');
}, 0);

Promise.resolve().then(function microtask() {
  console.log('C');
});

setTimeout(function secondTimer() {
  console.log('D');
}, 0);

console.log('E');
```

Сначала запишите вывод без запуска.

## Отладка

Разработчик считает, что все таймеры выполняются до Promise-обработчиков, если они записаны выше.

Объясните ошибку.

## Задание Automation QA

Напишите код:

* синхронно выполнить тесты;
* через Promise отметить запуск завершенным;
* через `setTimeout()` загрузить отчет;
* через второй `setTimeout()` отправить уведомление.

Предскажите порядок логов.

## Мини-проект

Создайте мини-модель:

* подготовка окружения;
* выполнение теста;
* microtask для сохранения результата;
* macrotask для генерации отчета;
* macrotask для уведомления панели мониторинга.

Объясните итоговый порядок через Call Stack, Microtasks, Macrotasks и Event Loop.
