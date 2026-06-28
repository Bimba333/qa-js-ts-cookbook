# Chaining basics

## Связь с предыдущей главой

Предыдущие главы показали несколько отдельных array operations.

В реальном test pipeline эти steps часто идут друг за другом: сначала выбираются нужные test cases, потом они преобразуются в формат отчета.

## Главный вопрос

> Как объединить transformations step by step?

Ответ этой главы: использовать chaining basics для `map()` и `filter()`.

## Предварительные требования

Для этой главы нужно понимать:

* что `map()` возвращает новый array;
* что `filter()` возвращает новый array;
* что результат одного expression можно использовать дальше;
* что pipeline должен читаться по шагам.

Не требуется знать следующие array methods или сложные pipeline patterns. Они будут изучаться позже.

## Цели обучения

После главы вы будете понимать:

* зачем нужен chaining;
* почему chaining возможен после `map()` и `filter()`;
* как читать chain слева направо;
* как не смешивать слишком много действий;
* как строить простой QA processing pipeline.

## Мотивация

Есть test cases:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
];
```

Нужно:

* выбрать high priority tests;
* превратить их в строки для CI report.

Можно сделать двумя переменными:

```javascript
const highPriorityTests = testCases.filter(function (testCase) {
  return testCase.priority === 'high';
});

const reportLines = highPriorityTests.map(function (testCase) {
  return `${testCase.id}: ${testCase.title}`;
});
```

Chaining записывает тот же pipeline рядом:

```javascript
const reportLines = testCases
  .filter(function (testCase) {
    return testCase.priority === 'high';
  })
  .map(function (testCase) {
    return `${testCase.id}: ${testCase.title}`;
  });
```

## Теория

Chaining возможен, когда result одного step подходит как вход следующего step. В этой главе мы рассматриваем простой pipeline: исходный массив проходит через несколько последовательных operations и превращается в final array.

## Внутренний механизм

Внутри chain нет отдельной магии. JavaScript сначала вычисляет первый method call, получает intermediate result, затем вызывает следующий method уже на этом result.

Каждый step должен иметь понятную цель. Если цель неочевидна, лучше вынести промежуточный result в named variable.

## Главная ментальная модель

Главная модель этой главы: **pipeline of transformations**.

```text
source test cases
│
▼
step 1: select needed tests
│
▼
step 2: format selected tests
│
▼
report data
```

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-54/
```

Запуск:

```bash
node examples/01-javascript/chapter-54/01-filter-map-chain.js
node examples/01-javascript/chapter-54/02-map-filter-chain.js
node examples/01-javascript/chapter-54/03-readable-steps.js
node examples/01-javascript/chapter-54/04-ci-report-pipeline.js
node examples/01-javascript/chapter-54/05-common-mistakes.js
```

## Примеры Automation QA

CI report pipeline:

```javascript
const reportLines = testCases
  .filter(function (testCase) {
    return testCase.priority === 'high';
  })
  .map(function (testCase) {
    return `${testCase.id}: ${testCase.title} - ${testCase.status}`;
  });
```

Такой chain читается как business workпоток: взять список test cases, оставить high priority и подготовить строки отчета.

## Распространённые ошибки

### Ошибка 1. Делать chain слишком длинным

Если chain трудно читать, лучше сохранить intermediate result в named variable.

### Ошибка 2. Путать порядок steps

`filter().map()` и `map().filter()` могут означать разные pipelines.

### Ошибка 3. Добавлять side effects внутрь chain

Chaining лучше подходит для data transformation pipeline. Side effects стоит держать отдельно.

## Краткие итоги

Chaining basics соединяет несколько простых steps в один pipeline.

Главное: chain должен читаться как последовательность понятных состояния, а не как плотная строка трюков.

## Переход к следующей главе

Мы собрали первый processing pipeline. Дальше раздел Arrays продолжит разбирать методы, которые помогают искать, проверять и упорядочивать данные.

Практика:

```text
practice/01-javascript/54-chaining.md
```

Решения:

```text
solutions/01-javascript/54-chaining.md
```
