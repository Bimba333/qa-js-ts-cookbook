# Практика: this

## Концептуальные вопросы

1. От чего зависит значение `this`?
2. Что будет `this` при вызове `object.method()`?
3. Почему метод может потерять контекст?
4. Чем `this` отличается от Closure?
5. Почему методы Reporter часто используют `this`?

## Чтение кода

```javascript
const Reporter = {
  environment: 'staging',
  report(testName) {
    console.log(`${this.environment}: ${testName}`);
  },
};

Reporter.report('login');
```

Объясните, на что указывает `this`.

## Предскажите результат выполнения

```javascript
const Logger = {
  prefix: 'api',
  log(message) {
    console.log(`[${this.prefix}] ${message}`);
  },
};

Logger.log('request started');
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
'use strict';

const Reporter = {
  environment: 'staging',
  report(testName) {
    console.log(`${this.environment}: ${testName}`);
  },
};

const report = Reporter.report;
report('login');
```

Почему код падает?

## Задание Automation QA

Создайте объект `Logger` с полем `prefix` и методом `log(message)`, который использует `this.prefix`.

## Мини-проект

Создайте объект `Reporter`.

Требования:

* поле `environment`;
* метод `report(testName, status)`;
* метод должен использовать `this.environment`;
* показать обычный вызов метода;
* показать, почему отделенный метод опасен.
