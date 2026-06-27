# Решения: shift() and unshift()

## 1. Концептуальные вопросы

### 1. Зачем существует `unshift()`?

Ответ:

`unshift()` существует, чтобы добавлять новый element в начало array.

Объяснение:

Иногда новое value должно стать первым: срочный request, приоритетная failure, setup step.

Распространённая ошибка:

Думать, что `unshift()` добавляет в конец. Для этого есть `push()`.

Связь с Automation QA:

Срочный login request можно поставить перед обычными API requests.

### 2. Зачем существует `shift()`?

Ответ:

`shift()` существует, чтобы удалить и вернуть первый элемент.

Объяснение:

Программе может понадобиться взять первую task и обработать ее.

Распространённая ошибка:

Думать, что `shift()` возвращает измененный array.

Связь с Automation QA:

Тестовый фреймворк может взять первый collected request для выполнения.

### 3. Что такое начало array?

Ответ:

Начало — это index `0`.

Объяснение:

Arrays являются ordered collections, и первая позиция имеет index `0`.

Распространённая ошибка:

Думать, что первая позиция имеет index `1`.

Связь с Automation QA:

Первый API response или первый test step хранится at index `0`.

### 4. Что возвращает `shift()`?

Ответ:

`shift()` возвращает удаленный первый элемент.

Объяснение:

Он удаляет value at index `0` и передает это value вызывающему коду.

Распространённая ошибка:

Ожидать обновленный array как возвращаемое значение.

Связь с Automation QA:

`const nextRequest = requests.shift()` сохраняет request, который должен выполниться сейчас.

### 5. Почему `shift()` не то же самое, что `pop()`?

Ответ:

`shift()` удаляет первый элемент. `pop()` удаляет последний элемент.

Объяснение:

Они изменяют разные концы ordered collection.

Распространённая ошибка:

Использовать `pop()`, когда коду нужна первая task.

Связь с Automation QA:

Обработка самой новой collected failure и обработка первой priority failure — разные операции.

### 6. Почему `unshift()` меняет indexes существующих elements?

Ответ:

Потому что новый element становится index `0`, а старые elements должны сместиться вправо.

Объяснение:

Array хранит одно value на каждой упорядоченной позиции. Если новое value занимает начало, предыдущие values получают новые indexes.

Распространённая ошибка:

Ожидать, что старый первый элемент останется at index `0`.

Связь с Automation QA:

После добавления срочного setup step в начало предыдущий first test step становится вторым.

### 7. Почему `length` увеличивается после `unshift()`?

Ответ:

Потому что array теперь содержит на один element больше.

Объяснение:

`length` отражает количество elements. Он увеличивается как следствие добавления element.

Распространённая ошибка:

Думать, что `length` меняется независимо от количества elements.

Связь с Automation QA:

Добавление одной срочной task увеличивает общее количество tasks.

### 8. Почему `length` уменьшается после `shift()`?

Ответ:

Потому что array теперь содержит на один element меньше.

Объяснение:

`shift()` удаляет первый элемент, поэтому в collection становится меньше values.

Распространённая ошибка:

Думать, что удаленное value все еще принадлежит array.

Связь с Automation QA:

После взятия first request для выполнения количество оставшихся requests становится меньше.

---

## 2. Чтение кода

Ответ:

```text
requestTasks[0] -> POST /login
requestTasks[1] -> GET /users
length          -> 3
```

Объяснение:

`unshift('POST /login')` вставляет новое значение at index `0`. Существующие элементы смещаются вправо.

Распространённая ошибка:

Ожидать, что `"GET /users"` останется at index `0`.

Связь с Automation QA:

Login становится первым, потому что он должен выполниться перед protected requests.

---

## 3. Предскажите вывод перед запуском

Ответ:

```text
setup
test
2
```

Объяснение:

`shift()` удаляет и возвращает `"setup"`. Оставшиеся elements смещаются влево, поэтому `"test"` становится index `0`. Теперь в array два elements.

Распространённая ошибка:

Ожидать, что `tasks[0]` будет `"setup"` после `shift()`.

Связь с Automation QA:

После обработки первого test step следующий step становится первым.

---

## 4. Определите length

Ответ:

```text
начальная length:        0
после первого unshift:   1
после второго unshift:  2
после shift:           1
```

Объяснение:

Каждый `unshift()` добавляет один element. `shift()` удаляет один element.

Распространённая ошибка:

Считать вызовы методов вместо текущих elements.

Связь с Automation QA:

Размер failure list отражает, сколько failures остается в collection.

---

## 5. Определите изменения indexes

Ответ:

```text
Login:  0
Home:   1
Users:  2
Orders: 3
```

Объяснение:

`Login` становится новым первый элемент. Существующие values смещаются на одну позицию вправо.

Распространённая ошибка:

Оставлять `Home` at index `0`.

Связь с Automation QA:

