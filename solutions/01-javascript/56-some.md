# Решения: some()

## Концептуальные вопросы

### 1. Зачем существует `some()`?

Ответ: чтобы проверить, есть ли хотя бы один matching element.

Объяснение: это вопрос для gate, а не поиск object.

Распространённая ошибка: ожидать найденный object.

Связь с Automation QA: CI gate часто спрашивает "есть ли failures?".

### 2. Что означает "at least one match"?

Ответ: хотя бы один element прошел condition.

Объяснение: одного совпадения достаточно.

Распространённая ошибка: думать, что должны подойти все elements.

Связь с Automation QA: один failed test может заблокировать merge.

### 3. Что возвращает `some()`?

Ответ: `true` или `false`.

Объяснение: это готовый result для `if`.

Распространённая ошибка: использовать result как object.

Связь с Automation QA: Boolean удобно использовать в gate conditions.

### 4. Чем `some()` отличается от `find()`?

Ответ: `some()` дает yes/no result, `find()` возвращает element или `undefined`.

Объяснение: первый метод нужен для решения, второй — для доступа к найденному object.

Распространённая ошибка: выбирать `some()`, когда нужен title найденного test.

Связь с Automation QA: для gate нужен Boolean, для диагностики часто нужен object.

### 5. Почему `some()` подходит для CI gate?

Ответ: gate часто принимает решение да/нет.

Объяснение: gate получает простой yes/no result.

Распространённая ошибка: усложнять gate поиском object, если нужен только Boolean.

Связь с Automation QA: `some()` делает правило gate читаемым.

### 6. Что произойдет, если ни один element не подходит?

Ответ: `some()` вернет `false`.

Объяснение: blocking condition отсутствует.

Распространённая ошибка: ожидать `undefined`.

Связь с Automation QA: `false` может означать, что blocking condition отсутствует.

## Чтение кода

Ответ: будет выведено `true`.

Объяснение: `T-2` имеет `status === 'failed'`, поэтому ответ yes.

Распространённая ошибка: ожидать `T-2`.

Связь с Automation QA: Boolean можно использовать для блокировки pipeline.

## Предскажите результат выполнения

Ответ:

```text
false
```

Объяснение: оба test cases имеют `status: 'passed'`.

Распространённая ошибка: считать, что наличие high priority влияет на status check.

Связь с Automation QA: condition должна соответствовать gate rule.

## Отладка

Ответ:

```javascript
const hasFailedTests = testCases.some(function (testCase) {
  return testCase.status === 'failed';
});
```

Объяснение: callback должен вернуть condition result.

Распространённая ошибка: забыть `return` в обычной function.

Связь с Automation QA: неправильный Boolean может пропустить failed tests.

## QA-сценарий

Ответ:

```javascript
const shouldBlockMerge = testCases.some(function (testCase) {
  return testCase.status === 'failed';
});
```

Объяснение: одного failed test достаточно для блокировки.

Распространённая ошибка: использовать `every()` и проверять всех на failed.

Связь с Automation QA: merge gate часто блокируется одним failure.

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

const hasFailedTests = testCases.some(function (testCase) {
  return testCase.status === 'failed';
});

const hasSkippedTests = testCases.some(function (testCase) {
  return testCase.status === 'skipped';
});

const hasHighPriorityTests = testCases.some(function (testCase) {
  return testCase.priority === 'high';
});

console.log(hasFailedTests ? 'Block merge' : 'Merge allowed');
console.log(hasSkippedTests ? 'Review skipped tests' : 'No skipped tests');
console.log(hasHighPriorityTests ? 'High priority coverage exists' : 'No high priority tests');
```

Объяснение: каждый Boolean отвечает на отдельный gate question.

Распространённая ошибка: смешивать несколько gate questions в одну нечитаемую condition.

Связь с Automation QA: CI decisions должны быть простыми и объяснимыми.
