# Практика: call(), apply(), bind()

## Концептуальные вопросы

1. Что позволяет выбрать `call()`?
2. Чем `apply()` отличается от `call()`?
3. Почему `bind()` не вызывает функцию сразу?
4. Когда `bind()` полезнее обычного вызова?
5. Как восстановить потерянный `this`?

## Чтение кода

```javascript
const Reporter = {
  environment: 'staging',
  report(testName, status) {
    console.log(`${this.environment}: ${testName} -> ${status}`);
  },
};

const report = Reporter.report;

report.call(Reporter, 'login', 'passed');
```

Объясните, почему `this` снова указывает на `Reporter`.

## Предскажите результат выполнения

```javascript
const Logger = {
  prefix: 'api',
  log(message) {
    console.log(`[${this.prefix}] ${message}`);
  },
};

const logApi = Logger.log.bind(Logger);

logApi('request started');
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
const Reporter = {
  environment: 'staging',
  report(testName) {
    console.log(`${this.environment}: ${testName}`);
  },
};

const boundReport = Reporter.report.bind(Reporter);
```

Почему после этой строки отчет еще не напечатан?

## Задание Automation QA

Передайте метод `Reporter.report` в функцию `runTest(testName, status, reportResult)` без потери `this`.

## Мини-проект

Создайте `Logger`, `Reporter` и `runTest`.

Требования:

* `Logger.log` должен использовать `this.prefix`;
* `Reporter.report` должен использовать `this.environment`;
* сохранить оба метода через `bind()`;
* передать привязанные функции в `runTest`;
* показать вывод.
