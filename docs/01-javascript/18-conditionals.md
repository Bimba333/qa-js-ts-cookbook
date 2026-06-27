# Conditionals

## Связь с предыдущей главой

Предыдущая глава объяснила operators.

Operators receive operands and produce results:

```text
Operand(s)
│
▼
Operator
│
▼
Результат
```

Теперь появляется следующий вопрос:

> What can a program do with those results?

Например, API вернул:

```javascript
const statusCode = 500;
```

Тест должен решить:

```text
Should the test continue?
Should it stop?
Should it report server error?
```

JavaScript не угадывает. Program evaluates an expression first, then chooses an execution path.

Главный вопрос этой главы:

> What decision is the program making?

---

## Предварительные требования

Для этой главы нужно понимать:

* что values have types;
* что comparison operators produce Boolean results;
* что logical operators combine condition-like values;
* что truthy and falsy values exist;
* что expressions produce results;
* что operators are actions performed on operands.

Не требуется знать ternary operator in depth, short-circuit evaluation, nullish coalescing, optional chaining, pattern matching or advanced switch behavior. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            100-130 минут
Разбор схем:             35-50 минут
Запуск примеров:         20-30 минут
Практика:                90-120 минут
Повторение материала:    25 минут
```

Уровень сложности: **L2-L3**.

Conditionals выглядят как простая синтаксическая тема, но на практике ошибки возникают из-за неверного понимания evaluated result and selected path.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/17-operators.md
```

Текущая глава:

```text
docs/01-javascript/18-conditionals.md
```

Следующая глава:

```text
docs/01-javascript/19-loops.md
```

Следующая глава ответит:

> What if the same decision has to be made many times?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* why conditionals exist;
* how Boolean decision making works;
* how `if` chooses a path;
* how `else` provides alternative path;
* how `else if` builds a decision chain;
* why nested conditions should be used carefully;
* how `switch` works at a high level;
* what default branch means;
* how readable conditional logic is written;
* how conditionals are used in Automation QA.

---

## Мотивация

Начнем с реального решения.

API returned:

```javascript
const statusCode = 500;
```

Question:

```text
Should the test continue?
```

The program needs a decision:

```text
statusCode === 200
│
▼
false
│
▼
do not continue success path
```

Decision overview:

```text
Input value
│
▼
Expression
│
▼
Evaluated result
│
▼
Conditional
│
▼
Chosen execution path
```

Programs do not guess:

```text
No guessing
│
▼
Evaluate expression
│
▼
Choose path based on result
```

Главный вопрос:

> What decision is the program making?

---

## Теория

### Why conditionals exist

Without conditionals, program would execute every line in the same order.

```text
Line 1
│
▼
Line 2
│
▼
Line 3
```

But real programs need decisions:

```text
If status is OK
│
└── continue validation

If status is not OK
│
└── report failure
```

Conditionals exist because programs need to choose execution paths.

Decision tree:

```text
statusCode === 200?
│
├── true
│   └── validate response body
│
└── false
    └── report status error
```

### Expression → Boolean

Condition usually starts with expression.

```javascript
const statusCode = 500;
const isSuccess = statusCode === 200;
```

Expression → Boolean:

```text
statusCode === 200
│
▼
500 === 200
│
▼
false
```

Operator → Condition:

```text
Comparison operator
│
▼
Boolean result
│
▼
Conditional decision
```

What decision is the program making?

```text
Is statusCode equal to expected success code?
```

### `if`

`if` executes block only when condition result allows it.

```javascript
const statusCode = 200;

if (statusCode === 200) {
  console.log('Status is OK');
}
```

`if` diagram:

```text
Evaluate condition
│
▼
true?
│
├── yes → execute if block
└── no  → skip if block
```

Execution path:

```text
statusCode === 200
│
▼
true
│
▼
console.log("Status is OK")
```

### `if / else`

`else` provides an alternative path.

```javascript
const statusCode = 500;

if (statusCode === 200) {
  console.log('Status is OK');
} else {
  console.log('Status is not OK');
}
```

`if / else` diagram:

```text
Evaluate condition
│
▼
condition result
│
├── true
│   └── execute if block
│
└── false
    └── execute else block
```

Exactly one path is chosen.

```text
One decision
│
├── path A
└── path B

Only one path runs
```

### `else if`

`else if` creates a decision chain.

```javascript
const statusCode = 404;

if (statusCode === 200) {
  console.log('Success');
} else if (statusCode === 404) {
  console.log('Not found');
} else if (statusCode >= 500) {
  console.log('Server error');
} else {
  console.log('Unexpected status');
}
```

`else if` chain:

```text
statusCode === 200?
│
├── true  → Success
└── false
    │
    ▼
    statusCode === 404?
    │
    ├── true  → Not found
    └── false
        │
        ▼
        statusCode >= 500?
        │
        ├── true  → Server error
        └── false → Unexpected status
```

What decision is the program making?

