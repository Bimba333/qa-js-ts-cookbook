# Практика: Web APIs

## Концептуальные вопросы

1. Чем JavaScript отличается от среды выполнения?
2. Почему `setTimeout()` не является синтаксисом языка JavaScript?
3. Что делает среда выполнения, когда JavaScript вызывает `setTimeout()`?
4. Почему тело обратного вызова все равно выполняется как JavaScript-код?
5. Какие API среды выполнения часто встречаются в Automation QA?

## Чтение кода

```javascript
console.log('schedule upload');

setTimeout(function uploadReport() {
  console.log('upload report');
}, 100);

console.log('continue current code');
```

Опишите, какая часть относится к JavaScript-коду, а какая — к API среды выполнения.

## Предскажите результат выполнения

```javascript
console.log('start');

setTimeout(function prepareEnvironment() {
  console.log('environment ready');
}, 0);

console.log('finish');
```

Сначала запишите вывод без запуска.

## Отладка

Разработчик говорит: "`setTimeout()` выполняет мой JavaScript-код параллельно".

Объясните, почему это неверная модель.

## Задание Automation QA

Создайте функцию `uploadReportLater(reportName)`, которая использует `setTimeout()` и выводит сообщение о загрузке отчета позже.

Объясните, что делает JavaScript-код и что делает среда выполнения.

## Мини-проект

Смоделируйте поток:

* синхронно создать отчет;
* через `setTimeout()` запланировать загрузку отчета;
* синхронно вывести, что раннер продолжает работу.

Опишите, где участвует среда выполнения.
