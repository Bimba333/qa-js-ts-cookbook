# Практика: Arrays

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем arrays существуют;
* отличать object from array по задаче;
* определять indexes;
* читать elements by index;
* заменять elements by index;
* понимать `length`;
* находить off-by-one mistakes;
* применять arrays к QA data.

---

## 1. Концептуальные вопросы

1. Why do arrays exist?
2. Why use an array instead of many variables?
3. What is an ordered collection?
4. What is an index?
5. Why is first element at index `0`?
6. What is the difference between `length` and last index?
7. What does empty array represent?
8. When is object more suitable than array?
9. When is array more suitable than object?
10. Why should mixed arrays be used carefully?

---

## 2. Identify indexes

### Задание 2.1

```javascript
const users = [
  'anna@example.test',
  'kate@example.test',
  'max@example.test'
];
```

Ответьте:

* What value is at index `0`?
* What value is at index `1`?
* What value is at index `2`?
* What is `users.length`?
* What is last index?

### Задание 2.2

```javascript
const requests = [
  'GET /users',
  'POST /orders',
  'GET /profile',
  'DELETE /sessions'
];
```

Ответьте:

* Which request is at index `3`?
* What index contains `'POST /orders'`?
* What is the last index?

---

## 3. Предскажите результат выполнения

### Задание 3.1

```javascript
const roles = ['admin', 'editor', 'viewer'];

console.log(roles[0]);
console.log(roles[2]);
console.log(roles.length);
```

### Задание 3.2

```javascript
const statuses = [200, 201, 404];

statuses[2] = 500;

console.log(statuses[2]);
console.log(statuses.length);
```

### Задание 3.3

```javascript
const pages = ['login', 'profile'];

console.log(pages[2]);
console.log(pages[pages.length - 1]);
```

---

## 4. Debugging tasks

### Задание 4.1

```javascript
const users = ['Anna', 'Kate', 'Max'];

const lastUser = users[users.length];

console.log(lastUser);
```

Автор ожидал `Max`. Объясните and fix.

### Задание 4.2

```javascript
const users = [
  {
    email: 'anna@example.test'
  }
];

console.log(users.email);
```

Автор ожидал email первого user. Исправьте чтение.

### Задание 4.3

```javascript
const failedAssertions = [];

console.log(failedAssertions[0]);
console.log(failedAssertions.length);
```

Объясните, почему this is not necessarily an error.

---

## 5. QA-oriented tasks

### Задание 5.1

Create array `testUsers` with three user emails.

Read:

* first user;
* second user;
* last user.

### Задание 5.2

Create array `apiUsers` with two user objects:

* email;
* role.

Read email of first user and role of second user.

### Задание 5.3

Create array `testCases` with three test case names.

Replace second test case with updated name.

Print updated second test case and array length.

### Задание 5.4

Explain:

> When should test data be an array, and when should it be an object?

---

## 6. Мини-проект

Create small API response model.

Requirements:

1. Create `apiUsers` array.
2. Add three user objects manually in array literal.
3. Each user object should have `email` and `role`.
4. Read first user.
5. Read last user using `length - 1`.
6. Replace role of second user.
7. Print:
   * first user email;
   * last user email;
   * updated second user role;
   * array length.
8. Explain why array is better than `user1`, `user2`, `user3`.

Do not use array methods or loops.
