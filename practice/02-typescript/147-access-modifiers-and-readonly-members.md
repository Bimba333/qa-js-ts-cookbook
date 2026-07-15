# Практика: Access Modifiers and readonly Members

## Концептуальные вопросы

1. Что означает `public`?
2. Чем `private` отличается от `protected`?
3. Почему `readonly` не делает вложенный объект полностью неизменяемым?

## Чтение кода

```ts
class StepLogger {
  private steps: string[] = [];

  addStep(title: string): void {
    this.steps.push(title);
  }

  getCount(): number {
    return this.steps.length;
  }
}
```

Какие члены класса доступны снаружи?

## Предскажите результат проверки

```ts
class Config {
  constructor(public readonly baseUrl: string) {}
}

const config = new Config("https://app.test");
config.baseUrl = "https://other.test";
```

Что покажет TypeScript?

## Анализ типа

Объясните, какие свойства создает constructor:

```ts
class TestRun {
  constructor(
    public readonly id: string,
    private status: "created" | "finished",
  ) {}
}
```

## Задание на отладку

Исправьте класс так, чтобы `steps` нельзя было менять напрямую снаружи:

```ts
class Logger {
  steps: string[] = [];

  add(step: string): void {
    this.steps.push(step);
  }
}
```

## Задание Automation QA

Создайте класс `LoginActions`.

Он должен принимать `baseUrl` через параметр-свойство.

`baseUrl` должен быть private и readonly.

Добавьте метод `getLoginUrl(): string`.

## Мини-проект

Создайте класс `RunState`.

Он должен иметь:

- публичный readonly `id`;
- private `status`;
- метод `finish(): void`;
- метод `getStatus(): "created" | "finished"`.
