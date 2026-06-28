# Практика: slice()

## Концептуальные вопросы

1. Зачем существует `slice()`?
2. Изменяет ли `slice()` исходный array?
3. Что означает `startIndex`?
4. Почему `endIndex` не включается?
5. Чем `slice()` отличается от `splice()`?
6. Когда snapshot полезен в Automation QA?

## Чтение кода

```javascript
const testCases = ['login', 'create order', 'discount', 'payment', 'logout'];
const smokePlan = testCases.slice(0, 2);

console.log(smokePlan);
console.log(testCases);
```

Ответьте:

* какие elements попали в `smokePlan`;
* изменился ли `testCases`;
* почему index `2` не попал в результат.

## Предскажите результат выполнения

```javascript
const plan = ['login', 'create order', 'discount', 'payment'];

const selected = plan.slice(1, 3);

console.log(selected);
console.log(plan.length);
```

Сначала запишите ответ без запуска.

## Отладка

Автор хотел получить первые два test cases, но получил три.

```javascript
const tests = ['login', 'create order', 'payment', 'logout'];
const smoke = tests.slice(0, 3);

console.log(smoke);
```

Исправьте код.

## QA-сценарий

Создайте snapshot payment flow из списка:

```javascript
const regressionPlan = [
  'login smoke',
  'create order',
  'apply discount',
  'pay order',
  'logout smoke'
];
```

В snapshot должны попасть только `apply discount` и `pay order`.

## Мини-проект

Создайте файл `playground/slice-test-snapshots.js`.

Требования:

* создать full regression plan;
* сделать copy всего plan;
* сделать smoke snapshot;
* сделать payment snapshot;
* вывести все snapshots;
* доказать выводом, что original plan не изменился.