```text
Which status category does this response belong to?
```

### Nested conditions

Nested condition means condition inside another condition.

```javascript
const statusCode = 200;
const hasUserId = true;

if (statusCode === 200) {
  if (hasUserId) {
    console.log('Valid user response');
  }
}
```

Nested conditions diagram:

```text
statusCode === 200?
│
├── false → stop success validation
└── true
    │
    ▼
    hasUserId?
    │
    ├── true  → valid user response
    └── false → missing user id
```

Nested conditions are useful when second decision only matters inside first decision.

Предупреждение о читаемости:

```text
Too much nesting
│
└── harder to read execution path
```

### `switch` overview

`switch` chooses branch based on one expression value.

```javascript
const environment = 'staging';

switch (environment) {
  case 'local':
    console.log('Use local URL');
    break;
  case 'staging':
    console.log('Use staging URL');
    break;
  default:
    console.log('Use production URL');
}
```

Switch overview:

```text
Evaluate switch expression
│
▼
environment
│
▼
match branch
│
├── "local"
├── "staging"
└── default
```

Switch branches:

```text
switch value: "staging"
│
├── case "local"   → no
├── case "staging" → yes
└── default        → not used
```

This chapter keeps `switch` high-level. Advanced switch behavior will be studied later if needed.

### Default branch

`default` is fallback branch.

Default branch diagram:

```text
switch value
│
▼
Any case matches?
│
├── yes → execute matching case
└── no  → execute default branch
```

Default branch is useful when program must handle unexpected values:

```text
Known environments
│
├── local
├── staging
└── production

Unexpected value
│
└── default branch
```

### Choosing execution path

Conditional execution means:

```text
Evaluate first
│
Choose second
│
Execute selected path third
```

Execution path diagram:

```text
Start
│
▼
Evaluate condition
│
▼
Choose path
│
├── path A
└── path B
│
▼
Continue after conditional
```

Program does not run all branches in one decision.

### Readable conditional logic

Readable conditional answers one clear question.

Poor readability:

```javascript
if (statusCode === 200 && hasUserId && !isDeleted && responseTimeMs < 500) {
  console.log('Valid');
}
```

More readable:

```javascript
const isStatusOk = statusCode === 200;
const hasValidUser = hasUserId && !isDeleted;
const isFastEnough = responseTimeMs < 500;

if (isStatusOk && hasValidUser && isFastEnough) {
  console.log('Valid');
}
```

Пример читаемости:

```text
Named expressions
│
├── explain decisions
├── reduce mental load
└── make QA intent visible
```

Short-circuit evaluation details will be studied later. Here the goal is readable decision-making.

---

## Внутренний механизм

At a conceptual level:

```text
Conditional statement
│
▼
Evaluate expression
│
▼
Convert/evaluate result as decision
│
▼
Choose execution path
│
▼
Execute selected block
│
▼
Continue program
```

Complete conditional picture:

```text
Input data
│
▼
Expression
│
▼
Результат
│
▼
Conditional
│
├── if
├── else
├── else if
└── switch
│
▼
Chosen path
│
▼
Executed statements
```

Current position in JavaScript model:

```text
Operators
│
└── produce results
    │
    ▼
Conditionals
│
└── choose execution path based on result
```

Переход к Loops:

```text
Conditional
│
└── makes one decision
    │
    ▼
Loop
│
└── repeats decisions/actions many times
```

---

## Ментальная модель

### Railway switch

```text
Train arrives
│
▼
Switch position
│
├── left track
└── right track
```

Conditional is the switch. Expression result sets the direction.

### Crossroads

```text
Crossroads
│
├── go left
├── go right
└── go straight
```

Program reaches decision point and chooses one route.

### Traffic light

```text
green  → continue
yellow → caution
red    → stop
```

Status code decision is similar:

```text
200 → continue
404 → report not found
500 → report server error
```

### Decision tree

```text
Question 1
│
├── yes → Question 2
└── no  → Alternative path
```

### Security checkpoint

```text
Has valid badge?
│
├── yes → enter
└── no  → reject
```

