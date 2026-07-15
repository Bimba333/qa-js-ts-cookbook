# Практика: Index Signatures

## Концептуальные вопросы

1. Что описывает index signature?
2. Когда index signature лучше обычного object type?
3. Почему значения словаря должны иметь один тип?
4. Чем string index signature отличается от number index signature?
5. Где index signatures полезны в QA-коде?

## Чтение кода

Какой тип должны иметь значения?

```typescript
const headers: { [key: string]: string } = {
  accept: 'application/json',
};
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
const statusTexts: { [code: number]: string } = {
  200: 'OK',
  500: 'Server Error',
};
```

## Задание на отладку

Найдите проблему.

```typescript
const headers: { [key: string]: string } = {
  accept: 'application/json',
  retries: 2,
};
```

## Задание Automation QA

Опишите тип для metadata, где ключи заранее неизвестны, а значения всегда строки.

## Мини-проект

Создайте функцию `printHeaders`, которая принимает словарь строк и выводит пары ключ-значение.
