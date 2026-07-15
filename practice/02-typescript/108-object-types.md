# Практика: Object Types

## Концептуальные вопросы

1. Что описывает object type?
2. Почему `object` слишком широкий тип для большинства задач?
3. Почему обязательное свойство нельзя пропустить?
4. Почему object type не валидирует данные в runtime?
5. Где object types полезны в QA-коде?

## Чтение кода

Какая форма объекта ожидается?

```typescript
const response: { statusCode: number; statusText: string } = {
  statusCode: 200,
  statusText: 'OK',
};
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
const user: { id: number; name: string } = {
  id: 1,
  name: 'Anna',
};
```

## Задание на отладку

Найдите проблему.

```typescript
const user: { id: number; name: string } = {
  id: '1',
  name: 'Anna',
};
```

## Задание Automation QA

Опишите object type для response summary:

* `statusCode`;
* `statusText`;
* `durationMs`.

## Мини-проект

Создайте функцию `printResponseSummary`, которая принимает объект с `statusCode`, `statusText` и `durationMs` и выводит строку отчета.
