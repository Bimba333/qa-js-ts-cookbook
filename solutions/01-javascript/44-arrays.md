# Решения: Arrays

## 1. Концептуальные вопросы

### 1.1 Why do arrays exist?

**Ответ:** to store many значения together in a specific order.

**Объяснение:** many related значения should be represented as one collection.

**Распространённая ошибка:** think array is only square bracket syntax.

**Связь с Automation QA:** API responses often return lists of users, orders or errors.

### 1.2 Why use an array вместо many variables?

**Ответ:** array keeps related ordered значения in one collection.

**Объяснение:** `user1`, `user2`, `user3` do not scale and make order harder to manage.

**Распространённая ошибка:** create numbered variables вместо collection.

**Связь с Automation QA:** test users, requests and assertions are easier to pass as arrays.

### 1.3 What is an ordered collection?

**Ответ:** collection where значения have stable positions.

**Объяснение:** array remembers first, second, third and so on through indexes.

**Распространённая ошибка:** treat array like unordered set of значения.

**Связь с Automation QA:** order can matter in UI rows, API results and reports.

### 1.4 What is an index?

**Ответ:** numbered position of element in array.

**Объяснение:** `users[0]` reads value at position `0`.

**Распространённая ошибка:** confuse index with count.

**Связь с Automation QA:** first API user is commonly read as `users[0]`.

### 1.5 Why first element at index `0`?

**Ответ:** JavaScript uses zero-based indexing.

**Объяснение:** practical rule: first element is index `0`; last index is `length - 1`.

**Распространённая ошибка:** read first element with `[1]`.

**Связь с Automation QA:** off-by-one mistakes often break assertions against first/last row.

### 1.6 Difference between `length` and last index?

**Ответ:** `length` is count of elements; last index is `length - 1`.

**Объяснение:** array with three elements has indexes `0`, `1`, `2`.

**Распространённая ошибка:** use `array[array.length]` for last element.

**Связь с Automation QA:** reading last failed assertion requires `length - 1`.

### 1.7 What does empty array represent?

**Ответ:** collection with no elements.

**Объяснение:** it can be a valid состояние, such as no failures yet.

**Распространённая ошибка:** treat every empty array as error.

**Связь с Automation QA:** `failedAssertions = []` can mean all checks passed so far.

### 1.8 When is object more suitable?

**Ответ:** когда значения относятся к именованным свойствам одной сущности.

**Объяснение:** user email и role относятся к одному user object.

**Распространённая ошибка:** use array positions for unrelated named поля.

**Связь с Automation QA:** one API user should usually be object.

### 1.9 When is array more suitable?

**Ответ:** when storing many значения where order/position matters.

**Объяснение:** list of users or test cases fits array.

**Распространённая ошибка:** use object with keys `user1`, `user2`, `user3`.

**Связь с Automation QA:** API collection response is naturally an array.

### 1.10 Why use mixed arrays carefully?

**Ответ:** mixed значения can reduce readability.

**Объяснение:** array of same kind of element is easier to understand.

**Распространённая ошибка:** put unrelated status, user and boolean into one array.

**Связь с Automation QA:** clear test data reduces assertion mistakes.

---

## 2. Identify indexes

### 2.1

**Ответ:**

* Index `0`: `'anna@example.test'`.
* Index `1`: `'kate@example.test'`.
* Index `2`: `'max@example.test'`.
* `users.length`: `3`.
* Last index: `2`.

**Объяснение:** first element starts at index `0`, so last index is `length - 1`.

**Распространённая ошибка:** say last index is `3`.

**Связь с Automation QA:** reading last returned user requires correct index.

### 2.2

**Ответ:**

* Index `3`: `'DELETE /sessions'`.
* `'POST /orders'`: index `1`.
* Last index: `3`.

**Объяснение:** four elements have indexes `0`, `1`, `2`, `3`.

**Распространённая ошибка:** shift every index by one.

