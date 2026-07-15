# Практика: Default Generic Parameters

## Концептуальные вопросы

1. Когда используется параметр типа по умолчанию?
2. Чем значение по умолчанию отличается от inference?
3. Почему `unknown` часто безопаснее, чем `any`, для default?

## Чтение кода

```ts
type ApiResponse<Data = unknown> = {
  status: number;
  body: Data;
};

type RawResponse = ApiResponse;
```

Какой тип получает `body` в `RawResponse`?

## Предскажите результат проверки

```ts
type EntityBox<Entity extends { id: string } = { id: string }> = {
  entity: Entity;
};

const box: EntityBox = {
  entity: {},
};
```

Что покажет TypeScript?

## Анализ типа

Почему параметр типа по умолчанию не меняет поведение во время выполнения?

## Задание на отладку

Исправьте тип:

```ts
type ApiResponse<Data = any> = {
  body: Data;
};
```

Выберите более безопасный default.

## Задание Automation QA

Создайте `HelperResult<Data = unknown>` с полями:

- `ok: boolean`;
- `data: Data`.

## Мини-проект

Создайте обобщённый тип `EntityBox<Entity extends { id: string } = { id: string }>` и покажите использование с default и с явным аргументом типа.