Programs do not guess. They check a result and choose path.

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-21/
```

Запуск:

```bash
node examples/chapter-21/01-if.js
node examples/chapter-21/02-if-else.js
node examples/chapter-21/03-else-if.js
node examples/chapter-21/04-switch.js
node examples/chapter-21/05-nested.js
node examples/chapter-21/06-common-mistakes.js
```

### 01-if.js

Shows one success path.

### 02-if-else.js

Shows success path and failure path.

### 03-else-if.js

Shows status code decision chain.

### 04-switch.js

Shows environment selection.

### 05-nested.js

Shows nested response validation.

### 06-common-mistakes.js

Shows assignment inside condition mistake.

---

## Частые вопросы

### Does JavaScript randomly choose a branch?

No. It evaluates expression first, then chooses path based on result.

### Does every condition have to be Boolean?

Condition is evaluated as a decision. Boolean values are clearest. Truthy/falsy behavior exists, but explicit Boolean expressions are usually more readable.

### Should I avoid nested conditions?

Not always. Use nesting when the inner decision only makes sense inside the outer decision. Avoid deep nesting when named expressions or early structure would be clearer.

### Is `switch` better than `else if`?

Not always. `switch` is useful when comparing one value against several known cases. `else if` is more flexible for different expressions.

### Is ternary a conditional?

It is conditional expression syntax, but this chapter does not teach ternary in depth. It will be used later where appropriate.

---

## Распространенные мифы

### Миф: `if` checks a line of code

Реальность:

`if` evaluates an expression result.

### Миф: All branches run and JavaScript chooses output

Реальность:

Only selected path runs.

### Миф: More nesting means more precise code

Реальность:

More nesting often makes decision path harder to read.

### Миф: `switch` is only old syntax

Реальность:

`switch` is useful for choosing among known cases of one value.

Схема типичных ошибок:

```text
Mistake
│
├── unclear condition
├── assignment instead of comparison
├── missing default path
└── deeply nested logic
```

---

## Типичные ошибки

### Ошибка 1. Assignment instead of comparison

```javascript
let statusCode = 500;

if (statusCode = 200) {
  console.log('Success');
}
```

This updates `statusCode` instead of comparing it.

Correct:

```javascript
if (statusCode === 200) {
  console.log('Success');
}
```

### Ошибка 2. Unclear truthy/falsy condition

```javascript
if (responseBody.id) {
  console.log('Has id');
}
```

If `id` can be `0`, this condition may be misleading. Use explicit checks when needed.

### Ошибка 3. Missing `else`

If failure path matters, write it.

```javascript
if (statusCode === 200) {
  console.log('Success');
} else {
  console.log('Unexpected status');
}
```

### Ошибка 4. Deep nesting

```text
if
└── if
    └── if
        └── if
```

Hard to read, hard to debug.

### Ошибка 5. Missing `default` in switch

If unexpected value is possible, default branch makes behavior explicit.

---

## Практическое использование

Conditionals are used when program needs to choose:

```text
Continue or stop
Retry or fail
Use staging or production config
Validate body or report status error
Run assertion A or assertion B
```

Practical reading checklist:

```text
1. What decision is being made?
2. What expression is evaluated?
3. What result does expression produce?
4. Which path is chosen?
5. What happens after the conditional?
```

---

## Использование в Automation QA

### Status code validation

```javascript
if (statusCode === 200) {
  console.log('Validate response body');
} else {
  console.log('Report status error');
}
```

QA decision example:

```text
statusCode === 200?
│
├── true  → validate body
└── false → report status error
```

### Retry logic

```javascript
if (statusCode >= 500) {
  console.log('Retry may be needed');
}
```

Full retry loops will be studied in the next chapter.

### Environment selection

```javascript
switch (environment) {
  case 'local':
    console.log('Local config');
    break;
  case 'staging':
    console.log('Staging config');
    break;
  default:
    console.log('Production config');
}
```

### Skipping tests

At a high level:

```text
feature enabled?
│
├── yes → run test
└── no  → skip or report unavailable
```

Framework-specific skipping will be studied later.

### Choosing assertions

```javascript
if (responseType === 'user') {
  console.log('Assert user fields');
} else {
  console.log('Assert generic response');
}
```

---

## Итоги

Conditionals answer:

```text
What can a program do with operator results?
```

Core model:

```text
Expression produces a result.
Conditional evaluates that result.
Exactly one execution path is chosen.
```

Main forms:

```text
if
if / else
else if chain
nested conditions
switch
default branch
```

The next chapter, Loops, answers:

```text
What if the same decision has to be made many times?
```

---

## Что нужно запомнить

* Conditional execution starts with evaluated expression.
* Program does not guess.
* `if` executes block when condition path is selected.
* `else` provides alternative path.
* `else if` builds decision chain.
* Nested conditions represent decisions inside decisions.
* `switch` chooses among cases for one value.
* `default` handles fallback path.
* Exactly one path is chosen in one `if / else` decision.
* Readable conditions use clear names and explicit intent.
* Conditionals are central to Automation QA decisions.

---

## Проверьте себя

Ответьте без запуска кода.

1. Why do conditionals exist?
2. What happens before JavaScript chooses a branch?
3. What does `if` do?
4. What does `else` add?
5. When is `else if` useful?
6. When is nesting useful?
7. What does `switch` evaluate?
8. What is `default` branch?
9. Why should conditions be readable?
10. How does this chapter lead to Loops?

---

## Практика

Практика находится в файле:

```text
practice/chapter-21.md
```

Сначала отвечайте без запуска там, где нужно predict output. Главная цель - определить evaluated expression and chosen path.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-21.md
```

Читайте решения после самостоятельной попытки. Проверяйте reasoning: what decision is the program making?
