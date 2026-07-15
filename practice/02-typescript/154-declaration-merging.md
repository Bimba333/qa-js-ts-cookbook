# Практика: Declaration Merging

## Концептуальные вопросы

1. Какие объявления из главы могут объединяться?
2. Почему type aliases не merge?
3. Почему declaration merging не создает runtime-свойства?

## Чтение кода

```ts
interface ReportMeta {
  title: string;
}

interface ReportMeta {
  status: "passed" | "failed";
}
```

Какую форму получает `ReportMeta` после merging?

## Предскажите результат проверки

```ts
type UserId = string;
type UserId = number;
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему несовместимые свойства в объединяемых interfaces приводят к диагностической ошибке.

## Задание на отладку

Исправьте конфликт:

```ts
interface ResultInfo {
  status: "passed";
}

interface ResultInfo {
  status: "failed";
}
```

## Задание Automation QA

Создайте interface `ReportContext`, который через merging получает поля `runId` и `environment`.

## Мини-проект

Создайте объединяемый interface `ReportSummary` с полями:

- `title`;
- `total`;
- `failed`.

Затем создайте объект этого типа.
