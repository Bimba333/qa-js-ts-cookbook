# Решения. Глава 4. Что такое JavaScript

## Проверка понимания

### 1. Что такое JavaScript

Ответ:

JavaScript — это язык программирования. Он задает правила записи и выполнения программного кода.

Рассуждение:

Важно не смешивать язык с окружением. Сам JavaScript описывает ядро поведения программы, а runtime добавляет доступные API.

Типичная ошибка:

Считать, что все доступное в браузере является частью JavaScript.

Automation QA connection:

В автотестах нужно понимать, где заканчивается язык и начинается API инструмента или окружения.

### 2. Зачем нужен ECMAScript

Ответ:

ECMAScript нужен как стандарт языка.

Рассуждение:

Стандарт описывает ожидаемое поведение ядра языка, чтобы разные engines могли выполнять JavaScript согласованно.

Типичная ошибка:

Считать ECMAScript отдельным инструментом, который нужно запускать.

### 3. ECMAScript и JavaScript

Ответ:

ECMAScript — стандарт. JavaScript — практическое использование языка в engines и runtimes.

Рассуждение:

ECMAScript не описывает `document` или `process`. Эти возможности добавляют browser runtime и Node.js runtime.

Типичная ошибка:

Искать browser API в ECMAScript core.

### 4. JavaScript Engine

Ответ:

JavaScript Engine выполняет JavaScript-код.

Рассуждение:

Engine читает код, подготавливает его и выполняет. Подробности parsing и compilation будут изучаться в следующей главе.

Типичная ошибка:

Смешивать engine и runtime.

### 5. Runtime

Ответ:

Runtime — это среда выполнения, которая включает engine и дополнительные API.

Рассуждение:

Именно runtime определяет, доступны ли `document`, `window`, `process`, `fs` и другие API.

Типичная ошибка:

Думать, что если язык один, то окружение всегда одинаковое.

### 6. Browser runtime и Node.js runtime

Ответ:

Browser runtime выполняет JavaScript внутри браузера и предоставляет browser APIs. Node.js runtime выполняет JavaScript вне браузера и предоставляет Node.js APIs.

Рассуждение:

В browser runtime есть `document`. В Node.js runtime есть `process`. Это разные окружения вокруг языка.

Automation QA connection:

Playwright соединяет оба мира: тест запускается в Node.js, а страница живет в браузере.

### 7. Почему JavaScript работает в браузере и Node.js

Ответ:

Потому что JavaScript может выполняться разными engines внутри разных runtimes.

Рассуждение:

Ядро языка описано ECMAScript. Engine выполняет язык. Runtime добавляет окружение.

### 8. Почему TypeScript не заменяет JavaScript

Ответ:

TypeScript добавляет типы и проверку до запуска, но после компиляции выполняется JavaScript.

Рассуждение:

Runtime выполняет JavaScript, а не TypeScript-типы. Поэтому JavaScript fundamentals остаются обязательными.

Типичная ошибка:

Ожидать, что TypeScript исправит непонимание runtime.

### 9. Почему QA-инженеру важны contexts

Ответ:

Потому что тестовый код и код страницы могут выполняться в разных runtimes.

Рассуждение:

Node.js context имеет Node.js APIs. Browser context имеет browser APIs. Ошибка часто возникает из-за попытки использовать API не в том context.

## Чтение кода

Код:

```javascript
console.log('Has document:', typeof document !== 'undefined');
console.log('Has process:', typeof process !== 'undefined');
```

Ответ:

Код проверяет, доступны ли имена `document` и `process`.

Ожидаемый результат в Node.js:

```text
Has document: false
Has process: true
```

Ожидаемая логика в browser runtime:

```text
Has document: true
Has process: false
```

Рассуждение:

`document` относится к browser API. `process` относится к Node.js API. Поэтому результат зависит от runtime.

Типичная ошибка:

Считать, что `typeof` проверяет "язык", хотя здесь проверяется доступность имени в окружении.

Automation QA connection:

Такая проверка помогает понять, где выполняется код: в Node.js context или browser context.

## Предскажите результат. Задание 1

Файл:

```text
examples/chapter-04/01-node-runtime.js
```

Ожидаемый вывод:

```text
Runtime: Node.js
Node.js version: <ваша версия Node.js>
```

Рассуждение:

Первая строка фиксированная. Вторая строка зависит от установленной версии Node.js, поэтому у разных читателей она может отличаться.

Типичная ошибка:

Ожидать, что версия Node.js у всех будет одинаковой.

Automation QA connection:

Версия Node.js может влиять на запуск инструментов и тестов, поэтому ее полезно уметь проверять.

## Предскажите результат. Задание 2

Файл:

```text
examples/chapter-04/03-browser-only-api.js
```

