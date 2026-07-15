# Практика: keyof Constraints

## Концептуальные вопросы

1. Что получает `keyof T`?
2. Почему `K extends keyof T` безопаснее, чем `key: string`?
3. Почему `T[K]` возвращает тип значения по ключу?

## Чтение кода

```ts
function pickValue<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
): ObjectType[Key] {
  return object[key];
}
```

Какая связь создается между `ObjectType` и `Key`?

## Предскажите результат проверки

```ts
const config = { retries: 2 };

pickValue(config, "timeout");
```

Почему TypeScript должен показать ошибку?

## Анализ типа

Объясните, почему функция с `key: string` теряет безопасность доступа.

## Задание на отладку

Исправьте функцию:

```ts
function readSetting(settings: { baseUrl: string; retries: number }, key: string) {
  return settings[key];
}
```

Используйте generic и `keyof`.

## Задание Automation QA

Создайте вспомогательную функцию для чтения настройки окружения. Ключ должен быть только одним из существующих ключей объекта окружения.

## Мини-проект

Создайте обобщённую вспомогательную функцию `selectField`, которая принимает объект test data и ключ этого объекта, а возвращает значение с точным типом.
