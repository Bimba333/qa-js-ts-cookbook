# Практика: any и unknown

## Концептуальные вопросы

1. Почему `any` опасен?
2. Чем `unknown` отличается от `any`?
3. Почему `unknown` требует проверки перед использованием?
4. Где в QA-проекте появляются неизвестные данные?
5. Почему `unknown` не является runtime-валидацией?

## Чтение кода

Что TypeScript разрешит, если значение имеет тип `any`?

```typescript
const body: any = { status: 'ok' };

console.log(body.status);
console.log(body.missing.value);
```

## Предскажите результат проверки

Будет ли TypeScript разрешать вызов `toUpperCase()`?

```typescript
function printValue(value: unknown): void {
  console.log(value.toUpperCase());
}
```

## Задание на отладку

Исправьте код без использования `any`.

```typescript
function normalize(value: unknown): string {
  return value.toUpperCase();
}
```

## Задание Automation QA

API helper получает `unknown` response body.

Опишите, какие проверки нужно сделать перед тем, как считать значение строкой.

## Мини-проект

Создайте функцию `printResponseStatus(value: unknown): void`.

Функция должна печатать статус только если значение является строкой.
