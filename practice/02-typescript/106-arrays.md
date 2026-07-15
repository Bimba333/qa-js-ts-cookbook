# Практика: Arrays

## Концептуальные вопросы

1. Как записать массив строк через `T[]`?
2. Как записать массив чисел через `Array<T>`?
3. Что проверяет TypeScript при добавлении элемента в массив?
4. Для чего нужен `ReadonlyArray`?
5. Почему `ReadonlyArray` не является runtime-заморозкой массива?

## Чтение кода

Какой тип элементов ожидается в массиве?

```typescript
const statusCodes: number[] = [200, 201, 204];
```

## Предскажите результат проверки

Будет ли TypeScript считать код согласованным?

```typescript
const suites: string[] = ['smoke', 'regression'];
suites.push('api');
```

## Задание на отладку

Найдите проблему.

```typescript
const retries: number[] = [1, 2, 3];
retries.push('4');
```

## Задание Automation QA

Опишите типы для:

* списка окружений;
* списка допустимых HTTP status codes;
* readonly списка названий suites.

## Мини-проект

Создайте функцию `printSuites(suites: string[]): void`.

Она должна пройти по массиву и вывести каждое название suite.
