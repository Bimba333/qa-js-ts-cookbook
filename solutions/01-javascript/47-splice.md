# Решения: splice()

## Концептуальные вопросы

### 1. Зачем существует `splice()`?

Ответ: чтобы изменять array в произвольной позиции, включая середину.

Объяснение: `push()` и `pop()` работают с концом, `shift()` и `unshift()` — с началом. `splice()` выбирает позицию через `startIndex`.

Распространённая ошибка: считать `splice()` просто удалением.

Связь с Automation QA: test plan часто нужно обновить между уже существующими проверками.

### 2. Почему `push()` и `unshift()` не подходят?

Ответ: они добавляют только в конец или начало.

Объяснение: середина требует указания index.

Распространённая ошибка: добавлять test case в конец и потом полагаться на неверный порядок.

Связь с Automation QA: порядок test cases может быть частью workflow.

### 3. Что означает `startIndex`?

Ответ: позицию, с которой `splice()` начинает изменение.

Объяснение: operation начинается именно с этого index.

Распространённая ошибка: считать `startIndex` количеством удаляемых elements.

Связь с Automation QA: неверный index удалит или заменит не тот test case.

### 4. Что означает `deleteCount`?

Ответ: количество elements, которые нужно удалить.

Объяснение: `0` означает вставку без удаления.

Распространённая ошибка: забыть поставить `0` при вставке.

Связь с Automation QA: можно случайно удалить обязательную проверку.

### 5. Что возвращает `splice()`?

Ответ: array удаленных elements.

Объяснение: если ничего не удалено, возвращается empty array.

Распространённая ошибка: ожидать updated исходный массив как return value.

Связь с Automation QA: removed tests можно залогировать.

### 6. Изменяет ли `splice()` исходный array?

Ответ: да.

Объяснение: `splice()` выполняет middle modification in place. Array нужно читать как mutable состояние object: до вызова у него одно состояние, после вызова — другое.

Распространённая ошибка: использовать его там, где нужна безопасная копия.

Связь с Automation QA: изменение shared plan может повлиять на следующий test run.

### 7. Почему array после `splice()` нужно читать как новое состояние?

Ответ: потому что `splice()` изменяет тот же array.

Объяснение: операция не создает независимый список. Она берет current состояние array и переводит его в next состояние. Любая следующая операция работает уже с этим новым состоянием.

Распространённая ошибка: мысленно применять несколько `splice()` к исходному array, как будто предыдущих изменений не было.

Связь с Automation QA: если план тестов обновляется несколькими helper-функциями, каждая следующая функция должна учитывать уже измененный plan.

### 8. Почему старые indexes после `splice()` становятся небезопасными?

Ответ: потому что elements после места изменения могут сдвинуться.

Объяснение: вставка сдвигает часть elements вправо, удаление — влево. Поэтому index, который раньше указывал на один test case, после mutation может указывать на другой.

Распространённая ошибка: сохранить index заранее и использовать его после изменения array.

Связь с Automation QA: старый index может привести к удалению или замене неправильного test case.

## Чтение кода

Ответ:

```text
testCases -> ['login', 'new checkout', 'payment', 'logout']
removed   -> ['old checkout']
```

Объяснение: operation начинается с index `1`, удаляет один element и вставляет `new checkout`. `payment` остается на index `2` только потому, что один element был удален и один element был вставлен. Состояние array все равно изменилось: на index `1` теперь находится другой test case. Если бы количество удаленных и вставленных elements отличалось, indexes справа изменились бы.

Распространённая ошибка: думать, что `removed` содержит `new checkout`.

Связь с Automation QA: replacement теста должен быть явным и отслеживаемым.

## Предскажите результат выполнения

Ответ:

```text
['login', 'create order', 'apply discount', 'pay order']
4
```

Объяснение: `deleteCount` равен `0`, поэтому ничего не удаляется, а новый test case вставляется перед old index `2`.

После операции состояние меняется:

```text
before: index 2 -> pay order
after:  index 2 -> apply discount
        index 3 -> pay order
```

Распространённая ошибка: ожидать, что `pay order` будет удален, или продолжать считать, что он находится на index `2`.

Связь с Automation QA: так можно расширить сценарий без потери существующих checks.

## Отладка

Ответ:

```javascript
const tests = ['login', 'deprecated test', 'payment', 'logout'];

tests.splice(1, 1);

console.log(tests);
```

Объяснение: нужно удалить один element, поэтому `deleteCount` должен быть `1`, а не `2`.

Если после этого выполняется следующий `splice()`, его index нужно выбирать по новому состоянию `tests`, потому что после удаления elements справа сдвигаются влево.

Распространённая ошибка: перепутать end index и count.

Связь с Automation QA: случайное удаление соседнего test case может ослабить regression coverage.

## QA-сценарий

Ответ:

```javascript
const regressionPlan = [
  'login smoke',
  'create order',
  'pay order',
  'logout smoke',
];

regressionPlan.splice(2, 0, 'apply discount');

console.log(regressionPlan);
```

Объяснение: `pay order` находится на index `2`; вставка с `deleteCount` `0` помещает новый test case перед ним.

После операции `pay order` уже находится на index `3`, поэтому любой следующий доступ по старому index `2` будет небезопасным.

Распространённая ошибка: использовать `push()` и нарушить порядок.

Связь с Automation QA: discount должен проверяться до payment.

## Мини-проект

Ответ:

```javascript
const plan = [
  'login smoke',
  'deprecated checkout',
  'create order',
  'old payment',
  'logout smoke',
];

const removedDeprecated = plan.splice(1, 1);
// state: ['login smoke', 'create order', 'old payment', 'logout smoke']

plan.splice(2, 0, 'apply discount');
// state: ['login smoke', 'create order', 'apply discount', 'old payment', 'logout smoke']

const removedOldPayment = plan.splice(3, 1, 'pay order');
// state: ['login smoke', 'create order', 'apply discount', 'pay order', 'logout smoke']

console.log(plan);
console.log(removedDeprecated);
console.log(removedOldPayment);
```

Объяснение: каждая операция явно меняет середину array и сохраняет removed значения. Важно, что третий `splice()` использует index `3` уже после вставки `apply discount`, а не по исходному состоянию array.

Распространённая ошибка: выполнять несколько `splice()` без пересчета indexes после первого изменения.

Связь с Automation QA: после каждого изменения plan indexes могут поменяться.
