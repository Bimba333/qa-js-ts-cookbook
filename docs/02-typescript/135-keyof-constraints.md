# keyof Constraints

## Связь с предыдущей главой

Generic constraint позволяет требовать минимальную форму объекта.

Теперь нужно связать два параметра: объект и ключ, который точно существует в этом объекте.

## Главный вопрос

Как разрешить только ключи существующего объекта?

## Мотивация

В JavaScript можно обратиться к любому ключу:

```ts
function readValue(object: object, key: string) {
  // TypeScript не знает, есть ли такой ключ.
}
```

TypeScript может сделать такой доступ безопаснее через `keyof`.

## Теория

`keyof` получает union ключей типа:

```ts
function pickValue<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
): ObjectType[Key] {
  return object[key];
}
```

`Key extends keyof ObjectType` означает: `key` может быть только ключом переданного объекта.

`ObjectType[Key]` возвращает тип значения по этому ключу.

## Внутренний механизм

```mermaid
flowchart TD
    A[ObjectType] --> B[keyof ObjectType]
    B --> C[Key ограничен существующими ключами]
    C --> D[object[key] имеет точный тип]
```

Проверка работает на этапе компиляции. Во время выполнения остается обычный доступ к свойству.

## Главная ментальная модель

`keyof` превращает форму объекта в список разрешенных ключей.

## Практические примеры

```ts
function pickValue<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
): ObjectType[Key] {
  return object[key];
}

const config = {
  baseUrl: "https://service.local",
  retries: 2,
};

const retries = pickValue(config, "retries");
```

## Automation QA

Во вспомогательной функции для конфигурации можно запретить несуществующие ключи:

```ts
const environment = {
  name: "staging",
  baseUrl: "https://staging.example.test",
  retries: 1,
};

const baseUrl = pickValue(environment, "baseUrl");
```

Если указать ключ, которого нет в объекте, TypeScript покажет ошибку.

## Распространённые ошибки

Ошибка — использовать просто `string` для ключа:

```ts
function read(object: { id: string }, key: string) {
  // object[key] небезопасен
}
```

Если ключ связан с объектом, лучше выразить эту связь через `Key extends keyof ObjectType`.

## Практика

Практические задания находятся в конце страницы.

## Краткие итоги

- `keyof` получает union ключей объекта.
- `K extends keyof T` ограничивает ключ существующими свойствами.
- `T[K]` возвращает тип значения по ключу.
- Это связь на этапе компиляции, а не валидация во время выполнения.
- Такой прием полезен для вспомогательных функций конфигурации и безопасного выбора свойств.

## Переход

Мы научились связывать объект и ключ. Теперь сделаем параметризуемыми собственные типы: aliases и interfaces.
