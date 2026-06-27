# push() and pop()

## Связь с предыдущей главой

Предыдущая глава объяснила Arrays.

Главная модель была такой:

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

Мы научились читать и заменять elements by index:

```javascript
const users = ['Anna', 'Kate'];

console.log(users[0]);

users[1] = 'Kate Updated';
```

Но предыдущая глава работала с arrays как будто их размер уже известен.

Теперь появляется следующий вопрос:

> How can an array grow or shrink?

Например, API возвращает new users one by one:

```text
current users
│
└── Anna

new user
│
└── Kate
```

Нужно добавить Kate в конец collection.

Позже последний user нужно убрать:

```text
current users
│
├── Anna
└── Kate

remove last user
```

Эта глава отвечает:

```text
Array
│
▼
Add to end
│
▼
push()

Array
│
▼
Remove from end
│
▼
pop()
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что array is ordered collection;
* что array elements have indexes;
* что first index is `0`;
* что `length` is count of elements;
* что last index is `length - 1`;
* что arrays are useful for API responses, failed assertions and test data.

Не требуется знать `shift`, `unshift`, `splice`, `slice`, queue, deque, loops or iteration methods. Эти темы будут изучаться позже.

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

`push()` and `pop()` are small methods, but they introduce an important idea: array size can change. The array is not only read; it can grow and shrink.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/44-arrays.md
```

Текущая глава:

```text
docs/01-javascript/45-push-pop.md
```

Следующая глава:

```text
docs/01-javascript/46-shift-unshift.md
```

Следующая глава ответит:

> How can arrays change at the beginning instead of the end?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `push()`;
* зачем существует `pop()`;
* как array receives a new last element;
* как array loses its last element;
* что `push()` changes existing array;
* что `pop()` changes existing array;
* почему `length` changes after element count changes;
* что возвращает `pop()`;
* почему stack intuition полезна только на высоком уровне;
* как `push()` and `pop()` применяются in Automation QA.

---

## Мотивация

Начнем с growing collection.

Есть array:

```javascript
const users = ['Anna'];
```

API returns new user:

```text
Kate
```

Вопрос:

> Как collection может вырасти?

Не хочется заранее писать:

```javascript
const users = ['Anna', 'Kate'];
```

Потому что Kate может появиться позже, например после ответа API.

Нужна операция:

```text
текущий array
│
▼
нужен новый последний element
│
▼
push()
│
▼
element добавлен
│
▼
array теперь содержит на один element больше
│
▼
length увеличивается
```

Для этого используется `push()`.

Теперь обратная ситуация.

Есть array:

```javascript
const users = ['Anna', 'Kate'];
```

Нужно удалить последнего пользователя и узнать, кто был удален.

Вопрос:

> Как collection может уменьшиться с конца?

Для этого используется `pop()`.

```text
нужно удалить последний element
│
▼
pop()
│
▼
element удален
│
▼
array теперь содержит на один element меньше
│
▼
length уменьшается
│
▼
удаленное value возвращается
```

---

## Теория

`push()` добавляет один или несколько elements в конец array.

В этой главе мы фокусируемся на одном element за раз:

```javascript
const users = ['Anna'];

users.push('Kate');
```

Before:

```text
index 0 -> "Anna"
length  -> 1
```

After:

```text
index 0 -> "Anna"
index 1 -> "Kate"
length  -> 2
```

Важно:

```text
push()
│
└── changes existing array
```

We are not discussing immutability yet.

### Why `push()` exists

`push()` exists because arrays often need to grow after creation.

Примеры:

```text
new API response received
new failed assertion collected
new request executed
new test result recorded
```

`push()` answers:

```text
How do we add a new last element?
```

### `pop()`

`pop()` removes the last element from an array and returns removed value.

```javascript
const users = ['Anna', 'Kate'];

const removedUser = users.pop();
```

Before:

```text
index 0 -> "Anna"
index 1 -> "Kate"
length  -> 2
```

After:

```text
index 0 -> "Anna"
length  -> 1
```

Возвращаемое значение:

```text
"Kate"
```

Важно:

```text
pop()
│
├── changes existing array
└── returns removed last element
```

### Why `pop()` exists

