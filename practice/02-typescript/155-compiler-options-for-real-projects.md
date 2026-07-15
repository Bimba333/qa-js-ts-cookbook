# Практика: Compiler Options for Real Projects

## Концептуальные вопросы

1. Что описывает `target`?
2. Что описывает `module`?
3. Почему `lib` не добавляет API во время выполнения?

## Чтение кода

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "noEmit": true
  }
}
```

Какие правила проекта описывает этот фрагмент?

## Предскажите результат проверки

```ts
type ProjectCompilerOptions = {
  strict: boolean;
  noEmit: boolean;
};

const options: ProjectCompilerOptions = {
  strict: true,
};
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему строгие параметры компилятора помогают проекту, но могут требовать дисциплины от команды.

## Задание на отладку

Исправьте модель:

```ts
type CompilerOptionsModel = {
  target: "ES2020" | "ES2022";
  module: "ES2020" | "ES2022";
  noEmit: boolean;
};

const options: CompilerOptionsModel = {
  target: "ES2022",
  module: "invalid-module-format",
  noEmit: true,
};
```

## Задание Automation QA

Опишите, почему `noEmit` может быть полезен в QA-проекте, где TypeScript используется как проверка перед запуском тестов.

## Мини-проект

Создайте type `ProjectCompilerProfile` с полями:

- `target`;
- `module`;
- `strict`;
- `noEmit`;
- `incremental`.

Создайте объект профиля для большого QA-проекта.
