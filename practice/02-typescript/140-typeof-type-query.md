# Практика: typeof Type Query

## Концептуальные вопросы

1. Чем оператор `typeof` во время выполнения отличается от `typeof` в позиции типа?
2. Почему `typeof` в позиции типа не валидирует внешние данные?
3. Как `typeof` помогает уменьшить дублирование типов?

## Чтение кода

```ts
const config = {
  baseUrl: "https://example.com",
  retries: 2,
};

type Config = typeof config;
```

Какую форму получает `Config`?

## Предскажите результат проверки

```ts
const status = "passed";
type Status = typeof status;

const value: Status = "failed";
```

Что покажет TypeScript?

## Анализ типа

Почему `typeof` в позиции типа исчезает после компиляции?

## Задание на отладку

Уберите ручное дублирование:

```ts
const testUser = {
  id: "u-1",
  email: "qa@example.com",
};

type TestUser = {
  id: string;
  email: string;
};
```

## Задание Automation QA

Создайте `testConfig` с `baseUrl`, `retries`, `report`.

Получите тип `TestConfig` через `typeof`.

## Мини-проект

Создайте объект `testStatuses` с `as const` и получите тип всей карты статусов через `typeof`.