Если новая active tab вставлена первой, старая first tab становится второй в этой модели.

---

## 6. Предскажите вывод: shift vs pop

Ответ:

```text
POST /login
GET /orders
[ 'GET /users' ]
```

Объяснение:

`shift()` удаляет первый элемент: `"POST /login"`.

После этого array:

```text
[ 'GET /users', 'GET /orders' ]
```

`pop()` удаляет последний элемент: `"GET /orders"`.

Оставшийся array:

```text
[ 'GET /users' ]
```

Распространённая ошибка:

Предполагать, что оба метода удаляют с одного и того же конца.

Связь с Automation QA:

First request и last request обычно имеют разный смысл в test flow.

---

## 7. Задача на отладку

Правильный код:

```javascript
const requestTasks = ['POST /login', 'GET /users', 'GET /orders'];

const nextTask = requestTasks.shift();

console.log(nextTask);
```

Ответ:

Используйте `shift()` вместо `pop()`.

Объяснение:

Коду нужна first task. `pop()` удаляет last task. `shift()` удаляет first task.

Распространённая ошибка:

Выбирать метод по идее «что-то удалить», а не по правильному концу array.

Связь с Automation QA:

Request processor должен взять следующий request, а не случайно последний request.

---

## 8. Задача на отладку: неверное предположение об индексе

Ответ:

Предположение неверно, потому что `unshift()` вставляет новый element at index `0`.

Правильный код:

```javascript
const requestTasks = ['GET /users', 'GET /orders'];

requestTasks.unshift('POST /login');

console.log(requestTasks[1]);
```

Объяснение:

`"GET /users"` был at index `0`. После добавления `"POST /login"` в начало он смещается на index `1`.

Распространённая ошибка:

Забывать, что операции в начале смещают существующие indexes.

Связь с Automation QA:

После вставки setup request в начало старый first request больше не первый.

---

## 9. Небольшая задача на код

Решение:

```javascript
const testSteps = ['open page', 'click submit', 'check result'];

testSteps.unshift('login');

console.log(testSteps);
console.log(testSteps[0]);
console.log(testSteps.length);
```

Ответ:

```text
[ 'login', 'open page', 'click submit', 'check result' ]
login
4
```

Объяснение:

`unshift()` добавляет `"login"` в начало. Существующие steps смещаются вправо. Теперь array содержит четыре elements.

Распространённая ошибка:

Использовать `push()` и добавить login в конец.

Связь с Automation QA:

Login часто должен выполняться перед page actions и assertions.

---

## 10. QA-задача: срочный request

Решение:

```javascript
const requests = ['GET /profile', 'GET /orders'];

requests.unshift('POST /auth/login');

const requestToExecute = requests.shift();

console.log(requestToExecute);
console.log(requests);
```

Ответ:

```text
POST /auth/login
[ 'GET /profile', 'GET /orders' ]
```

Объяснение:

`unshift()` делает login первым. `shift()` удаляет и возвращает first request.

Распространённая ошибка:

Использовать `pop()` после `unshift()` и случайно взять last request.

Связь с Automation QA:

Authentication request часто должен выполняться перед profile и order requests.

---

## 11. QA-задача: prioritized failures

Решение:

```javascript
const failures = ['button text mismatch', 'missing footer'];

failures.unshift('login failed');

const mostImportantFailure = failures.shift();

console.log(mostImportantFailure);
console.log(failures);
```

Ответ:

```text
login failed
[ 'button text mismatch', 'missing footer' ]
```

Объяснение:

`login failed` становится первым. `shift()` удаляет и возвращает его.

Распространённая ошибка:

Ожидать, что `shift()` вернет все failures.

Связь с Automation QA:

High-priority failures можно вывести в отчет перед lower-priority UI mismatches.

---

## 12. Мини-проект

Решение:

```javascript
const requestTasks = ['GET /users', 'GET /orders'];

requestTasks.unshift('POST /login');

const firstExecutedRequest = requestTasks.shift();

requestTasks.unshift('GET /health');

const secondExecutedRequest = requestTasks.shift();

console.log(firstExecutedRequest);
console.log(secondExecutedRequest);
console.log(requestTasks);
console.log(requestTasks.length);
```

Ответ:

```text
POST /login
GET /health
[ 'GET /users', 'GET /orders' ]
2
```

Объяснение:

Сначала `POST /login` добавляется в начало, а затем удаляется через `shift()`.

Затем `GET /health` добавляется в начало и удаляется через `shift()`.

Исходные requests остаются:

```text
GET /users
GET /orders
```

Распространённая ошибка:

Думать, что `shift()` удаляет все tasks или что `unshift()` создает отдельный новый array.

Связь с Automation QA:

Это похоже на простой task processor: срочные setup checks можно вставить перед обычными API checks, а processor берет первую task.

Возможные улучшения:

Перед вызовом `shift()` реальный код может проверить, пустой ли array.
