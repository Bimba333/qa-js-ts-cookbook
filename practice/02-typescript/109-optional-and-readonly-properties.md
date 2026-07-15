# Практика: Optional and Readonly Properties

## Концептуальные вопросы

1. Что означает `?` после имени свойства?
2. Что запрещает `readonly`?
3. Почему optional property не означает runtime-валидацию?
4. Почему `readonly` не делает объект неизменяемым в runtime?
5. Где optional и readonly свойства полезны в QA-проекте?

## Чтение кода

Какие свойства обязательны?

```typescript
const result: { name: string; errorMessage?: string } = {
  name: 'login',
};
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
const config: { readonly baseUrl: string; timeoutMs: number } = {
  baseUrl: 'https://api.example.test',
  timeoutMs: 5000,
};

config.timeoutMs = 7000;
```

## Задание на отладку

Найдите проблему.

```typescript
const config: { readonly baseUrl: string } = {
  baseUrl: 'https://api.example.test',
};

config.baseUrl = 'https://other.example.test';
```

## Задание Automation QA

Опишите test metadata:

* readonly `testId`;
* обязательный `title`;
* необязательный `owner`.

## Мини-проект

Создайте функцию `formatMetadata`, которая принимает test metadata и возвращает строку с `testId` и `title`.
