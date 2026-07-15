# Практика: keyof

## Концептуальные вопросы

1. Что возвращает `keyof Type`?
2. Почему `keyof` не проверяет объект во время выполнения?
3. Чем `keyof` отличается от `Object.keys()`?

## Чтение кода

```ts
type User = {
  id: string;
  email: string;
  active: boolean;
};

type UserKey = keyof User;
```

Какие значения допустимы для `UserKey`?

## Предскажите результат проверки

```ts
type LocatorMap = {
  submitButton: string;
  emailInput: string;
};

const locatorName: keyof LocatorMap = "passwordInput";
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему `Object.keys(user)` не становится автоматически `Array<keyof User>`.

## Задание на отладку

Исправьте helper:

```ts
type Report = {
  title: string;
  status: "passed" | "failed";
};

function readReportField(report: Report, field: string) {
  return report[field];
}
```

## Задание Automation QA

Создайте тип `PageLocators` с ключами `loginButton`, `emailInput`, `passwordInput`.

Напишите функцию `getLocatorName(name: keyof PageLocators): keyof PageLocators`.

## Мини-проект

Создайте `selectField<ObjectType>(object: ObjectType, key: keyof ObjectType)`, который возвращает значение по ключу.
