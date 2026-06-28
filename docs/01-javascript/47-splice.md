# splice()

## Связь с предыдущей главой

Предыдущая глава показала, как array изменяется в начале:

```text
Array
│
▼
Начало
│
├── unshift()
└── shift()
```

До этого мы уже изменяли конец через `push()` и `pop()`.

Теперь остается область, которую нельзя описать только словами "начало" или "конец".

```text
Array
│
├── начало
├── середина
└── конец
```

Тестовый фреймворк хранит список test cases. Иногда новый test case нужно вставить не в конец, а между уже существующими проверками. Иногда устаревший test case нужно удалить из середины. Иногда один test case нужно заменить другим.

## Главный вопрос

> Как изменить середину массива?

Ответ этой главы: использовать `splice()`.

## Предварительные требования

Для этой главы нужно понимать:

* что array — это ordered collection;
* что каждый element имеет index;
* что `length` отражает количество elements;
* что `push()` и `pop()` изменяют конец;
* что `shift()` и `unshift()` изменяют начало;
* что методы array могут изменять исходный array.

Не требуется знать `slice()`, iteration, `forEach()`, `map()`, `filter()` или `reduce()`. Эти темы будут изучаться позже.

## Цели обучения

После главы вы будете понимать:

* зачем существует `splice()`;
* как удалить elements из середины;
* как добавить elements в середину;
* как заменить elements;
* что возвращает `splice()`;
* почему исходный array изменяется;
* почему array после `splice()` нужно читать как новое состояние;
* как меняются indexes после операции;
* почему старые index references становятся небезопасными;
* как `splice()` применяется в Automation QA.

## Мотивация

Представим test automation framework.

Есть список test cases:

```javascript
const testCases = [
  'login smoke',
  'create order',
  'pay order',
  'logout smoke'
];
```

Появилось новое требование: перед оплатой нужно добавить test case `apply discount`.

Нельзя использовать `push()`, потому что новый test case окажется в конце.

Нельзя использовать `unshift()`, потому что он окажется в начале.

Нужна операция для середины:

```text
Array
│
▼
найти позицию в середине
│
▼
splice()
│
▼
array изменен
```

## Теория

`splice()` изменяет существующий array.

Для этой главы важно думать об array не как о статичной записи, а как о состоянии во времени.

```text
Array
│
▼
current state
│
▼
splice()
│
▼
next state
```

Array — это mutable состояние object: один и тот же array может находиться в разных состояниях в разные моменты выполнения программы. Каждый вызов `splice()` является состояние transition: он берет текущее состояние array и превращает его в следующее состояние.

Это значит, что несколько операций `splice()` нельзя читать как независимые команды, примененные к одному исходному списку. Вторая операция работает уже с результатом первой.

Общая форма:

```javascript
array.splice(startIndex, deleteCount, newElement1, newElement2);
```

Смысл:

```text
startIndex
│
▼
с какой позиции начать

deleteCount
│
▼
сколько elements удалить

new elements
│
▼
что вставить на это место
```

Если нужно только удалить:

```javascript
testCases.splice(1, 1);
```

Если нужно только добавить:

```javascript
testCases.splice(2, 0, 'apply discount');
```

Если нужно заменить:

```javascript
testCases.splice(1, 1, 'create paid order');
```

## Внутренний механизм

Рассмотрим добавление test case в середину:

```javascript
const testCases = [
  'login smoke',
  'create order',
  'pay order',
  'logout smoke'
];

testCases.splice(2, 0, 'apply discount');
```

Шаги:

```text
Array
│
▼
найти index 2
│
▼
удалить 0 elements
│
▼
вставить "apply discount"
│
▼
сдвинуть следующие elements вправо
│
▼
обновить length
```

Результат:

```text
index 0 -> login smoke
index 1 -> create order
index 2 -> apply discount
index 3 -> pay order
index 4 -> logout smoke
```

Теперь посмотрим на это как на transition состояния:

```text
Before splice
│
├── index 0 -> login smoke
├── index 1 -> create order
├── index 2 -> pay order
└── index 3 -> logout smoke

splice(2, 0, "apply discount")
│
▼

After splice
│
├── index 0 -> login smoke
├── index 1 -> create order
├── index 2 -> apply discount
├── index 3 -> pay order
└── index 4 -> logout smoke
```

Обратите внимание: `pay order` был на index `2`, но после вставки оказался на index `3`.