**Связь с Automation QA:** request sequence assertions often depend on correct positions.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
admin
viewer
3
```

**Объяснение:** `roles[0]` is first element; `roles[2]` is third element; length is count.

**Распространённая ошибка:** expect `roles[2]` to be second element.

**Связь с Automation QA:** role list assertions often use indexes.

### 3.2

**Ответ:**

```text
500
3
```

**Объяснение:** assignment replaces value at index `2`; number of elements does not change.

**Распространённая ошибка:** think update changes length.

**Связь с Automation QA:** updating expected status at same position should not change test case count.

### 3.3

**Ответ:**

```text
undefined
profile
```

**Объяснение:** `pages[2]` is missing because indexes are `0` and `1`. `pages.length - 1` is `1`.

**Распространённая ошибка:** use `length` as last index.

**Связь с Automation QA:** last browser tab/page requires `length - 1`.

---

## 4. Задания на отладку

### 4.1

**Ответ:**

```javascript
const lastUser = users[users.length - 1];
```

**Объяснение:** `users.length` is `3`, but last index is `2`.

**Распространённая ошибка:** confuse count with position.

**Связь с Automation QA:** same issue appears when checking last row in UI table.

### 4.2

**Ответ:**

```javascript
console.log(users[0].email);
```

**Объяснение:** `users` is array. First read element by index, then read object property.

**Распространённая ошибка:** treat array as if it were user object.

**Связь с Automation QA:** API often returns array of user objects.

### 4.3

**Ответ:** `failedAssertions[0]` is `undefined`, `failedAssertions.length` is `0`.

**Объяснение:** empty array has no first element. This can validly mean no failures yet.

**Распространённая ошибка:** think empty array always means broken test.

**Связь с Automation QA:** empty failure collection can mean all assertions passed.

---

## 5. QA-задачи

### 5.1

**Ответ:**

```javascript
const testUsers = [
  'anna@example.test',
  'kate@example.test',
  'max@example.test'
];

const firstUser = testUsers[0];
const secondUser = testUsers[1];
const lastUser = testUsers[testUsers.length - 1];

console.log(firstUser);
console.log(secondUser);
console.log(lastUser);
```

**Объяснение:** array keeps users in order.

**Распространённая ошибка:** read last user with `testUsers[testUsers.length]`.

**Связь с Automation QA:** ordered users may be used for role-based test scenarios.

### 5.2

**Ответ:**

```javascript
const apiUsers = [
  {
    email: 'anna@example.test',
    role: 'admin'
  },
  {
    email: 'kate@example.test',
    role: 'editor'
  }
];

console.log(apiUsers[0].email);
console.log(apiUsers[1].role);
```

**Объяснение:** array stores many user objects; each object stores named user properties.

**Распространённая ошибка:** write `apiUsers.email`.

**Связь с Automation QA:** this mirrors common REST API response shape.

### 5.3

**Ответ:**

```javascript
const testCases = [
  'valid login',
  'invalid password',
  'locked user'
];

testCases[1] = 'invalid password message';

console.log(testCases[1]);
console.log(testCases.length);
```

**Объяснение:** replacing existing element does not change length.

**Распространённая ошибка:** expect length to change after replacement.

**Связь с Automation QA:** renaming test case at same position preserves suite size.

### 5.4

**Ответ:** use array for many ordered items; use object for one entity with named поля.

**Объяснение:** `users` is array; each `user` inside it is object.

**Распространённая ошибка:** choose structure by syntax preference вместо data shape.

**Связь с Automation QA:** API response often contains arrays of objects.

---

## 6. Мини-проект

**Ответ:**

```javascript
const apiUsers = [
  {
    email: 'anna@example.test',
    role: 'admin'
  },
  {
    email: 'kate@example.test',
    role: 'editor'
  },
  {
    email: 'max@example.test',
    role: 'viewer'
  }
];

const firstUser = apiUsers[0];
const lastUser = apiUsers[apiUsers.length - 1];

apiUsers[1].role = 'admin';

console.log(firstUser.email);
console.log(lastUser.email);
console.log(apiUsers[1].role);
console.log(apiUsers.length);
```

Возможный вывод:

```text
anna@example.test
max@example.test
admin
3
```

**Объяснение:** `apiUsers` is one ordered collection. Each element is one user object. Array is better than `user1`, `user2`, `user3` because it keeps related значения together and preserves order.

**Распространённая ошибка:** confuse array index and object property access.

**Связь с Automation QA:** this is a typical shape for API response validation.

**Возможное улучшение:** later use array methods and loops to validate all users without repeating code.
