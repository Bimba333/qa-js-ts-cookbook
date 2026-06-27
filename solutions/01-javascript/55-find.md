# Решения: find()

## Концептуальные вопросы

### 1. Зачем существует `find()`?

Ответ: чтобы найти первый element, который подходит под condition.

Объяснение: `find()` нужен, когда нужен один конкретный test case, а не список.

Распространённая ошибка: ожидать array.

Связь с Automation QA: часто нужно найти test by id или первый failed test.

### 2. Что возвращает `find()`, если match найден?

Ответ: сам matching element.

Объяснение: result будет object из source array.

Распространённая ошибка: думать, что result обернут в array.

Связь с Automation QA: найденный test можно сразу использовать для сообщения или gate.

### 3. Что возвращает `find()`, если match не найден?

Ответ: `undefined`.

Объяснение: это сигнал, что matching element отсутствует.

Распространённая ошибка: сразу читать property без проверки.

Связь с Automation QA: missing test id должен обрабатываться явно.

### 4. Чем `find()` отличается от `filter()`?

Ответ: `find()` возвращает один element, `filter()` возвращает array matches.

Объяснение: `find()` отвечает "где первый?", а не "какие все?".

Распространённая ошибка: использовать `find()` для получения всех failed tests.

Связь с Automation QA: один failed test для расследования — `find()`, список failed tests — другая задача.

### 5. Почему после `find()` иногда нужно проверять `undefined`?

Ответ: потому что matching element может отсутствовать.

Объяснение: безопасный код сначала проверяет result, а потом читает properties.

Распространённая ошибка: `targetTest.title` при `targetTest === undefined`.

Связь с Automation QA: CI validation не должен падать из-за отсутствующего id без понятного сообщения.

### 6. Когда `find()` полезен в CI validation?

Ответ: когда нужно найти один known test case для решения или сообщения.

Объяснение: например, найти `T-2` по id и вывести его title.

Распространённая ошибка: строить лишний array там, где нужен один object.

Связь с Automation QA: gate часто проверяет конкретный test case.

## Чтение кода

Ответ: будет найден object `T-2`.

Объяснение: это первый test case со `status === 'failed'`. Result не array. Если failed test отсутствует, result будет `undefined`.

Распространённая ошибка: ожидать список failed tests.

Связь с Automation QA: так можно быстро найти первый failure для диагностики.

## Предскажите результат выполнения

Ответ:

```text
undefined
```

Объяснение: test case с id `T-99` отсутствует.

Распространённая ошибка: ожидать empty array.

Связь с Automation QA: missing id — нормальная ситуация, которую нужно обработать.

## Debugging

Ответ:

```javascript
const targetTest = testCases.find(function (testCase) {
  return testCase.id === 'T-99';
});

if (targetTest !== undefined) {
  console.log(targetTest.title);
} else {
  console.log('Test case not found');
}
```

Объяснение: перед чтением `title` нужно убедиться, что `find()` вернул object.

Распространённая ошибка: читать property у `undefined`.

Связь с Automation QA: diagnostic output должен объяснять missing test.

## QA scenario

Ответ:

```javascript
const highPriorityTest = testCases.find(function (testCase) {
  return testCase.priority === 'high';
});

if (highPriorityTest !== undefined) {
  console.log(`${highPriorityTest.id}: ${highPriorityTest.title}`);
}
```

Объяснение: `find()` возвращает первый high priority test.

Распространённая ошибка: ожидать все high priority tests.

Связь с Automation QA: можно быстро найти первый critical candidate для gate.

## Мини-проект

Ответ:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
  { id: 'T-5', title: 'refund order', status: 'passed', priority: 'medium' },
];

const byId = testCases.find(function (testCase) {
  return testCase.id === 'T-3';
});

const failedTest = testCases.find(function (testCase) {
  return testCase.status === 'failed';
});

const missingTest = testCases.find(function (testCase) {
  return testCase.id === 'T-99';
});

console.log(byId);
console.log(failedTest);

if (missingTest === undefined) {
  console.log('Missing test was not found');
}
```

Объяснение: каждый search возвращает один element или `undefined`.

Распространённая ошибка: не проверять missing result.

Связь с Automation QA: test lookup должен быть безопасным.
