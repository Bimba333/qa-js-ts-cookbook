# Практика: Type Assertions

## Концептуальные вопросы

1. Что делает `as`?
2. Почему type assertion не является проверкой во время выполнения?
3. Чем guard отличается от assertion?

## Чтение кода

```ts
type Config = {
  retries: number;
};

function read(value: unknown): Config {
  return value as Config;
}
```

Почему этот код может быть опасен?

## Предскажите результат проверки

```ts
const retries = "2";
const count = retries as unknown as number;
```

Будет ли TypeScript считать `count` числом?

## Анализ типа

Объясните риск в коде:

```ts
function first(items: string[]): string {
  return items[0]!;
}
```

Когда код может упасть во время выполнения?

## Задание на отладку

Сделайте код безопаснее:

```ts
type ReportConfig = {
  outputDir: string;
};

function outputDir(value: unknown): string {
  const config = value as ReportConfig;
  return config.outputDir;
}
```

Добавьте проверки перед assertion.

## Задание Automation QA

Напишите функцию, которая читает неизвестную конфигурацию отчета и возвращает `outputDir`.

Используйте assertion только после проверки, что объект содержит нужное свойство.

## Мини-проект

Сравните два подхода для обработки `unknown` API-ответа:

- unsafe assertion;
- guard + безопасное использование.

Покажите, какой подход лучше для большого QA-проекта.
