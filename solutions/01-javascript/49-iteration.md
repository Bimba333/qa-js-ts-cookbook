# Решения: Iteration

## Концептуальные вопросы

### 1. Зачем нужна iteration?

Ответ: чтобы пройти по collection element by element.

Объяснение: ручное обращение по indexes плохо масштабируется.

Распространённая ошибка: копировать одинаковые строки для каждого test case.

Связь с Automation QA: test run может содержать десятки или сотни checks.

### 2. Что делает `for...of`?

Ответ: последовательно дает loop variable каждый element array.

Объяснение: body выполняется для каждого element.

Распространённая ошибка: думать, что `for...of` дает index.

Связь с Automation QA: обычно нужен сам test case.

### 3. Что получает loop variable?

Ответ: current element.

Объяснение: на каждом шаге value меняется на следующий element.

Распространённая ошибка: использовать loop variable после обхода как список.

Связь с Automation QA: current test case можно подготовить или залогировать.

### 4. Когда `for...of` читается лучше?

Ответ: когда нужен element, а не index.

Объяснение: код говорит "для каждого test case".

Распространённая ошибка: усложнять код index arithmetic.

Связь с Automation QA: читаемый execution plan легче ревьюить.

### 5. Изменяет ли `for...of` array?

Ответ: сам по себе нет.

Объяснение: изменение может произойти только в body, если вы его явно напишете.

Распространённая ошибка: считать loop mutating operation.

Связь с Automation QA: обход prepared plan безопасен, если body только читает.

### 6. Почему body важен?

Ответ: iteration только доставляет element; действие описано в body.

Объяснение: без body обход не имеет практического эффекта.

Распространённая ошибка: ждать автоматического запуска тестов.

Связь с Automation QA: runner поведение пишется внутри body или вызываемой function.

## Чтение кода

Ответ: body выполнится три раза; `testCase` получит `login`, затем `create order`, затем `payment`; `testRun` не изменится.

Объяснение: `for...of` проходит по значения array.

Распространённая ошибка: думать, что выводятся indexes.

Связь с Automation QA: так можно подготовить каждый test case.

## Предскажите результат выполнения

Ответ:

```text
login
payment
done
```

Объяснение: loop выводит elements по порядку, затем выполняется строка после loop.

Распространённая ошибка: ожидать `done` после каждого element.

Связь с Automation QA: post-run action выполняется после завершения обхода.

## Отладка

Ответ:

```javascript
const testRun = [
  { title: 'login smoke' },
  { title: 'pay order' },
];

for (const testCase of testRun) {
  console.log(testCase.title);
}
```

Объяснение: current element является object, поэтому нужно прочитать его property.

Распространённая ошибка: забыть структуру test case object.

Связь с Automation QA: reports обычно выводят readable title, а не весь object.

## QA-сценарий

Ответ:

```javascript
const smokeRun = ['login smoke', 'create order'];

for (const testCase of smokeRun) {
  console.log(`Preparing: ${testCase}`);
}
```

Объяснение: каждый element становится current `testCase`.

Распространённая ошибка: обращаться вручную к `smokeRun[0]`, `smokeRun[1]`.

Связь с Automation QA: workflow остается читаемым при росте списка.

## Мини-проект

Ответ:

```javascript
const testRun = [
  { id: 'T-1', title: 'login smoke', priority: 'high' },
  { id: 'T-2', title: 'create order', priority: 'medium' },
  { id: 'T-3', title: 'pay order', priority: 'high' },
];

for (const testCase of testRun) {
  console.log(`${testCase.id} | ${testCase.priority} | ${testCase.title}`);
}

console.log(testRun);
```

Объяснение: loop only reads objects and prints execution plan.

Распространённая ошибка: changing test cases while trying only to display them.

Связь с Automation QA: readable run plan помогает debugging перед запуском.
