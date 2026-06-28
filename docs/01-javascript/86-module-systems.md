# Module Systems

## Связь с предыдущей главой

Предыдущая глава объяснила модуль как файл с ответственностью:

```text
file
│
▼
module
│
▼
exports public API
│
▼
other modules import it
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

```text
одна задача
│
▼
использовать код из другого файла
│
├── ES Modules
└── CommonJS
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

```text
module A
│
▼
exports value
│
▼
module B
│
▼
imports value
```

Но синтаксис отличается.

```text
JavaScript ecosystem
│
├── ES Modules
│       └── современный стандарт
│
└── CommonJS
        └── историческая модульная система Node.js
```

ES Modules:

```text
export
│
▼
import
```

CommonJS:

```text
module.exports
│
▼
require()
```

В этой главе не нужно углубляться во вспомогательные инструменты или внутренние детали Node.js. Важно понимать практическую картину: при чтении проекта нужно распознать, какая module system используется.

## Главная ментальная модель

Главная модель главы:

```text
JavaScript ecosystem
│
├── ES Modules
│       └── современный стандарт
│
└── CommonJS
        └── историческая модульная система Node.js
```

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

```text
данные
│
▼
итерация
│
▼
модули
│
▼
module systems
```

Теперь мы понимаем, как организуется код в крупных проектах. Следующие главы продолжают изучение современных возможностей JavaScript.