`pop()` exists because sometimes last element should be removed.

Примеры:

```text
remove last collected result
undo last collected item
take last executed request
remove last temporary value
```

`pop()` answers:

```text
How do we remove and get the last element?
```

### Length as consequence

`push()` adds a new element to the end.

Because the array now contains one more element, `length` increases.

```text
before push:  one element  -> length 1
after push:   two elements -> length 2
```

`pop()` removes the last element.

Because the array now contains one fewer element, `length` decreases.

```text
before pop:  two elements -> length 2
after pop:   one element  -> length 1
```

### Stack intuition

High-level only:

```text
last added
│
▼
first removed
```

This is similar to stack of plates:

```text
put plate on top
│
▼
take plate from top
```

We do not study formal Stack data structure here. This is only intuition for adding/removing from the end.

---

## Внутренний механизм

When JavaScript executes:

```javascript
users.push('Kate');
```

Engine has:

```text
array: users
new value: "Kate"
```

Поток:

```text
Step 1
│
▼
Find current length
```

```text
Step 2
│
▼
Use length as next index
```

```text
Step 3
│
▼
Store new value at the end
```

```text
Step 4
│
▼
Array now contains one more element
│
▼
length is larger
```

Example:

```text
before
│
├── length: 1
└── next index: 1

push("Kate")
│
▼
users[1] = "Kate"
│
▼
length: 2
```

When JavaScript executes:

```javascript
const removed = users.pop();
```

Engine:

```text
Step 1
│
▼
Find last index: length - 1
```

```text
Step 2
│
▼
Read value at last index
```

```text
Step 3
│
▼
Remove last element
```

```text
Step 4
│
▼
Array now contains one fewer element
│
▼
length is smaller
```

```text
Step 5
│
▼
Return removed value
```

If array is empty:

```javascript
const items = [];
const removed = items.pop();
```

Результат:

```text
removed -> undefined
length  -> 0
```

No element existed to remove.

---

## Ментальная модель

Growing bookshelf:

```text
bookshelf
│
├── book 0
└── add book 1 at end
```

Stack of plates:

```text
top
│
├── last plate
└── pop removes this one
```

Train gaining last car:

```text
train
│
├── car 0
└── push -> add car 1 at end
```

Train losing last car:

```text
train
│
├── car 0
└── pop -> remove last car
```

Notebook with new last page:

```text
notebook
│
├── page 0
└── add page 1
```

Expandable list:

```text
list
│
├── adds at end
└── removes from end
```

Central model:

```text
Array
│
▼
push()
│
▼
element добавлен в конец
│
▼
появился новый последний element
│
▼
array теперь содержит на один element больше
│
▼
length увеличивается
```

```text
Array
│
▼
pop()
│
▼
последний element удален
│
▼
array теперь содержит на один element меньше
│
▼
length уменьшается
│
└── удаленное value возвращается
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-48/
```

Запуск:

```bash
node examples/chapter-48/01-push.js
```

### Пример 1. push

Файл:

```text
examples/chapter-48/01-push.js
```

Показывает adding new last element.

### Пример 2. pop

Файл:

```text
examples/chapter-48/02-pop.js
```

Показывает removing last element.

### Пример 3. length

Файл:

```text
examples/chapter-48/03-length.js
```

Показывает how `length` reflects the current number of elements.

### Пример 4. Возвращаемое значение

Файл:

```text
examples/chapter-48/04-return-value.js
```

Показывает that `pop()` returns removed value.

### Пример 5. Типичные ошибки

Файл:

```text
examples/chapter-48/05-common-mistakes.js
```

Показывает mistake: expecting `pop()` to return array.

### Пример 6. QA example

Файл:

```text
examples/chapter-48/06-qa-example.js
```

Показывает collecting failed assertions.

---

## Частые вопросы

### `push()` создает новый array?

Нет.

In this chapter model:

```text
push()
│
└── changes existing array
```

Immutability will be discussed later.

### `pop()` создает новый array?

Нет.

```text
pop()
│
├── changes existing array
└── returns removed value
```

### Что возвращает `pop()`?

Removed last element.

```text
["Anna", "Kate"].pop()
│
▼
"Kate"
```

### What happens when pop from empty array?

