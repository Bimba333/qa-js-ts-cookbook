# Практика: void и never

## Концептуальные вопросы

1. Что означает `void` в типе функции?
2. Когда функция может иметь тип результата `never`?
3. Почему `throw` связан с `never`?
4. Чем намерение `void` отличается от значения `undefined`?
5. Где `void` и `never` полезны в QA helpers?

## Чтение кода

Какой тип результата подходит функции?

```typescript
function logStep(name: string) {
  console.log(name);
}
```

## Предскажите результат проверки

Что не так с ожиданием результата?

```typescript
function writeLog(message: string): void {
  console.log(message);
}

const result: string = writeLog('started');
```

## Задание на отладку

Исправьте тип результата.

```typescript
function fail(message: string): void {
  throw new Error(message);
}
```

## Задание Automation QA

Опишите два helper:

* `logStep`, который только пишет сообщение;
* `stopRun`, который всегда бросает ошибку.

Укажите подходящие типы результата.

## Мини-проект

Создайте `requireConfigValue(name: string, value: string): string`.

Если `value` пустой, функция должна вызвать helper, который всегда бросает ошибку.
