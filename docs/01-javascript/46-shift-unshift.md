# shift() and unshift()

## Связь с предыдущей главой

Предыдущая глава объяснила `push()` и `pop()`.

Главная модель была такой:

```text
Array
│
├── push()
│   └── изменить конец
│
└── pop()
    └── изменить конец
```

`push()` добавляет новый последний элемент.

`pop()` удаляет и возвращает последний элемент.

Теперь появляется следующий вопрос:

> Как массив может изменяться в начале?

Например, тестовый фреймворк хранит задачи:

```text
index 0 -> "request A"
index 1 -> "request B"
index 2 -> "request C"
```

Появилась срочная задача, которая должна стать первой:

```text
"urgent request"
│
▼
должна стать index 0
```

Или первая задача уже обработана:

```text
index 0 -> "request A"
│
▼
взять первую задачу в обработку
```

Эта глава отвечает:

```text
Array
│
▼
Начало
│
├── unshift() -> добавить новый первый элемент
└── shift()   -> удалить и вернуть первый элемент
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что array — это ordered collection;
* что первый element имеет index `0`;
* что `length` отражает количество elements;
* что `push()` и `pop()` изменяют конец array;
* что методы array могут изменять существующий array;
* что Automation QA часто работает со списками requests, test steps и collected failures.

Не требуется знать `splice`, `slice`, queue как формальную структуру данных, deque, loops, iteration methods, `map`, `filter`, `reduce`, Big O notation или performance benchmarking. Эти темы будут изучаться позже.

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

`shift()` и `unshift()` выглядят симметрично `pop()` и `push()`, но концептуально они интереснее: они изменяют начало ordered collection, поэтому существующие indexes должны смещаться.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/45-push-pop.md
```

Текущая глава:

```text
docs/01-javascript/46-shift-unshift.md
```

Следующая глава ответит:

> Как массив может изменяться в середине?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `unshift()`;
* зачем существует `shift()`;
* что начало array находится at index `0`;
* как добавить новый первый элемент;
* как удалить первый элемент;
* что возвращает `shift()`;
* почему существующие indexes смещаются после операций в начале;
* почему `length` меняется после изменения количества elements;
* чем операции в начале отличаются от операций в конце;
* как `shift()` и `unshift()` применяются в Automation QA.

---

## Мотивация

Начнем с реальной задачи.

Тестовый фреймворк хранит request tasks:

```javascript
const requestTasks = [
  'GET /users',
  'GET /orders',
  'GET /payments'
];
```

Текущий порядок:

```text
index 0 -> "GET /users"
index 1 -> "GET /orders"
index 2 -> "GET /payments"
```

Появился срочный request:

```text
"POST /login"
```

Она должна стать первой, потому что без login следующие requests не смогут выполниться.

Вопрос:

> Как массив может добавить новый первый элемент?

Нужна операция:

```text
Нужно добавить новый первый элемент
│
▼
unshift()
│
▼
element добавлен at index 0
│
▼
старые elements смещаются вправо
│
▼
array теперь содержит на один element больше
│
▼
length увеличивается
```

Это `unshift()`.

Теперь первая задача обработана:

```text
index 0 -> "POST /login"
```

Вопрос:

> Как массив может удалить первый element и передать его программе?

Нужна операция:

```text
Нужно удалить первый element
│
▼
shift()
│
▼
первый элемент удален
│
▼
старые elements смещаются влево
│
▼
array теперь содержит на один element меньше
│
▼
length уменьшается
│
└── удаленное значение возвращается
```

Это `shift()`.

---

## Теория

`unshift()` добавляет один или несколько elements в начало array.

В этой главе мы фокусируемся на одном element за раз:

```javascript
const requestTasks = ['GET /users', 'GET /orders'];

requestTasks.unshift('POST /login');
```

До выполнения:

```text
index 0 -> "GET /users"
index 1 -> "GET /orders"
length  -> 2
```

После выполнения:

```text
index 0 -> "POST /login"
index 1 -> "GET /users"
index 2 -> "GET /orders"
length  -> 3
```

Важно:

```text
unshift()
│
├── изменяет существующий array
├── добавляет новый первый элемент
└── смещает существующие elements вправо
```

### Зачем существует `unshift()`

`unshift()` существует, потому что иногда новое значение должно стать первым.

Примеры:

```text
срочный request
приоритетный test step
первая browser tab
приоритетная failure
setup task перед обычными задачами
```

`unshift()` answers:

