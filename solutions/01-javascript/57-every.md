# Решения: every()

## Концептуальные вопросы

### 1. Зачем существует `every()`?

Ответ: чтобы проверить, что все elements проходят condition.

Объяснение: это строгая проверка всего списка.

Распространённая ошибка: путать с `some()`.

Связь с Automation QA: release gate часто требует, чтобы все checks были successful.

### 2. Что означает "all must match"?

Ответ: каждый element должен вернуть `true` в callback.

Объяснение: одно нарушение ломает общее правило.

Распространённая ошибка: считать, что достаточно одного matching element.

Связь с Automation QA: один failed test может заблокировать release.

### 3. Что возвращает `every()`?

Ответ: `true` или `false`.

Объяснение: его можно сразу использовать в gate decision.

Распространённая ошибка: ожидать invalid object.

Связь с Automation QA: Boolean удобно использовать в release decision.

### 4. Чем `every()` отличается от `some()`?

Ответ: `every()` требует все matches, `some()` требует хотя бы один.

Объяснение: первый метод строгий, второй ищет хотя бы одно совпадение.

Распространённая ошибка: использовать `some()` для строгой проверки release.

Связь с Automation QA: "есть ли failed?" и "все ли passed?" — разные вопросы.

### 5. Почему `every()` подходит для release gate?

Ответ: release gate часто требует, чтобы все tests удовлетворяли правилу.

Объяснение: release нельзя разрешать по частично успешному списку.

Распространённая ошибка: проверять только первый test.

Связь с Automation QA: release validation должна охватывать весь set.

### 6. Что возвращает `every()` для empty array?

Ответ: `true`.

Объяснение: в empty array нет element, который нарушил condition.

Распространённая ошибка: ожидать `false` без отдельной проверки на пустой список.

Связь с Automation QA: пустой test run стоит проверять отдельно, если это недопустимо.

## Чтение кода

Ответ: будет выведено `false`.

Объяснение: `T-2` нарушает правило "all passed".

Распространённая ошибка: ожидать object `T-2`.

Связь с Automation QA: release gate должен показать failure result.

## Предскажите результат выполнения

Ответ:

```text
true
```

Объяснение: empty array не содержит element, который нарушает condition.

Распространённая ошибка: не учитывать empty run отдельно.

Связь с Automation QA: если empty run запрещен, нужна дополнительная проверка length.

## Debugging

Ответ:

```javascript
const allHavePriority = testCases.every(function (testCase) {
  return testCase.priority !== undefined;
});
```

Объяснение: без `return` правило не применяется корректно.

Распространённая ошибка: забыть `return`.

Связь с Automation QA: metadata validation должна быть явной.

## QA scenario

Ответ:

```javascript
const canRelease = testCases.every(function (testCase) {
  return testCase.status === 'passed';
});
```

Объяснение: это правило проверяет весь release set.

Распространённая ошибка: использовать `some()` и разрешить release из-за одного passed test.

Связь с Automation QA: release gate — строгая проверка.

## Мини-проект

Ответ:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
  { id: 'T-5', title: 'refund order', status: 'passed', priority: 'medium' },
];

const allPassed = testCases.every(function (testCase) {
  return testCase.status === 'passed';
});

const allHavePriority = testCases.every(function (testCase) {
  return testCase.priority !== undefined;
});

const allHaveTitle = testCases.every(function (testCase) {
  return testCase.title !== '';
});

console.log(allPassed ? 'Release allowed' : 'Release blocked');
console.log(allHavePriority);
console.log(allHaveTitle);
```

Объяснение: каждый `every()` проверяет одно правило для всех tests.

Распространённая ошибка: объединить все правила в одну длинную condition слишком рано.

Связь с Automation QA: release gate состоит из нескольких понятных checks.
