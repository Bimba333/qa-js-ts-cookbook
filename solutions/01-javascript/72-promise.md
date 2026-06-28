# Решения: Promise

## Концептуальные вопросы

### 1. Что представляет Promise?

Ответ: результат асинхронной операции, который станет доступен позже.

Объяснение: значение еще не готово, но у вызывающего кода уже есть объект для работы с этим будущим результатом.

Распространённая ошибка: думать, что Promise уже содержит обычное готовое значение.

Связь с Automation QA: запуск теста может сразу вернуть Promise результата, который появится позже.

### 2. Почему Promise возвращают из асинхронной вспомогательной функции?

Ответ: чтобы вызывающий код мог дождаться результата через `then()` или обработать ошибку через `catch()`.

Объяснение: без `return` вызывающий код не получит Promise.

Распространённая ошибка: создать Promise внутри вспомогательной функции, но не вернуть его.

Связь с Automation QA: вспомогательная функция запуска теста должна отдавать наружу будущий результат операции.

### 3. Когда выполняется функция, переданная в `then()`?

Ответ: после успешного завершения Promise.

Объяснение: `then()` регистрирует обработчик результата.

Распространённая ошибка: считать, что обработчик выполняется сразу при вызове `then()`.

Связь с Automation QA: печать отчета должна происходить после готовности результата.

### 4. Для чего нужен `catch()`?

Ответ: для обработки ошибки асинхронной операции.

Объяснение: если Promise завершается ошибкой, обработчик `catch()` получает эту ошибку.

Распространённая ошибка: писать только успешный сценарий.

Связь с Automation QA: ошибка подготовки окружения должна быть явно обработана.

### 5. Какую проблему обратных вызовов решает Promise?

Ответ: Promise делает результат после завершения операции отдельным объектом и уменьшает зависимость от вложенных функций.

Объяснение: продолжение работы регистрируется снаружи через `then()`.

Распространённая ошибка: думать, что Promise нужен только ради другого синтаксиса.

Связь с Automation QA: цепочки подготовки, запуска теста и отчета становятся управляемее.

## Чтение кода

Ответ: `createReport()` возвращает Promise. `printReport` вызывается после `resolve('report ready')`.

Объяснение: `then()` регистрирует обработчик будущего успешного результата.

Распространённая ошибка: ожидать вывод в момент создания Promise.

Связь с Automation QA: отчет печатается после готовности.

## Предскажите результат выполнения

Ответ:

```text
before
after
passed
```

Объяснение: Promise завершится позже, поэтому синхронный `after` выводится раньше.

Распространённая ошибка: ожидать `passed` перед `after`.

Связь с Automation QA: результат теста приходит после текущего синхронного участка.

## Отладка

Ответ:

```javascript
function runTest() {
  return new Promise(function resolveTest(resolve) {
    setTimeout(function finishTest() {
      resolve('passed');
    }, 100);
  });
}
```

Объяснение: без `return` функция `runTest()` возвращает `undefined`, поэтому у результата нет метода `then()`.

Распространённая ошибка: забыть вернуть Promise из вспомогательной функции.

Связь с Automation QA: вызывающий код должен получить Promise, чтобы продолжить работу после результата.

## Задание Automation QA

Ответ:

```javascript
function runTest(testName) {
  return new Promise(function resolveTest(resolve, reject) {
    setTimeout(function finishTest() {
      if (!testName) {
        reject('test name is required');
        return;
      }

      resolve({ testName, status: 'passed' });
    }, 100);
  });
}

runTest('login smoke')
  .then(function printResult(result) {
    console.log(`${result.testName}: ${result.status}`);
  })
  .catch(function printError(error) {
    console.log(`error: ${error}`);
  });
```

Объяснение: успешный результат попадает в `then()`, ошибка — в `catch()`.

Распространённая ошибка: не обработать пустое имя теста.

Связь с Automation QA: тестовая вспомогательная функция должна явно отдавать успех или ошибку.

## Мини-проект

Ответ:

```javascript
function prepareEnvironment() {
  return new Promise(function resolveEnvironment(resolve) {
    setTimeout(function finishPreparation() {
      resolve({ environment: 'staging' });
    }, 100);
  });
}

function runTest(configuration) {
  return new Promise(function resolveTest(resolve) {
    setTimeout(function finishTest() {
      resolve({
        testName: 'login smoke',
        status: 'passed',
        environment: configuration.environment,
      });
    }, 100);
  });
}

function createReport(result) {
  return new Promise(function resolveReport(resolve) {
    setTimeout(function finishReport() {
      resolve(`${result.environment}: ${result.testName}: ${result.status}`);
    }, 100);
  });
}

prepareEnvironment()
  .then(function onEnvironmentReady(configuration) {
    return runTest(configuration);
  })
  .then(function onTestFinished(result) {
    return createReport(result);
  })
  .then(function onReportReady(report) {
    console.log(report);
  });
```

Объяснение: каждая вспомогательная функция возвращает Promise результата, который станет доступен позже.

Распространённая ошибка: не возвращать Promise из `then()` при переходе к следующему шагу.

Связь с Automation QA: это основа управляемого асинхронного тестового потока.
