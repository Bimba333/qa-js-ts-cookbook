# Практика: async и await

## Концептуальные вопросы

1. Что возвращает `async`-функция?
2. Что делает `await`?
3. Почему `await` не делает весь JavaScript синхронным?
4. Что будет в переменной, если забыть `await`?
5. Почему `async/await` удобен для тестовых сценариев?

## Чтение кода

```javascript
async function runTest() {
  const session = await login();
  const result = await executeTest(session);
  return result;
}
```

Объясните, какие шаги выполняются последовательно внутри `runTest()`.

## Предскажите результат выполнения

```javascript
async function getResult() {
  return 'passed';
}

getResult().then(function print(result) {
  console.log(result);
});
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
async function runTest() {
  const result = executeTest();
  console.log(result.status);
}
```

Если `executeTest()` возвращает Promise, что здесь неправильно?

## Задание Automation QA

Перепишите Promise-цепочку на `async/await`:

* `prepareEnvironment()`;
* `login(configuration)`;
* `executeTests(session)`;
* `generateReport(result)`.

## Мини-проект

Создайте `async function runFramework()`.

Функция должна:

* подготовить окружение;
* выполнить login;
* выполнить тест;
* сгенерировать отчет;
* вернуть статус отчета.
