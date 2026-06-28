# Практика: Module Systems

## Концептуальные вопросы

1. Что такое ES Modules?
2. Что такое CommonJS?
3. Почему в JavaScript существуют две модульные системы?
4. Как распознать ES Modules в коде?
5. Как распознать CommonJS в коде?
6. Почему Automation QA-инженеру полезно читать оба стиля?

## Чтение кода

Определите module system:

```javascript
const { createReport } = require('./reporter.cjs');

module.exports = {
  createReport,
};
```

## Предскажите результат выполнения

```javascript
// config.cjs
module.exports = {
  environment: 'staging',
};

// runner.cjs
const config = require('./config.cjs');

console.log(config.environment);
```

Что будет выведено при запуске `runner.cjs`?

## Отладка

Почему этот код требует внимания к настройкам окружения?

```javascript
import { baseUrl } from './config.js';

const logger = require('./logger.cjs');
```

## Задание Automation QA

У вас есть два проекта:

```text
new-playwright-framework
legacy-api-tests
```

Для каждого проекта выберите более вероятную module system и объясните выбор.

## Мини-проект

Создайте сравнительную таблицу для команды:

```text
ES Modules
CommonJS
```

Для каждой системы укажите:

* синтаксис подключения;
* синтаксис экспорта;
* где чаще встречается;
* что важно помнить при чтении тестового фреймворка.
