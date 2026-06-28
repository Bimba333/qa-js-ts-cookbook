# Практика: Closures

## Концептуальные вопросы

1. Что сохраняет Closure?
2. Почему Closure не является копией значений?
3. Почему функция может читать переменную после завершения внешней функции?
4. Чем Closure полезен для хранения конфигурации?
5. Когда лучше передать значение параметром, а не использовать Closure?

## Чтение кода

```javascript
function createLogger(configuration) {
  return function log(message) {
    console.log(`[${configuration.environment}] ${message}`);
  };
}

const log = createLogger({ environment: 'staging' });

log('start test');
```

Объясните, почему `log` видит `configuration`.

## Предскажите результат выполнения

```javascript
function createRetryManager(maxRetries) {
  let attempt = 0;

  return function nextAttempt() {
    attempt += 1;
    return attempt <= maxRetries;
  };
}

const shouldRetry = createRetryManager(2);

console.log(shouldRetry());
console.log(shouldRetry());
console.log(shouldRetry());
```

Сначала запишите вывод без запуска.

## Отладка

Автор ожидал, что `results` будет доступен снаружи:

```javascript
function createReporter() {
  const results = [];

  return function report(testName) {
    results.push(testName);
  };
}

const report = createReporter();
report('login');

console.log(results);
```

Объясните ошибку.

## Задание Automation QA

Создайте `createUrlBuilder(configuration)`, который возвращает функцию `buildUrl(path)`. Функция должна помнить `baseUrl` из configuration.

## Мини-проект

Создайте `createFrameworkLogger(configuration)`.

Требования:

* хранить `environment`;
* возвращать функцию `log(message)`;
* печатать сообщения в формате `[environment] message`;
* показать два вызова logger;
* объяснить, где появляется Closure.
