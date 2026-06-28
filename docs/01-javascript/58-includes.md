# includes()

## Связь с предыдущей главой

Предыдущая глава объяснила `every()`: строгую проверку всех objects по condition.

Теперь задача проще. Иногда нужно проверить наличие простого value в array: status, priority, tag, id из заранее подготовленного списка.

## Главный вопрос

> Как проверить, что value существует в array?

Ответ этой главы: использовать `includes()`.

## Предварительные требования

Для этой главы нужно понимать:

* что arrays могут хранить primitive значения;
* что для simple значения callback не всегда нужен;
* что status и priority могут храниться отдельными lists.

Не требуется изучать object search заново. Для objects с condition обычно используются methods из предыдущих глав.

## Цели обучения

После главы вы будете понимать:

* зачем существует `includes()`;
* как он проверяет presence value;
* что возвращает `includes()`;
* почему он особенно удобен для simple arrays;
* чем он отличается от `find()` и `some()`;
* как применять его в QA validation rules.

## Мотивация

Есть разрешенные statuses:

```javascript
const allowedStatuses = ['passed', 'failed', 'skipped'];
```

И есть test case:

```javascript
const testCase = {
  id: 'T-2',
  title: 'create order',
  status: 'failed',
  priority: 'high',
};
```

Нужно проверить: входит ли `testCase.status` в список разрешенных значения?

```text
allowedStatuses
│
▼
includes('failed')
│
▼
true
```

## Теория

`includes()` — самый простой method в этом модуле: он проверяет presence value в array.

Общая форма:

```javascript
const exists = array.includes(value);
```

Result — Boolean. Callback не нужен.

## Внутренний механизм

Концептуальные шаги:

```text
take value
│
▼
compare with array elements
│
├── found     -> true
└── not found -> false
```

Для arrays со strings, numbers и booleans это читается как прямой presence check.

## Главная ментальная модель

Главная модель этой главы: **value exists in array**.

```text
simple values array
│
▼
includes(value)
│
▼
true / false
```

Вопрос: "Есть ли это value в списке?"

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-58/
```

Запуск:

```bash
node examples/01-javascript/chapter-58/01-status-includes.js
node examples/01-javascript/chapter-58/02-priority-includes.js
node examples/01-javascript/chapter-58/03-id-list.js
node examples/01-javascript/chapter-58/04-includes-vs-find.js
node examples/01-javascript/chapter-58/05-qa-gate.js
```

## Примеры Automation QA

Validate status:

```javascript
const allowedStatuses = ['passed', 'failed', 'skipped'];
const isValidStatus = allowedStatuses.includes(testCase.status);
```

Validate priority:

```javascript
const allowedPriorities = ['high', 'medium', 'low'];
const isValidPriority = allowedPriorities.includes(testCase.priority);
```

Такой код хорошо подходит для validation rules, где есть fixed list of allowed значения.

## Распространённые ошибки

### Ошибка 1. Использовать callback

`includes()` не принимает callback.

### Ошибка 2. Искать object by condition

Для object conditions нужен другой method. `includes()` проверяет presence конкретного value.

### Ошибка 3. Путать allowed значения и actual значения

Проверяйте actual value against allowed list, а не наоборот.

## Краткие итоги

`includes()` проверяет presence value в simple array.

Главное: используйте его для allowed statuses, priorities и tag lists, где нужно проверить конкретное value.

## Переход к следующей главе

Теперь decision-layer module выглядит так:

```text
find()     -> найти один element
some()     -> проверить хотя бы один match
every()    -> проверить все elements
includes() -> проверить наличие simple value
```

Дальше раздел Arrays продолжит разбирать методы, которые помогают упорядочивать и сравнивать данные.

Практика:

```text
practice/01-javascript/58-includes.md
```

Решения:

```text
solutions/01-javascript/58-includes.md
```
