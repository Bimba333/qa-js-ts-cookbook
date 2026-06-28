# Решения: практическое управление контекстом

## Концептуальные вопросы

### 1. Когда лучше использовать Closure?

Ответ: когда функция должна помнить данные из внешней функции.

Почему так происходит: configuration, счетчики и накопленные результаты хорошо подходят для Closure.

Распространённая ошибка: использовать глобальные переменные вместо замкнутого состояния.

Связь с Automation QA: factory может создать logger с сохраненным окружением.

### 2. Когда лучше использовать `this`?

Ответ: когда функция является методом объекта и работает с его полями.

Что происходит внутри: `this.name` или `this.environment` читают данные объекта выполнения.

Распространённая ошибка: путать поля объекта с переменными Closure.

Связь с Automation QA: Reporter может хранить имя и формат отчета.

### 3. Когда нужен `bind()`?

Ответ: когда метод зависит от `this` и будет вызван позже без объекта перед точкой.

На что обратить внимание: `bind()` сохраняет объект выполнения в новой функции.

Распространённая ошибка: передать метод напрямую как обратный вызов.

Связь с Automation QA: TestRunner часто вызывает обратные вызовы позже.

### 4. Почему потеря контекста опасна для reporter?

Ответ: метод reporter может потерять доступ к `this.name` или `this.environment`.

Почему возникает ошибка: без правильного объекта выполнения `this` больше не указывает на reporter.

Распространённая ошибка: искать проблему в данных теста, хотя потерян контекст.

Связь с Automation QA: отчет может падать при генерации результата.

### 5. Как отличить состояние Closure от данных объекта?

Ответ: Closure читает переменные из внешней функции, а `this` читает поля объекта выполнения.

Что происходит внутри: `configuration.environment` из фабрики — Closure; `this.name` из метода — `this`.

Распространённая ошибка: объяснять оба механизма одним словом "контекст".

Связь с Automation QA: это помогает проектировать понятные вспомогательные функции.

## Чтение кода

Ответ: `configuration` используется через Closure, `this.name` используется через `this`, `bind()` сохраняет Reporter как объект выполнения.

На что обратить внимание: возвращенная функция должна работать позже, поэтому метод привязывается заранее.

Распространённая ошибка: убрать `bind()` и ожидать тот же результат.

Связь с Automation QA: привязанный обратный вызов отчета безопасен для передачи в раннер.

## Предскажите результат выполнения

Ответ:

```text
true
false
```

Почему так происходит: `attempt` хранится в Closure и увеличивается при каждом вызове.

Распространённая ошибка: думать, что `attempt` сбрасывается.

Связь с Automation QA: RetryManager должен помнить попытки между вызовами.

## Отладка

Ответ: нужно передать `Reporter.report.bind(Reporter)`.

Почему возникает ошибка: `runTest(Reporter.report)` передает метод без объекта выполнения.

Распространённая ошибка: исправлять `Reporter.name`, хотя проблема в потере `this`.

Связь с Automation QA: обратные вызовы должны сохранять контекст, если используют `this`.

## Задание Automation QA

Ответ:

```javascript
function createFramework(configuration) {
  const Reporter = {
    name: 'console reporter',
    report(testName, status) {
      console.log(`${this.name}: ${configuration.environment}: ${testName} -> ${status}`);
    },
  };

  const report = Reporter.report.bind(Reporter);

  return {
    log(message) {
      console.log(`[${configuration.environment}] ${message}`);
    },
    runTest(testName, status) {
      this.log(`start ${testName}`);
      report(testName, status);
    },
  };
}
```

Что происходит внутри: `configuration` хранится через Closure, `Reporter.report` сохраняет `this` через `bind()`.

Распространённая ошибка: передать `Reporter.report` без привязки.

Связь с Automation QA: такая вспомогательная функция фреймворка стабильно работает при передаче функций.

## Мини-проект

Ответ:

```javascript
function createFramework(Configuration) {
  const Logger = {
    prefix: 'runner',
    log(message) {
      console.log(`${Configuration.environment} [${this.prefix}] ${message}`);
    },
  };

  const Reporter = {
    name: 'console reporter',
    report(testName, status) {
      console.log(`${this.name}: ${testName} -> ${status}`);
    },
  };

  function createRetryManager(maxRetries) {
    let attempt = 0;

    return function shouldRetry() {
      attempt += 1;
      return attempt <= maxRetries;
    };
  }

  const log = Logger.log.bind(Logger);
  const report = Reporter.report.bind(Reporter);
  const shouldRetry = createRetryManager(Configuration.retries);

  return {
    runTest(testName, status) {
      log(`start ${testName}`);
      report(testName, status);
      console.log(`can retry: ${shouldRetry()}`);
    },
  };
}

const TestRunner = createFramework({
  environment: 'staging',
  retries: 1,
});

TestRunner.runTest('login smoke', 'passed');
```

На что обратить внимание: Configuration хранится через Closure, Reporter и Logger используют `this`, методы безопасно привязаны через `bind()`.

Распространённая ошибка: смешать все зависимости в глобальном объекте.

Связь с Automation QA: это мини-модель устойчивого кода фреймворка.
