# find()

## Связь с предыдущим модулем

Предыдущий модуль показал processing pipeline:

```text
test cases
│
▼
transform / select / aggregate
│
▼
report data
```

Теперь задача меняется. Иногда pipeline не должен строить новый список или summary. Иногда нужно найти один конкретный test case и принять решение по нему.

## Главный вопрос

> Как найти один element в array?

Ответ этой главы: использовать `find()`.

## Предварительные требования

Для этой главы нужно понимать:

* что array хранит ordered elements;
* что callback может проверять condition;
* что test case object может иметь поля `id`, `title`, `status`, `priority`;
* что `filter()` возвращает subset array.

Не требуется заново изучать `map()`, `filter()` или `reduce()`. В этой главе фокус только на поиске одного element.

## Цели обучения

После главы вы будете понимать:

* зачем существует `find()`;
* как `find()` проверяет elements;
* что возвращает `find()`;
* что происходит, если совпадение не найдено;
* почему `find()` отличается от `filter()`;
* как применять `find()` в CI validation.

## Мотивация

Есть test case catalog:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
];
```

CI получил failure для `T-2`. Нужно найти именно этот test case, чтобы показать его title и priority.

Нужна операция:

```text
array
│
▼
check elements one by one
│
▼
return first matching element
```

## Теория

`find()` проходит по array и возвращает первый element, для которого callback вернул `true`.

Общая форма:

```javascript
const found = array.find(function (element) {
  return condition;
});
```

Если совпадение найдено, result — сам element.

Если совпадение не найдено, result — `undefined`.

## Внутренний механизм

Концептуальные шаги:

```text
start with first element
│
▼
check condition
│
├── true  -> return this element
└── false -> move to next element
```

Как только `find()` нашел первый matching element, дальнейшие elements уже не нужны для ответа.

## Главная ментальная модель

Главная модель этой главы: **first matching element**.

```text
testCases
│
▼
find()
│
▼
first match
```

`find()` отвечает на вопрос: "Где первый element, который подходит?"

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-55/
```

Запуск:

```bash
node examples/01-javascript/chapter-55/01-find-by-id.js
node examples/01-javascript/chapter-55/02-find-failed.js
node examples/01-javascript/chapter-55/03-find-missing.js
node examples/01-javascript/chapter-55/04-find-high-priority.js
node examples/01-javascript/chapter-55/05-qa-gate.js
```

## Примеры Automation QA

Найти failed test для отчета:

```javascript
const failedTest = testCases.find(function (testCase) {
  return testCase.status === 'failed';
});
```

Найти test by id:

```javascript
const targetTest = testCases.find(function (testCase) {
  return testCase.id === 'T-2';
});
```

Такой код хорошо подходит для validation steps, где нужен один known test case.

## Распространённые ошибки

### Ошибка 1. Ожидать array

`find()` возвращает один element или `undefined`, а не array.

### Ошибка 2. Не проверять `undefined`

Если element не найден, попытка читать property может привести к runtime error.

### Ошибка 3. Использовать `find()` там, где нужны все совпадения

Если нужны все matching elements, это другая задача.

## Краткие итоги

`find()` нужен, когда нужно найти один element.

Он:

* проверяет elements по condition;
* возвращает первый matching element;
* возвращает `undefined`, если ничего не найдено;
* хорошо подходит для поиска test case by id или первого failed test.

## Переход к следующей главе

Теперь мы умеем найти один matching test case.

Следующий вопрос:

> Как проверить, есть ли хотя бы один matching test case?

Эта задача ведет к `some()`.

Практика:

```text
practice/01-javascript/55-find.md
```

Решения:

```text
solutions/01-javascript/55-find.md
```
