# Практика: Optional, Default and Rest Parameters

## Концептуальные вопросы

1. Что означает `?` у параметра функции?
2. Когда срабатывает параметр со значением по умолчанию?
3. Что получает функция через rest-параметр?
4. Почему обязательный параметр после необязательного параметра создает проблему?
5. Чем rest-параметр отличается от spread при вызове?

## Чтение кода

Какие вызовы функции допустимы?

```typescript
function buildTitle(name: string, prefix?: string): string {
  return prefix ? `${prefix}: ${name}` : name;
}
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
function joinTags(...tags: string[]): string {
  return tags.join(', ');
}

joinTags('smoke', 123);
```

## Анализ типа

Объясните, какой тип TypeScript выводит для параметра `retries`.

```typescript
function retryLabel(retries = 2): string {
  return `retries: ${retries}`;
}
```

## Задание на отладку

Найдите проблему.

```typescript
function buildTitle(prefix?: string, name: string): string {
  return prefix ? `${prefix}: ${name}` : name;
}
```

## Задание Automation QA

Создайте helper `testTitle`, который принимает обязательное имя теста и необязательный prefix.

## Мини-проект

Создайте функцию `buildTags`, которая принимает любое количество строковых тегов и возвращает массив строк.
