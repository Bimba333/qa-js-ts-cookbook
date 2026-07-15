# Практика: implements and override

## Концептуальные вопросы

1. Что проверяет `implements`?
2. Почему `implements` не добавляет методы в тело класса?
3. Зачем нужен `override`?

## Чтение кода

```ts
interface Formatter {
  format(value: string): string;
}

class UpperCaseFormatter implements Formatter {
  format(value: string): string {
    return value.toUpperCase();
  }
}
```

Какой контракт проверяет TypeScript?

## Предскажите результат проверки

```ts
interface Runner {
  run(): void;
}

class SmokeRunner implements Runner {
  title = "smoke";
}
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему обычный `interface` проверяет сторону экземпляра класса, а не статическую сторону.

## Задание на отладку

Исправьте класс:

```ts
interface MessageBuilder {
  buildMessage(actual: string, expected: string): string;
}

class DefaultMessageBuilder implements MessageBuilder {
  build(actual: string, expected: string): string {
    return `${actual} ${expected}`;
  }
}
```

## Задание Automation QA

Создайте interface `ComponentObject` с методом `getName(): string`.

Создайте класс `HeaderComponent`, который implements этот interface.

## Мини-проект

Создайте class `BaseReporter` с методом `serialize(value: string): string`.

Создайте class `JsonReporter`, который extends `BaseReporter` и переопределяет `serialize` через `override`.
