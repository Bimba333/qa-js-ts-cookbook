# Решения: push() and pop()

## 1. Концептуальные вопросы

### 1.1 Why does `push()` exist?

**Ответ:** to add new values to the end of an array.

**Объяснение:** arrays often need to grow after creation.

**Распространённая ошибка:** think array size must be known immediately.

**Связь с Automation QA:** new API responses or failed assertions can be collected as they appear.

### 1.2 Why does `pop()` exist?

**Ответ:** to remove the last element and get it back.

**Объяснение:** `pop()` shrinks array from the end and returns removed value.

**Распространённая ошибка:** think `pop()` only deletes without returning anything useful.

**Связь с Automation QA:** last executed request can be removed and inspected.

### 1.3 Why does `push()` change `length`?

**Ответ:** because it adds a new element.

**Объяснение:** one more element means count increases by one.

**Распространённая ошибка:** think `push()` only prepares value without changing array.

**Связь с Automation QA:** collected results count grows with every added result.

### 1.4 What does `pop()` return?

**Ответ:** removed last element.

**Объяснение:** array shrinks, and removed value becomes return value.

**Распространённая ошибка:** expect changed array as return value.

**Связь с Automation QA:** removed failure can be logged or inspected.

### 1.5 Does `push()` change existing array?

**Ответ:** yes.

**Объяснение:** `push()` adds value into the same array.

**Распространённая ошибка:** expect a separate new array.

**Связь с Automation QA:** shared collector array receives new records.

### 1.6 Does `pop()` change existing array?

**Ответ:** yes.

**Объяснение:** it removes last element from same array.

**Распространённая ошибка:** think `pop()` only reads last value.

**Связь с Automation QA:** after removing last request, collection becomes shorter.

### 1.7 Which element does `pop()` remove?

**Ответ:** last element.

**Объяснение:** `pop()` operates at the end of array.

**Распространённая ошибка:** expect first element to be removed.

**Связь с Automation QA:** last collected failure is removed first.

### 1.8 What happens when `pop()` is called on empty array?

**Ответ:** it returns `undefined`; array remains empty.

**Объяснение:** there is no last element to remove.

**Распространённая ошибка:** assume it always crashes.

**Связь с Automation QA:** empty failures collection should be handled carefully.

### 1.9 Why is stack intuition high level only?

**Ответ:** it helps understand end-based add/remove, but formal stack data structure is not this chapter.

**Объяснение:** we only use "last added, first removed" as intuition.

**Распространённая ошибка:** start learning stack algorithms too early.

**Связь с Automation QA:** simple request history can behave like last-in-first-out collection.

### 1.10 Why read them as end-of-array operations?

**Ответ:** because both `push()` and `pop()` operate at the array end.

**Объяснение:** beginning operations are different methods and future topic.

**Распространённая ошибка:** use `pop()` expecting first element.

**Связь с Automation QA:** understanding which side changes prevents wrong result order.

---

## 2. Предскажите вывод

### 2.1

**Ответ:**

```text
2
Kate
```

**Объяснение:** `push('Kate')` adds new last element and length becomes `2`.

**Распространённая ошибка:** expect length to stay `1`.

**Связь с Automation QA:** adding new collected user increases collection size.

### 2.2

**Ответ:**

```text
POST /orders
1
GET /users
```

**Объяснение:** `pop()` removes and returns last request.

**Распространённая ошибка:** expect `GET /users` to be removed.

**Связь с Automation QA:** last executed request can be inspected separately.

### 2.3

**Ответ:**

```text
undefined
0
```

**Объяснение:** empty array has no last element.

**Распространённая ошибка:** expect empty string or error.

**Связь с Automation QA:** no failures collected means `pop()` returns no failure.

---

## 3. Identify length

### 3.1

**Ответ:** final `results.length` is `1`.

**Объяснение:** start `0`, push -> `1`, push -> `2`, pop -> `1`.

