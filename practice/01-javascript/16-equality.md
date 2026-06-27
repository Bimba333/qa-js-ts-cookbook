# Практика. Глава 19. Equality

## Концептуальные вопросы

Ответьте своими словами.

1. Why equality is needed?
2. Why does JavaScript have more than one equality operator?
3. What does `==` ask?
4. What does `===` ask?
5. What does `Object.is()` ask?
6. Why can `==` hide type problems?
7. Why does `===` avoid hidden conversion?
8. What is object identity?
9. Why are two same-looking objects not equal by identity?
10. What is special about `NaN` comparison?
11. What is special about `+0` and `-0`?
12. What comparison strategy is recommended for tests?

## Предскажите вывод перед запуском

### Задача 1

```javascript
console.log(5 == '5');
console.log(5 === '5');
console.log(Number('5') === 5);
```

### Задача 2

```javascript
console.log(false == 0);
console.log(false === 0);
console.log('' == 0);
console.log('' === 0);
```

### Задача 3

```javascript
const firstUser = {
  name: 'Anna',
};

const secondUser = {
  name: 'Anna',
};

const sameUser = firstUser;

console.log(firstUser === secondUser);
console.log(firstUser === sameUser);
```

### Задача 4

```javascript
console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
console.log(+0 === -0);
console.log(Object.is(+0, -0));
```

## Определите comparison strategy

Для каждого сценария выберите comparison strategy:

* `===`;
* `==`;
* `Object.is()`;
* explicit conversion before `===`;
* object structure comparison later in testing framework.

### Сценарий 1

API returns `"200"`, test expects Number `200`.

### Сценарий 2

Need to know whether two variables refer to the same object.

### Сценарий 3

Need to check whether parsed value is `NaN`.

### Сценарий 4

Two objects have same expected shape and values.

### Сценарий 5

You intentionally want JavaScript conversion before comparison.

## Чтение кода

Прочитайте код и ответьте:

1. Which comparison may hide a type mismatch?
2. Which comparison reveals the mismatch?
3. Which line is best for QA assertion after parsing?

```javascript
const expectedStatus = 200;
const actualStatusFromApi = '200';

console.log(expectedStatus == actualStatusFromApi);
console.log(expectedStatus === actualStatusFromApi);
console.log(expectedStatus === Number(actualStatusFromApi));
```

## Задачи на отладку

### Задача 1

Тест прошел, хотя API returned String instead of Number.

```javascript
const expectedStatus = 200;
const actualStatus = '200';

console.log(expectedStatus == actualStatus);
```

Объясните проблему and fix comparison.

### Задача 2

Почему comparison returns `false`?

```javascript
const expectedUser = {
  name: 'Anna',
};

const actualUser = {
  name: 'Anna',
};

console.log(expectedUser === actualUser);
```

### Задача 3

Почему first comparison is false and second is true?

```javascript
const price = Number('not available');

console.log(price === NaN);
console.log(Object.is(price, NaN));
```

## QA-задачи

### Сценарий 1. API value comparison

API response:

```json
{
  "statusCode": "200"
}
```

Contract says statusCode should be Number.

How should the test compare and why?

### Сценарий 2. Parsed value comparison

API intentionally returns string status code. Test needs Number for calculation.

Write comparison strategy.

### Сценарий 3. Object comparison

Two response objects have same fields:

```javascript
const expected = {
  status: 'ok',
};

const actual = {
  status: 'ok',
};
```

Explain why `expected === actual` is not structure comparison.

### Сценарий 4. Hidden conversion audit

Create checklist for finding unsafe `==` in tests.

## Мини-проект

Создайте файл:

```text
playground/equality-report.js
```

В нем:

1. Create object `rawApiResponse`:
   * `statusCode: '200'`;
   * `retryCount: '3'`;
   * `price: 'not available'`.
2. Create `parsedResponse`:
   * `statusCode` as Number;
   * `retryCount` as Number;
   * `price` as Number.
3. Compare:
   * raw status with expected number using `==`;
   * raw status with expected number using `===`;
   * parsed status with expected number using `===`;
   * parsed price with `NaN` using `Object.is()`.
4. Create two same-looking objects and compare them with `===`.
5. Write report:

```text
Comparison | Result | What exactly is compared | QA meaning
```
