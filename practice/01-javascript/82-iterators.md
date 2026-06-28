# Практика: Iterators

## Концептуальные вопросы

1. Что возвращает метод `next()`?
2. Для чего нужен `done`?
3. Что находится в `value`?
4. Чем iterator отличается от iterable?
5. Почему `for...of` может остановить обход?

## Чтение кода

Прочитайте код и объясните каждый результат:

```javascript
const tests = ['login', 'checkout'];
const iterator = tests[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

## Предскажите результат выполнения

```javascript
const artifacts = ['logs'];
const iterator = artifacts[Symbol.iterator]();

console.log(iterator.next().done);
console.log(iterator.next().done);
```

## Отладка

В чем проблема в коде?

```javascript
const entries = ['logs'];
const iterator = entries[Symbol.iterator]();

console.log(iterator.next().value.toUpperCase());
console.log(iterator.next().value.toUpperCase());
```

## Задание Automation QA

Создайте массив из двух тест-кейсов и вручную получите iterator. Через `next()` выведите каждый тест-кейс и отдельно покажите результат после завершения итерации.

## Мини-проект

Напишите функцию `runIterator(iterator)`, которая вызывает `next()` до `done: true` и выводит каждое `value`. Проверьте ее на массиве отчетных записей.