Ожидаемый вывод:

```text
document is available: false
This file is running in Node.js, so document is not available here.
```

Рассуждение:

Файл запускается через Node.js. В Node.js нет browser API `document`. Пример не падает, потому что используется безопасная проверка `typeof document !== 'undefined'`, а не прямое обращение к `document.title`.

Типичная ошибка:

Писать прямое обращение к `document` в Node.js-файле.

Automation QA connection:

Такой тип ошибки часто возникает, когда инженер забывает, где выполняется код Playwright-теста.

## Небольшие задачи на код

### Задача 1

Файл:

```text
playground/runtime-note.js
```

Код:

```javascript
console.log('JavaScript runs in a runtime');
```

Запуск:

```bash
node playground/runtime-note.js
```

Рассуждение:

Код минимальный и нужен только для проверки запуска файла.

Типичная ошибка:

Создать файл не в `playground/` и запустить команду с неверным путем.

### Задача 2

Файл:

```text
playground/node-context-check.js
```

Код:

```javascript
console.log('process is available:', typeof process !== 'undefined');
```

Ожидаемый вывод в Node.js:

```text
process is available: true
```

Рассуждение:

`process` доступен в Node.js runtime.

Automation QA connection:

В тестах Node.js context часто используется для чтения конфигурации и переменных окружения.

## Debugging-задачи

### Задача 1

Код:

```javascript
console.log(document.title);
```

Ошибка:

```text
ReferenceError: document is not defined
```

Ответ:

Ошибка появилась, потому что код запущен в Node.js, где нет `document`.

Это ошибка runtime context, а не ошибка JavaScript-синтаксиса.

Безопасная проверка:

```javascript
console.log(typeof document !== 'undefined');
```

Рассуждение:

Прямое обращение к несуществующему имени приводит к ошибке. `typeof` позволяет проверить доступность безопасно.

Типичная ошибка:

Исправлять синтаксис, когда причина в неверном runtime.

### Задача 2

Ответ:

Ожидание неверно, потому что код внутри `page.evaluate` выполняется в browser context.

`process.version` доступен в Node.js context, где выполняется тестовый файл.

Рассуждение:

Playwright передает выполнение внутрь страницы. Там доступны browser APIs, но не обычные Node.js APIs.

Типичная ошибка:

Думать, что `page.evaluate` выполняется в том же окружении, что и тестовый файл.

Automation QA connection:

Это различие важно при диагностике Playwright-тестов.

## QA-задачи

### Задача 1

Ответ:

Playwright-тест может читать переменные окружения, потому что он выполняется в Node.js context. Код внутри страницы браузера не должен напрямую зависеть от `process`, потому что он выполняется в browser context.

Рассуждение:

Тестовый код управляет браузером снаружи. Страница выполняет свой JavaScript внутри браузера.

Типичная ошибка:

Передавать в browser context ожидания, которые относятся к Node.js.

### Задача 2

Возможная схема:

```text
Playwright test
│
├── Node.js context
│   ├── process
│   ├── fs
│   └── Playwright API
│
└── controls
    │
    ▼
Browser page
│
├── Browser context
│   ├── window
│   ├── document
│   └── DOM
```

Рассуждение:

Схема отделяет код теста от кода страницы. Это помогает понять, где доступны разные API.

### Задача 3

Первые вопросы:

1. Где выполнялся код: Node.js context или browser context?
2. Не было ли прямого обращения к `document` из тестового файла?
3. Не нужно ли выполнить этот код внутри страницы через Playwright-механизм?

Рассуждение:

Ошибка `document is not defined` почти всегда требует проверить context выполнения.

## Мини-проект

Файл:

```text
playground/runtime-report.js
```

Возможный код:

```javascript
console.log('process:', typeof process !== 'undefined');
console.log('document:', typeof document !== 'undefined');
console.log('window:', typeof window !== 'undefined');
console.log('Runtime looks like Node.js:', typeof process !== 'undefined');
```

Ожидаемый вывод в Node.js:

```text
process: true
document: false
window: false
Runtime looks like Node.js: true
```

Рассуждение:

`process` доступен в Node.js. `document` и `window` относятся к browser runtime и в обычном Node.js-файле недоступны.

Типичная ошибка:

Ожидать, что `window` будет доступен только потому, что код написан на JavaScript.

Automation QA connection:

Такой отчет помогает быстро проверить, в каком окружении выполняется диагностический код.

## Возможные улучшения

После выполнения практики можно:

* запустить все файлы из `examples/chapter-04/`;
* создать собственный runtime report в `playground/`;
* записать в личные заметки различие между language, engine и runtime;
* добавить пример ошибки `document is not defined` и ее объяснение.
