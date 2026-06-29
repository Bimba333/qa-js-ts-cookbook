# Module Systems

## Связь с предыдущей главой

Предыдущая глава объяснила модуль как файл с ответственностью:

```mermaid
flowchart TD
    N1["file"]
    N2["module"]
    N3["exports public API"]
    N4["other modules import it"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Теперь нужно понять, почему в JavaScript есть не один синтаксис модулей.

## Главный вопрос

> Почему в JavaScript существуют разные module systems?

Короткий ответ: CommonJS появился в Node.js раньше, а ES Modules стали современным стандартом языка.

## Мотивация

В одном проекте можно встретить такой код:

```javascript
import { baseUrl } from './config.js';
```

А в другом:

```javascript
const { baseUrl } = require('./config.cjs');
```

Оба примера решают похожую задачу: использовать код из другого файла.

Разница в том, что они принадлежат разным module systems.

```mermaid
flowchart TD
    N1["одна задача"]
    N2["использовать код из другого файла"]
    N3["ES Modules"]
    N4["CommonJS"]
    N1 --> N2
    N2 --> N3
    N2 --> N4
```

## Теория

ES Modules — современная стандартная модульная система JavaScript.

Она использует `import` и `export`.

```javascript
export const baseUrl = 'https://example.test';
```

```javascript
import { baseUrl } from './config.js';
```

CommonJS — более старая модульная система, которая долго была основной в Node.js.

Она использует `require()` и `module.exports`.

```javascript
module.exports = {
  baseUrl: 'https://example.test',
};
```

```javascript
const { baseUrl } = require('./config.cjs');
```

Обе системы нужны для организации кода по файлам, но используют разные правила записи.

## Внутренний механизм

Ментально обе системы можно представить одинаково:

```mermaid
flowchart TD
    N1["module A"]
    N2["exports value"]
    N3["module B"]
    N4["imports value"]
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

Но синтаксис отличается.

```mermaid
flowchart TD
    N1["JavaScript ecosystem"]
    N2["ES Modules"]
    N3["современный стандарт"]
    N4["CommonJS"]
    N5["историческая модульная система Node.js"]
    N1 --> N2
    N1 --> N3
    N1 --> N4
    N4 --> N5
```

ES Modules:

CommonJS:

В этой главе не нужно углубляться во вспомогательные инструменты или внутренние детали Node.js. Важно понимать практическую картину: при чтении проекта нужно распознать, какая module system используется.

## Главная ментальная модель

Главная модель главы:

Если вы видите `import` / `export`, перед вами ES Modules.

Если вы видите `require()` / `module.exports`, перед вами CommonJS.

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-86/
```

Запуск:

```bash
node examples/01-javascript/chapter-86/01-esm-runner.mjs
node examples/01-javascript/chapter-86/02-commonjs-runner.cjs
node examples/01-javascript/chapter-86/03-comparison.mjs
node examples/01-javascript/chapter-86/04-qa-choice.cjs
```

## Пример Automation QA

Современный Playwright-проект часто использует ES Modules или TypeScript-синтаксис:

```javascript
import { createReport } from './reporter.js';
```

Но в старом Node.js-проекте можно встретить CommonJS:

```javascript
const { createReport } = require('./reporter.cjs');
```

Automation QA-инженеру важно уметь читать оба варианта, потому что тестовые фреймворки часто живут долго и могут содержать код разных поколений.

## Распространённые ошибки

### Ошибка 1. Смешивать синтаксис без понимания окружения

`import` и `require()` относятся к разным системам. Их можно встретить в одном большом проекте, но смешивание требует понимания настроек окружения.

### Ошибка 2. Думать, что CommonJS устарел полностью

CommonJS все еще встречается в Node.js-проектах, пакетах и старом инфраструктурном коде.

### Ошибка 3. Изучать вспомогательные инструменты раньше базовой модели

Сначала нужно понять различие между ES Modules и CommonJS. Остальные инструменты проще изучать после этой базовой модели.

## Практика

Практика находится в:

```text
practice/01-javascript/86-module-systems.md
```

Решения находятся в:

```text
solutions/01-javascript/86-module-systems.md
```

## Краткие итоги

JavaScript имеет несколько module systems из-за истории развития языка и Node.js.

Главное:

* ES Modules используют `import` и `export`;
* CommonJS использует `require()` и `module.exports`;
* ES Modules являются современным стандартом;
* CommonJS часто встречается в старом Node.js-коде;
* обе системы решают задачу разделения кода по файлам;
* в Automation QA важно уметь читать оба стиля.

## Переход к следующей главе

Теперь написанная часть JavaScript дошла до модулей:

Теперь мы понимаем, как организуется код в крупных проектах. Следующие главы продолжают изучение современных возможностей JavaScript.
