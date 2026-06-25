# Практика. Глава 16. References

## Концептуальные вопросы

Ответьте своими словами.

1. Почему references exist?
2. Что такое reference conceptually?
3. Чем reference отличается от object?
4. Что означает фраза: variable refers to object value?
5. Почему multiple variables can refer to one object?
6. Что происходит при reading through a reference?
7. Что происходит при updating through a reference?
8. Что означает assigning one reference to another variable?
9. Чем primitive assignment отличается от object assignment?
10. Что означает object identity?
11. Почему same-looking objects can be different objects?
12. Почему references важны для Automation QA?

## Predict the output before running

### Задача 1

```javascript
let userName = 'Anna';
let adminName = userName;

adminName = 'Kate';

console.log(userName);
console.log(adminName);
```

### Задача 2

```javascript
const user = {
  name: 'Anna',
};

const admin = user;

admin.name = 'Kate';

console.log(user.name);
console.log(admin.name);
```

### Задача 3

```javascript
const firstUser = {
  name: 'Anna',
};

const secondUser = {
  name: 'Anna',
};

console.log(firstUser === secondUser);
```

### Задача 4

```javascript
let currentUser = {
  name: 'Anna',
};

const oldUser = currentUser;

currentUser = {
  name: 'Kate',
};

console.log(oldUser.name);
console.log(currentUser.name);
```

## Identify references

Для каждого примера ответьте:

* какие variables refer to object;
* сколько object values создано;
* какие variables refer to same object;
* что изменится после updates.

### Задача 1

```javascript
const user = {
  name: 'Anna',
};

const admin = user;
const currentUser = admin;
```

### Задача 2

```javascript
const expectedUser = {
  role: 'user',
};

const actualUser = {
  role: 'user',
};
```

### Задача 3

```javascript
let selectedUser = {
  id: 101,
};

const firstSelection = selectedUser;

selectedUser = {
  id: 202,
};
```

## Code reading

Прочитайте код и ответьте:

1. Какой object is shared?
2. Какая line mutates shared object?
3. Что выведет последний `console.log`?
4. Почему это опасно in tests?

```javascript
const defaultUser = {
  email: 'anna@example.com',
  role: 'user',
};

const adminUser = defaultUser;

adminUser.role = 'admin';

console.log(defaultUser.role);
```

## Debugging tasks

### Задача 1

Тест ожидал, что `expectedUser.role` останется `'user'`, но получил `'admin'`.

Найдите причину.

```javascript
const expectedUser = {
  email: 'anna@example.com',
  role: 'user',
};

const actualUser = expectedUser;

actualUser.role = 'admin';

console.log(expectedUser.role);
```

### Задача 2

Почему comparison returns `false`?

```javascript
const expectedUser = {
  email: 'anna@example.com',
};

const actualUser = {
  email: 'anna@example.com',
};

console.log(expectedUser === actualUser);
```

### Задача 3

Что именно делает helper?

```javascript
function makeAdmin(user) {
  user.role = 'admin';
}

const testUser = {
  role: 'user',
};

makeAdmin(testUser);

console.log(testUser.role);
```

### Задача 4

Исправьте код так, чтобы `adminUser` did not mutate `defaultUser`.

```javascript
const defaultUser = {
  email: 'anna@example.com',
  role: 'user',
};

const adminUser = defaultUser;

adminUser.role = 'admin';
```

## QA-oriented tasks

### Сценарий 1. Shared test data

Есть общий object:

```javascript
const defaultRequestBody = {
  email: 'anna@example.com',
  role: 'user',
};
```

Один тест должен использовать role `'admin'`, другой role `'user'`.

Объясните, почему прямое assignment может быть опасно.

### Сценарий 2. Helper modifies payload

Helper добавляет property:

```javascript
function addTrackingId(payload) {
  payload.trackingId = 'track-123';
}
```

Объясните, что произойдет with object passed to helper.

### Сценарий 3. Expected vs actual

Почему не стоит делать так?

```javascript
const expectedUser = {
  name: 'Anna',
};

const actualUser = expectedUser;
```

### Сценарий 4. Debug checklist

Составьте checklist из вопросов для debugging unexpected object mutation in Playwright tests.

## Mini-project

Создайте файл:

```text
playground/reference-lab.js
```

В нем нужно:

1. Создать object `defaultUser` with properties:
   * `email`;
   * `role`;
   * `isActive`.
2. Создать `sharedAdmin` through direct assignment from `defaultUser`.
3. Update `sharedAdmin.role`.
4. Print both `defaultUser.role` and `sharedAdmin.role`.
5. Создать `safeAdmin` as a new first-level object using object spread:
   * copy `defaultUser`;
   * set `role` to `'admin'`.
6. Print `defaultUser.role` and `safeAdmin.role`.
7. Написать короткий вывод:

```text
Variable | Refers to same object as defaultUser? | Role after update | QA risk
```
