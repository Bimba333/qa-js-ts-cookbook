# Решения: slice()

## Концептуальные вопросы

### 1. Зачем существует `slice()`?

Ответ: чтобы получить copy array или его части.

Объяснение: `slice()` читает selected elements и возвращает new array.

Распространённая ошибка: считать его способом удаления.

Связь с Automation QA: snapshots помогают запускать subset test cases.

### 2. Изменяет ли `slice()` исходный array?

Ответ: нет.

Объяснение: исходный массив остается в прежнем состоянии.

Распространённая ошибка: ждать, что selected elements исчезнут.

Связь с Automation QA: regression plan остается полным после smoke snapshot.

### 3. Что означает `startIndex`?

Ответ: позицию, с которой начинается copy.

Объяснение: element на `startIndex` включается.

Распространённая ошибка: начинать на один index позже.

Связь с Automation QA: неверная граница меняет состав test run.

### 4. Почему `endIndex` не включается?

Ответ: так работает правило диапазона в `slice()`.

Объяснение: copy идет до `endIndex`, но не включает его.

Распространённая ошибка: ожидать включения последнего index.

Связь с Automation QA: smoke subset может оказаться больше ожидаемого.

### 5. Чем `slice()` отличается от `splice()`?

Ответ: `slice()` копирует, `splice()` изменяет.

Объяснение: `slice()` возвращает selected copy; `splice()` меняет source.

Распространённая ошибка: использовать `splice()` для snapshot.

Связь с Automation QA: snapshot не должен ломать original plan.

### 6. Когда snapshot полезен?

Ответ: когда нужен отдельный run plan без изменения full plan.

Объяснение: можно выделить smoke или payment flow.

Распространённая ошибка: запускать весь regression вместо нужной части.

Связь с Automation QA: CI pipelines часто запускают subsets.

## Чтение кода

Ответ:

```text
smokePlan -> ['login', 'create order']
testCases -> ['login', 'create order', 'discount', 'payment', 'logout']
```

Объяснение: `slice(0, 2)` берет indexes `0` and `1`; index `2` не включается.

Распространённая ошибка: ожидать включение `discount`.

Связь с Automation QA: explicit snapshot защищает исходный список.

## Предскажите результат выполнения

Ответ:

```text
['create order', 'discount']
4
```

Объяснение: selected range включает index `1` и `2`, а source length остается `4`.

Распространённая ошибка: думать, что `plan.length` станет `2`.

Связь с Automation QA: source plan не уменьшается после copy.

## Отладка

Ответ:

```javascript
const tests = ['login', 'create order', 'payment', 'logout'];
const smoke = tests.slice(0, 2);

console.log(smoke);
```

Объяснение: чтобы получить первые два elements, нужно остановиться перед index `2`.

Распространённая ошибка: воспринимать второй argument как count.

Связь с Automation QA: лишний test case может попасть в быстрый smoke pipeline.

## QA-сценарий

Ответ:

```javascript
const regressionPlan = [
  'login smoke',
  'create order',
  'apply discount',
  'pay order',
  'logout smoke',
];

const paymentSnapshot = regressionPlan.slice(2, 4);

console.log(paymentSnapshot);
```

Объяснение: `apply discount` находится на index `2`, `pay order` на index `3`; stop before index `4`.

Распространённая ошибка: использовать `slice(2, 3)` и получить только один test.

Связь с Automation QA: payment flow должен включать оба связанных checks.

## Мини-проект

Ответ:

```javascript
const regressionPlan = [
  'login smoke',
  'create order',
  'apply discount',
  'pay order',
  'logout smoke',
];

const fullSnapshot = regressionPlan.slice();
const smokeSnapshot = regressionPlan.slice(0, 2);
const paymentSnapshot = regressionPlan.slice(2, 4);

console.log(fullSnapshot);
console.log(smokeSnapshot);
console.log(paymentSnapshot);
console.log(regressionPlan);
```

Объяснение: все snapshots являются new arrays, а original plan сохраняется.

Распространённая ошибка: использовать `splice()` и изменить source.

Связь с Automation QA: разные pipelines могут работать с разными snapshots одного plan.
