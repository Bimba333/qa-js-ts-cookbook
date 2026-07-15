# Практика: Enum

## Концептуальные вопросы

1. Чем enum отличается от литеральных типов?
2. Почему обычный enum существует во время выполнения?
3. Когда строковый enum понятнее числового enum?
4. Почему enum не стоит использовать для любого набора строк?
5. Где enum может быть полезен в QA-коде?

## Чтение кода

Какие значения может принимать `status`?

```typescript
enum TestStatus {
  Passed = 'passed',
  Failed = 'failed',
}

const status: TestStatus = TestStatus.Passed;
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
enum ReportStatus {
  Passed = 'passed',
  Failed = 'failed',
}

const status: ReportStatus = 'passed';
```

## Задание на отладку

Найдите проблему.

```typescript
enum RetryMode {
  Off,
  On,
}

const mode: RetryMode = 'On';
```

## Задание Automation QA

Создайте string enum `RunMode` со значениями `smoke` и `regression`.

## Мини-проект

Создайте функцию `printRunMode`, которая принимает `RunMode` и выводит выбранный режим.
