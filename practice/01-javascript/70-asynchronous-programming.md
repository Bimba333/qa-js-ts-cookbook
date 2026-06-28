# Практика: Asynchronous Programming

## Концептуальные вопросы

1. Почему некоторые операции завершаются позже?
2. Чем отличается запуск операции от получения результата?
3. Почему нельзя читать результат сразу после планирования отложенной операции?
4. Зачем среда выполнения участвует в асинхронных операциях?
5. Какие задачи Automation QA часто завершаются не сразу?

## Чтение кода

```javascript
console.log('before');

setTimeout(function finishReport() {
  console.log('report ready');
}, 100);

console.log('after');
```

Объясните, почему `after` выводится раньше `report ready`.

## Предскажите результат выполнения

```javascript
let status = 'not ready';

setTimeout(function prepare() {
  status = 'ready';
  console.log(status);
}, 100);

console.log(status);
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
let result = 'unknown';

setTimeout(function finishTest() {
  result = 'passed';
}, 100);

console.log(`test result: ${result}`);
```

Почему выводится `unknown`, хотя внутри отложенной функции значение меняется?

## Задание Automation QA

Смоделируйте отложенную генерацию отчета через `setTimeout()`.

Требования:

* сначала вывести `test executed`;
* позже вывести `report generated`;
* показать, что синхронный код после запуска генерации выполняется раньше отчета.

## Мини-проект

Создайте имитацию подготовки окружения:

* `startEnvironmentPreparation()`;
* внутри используется `setTimeout()`;
* сразу после запуска подготовки выводится сообщение `runner continues`;
* позже выводится `environment ready`.