```text
Как добавить новый первый element?
```

### `shift()`

`shift()` удаляет первый element из array и возвращает удаленное значение.

```javascript
const requestTasks = ['POST /login', 'GET /users', 'GET /orders'];

const firstTask = requestTasks.shift();
```

До выполнения:

```text
index 0 -> "POST /login"
index 1 -> "GET /users"
index 2 -> "GET /orders"
length  -> 3
```

После выполнения:

```text
index 0 -> "GET /users"
index 1 -> "GET /orders"
length  -> 2
```

Возвращаемое значение:

```text
"POST /login"
```

Важно:

```text
shift()
│
├── изменяет существующий array
├── удаляет первый элемент
├── возвращает удаленный первый элемент
└── смещает оставшиеся elements влево
```

### Зачем существует `shift()`

`shift()` существует, потому что иногда первый element нужно обработать и удалить.

Примеры:

```text
взять первый collected request
обработать первый test step
удалить первую browser tab
взять failure с самым высоким приоритетом
забрать первую задачу из простого списка
```

`shift()` answers:

```text
Как удалить и получить первый element?
```

### Начало array

Начало array — это index `0`.

```text
index 0
│
▼
первый element
```

Поскольку arrays упорядочены, изменение начала влияет на позиции других elements.

```text
До unshift:

0 -> A
1 -> B
2 -> C

После unshift X:

0 -> X
1 -> A
2 -> B
3 -> C
```

Значения не потеряли порядок относительно друг друга. Они перешли на новые indexes.

### Length как следствие

`unshift()` добавляет новый element в начало.

Так как array теперь содержит на один element больше, `length` увеличивается.

```text
до unshift:     два elements  -> length 2
после unshift:  три elements  -> length 3
```

`shift()` удаляет первый элемент.

Так как array теперь содержит на один element меньше, `length` уменьшается.

```text
до shift:     три elements  -> length 3
после shift:  два elements  -> length 2
```

### Отличие от `push()` и `pop()`

Операции в конце:

```text
push()
pop()
│
└── изменить конец
```

Операции в начале:

```text
unshift()
shift()
│
└── изменить начало
```

Ключевое отличие:

```text
изменение конца
│
└── предыдущие indexes обычно визуально стабильны

изменение начала
│
└── существующие indexes смещаются
```

Здесь мы не обсуждаем performance benchmarking или Big O notation. Важная идея главы — смещение indexes.

---

## Внутренний механизм

Когда JavaScript выполняет:

```javascript
requestTasks.unshift('POST /login');
```

У engine есть:

```text
array: requestTasks
новое значение: "POST /login"
текущий первый index: 0
```

Поток действий:

```text
Шаг 1
│
▼
Подготовить index 0 для нового значения
```

```text
Шаг 2
│
▼
Сместить существующие elements на одну позицию вправо
```

```text
Шаг 3
│
▼
Сохранить новое значение at index 0
```

```text
Шаг 4
│
▼
Array теперь содержит на один element больше
│
▼
length стал больше
```

Пример:

```text
до выполнения
│
├── 0 -> GET /users
└── 1 -> GET /orders

unshift("POST /login")
│
▼
после выполнения
│
├── 0 -> POST /login
├── 1 -> GET /users
└── 2 -> GET /orders
```

Когда JavaScript выполняет:

```javascript
const task = requestTasks.shift();
```

Engine:

```text
Шаг 1
│
▼
Прочитать значение at index 0
```

```text
Шаг 2
│
▼
Удалить первый элемент
```

```text
Шаг 3
│
▼
Сместить оставшиеся elements на одну позицию влево
```

```text
Шаг 4
│
▼
Array теперь содержит на один element меньше
│
▼
length стал меньше
```

```text
Шаг 5
│
▼
Вернуть удаленное значение
```

Пример:

```text
до выполнения
│
├── 0 -> POST /login
├── 1 -> GET /users
└── 2 -> GET /orders

shift()
│
▼
возвращено -> POST /login

после выполнения
│
├── 0 -> GET /users
└── 1 -> GET /orders
```

Если array пустой:

```javascript
const requestTasks = [];
const firstTask = requestTasks.shift();
```

Результат:

```text
firstTask -> undefined
length    -> 0
```

Не было первый элемент, который можно удалить.

---

## Ментальная модель

Передняя дверь поезда:

```text
начало
│
▼
[car A][car B][car C]
```

`unshift()` добавляет новый вагон в начало:

```text
[urgent][car A][car B][car C]
```

