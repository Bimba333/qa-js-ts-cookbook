# Macrotasks

## Связь с предыдущей главой

Предыдущая глава объяснила Microtспрашивает:

```mermaid
flowchart TD
    N1["текущий код"]
    N2["Microtasks"]
    N3["Macrotasks"]
    N1 --> N2
    N2 --> N3
```

Теперь нужно отдельно разобрать задачи вроде таймеров.

## Главный вопрос

> Когда выполняются таймеры и похожие задачи?

Короткий ответ: Macrotasks выполняются после текущего кода и после Microtasks.

## Предварительные требования

Для этой главы нужно понимать:

* Event Loop;
* Web APIs;
* Microtasks;
* Call Stack;
* базовую асинхронность.

## Цели обучения

После главы вы будете понимать:

* что такое Macrotasks;
* почему `setTimeout()` выполняется после текущего кода;
* почему Microtasks идут раньше Macrotasks;
* как `setInterval()` планирует повторяющиеся macrotasks;
* как предсказывать порядок в тестовом фреймворке.

## Мотивация

В Automation QA часто есть задачи, которые должны выполниться позже:

```mermaid
flowchart TD
    N1["загрузить отчет"]
    N2["уведомить панель мониторинга"]
    N3["повторить загрузку через интервал"]
    N1 --> N2
    N2 --> N3
```

Такие задачи обычно планируются через API среды выполнения и попадают в очередь macrotasks.

## Теория

Macrotasks — это отложенные задачи более крупного уровня.

К ним относятся:

```text
setTimeout()
setInterval()
```

Упрощенный порядок:

```mermaid
flowchart TD
    N1["синхронный код"]
    N2["Microtasks"]
    N3["одна Macrotask"]
    N4["Microtasks после нее"]
    N5["следующая Macrotask"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Эта глава не углубляется в разные типы очередей браузера или Node.js. Здесь важна рабочая модель: таймеры выполняются через очередь macrotasks и уступают Microtasks после текущего кода.

## Внутренний механизм

Когда вызывается `setTimeout()`:

```mermaid
flowchart TD
    N1["JavaScript вызывает setTimeout()"]
    N2["среда выполнения принимает таймер"]
    N3["после задержки обратный вызов готов"]
    N4["обратный вызов попадает в macrotask queue"]
    N5["Event Loop возвращает задачу в Call Stack"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Сравнение:

```mermaid
flowchart TD
    N1["Promise.then(...)"]
    N2["microtask queue"]
    N3["setTimeout(...)"]
    N4["macrotask queue"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Поэтому:

```mermaid
flowchart TD
    N1["текущий код"]
    N2["Microtasks"]
    N3["Macrotasks"]
    N1 --> N2
    N2 --> N3
```

## Главная ментальная модель

Главная модель главы:

```mermaid
flowchart TD
    N1["Macrotasks"]
    N2["отложенные задачи после Microtasks"]
    N1 --> N2
```

Полная схема модуля:

```mermaid
flowchart TD
    N1["Call Stack"]
    N2["Event Loop"]
    N3["microtask queue macrotask queue"]
    N4["среда выполнения"]
    N3 --> N4
    N1 --> N2
    N2 --> N3
```

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-76/
```

Запуск:

```bash
node examples/01-javascript/chapter-76/01-timeout-macrotask.js
node examples/01-javascript/chapter-76/02-interval-macrotask.js
node examples/01-javascript/chapter-76/03-macro-after-micro.js
node examples/01-javascript/chapter-76/04-qa-flow.js
```

Примеры показывают, что таймеры выполняются после текущего кода и после Microtasks.

## Пример Automation QA

Представим тестовый фреймворк:

```mermaid
flowchart TD
    N1["выполнить тесты"]
    N2["Promise.then(отметить запуск завершенным)"]
    N3["setTimeout(загрузить отчет)"]
    N4["setTimeout(уведомить панель мониторинга)"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Сначала завершится текущий код. Затем выполнятся Microtasks. Потом начнут выполняться macrotasks, связанные с таймерами.

Это помогает объяснять порядок логов:

```text
framework: synchronous part complete
microtask: отметить запуск завершенным
macrotask: загрузить отчет
macrotask: уведомить панель мониторинга
```

## Распространённые ошибки

### Ошибка 1. Думать, что `setTimeout(..., 0)` означает "прямо сейчас"

Таймер с нулевой задержкой все равно попадает в macrotask queue.

### Ошибка 2. Игнорировать Microtasks

Если есть Promise-обработчики, они выполнятся раньше таймера после текущего кода.

### Ошибка 3. Считать macrotasks параллельным выполнением JavaScript

Macrotasks возвращаются в обычный Call Stack. JavaScript-код задачи выполняется как обычная функция.

## Практика

Практика находится в:

```text
practice/01-javascript/76-macrotasks.md
```

Решения находятся в:

```text
solutions/01-javascript/76-macrotasks.md
```

## Краткие итоги

Macrotasks объясняют поведение таймеров и похожих отложенных задач.

Главное:

* `setTimeout()` и `setInterval()` планируют macrotasks;
* macrotasks выполняются после текущего синхронного кода;
* Microtasks выполняются раньше macrotasks;
* Event Loop координирует возвращение задач в Call Stack;
* асинхронность не означает параллельное выполнение JavaScript-кода.

## Переход к следующей главе

Теперь общая модель асинхронного JavaScript выглядит так:

```mermaid
flowchart TD
    N1["Call Stack"]
    N2["среда выполнения"]
    N3["Microtasks"]
    N4["Macrotasks"]
    N5["Event Loop"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

Следующие главы смогут использовать эту модель для более удобных инструментов работы с асинхронностью.
