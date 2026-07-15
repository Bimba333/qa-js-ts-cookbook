# Практика: Mapped Types

## Концептуальные вопросы

1. Что делает mapped type?
2. Почему mapped type не создает объект во время выполнения?
3. Какую роль играет `keyof` внутри mapped type?

## Чтение кода

```ts
type Flags<Type> = {
  [Key in keyof Type]: boolean;
};

type LoginForm = {
  email: string;
  password: string;
};

type LoginFlags = Flags<LoginForm>;
```

Какую форму получает `LoginFlags`?

## Предскажите результат проверки

```ts
type Copy<Type> = {
  [Key in keyof Type]: Type[Key];
};

type User = {
  id: string;
};

const user: Copy<User> = {
  id: 123,
};
```

Что покажет TypeScript?

## Анализ типа

Объясните, что делает `[Key in keyof Type]`.

## Задание на отладку

Исправьте mapped type:

```ts
type Errors<Form> = {
  [Key in Form]: string[];
};
```

## Задание Automation QA

Создайте `FieldErrors<Form>`, где каждому полю формы соответствует `string[]`.

## Мини-проект

Создайте `ReadonlyCopy<Type>` и `RequiredCopy<Type>` через mapped types.
