# Arrays

## Связь с предыдущей главой

Предыдущая глава завершила блок Objects and Classes.

Мы научились моделировать одну entity:

```text
Object
│
▼
one entity
│
▼
many named properties
```

Например:

```javascript
const user = {
  email: 'anna@example.test',
  role: 'admin'
};
```

Object отвечает на вопрос:

```text
What value belongs to this name?
```

```text
user.email
│
▼
"anna@example.test"
```

Теперь появляется новый вопрос:

> Как хранить много values together, если важен порядок?

Например, API вернул 100 users.

Неудобная модель:

```text
user1
user2
user3
...
user100
```

Нужна ordered collection:

```text
Many values
│
▼
Array
│
▼
Ordered positions
│
▼
Indexes
│
▼
Read values
```

Arrays start a new section.

---

## Предварительные требования

Для этой главы нужно понимать:

* что value can be primitive or object;
* что object models one entity with named properties;
* что variable gives named access to value;
* что JavaScript can read and update values;
* что Automation QA often works with API responses, users, assertions and test data.

Не требуется знать array methods, `push`, `pop`, `shift`, `unshift`, `splice`, `slice`, `map`, `filter`, `reduce`, loops or iteration. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            120-150 минут
Разбор схем:             60-80 минут
Запуск примеров:         20-30 минут
Практика:                110-140 минут
Повторение материала:    30 минут
```

Уровень сложности: **L3**.

Array syntax looks simple. The important part is not square brackets. The important part is ordered storage and index-based access.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/43-super.md
```

Текущая глава:

```text
docs/01-javascript/44-arrays.md
```

Следующая глава:

```text
docs/01-javascript/45-push-pop.md
```

Следующая глава ответит:

> How do arrays grow and shrink?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем arrays существуют;
* что такое ordered collection;
* что такое index;
* почему index starts from `0`;
* как создать array literal;
* как читать element by index;
* как заменить element by index;
* что показывает `length`;
* что означает empty array;
* чем array отличается от object на уровне задачи;
* как arrays используются in Automation QA.

---

## Мотивация

Начнем с проблемы.

Нужно хранить test users:

```javascript
const firstUser = 'anna@example.test';
const secondUser = 'kate@example.test';
const thirdUser = 'max@example.test';
```

Для трех users это еще терпимо.

Но если users сто:

```text
user1
user2
user3
...
user100
```

Проблема:

```text
many related values
│
├── too many variable names
├── hard to keep order
├── hard to pass together
└── hard to read as one collection
```

Нам нужна одна value, которая represents many ordered values:

```javascript
const testUsers = [
  'anna@example.test',
  'kate@example.test',
  'max@example.test'
];
```

Теперь есть one collection:

```text
testUsers
│
├── position 0 -> "anna@example.test"
├── position 1 -> "kate@example.test"
└── position 2 -> "max@example.test"
```

Array solves ordered storage.

---

## Теория

Array is an ordered collection of values.

Главная модель:

```text
Array
│
├── index 0 -> value
├── index 1 -> value
├── index 2 -> value
└── ...
```

Array literal:

```javascript
const users = [
  'anna@example.test',
  'kate@example.test',
  'max@example.test'
];
```

Square brackets are syntax.

The concept is ordered collection:

```text
Many values
│
▼
one ordered structure
```

### Index

Index is numbered position inside array.

JavaScript arrays use zero-based indexes:

```text
index:  0                  1                  2
value: "anna@example.test" "kate@example.test" "max@example.test"
```

First element has index `0`.

```javascript
console.log(users[0]);
```

Result:

```text
anna@example.test
```

### Reading elements

Reading by index:

```javascript
const firstUser = users[0];
const secondUser = users[1];
```

Mental model:

```text
users[1]
│
▼
go to position 1
│
▼
read value
```

### Updating elements

You can replace value at position:

```javascript
users[1] = 'kate.updated@example.test';
```

Mental model:

```text
index 1
│
old value
│
▼
new value
```

This is element replacement.

We are not studying array growth yet. Adding/removing elements with methods such as `push()` and `pop()` is the next chapter.

### Length

`length` shows how many elements array currently contains.

```javascript
console.log(users.length);
```

For:

