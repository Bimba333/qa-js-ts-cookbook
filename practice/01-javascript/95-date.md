# Практика: Date

## Концептуальные вопросы

1. Что представляет `Date`?
2. Чем timestamp удобен для сравнения дат?
3. Что возвращает `getTime()`?
4. Чем `Date.now()` отличается от `new Date()`?
5. Как понять, что дата invalid?

## Чтение кода

Что проверяет этот код?

```javascript
const startedAt = new Date('2026-06-28T10:00:00.000Z');
const finishedAt = new Date('2026-06-28T10:00:03.000Z');

console.log(finishedAt.getTime() > startedAt.getTime());
```

## Предскажите результат

Что выведет код?

```javascript
const startedAt = new Date('2026-06-28T10:00:00.000Z').getTime();
const finishedAt = new Date('2026-06-28T10:00:05.000Z').getTime();

console.log(finishedAt - startedAt);
```

## Задание на отладку

Почему этот код не должен считаться корректной датой?

```javascript
const date = new Date('not-a-date');

console.log(date.getTime());
```

Добавьте проверку некорректной даты.

## Задание Automation QA

Напишите функцию `isTokenExpired(expiresAtIso)`.

Функция должна возвращать `true`, если текущий timestamp больше или равен timestamp окончания срока действия токена.

## Мини-проект

Напишите helper `measureStepDuration(step)`.

Он должен:

* запомнить время начала;
* выполнить переданную функцию `step`;
* запомнить время окончания;
* вернуть duration в milliseconds.
