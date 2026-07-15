# Практика: Type Alias

## Концептуальные вопросы

1. Что делает `type`?
2. Существует ли type alias в runtime?
3. Когда alias улучшает читаемость?
4. Почему плохое имя alias ухудшает код?
5. Где type alias полезен в QA-проекте?

## Чтение кода

Какой договор получает имя?

```typescript
type TestUser = {
  email: string;
  active: boolean;
};
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
type ReportConfig = {
  title: string;
  outputDir: string;
};

const config: ReportConfig = {
  title: 'smoke',
  outputDir: 'reports/smoke',
};
```

## Задание на отладку

Найдите проблему.

```typescript
type TestUser = {
  email: string;
  active: boolean;
};

const user: TestUser = {
  email: 'qa@example.test',
  active: 'yes',
};
```

## Задание Automation QA

Создайте type alias `ApiPayload` для объекта с `endpoint`, `method` и `body`.

## Мини-проект

Создайте type alias `TestRun` и функцию `printTestRun`, которая принимает этот тип.
