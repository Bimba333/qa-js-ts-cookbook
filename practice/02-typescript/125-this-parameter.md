# Практика: this Parameter

## Концептуальные вопросы

1. Что описывает this-параметр?
2. Почему this-параметр не передается как обычный аргумент?
3. Меняет ли TypeScript правила привязки `this` во время выполнения?
4. Почему метод можно потерять при передаче как callback?
5. Где контроль `this` полезен в объектных helpers?

## Чтение кода

Какой контекст ожидает функция?

```typescript
type Counter = {
  value: number;
};

function increment(this: Counter, step: number): number {
  return this.value + step;
}
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
type Counter = { value: number };

function increment(this: Counter, step: number): number {
  return this.value + step;
}

increment(2);
```

## Анализ типа

Объясните, почему this-параметр не появляется в списке аргументов во время выполнения.

## Задание на отладку

Найдите проблему.

```typescript
type ReportContext = { prefix: string };

function format(this: ReportContext, message: string): string {
  return `${this.prefix} ${message}`;
}

format('ready');
```

## Задание Automation QA

Создайте объект `reportHelper` с полем `prefix` и методом `format`, который использует `this.prefix`.

## Мини-проект

Создайте функцию `formatWithContext`, которая ожидает `this` с полем `prefix` и параметр `message: string`.
