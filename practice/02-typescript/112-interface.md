# Практика: Interface

## Концептуальные вопросы

1. Что описывает interface?
2. Существует ли interface в runtime?
3. Что такое method signature?
4. Как interface помогает описывать публичный договор?
5. Где interface полезен в QA-коде?

## Чтение кода

Какие свойства и методы требует interface?

```typescript
interface Reporter {
  name: string;
  write(message: string): void;
}
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
interface Logger {
  log(message: string): void;
}

const logger: Logger = {
  log(message: string): void {
    console.log(message);
  },
};
```

## Задание на отладку

Найдите проблему.

```typescript
interface Logger {
  log(message: string): void;
}

const logger: Logger = {
  name: 'console',
};
```

## Задание Automation QA

Опишите interface `Reporter` с методом `write(message: string): void`.

## Мини-проект

Создайте interface `StepLogger` и функцию `runStep`, которая принимает `StepLogger`.
