# Практика: JavaScript Modules

## Концептуальные вопросы

1. Почему большой файл становится сложным для поддержки?
2. Что означает "ответственность модуля"?
3. Чем `export` отличается от `import`?
4. Когда удобен named export?
5. Когда удобен default export?
6. Что показывает dependency graph?

## Чтение кода

Прочитайте код и объясните, какие значения экспортирует модуль:

```javascript
export const baseUrl = 'https://example.test';
export const retries = 2;

const timeout = 5000;
```

## Предскажите результат выполнения

```javascript
// logger.js
export default function log(message) {
  console.log(`[test] ${message}`);
}

// runner.js
import log from './logger.js';

log('started');
```

Что будет выведено при запуске `runner.js`?

## Отладка

В чем проблема?

```javascript
// config.js
const baseUrl = 'https://example.test';

// runner.js
import { baseUrl } from './config.js';

console.log(baseUrl);
```

## Задание Automation QA

Разделите условный тестовый раннер на модули:

* `config.js`;
* `logger.js`;
* `assertions.js`;
* `reporter.js`;
* `runner.js`.

Опишите, какая ответственность должна быть у каждого файла.

## Мини-проект

Спроектируйте dependency graph для маленького тестового фреймворка:

```text
runner.js
config.js
logger.js
reporter.js
assertions.js
```

Покажите, какие файлы должен импортировать `runner.js`, а какие не должны зависеть от `runner.js`.
