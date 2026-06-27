# Решения: map()

## Концептуальные вопросы

### 1. Зачем существует `map()`?

Ответ: чтобы преобразовать каждый element array и получить новый array.

Объяснение: каждый return value callback становится element результата.

Распространённая ошибка: использовать `map()` только ради side effect.

Связь с Automation QA: test cases часто нужно преобразовать в report lines или CI payload.

### 2. Чем `map()` отличается от `forEach()`?

Ответ: `forEach()` выполняет action, а `map()` возвращает новый array transformed values.

Объяснение: return value callback в `forEach()` не собирается, а в `map()` становится element нового array.

Распространённая ошибка: ожидать новый array от `forEach()`.

Связь с Automation QA: для вывода log подходит `forEach()`, для подготовки report data — `map()`.

### 3. Что callback должен вернуть внутри `map()`?

Ответ: transformed value для текущего element.

Объяснение: это value попадет в result array на соответствующую позицию.

Распространённая ошибка: забыть `return` и получить `undefined`.

Связь с Automation QA: отсутствие return может сломать CI payload.

### 4. Что возвращает сам `map()`?

Ответ: новый array.

Объяснение: размер результата связан с количеством input elements.

Распространённая ошибка: думать, что `map()` изменяет source array.

Связь с Automation QA: source test cases остаются доступными для следующих pipeline steps.

### 5. Изменяет ли `map()` исходный array?

Ответ: нет, сам `map()` возвращает новый array.

Объяснение: source array остается отдельным входом для pipeline.

Распространённая ошибка: ожидать, что `testCases` превратится в strings.

Связь с Automation QA: original test metadata остается целой.

### 6. Почему `map()` подходит для report generation?

Ответ: report generation часто требует преобразовать каждый test case в строку или object другого формата.

Объяснение: для каждого input test case появляется одна строка или один payload object.

Распространённая ошибка: собирать report через side effects без явного result array.

Связь с Automation QA: `map()` делает шаг "test cases -> report data" читаемым.

## Чтение кода

Ответ:

```text
[
  'T-1: login smoke',
  'T-2: create order'
]
```

Объяснение: в `labels` будет два elements, потому что source array содержит два test cases. Каждый output element — строка из `id` и `title`. `testCases` не изменился.

Распространённая ошибка: думать, что `labels` содержит original objects.

Связь с Automation QA: это типичный шаг подготовки строк отчета.

## Предскажите результат выполнения

Ответ:

```text
['passed', 'failed']
```

Объяснение: callback возвращает `testCase.status` для каждого element.

Распространённая ошибка: ожидать objects вместо statuses.

Связь с Automation QA: так можно получить список statuses для дальнейшей обработки.

## Debugging

Ответ:

```javascript
const titles = testCases.map(function (testCase) {
  return testCase.title;
});
```

Объяснение: без `return` callback возвращает `undefined`, поэтому result array будет состоять из `undefined`.

Распространённая ошибка: писать expression внутри callback, но не возвращать его.

Связь с Automation QA: payload с `undefined` вместо titles может сломать отчет.

## QA scenario

Ответ:

```javascript
const ciPayload = testCases.map(function (testCase) {
  return {
    testId: testCase.id,
    name: testCase.title,
    priority: testCase.priority,
  };
});
```

Объяснение: каждый test case превращается в object нужного формата.

Распространённая ошибка: менять исходный object вместо создания output object.

Связь с Automation QA: CI часто требует конкретный shape payload.

## Мини-проект

Ответ:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
];

const reportLines = testCases.map(function (testCase) {
  return `${testCase.id}: ${testCase.title} - ${testCase.status}`;
});

const ciPayload = testCases.map(function (testCase) {
  return {
    testId: testCase.id,
    name: testCase.title,
    priority: testCase.priority,
  };
});

console.log(reportLines);
console.log(ciPayload);
console.log(testCases);
```

Объяснение: два `map()` создают два разных output arrays из одного source.

Распространённая ошибка: смешивать два разных output formats в одном `map()`.

Связь с Automation QA: один source test list может использоваться для разных reporting integrations.
