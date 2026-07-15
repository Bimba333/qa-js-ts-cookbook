# Решения: implements and override

## Концептуальные вопросы

### Ответ

`implements` проверяет, что сторона экземпляра класса соответствует `interface`. Он не добавляет методы в тело класса. `override` показывает, что метод намеренно переопределяет метод базового класса.

### Объяснение

`implements` и `override` помогают компилятору проверить намерения разработчика.

### Типичная ошибка

Ожидать валидацию во время выполнения от `implements`.

### Связь с Automation QA

Так component objects и formatters можно держать в едином контракте.

## Чтение кода

### Ответ

TypeScript проверяет, что `UpperCaseFormatter` имеет метод `format(value: string): string`.

### Объяснение

`interface` описывает контракт экземпляра. Класс реализует его через метод.

### Типичная ошибка

Изменить имя метода и ожидать, что `implements` создаст нужный метод.

### Связь с Automation QA

Helper для форматирования могут иметь единый контракт.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку.

```ts
interface Runner {
  run(): void;
}

// Ошибка: класс не реализует run().
class SmokeRunner implements Runner {
  title = "smoke";
}
```

### Объяснение

`implements Runner` требует метод `run()`.

### Типичная ошибка

Думать, что поля могут заменить метод контракта.

### Связь с Automation QA

Контракт runner должен гарантировать наличие запускающего метода.

## Анализ типа

### Ответ

Обычный `interface` проверяет сторону экземпляра, потому что `implements` относится к экземплярам класса.

### Объяснение

Статические члены и конструктор находятся на стороне значения класса. Обычный `interface` экземпляра их не описывает.

### Типичная ошибка

Пытаться проверить статический метод через обычный `implements`.

### Связь с Automation QA

Чаще всего контракт нужен именно для объектов, которые используются в тестовом коде.

## Задание на отладку

### Ответ

```ts
interface MessageBuilder {
  buildMessage(actual: string, expected: string): string;
}

class DefaultMessageBuilder implements MessageBuilder {
  buildMessage(actual: string, expected: string): string {
    return `${actual} ${expected}`;
  }
}
```

### Объяснение

Имя метода и сигнатура должны совпадать с контрактом `interface`.

### Типичная ошибка

Создать похожий метод с другим именем.

### Связь с Automation QA

Построители сообщений assertion должны иметь предсказуемый API.

## Задание Automation QA

### Ответ

```ts
interface ComponentObject {
  getName(): string;
}

class HeaderComponent implements ComponentObject {
  getName(): string {
    return "Header";
  }
}
```

### Объяснение

Класс явно реализует контракт component object.

### Типичная ошибка

Считать, что interface будет существовать во время выполнения.

### Связь с Automation QA

Так разные component objects могут иметь общий публичный метод.

## Мини-проект

### Ответ

```ts
class BaseReporter {
  serialize(value: string): string {
    return value;
  }
}

class JsonReporter extends BaseReporter {
  override serialize(value: string): string {
    return JSON.stringify({ value });
  }
}
```

### Объяснение

`override` подтверждает, что `serialize` действительно существует в базовом классе.

### Типичная ошибка

Переименовать метод в наследнике и не заметить, что он больше ничего не переопределяет.

### Связь с Automation QA

Reporters часто расширяют базовое поведение сериализации результата.
