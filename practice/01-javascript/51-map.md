# Практика: map()

## Концептуальные вопросы

1. Зачем существует `map()`?
2. Чем `map()` отличается от `forEach()`?
3. Что callback должен вернуть внутри `map()`?
4. Что возвращает сам `map()`?
5. Изменяет ли `map()` исходный array?
6. Почему `map()` подходит для report generation?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const labels = testCases.map(function (testCase) {
  return `${testCase.id}: ${testCase.title}`;
});

console.log(labels);
```

Ответьте:

* сколько elements будет в `labels`;
* что находится в каждом element;
* изменился ли `testCases`.

## Предскажите результат выполнения

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const result = testCases.map(function (testCase) {
  return testCase.status;
});

console.log(result);
```

Сначала запишите ответ без запуска.

## Debugging

Автор хотел получить array titles.

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

const titles = testCases.map(function (testCase) {
  testCase.title;
});

console.log(titles);
```

Что не так? Исправьте код.

## QA scenario

Создайте `ciPayload` из `testCases`.

Каждый output element должен иметь shape:

```javascript
{
  testId: 'T-1',
  name: 'login smoke',
  priority: 'high'
}
```

## Мини-проект

Создайте файл `playground/map-test-report.js`.

Требования:

* создать array `testCases` из четырех objects с fields `id`, `title`, `status`, `priority`;
* через `map()` получить array строк отчета;
* через второй `map()` получить array objects для CI;
* вывести оба результата;
* не изменять исходный `testCases`.
