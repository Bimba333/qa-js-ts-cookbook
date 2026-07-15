# Практика: Generic Constraints

## Концептуальные вопросы

1. Что означает `extends` в generic constraint?
2. Почему constraint не является наследованием во время выполнения?
3. Почему constraint не проверяет внешние данные во время выполнения?

## Чтение кода

```ts
function getId<Entity extends { id: string }>(entity: Entity): string {
  return entity.id;
}
```

Почему TypeScript разрешает доступ к `entity.id`?

## Предскажите результат проверки

```ts
function label<Entity extends { id: string }>(entity: Entity): string {
  return entity.id;
}

label({ name: "Vlad" });
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему `Entity extends object` не дает права читать `entity.id`.

## Задание на отладку

Исправьте функцию:

```ts
function printLength<Value>(value: Value): number {
  return value.length;
}
```

Добавьте минимальный constraint.

## Задание Automation QA

Напишите вспомогательную функцию `markEntity`, которая принимает объект с `id: string`, возвращает исходный объект и marker `test-<id>`.

## Мини-проект

Создайте обобщённую вспомогательную функцию для test entities, которая принимает объект с `id` и `status`, а возвращает строку для отчета.
