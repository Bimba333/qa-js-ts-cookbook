# Arrays

## Связь с предыдущей главой

Предыдущая глава завершила блок Objects and Classes.

Мы научились моделировать одну entity:

```mermaid
flowchart TD
    N1["Object"]
    N2["one entity"]
    N3["many named properties"]
    N1 --> N2
    N2 --> N3
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

```mermaid
flowchart TD
    N1["user.email"]
    N2["&quot;anna@example.test&quot;"]
    N1 --> N2
```

Теперь появляется новый вопрос:

> Как хранить много значения together, если важен порядок?

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

```mermaid
flowchart TD
    N1["Many values"]
    N2["Array"]
    N3["Ordered positions"]
    N4["Indexes"]
    N5["Read values"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Arrays start a new section.

---

## Предварительные требования

Для этой главы нужно понимать:

* что value can be primitive or object;
* что object models one entity with named properties;
* что variable gives named access to value;
* что JavaScript can read and update значения;
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

```mermaid
flowchart TD
    N1["many related values"]
    N2["too many variable names"]
    N3["hard to keep order"]
    N4["hard to pass together"]
    N5["hard to read as one collection"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
```

Нам нужна одна value, которая represents many ordered значения:

```javascript
const testUsers = [
  'anna@example.test',
  'kate@example.test',
  'max@example.test'
];
```

Теперь есть one collection:

```mermaid
flowchart TD
    N1["testUsers"]
    N2["position 0 → &quot;anna@example.test&quot;"]
    N3["position 1 → &quot;kate@example.test&quot;"]
    N4["position 2 → &quot;max@example.test&quot;"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Array solves ordered storage.

---

## Теория

Array is an ordered collection of значения.

Главная модель:

```mermaid
flowchart TD
    N1["Array"]
    N2["index 0 → value"]
    N3["index 1 → value"]
    N4["index 2 → value"]
    N5["..."]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
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

```mermaid
flowchart TD
    N1["Many values"]
    N2["one ordered structure"]
    N1 --> N2
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

Результат:

```text
anna@example.test
```

### Reading elements

Reading by index:

```javascript
const firstUser = users[0];
const secondUser = users[1];
```

Ментальная модель:

```mermaid
flowchart TD
    N1["users[1]"]
    N2["go to position 1"]
    N3["read value"]
    N1 --> N2
    N2 --> N3
```

### Updating elements

You can replace value at position:

```javascript
users[1] = 'kate.updated@example.test';
```

Ментальная модель:

```mermaid
flowchart TD
    N1["index 1"]
    N2["old value"]
    N3["new value"]
    N1 --> N2
    N2 --> N3
```

This is element replacement.

We are not studying array growth yet. Adding/removing elements with methods such as `push()` and `pop()` is the next chapter.

### Length

`length` shows how many elements array currently contains.

```javascript
console.log(users.length);
```

Для:

```javascript
const users = ['Anna', 'Kate', 'Max'];
```

`length` is:

```text
3
```

Важная связь:

```mermaid
flowchart TD
    N1["last index"]
    N2["length - 1"]
    N1 --> N2
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

Ментальная модель:

```mermaid
flowchart TD
    N1["empty array"]
    N2["length: 0"]
    N1 --> N2
```

It can represent:

```text
no failures yet
no users yet
no requests yet
```

We are not adding elements yet. Growth is next chapter.

### Mixed значения

JavaScript arrays can contain different kinds of значения:

```javascript
const mixed = ['status', 200, true];
```

This is allowed.

But for readable test code, arrays are usually clearer when elements represent the same kind of thing:

```mermaid
flowchart TD
    N1["good collection"]
    N2["list of users"]
    N3["unclear collection"]
    N4["unrelated values mixed together"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

Mixed значения will appear naturally later, but do not use them as default style.

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

```mermaid
flowchart TD
    N1["Step 1"]
    N2["Find array value"]
    N1 --> N2
```

```mermaid
flowchart TD
    N1["Step 2"]
    N2["Use index 2 as position"]
    N1 --> N2
```

```mermaid
flowchart TD
    N1["Step 3"]
    N2["Возвращаемое значение stored there"]
    N1 --> N2
```

If index exists:

```mermaid
flowchart TD
    N1["users[2]"]
    N2["&quot;max@example.test&quot;"]
    N1 --> N2
```

If index does not contain element:

```mermaid
flowchart TD
    N1["users[10]"]
    N2["undefined"]
    N1 --> N2
```

This is similar to reading missing object property in one important way:

```mermaid
flowchart TD
    N1["значение отсутствует value"]
    N2["undefined"]
    N1 --> N2
```

But the question is different.

Объект:

```text
What value belongs to this name?
```

Array:

```text
What value is stored at this position?
```

### Updating flow

Для:

```javascript
users[1] = 'updated@example.test';
```

Engine:

```mermaid
flowchart TD
    N1["Step 1"]
    N2["Find array value"]
    N1 --> N2
```

```mermaid
flowchart TD
    N1["Step 2"]
    N2["Find position 1"]
    N1 --> N2
```

```mermaid
flowchart TD
    N1["Step 3"]
    N2["Replace stored value"]
    N1 --> N2
```

After update:

```mermaid
flowchart TD
    N1["index 0 → &quot;anna@example.test&quot;"]
    N2["index 1 → &quot;updated@example.test&quot;"]
    N3["index 2 → &quot;max@example.test&quot;"]
    N1 --> N2
    N2 --> N3
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

Не так:

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

```mermaid
flowchart TD
    N1["Bookshelf"]
    N2["shelf position 0 → book"]
    N3["shelf position 1 → book"]
    N4["shelf position 2 → book"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Numbered lockers:

```mermaid
flowchart TD
    N1["Locker 0 → value"]
    N2["Locker 1 → value"]
    N3["Locker 2 → value"]
    N1 --> N2
    N2 --> N3
```

Train cars:

```mermaid
flowchart TD
    N1["Train"]
    N2["car 0"]
    N3["car 1"]
    N4["car 2"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Hotel rooms:

```mermaid
flowchart TD
    N1["Hotel"]
    N2["room 0 → guest"]
    N3["room 1 → guest"]
    N4["room 2 → guest"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

Spreadsheet rows:

```mermaid
flowchart TD
    N1["Row 0 → first item"]
    N2["Row 1 → second item"]
    N3["Row 2 → third item"]
    N1 --> N2
    N2 --> N3
```

These are analogies.

The technical mental model:

```mermaid
flowchart TD
    N1["Array"]
    N2["ordered collection accessed by index"]
    N1 --> N2
```

---

## Примеры кода

Примеры находятся в:

```text
examples/01-javascript/chapter-44/
```

Запуск:

```bash
node examples/01-javascript/chapter-44/01-first-array.js
```

### Пример 1. First array

Файл:

```text
examples/01-javascript/chapter-44/01-first-array.js
```

Показывает array literal as ordered collection.

### Пример 2. Indexes

Файл:

```text
examples/01-javascript/chapter-44/02-indexes.js
```

Показывает reading значения by index.

### Пример 3. Update elements

Файл:

```text
examples/01-javascript/chapter-44/03-update-elements.js
```

Показывает replacement at existing position.

### Пример 4. Length

Файл:

```text
examples/01-javascript/chapter-44/04-length.js
```

Показывает `length` and last index relation.

### Пример 5. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-44/05-common-mistakes.js
```

Показывает off-by-one mistake.

### Пример 6. QA example

Файл:

```text
examples/01-javascript/chapter-44/06-qa-example.js
```

Показывает list of users returned from API.

---

## Частые вопросы

### Array - это просто квадратные скобки?

Нет.

Square brackets are syntax.

Array is ordered collection.

```mermaid
flowchart TD
    N1["[]"]
    N2["syntax"]
    N3["Array"]
    N4["ordered storage model"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### Почему первый index is `0`?

JavaScript uses zero-based indexing. This is common in many programming languages.

For this chapter, remember practical rule:

```mermaid
flowchart TD
    N1["first element → index 0"]
    N2["last element → length - 1"]
    N1 --> N2
```

### Array can store objects?

Да.

Например:

```javascript
const users = [
  { email: 'anna@example.test' },
  { email: 'kate@example.test' }
];
```

This is common in API testing.

### Should arrays contain mixed значения?

JavaScript allows it, but readability often suffers.

Prefer arrays where elements represent same kind of thing:

```text
users
requests
assertions
test cases
```

### Why not use object вместо array?

Use object when names matter.

Use array when order and positions matter.

```mermaid
flowchart TD
    N1["object → named properties"]
    N2["array → ordered positions"]
    N1 --> N2
```

---

## Распространенные мифы

### Миф: Array is just object with square brackets

Реальность: arrays are object значения in JavaScript, but for this chapter the useful model is ordered collection with indexes. Object internals will be discussed only when needed.

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

### Ошибка 4. Использовать many variables вместо array

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

```mermaid
flowchart TD
    N1["many values"]
    N2["and"]
    N3["order matters"]
    N1 --> N2
    N2 --> N3
```

Примеры:

* list of users;
* list of test cases;
* list of API responses;
* list of failed assertions;
* list of HTTP requests;
* list of browser tabs.

Array improves readability:

```mermaid
flowchart TD
    N1["testUsers"]
    N2["one named collection"]
    N1 --> N2
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

API often возвращает:

```mermaid
flowchart TD
    N1["users"]
    N2["user at index 0"]
    N3["user at index 1"]
    N4["user at index 2"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

В коде:

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

Концептуально:

```mermaid
flowchart TD
    N1["pages"]
    N2["index 0 → first tab"]
    N3["index 1 → second tab"]
    N4["index 2 → third tab"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
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

```mermaid
flowchart TD
    N1["many values"]
    N2["value 1"]
    N3["value 2"]
    N4["value 3"]
    N5["need one ordered collection"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
```

### 2. One object vs many objects

```mermaid
flowchart TD
    N1["Object"]
    N2["one entity"]
    N3["Array"]
    N4["many values"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### 3. Ordered collection

```mermaid
flowchart TD
    N1["Array"]
    N2["first"]
    N3["second"]
    N4["third"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
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

```mermaid
flowchart TD
    N1["array[1]"]
    N2["value at index 1"]
    N1 --> N2
```

### 7. Updating by index

```mermaid
flowchart TD
    N1["array[1] = newValue"]
    N2["replace element"]
    N1 --> N2
```

### 8. Length

```mermaid
flowchart TD
    N1["[A, B, C]"]
    N2["length 3"]
    N1 --> N2
```

### 9. Empty array

```mermaid
flowchart TD
    N1["[]"]
    N2["length 0"]
    N1 --> N2
```

### 10. Mixed значения

```mermaid
flowchart TD
    N1["[&quot;status&quot;, 200, true]"]
    N2["allowed but use carefully"]
    N1 --> N2
```

### 11. Текущая модель JavaScript

```mermaid
flowchart TD
    N1["Values"]
    N2["Objects"]
    N3["Arrays"]
    N4["ordered collections"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

### 12. QA users list

```mermaid
flowchart TD
    N1["users"]
    N2["0 → Anna"]
    N3["1 → Kate"]
    N4["2 → Max"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

### 13. API response

```mermaid
flowchart TD
    N1["response.users"]
    N2["array of user objects"]
    N1 --> N2
```

### 14. Test cases

```mermaid
flowchart TD
    N1["testCases"]
    N2["valid login"]
    N3["invalid password"]
    N4["locked user"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
```

### 15. Читаемость

```mermaid
flowchart TD
    N1["one collection name"]
    N2["better than"]
    N3["many numbered variables"]
    N1 --> N2
    N2 --> N3
```

### 16. Типичные ошибки

```mermaid
flowchart TD
    N1["length 3"]
    N2["last index 2"]
    N1 --> N2
```

### 17. Bookshelf analogy

```mermaid
flowchart TD
    N1["shelf 0 → book"]
    N2["shelf 1 → book"]
    N3["shelf 2 → book"]
    N1 --> N2
    N2 --> N3
```

### 18. Train analogy

```mermaid
flowchart TD
    N1["car 0 → value"]
    N2["car 1 → value"]
    N3["car 2 → value"]
    N1 --> N2
    N2 --> N3
```

### 19. Hotel analogy

```mermaid
flowchart TD
    N1["room 0 → guest"]
    N2["room 1 → guest"]
    N3["room 2 → guest"]
    N1 --> N2
    N2 --> N3
```

### 20. Spreadsheet analogy

```mermaid
flowchart TD
    N1["row 0 → item"]
    N2["row 1 → item"]
    N3["row 2 → item"]
    N1 --> N2
    N2 --> N3
```

### 21. Index lookup

```mermaid
flowchart TD
    N1["index"]
    N2["position"]
    N3["значение"]
    N1 --> N2
    N2 --> N3
```

### 22. Last element

```mermaid
flowchart TD
    N1["length - 1"]
    N2["last index"]
    N1 --> N2
```

### 23. Array growth preview

```mermaid
flowchart TD
    N1["array now"]
    N2["next chapter: add/remove elements"]
    N1 --> N2
```

### 24. Element replacement

```mermaid
flowchart TD
    N1["old value"]
    N2["new value at same index"]
    N1 --> N2
```

### 25. Краткая ментальная модель

```mermaid
flowchart TD
    N1["Many values"]
    N2["Ordered collection"]
    N3["Indexes"]
    N1 --> N2
    N2 --> N3
```

### 26. Complete array model

```mermaid
flowchart TD
    N1["Array"]
    N2["length"]
    N3["index 0"]
    N4["index 1"]
    N5["index 2"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
```

### 27. Object vs array

```mermaid
flowchart TD
    N1["object.name"]
    N2["named property"]
    N3["array[0]"]
    N4["positioned element"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### 28. Ordered storage

```mermaid
flowchart TD
    N1["order matters"]
    N2["array fits"]
    N1 --> N2
```

### 29. Принадлежность значения

```mermaid
flowchart TD
    N1["array"]
    N2["contains elements"]
    N1 --> N2
```

### 30. Array lifecycle

```mermaid
flowchart TD
    N1["create"]
    N2["чтение"]
    N3["update"]
    N4["grow later"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

### 31. Переход к push()

```mermaid
flowchart TD
    N1["fixed elements now"]
    N2["push() later"]
    N1 --> N2
```

### 32. Переход к loops

```mermaid
flowchart TD
    N1["many elements"]
    N2["later: repeat over them"]
    N1 --> N2
```

### 33. Переход к iteration

```mermaid
flowchart TD
    N1["array"]
    N2["later: iteration methods"]
    N1 --> N2
```

### 34. QA framework example

```mermaid
flowchart TD
    N1["failedAssertions"]
    N2["failure 0"]
    N3["failure 1"]
    N1 --> N2
    N1 --> N3
```

### 35. API collection

```mermaid
flowchart TD
    N1["GET /users"]
    N2["array of users"]
    N1 --> N2
```

### 36. Collection evolution

```mermaid
flowchart TD
    N1["one value"]
    N2["many values"]
    N3["array"]
    N1 --> N2
    N2 --> N3
```

### 37. Element identity

```mermaid
flowchart TD
    N1["element at index 0"]
    N2["can be primitive or object"]
    N1 --> N2
```

### 38. Array memory intuition

```mermaid
flowchart TD
    N1["one variable"]
    N2["one array value"]
    N3["many elements"]
    N1 --> N2
    N2 --> N3
```

### 39. Reading flow

```mermaid
flowchart TD
    N1["array[index]"]
    N2["find position"]
    N3["возвращаемое значение"]
    N1 --> N2
    N2 --> N3
```

### 40. Итоговая схема

```mermaid
flowchart TD
    N1["Many values"]
    N2["Array"]
    N3["Ordered positions"]
    N4["Indexes"]
    N5["Read values"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
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

```mermaid
flowchart TD
    N1["Many values"]
    N2["Array"]
    N3["Ordered positions"]
    N4["Indexes"]
    N5["Read values"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Objects and arrays solve different problems:

```mermaid
flowchart TD
    N1["Object"]
    N2["What value belongs to this name?"]
    N3["Array"]
    N4["What value is stored at this position?"]
    N1 --> N2
    N1 --> N3
    N3 --> N4
```

The next chapter will explain how arrays grow and shrink with methods such as `push()` and `pop()`.

---

## Что нужно запомнить

✓ Array is an ordered collection of значения.

✓ Array elements are accessed by indexes.

✓ First index is `0`.

✓ `length` is count of elements, not last index.

✓ Last index is `length - 1`.

✓ Empty array has length `0`.

✓ Arrays can contain primitive значения and objects.

✓ Objects use names; arrays use positions.

✓ Arrays are common in API responses and test data.

✓ Array methods and loops are future topics.

---

## Проверьте себя

1. What problem do arrays solve?

2. Why use an array вместо many variables?

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
practice/01-javascript/44-arrays.md
```

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/01-javascript/44-arrays.md
```

Сначала выполните практику самостоятельно. Затем сравните ход рассуждения, а не только итоговый ответ.
