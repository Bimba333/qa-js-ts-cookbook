# Решения: sort()

## Концептуальные вопросы

### 1. Какой ordering rule нужен, чтобы отсортировать test cases по `id`?

Ответ: сравнить `id` каждого test case.

Объяснение: `firstTest.id.localeCompare(secondTest.id)` задает string order по id.

Ошибка: сравнивать entire objects instead of their `id`.

QA связь: order by id удобно сверять с test management system.

### 2. Почему default sort может поставить `T-10` перед `T-2`?

Ответ: default sort compares values as strings.

Объяснение: string comparison compares characters, not numeric part of id.

Ошибка: ожидать numeric order без compare function.

QA связь: test id order should be explicit when report order matters.

### 3. Когда нужен compare function?

Ответ: когда order должен зависеть от custom rule.

Объяснение: для objects JavaScript не знает, по какому field их нужно упорядочить.

Ошибка: вызывать `sort()` на objects без правила.

QA связь: priority/status order is a triage rule, and it should be visible in code.

### 4. Какой order нужен, чтобы high priority tests оказались выше?

Ответ: например `{ high: 1, medium: 2, low: 3 }`.

Объяснение: меньший rank ставит element раньше.

Ошибка: сортировать priority alphabetically.

QA связь: high priority failures should be visible first.

### 5. Что произойдет с current array после вызова `sort()`?

Ответ: current array получит новый order.

Объяснение: `sort()` changes the same array, not a separate result.

Ошибка: ожидать original order in later steps.

QA связь: shared execution list can affect next report step.

## Чтение кода

Ответ:

```text
T-1
T-3
```

Объяснение: sort by id changes order to `T-1`, `T-2`, `T-3`.

Ошибка: считать, что `testCases` остался в старом порядке.

QA связь: later report steps read already ordered data.

## Предскажите результат выполнения

Ответ:

```text
['T-1', 'T-10', 'T-2', 'T-3']
```

Объяснение: default sort compares strings.

Ошибка: ожидать `T-10` after `T-3`.

QA связь: default order should not define CI report ordering accidentally.

## Debugging

Ответ:

```javascript
const priorityOrder = { high: 1, medium: 2, low: 3 };

testCases.sort(function (firstTest, secondTest) {
  return priorityOrder[firstTest.priority] - priorityOrder[secondTest.priority];
});
```

Объяснение: для objects нужен explicit order по field.

Ошибка: думать, что default sort понимает `priority`.

QA связь: priority sorting должен совпадать с правилами triage.

## QA scenario

Ответ:

```javascript
const statusOrder = { failed: 1, skipped: 2, passed: 3 };

testCases.sort(function (firstTest, secondTest) {
  return statusOrder[firstTest.status] - statusOrder[secondTest.status];
});
```

Объяснение: failed tests поднимаются наверх.

Ошибка: сортировать status alphabetically вместо business order.

QA связь: failures должны быть видны первыми.

## Мини-проект

Ответ:

```javascript
const testCases = [
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-5', title: 'refund order', status: 'failed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

testCases.sort(function (firstTest, secondTest) {
  return firstTest.id.localeCompare(secondTest.id);
});
console.log(testCases.map(function (testCase) { return testCase.id; }));

const priorityOrder = { high: 1, medium: 2, low: 3 };
testCases.sort(function (firstTest, secondTest) {
  return priorityOrder[firstTest.priority] - priorityOrder[secondTest.priority];
});
console.log(testCases.map(function (testCase) { return testCase.id; }));

const statusOrder = { failed: 1, skipped: 2, passed: 3 };
testCases.sort(function (firstTest, secondTest) {
  return statusOrder[firstTest.status] - statusOrder[secondTest.status];
});
console.log(testCases.map(function (testCase) { return testCase.id; }));
console.log(testCases);
```

Объяснение: каждая сортировка применяет новый rule к current array.

Ошибка: считать, что каждая сортировка начинается с original order.

QA связь: report ordering должен быть управляемым и ожидаемым.
