# sort()

## Связь с предыдущим модулем

Предыдущий модуль завершил decision layer:

```text
find()
some()
every()
includes()
```

Мы научились находить test cases и принимать Boolean decisions.

Теперь появляется другая задача: CI report уже содержит нужные test cases, но порядок неудобен. Failed tests могут быть в середине, high priority tests — в конце, а ids — перемешаны.

## Главный вопрос

> Как упорядочить elements в array?

Ответ этой главы: использовать `sort()`.

## Предварительные требования

Для этой главы нужно понимать:

* что array хранит ordered elements;
* что порядок elements влияет на чтение отчета;
* что test case object имеет поля `id`, `title`, `status`, `priority`;
* что array methods могут изменять исходный array.

Не требуется знать внутреннее устройство сортировки. В этой главе важна модель: ordering by rule.

## Цели обучения

После главы вы будете понимать:

* зачем существует `sort()`;
* что `sort()` упорядочивает elements по rule;
* как `sort()` влияет на current array;
* почему сортировка по умолчанию is string-based;
* зачем нужна функция сравнения;
* как применять `sort()` для приоритизации отчета.

## Мотивация

Есть test execution result:

```javascript
const testCases = [
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];
```

Для анализа такой порядок неудобен. Обычно хочется видеть high priority tests выше, failed tests раньше или ids по порядку.

Нужна операция:

```text
unordered test cases
│
▼
sort()
│
▼
ordered test cases
```

## Теория

`sort()` упорядочивает elements внутри array по заданному правилу.

Общая форма:

```javascript
array.sort(compareFunction);
```

Важное поведение: `sort()` mutates исходный массив.

```text
sort()
│
▼
same array, ordered elements
```

Если вызвать `sort()` без функции сравнения, JavaScript сортирует значения как строки. Для objects почти всегда нужно явно описывать порядок через функцию сравнения.

Пример сортировки ids:

```javascript
testCases.sort(function (firstTest, secondTest) {
  return firstTest.id.localeCompare(secondTest.id);
});
```

## Внутренний механизм

Для этой главы не важен конкретный algorithm. Достаточно observable model:

```text
source array
│
▼
compare elements
│
▼
reorder by rule
│
▼
same array, new order
```

Compare function говорит JavaScript, какой element должен идти раньше.

```text
negative number -> first before second
positive number -> second before first
0               -> order is equal for this comparison
```

Этого достаточно для практической работы с отчетами.

## Главная ментальная модель

Главная модель этой главы: **ordering elements**.

```text
same elements
│
▼
sort()
│
▼
different order
```

Главное: `sort()` не выбирает и не преобразует test cases. Он меняет порядок.

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-59/
```

Запуск:

```bash
node examples/01-javascript/chapter-59/01-sort-by-id.js
node examples/01-javascript/chapter-59/02-sort-by-priority.js
node examples/01-javascript/chapter-59/03-sort-by-status.js
node examples/01-javascript/chapter-59/04-sort-mutates.js
node examples/01-javascript/chapter-59/05-default-sort.js
```

## Примеры Automation QA

Sort by priority:

```javascript
const priorityOrder = { high: 1, medium: 2, low: 3 };

testCases.sort(function (firstTest, secondTest) {
  return priorityOrder[firstTest.priority] - priorityOrder[secondTest.priority];
});
```

Sort by id:

```javascript
testCases.sort(function (firstTest, secondTest) {
  return firstTest.id.localeCompare(secondTest.id);
});
```

Это полезно для приоритизации: сначала важные tests, затем менее важные.

## Распространённые ошибки

### Ошибка 1. Ожидать новый array

`sort()` меняет current array. Если нужен исходный порядок, его нужно сохранить отдельно.

### Ошибка 2. Полагаться на сортировка по умолчанию для объектов

Для test case objects нужна функция сравнения.

### Ошибка 3. Делать функцию сравнения нечитаемой

Если порядок важен для CI, лучше явно назвать priority order или status order.

## Краткие итоги

`sort()` упорядочивает elements внутри array.

Важно запомнить:

* `sort()` задает order по rule;
* сортировка по умолчанию is string-based;
* для объектов обычно нужна функция сравнения;
* sorting порядок должен быть понятен из кода.

## Переход к следующей главе

Теперь мы умеем задавать порядок.

Следующий вопрос:

> Как быстро инвертировать текущий порядок array?

Эта задача ведет к `reverse()`.

Практика:

```text
practice/01-javascript/59-sort.md
```

Решения:

```text
solutions/01-javascript/59-sort.md
```
