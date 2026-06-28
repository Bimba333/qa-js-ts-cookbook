# Date

## Связь с предыдущей главой

Предыдущая глава показала, как JavaScript превращает данные в JSON text и обратно.

Во многих данных есть время:

```text
срок действия токена
│
дата создания заказа
│
время генерации отчета
│
длительность теста
```

Чтобы сравнивать такие значения, нужно понимать, как JavaScript представляет время.

## Главный вопрос

> Как JavaScript представляет время?

Короткий ответ: `Date` хранит момент времени, а timestamp позволяет сравнивать и измерять интервалы.

## Мотивация

В Automation QA часто нужно проверить:

* токен еще не истек;
* заказ создан после запуска теста;
* report содержит время генерации;
* тест выполнился быстрее допустимого лимита.

Все эти задачи требуют одного базового умения: работать с моментами времени как со значениями.

## Теория

`Date` — встроенный объект JavaScript для работы с датой и временем.

Создание текущего момента:

```javascript
const now = new Date();
```

Создание из строки:

```javascript
const createdAt = new Date('2026-06-28T10:00:00.000Z');
```

Timestamp — это числовое представление момента времени.

```javascript
const timestamp = createdAt.getTime();
```

`Date.now()` сразу возвращает текущий timestamp:

```javascript
const startedAt = Date.now();
```

`toISOString()` превращает дату в удобную строку для API, логов и отчетов:

```javascript
const value = new Date().toISOString();
```

## Внутренний механизм

Практическая модель:

```text
timestamp
│
▼
Date object
│
▼
методы
│
▼
форматированное значение
```

Для сравнения дат удобно сравнивать timestamp:

```javascript
const createdAt = new Date('2026-06-28T10:00:00.000Z');
const finishedAt = new Date('2026-06-28T10:00:05.000Z');

console.log(finishedAt.getTime() > createdAt.getTime());
```

Для длительности нужно вычесть один timestamp из другого:

```javascript
const duration = finishedAt.getTime() - createdAt.getTime();
```

Если дата не может быть разобрана, получится некорректная дата. Такой объект существует, но его timestamp равен `NaN`.

## Главная ментальная модель

```text
момент времени
│
▼
число для сравнения
│
▼
Date object для методов
│
▼
строка для вывода
```

`Date` нужен не только для красивого отображения. Он помогает сравнивать моменты и считать интервалы.

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-95/
```

Запуск:

```bash
node examples/01-javascript/chapter-95/01-create-date.js
node examples/01-javascript/chapter-95/02-timestamp.js
node examples/01-javascript/chapter-95/03-compare-dates.js
node examples/01-javascript/chapter-95/04-duration.js
node examples/01-javascript/chapter-95/05-invalid-date.js
node examples/01-javascript/chapter-95/06-qa-token-expiration.js
```

## Automation QA

Проверка срока действия токена:

```javascript
function isTokenExpired(expiresAtIso) {
  const expiresAt = new Date(expiresAtIso).getTime();
  return Date.now() >= expiresAt;
}
```

Измерение длительности тестового шага:

```javascript
const startedAt = Date.now();

// выполнить действие

const finishedAt = Date.now();
const durationMs = finishedAt - startedAt;
```

Такая модель полезна для API-проверок, отчетов, логов и анализа медленных тестов.

## Распространённые ошибки

### Ошибка 1. Сравнивать строки вместо времени

Для надежного сравнения лучше использовать timestamp.

### Ошибка 2. Не проверять некорректную дату

`new Date('wrong')` создает Date object, но его значение не является корректной датой.

### Ошибка 3. Путать дату и длительность

Дата — это момент времени. Длительность — разница между двумя моментами.

### Ошибка 4. Делать сложную работу с часовыми поясами без необходимости

В этой главе достаточно понимать timestamp, `Date`, `getTime()`, `Date.now()` и `toISOString()`.

## Практика

Практика находится в:

```text
practice/01-javascript/95-date.md
```

Решения находятся в:

```text
solutions/01-javascript/95-date.md
```

## Краткие итоги

Главное:

* `Date` представляет момент времени;
* `new Date()` создает Date object;
* timestamp удобен для сравнения и расчета интервалов;
* `getTime()` возвращает timestamp конкретной даты;
* `Date.now()` возвращает текущий timestamp;
* `toISOString()` полезен для API, logs и reports;
* некорректную дату нужно проверять явно.

## Переход

Мы завершили основные темы JavaScript: данные, ошибки, время, модули, асинхронность, память и инженерную практику.

Остается финальный вопрос:

> Если JavaScript настолько способен, почему появился TypeScript?
