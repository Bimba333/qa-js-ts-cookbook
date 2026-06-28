# some()

## Связь с предыдущей главой

Предыдущая глава объяснила `find()`.

Главная модель была такой: найти первый matching element.

Но иногда сам element не нужен. CI gate часто спрашивает проще: "Есть ли хотя бы один failed test?"

## Главный вопрос

> Как проверить, что хотя бы один element подходит под condition?

Ответ этой главы: использовать `some()`.

## Предварительные требования

Для этой главы нужно понимать:

* что `find()` возвращает element или `undefined`;
* что Boolean result используется в decision logic;
* что test cases имеют `status` и `priority`.

Не требуется заново изучать transformation pipeline. Здесь фокус на Boolean decision.

## Цели обучения

После главы вы будете понимать:

* зачем существует `some()`;
* что означает "at least one match";
* что возвращает `some()`;
* чем `some()` отличается от `find()`;
* как использовать `some()` для QA gating logic.

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

Перед merge нужно понять: есть ли failed tests?

Нужен не сам failed test, а ответ:

```text
true  -> есть хотя бы один failed test
false -> failed tests нет
```

## Теория

`some()` отвечает на вопрос "есть ли хотя бы один match?"

Общая форма:

```javascript
const hasMatch = array.some(function (element) {
  return condition;
});
```

Result — Boolean.

## Внутренний механизм

Концептуальные шаги:

```text
check element
│
├── true  -> return true
└── false -> check next element
```

Метод может остановиться на первом совпадении, потому что дальнейшие elements уже не изменят ответ.

## Главная ментальная модель

Главная модель этой главы: **at least one match**.

```text
testCases
│
▼
some()
│
▼
true / false
```

Вопрос: "Есть ли хотя бы один?"

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-56/
```

Запуск:

```bash
node examples/01-javascript/chapter-56/01-has-failed.js
node examples/01-javascript/chapter-56/02-has-high-priority.js
node examples/01-javascript/chapter-56/03-no-match.js
node examples/01-javascript/chapter-56/04-ci-gate.js
node examples/01-javascript/chapter-56/05-common-mistakes.js
```

## Примеры Automation QA

CI gate:

```javascript
const hasFailedTests = testCases.some(function (testCase) {
  return testCase.status === 'failed';
});
```

Decision:

```javascript
if (hasFailedTests) {
  console.log('Block merge');
}
```

`some()` делает condition readable: gate depends on at least one matching test.

## Распространённые ошибки

### Ошибка 1. Ожидать найденный object

`some()` отвечает на вопрос gate, а не возвращает test case.

### Ошибка 2. Использовать `some()` для подсчета

`some()` отвечает только да/нет.

### Ошибка 3. Забыть `return`

Без return callback не дает condition result.

## Краткие итоги

`some()` проверяет, есть ли хотя бы один match, и поэтому хорошо подходит для CI gates.

## Переход к следующей главе

Теперь мы умеем проверять "есть ли хотя бы один".

Следующий вопрос:

> Как проверить, что все elements подходят под condition?

Эта задача ведет к `every()`.

Практика:

```text
practice/01-javascript/56-some.md
```

Решения:

```text
solutions/01-javascript/56-some.md
```
