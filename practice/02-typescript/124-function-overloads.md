# Практика: Function Overloads

## Концептуальные вопросы

1. Что описывают сигнатуры перегрузки?
2. Почему сигнатура реализации не является отдельной функцией во время выполнения?
3. Когда union проще overload?
4. Почему реализация должна быть совместима со всеми сигнатурами перегрузки?
5. Где перегрузки могут быть полезны в helper API?

## Чтение кода

Какие вызовы функции допустимы?

```typescript
type TestById = {
  source: 'id';
  id: number;
};

type TestByTitle = {
  source: 'title';
  title: string;
};

function findTest(id: number): TestById;
function findTest(title: string): TestByTitle;
function findTest(value: number | string): TestById | TestByTitle {
  if (typeof value === 'number') {
    return { source: 'id', id: value };
  }

  return { source: 'title', title: value };
}
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
type TestById = { source: 'id'; id: number };
type TestByTitle = { source: 'title'; title: string };

function findTest(id: number): TestById;
function findTest(title: string): TestByTitle;
function findTest(value: number | string): TestById | TestByTitle {
  if (typeof value === 'number') {
    return { source: 'id', id: value };
  }

  return { source: 'title', title: value };
}

findTest(true);
```

## Анализ типа

Объясните, почему здесь union проще overload.

```typescript
function formatTarget(value: number | string): string {
  return `target: ${value}`;
}
```

## Задание на отладку

Найдите проблему.

```typescript
function normalize(value: string): string;
function normalize(value: number): number;
function normalize(value: string | number): boolean {
  return Boolean(value);
}
```

## Задание Automation QA

Создайте перегрузки для `readConfig`: ключ `'baseUrl'` должен возвращать `string`, а ключ `'retries'` должен возвращать `number`.

## Мини-проект

Создайте функцию `findReport`, которую можно вызвать по числовому id или по строковому title. Для id верните объект с полем `id`, для title — объект с полем `title`.
