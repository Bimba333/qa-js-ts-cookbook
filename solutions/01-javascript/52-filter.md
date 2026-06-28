# Решения: filter()

## Концептуальные вопросы

### 1. Зачем существует `filter()`?

Ответ: чтобы выбрать elements, которые подходят под condition.

Объяснение: в result попадают только matching elements.

Распространённая ошибка: ждать transformation вместо selection.

Связь с Automation QA: CI часто запускает только failed, high priority или ready tests.

### 2. Что должен вернуть callback внутри `filter()`?

Ответ: condition result: `true` или `false`.

Объяснение: `true` оставляет element, `false` пропускает.

Распространённая ошибка: забыть `return`.

Связь с Automation QA: неверный predicate может исключить важные tests.

### 3. Что происходит, если callback возвращает `true`?

Ответ: текущий element попадает в result array.

Объяснение: element проходит проверку и остается в result.

Распространённая ошибка: думать, что `true` превращается в вывод element.

Связь с Automation QA: matching test case остается в selected run.

### 4. Что происходит, если callback возвращает `false`?

Ответ: текущий element не попадает в result array.

Объяснение: исходный массив не меняется, но result этот element не получает.

Распространённая ошибка: думать, что `filter()` удаляет element из source.

Связь с Automation QA: skipped test может быть исключен из CI run без изменения source plan.

### 5. Изменяет ли `filter()` исходный array?

Ответ: нет.

Объяснение: исходный массив остается полным catalog.

Распространённая ошибка: ожидать, что исходный массив станет короче.

Связь с Automation QA: full test catalog остается доступным.

### 6. Чем `filter()` отличается от `map()`?

Ответ: `filter()` выбирает elements, `map()` преобразует elements.

Объяснение: это разные задачи pipeline: выбрать или преобразовать.

Распространённая ошибка: использовать `filter()` для создания labels.

Связь с Automation QA: сначала можно выбрать failed tests, а потом преобразовать их в report lines.

## Чтение кода

Ответ: в `failedTests` будет один element: test case `T-2`.

Объяснение: только `T-2` имеет `status === 'failed'`. `testCases` не изменился.

Распространённая ошибка: ожидать, что result содержит status string.

Связь с Automation QA: такой subset подходит для rerun failed tests.

## Предскажите результат выполнения

Ответ:

```text
2
```

Объяснение: high priority имеют `T-1` и `T-2`.

Распространённая ошибка: включить `T-3`, потому что он passed, но condition проверяет priority.

Связь с Automation QA: condition должен соответствовать цели selection.

## Отладка

Ответ:

```javascript
const failedTests = testCases.filter(function (testCase) {
  return testCase.status === 'failed';
});
```

Объяснение: без `return` callback возвращает `undefined`, а `undefined` не оставляет element.

Распространённая ошибка: считать, что expression сам автоматически возвращается из обычной function.

Связь с Automation QA: пустой rerun list может скрыть реальные failures.

## QA-сценарий

Ответ:

```javascript
const ciReadyTests = testCases.filter(function (testCase) {
  return testCase.status !== 'skipped';
});
```

Объяснение: selected array содержит все tests, которые не skipped.

Распространённая ошибка: проверять только `status === 'passed'` и случайно исключить failed tests из rerun pipeline.

Связь с Automation QA: CI selection часто включает passed и failed tests, но исключает skipped.

## Мини-проект

Ответ:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
  { id: 'T-5', title: 'refund order', status: 'failed', priority: 'medium' },
];

const failedTests = testCases.filter(function (testCase) {
  return testCase.status === 'failed';
});

const highPriorityTests = testCases.filter(function (testCase) {
  return testCase.priority === 'high';
});

const ciReadyTests = testCases.filter(function (testCase) {
  return testCase.status !== 'skipped';
});

console.log(failedTests);
console.log(highPriorityTests);
console.log(ciReadyTests);
console.log(testCases);
```

Объяснение: каждый subset отвечает на отдельный вопрос pipeline.

Распространённая ошибка: объединять разные conditions без понимания workflow.

Связь с Automation QA: разные CI jobs могут использовать разные subsets одного test catalog.
