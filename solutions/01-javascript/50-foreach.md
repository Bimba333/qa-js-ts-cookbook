# Решения: forEach()

## Концептуальные вопросы

### 1. Зачем существует `forEach()`?

Ответ: чтобы выполнить action для каждого element array.

Объяснение: это method form для repeated side effect.

Распространённая ошибка: ожидать от него новый array.

Связь с Automation QA: удобно регистрировать или логировать test cases.

### 2. Что передается в `forEach()`?

Ответ: function, которая будет вызвана для каждого element.

Объяснение: эта function описывает action.

Распространённая ошибка: передать результат вызова function вместо function.

Связь с Automation QA: runner action можно оформить отдельной function.

### 3. Что получает callback?

Ответ: current element, а при необходимости index.

Объяснение: первый parameter — element.

Распространённая ошибка: считать первый parameter index.

Связь с Automation QA: current test case доступен внутри callback.

### 4. Для каких задач подходит `forEach()`?

Ответ: для side effects: log, register, execute action.

Объяснение: он не собирает новый array.

Распространённая ошибка: использовать его для transformation.

Связь с Automation QA: запуск или регистрация test cases — side effect.

### 5. Возвращает ли `forEach()` новый array?

Ответ: нет.

Объяснение: return value `forEach()` — `undefined`.

Распространённая ошибка: сохранять результат в переменную как transformed array.

Связь с Automation QA: reports нужно собирать явно, если они нужны.

### 6. Чем отличается от `for...of`?

Ответ: `for...of` — loop syntax, `forEach()` — array method with callback.

Объяснение: обе формы могут пройти по elements, но запись и способ передачи action отличаются.

Распространённая ошибка: думать, что одна форма всегда заменяет другую.

Связь с Automation QA: выбирайте форму, которая читается проще в конкретном helper.

## Чтение кода

Ответ: function вызовется три раза; `testCase` получит `login`, `create order`, `payment`; side effect — вывод в console.

Объяснение: `forEach()` вызывает callback для каждого element.

Распространённая ошибка: ждать, что callback вызовется один раз со всем array.

Связь с Automation QA: каждый test case регистрируется отдельно.

## Предскажите результат выполнения

Ответ:

```text
login
payment
undefined
```

Объяснение: callback выводит elements, а сам `forEach()` возвращает `undefined`.

Распространённая ошибка: ожидать array в `result`.

Связь с Automation QA: если нужен report array, его нужно строить отдельно или изучить future methods.

## Отладка

Ответ:

`titles` будет `undefined`, потому что `forEach()` не возвращает новый array.

В рамках этой главы можно сделать side effect явно:

```javascript
const tests = [{ title: 'login' }, { title: 'payment' }];
const titles = [];

tests.forEach(function (testCase) {
  titles.push(testCase.title);
});

console.log(titles);
```

Объяснение: callback return ignored by `forEach()`.

Распространённая ошибка: использовать `return` внутри callback как collection builder.

Связь с Automation QA: report lines нужно собирать осознанно.

## QA-сценарий

Ответ:

```javascript
const testRun = [
  { id: 'T-1', title: 'login smoke' },
  { id: 'T-2', title: 'pay order' },
];

testRun.forEach(function (testCase) {
  console.log(`Register ${testCase.id}: ${testCase.title}`);
});
```

Объяснение: callback выполняется для каждого test case.

Распространённая ошибка: пытаться прочитать `testRun.title`.

Связь с Automation QA: регистрация каждого test case — типичный side effect.

## Мини-проект

Ответ:

```javascript
const testRun = [
  { id: 'T-1', title: 'login smoke' },
  { id: 'T-2', title: 'create order' },
  { id: 'T-3', title: 'pay order' },
];

testRun.forEach(function (testCase) {
  console.log(`Start ${testCase.id}: ${testCase.title}`);
  console.log(`Finish ${testCase.id}: ${testCase.title}`);
});

console.log(testRun);
```

Объяснение: `forEach()` используется для side effects: start and finish messages.

Распространённая ошибка: ожидать returned execution results from `forEach()`.

Связь с Automation QA: runner actions часто выполняются для каждого prepared test case.
