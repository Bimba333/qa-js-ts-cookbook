# Практика. Глава 4. Что такое JavaScript

## Проверка понимания

Ответьте своими словами.

1. Что такое JavaScript?
2. Зачем нужен ECMAScript?
3. Чем ECMAScript отличается от JavaScript?
4. Что делает JavaScript Engine?
5. Что такое Runtime?
6. Чем browser runtime отличается от Node.js runtime?
7. Почему JavaScript может выполняться и в браузере, и в Node.js?
8. Почему TypeScript не заменяет JavaScript?
9. Почему Automation QA Engineer должен различать Node.js context и browser context?

## Чтение кода

Прочитайте код.

```javascript
console.log('Has document:', typeof document !== 'undefined');
console.log('Has process:', typeof process !== 'undefined');
```

Ответьте:

1. Что проверяет этот код?
2. Какой результат вы ожидаете при запуске в Node.js?
3. Какой результат был бы логически ожидаем в browser runtime?
4. Почему результат зависит от runtime?

## Предскажите результат перед запуском. Задание 1

Перед запуском файла предскажите вывод:

```text
examples/01-javascript/chapter-01/01-node-runtime.js
```

Команда:

```bash
node examples/01-javascript/chapter-01/01-node-runtime.js
```

Ответьте:

1. Какая строка должна показать runtime?
2. Почему версия Node.js может отличаться у разных читателей?

## Предскажите результат перед запуском. Задание 2

Перед запуском файла предскажите вывод:

```text
examples/01-javascript/chapter-01/03-browser-only-api.js
```

Команда:

```bash
node examples/01-javascript/chapter-01/03-browser-only-api.js
```

Ответьте:

1. Будет ли `document` доступен?
2. Почему этот пример не падает с ошибкой?
3. Какой вывод подтверждает различие runtime?

## Небольшие задачи на код

### Задача 1

Создайте файл в `playground/`:

```text
playground/runtime-note.js
```

Добавьте код, который выводит:

```text
JavaScript runs in a runtime
```

Запустите файл через Node.js.

### Задача 2

Создайте файл:

```text
playground/node-context-check.js
```

Добавьте безопасную проверку, доступен ли `process`.

Подсказка: используйте `typeof process !== 'undefined'`.

## Задачи на отладку

### Задача 1

Инженер запускает в Node.js такой код:

```javascript
console.log(document.title);
```

Он получает ошибку:

```text
ReferenceError: document is not defined
```

Ответьте:

1. Почему появилась ошибка?
2. Это ошибка JavaScript-синтаксиса или ошибка runtime context?
3. Как безопасно проверить наличие `document`?

### Задача 2

Инженер ожидает, что `process.version` будет доступен внутри кода, переданного в `page.evaluate`.

Ответьте:

1. Почему ожидание неверно?
2. В каком context выполняется код внутри `page.evaluate`?
3. Где доступен `process.version`?

## QA-задачи

### Задача 1

Опишите, почему Playwright-тест может читать переменные окружения в Node.js, но код внутри страницы браузера не должен напрямую зависеть от `process`.

### Задача 2

Составьте ASCII-схему:

```text
Playwright test
│
...
Browser page
│
...
```

Покажите, где находится Node.js context, где browser context и какие API доступны в каждом.

### Задача 3

Представьте, что тест падает с ошибкой:

```text
document is not defined
```

Составьте первые три вопроса для диагностики.

## Мини-проект

Создайте в `playground/` файл:

```text
playground/runtime-report.js
```

Файл должен вывести короткий отчет:

* доступен ли `process`;
* доступен ли `document`;
* доступен ли `window`;
* какой вывод подтверждает, что файл запущен в Node.js.

Перед запуском запишите ожидаемый результат. После запуска сравните ожидание и факт.
