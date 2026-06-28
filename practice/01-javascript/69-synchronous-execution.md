# Практика: Synchronous Execution

## Концептуальные вопросы

1. Что означает синхронное выполнение?
2. Почему следующая инструкция ждет завершения текущей?
3. Что происходит, когда синхронная строка вызывает функцию?
4. Почему синхронный код удобно читать сверху вниз?
5. В чем ограничение синхронной модели для Automation QA?

## Чтение кода

```javascript
function prepareEnvironment() {
  console.log('environment prepared');
}

function runTest() {
  console.log('test executed');
}

console.log('runner started');
prepareEnvironment();
runTest();
console.log('runner finished');
```

Опишите порядок выполнения строк.

## Предскажите результат выполнения

```javascript
function createReport() {
  console.log('report created');
}

console.log('before report');
createReport();
console.log('after report');
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
function runSlowStep() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 100) {}

  console.log('slow step finished');
}

console.log('start');
runSlowStep();
console.log('next step');
```

Почему `next step` не выводится до завершения `runSlowStep()`?

## Задание Automation QA

Создайте синхронный поток:

1. `readConfiguration()`;
2. `prepareEnvironment(configuration)`;
3. `runTest(configuration)`;
4. `createReport(result)`.

Каждая функция должна выводить понятное сообщение.

## Мини-проект

Создайте простой синхронный тестовый раннер.

Требования:

* конфигурация содержит `environment`;
* тест возвращает объект `{ testName, status }`;
* отчет печатает результат;
* порядок выполнения должен быть строго сверху вниз.
