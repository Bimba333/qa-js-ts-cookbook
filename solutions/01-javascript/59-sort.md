# Решения: sort()

## Концептуальные вопросы

### 1. Какой ordering rule нужен, чтобы отсортировать test cases по `id`?

Ответ: сравнить `id` каждого test case.

Объяснение: `firstTest.id.localeCompare(secondTest.id)` задает строковый порядок по id.

Ошибка: сравнивать объекты целиком вместо их `id`.

QA связь: сортировку по id удобно сверять с test management system.

### 2. Почему сортировка по умолчанию может поставить `T-10` перед `T-2`?

Ответ: сортировка по умолчанию сравнивает значения как строки.

Объяснение: строковое сравнение сравнивает символы, а не числовую часть id.

Ошибка: ожидать числовой порядок без функции сравнения.

QA связь: порядок test id должен быть явным, если порядок отчёта важен.

### 3. Когда нужна функция сравнения?

Ответ: когда порядок должен зависеть от собственного правила.

Объяснение: для объектов JavaScript не знает, по какому поле их нужно упорядочить.

Ошибка: вызывать `sort()` на объектах без правила.

QA связь: priority/status order is a triage rule, and it should be visible in code.

### 4. Какой order нужен, чтобы high priority tests оказались выше?

Ответ: например `{ high: 1, medium: 2, low: 3 }`.

Объяснение: меньший rank ставит element раньше.

Ошибка: сортировать priority по алфавиту.

QA связь: ошибки с высоким приоритетом должны быть видны первыми.

### 5. Что произойдет с current array после вызова `sort()`?

Ответ: current array получит новый order.

Объяснение: `sort()` изменяет тот же массив, а не отдельный результат.

Ошибка: ожидать исходный порядок на следующих шагах.

QA связь: общий список выполнения может повлиять на следующий шаг отчёта.

## Чтение кода

Ответ:

```text
T-1
T-3
```

Объяснение: sort by id changes order to `T-1`, `T-2`, `T-3`.

Ошибка: считать, что `testCases` остался в старом порядке.

QA связь: следующие шаги отчёта читают уже упорядоченные данные.

## Предскажите результат выполнения

Ответ:

```text
['T-1', 'T-10', 'T-2', 'T-3']
```

Объяснение: сортировка по умолчанию сравнивает строки.

Ошибка: ожидать `T-10` after `T-3`.

QA связь: порядок по умолчанию не должен случайно определять порядок CI-отчёта.

## Отладка

Ответ:

```javascript
const priorityOrder = { high: 1, medium: 2, low: 3 };

testCases.sort(function (firstTest, secondTest) {
  return priorityOrder[firstTest.priority] - priorityOrder[secondTest.priority];
});
```

Объяснение: для объектов нужен явный порядок по полю.

Ошибка: думать, что сортировка по умолчанию понимает `priority`.

QA связь: сортировка по priority должна совпадать с правилами triage.

## QA-сценарий

Ответ:

```javascript
const statusOrder = { failed: 1, skipped: 2, passed: 3 };

testCases.sort(function (firstTest, secondTest) {
  return statusOrder[firstTest.status] - statusOrder[secondTest.status];
});
```

Объяснение: failed tests поднимаются наверх.

Ошибка: сортировать status по алфавиту вместо прикладного порядка.

QA связь: ошибки должны быть видны первыми.

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

Ошибка: считать, что каждая сортировка начинается с исходного порядка.

QA связь: порядок отчёта должен быть управляемым и ожидаемым.