```javascript
const users = ['Anna', 'Kate', 'Max'];
```

`length` is:

```text
3
```

Important relation:

```text
last index
│
▼
length - 1
```

For length `3`, last index is `2`.

```text
index: 0 1 2
count: 1 2 3
```

### Empty array

Empty array contains no elements:

```javascript
const failedAssertions = [];
```

Mental model:

```text
empty array
│
└── length: 0
```

It can represent:

```text
no failures yet
no users yet
no requests yet
```

We are not adding elements yet. Growth is next chapter.

### Mixed values

JavaScript arrays can contain different kinds of values:

```javascript
const mixed = ['status', 200, true];
```

This is allowed.

But for readable test code, arrays are usually clearer when elements represent the same kind of thing:

```text
good collection
│
└── list of users

unclear collection
│
└── unrelated values mixed together
```

Mixed values will appear naturally later, but do not use them as default style.

---

## Внутренний механизм

When JavaScript reads:

```javascript
users[2]
```

Engine has:

```text
array value: users
requested index: 2
```

Then:

```text
Step 1
│
▼
Find array value
```

```text
Step 2
│
▼
Use index 2 as position
```

```text
Step 3
│
▼
Return value stored there
```

If index exists:

```text
users[2]
│
▼
"max@example.test"
```

If index does not contain element:

```text
users[10]
│
▼
undefined
```

This is similar to reading missing object property in one important way:

```text
missing value
│
▼
undefined
```

But the question is different.

Object:

```text
What value belongs to this name?
```

Array:

```text
What value is stored at this position?
```

### Updating flow

For:

```javascript
users[1] = 'updated@example.test';
```

Engine:

```text
Step 1
│
▼
Find array value
```

```text
Step 2
│
▼
Find position 1
```

```text
Step 3
│
▼
Replace stored value
```

After update:

```text
index 0 -> "anna@example.test"
index 1 -> "updated@example.test"
index 2 -> "max@example.test"
```

### Length flow

When reading:

```javascript
users.length
```

You ask:

```text
How many elements are in this array?
```

Not:

```text
What is the last index?
```

This distinction matters:

```text
length: 3
last index: 2
```

---

## Ментальная модель

Array is like bookshelf.

```text
Bookshelf
│
├── shelf position 0 -> book
├── shelf position 1 -> book
└── shelf position 2 -> book
```

Numbered lockers:

```text
Locker 0 -> value
Locker 1 -> value
Locker 2 -> value
```

Train cars:

```text
Train
│
├── car 0
├── car 1
└── car 2
```

Hotel rooms:

```text
Hotel
│
├── room 0 -> guest
├── room 1 -> guest
└── room 2 -> guest
```

Spreadsheet rows:

```text
Row 0 -> first item
Row 1 -> second item
Row 2 -> third item
```

These are analogies.

The technical mental model:

```text
Array
│
└── ordered collection accessed by index
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-47/
```

Запуск:

```bash
node examples/chapter-47/01-first-array.js
```

### Пример 1. First array

Файл:

```text
examples/chapter-47/01-first-array.js
```

Показывает array literal as ordered collection.

### Пример 2. Indexes

Файл:

```text
examples/chapter-47/02-indexes.js
```

Показывает reading values by index.

### Пример 3. Update elements

Файл:

```text
examples/chapter-47/03-update-elements.js
```

Показывает replacement at existing position.

### Пример 4. Length

Файл:

```text
examples/chapter-47/04-length.js
```

Показывает `length` and last index relation.

### Пример 5. Common mistakes

Файл:

```text
examples/chapter-47/05-common-mistakes.js
```

Показывает off-by-one mistake.

### Пример 6. QA example

Файл:

```text
examples/chapter-47/06-qa-example.js
```

Показывает list of users returned from API.

---

## Частые вопросы

### Array - это просто квадратные скобки?

Нет.

Square brackets are syntax.

Array is ordered collection.

```text
[]
│
└── syntax

Array
│
└── ordered storage model
```

### Почему первый index is `0`?

JavaScript uses zero-based indexing. This is common in many programming languages.

For this chapter, remember practical rule:

```text
first element -> index 0
last element  -> length - 1
```

### Array can store objects?

Да.

