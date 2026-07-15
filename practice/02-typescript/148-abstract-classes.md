# Практика: Abstract Classes

## Концептуальные вопросы

1. Почему abstract class нельзя использовать через `new` напрямую?
2. Чем abstract member отличается от обычного метода с реализацией?
3. Почему `abstract class` не является валидацией данных во время выполнения?

## Чтение кода

```ts
abstract class BaseScreen {
  constructor(protected readonly baseUrl: string) {}

  abstract route: string;

  openUrl(): string {
    return `${this.baseUrl}${this.route}`;
  }
}

class UsersScreen extends BaseScreen {
  route = "/users";
}
```

Какие члены наследует `UsersScreen`?

## Предскажите результат проверки

```ts
abstract class Writer {
  abstract write(value: string): string;
}

const writer = new Writer();
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему конкретный наследник обязан реализовать абстрактные члены класса.

## Задание на отладку

Исправьте класс:

```ts
abstract class ReportWriter {
  abstract writeBody(items: string[]): string;
}

class JsonReportWriter extends ReportWriter {}
```

## Задание Automation QA

Создайте abstract class `BasePageModel`.

Он должен принимать `baseUrl`, иметь abstract `route` и метод `getUrl(): string`.

Создайте concrete class `DashboardPageModel`.

## Мини-проект

Создайте abstract class `ResultFormatter`.

Он должен иметь:

- реализованный метод `formatTitle(title: string): string`;
- abstract метод `formatItems(items: string[]): string`.

Создайте concrete class `TextResultFormatter`.
