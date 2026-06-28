# Решения: reduce()

## Концептуальные вопросы

### 1. Зачем существует `reduce()`?

Ответ: чтобы агрегировать many elements в один result.

Объяснение: каждый element уточняет общий итог.

Распространённая ошибка: использовать `reduce()` вместо более простого `map()` или `filter()`.

Связь с Automation QA: report summary часто является одним object.

### 2. Что такое accumulator?

Ответ: промежуточный result, который обновляется на каждом шаге.

Объяснение: accumulator показывает, что уже собрано к текущему шагу.

Распространённая ошибка: забыть вернуть accumulator.

Связь с Automation QA: status summary строится постепенно.

### 3. Зачем нужен initial value?

Ответ: чтобы явно задать начальное состояние aggregation.

Объяснение: для count это `0`, для summary object — object со счетчиками.

Распространённая ошибка: не задавать initial value и получать неочевидное поведение.

Связь с Automation QA: явный initial summary делает report predictable.

### 4. Что callback должен вернуть на каждом шаге?

Ответ: next accumulator.

Объяснение: без этого следующий шаг не получит корректное промежуточное состояние.

Распространённая ошибка: изменить accumulator, но не вернуть его.

Связь с Automation QA: broken accumulator ломает итоговый report.

### 5. Чем `reduce()` отличается от `map()`?

Ответ: `map()` возвращает array transformed значения, `reduce()` возвращает один accumulated result.

Объяснение: labels остаются списком, summary становится одним итогом.

Распространённая ошибка: писать сложный `reduce()` там, где достаточно `map()`.

Связь с Automation QA: labels — `map()`, summary — `reduce()`.

### 6. Чем `reduce()` отличается от `filter()`?

Ответ: `filter()` выбирает subset, `reduce()` собирает итог.

Объяснение: список failed tests и количество failed tests — разные результаты.

Распространённая ошибка: использовать `filter()` для подсчета.

Связь с Automation QA: failed tests list — `filter()`, failed count — `reduce()`.

## Чтение кода

Ответ: будет выведено `2`.

Объяснение: initial value равен `0`; счетчик увеличивается только для passed tests.

Распространённая ошибка: считать все test cases, хотя condition проверяет только `passed`.

Связь с Automation QA: так можно посчитать passed checks.

## Предскажите результат выполнения

Ответ:

```text
T-1 T-2 
```

Объяснение: initial value — empty string. Каждый шаг добавляет `id` и пробел.

Распространённая ошибка: ожидать array ids.

Связь с Automation QA: aggregation может собирать report string.

## Отладка

Ответ:

```javascript
const ids = testCases.reduce(function (accumulator, testCase) {
  accumulator.push(testCase.id);
  return accumulator;
}, []);
```

Объяснение: callback должен вернуть accumulator, иначе следующий шаг получит неправильное value.

Распространённая ошибка: изменить accumulator, но не вернуть его.

Связь с Automation QA: сбор report ids должен быть stable.

## QA-сценарий

Ответ:

```javascript
const summary = testCases.reduce(function (accumulator, testCase) {
  accumulator[testCase.status] = accumulator[testCase.status] + 1;
  return accumulator;
}, { passed: 0, failed: 0, skipped: 0 });
```

Объяснение: status используется как key в summary object.

Распространённая ошибка: не подготовить key в initial value.

Связь с Automation QA: такой object подходит для test report dashboard.

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

const total = testCases.reduce(function (count) {
  return count + 1;
}, 0);

const statusSummary = testCases.reduce(function (accumulator, testCase) {
  accumulator[testCase.status] = accumulator[testCase.status] + 1;
  return accumulator;
}, { passed: 0, failed: 0, skipped: 0 });

const prioritySummary = testCases.reduce(function (accumulator, testCase) {
  accumulator[testCase.priority] = accumulator[testCase.priority] + 1;
  return accumulator;
}, { high: 0, medium: 0, low: 0 });

console.log(total);
console.log(statusSummary);
console.log(prioritySummary);
```

Объяснение: total, status summary и priority summary — три разных итога.

Распространённая ошибка: пытаться собрать все summaries в одном сложном reduce слишком рано.

Связь с Automation QA: report обычно состоит из нескольких независимых aggregates.