For example:

```javascript
const users = [
  { email: 'anna@example.test' },
  { email: 'kate@example.test' }
];
```

This is common in API testing.

### Should arrays contain mixed values?

JavaScript allows it, but readability often suffers.

Prefer arrays where elements represent same kind of thing:

```text
users
requests
assertions
test cases
```

### Why not use object instead of array?

Use object when names matter.

Use array when order and positions matter.

```text
object -> named properties
array  -> ordered positions
```

---

## Распространенные мифы

### Миф: Array is just object with square brackets

Реальность: arrays are object values in JavaScript, but for this chapter the useful model is ordered collection with indexes. Object internals will be discussed only when needed.

### Миф: `length` is last index

Реальность: last index is `length - 1`.

### Миф: `users[1]` reads first user

Реальность: `users[0]` reads first user.

### Миф: Empty array means error

Реальность: empty array can validly represent "no items".

---

## Типичные ошибки

### Ошибка 1. Off-by-one

Неправильный код:

```javascript
const users = ['Anna', 'Kate', 'Max'];

console.log(users[3]);
```

Что произошло:

Array has length `3`, but indexes are `0`, `1`, `2`.

```text
length: 3
last index: 2
```

Исправленный вариант:

```javascript
console.log(users[2]);
```

### Ошибка 2. Путать object property and array index

Неправильная модель:

```text
users.email
```

Для array:

```text
users[0]
```

Если element is object:

```javascript
users[0].email
```

### Ошибка 3. Считать `length` position

Неправильно:

```javascript
const lastUser = users[users.length];
```

Правильно:

```javascript
const lastUser = users[users.length - 1];
```

### Ошибка 4. Использовать many variables instead of array

Неправильная модель:

```javascript
const firstRequest = '/users';
const secondRequest = '/orders';
const thirdRequest = '/profile';
```

Лучше:

```javascript
const requests = ['/users', '/orders', '/profile'];
```

---

## Практическое использование

Arrays useful when you have:

```text
many values
│
and
│
order matters
```

Examples:

* list of users;
* list of test cases;
* list of API responses;
* list of failed assertions;
* list of HTTP requests;
* list of browser tabs.

Array improves readability:

```text
testUsers
│
└── one named collection
```

Instead of:

```text
user1
user2
user3
```

---

## Использование в Automation QA

### Users returned from API

API often returns:

```text
users
│
├── user at index 0
├── user at index 1
└── user at index 2
```

In code:

```javascript
const users = [
  { email: 'anna@example.test', role: 'admin' },
  { email: 'kate@example.test', role: 'editor' }
];
```

Read first user:

```javascript
const firstUser = users[0];
```

### List of test cases

```javascript
const testCases = [
  'valid login',
  'invalid password',
  'locked user'
];
```

The order can match reporting order.

### Browser tabs

Browser contexts can have many pages/tabs.

Conceptually:

```text
pages
│
├── index 0 -> first tab
├── index 1 -> second tab
└── index 2 -> third tab
```

### Failed assertions

Empty array can represent no failures:

```javascript
const failedAssertions = [];
```

Later chapters will explain how arrays grow when new failure is added.

### HTTP requests

```javascript
const requests = [
  'GET /users',
  'POST /orders',
  'GET /profile'
];
```

This keeps related request descriptions together.

---

## Диаграммы главы

### 1. Why arrays exist

```text
many values
│
├── value 1
├── value 2
└── value 3
    │
    ▼
need one ordered collection
```

### 2. One object vs many objects

```text
Object
│
└── one entity

Array
│
└── many values
```

### 3. Ordered collection

```text
Array
│
├── first
├── second
└── third
```

### 4. Numbered positions

```text
position 0
position 1
position 2
```

### 5. Indexes

```text
index: 0 1 2
value: A B C
```

### 6. Reading by index

```text
array[1]
│
▼
value at index 1
```

### 7. Updating by index

```text
array[1] = newValue
│
▼
replace element
```

### 8. Length

```text
[A, B, C]
│
└── length 3
```

### 9. Empty array

```text
[]
│
└── length 0
```

### 10. Mixed values

```text
["status", 200, true]
│
└── allowed but use carefully
```

### 11. Current JavaScript model

