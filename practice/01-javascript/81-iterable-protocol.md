# Практика: Iterable Protocol

## Концептуальные вопросы

1. Почему `for...of` работает с массивом?
2. Что делает `Symbol.iterator` в модели итерации?
3. Почему обычный объект не обходится через `for...of` напрямую?
4. Чем iterable отличается от массива?
5. Какие встроенные значения являются iterable?

## Чтение кода

Прочитайте код и объясните, почему он работает:

```javascript
const priorities = new Set(['high', 'medium', 'low']);

for (const priority of priorities) {
  console.log(priority);
}
```

## Предскажите результат выполнения

```javascript
const value = 'QA';

for (const part of value) {
  console.log(part);
}
```

## Отладка

Почему этот код приводит к ошибке?

```javascript
const testSuite = {
  smoke: 'login test',
  regression: 'checkout test',
};

for (const test of testSuite) {
  console.log(test);
}
```

## Задание Automation QA

Создайте массив `testCases` из трех объектов с полями `id` и `title`. Обойдите массив через `for...of` и выведите строку:

```text
T-1: login works
```

## Мини-проект

Создайте три коллекции:

* массив тест-кейсов;
* строку с префиксом запуска;
* `Set` с приоритетами.

Для каждой коллекции покажите обход через `for...of` и объясните, почему он возможен.