```text
[]
│
▼
pop()
│
▼
undefined
```

Array remains empty.

### Is this a stack?

At a high level, adding/removing from the end resembles stack behavior.

But formal stacks are not the topic of this chapter.

---

## Распространенные мифы

### Миф: `push()` returns the added element

Реальность: this chapter focuses on adding elements to the end. The key learning goal is that the array receives one more element, and only then `length` reflects the new count. Do not rely on guessed return values.

### Миф: `pop()` returns the changed array

Реальность: `pop()` returns removed last element.

### Миф: `pop()` from empty array is always a crash

Реальность: it returns `undefined`.

### Миф: `push()` and `pop()` work at the beginning

Реальность: both operate at the end of array. Beginning operations are next chapter.

---

## Типичные ошибки

### Ошибка 1. Expect `pop()` to return array

Неправильный код:

```javascript
const users = ['Anna', 'Kate'];
const result = users.pop();

console.log(result.length);
```

Что произошло:

`result` is removed element, not array.

Исправленная модель:

```text
users
│
└── changed array

result
│
└── removed value
```

### Ошибка 2. Forget that original array changes

Неправильная модель:

```text
users.push("Kate")
│
└── returns separate new array
```

Правильная модель:

```text
users
│
└── now contains Kate at the end
```

### Ошибка 3. Expect `pop()` to remove first element

Wrong:

```text
pop()
│
└── removes first element
```

Correct:

```text
pop()
│
└── removes last element
```

### Ошибка 4. Ignore empty array

```javascript
const failedAssertions = [];
const lastFailure = failedAssertions.pop();
```

`lastFailure` is `undefined`.

Before using removed value, code should account for empty collection.

---

## Практическое использование

Use `push()` when new value arrives and should become last element:

```text
new API response
new failed assertion
new executed request
new test result
```

Use `pop()` when last value should be removed and used:

```text
last collected item
last temporary result
last request in simple history
```

Читаемость:

```text
responses.push(response)
│
clearly means
│
append response to collection
```

```text
const lastResponse = responses.pop()
│
clearly means
│
remove and use last response
```

---

## Использование в Automation QA

### Accumulating API responses

```javascript
const responses = [];

responses.push('GET /users -> 200');
responses.push('GET /orders -> 200');
```

Ментальная модель:

```text
responses
│
├── first response
└── second response
```

### Failed assertions

```javascript
const failedAssertions = [];

failedAssertions.push('status expected 200, actual 500');
```

Empty array means no failures yet.

After push:

```text
one failure collected
```

### Executed requests

```text
executedRequests
│
├── request 0
├── request 1
└── request 2
```

`pop()` can retrieve last executed request in simple history model.

### Browser history high level

At a high level:

```text
last visited page
│
can be treated like
│
last item in collection
```

We are not implementing browser history here.

### Collected test results

```text
testResults
│
├── result 0
├── result 1
└── result 2
```

`push()` is natural when results appear one after another.

---

## Диаграммы главы

### 1. Why push exists

```text
array has values
│
new value arrives
│
▼
need add to end
```

### 2. Why pop exists

```text
array has values
│
last value needed
│
▼
remove from end
```

### 3. Array growth

```text
[A]
│
push B
▼
[A, B]
```

### 4. Array shrink

```text
[A, B]
│
pop
▼
[A]
```

### 5. Before push

```text
index 0 -> A
length 1
```

### 6. After push

```text
index 0 -> A
index 1 -> B
length 2
```

### 7. Before pop

```text
index 0 -> A
index 1 -> B
length 2
```

### 8. After pop

```text
index 0 -> A
length 1
```

### 9. Element count growth

```text
one element
│
push
▼
two elements
│
▼
length reflects new count
```

### 10. Element count shrink

```text
two elements
│
pop
▼
one element
│
▼
length reflects new count
```

### 11. Возвращаемое значение pop

```text
[A, B].pop()
│
▼
B
```

### 12. Текущая модель JavaScript

```text
Arrays
│
├── indexes
├── length
└── push/pop
```

### 13. Stack intuition

```text
last added
│
▼
first removed
```

### 14. QA failed assertions

```text
failedAssertions
│
push failure
▼
contains failure
```

