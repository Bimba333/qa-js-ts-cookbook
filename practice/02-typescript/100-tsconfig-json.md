# Практика: tsconfig.json

## Концептуальные вопросы

1. Зачем TypeScript-проекту нужен `tsconfig.json`?
2. Что описывает `compilerOptions`?
3. Чем `include` отличается от `exclude`?
4. Почему project boundary важен для большого Automation QA framework?
5. Почему generated files не должны случайно становиться исходными файлами проекта?

## Чтение кода

Что означает эта конфигурация?

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "strict": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Предскажите результат

Будет ли файл `src/helpers/retry.ts` входить в project boundary?

```json
{
  "include": ["src/**/*.ts"]
}
```

## Задание на отладку

Почему такая конфигурация может быть слишком широкой?

```json
{
  "include": ["**/*.ts"]
}
```

Объясните возможный риск для generated files и временных файлов.

## Задание Automation QA

Представьте структуру проекта:

```text
src/
tests/
reports/
node_modules/
```

Какие папки должны входить в TypeScript project boundary, а какие лучше исключить?

## Мини-проект

Опишите минимальный `tsconfig.json` для Automation QA проекта.

Не добавляйте много options.

Достаточно указать:

* `compilerOptions`;
* `target`;
* `module`;
* `strict`;
* `include`;
* `exclude`.
