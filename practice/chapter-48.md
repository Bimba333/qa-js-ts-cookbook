# Практика: push() and pop()

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существуют `push()` and `pop()`;
* предсказывать array growth and shrink;
* определять `length` after operations;
* понимать return value of `pop()`;
* видеть, что existing array changes;
* применять `push()` and `pop()` in QA scenarios.

---

## 1. Концептуальные вопросы

1. Why does `push()` exist?
2. Why does `pop()` exist?
3. Why does `push()` change `length`?
4. What does `pop()` return?
5. Does `push()` change the existing array?
6. Does `pop()` change the existing array?
7. Which element does `pop()` remove?
8. What happens when `pop()` is called on empty array?
9. Why is stack intuition useful only at high level here?
10. Why should `push()` and `pop()` be read as end-of-array operations?

---

## 2. Предскажите вывод

### Задание 2.1

```javascript
const users = ['Anna'];

users.push('Kate');

console.log(users.length);
console.log(users[1]);
```

### Задание 2.2

```javascript
const requests = ['GET /users', 'POST /orders'];

const removed = requests.pop();

console.log(removed);
console.log(requests.length);
console.log(requests[0]);
```

### Задание 2.3

```javascript
const failures = [];

const removed = failures.pop();

console.log(removed);
console.log(failures.length);
```

---

## 3. Identify length

### Задание 3.1

```javascript
const results = [];

results.push('first');
results.push('second');
results.pop();
```

What is final `results.length`?

### Задание 3.2

```javascript
const users = ['Anna', 'Kate'];

users.pop();
users.push('Max');
users.push('Nina');
```

What is final `users.length`?

### Задание 3.3

```javascript
const requests = ['GET /users'];

requests.push('GET /orders');
requests.push('GET /profile');

const last = requests.pop();
```

Ответ:

* What is `last`?
* What is `requests.length`?
* What is last remaining element?

---

## 4. Debugging tasks

### Задание 4.1

```javascript
const users = ['Anna', 'Kate'];

const result = users.pop();

console.log(result[0]);
```

Автор ожидал first element of changed array. Explain problem and fix.

### Задание 4.2

```javascript
const failedAssertions = [];

const lastFailure = failedAssertions.pop();

console.log(lastFailure.toUpperCase());
```

Explain why this is unsafe.

### Задание 4.3

```javascript
const users = ['Anna'];

users.push('Kate');

console.log(users[0]);
```

Автор ожидал `Kate`. Explain.

---

## 5. QA-oriented tasks

### Задание 5.1

Create `responses` array.

Add two response descriptions with `push()`.

Print:

* array length;
* last response using `length - 1`.

### Задание 5.2

Create `failedAssertions` array.

Add two failures with `push()`.

Remove last failure with `pop()`.

Print removed failure and remaining length.

### Задание 5.3

Create `executedRequests` array with two values.

Remove last request.

Explain why returned value is useful.

---

## 6. Мини-проект

Create small test result collector.

Requirements:

1. Create empty `testResults` array.
2. Add three results with `push()`.
3. Print length after each push.
4. Remove last result with `pop()`.
5. Print removed result.
6. Print final array length.
7. Print last remaining result using `length - 1`.
8. Explain how array size changed at each step.

Do not use loops or iteration methods.
