# Решения: Chaining basics

## Концептуальные вопросы

### 1. Зачем нужен chaining?

Ответ: чтобы соединять несколько array steps в один читаемый pipeline.

Объяснение: output одного step становится input следующего step.

Распространённая ошибка: делать chain длиннее, чем его удобно читать.

Связь с Automation QA: CI report pipeline часто состоит из selection и formatting.

### 2. Почему после `filter()` можно вызвать `map()`?

Ответ: потому что `filter()` возвращает array.

Объяснение: следующий step продолжает работать с array.

Распространённая ошибка: думать, что `filter()` возвращает один element.

Связь с Automation QA: selected tests можно сразу преобразовать в report lines.

### 3. Как читать chain слева направо?

Ответ: как последовательность states.

Объяснение: каждый step создает следующее состояние данных.

Распространённая ошибка: пытаться понять chain снизу вверх.

Связь с Automation QA: pipeline должен читаться как workflow.

### 4. Почему порядок `filter().map()` и `map().filter()` важен?

Ответ: потому что каждый step меняет data shape.

Объяснение: если сначала превратить object в string, следующий `filter()` уже не сможет читать `testCase.status`.

Распространённая ошибка: фильтровать по fields, которые исчезли после `map()`.

Связь с Automation QA: report formatting лучше делать после selection, если selection использует metadata.

### 5. Когда лучше разбить chain на named variables?

Ответ: когда intermediate state важен для понимания.

Объяснение: named variable показывает смысл шага.

Распространённая ошибка: считать компактность важнее читаемости.

Связь с Automation QA: test pipeline должен легко читать другой инженер.

### 6. Почему side effects лучше не смешивать с transformation chain?

Ответ: chain должен описывать подготовку данных.

Объяснение: logging, sending commands и mutation затрудняют чтение pipeline.

Распространённая ошибка: добавлять `console.log` или изменения objects внутрь `map()`.

Связь с Automation QA: reporting pipeline и execution side effects лучше разделять.

## Чтение кода

Ответ:

```text
[
  'T-1: login smoke',
  'T-2: create order'
]
```

Объяснение: chain сначала сужает список, затем форматирует выбранные tests.

Распространённая ошибка: включить `T-3`, хотя priority у него `medium`.

Связь с Automation QA: так готовится high priority report.

## Предскажите результат выполнения

Ответ:

```text
['T-1', 'T-3']
```

Объяснение: сначала выбираются passed tests, затем из них берется `id`.

Распространённая ошибка: ожидать objects вместо ids.

Связь с Automation QA: это простой pipeline для списка successful checks.

## Debugging

Ответ:

```javascript
const result = testCases
  .filter(function (testCase) {
    return testCase.status === 'failed';
  })
  .map(function (testCase) {
    return `${testCase.id}: ${testCase.title}`;
  });
```

Объяснение: сначала нужно отфильтровать objects по `status`, пока поле `status` еще доступно. После `map()` elements становятся strings.

Распространённая ошибка: поменять data shape до того, как все нужные fields использованы.

Связь с Automation QA: selection по metadata обычно выполняется до formatting.

## QA scenario

Ответ:

```javascript
const reportLines = testCases
  .filter(function (testCase) {
    return testCase.status !== 'skipped';
  })
  .map(function (testCase) {
    return `${testCase.id} - ${testCase.title} - ${testCase.status}`;
  });
```

Объяснение: chain сначала выбирает CI-ready tests, потом форматирует строки.

Распространённая ошибка: пытаться проверять `status` после преобразования в string.

Связь с Automation QA: skipped tests часто не входят в execution report.

## Мини-проект

Ответ:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
  { id: 'T-5', title: 'refund order', status: 'failed', priority: 'medium' },
];

const highPriorityReport = testCases
  .filter(function (testCase) {
    return testCase.priority === 'high';
  })
  .map(function (testCase) {
    return `${testCase.id}: ${testCase.title}`;
  });

const failedReport = testCases
  .filter(function (testCase) {
    return testCase.status === 'failed';
  })
  .map(function (testCase) {
    return `${testCase.id}: ${testCase.title} failed`;
  });

console.log(highPriorityReport);
console.log(failedReport);
```

Объяснение: оба chains сначала выбирают нужные tests, затем форматируют результат.

Распространённая ошибка: объединять unrelated reports в один нечитаемый chain.

Связь с Automation QA: CI dashboards часто требуют несколько отдельных report arrays.