Интуиция очереди:

```text
начало очереди
│
▼
первый человек обслуживается первым
```

Используйте это только как высокоуровневую интуицию. В этой главе мы не изучаем формальную структуру Queue.

Первая страница блокнота:

```text
новая первая страница
│
▼
старые страницы смещаются после нее
```

Ряд сидений:

```text
новый человек садится на место 0
│
▼
остальные смещаются на следующие места
```

Конвейер:

```text
взять первый элемент
│
▼
следующий элемент становится первым
```

Central model:

```text
Array
│
▼
Начало
│
▼
unshift()
│
▼
новый первый элемент
│
▼
indexes смещаются вправо
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
Начало
│
▼
shift()
│
▼
первый элемент удален
│
▼
indexes смещаются влево
│
▼
array теперь содержит на один element меньше
│
▼
length уменьшается
│
└── удаленное значение возвращается
```

---

## Примеры кода

Примеры находятся в:

```text
examples/01-javascript/chapter-46/
```

Запуск:

```bash
node examples/01-javascript/chapter-46/01-unshift.js
```

### Пример 1. unshift

Файл:

```text
examples/01-javascript/chapter-46/01-unshift.js
```

Показывает добавление срочной задачи в начало.

### Пример 2. shift

Файл:

```text
examples/01-javascript/chapter-46/02-shift.js
```

Показывает удаление и возврат первой задачи.

### Пример 3. Смещение indexes

Файл:

```text
examples/01-javascript/chapter-46/03-index-shifting.js
```

Показывает, почему существующие indexes меняются.

### Пример 4. Возвращаемое значение

Файл:

```text
examples/01-javascript/chapter-46/04-return-value.js
```

Показывает, что `shift()` возвращает удаленный первый элемент.

### Пример 5. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-46/05-common-mistakes.js
```

Показывает ошибку: ожидание, что `shift()` удалит последний элемент.

### Пример 6. QA example

Файл:

```text
examples/01-javascript/chapter-46/06-qa-example.js
```

Показывает простой сценарий обработки requests.

---

## Частые вопросы

### `unshift()` создает новый array?

Нет.

В модели этой главы:

```text
unshift()
│
└── изменяет существующий array
```

### `shift()` создает новый array?

Нет.

```text
shift()
│
├── изменяет существующий array
└── возвращает удаленный первый элемент
```

### Что возвращает `shift()`?

Удаленный первый элемент.

```text
["login", "users"].shift()
│
▼
"login"
```

### Что происходит при `shift()` из пустого array?

```text
[]
│
▼
shift()
│
▼
undefined
```

Array остается пустым.

### Это queue?

На высоком уровне удаление из начала похоже на обработку очереди.

Но формальные структуры Queue и Deque не являются темой этой главы.

### Почему indexes меняются?

Потому что index `0` — это начало.

Когда появляется новый первый элемент, старые elements должны сместиться вправо.

Когда первый элемент удаляется, оставшиеся elements должны сместиться влево.

---

## Распространенные мифы

### Миф: `shift()` — это то же самое, что `pop()`

Реальность: `shift()` удаляет первый элемент. `pop()` удаляет последний элемент.

### Миф: `unshift()` добавляет element в конец

Реальность: `unshift()` добавляет element в начало.

### Миф: indexes остаются такими же после `unshift()`

Реальность: существующие elements смещаются вправо, поэтому их indexes меняются.

### Миф: `shift()` возвращает измененный array

Реальность: `shift()` возвращает удаленный первый элемент.

### Миф: `shift()` из пустого array всегда падает

Реальность: он возвращает `undefined`.

---

## Типичные ошибки

### Ошибка 1. Ожидать, что `shift()` удалит последний элемент

Неправильная модель:

```text
shift()
│
└── удаляет последний элемент
```

Правильная модель:

```text
shift()
│
└── удаляет первый элемент
```

### Ошибка 2. Забыть, что indexes смещаются после `unshift()`

Неправильная модель:

```text
до:
0 -> A
1 -> B

unshift X

после:
0 -> X
1 -> B
```

Что пропущено:

```text
A сместился с index 0 на index 1
B сместился с index 1 на index 2
```

Правильная модель:

```text
после:
0 -> X
1 -> A
2 -> B
```

### Ошибка 3. Ожидать, что `shift()` вернет array

Неправильный код:

```javascript
const tasks = ['login', 'users'];
const result = tasks.shift();