**Распространённая ошибка:** forget that `pop()` decreases length.

**Связь с Automation QA:** result collector size changes as items are added and removed.

### 3.2

**Ответ:** final `users.length` is `3`.

**Объяснение:** start `2`, pop -> `1`, push -> `2`, push -> `3`.

**Распространённая ошибка:** count operations without tracking current state.

**Связь с Automation QA:** test data list can be adjusted dynamically.

### 3.3

**Ответ:**

* `last`: `'GET /profile'`.
* `requests.length`: `2`.
* last remaining element: `'GET /orders'`.

**Объяснение:** `pop()` removes newest last element.

**Распространённая ошибка:** think `last` is the remaining last element instead of removed value.

**Связь с Automation QA:** request history inspection depends on this distinction.

---

## 4. Debugging tasks

### 4.1

**Ответ:**

```javascript
const users = ['Anna', 'Kate'];

users.pop();

console.log(users[0]);
```

**Объяснение:** `result` is removed value, not changed array.

**Распространённая ошибка:** treat return value of `pop()` as array.

**Связь с Automation QA:** removed assertion and remaining assertion collection are different values.

### 4.2

**Ответ:** unsafe because `lastFailure` is `undefined`.

**Объяснение:** `pop()` from empty array returns `undefined`; calling method on `undefined` causes error.

**Распространённая ошибка:** assume there is always a removed value.

**Связь с Automation QA:** failure collection may be empty when all checks pass.

### 4.3

**Ответ:** output is `Anna`.

**Объяснение:** `push('Kate')` adds to end, so Kate is at index `1`. Index `0` remains Anna.

**Распространённая ошибка:** think `push()` adds to beginning.

**Связь с Automation QA:** preserving order matters in collected API responses.

---

## 5. QA-oriented tasks

### 5.1

**Ответ:**

```javascript
const responses = [];

responses.push('GET /users -> 200');
responses.push('GET /orders -> 200');

console.log(responses.length);
console.log(responses[responses.length - 1]);
```

**Объяснение:** each `push()` appends response and increases length.

**Распространённая ошибка:** read last response with `responses[responses.length]`.

**Связь с Automation QA:** useful for collecting API call results.

### 5.2

**Ответ:**

```javascript
const failedAssertions = [];

failedAssertions.push('status expected 200, actual 500');
failedAssertions.push('role expected admin, actual viewer');

const removedFailure = failedAssertions.pop();

console.log(removedFailure);
console.log(failedAssertions.length);
```

**Объяснение:** last failure is removed and returned.

**Распространённая ошибка:** expect `failedAssertions` itself to be returned.

**Связь с Automation QA:** useful for simple failure collection examples.

### 5.3

**Ответ:**

```javascript
const executedRequests = ['GET /users', 'POST /orders'];

const lastRequest = executedRequests.pop();

console.log(lastRequest);
console.log(executedRequests);
```

**Объяснение:** returned value is useful because code can inspect or log removed request.

**Распространённая ошибка:** remove last request and then lose information about it.

**Связь с Automation QA:** debugging often needs the last executed request.

---

## 6. Мини-проект

**Ответ:**

```javascript
const testResults = [];

testResults.push('login passed');
console.log(testResults.length);

testResults.push('profile passed');
console.log(testResults.length);

testResults.push('orders failed');
console.log(testResults.length);

const removedResult = testResults.pop();

console.log(removedResult);
console.log(testResults.length);
console.log(testResults[testResults.length - 1]);
```

Possible output:

```text
1
2
3
orders failed
2
profile passed
```

**Объяснение:** array starts empty. Each `push()` adds one last element and increases length. `pop()` removes `orders failed`, returns it, and decreases length from `3` to `2`.

**Распространённая ошибка:** expect `pop()` to return remaining array.

**Связь с Automation QA:** test result collectors often grow as checks run and may remove last temporary item.

**Возможное улучшение:** later use loops and array iteration methods to process all results.
