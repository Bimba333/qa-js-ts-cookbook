# Практика. Глава 17. Stack & Heap

## Концептуальные вопросы

Ответьте своими словами.

1. Почему programmers use Stack & Heap diagrams?
2. Почему эта глава не описывает exact engine implementation?
3. Что означает Stack-like area in conceptual diagrams?
4. Что означает Heap-like area in conceptual diagrams?
5. Как в этой модели обычно рисуют primitive values?
6. Как в этой модели обычно рисуют object values?
7. Что показывает arrow from variable to object?
8. Чем mutation отличается от reassignment на диаграмме?
9. Почему two variables can point to one object?
10. Почему same-looking objects can be different objects?
11. Как function parameter can refer to caller's object?
12. Почему memory diagrams useful for flaky tests?

## Draw memory diagrams

Нарисуйте conceptual Stack & Heap diagrams для каждого примера.

### Задача 1

```javascript
let userName = 'Anna';
let adminName = userName;
adminName = 'Kate';
```

### Задача 2

```javascript
const user = {
  name: 'Anna',
};

const admin = user;
```

### Задача 3

```javascript
let currentUser = {
  name: 'Anna',
};

const oldUser = currentUser;

currentUser = {
  name: 'Kate',
};
```

### Задача 4

```javascript
const user = {
  profile: {
    name: 'Anna',
  },
};
```

## Identify shared objects

Для каждого примера укажите:

* сколько object values создано;
* какие variables refer to same object;
* где есть mutation;
* где есть reassignment.

### Задача 1

```javascript
const defaultPayload = {
  role: 'user',
};

const adminPayload = defaultPayload;

adminPayload.role = 'admin';
```

### Задача 2

```javascript
const firstUser = {
  name: 'Anna',
};

const secondUser = {
  name: 'Anna',
};
```

### Задача 3

```javascript
let selectedUser = {
  id: 1,
};

selectedUser = {
  id: 2,
};
```

## Predict the output before running

### Задача 1

```javascript
const user = {
  role: 'user',
};

const admin = user;
admin.role = 'admin';

console.log(user.role);
```

### Задача 2

```javascript
let currentUser = {
  name: 'Anna',
};

const firstUser = currentUser;

currentUser = {
  name: 'Kate',
};

console.log(firstUser.name);
console.log(currentUser.name);
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

## Debugging tasks

### Задача 1

Тест ожидал, что `defaultPayload.role` останется `'user'`, но получил `'admin'`.

Нарисуйте diagram and explain bug.

```javascript
const defaultPayload = {
  role: 'user',
};

const requestPayload = defaultPayload;

requestPayload.role = 'admin';

console.log(defaultPayload.role);
```

### Задача 2

Почему helper changes original object?

```javascript
function markDeleted(user) {
  user.deleted = true;
}

const testUser = {
  deleted: false,
};

markDeleted(testUser);

console.log(testUser.deleted);
```

### Задача 3

Почему strict comparison returns `false`?

```javascript
const expected = {
  status: 'ok',
};

const actual = {
  status: 'ok',
};

console.log(expected === actual);
```

## QA-oriented tasks

### Сценарий 1. Fixture mutation

Фикстура возвращает object `defaultUser`. Тест делает direct assignment and updates role.

Опишите, какая диаграмма покажет риск.

### Сценарий 2. Payload preparation

Есть object:

```javascript
const defaultPayload = {
  email: 'anna@example.com',
  role: 'user',
};
```

Нужно подготовить admin payload без изменения `defaultPayload`.

Напишите код и нарисуйте conceptual diagram.

### Сценарий 3. Flaky test

Один тест иногда получает role `'admin'`, хотя expected role `'user'`.

Составьте debug checklist using Stack & Heap diagrams.

## Mini-project

Создайте файл:

```text
playground/stack-heap-map.js
```

В нем:

1. Создайте `defaultPayload`.
2. Создайте `sharedPayload` через direct assignment.
3. Измените `sharedPayload.role`.
4. Создайте `safePayload` через object spread with different role.
5. Создайте function `addTrackingId(payload)`, которая добавляет property.
6. Вызовите function with `safePayload`.
7. Выведите all three objects.
8. После кода нарисуйте conceptual diagram:

```text
Variable | Stack-like entry | Heap-like object | Shared? | QA risk
```