console.log(result.length);
```

Что произошло:

`result` — это удаленный первый элемент, а не измененный array.

Исправленная модель:

```text
tasks
│
└── измененный array

result
│
└── удаленное первое значение
```

### Ошибка 4. Игнорировать empty array

```javascript
const tasks = [];
const firstTask = tasks.shift();
```

`firstTask` is `undefined`.

Перед использованием удаленного значения код должен учитывать пустую collection.

---

## Практическое использование

Используйте `unshift()`, когда новое значение должно стать первым:

```text
срочный request
приоритетная test task
setup step перед обычными steps
важная failure перед обычными failures
```

Используйте `shift()`, когда первое значение нужно удалить и обработать:

```text
первый request для выполнения
первый collected test step
первая browser tab в простой модели
первая failure для отчета
```

Читаемость:

```text
requestTasks.unshift(urgentTask)
│
явно означает
│
поместить срочную задачу в начало
```

```text
const nextTask = requestTasks.shift()
│
явно означает
│
взять первую задачу из collection
```

---

## Использование в Automation QA

### Интуиция request queue

Тестовый фреймворк может собирать описания requests:

```javascript
const requestTasks = ['GET /users', 'GET /orders'];

requestTasks.unshift('POST /login');
```

Ментальная модель:

```text
POST /login
│
▼
должен выполниться перед другими requests
```

Это только queue-like intuition. Здесь мы не формализуем Queue.

### Обработка первого collected item

```javascript
const nextRequest = requestTasks.shift();
```

Теперь:

```text
nextRequest
│
└── первый удаленный request
```

Оставшиеся requests смещаются влево.

### Browser tabs в начале

Если простая модель считает первую tab активной:

```text
index 0 -> active tab
```

`unshift()` может поместить новую приоритетную tab в начало этой модели.

### Failed assertions в порядке приоритета

```javascript
const failures = ['missing title'];

failures.unshift('login failed');
```

Теперь самая важная failure находится первой.

### Collected test steps

```text
testSteps
│
├── setup
├── action
└── assertion
```

Если обязательный precondition обнаружен поздно, `unshift()` может поместить его перед обычными steps.

---

## Диаграммы главы

### 1. Зачем существует unshift

```text
array содержит values
│
приходит срочное value
│
▼
нужно добавить в начало
```

### 2. Зачем существует shift

```text
array содержит values
│
нужно первое value
│
▼
удалить из начала
```

### 3. Начало vs конец

```text
начало                конец
│                     │
index 0               length - 1
```

### 4. До unshift

```text
0 -> A
1 -> B
```

### 5. После unshift

```text
0 -> X
1 -> A
2 -> B
```

### 6. До shift

```text
0 -> X
1 -> A
2 -> B
```

### 7. После shift

```text
0 -> A
1 -> B
```

### 8. Index 0

```text
index 0
│
▼
первый элемент
```

### 9. Смещение indexes вправо

```text
A: 0 -> 1
B: 1 -> 2
C: 2 -> 3
```

### 10. Смещение indexes влево

```text
A удален
B: 1 -> 0
C: 2 -> 1
```

### 11. Увеличение length

```text
два elements
│
unshift
▼
три elements
│
▼
length отражает новое количество
```

### 12. Уменьшение length

```text
три elements
│
shift
▼
два elements
│
▼
length отражает новое количество
```

### 13. Возвращаемое значение shift

```text
[A, B].shift()
│
▼
A
```

### 14. Текущая модель JavaScript

```text
Arrays
│
├── indexes
├── length
├── push/pop
└── shift/unshift
```

### 15. Связь с push/pop

```text
push/pop
│
└── конец

