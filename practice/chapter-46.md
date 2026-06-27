# Практика: shift() and unshift()

## Цель практики

Закрепить модель:

```text
push/pop
│
└── изменяют конец

shift/unshift
│
└── изменяют начало
```

Особое внимание:

```text
unshift()
│
├── добавляет новый первый элемент
└── смещает существующие indexes вправо

shift()
│
├── удаляет первый элемент
├── возвращает удаленное value
└── смещает оставшиеся indexes влево
```

---

## 1. Концептуальные вопросы

Ответьте своими словами.

1. Зачем существует `unshift()`?

2. Зачем существует `shift()`?

3. Что такое начало array?

4. Что возвращает `shift()`?

5. Почему `shift()` не то же самое, что `pop()`?

6. Почему `unshift()` меняет indexes существующих elements?

7. Почему `length` увеличивается после `unshift()`?

8. Почему `length` уменьшается после `shift()`?

---

## 2. Чтение кода

Прочитайте код.

```javascript
const requestTasks = ['GET /users', 'GET /orders'];

requestTasks.unshift('POST /login');

console.log(requestTasks[0]);
console.log(requestTasks[1]);
console.log(requestTasks.length);
```

Ответьте:

1. Что хранится at index `0` после `unshift()`?

2. Что произошло с `"GET /users"`?

3. Чему равен `requestTasks.length`?

---

## 3. Предскажите вывод перед запуском

Сначала предскажите результат без запуска.

```javascript
const tasks = ['setup', 'test', 'assert'];

const firstTask = tasks.shift();

console.log(firstTask);
console.log(tasks[0]);
console.log(tasks.length);
```

Запишите:

1. Первый вывод.

2. Второй вывод.

3. Третий вывод.

---

## 4. Определите length

Для каждого шага укажите `length`.

```javascript
const failures = [];

failures.unshift('missing title');
failures.unshift('login failed');
failures.shift();
```

Заполните:

```text
начальная length:
после первого unshift:
после второго unshift:
после shift:
```

---

## 5. Определите изменения indexes

Есть array:

```javascript
const tabs = ['Home', 'Users', 'Orders'];
```

После выполнения:

```javascript
tabs.unshift('Login');
```

Укажите новые indexes:

```text
Login:
Home:
Users:
Orders:
```

---

## 6. Предскажите вывод: shift vs pop

Сначала предскажите результат без запуска.

```javascript
const requests = ['POST /login', 'GET /users', 'GET /orders'];

const first = requests.shift();
const last = requests.pop();

console.log(first);
console.log(last);
console.log(requests);
```

Запишите вывод и финальный array.

---

## 7. Задача на отладку

Код должен взять first task.

Сейчас он берет неправильную task.

```javascript
const requestTasks = ['POST /login', 'GET /users', 'GET /orders'];

const nextTask = requestTasks.pop();

console.log(nextTask);
```

Исправьте код и объясните, почему исправление работает.

---

## 8. Задача на отладку: неверное предположение об индексе

Код ожидает, что после `unshift()` старая first task все еще остается at index `0`.

```javascript
const requestTasks = ['GET /users', 'GET /orders'];

requestTasks.unshift('POST /login');

console.log(requestTasks[0]);
```

Объясните, почему предположение неверно.

Затем выведите старую first task корректно.

---

## 9. Небольшая задача на код

Создайте array `testSteps`:

```text
open page
click submit
check result
```

Затем добавьте step `"login"` в начало.

Выведите:

1. Весь array.

2. Первый step.

3. Length.

---

## 10. QA-задача: срочный request

Есть requests:

```javascript
const requests = ['GET /profile', 'GET /orders'];
```

Добавьте срочный request:

```text
POST /auth/login
```

Так, чтобы он стал first request.

Затем получите first request для выполнения.

Выведите:

1. Request для выполнения.

2. Оставшиеся requests.

---

## 11. QA-задача: prioritized failures

Есть failures:

```javascript
const failures = ['button text mismatch', 'missing footer'];
```

Добавьте `"login failed"` в начало.

Затем удалите first failure и сохраните ее в `mostImportantFailure`.

Выведите:

1. `mostImportantFailure`.

2. Оставшиеся failures.

---

## 12. Мини-проект

Создайте небольшой request task processor.

Требования:

1. Создайте array `requestTasks` со значениями:

```text
GET /users
GET /orders
```

2. Добавьте срочный setup request в начало:

```text
POST /login
```

3. Возьмите first request для выполнения.

4. Добавьте еще один срочный request в начало:

```text
GET /health
```

5. Снова возьмите first request для выполнения.

6. Выведите:

```text
первый выполненный request
второй выполненный request
оставшиеся tasks
оставшаяся length
```

Перед запуском предскажите:

1. Какой request выполнится первым?

2. Какой request выполнится вторым?

3. Что останется в array?
