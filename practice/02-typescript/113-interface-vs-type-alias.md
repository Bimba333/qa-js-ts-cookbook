# Практика: Interface vs Type Alias

## Концептуальные вопросы

1. Когда interface удобен?
2. Когда type alias удобен?
3. Почему не нужно превращать выбор в спор о стиле?
4. Что общего у interface и type alias после компиляции?
5. Как выбрать инструмент для QA-кода?

## Чтение кода

Какой инструмент выбран для поведения, а какой для данных?

```typescript
interface Writer {
  write(message: string): void;
}

type ReportData = {
  title: string;
  passed: boolean;
};
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
interface Writer {
  write(message: string): void;
}

const writer: Writer = {
  write(message: string): void {
    console.log(message);
  },
};
```

## Задание на отладку

Найдите проблему.

```typescript
type LoginPayload = {
  email: string;
  password: string;
};

const payload: LoginPayload = {
  email: 'qa@example.test',
};
```

## Задание Automation QA

Выберите `interface` или `type alias` для:

* объекта с методом `write`;
* данных login request.

## Мини-проект

Создайте `interface Reporter`, `type ReportData` и функцию `writeReport`.
