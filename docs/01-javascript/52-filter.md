# filter()

## Связь с предыдущей главой

Предыдущая глава объяснила `map()`.

Главная модель была такой:

```text
input array
│
▼
map()
│
▼
transformed output array
```

`map()` меняет форму каждого element и обычно сохраняет количество elements.

Теперь появляется другая задача: не преобразовать все test cases, а выбрать только нужные.

## Главный вопрос

> Как выбрать elements по условию?

Ответ этой главы: использовать `filter()`.

## Предварительные требования

Для этой главы нужно понимать:

* что `map()` создает новый array transformed values;
* что callback может возвращать value;
* что condition может давать `true` или `false`;
* что test case может иметь fields `status` и `priority`.

Не требуется знать следующие array methods. Они будут изучаться в следующих главах.

## Цели обучения

После главы вы будете понимать:

* зачем существует `filter()`;
* как condition выбирает elements;
* почему результатом является subset array;
* почему исходный array не изменяется;
* как фильтровать test cases для CI;
* какие ошибки встречаются при чтении predicate.

## Мотивация

Есть единый список test cases:

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
];
```

CI pipeline должен перезапустить только failed tests.

Нужна операция:

```text
input array
│
▼
check each element
│
▼
keep matching elements
│
▼
subset array
```

## Теория

`filter()` вызывает function для каждого element. Если callback возвращает `true`, element попадает в result array. Если callback возвращает `false`, element пропускается.

Общая форма:

```javascript
const result = array.filter(function (element) {
  return condition;
});
```

Смысл:

```text
element
│
▼
condition
│
├── true  -> keep
└── false -> skip
```

Callback для `filter()` часто называют predicate: function, которая отвечает "подходит ли element?".

## Внутренний механизм

Conceptual steps:

```text
source array
│
▼
create empty result array
│
▼
take element
│
▼
call predicate
│
├── true  -> add element to result
└── false -> do not add element
│
▼
return subset array
```

Важно: `filter()` не меняет сами test case objects. Он выбирает references на elements, которые уже были в source array. Подробности references изучались раньше; здесь достаточно помнить, что `filter()` выбирает элементы, а не превращает их.

## Главная ментальная модель

Главная модель этой главы: **input -> reduced subset array**.

```text
input array
│
▼
filter()
│
▼
condition for each element
│
▼
subset array
```

Количество elements может уменьшиться, а shape каждого выбранного element остается тем же:

```text
4 input elements
│
▼
filter failed
│
▼
1 output element
```

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-52/
```

Запуск:

```bash
node examples/01-javascript/chapter-52/01-filter-failed.js
node examples/01-javascript/chapter-52/02-filter-high-priority.js
node examples/01-javascript/chapter-52/03-filter-ci-ready.js
node examples/01-javascript/chapter-52/04-filter-does-not-mutate.js
node examples/01-javascript/chapter-52/05-common-mistakes.js
```

## Примеры Automation QA

Failed tests for rerun:

```javascript
const failedTests = testCases.filter(function (testCase) {
  return testCase.status === 'failed';
});
```

High priority CI selection:

```javascript
const highPriorityTests = testCases.filter(function (testCase) {
  return testCase.priority === 'high';
});
```

Такой код делает pipeline читаемым: сначала есть полный список, потом выбран subset для конкретного workflow.

## Распространённые ошибки

### Ошибка 1. Возвращать object вместо condition

Callback должен отвечать, оставить element или нет.

### Ошибка 2. Ожидать transformed values

`filter()` выбирает elements. Он не превращает их в строки отчета. Для transformation используется `map()`.

### Ошибка 3. Забыть `return`

Если callback ничего не возвращает, element не пройдет condition.

## Краткие итоги

`filter()` проверяет каждый element и возвращает новый subset array.

Главное: используйте `filter()`, когда нужно выбрать elements, а не изменить их форму.

## Переход к следующей главе

Теперь мы умеем выбрать нужные test cases.

Следующий вопрос:

> Как собрать из многих test cases один итоговый результат?

Эта задача ведет к `reduce()`.

Практика:

```text
practice/01-javascript/52-filter.md
```

Решения:

```text
solutions/01-javascript/52-filter.md
```
