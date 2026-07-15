# Практика: Generic Classes

## Концептуальные вопросы

1. Как обобщённый класс сохраняет тип данных между методами?
2. Почему параметр типа класса исчезает после компиляции?
3. Когда класс не стоит делать generic?

## Чтение кода

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

Какая связь есть между `add` и `all`?

## Предскажите результат проверки

```ts
const storage = new TypedStorage<number>();
storage.add("passed");
```

Что покажет TypeScript?

## Анализ типа

Почему `static` members класса не должны использовать параметр типа экземпляра?

## Задание на отладку

Создайте `TypedStorage<Item>` с методами `add` и `all`.

## Задание Automation QA

Создайте обобщённый класс `EntityStore<Entity extends { id: string }>` с методами `add` и `findById`.

## Мини-проект

Создайте обобщённый класс `TestDataBuilder<Data>`, который принимает данные в constructor и возвращает их через `build()`.
