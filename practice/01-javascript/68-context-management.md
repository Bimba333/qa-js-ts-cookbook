# Практика: практическое управление контекстом

## Концептуальные вопросы

1. Когда лучше использовать Closure?
2. Когда лучше использовать `this`?
3. Когда нужен `bind()`?
4. Почему потеря контекста опасна для reporter?
5. Как отличить состояние Closure от данных объекта?

## Чтение кода

```javascript
function createFramework(configuration) {
  const Reporter = {
    name: 'console reporter',
    report(testName) {
      console.log(`${configuration.environment}: ${this.name}: ${testName}`);
    },
  };

  return Reporter.report.bind(Reporter);
}

const report = createFramework({ environment: 'staging' });
report('login');
```

Объясните, где используется Closure, где используется `this`, и зачем нужен `bind()`.

## Предскажите результат выполнения

```javascript
function createRetryManager(maxRetries) {
  let attempt = 0;

  return function shouldRetry() {
    attempt += 1;
    return attempt <= maxRetries;
  };
}

const shouldRetry = createRetryManager(1);

console.log(shouldRetry());
console.log(shouldRetry());
```

Сначала запишите вывод без запуска.

## Отладка

Метод reporter передали как обратный вызов:

```javascript
const Reporter = {
  name: 'console reporter',
  report(testName) {
    console.log(`${this.name}: ${testName}`);
  },
};

function runTest(reportResult) {
  reportResult('login');
}

runTest(Reporter.report);
```

Что нужно исправить?

## Задание Automation QA

Создайте `createFramework(configuration)`, который возвращает:

* `log(message)`;
* `runTest(testName, status)`.

`log` должен помнить configuration через Closure. `runTest` должен использовать reporter с корректным `this`.

## Мини-проект

Соберите мини-фреймворк:

* `Configuration`;
* `Logger`;
* `Reporter`;
* `RetryManager`;
* `TestRunner`.

Покажите:

* Closure для configuration;
* `this` в Reporter;
* `bind()` для безопасной передачи метода;
* один запуск теста.
