# Modern JavaScript Features

## Связь с предыдущей главой

Предыдущий модуль завершил инженерный блок JavaScript:

Теперь важно собрать язык в одну картину. Мы уже изучили модули, функции, объекты, async/await, классы, итерацию и управление ошибками. В реальном проекте эти возможности почти никогда не живут отдельно.

## Главный вопрос

> Как обычно выглядит современный JavaScript-код?

Короткий ответ: современный JavaScript — это сочетание уже изученных механизмов, которые помогают писать модульный, читаемый и предсказуемый код.

## Мотивация

В Automation QA проект редко состоит из одного файла. Обычно есть:

```text
config
helpers
page objects
fixtures
assertions
reporting
test data
```

Современный JavaScript помогает связать эти части без хаоса:

## Теория

Эта глава не вводит новый синтаксис. Она показывает, как уже изученные возможности работают вместе.

Типичный современный JavaScript-код использует:

* `import` / `export` для границ модулей;
* destructuring для аккуратного извлечения данных;
* optional chaining для безопасного доступа к вложенным полям;
* nullish coalescing для осмысленных значений по умолчанию;
* spread и rest для работы с наборами данных;
* `async` / `await` для читаемого асинхронного потока;
* classes там, где нужна сущность с состоянием и поведением;
* iterators и generators там, где данные удобно выдавать постепенно.

Главная идея:

## Главная ментальная модель

Modern JavaScript — это не набор модных конструкций. Это способ соединять уже понятные механизмы так, чтобы код оставался читаемым.

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-91/
```

Запуск:

```bash
node examples/01-javascript/chapter-91/01-modern-data-access.js
node examples/01-javascript/chapter-91/02-async-helper-flow.js
node examples/01-javascript/chapter-91/03-class-and-report.js
node examples/01-javascript/chapter-91/04-generator-log-reader.js
```

## Automation QA

Пример современного helper-кода:

```javascript
async function createTestSummary(testResult) {
  const {
    title,
    status,
    meta = {},
  } = testResult;

  const owner = meta.owner ?? 'unknown';
  const browser = meta.environment?.browser ?? 'chromium';

  return {
    title,
    status,
    owner,
    browser,
  };
}
```

Здесь вместе работают:

* destructuring;
* default value;
* optional chaining;
* nullish coalescing;
* async function;
* объект результата.

Это не "сложный синтаксис". Это аккуратная сборка уже изученных механизмов.

## Распространённые ошибки

### Ошибка 1. Использовать modern syntax ради самого syntax

Если конструкция не делает код понятнее, она не улучшает проект.

### Ошибка 2. Смешивать слишком много идей в одной функции

Даже современный JavaScript становится тяжелым, если одна функция делает подготовку данных, запрос, assertion и report одновременно.

### Ошибка 3. Забывать про границы модулей

Если каждый файл знает слишком много о других файлах, `import` / `export` не спасают архитектуру.

## Практика

Практика находится в:

```text
practice/01-javascript/91-modern-javascript.md
```

Решения находятся в:

```text
solutions/01-javascript/91-modern-javascript.md
```

## Краткие итоги

Modern JavaScript — это интеграция уже изученных механизмов.

Главное:

* модули задают границы;
* destructuring упрощает работу с данными;
* optional chaining и nullish coalescing делают доступ безопаснее;
* async/await помогает читать асинхронный поток;
* spread/rest помогают передавать наборы данных;
* classes, iterators и generators применяются там, где они выражают модель задачи;
* качество кода зависит не от количества фич, а от ясности решения.

## Переход

Теперь мы видим, как современный JavaScript собирается в рабочий проект.

Следующий вопрос уже не про синтаксис:

> Что отличает поддерживаемый JavaScript от хаотичного JavaScript?
