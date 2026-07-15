# Практика: Intersection Types

## Концептуальные вопросы

1. Что описывает intersection type?
2. Чем intersection отличается от union?
3. Почему intersection не объединяет объекты во время выполнения?
4. Что должен иметь объект, если его тип `A & B`?
5. Где intersection types полезны в QA-коде?

## Чтение кода

Какие свойства должен иметь `entry`?

```typescript
type TestInfo = { title: string };
type WithDuration = { durationMs: number };

type ReportEntry = TestInfo & WithDuration;
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
type A = { id: string };
type B = { title: string };

const value: A & B = {
  id: 'T-1',
};
```

## Задание на отладку

Найдите проблему.

```typescript
type WithOwner = { owner: string };
type WithSuite = { suite: string };

const metadata: WithOwner & WithSuite = {
  owner: 'qa',
};
```

## Задание Automation QA

Создайте `ReportEntry` из `TestInfo` и `WithDuration`.

## Мини-проект

Создайте тип `ResultWithMetadata`, который объединяет результат теста и общие метаданные.