```text
Before
index 2 -> pay order

splice inserts before index 2
│
▼

After
index 2 -> apply discount
index 3 -> pay order
```

Это не мелкая деталь. Это инженерное правило:

```text
После splice()
│
▼
indexes invalidated
│
▼
remaining elements shift
│
▼
previous index references are unsafe
```

Если код заранее сохранил index `2` как "позицию payment test", после `splice()` это значение уже может указывать на другой element. После каждой mutation нужно заново смотреть на текущее состояние array.

`splice()` возвращает array удаленных elements.

Если ничего не удалено, возвращается empty array:

```javascript
const removed = testCases.splice(2, 0, 'apply discount');
console.log(removed); // []
```

## Главная ментальная модель

Главная модель этой главы: **middle modification**.

```text
Array
│
▼
позиция в середине
│
▼
удалить / вставить / заменить
│
▼
splice()
│
▼
тот же array в новом состоянии
```

Важно: `splice()` не создает безопасную копию для чтения. Он меняет исходный array.

Более точная инженерная формулировка:

```text
Array = state over time
│
▼
splice() = state transition
│
▼
следующая операция читает уже новое состояние
```

Поэтому `splice()` всегда нужно читать слева направо по времени:

```text
state 1
│
▼
splice()
│
▼
state 2
│
▼
следующая операция
```

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-47/
```

Запуск:

```bash
node examples/01-javascript/chapter-47/01-remove-test-case.js
node examples/01-javascript/chapter-47/02-insert-test-case.js
node examples/01-javascript/chapter-47/03-replace-test-case.js
node examples/01-javascript/chapter-47/04-return-value.js
node examples/01-javascript/chapter-47/05-qa-suite-update.js
```

## Примеры Automation QA

В реальном фреймворке список test cases может строиться динамически:

```javascript
const regressionPlan = [
  'login smoke',
  'create order',
  'pay order',
  'logout smoke'
];

regressionPlan.splice(2, 0, 'apply discount');
```

Так можно вставить обязательную проверку между созданием заказа и оплатой.

После этой операции план уже изменился:

```text
state before
│
├── 0 login smoke
├── 1 create order
├── 2 pay order
└── 3 logout smoke

state after
│
├── 0 login smoke
├── 1 create order
├── 2 apply discount
├── 3 pay order
└── 4 logout smoke
```

Другой пример — удаление временного теста:

```javascript
const removedTests = regressionPlan.splice(1, 1);
```

Удаленный test case сохраняется в `removedTests`, поэтому его можно залогировать.

Если после этого нужно выполнить еще одну операцию по index, index нужно выбирать уже по новому состоянию `regressionPlan`, а не по старой схеме.

## Распространённые ошибки

### Ошибка 1. Ожидать новый array

Неправильная модель:

```text
splice()
│
▼
new array
```

Реальность:

```text
splice()
│
▼
changes existing array
```

### Ошибка 2. Путать `startIndex` и `deleteCount`

```javascript
testCases.splice(2, 1);
```

Это означает:

```text
начать с index 2
│
▼
удалить 1 element
```

### Ошибка 3. Забыть про сдвиг indexes

После добавления или удаления из середины indexes следующих elements меняются.

Строгое правило:

```text
Любой splice()
│
▼
изменяет состояние array
│
▼
старые indexes больше не считаются надежными
```

Небезопасная модель:

```text
index 2 был нужным
│
▼
splice()
│
▼
index 2 все еще нужный
```

Правильная модель:

```text
index 2 был нужным
│
▼
splice()
│
▼
проверить новое состояние
│
▼
найти нужный index заново
```

В Automation QA это особенно важно: если один helper вставил test case в середину плана, другой helper не должен молча использовать index, рассчитанный до изменения.

## Краткие итоги

`splice()` нужен, когда нужно изменить середину array.

Он может:

* удалить elements;
* добавить elements;
* заменить elements;
* вернуть удаленные elements;
* изменить исходный array.

Главная мысль:

```text
array current state
│
▼
splice()
│
▼
array next state
│
▼
indexes после операции нужно читать заново
```

## Переход к следующей главе

`splice()` изменяет исходный array.

Следующий вопрос естественный:

> Как получить часть array, не меняя исходный список test cases?

Эта задача ведет к `slice()`.

Практика:

```text
practice/01-javascript/47-splice.md
```

Решения:

```text
solutions/01-javascript/47-splice.md
```
