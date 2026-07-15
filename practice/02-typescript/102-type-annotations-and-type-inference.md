# Практика: Type Annotations and Type Inference

## Концептуальные вопросы

1. Что такое `type annotation`?
2. Что такое `type inference`?
3. Почему не нужно аннотировать каждую локальную переменную?
4. Почему параметры функций часто требуют явной аннотации?
5. Как аннотации помогают читать QA helpers?

## Чтение кода

Какие типы TypeScript выведет сам?

```typescript
const suiteName = 'smoke';
const retryCount = 2;
const enabled = true;
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
function buildLabel(name: string, count: number): string {
  return `${name}: ${count}`;
}

buildLabel('api', 3);
```

## Задание на отладку

Найдите проблему.

```typescript
function setRetries(count: number): void {
  console.log(count);
}

setRetries('3');
```

## Задание Automation QA

Опишите, где в helper лучше использовать inference, а где annotation:

```typescript
const defaultTimeout = 5000;

function waitForElement(selector, timeout) {
  console.log(selector, timeout);
}
```

## Мини-проект

Создайте маленький typed helper `buildSuiteTitle`.

Он должен принимать:

* название suite;
* количество тестов;
* флаг smoke.

Функция должна возвращать строку.
