# slice()

## Связь с предыдущей главой

Предыдущая глава объяснила `splice()`.

Главная модель была такой:

```mermaid
flowchart TD
    N1["Array"]
    N2["середина"]
    N3["splice()"]
    N4["исходный array изменен"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Но не каждая операция со списком test cases должна менять исходный список.

Иногда нужно получить snapshot: часть regression plan для отдельного запуска, полный copy списка перед изменением или первые несколько smoke tests для быстрого pipeline.

## Главный вопрос

> Как получить копию массива или его части?

Ответ этой главы: использовать `slice()`.

## Предварительные требования

Для этой главы нужно понимать:

* что array хранит ordered elements;
* что indexes начинаются с `0`;
* что `splice()` изменяет исходный array;
* что Automation QA часто хранит test cases в порядке выполнения.

Не требуется знать immutable operations, deep copy, `map()`, `filter()`, `reduce()` или sorting. Эти темы будут изучаться позже.

## Цели обучения

После главы вы будете понимать:

* зачем существует `slice()`;
* как получить копию всего array;
* как получить часть array;
* что исходный array не изменяется;
* как работают `startIndex` и `endIndex`;
* почему `endIndex` не включается;
* чем `slice()` отличается от `splice()`;
* как snapshots используются в Automation QA.

## Мотивация

Продолжим scenario test automation framework.

Есть список test cases:

```javascript
const testCases = [
  'login smoke',
  'create order',
  'apply discount',
  'pay order',
  'logout smoke'
];
```

Нужно запустить только первые два smoke-related tests:

```mermaid
flowchart TD
    N1["index 0 → login smoke"]
    N2["index 1 → создать order"]
    N1 --> N2
```

Но исходный regression plan должен остаться целым.

Нужна операция:

```mermaid
flowchart TD
    N1["Array"]
    N2["выбрать диапазон"]
    N3["slice()"]
    N4["new array copy"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

## Теория

`slice()` возвращает copy части array.

Общая форма:

```javascript
array.slice(startIndex, endIndex);
```

Смысл:

```mermaid
flowchart TD
    N1["startIndex"]
    N2["с какой позиции начать copy"]
    N3["endIndex"]
    N4["перед какой позицией остановиться"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

`endIndex` не включается.

```javascript
const smokeTests = testCases.slice(0, 2);
```

Результат:

```mermaid
flowchart TD
    N1["index 0 → login smoke"]
    N2["index 1 → создать order"]
    N1 --> N2
```

Исходный `testCases` остается без изменений.

## Внутренний механизм

Когда engine выполняет:

```javascript
const smokeTests = testCases.slice(0, 2);
```

он делает conceptual steps:

```mermaid
flowchart TD
    N1["Array"]
    N2["прочитать startIndex 0"]
    N3["прочитать elements до index 2"]
    N4["создать new array"]
    N5["поместить copied elements"]
    N6["вернуть new array"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
```

Исходный array:

```mermaid
flowchart TD
    N1["testCases"]
    N2["login smoke"]
    N3["создать order"]
    N4["apply discount"]
    N5["pay order"]
    N6["logout smoke"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N1 --> N5
    N1 --> N6
```

Новый array:

```mermaid
flowchart TD
    N1["smokeTests"]
    N2["login smoke"]
    N3["создать order"]
    N1 --> N2
    N1 --> N3
```

## Главная ментальная модель

Главная модель этой главы: **copying**.

```mermaid
flowchart TD
    N1["Array"]
    N2["slice()"]
    N3["copy selected elements"]
    N4["new array"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

`slice()` не изменяет исходный array.

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-48/
```

Запуск:

```bash
node examples/01-javascript/chapter-48/01-copy-all.js
node examples/01-javascript/chapter-48/02-copy-range.js
node examples/01-javascript/chapter-48/03-end-index.js
node examples/01-javascript/chapter-48/04-splice-vs-slice.js
node examples/01-javascript/chapter-48/05-qa-snapshot.js
```

## Примеры Automation QA

Snapshot regression plan:

```javascript
const snapshot = testCases.slice();
```

Subset for smoke pipeline:

```javascript
const smokePlan = testCases.slice(0, 2);
```

Subset for payment-related поток:

```javascript
const paymentFlow = testCases.slice(2, 4);
```

В каждом случае исходный `testCases` остается тем же.

## Распространённые ошибки

### Ошибка 1. Ожидать изменение исходного array

`slice()` не удаляет и не вставляет elements.

```mermaid
flowchart TD
    N1["slice()"]
    N2["copy"]
    N3["source unchanged"]
    N1 --> N2
    N2 --> N3
```

### Ошибка 2. Думать, что `endIndex` включается

```javascript
testCases.slice(0, 2);
```

Берет indexes `0` и `1`, но не `2`.

### Ошибка 3. Путать `slice()` и `splice()`

```mermaid
flowchart TD
    N1["slice()"]
    N2["copy"]
    N3["splice()"]
    N4["modify"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

## Краткие итоги

`slice()` нужен, когда нужно получить copy array или его части.

Он:

* возвращает new array;
* не изменяет исходный массив;
* берет elements от `startIndex` до `endIndex`;
* не включает `endIndex`.

## Переход к следующей главе

Теперь мы умеем получать snapshot списка test cases.

Следующий вопрос:

> Как пройти по каждому test case в списке?

Эта задача ведет к iteration.

Практика:

```text
practice/01-javascript/48-slice.md
```

Решения:

```text
solutions/01-javascript/48-slice.md
```
