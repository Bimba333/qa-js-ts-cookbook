# Практика: Structural Typing

## Концептуальные вопросы

1. Что означает structural typing?
2. Почему TypeScript сравнивает форму, а не имя?
3. Что должно быть у объекта, чтобы он подходил под interface?
4. Почему лишние свойства в свежем object literal могут быть ошибкой?
5. Как structural typing помогает QA helpers?

## Чтение кода

Почему объект совместим с interface?

```typescript
interface Logger {
  log(message: string): void;
}

const consoleLike = {
  log(message: string): void {
    console.log(message);
  },
};
```

## Предскажите результат проверки

Будет ли TypeScript считать присваивание согласованным?

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

## Предскажите результат проверки с лишним свойством

Будет ли TypeScript считать присваивание согласованным?

```typescript
type User = {
  id: number;
};

const source = {
  id: 1,
  name: 'Vlad',
};

const user: User = source;
```

## Задание на отладку

Найдите проблему.

```typescript
interface Logger {
  log(message: string): void;
}

const logger: Logger = {
  write(message: string): void {
    console.log(message);
  },
};
```

## Задание Automation QA

Опишите, почему два разных logger-объекта могут подходить под один interface.

## Мини-проект

Создайте interface `StepLogger`, два объекта с методом `log` и функцию, которая принимает `StepLogger`.
