# Практика: Debugging

## Концептуальные вопросы

1. Почему debugging начинается с воспроизведения проблемы?
2. Что означает "изолировать проблему"?
3. Почему нельзя менять несколько вещей одновременно?
4. Чем полезен stack trace?
5. Почему `console.log()` должен проверять конкретное предположение, а не просто отмечать место в коде?

## Чтение кода

Почему результат пустой?

```javascript
function getFailedTests(results) {
  return results.filter((result) => result.status === 'failed');
}

const results = [
  { id: 'T-1', status: 'passed' },
  { id: 'T-2', status: 'fail' },
];

console.log(getFailedTests(results));
```

## Предскажите поведение

Что выведет код?

```javascript
function getStatus(report) {
  return report.status;
}

const report = {
  status: 'pending',
};

console.log(getStatus(report) === 'passed');
```

## Задание на отладку

Найдите первое предположение, которое нужно проверить:

```javascript
const expectedStatus = 'paid';
const actualStatus = pageStatus;

if (actualStatus !== expectedStatus) {
  throw new Error('Wrong order status');
}
```

Какие данные нужно вывести или проверить, чтобы перейти от symptom к root cause перед изменением assertion?

## Задание Automation QA

Опишите план debugging для flaky Playwright-теста:

```text
тест иногда падает в CI
│
▼
локально проходит
```

План должен включать:

* воспроизведение;
* проверку test data;
* проверку API response;
* проверку UI состояние;
* чтение stack trace;
* проверку исправления.

## Мини-проект

Спроектируйте helper `debugTestResult(result)`.

Он должен выводить:

* `test id`;
* ожидаемый статус;
* фактический статус;
* признак совпадения;
* короткую подсказку, что проверить дальше.

Объясните, как такой helper помогает перейти от symptom к root cause и почему он полезнее, чем случайные `console.log('here')`.
