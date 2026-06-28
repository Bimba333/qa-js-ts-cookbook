# Практика: Promise API

## Концептуальные вопросы

1. Для чего используется `then()`?
2. Для чего используется `catch()`?
3. Почему `finally()` удобно применять для очистки ресурсов?
4. Почему важно возвращать Promise из шага внутри `then()`?
5. Как Promise API помогает структурировать тестовый поток?

## Чтение кода

```javascript
executeTest()
  .then(function generateReport(result) {
    return createReport(result);
  })
  .catch(function handleError(error) {
    console.log(error);
  })
  .finally(function cleanup() {
    console.log('cleanup');
  });
```

Объясните назначение каждого обработчика.

## Предскажите результат выполнения

```javascript
Promise.resolve('test passed')
  .then(function printResult(result) {
    console.log(result);
  })
  .finally(function cleanup() {
    console.log('cleanup');
  });
```

Сначала запишите вывод без запуска.

## Отладка

```javascript
function generateReport() {
  return Promise.resolve('report generated');
}

generateReport().finally(function cleanup(result) {
  console.log(result);
});
```

Почему не стоит рассчитывать на `result` внутри `finally()`?

## Задание Automation QA

Напишите цепочку Promise:

* `executeTest()`;
* `generateReport(result)`;
* `uploadReport(report)`;
* `catch()` для ошибки;
* `finally()` для очистки ресурсов.

## Мини-проект

Создайте мини-поток:

* подготовить окружение;
* выполнить login;
* выполнить тест;
* сгенерировать отчет;
* очистить ресурсы через `finally()`.
