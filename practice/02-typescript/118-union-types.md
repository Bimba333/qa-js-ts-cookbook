# Практика: Union Types

## Концептуальные вопросы

1. Что описывает union type?
2. Почему union не является массивом типов?
3. Почему union не создает значение во время выполнения?
4. Чем `string | undefined` отличается от optional property?
5. Где union types полезны в QA-коде?

## Чтение кода

Какие значения разрешены?

```typescript
type TestStatus = 'passed' | 'failed' | 'skipped';

const status: TestStatus = 'passed';
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
type TestStatus = 'passed' | 'failed';

const status: TestStatus = 'skipped';
```

## Задание на отладку

Найдите проблему.

```typescript
type Id = string | number;

const id: Id = true;
```

## Задание Automation QA

Опишите `CheckResult`, который может быть `'passed'` или `'failed'`.

## Мини-проект

Создайте тип `ApiResult` с вариантами `{ status: 'success'; statusCode: number }` и `{ status: 'error'; message: string }`.
