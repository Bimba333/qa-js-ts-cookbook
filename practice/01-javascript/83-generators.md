# Практика: Generators

## Концептуальные вопросы

1. Что создает `function*`?
2. Когда начинает выполняться тело функции-генератора?
3. Что делает `yield`?
4. Почему генератор упрощает создание iterator?
5. Почему обычный генератор из этой главы не является асинхронным механизмом?

## Чтение кода

Прочитайте код и объясните порядок значений:

```javascript
function* steps() {
  yield 'prepare';
  yield 'run';
  yield 'report';
}

const iterator = steps();

console.log(iterator.next());
console.log(iterator.next());
```

## Предскажите результат выполнения

```javascript
function* artifacts() {
  yield 'logs';
  yield 'screenshot';
}

for (const artifact of artifacts()) {
  console.log(artifact);
}
```

## Отладка

Почему в переменной `result` находится не строка?

```javascript
function* getTestName() {
  yield 'login';
}

const result = getTestName();
console.log(result);
```

## Задание Automation QA

Создайте функцию-генератор `reportEntries()`, которая через `yield` выдает:

* `collect logs`;
* `capture screenshot`;
* `upload report`.

Обойдите его через `for...of`.

## Мини-проект

Создайте функцию-генератор `failedTestArtifacts(testId)`, которая выдает три объекта артефактов для упавшего теста: лог, скриншот и trace. Выведите их в формате `T-1 -> screenshot`.
