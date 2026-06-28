# Практика: Parallel Asynchronous Operations

## Концептуальные вопросы

1. Когда асинхронные операции стоит запускать вместе?
2. Чем `Promise.all()` отличается от `Promise.allSettled()`?
3. Чем `Promise.race()` отличается от `Promise.any()`?
4. Почему `Promise.all()` не делает JavaScript-код параллельным внутри Call Stack?
5. Какие операции в Automation QA можно запускать вместе после теста?

## Чтение кода

```javascript
const artifacts = await Promise.all([
  collectLogs(),
  captureScreenshot(),
]);
```

Объясните, почему эти операции можно запускать вместе.

## Предскажите результат выполнения

```javascript
Promise.all([
  Promise.resolve('logs'),
  Promise.resolve('screenshot'),
]).then(function print(results) {
  console.log(results);
});
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
const logs = await collectLogs();
const screenshot = await captureScreenshot();
```

Если операции независимы, что можно улучшить?

## Задание Automation QA

Выберите подходящий метод:

* нужно дождаться логов и скриншота;
* нужно узнать результат всех загрузок, даже если часть упала;
* нужно взять самый быстрый health check;
* нужно взять первый успешный endpoint.

## Мини-проект

Создайте `async function finishTestRun()`.

Функция должна:

* параллельно собрать логи и скриншот;
* затем загрузить отчет;
* через `allSettled()` собрать результаты уведомлений в несколько каналов.
