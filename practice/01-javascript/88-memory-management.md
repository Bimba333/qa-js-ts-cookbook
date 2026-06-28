# Практика: Memory Management

## Концептуальные вопросы

1. Почему memory leak возможен при наличии Garbage Collector?
2. Что такое long-lived reference?
3. Как closure может удерживать объект?
4. Почему timers могут продлевать жизнь данных?
5. Почему cache должен иметь правило очистки?

## Чтение кода

Какой объект остается reachable?

```javascript
const logBuffer = [];

function saveLog(testName) {
  logBuffer.push({ testName });
}

saveLog('login');
saveLog('checkout');
```

## Предскажите результат

Что выведет код?

```javascript
const cache = new Map();

cache.set('T-1', { status: 'failed' });
cache.delete('T-1');

console.log(cache.has('T-1'));
```

## Определение удерживаемых объектов

Определите, что удерживает объект `report`:

```javascript
function createPrinter() {
  const report = {
    testName: 'api test',
    logs: ['request', 'response'],
  };

  return function print() {
    console.log(report.testName);
  };
}

const print = createPrinter();
```

## Отладка

Почему этот код может удерживать данные дольше ожидаемого?

```javascript
const cache = new Map();

function rememberUser(id, user) {
  cache.set(id, user);
}
```

## Задание Automation QA

Опишите, какие данные тестового фреймворка нужно очищать после завершения теста:

* logs;
* screenshots;
* cached test data;
* temporary reports.

Для каждого пункта объясните, какая ссылка может удерживать данные.

## Мини-проект

Спроектируйте простой cache для тестовых данных:

* `saveTestData(testId, data)`;
* `getTestData(testId)`;
* `clearTestData(testId)`;
* `clearAllTestData()`.

Объясните, почему методы очистки важны для memory management.
