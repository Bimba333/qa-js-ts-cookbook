# Практика: Typed Classes

## Концептуальные вопросы

1. Что TypeScript проверяет в class declaration?
2. Почему тип поля не является проверкой внешних данных во время выполнения?
3. Чем имя класса в позиции типа отличается от самого класса как значения?

## Чтение кода

```ts
class TestCase {
  title: string;
  retries: number;

  constructor(title: string, retries: number) {
    this.title = title;
    this.retries = retries;
  }

  label(): string {
    return `${this.title}: ${this.retries}`;
  }
}
```

Какие свойства и методы будут у экземпляра `TestCase`?

## Предскажите результат проверки

```ts
class ReportEntry {
  status: "passed" | "failed";

  constructor(status: "passed" | "failed") {
    this.status = status;
  }
}

const entry = new ReportEntry("skipped");
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему параметр `entry: ReportEntry` описывает экземпляр класса, а не constructor.

## Задание на отладку

Исправьте класс:

```ts
class ApiRequest {
  method: "GET" | "POST";

  constructor(method: string) {
    this.method = method;
  }
}
```

## Задание Automation QA

Создайте класс `ReportEntry` с полями `title` и `status`.

`status` должен принимать только `"passed"` или `"failed"`.

Добавьте метод `toLine(): string`.

## Мини-проект

Создайте класс `TestRun`.

Он должен хранить:

- `id`;
- массив названий тестов;
- метод `addTest(title: string): void`;
- метод `getCount(): number`.
