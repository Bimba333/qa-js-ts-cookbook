# Практика: Error Handling in Asynchronous Code

## Концептуальные вопросы

1. Что такое rejected Promise?
2. Как `catch()` связан с ошибкой Promise?
3. Как `try/catch` работает с `await`?
4. Что значит распространение ошибки наружу?
5. Почему очистка ресурсов важна при асинхронных ошибках?

## Чтение кода

```javascript
async function runFramework() {
  try {
    const result = await executeTest();
    await uploadReport(result);
  } catch (error) {
    console.log(error);
  }
}
```

Объясните, какие ошибки попадут в `catch`.

## Предскажите результат выполнения

```javascript
async function run() {
  try {
    await Promise.reject('upload failed');
    console.log('success');
  } catch (error) {
    console.log(error);
  }
}

run();
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
try {
  uploadReport();
} catch (error) {
  console.log(error);
}
```

Если `uploadReport()` возвращает rejected Promise, почему этот `try/catch` может не сработать как ожидается?

## Задание Automation QA

Напишите `async function runFramework()`.

Требования:

* выполнить тест;
* попытаться загрузить отчет;
* обработать ошибку через `try/catch`;
* выполнить очистку ресурсов в `finally`.

## Мини-проект

Создайте поток:

* `prepareEnvironment()`;
* `login()`;
* `executeTests()`;
* `captureScreenshot()` при ошибке;
* `cleanup()` в любом случае.