```text
Values
│
├── Objects
└── Arrays
    └── ordered collections
```

### 12. QA users list

```text
users
│
├── 0 -> Anna
├── 1 -> Kate
└── 2 -> Max
```

### 13. API response

```text
response.users
│
└── array of user objects
```

### 14. Test cases

```text
testCases
│
├── valid login
├── invalid password
└── locked user
```

### 15. Readability

```text
one collection name
│
better than
│
many numbered variables
```

### 16. Common mistakes

```text
length 3
│
└── last index 2
```

### 17. Bookshelf analogy

```text
shelf 0 -> book
shelf 1 -> book
shelf 2 -> book
```

### 18. Train analogy

```text
car 0 -> value
car 1 -> value
car 2 -> value
```

### 19. Hotel analogy

```text
room 0 -> guest
room 1 -> guest
room 2 -> guest
```

### 20. Spreadsheet analogy

```text
row 0 -> item
row 1 -> item
row 2 -> item
```

### 21. Index lookup

```text
index
│
▼
position
│
▼
value
```

### 22. Last element

```text
length - 1
│
▼
last index
```

### 23. Array growth preview

```text
array now
│
▼
next chapter: add/remove elements
```

### 24. Element replacement

```text
old value
│
▼
new value at same index
```

### 25. Mental model summary

```text
Many values
│
▼
Ordered collection
│
▼
Indexes
```

### 26. Complete array model

```text
Array
│
├── length
├── index 0
├── index 1
└── index 2
```

### 27. Object vs array

```text
object.name
│
named property

array[0]
│
positioned element
```

### 28. Ordered storage

```text
order matters
│
└── array fits
```

### 29. Value ownership

```text
array
│
└── contains elements
```

### 30. Array lifecycle

```text
create
│
read
│
update
│
grow later
```

### 31. Bridge to push()

```text
fixed elements now
│
▼
push() later
```

### 32. Bridge to loops

```text
many elements
│
▼
later: repeat over them
```

### 33. Bridge to iteration

```text
array
│
▼
later: iteration methods
```

### 34. QA framework example

```text
failedAssertions
│
├── failure 0
└── failure 1
```

### 35. API collection

```text
GET /users
│
▼
array of users
```

### 36. Collection evolution

```text
one value
│
many values
│
array
```

### 37. Element identity

```text
element at index 0
│
can be primitive or object
```

### 38. Array memory intuition

```text
one variable
│
▼
one array value
│
▼
many elements
```

### 39. Reading flow

```text
array[index]
│
▼
find position
│
▼
return value
```

### 40. Summary diagram

```text
Many values
│
▼
Array
│
▼
Ordered positions
│
▼
Indexes
│
▼
Read values
```

---

## Итоги

Objects answered:

```text
How do we model one entity?
```

Arrays answer:

```text
How do we store many values together in order?
```

The central model:

```text
Many values
│
▼
Array
│
▼
Ordered positions
│
▼
Indexes
│
▼
Read values
```

Objects and arrays solve different problems:

```text
Object
│
└── What value belongs to this name?

Array
│
└── What value is stored at this position?
```

The next chapter will explain how arrays grow and shrink with methods such as `push()` and `pop()`.

---

## Что нужно запомнить

✓ Array is an ordered collection of values.

✓ Array elements are accessed by indexes.

✓ First index is `0`.

✓ `length` is count of elements, not last index.

✓ Last index is `length - 1`.

✓ Empty array has length `0`.

✓ Arrays can contain primitive values and objects.

✓ Objects use names; arrays use positions.

✓ Arrays are common in API responses and test data.

✓ Array methods and loops are future topics.

---

## Quick Check

1. What problem do arrays solve?

2. Why use an array instead of many variables?

3. What is an index?

4. What index reads the first element?

5. If array length is `4`, what is the last index?

6. What does `users[1]` mean?

7. What does empty array represent?

8. How is array different from object?

9. Why should mixed arrays be used carefully?

10. What will the next chapter explain?

---

## Практика

Практические задания находятся в отдельном файле:

```text
practice/chapter-47.md
```

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/chapter-47.md
```

Сначала выполните практику самостоятельно. Затем сравните reasoning, not only final answer.
