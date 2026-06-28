# Generators

## Связь с предыдущей главой

Предыдущая глава показала iterator:

```mermaid
flowchart TD
    N1["next()"]
    N2["{ value, done }"]
    N1 --> N2
```

Такой механизм точный, но ручное создание iterator быстро становится многословным.

## Главный вопрос

> Почему появились генераторы?

Короткий ответ: генератор автоматически создает iterator и позволяет выдавать значения через `yield`.

## Мотивация

Если нужно выдавать тесты по одному, ручной iterator требует хранить индекс и возвращать `{ value, done }`:

```mermaid
flowchart TD
    N1["индекс"]
    N2["next()"]
    N3["вернуть value/done"]
    N1 --> N2
    N2 --> N3
```

Генератор позволяет записать ту же идею как последовательность выдачи:

```javascript
function* testCaseGenerator() {
  yield 'login';
  yield 'checkout';
  yield 'report';
}
```

Код читается как список значений, которые будут выданы по одному.

## Теория

Функция-генератор объявляется через `function*`.

```javascript
function* createReportEntries() {
  yield 'logs';
  yield 'screenshot';
}
```

Вызов функции-генератора не выполняет тело сразу. Он возвращает объект-генератор (generator object).

Этот объект является iterator:

```javascript
const entries = createReportEntries();

console.log(entries.next());
```

Генератор не заменяет Iterator Protocol. Он автоматически реализует его: снаружи мы все равно работаем с iterator-механизмом из предыдущей главы.

`yield` останавливает выполнение функции-генератора и отдает значение наружу.

```mermaid
flowchart TD
    N1["yield value"]
    N2["next() получает value"]
    N3["генератор ждет следующего next()"]
    N1 --> N2
    N2 --> N3
```

## Внутренний механизм

Генератор хранит позицию между вызовами `next()`.

```mermaid
flowchart TD
    N1["next()"]
    N2["выполнять до первого yield"]
    N3["вернуть значение"]
    N4["пауза"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Следующий `next()` продолжает с места остановки:

```mermaid
flowchart TD
    N1["next() #1 → yield 'login'"]
    N2["next() #2 → yield 'checkout'"]
    N3["next() #3 → yield 'report'"]
    N4["next() #4 → done: true"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Поэтому генератор остается связан с той же моделью `next()`, `value` и `done`.

## Главная ментальная модель

Главная модель главы:

```mermaid
flowchart TD
    N1["генератор"]
    N2["автоматически строит iterator"]
    N3["yield выдает значения по одному"]
    N1 --> N2
    N2 --> N3
```

Генератор похож на сценарий тестового отчета: каждая строка `yield` говорит, какой следующий элемент можно выдать.

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-83/
```

Запуск:

```bash
node examples/01-javascript/chapter-83/01-first-generator.js
node examples/01-javascript/chapter-83/02-yield-sequence.js
node examples/01-javascript/chapter-83/03-generator-for-of.js
node examples/01-javascript/chapter-83/04-qa-generator.js
```

## Пример Automation QA

Генератор удобно использовать, когда отчетные записи нужно выдавать последовательно:

```javascript
function* reportEntries() {
  yield 'collect logs';
  yield 'capture screenshot';
  yield 'upload report';
}

for (const entry of reportEntries()) {
  console.log(entry);
}
```

Фреймворк получает значения по одному, а код генерации остается читаемым.

## Распространённые ошибки

### Ошибка 1. Думать, что вызов функции-генератора сразу выполняет тело

Вызов возвращает генератор. Выполнение начинается при `next()` или `for...of`.

### Ошибка 2. Путать `return` и `yield`

`yield` выдает очередное значение и оставляет генератор продолжимым. `return` завершает его.

### Ошибка 3. Считать генератор асинхронным механизмом

Обычные генераторы из этой главы синхронны. Асинхронные генераторы будут отдельной темой позже.

## Практика

Практика находится в:

```text
practice/01-javascript/83-generators.md
```

Решения находятся в:

```text
solutions/01-javascript/83-generators.md
```

## Краткие итоги

Генератор упрощает создание iterator.

Главное:

* `function*` создает функцию-генератор;
* вызов функции-генератора возвращает генератор;
* `yield` выдает значение наружу;
* генератор можно обходить через `for...of`;
* генераторы помогают писать итерацию без ручного `next()`.

## Переход к следующей главе

Теперь мы знаем:

```mermaid
flowchart TD
    N1["Iterable"]
    N2["Iterator"]
    N3["Generator"]
    N1 --> N2
    N2 --> N3
```

Следующий вопрос:

> Как сделать собственный объект iterable?

Ответ — реализовать `Symbol.iterator`.
