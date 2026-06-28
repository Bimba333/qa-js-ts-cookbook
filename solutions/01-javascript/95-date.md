# Решения: Date

## Концептуальные вопросы

### 1. Что представляет `Date`?

Ответ: `Date` представляет момент времени.

Объяснение: Date object дает методы для получения timestamp и форматированного значения.

Типичная ошибка: думать, что `Date` представляет только календарную дату без времени.

Связь с Automation QA: время генерации отчета и время создания заказа являются моментами времени.

### 2. Чем timestamp удобен для сравнения дат?

Ответ: timestamp — число, поэтому его удобно сравнивать и вычитать.

Объяснение: сравнение чисел проще и надежнее, чем сравнение строк.

Типичная ошибка: сравнивать разные строковые форматы дат.

Связь с Automation QA: token expiration проще проверять через timestamp.

### 3. Что возвращает `getTime()`?

Ответ: timestamp конкретного Date object.

Объяснение: это числовое представление момента времени.

Типичная ошибка: ожидать от `getTime()` форматированную строку.

Связь с Automation QA: timestamp нужен для вычисления длительности тестового шага.

### 4. Чем `Date.now()` отличается от `new Date()`?

Ответ: `Date.now()` возвращает текущий timestamp, а `new Date()` создает Date object.

Объяснение: оба относятся к текущему времени, но возвращают разные типы значений.

Типичная ошибка: вызывать методы Date object на результате `Date.now()`.

Связь с Automation QA: для duration достаточно `Date.now()`, для вывода в report удобен `new Date().toISOString()`.

### 5. Как понять, что дата invalid?

Ответ: проверить результат `getTime()` через `Number.isNaN()`.

Объяснение: некорректная дата существует как объект, но ее timestamp равен `NaN`.

Типичная ошибка: считать, что `new Date('wrong')` выбросит ошибку.

Связь с Automation QA: fixture с некорректной датой нужно отлавливать до проверки API.

## Чтение кода

Ответ: код проверяет, что `finishedAt` позже `startedAt`.

Объяснение: оба Date objects превращаются в timestamp через `getTime()`.

Типичная ошибка: читать сравнение как сравнение строк.

Связь с Automation QA: так можно проверить, что report создан после начала теста.

## Предскажите результат

Ответ: код выведет `5000`.

Объяснение: между указанными моментами прошло пять секунд, то есть 5000 milliseconds.

Типичная ошибка: ожидать `5`, хотя timestamp измеряется в milliseconds.

Связь с Automation QA: duration тестового шага обычно считают в milliseconds.

## Задание на отладку

Ответ:

```javascript
const date = new Date('not-a-date');
const timestamp = date.getTime();

if (Number.isNaN(timestamp)) {
  console.log('Invalid date');
}
```

Объяснение: некорректная дата не выбрасывает ошибку при создании, поэтому нужна проверка timestamp.

Типичная ошибка: проверять только `if (date)`.

Связь с Automation QA: плохая дата в test data может сломать проверку срока действия токена.

## Задание Automation QA

Ответ:

```javascript
function isTokenExpired(expiresAtIso) {
  const expiresAt = new Date(expiresAtIso).getTime();

  if (Number.isNaN(expiresAt)) {
    throw new Error('Invalid expiration date');
  }

  return Date.now() >= expiresAt;
}
```

Объяснение: функция сравнивает текущий timestamp с timestamp окончания срока действия.

Типичная ошибка: не проверять некорректную дату.

Связь с Automation QA: такая проверка помогает заранее обновлять token перед API-запросами.

## Мини-проект

Ответ:

```javascript
function measureStepDuration(step) {
  const startedAt = Date.now();

  step();

  const finishedAt = Date.now();
  return finishedAt - startedAt;
}
```

Объяснение: duration — это разница между временем окончания и временем начала.

Типичная ошибка: возвращать Date object вместо числовой длительности.

Связь с Automation QA: helper можно использовать для анализа медленных setup steps.
