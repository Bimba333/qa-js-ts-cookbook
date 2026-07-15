# Практика: Callback Types

## Концептуальные вопросы

1. Что описывает тип callback?
2. Почему callback не выполняется на этапе проверки?
3. Что означает callback с возвращаемым типом `void`?
4. Когда callback должен возвращать boolean?
5. Где типы callback полезны в QA-коде?

## Чтение кода

Что должен уметь переданный `handler`?

```typescript
type ResultHandler = (message: string) => void;

function handleResult(message: string, handler: ResultHandler): void {
  handler(message);
}
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
type ResultHandler = (message: string) => void;

const handler: ResultHandler = (count: number) => {
  console.log(count);
};
```

## Анализ типа

Объясните, что описывает тип:

```typescript
type StatusPredicate = (status: 'passed' | 'failed') => boolean;
```

## Задание на отладку

Найдите проблему.

```typescript
type LogHandler = (message: string) => void;

function writeLog(handler: LogHandler): void {
  handler(123);
}
```

## Задание Automation QA

Создайте тип callback `LogHandler`, который принимает строковое сообщение и ничего не возвращает для вызывающего кода.

## Мини-проект

Создайте функцию `processResult`, которая принимает сообщение и callback `ResultHandler`, а затем вызывает callback.
