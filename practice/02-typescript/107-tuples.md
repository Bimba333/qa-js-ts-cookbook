# Практика: Tuples

## Концептуальные вопросы

1. Чем tuple отличается от обычного массива?
2. Почему порядок позиций важен для tuple?
3. Как записать tuple `[number, string]`?
4. Для чего нужен optional tuple element?
5. Когда лучше заменить tuple объектом?

## Чтение кода

Что находится на каждой позиции?

```typescript
const response: [number, string] = [200, 'OK'];
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
const result: [string, boolean, string?] = ['login', false, 'timeout'];
```

## Задание на отладку

Найдите проблему.

```typescript
const response: [number, string] = ['OK', 200];
```

## Задание Automation QA

Опишите tuple для результата короткой проверки:

* название проверки;
* прошла ли проверка;
* необязательное сообщение об ошибке.

## Мини-проект

Создайте функцию `formatCheckResult(result: [string, boolean, string?]): string`.

Она должна возвращать понятную строку для отчета.
