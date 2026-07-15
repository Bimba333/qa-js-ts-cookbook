# Практика: Function Types

## Концептуальные вопросы

1. Что описывает тип параметра функции?
2. Когда явный возвращаемый тип полезнее вывода типа?
3. Что описывает function type expression?
4. Почему тип функции не создает функцию во время выполнения?
5. Где типы функций полезны в QA helpers?

## Чтение кода

Какой тип результата у функции?

```typescript
function formatStatus(status: 'passed' | 'failed'): string {
  return `status: ${status}`;
}
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
function retryLabel(retries: number): string {
  return `retries: ${retries}`;
}

retryLabel('2');
```

## Анализ типа

Опишите словами, какие функции подходят под тип:

```typescript
type Formatter = (value: string) => string;
```

## Задание на отладку

Найдите проблему.

```typescript
function getRetryCount(): number {
  return '2';
}
```

## Задание Automation QA

Создайте тип функции `StatusFormatter`, который принимает `'passed' | 'failed'` и возвращает `string`.

## Мини-проект

Создайте функцию `formatReportStatus`, которая принимает статус `'passed' | 'failed'` и возвращает строку для отчета.
