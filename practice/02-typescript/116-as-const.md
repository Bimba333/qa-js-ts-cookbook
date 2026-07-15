# Практика: as const

## Концептуальные вопросы

1. Что делает `as const` с литеральными типами?
2. Чем `const` отличается от `as const`?
3. Почему `as const` не является заморозкой во время выполнения?
4. Что происходит с объектными свойствами после `as const`?
5. Где `as const` полезен в QA-проекте?

## Чтение кода

Какой тип TypeScript сохранит для `environment`?

```typescript
const config = {
  environment: 'staging',
} as const;
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
const config = {
  retries: 2,
} as const;

config.retries = 3;
```

## Задание на отладку

Найдите проблему.

```typescript
const statuses = ['passed', 'failed'] as const;

statuses.push('skipped');
```

## Задание Automation QA

Создайте readonly tuple со значениями `'local'`, `'staging'`, `'production'`.

## Мини-проект

Создайте объект `defaultConfig` с `environment: 'staging'` и `retries: 2`, сохраните точные типы через `as const`.