### 15. API users

```text
users
│
push new user
▼
new last user
```

### 16. Test queue preview

```text
beginning operations
│
next chapter
```

### 17. Читаемость

```text
array.push(value)
│
▼
append value
```

### 18. Типичные ошибки

```text
pop()
│
returns removed value
│
not array
```

### 19. Bookshelf analogy

```text
book 0
book 1 <- new last book
```

### 20. Plate stack

```text
top plate
│
pop removes top
```

### 21. Train analogy

```text
train + last car
train - last car
```

### 22. Notebook analogy

```text
last page added
last page removed
```

### 23. Complete push model

```text
Array
│
▼
Need new last element
│
▼
push(value)
│
▼
value становится последним element
│
▼
array теперь содержит на один element больше
│
▼
length увеличивается
```

### 24. Полная модель pop

```text
Array
│
▼
Нужно удалить последний element
│
▼
pop()
│
▼
последний element удален
│
▼
array теперь содержит на один element меньше
│
▼
length уменьшается
│
└── удаленное value возвращается
```

### 25. Element lifecycle

```text
not in array
│
push
▼
in array
│
pop
▼
removed
```

### 26. Last element

```text
length - 1
│
▼
last index
```

### 27. Push flow

```text
find length
│
use as next index
│
store value
```

### 28. Pop flow

```text
find last index
│
read value
│
remove element
│
return value
```

### 29. Length timeline

```text
0 -> push -> 1 -> push -> 2 -> pop -> 1
```

### 30. Ordered collection reminder

```text
order stays
│
new values added at end
```

### 31. Краткая ментальная модель

```text
push adds at end
pop removes from end
```

### 32. Переход к shift()

```text
end operations now
│
beginning operations next
```

### 33. Переход к loops

```text
arrays with many elements
│
later: repeat over them
```

### 34. QA framework example

```text
testResults.push(result)
│
collect result
```

### 35. API response growth

```text
responses
│
push new response
```

### 36. Removed value

```text
const removed = array.pop()
│
removed is last element
```

### 37. Array evolution

```text
[]
│
push A
▼
[A]
│
push B
▼
[A, B]
```

### 38. Итоговая схема

```text
Array
│
├── push()
│   ├── add to end
│   ├── array has one more element
│   └── length reflects new count
│
└── pop()
    ├── remove from end
    ├── array has one fewer element
    ├── return removed value
    └── length reflects new count
```

---

## Итоги

The previous chapter introduced arrays as ordered collections.

This chapter answered:

```text
How can array grow or shrink?
```

`push()`:

```text
Array
│
▼
need new last element
│
▼
push()
│
▼
one new last element
│
▼
array now contains one more element
│
▼
length increases
```

`pop()`:

```text
Array
│
▼
need removed last element
│
▼
pop()
│
▼
last element removed
│
▼
array now contains one fewer element
│
▼
length decreases
│
└── removed value returned
```

Both methods change the existing array.

The next chapter will explain `shift()` and `unshift()`: changing arrays at the beginning instead of the end.

---

## Что нужно запомнить

✓ `push()` adds value to the end of array.

✓ `push()` changes existing array.

✓ After `push()` array contains one more element, so `length` increases.

✓ `pop()` removes last element.

✓ `pop()` changes existing array.

✓ `pop()` returns removed value.

✓ After `pop()` array contains one fewer element, so `length` decreases.

✓ `pop()` from empty array returns `undefined`.

✓ `push()` and `pop()` operate at the end.

✓ Beginning operations are the next chapter.

---

## Проверьте себя

1. What problem does `push()` solve?

2. What problem does `pop()` solve?

3. Why does `length` increase after `push()`?

4. What does `pop()` return?

5. Does `pop()` return the changed array?

6. What happens when `pop()` is called on empty array?

7. Which end of array do `push()` and `pop()` use?

8. Why is stack intuition useful only at high level here?

9. How can `push()` be useful for failed assertions?

10. What will the next chapter explain?

---

## Практика

Практические задания находятся в отдельном файле:

```text
practice/chapter-48.md
```

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/chapter-48.md
```

Сначала выполните практику самостоятельно. Затем сравните reasoning, not only final answer.
