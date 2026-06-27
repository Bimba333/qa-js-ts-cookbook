# Решения: reverse()

## Концептуальные вопросы

### 1. Что именно инвертирует `reverse()`?

Ответ: current order array.

Объяснение: `reverse()` меняет first-to-last на last-to-first.

Ошибка: думать, что `reverse()` сортирует.

QA связь: последние tests часто важны при debugging.

### 2. Чем inversion of current order отличается от ordering by rule?

Ответ: `sort()` задает order по rule, `reverse()` flips existing order.

Объяснение: `reverse()` не смотрит на `status`, `priority` или `id`.

Ошибка: использовать reverse вместо explicit sorting rule.

QA связь: reverse полезен только когда current order already means something.

### 3. Что произойдет, если вызвать `reverse()` два раза?

Ответ: order вернется к предыдущему.

Объяснение: first call flips order, second call flips it back.

Ошибка: забыть, что оба calls change the same array.

QA связь: repeated reverse can hide where order changed.

### 4. Почему reverse shared array может быть опасен?

Ответ: other steps will see reversed order.

Объяснение: shared data should not be flipped silently.

Ошибка: reverse report before another consumer reads it.

QA связь: one helper can accidentally change order for another helper.

### 5. Когда reverse view полезен для debugging?

Ответ: when analysis starts from the last executed tests.

Объяснение: reverse view lets you read sequence backward without inventing a sorting rule.

Ошибка: replace original execution order with debugging view.

QA связь: reverse analysis helps inspect recent failures first.

## Чтение кода

Ответ:

```text
T-3
T-1
```

Объяснение: order `T-1`, `T-2`, `T-3` стал `T-3`, `T-2`, `T-1`.

Ошибка: ожидать original first element.

QA связь: дальнейший analysis будет читать reversed order.

## Предскажите результат выполнения

Ответ:

```text
['T-1', 'T-2', 'T-3']
```

Объяснение: два reverse возвращают порядок обратно.

Ошибка: забыть, что first reverse already changed array.

QA связь: repeated order operations должны быть заметны в коде.

## Debugging

Ответ:

```javascript
const testIds = ['T-1', 'T-2', 'T-3'];
const reversedIds = [...testIds].reverse();

console.log(testIds);
console.log(reversedIds);
```

Объяснение: copy keeps original order, then `reverse()` changes only copied array.

Ошибка: считать `reversedIds` независимым от `testIds` после прямого `reverse()`.

QA связь: original execution order часто нужно сохранить для audit trail.

## QA scenario

Ответ:

```javascript
testCases.reverse();
console.log(testCases);
```

Объяснение: last executed test становится первым в array.

Ошибка: применять reverse до того, как original order был сохранен.

QA связь: debugging view может отличаться от original report.

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

console.log(testCases.map(function (testCase) { return testCase.id; }));

testCases.reverse();
console.log(testCases.map(function (testCase) { return testCase.id; }));

testCases.sort(function (firstTest, secondTest) {
  return firstTest.id.localeCompare(secondTest.id);
});

testCases.reverse();
console.log(testCases.map(function (testCase) { return testCase.id; }));
```

Объяснение: after `sort()`, `reverse()` инвертирует already sorted order.

Ошибка: ожидать, что reverse помнит original order.

QA связь: debugging order зависит от текущего состояния report.