shift/unshift
│
└── начало
```

### 16. Интуиция Queue на высоком уровне

```text
начало
│
▼
первый item обработан
```

### 17. QA request queue

```text
POST /login
GET /users
GET /orders
```

### 18. Пример failed assertions

```text
приоритетная failure
│
unshift
▼
попадает в отчет первой
```

### 19. Пример browser tabs

```text
index 0 -> первая tab
index 1 -> вторая tab
```

### 20. Читаемость

```text
tasks.shift()
│
▼
взять первую task
```

### 21. Типичные ошибки

```text
shift()
│
возвращает удаленное value
│
не array
```

### 22. Аналогия с началом поезда

```text
передний вагон добавлен
старые вагоны смещаются назад
```

### 23. Аналогия с очередью

```text
начало очереди
│
обслуживается первым
```

### 24. Аналогия с первой страницей блокнота

```text
новая page 0
старая page 0 становится page 1
```

### 25. Аналогия с рядом сидений

```text
seat 0 занят новым человеком
остальные смещаются вправо
```

### 26. Аналогия с конвейером

```text
первый item уходит
следующий item становится первым
```

### 27. Полная модель unshift

```text
Array
│
▼
Нужно добавить новый первый элемент
│
▼
unshift(value)
│
▼
value становится index 0
│
▼
существующие elements смещаются вправо
│
▼
array теперь содержит на один element больше
│
▼
length увеличивается
```

### 28. Полная модель shift

```text
Array
│
▼
Нужно удалить первый элемент
│
▼
shift()
│
▼
value at index 0 удалено
│
▼
оставшиеся elements смещаются влево
│
▼
array теперь содержит на один element меньше
│
▼
length уменьшается
│
└── удаленное value возвращается
```

### 29. Жизненный цикл element в начале

```text
не в array
│
unshift
▼
index 0
│
shift
▼
удален
```

### 30. Первый элемент

```text
index 0
│
▼
начало
```

### 31. Поток unshift

```text
подготовить index 0
│
сместить elements вправо
│
сохранить новое value
```

### 32. Поток shift

```text
прочитать index 0
│
удалить первый элемент
│
сместить elements влево
│
вернуть value
```

### 33. Timeline length

```text
2 -> unshift -> 3 -> shift -> 2
```

### 34. Напоминание про ordered collection

```text
порядок важен
│
начало меняет позиции
```

### 35. Переход к splice()

```text
сейчас начало
│
дальше середина
```

### 36. Переход к iteration

```text
arrays с большим количеством elements
│
позже: повторение по ним
```

### 37. Пример QA framework

```text
tasks.unshift(setup)
tasks.shift()
```

### 38. Итоговая схема

```text
Array
│
├── push/pop
│   └── изменить конец
│
└── shift/unshift
    ├── изменить начало
    ├── сместить существующие indexes
    └── обновить length вслед за количеством elements
```

---

## Итоги

Предыдущие главы построили такую модель:

```text
Arrays
│
▼
ordered collection
│
▼
indexes
│
▼
length
```

Затем:

```text
push/pop
│
▼
изменить конец
```

Эта глава добавила:

```text
shift/unshift
│
▼
изменить начало
```

`unshift()`:

```text
Нужно добавить новый первый элемент
│
▼
unshift()
│
▼
новый index 0
│
▼
старые elements смещаются вправо
│
▼
array теперь содержит на один element больше
│
▼
length увеличивается
```

`shift()`:

```text
Нужно удалить первый элемент
│
▼
shift()
│
▼
первый элемент удален
│
▼
старые elements смещаются влево
│
▼
array теперь содержит на один element меньше
│
▼
length уменьшается
│
└── удаленное value возвращается
```

Следующая глава объяснит `splice()`: изменение arrays в середине.

---

## Что нужно запомнить

✓ `unshift()` добавляет value в начало array.

✓ `unshift()` изменяет существующий array.

✓ После `unshift()` существующие indexes смещаются вправо.

✓ После `unshift()` array содержит на один element больше, поэтому `length` увеличивается.

✓ `shift()` удаляет первый элемент.

✓ `shift()` изменяет существующий array.

✓ `shift()` возвращает удаленный первый элемент.

✓ После `shift()` существующие indexes смещаются влево.

✓ После `shift()` array содержит на один element меньше, поэтому `length` уменьшается.

✓ `shift()` не то же самое, что `pop()`.

✓ `unshift()` не то же самое, что `push()`.

✓ `splice()` объяснит изменения в середине.

---

## Проверьте себя

1. Какую проблему решает `unshift()`?

2. Какую проблему решает `shift()`?

3. Что такое начало array?

4. Что происходит с существующими indexes после `unshift()`?

5. Что происходит с существующими indexes после `shift()`?

6. Что возвращает `shift()`?

7. Почему `length` увеличивается после `unshift()`?

8. Почему `length` уменьшается после `shift()`?

9. Почему `shift()` не то же самое, что `pop()`?

10. Чем `unshift()` полезен для срочных QA tasks?

---

## Практика

Практические задания находятся в отдельном файле:

```text
practice/01-javascript/46-shift-unshift.md
```

---

## Решения

Решения находятся в отдельном файле:

```text
solutions/01-javascript/46-shift-unshift.md
```

Сначала выполните практику самостоятельно. Затем сравните объяснение, а не только финальный ответ.
