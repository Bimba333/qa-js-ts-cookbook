# Практика: Type Composition in Practice

## Концептуальные вопросы

1. Зачем делить модель на маленькие типы?
2. Как литеральные типы помогают описывать состояние?
3. Как union помогает описывать варианты результата?
4. Как intersection помогает добавить общие поля?
5. Почему композиция типов не меняет объект во время выполнения?

## Чтение кода

Какие части объединяются в `ReportEntry`?

```typescript
type TestBase = { title: string; durationMs: number };
type TestOutcome = { status: 'passed' } | { status: 'failed'; errorMessage: string };
type ReportEntry = TestBase & TestOutcome;
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
type TestBase = { title: string };
type TestOutcome = { status: 'failed'; errorMessage: string };
type ReportEntry = TestBase & TestOutcome;

const entry: ReportEntry = {
  title: 'login',
  status: 'failed',
};
```

## Задание на отладку

Найдите проблему.

```typescript
type TestStatus = 'passed' | 'failed';

const status: TestStatus = 'unknown';
```

## Задание Automation QA

Создайте модель `ReportEntry` с общими полями `title`, `durationMs` и вариантами статуса `passed` / `failed`.

## Мини-проект

Создайте модель `ApiReport`, которая объединяет `endpoint` и результат API-операции: success со `statusCode` или error с `message`.
