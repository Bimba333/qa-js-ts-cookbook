# Решения: includes()

## Концептуальные вопросы

### 1. Зачем существует `includes()`?

Ответ: чтобы проверить, есть ли value в array.

Объяснение: это прямой presence check без callback.

Распространённая ошибка: использовать callback.

Связь с Automation QA: allowed statuses и priorities удобно проверять через `includes()`.

### 2. Что принимает `includes()`?

Ответ: value, наличие которого нужно проверить.

Объяснение: например, actual status или priority.

Распространённая ошибка: передать function вместо value.

Связь с Automation QA: actual status проверяется against allowed values.

### 3. Что возвращает `includes()`?

Ответ: `true` или `false`.

Объяснение: result показывает presence value.

Распространённая ошибка: ожидать найденный element.

Связь с Automation QA: Boolean можно использовать в validation rule.

### 4. Почему `includes()` удобен для simple arrays?

Ответ: он не требует callback.

Объяснение: для list of strings не нужен callback.

Распространённая ошибка: усложнять проверку там, где нужен простой presence check.

Связь с Automation QA: списки allowed values обычно simple arrays.

### 5. Почему `includes()` не подходит для поиска object by condition?

Ответ: он не проверяет fields object через callback.

Объяснение: object condition требует проверки field, а не simple value.

Распространённая ошибка: пытаться искать object по похожему shape.

Связь с Automation QA: test case by id лучше искать через `find()`.

### 6. Почему порядок `allowedValues.includes(actualValue)` читается лучше?

Ответ: потому что код читается как "список разрешенных values содержит фактическое value".

Объяснение: source of truth находится слева, проверяемое value — внутри вызова.

Распространённая ошибка: вызывать `includes()` на actual value и передавать allowed list.

Связь с Automation QA: whitelist validation становится проще читать.

## Чтение кода

Ответ: будет выведено `true`.

Объяснение: string `'failed'` есть в `allowedStatuses`.

Распространённая ошибка: ожидать index найденного value.

Связь с Automation QA: status признан допустимым.

## Предскажите результат выполнения

Ответ:

```text
false
```

Объяснение: `'critical'` отсутствует в `allowedPriorities`.

Распространённая ошибка: считать, что unknown priority автоматически допустим.

Связь с Automation QA: invalid priority должен быть найден validation rule.

## Debugging

Ответ:

```javascript
const allowedStatuses = ['passed', 'failed', 'skipped'];
const testCase = { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' };

const isValid = allowedStatuses.includes(testCase.status);

console.log(isValid);
```

Объяснение: нужно спрашивать allowed list, содержит ли он actual value.

Распространённая ошибка: вызывать `includes()` на actual string и передавать array.

Связь с Automation QA: validation читается как "allowed values include actual value".

## QA scenario

Ответ:

```javascript
const allowedStatuses = ['passed', 'failed', 'skipped'];

const allStatusesValid = testCases.every(function (testCase) {
  return allowedStatuses.includes(testCase.status);
});
```

Объяснение: `every()` применяет whitelist rule ко всему catalog.

Распространённая ошибка: проверять только первый test case.

Связь с Automation QA: metadata validation должна охватывать весь catalog.

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

const allowedStatuses = ['passed', 'failed', 'skipped'];
const allowedPriorities = ['high', 'medium', 'low'];

const statusIsValid = allowedStatuses.includes(testCases[0].status);
const priorityIsValid = allowedPriorities.includes(testCases[0].priority);

const allValuesAreAllowed = testCases.every(function (testCase) {
  return allowedStatuses.includes(testCase.status)
    && allowedPriorities.includes(testCase.priority);
});

console.log(statusIsValid);
console.log(priorityIsValid);
console.log(allValuesAreAllowed);
```

Объяснение: allowed lists остаются simple arrays, а общий gate проверяет весь catalog.

Распространённая ошибка: пытаться решить object validation только через `includes()`.

Связь с Automation QA: whitelist validation защищает CI от неожиданных metadata values.
