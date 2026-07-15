# Решения: Generic Classes

## Концептуальные вопросы

### Ответ

Обобщённый класс связывает тип состояния и методы класса через параметр типа. Параметр типа исчезает после компиляции. Класс не стоит делать обобщённым, если параметр типа не связывает его API.

### Объяснение

`Item` в `TypedStorage<Item>` используется в `add` и `all`.

### Типичная ошибка

Делать обобщённый класс без использования параметра типа.

### Связь с Automation QA

Typed storage и builders могут работать с разными test data.

## Чтение кода

### Ответ

`add` принимает `Item`, а `all` возвращает `Item[]`.

### Объяснение

Один параметр типа связывает вход метода и состояние класса.

### Типичная ошибка

Хранить элементы как `unknown[]` и терять связь.

### Связь с Automation QA

Так можно хранить типизированные сущности теста.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку: `storage` принимает `number`, а передана строка.

### Объяснение

Экземпляр создан как `TypedStorage<number>`.

### Типичная ошибка

Думать, что обобщённый класс проверяет тип во время выполнения.

### Связь с Automation QA

Компилятор ловит ошибку до запуска тестов.

## Анализ типа

### Ответ

Static members принадлежат классу, а параметр типа относится к конкретному экземпляру.

### Объяснение

У разных экземпляров могут быть разные аргументы типа.

### Типичная ошибка

Пытаться использовать `Item` в static property.

### Связь с Automation QA

Общие static settings не должны зависеть от типа данных экземпляра.

## Задание на отладку

### Ответ

```ts
class TypedStorage<Item> {
  private items: Item[] = [];

  add(item: Item): void {
    this.items.push(item);
  }

  all(): Item[] {
    return this.items;
  }
}
```

### Объяснение

`Item` связывает метод `add` и результат `all`.

### Типичная ошибка

Возвращать `unknown[]`.

### Связь с Automation QA

Storage может хранить typed test records.

## Задание Automation QA

### Ответ

```ts
class EntityStore<Entity extends { id: string }> {
  private items: Entity[] = [];

  add(entity: Entity): void {
    this.items.push(entity);
  }

  findById(id: string): Entity | undefined {
    return this.items.find((entity) => entity.id === id);
  }
}
```

### Объяснение

Constraint позволяет безопасно читать `id`.

### Типичная ошибка

Не ограничить `Entity`, но читать `entity.id`.

### Связь с Automation QA

Так удобно хранить test entities.

## Мини-проект

### Ответ

```ts
class TestDataBuilder<Data> {
  constructor(private readonly data: Data) {}

  build(): Data {
    return this.data;
  }
}
```

### Объяснение

Тип constructor-данных сохраняется в результате `build()`.

### Типичная ошибка

Типизировать `build()` как `unknown`.

### Связь с Automation QA

Builder сохраняет точную форму test data.
