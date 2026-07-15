# Практика: Async Function Types

## Концептуальные вопросы

1. Какой тип возвращает асинхронная функция?
2. Почему явный тип результата асинхронной функции записывается как `Promise<T>`?
3. Что происходит с обычным значением, возвращенным из асинхронной функции?
4. Что происходит с ошибкой, выброшенной внутри асинхронной функции?
5. Обрабатывает ли TypeScript rejected Promise автоматически?

## Чтение кода

Какой тип результата у функции?

```typescript
async function loadStatus(): Promise<'passed'> {
  return 'passed';
}
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
async function loadStatus(): string {
  return 'passed';
}
```

## Анализ типа

Объясните, что означает `Promise<{ status: 'ready' }>` в результате async helper.

## Задание на отладку

Найдите проблему.

```typescript
async function loadRetries(): Promise<number> {
  return '2';
}
```

## Задание Automation QA

Создайте асинхронную функцию `prepareEnvironment`, которая возвращает `Promise<'ready'>`.

## Мини-проект

Создайте тип `SetupResult` и асинхронную функцию `loadSetupResult`, которая возвращает `Promise<SetupResult>`.
