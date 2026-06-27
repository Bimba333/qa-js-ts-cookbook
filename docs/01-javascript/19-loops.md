# Loops

## Связь с предыдущей главой

Предыдущая глава объяснила conditionals.

Conditional makes one decision:

```text
Expression
│
▼
Результат
│
▼
Choose one path
```

Теперь появляется следующий вопрос:

> What if the same decision or action must happen many times?

Представьте, что нужно validate 100 API responses.

Можно написать:

```text
check response 1
check response 2
check response 3
...
check response 100
```

Но это не engineering solution. Программа должна repeat the same algorithm.

Главный вопрос этой главы:

> What is repeated?

---

## Предварительные требования

Для этой главы нужно понимать:

* что conditionals choose execution path;
* что expressions produce results;
* что comparison operators produce Boolean results;
* что variables can store changing values;
* что assignment can update values;
* что readable code should make intent visible.

Не требуется знать `for...of`, `for...in`, iterators, generators, array iteration methods, asynchronous loops or labeled break. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            110-140 минут
Разбор схем:             40-55 минут
Запуск примеров:         25-35 минут
Практика:                100-130 минут
Повторение материала:    30 минут
```

Уровень сложности: **L3**.

Loops are not hard because of syntax. They are hard because one missing update step can make program repeat forever.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/18-conditionals.md
```

Текущая глава:

```text
docs/01-javascript/19-loops.md
```

Следующая глава:

```text
docs/01-javascript/20-error-handling.md
```

Следующая глава ответит:

> What should happen if an error occurs during execution?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* why loops exist;
* what repeated execution means;
* what loop condition is;
* what iteration is;
* what loop body is;
* what initialization does;
* what update step does;
* how `while` works;
* how `do...while` works;
* how `for` works;
* what `break` does;
* what `continue` does;
* how to avoid infinite loops;
* how to choose appropriate loop type.

---

## Мотивация

Реальная задача:

```text
Validate 100 API responses.
```

Плохой подход:

```text
write 100 identical if statements
```

Лучший подход:

```text
repeat one validation algorithm
until all responses are checked
```

Why loops exist:

```text
Repeated work
│
├── same action
├── different item / step
└── stopping condition
```

Repetition overview:

```text
Start
│
▼
Check condition
│
├── true  → run body → update → check again
└── false → stop loop
```

Главный вопрос:

> What is repeated?

---

## Теория

### Why loops exist

Loops exist because programs often need to repeat an algorithm.

Примеры:

```text
Validate many API responses.
Check table rows.
Process test data.
Retry while server is unavailable.
Poll until status changes.
```

Without loop:

```text
check response 1
check response 2
check response 3
```

With loop:

```text
for each step
│
└── run same validation algorithm
```

Loop = repeated execution until stopping condition is reached.

### Loop lifecycle

Every loop has a lifecycle.

Loop lifecycle diagram:

```text
Initialization
│
▼
Condition
│
├── false → stop
└── true
    │
    ▼
    Body
    │
    ▼
    Update
    │
    └── back to Condition
```

Four core parts:

```text
1. initialization
2. condition
3. body
4. update
```

### Initialization

Initialization prepares loop state.

```javascript
let responseIndex = 0;
```

Initialization diagram:

```text
Before loop starts
│
▼
Create starting value
│
▼
responseIndex = 0
```

What is repeated?

```text
Not initialization.
It usually happens once before repetition.
```

### Condition

Condition decides whether loop continues.

```javascript
responseIndex < totalResponses
```

Condition diagram:

```text
Evaluate condition
│
├── true  → run loop body
└── false → stop loop
```

Loop decision:

```text
Should repetition continue?
```

### Body

Loop body is the repeated work.

```javascript
console.log('Validate response');
```

Body diagram:

```text
Loop body
│
└── repeated algorithm
    ├── read current item
    ├── validate it
    └── report result
```

What is repeated?

```text
The body.
```

### Update

Update moves loop toward stopping condition.

```javascript
responseIndex += 1;
```

Update diagram:

```text
After body
│
▼
Update state
│
▼
responseIndex changes
│
▼
Condition can eventually become false
```

Without update, loop may never stop.

### Iteration

One iteration is one complete pass through loop body.

Iteration timeline:

```text
Iteration 1
│
├── condition true
├── body runs
└── update

Iteration 2
│
├── condition true
├── body runs
└── update

Stop
│
└── condition false
```

Iteration answers:

```text
Which repetition are we on?
```

### `while`

`while` repeats while condition is true.

```javascript
let responseIndex = 0;
const totalResponses = 3;

while (responseIndex < totalResponses) {
  console.log('Validate response', responseIndex);
  responseIndex += 1;
}
```

`while` diagram:

```text
while condition
│
├── true
│   ├── run body
│   ├── update
│   └── check condition again
│
└── false
    └── exit loop
```

Use `while` when number of repetitions is not known exactly before loop starts.

### `do...while`

`do...while` runs body first, then checks condition.

```javascript
let attempt = 1;

do {
  console.log('Run attempt', attempt);
  attempt += 1;
} while (attempt <= 1);
```

`do...while` diagram:

```text
Run body once
│
▼
Update
│
▼
Check condition
│
├── true  → repeat
└── false → stop
```

Key idea:

```text
Body runs at least once.
```

Use it when action must happen before deciding whether to repeat.

### `for`

`for` puts initialization, condition and update in one line.

```javascript
for (let responseIndex = 0; responseIndex < 3; responseIndex += 1) {
  console.log('Validate response', responseIndex);
}
```

`for` diagram:

```text
for (
  initialization;
  condition;
  update
) {
  body
}
```

Expanded lifecycle:

```text
let responseIndex = 0
│
▼
responseIndex < 3?
│
├── true  → body → responseIndex += 1 → condition again
└── false → exit
```

Use `for` when loop has clear counter-like lifecycle.

### `break`

`break` stops loop early.

```javascript
for (let attempt = 1; attempt <= 3; attempt += 1) {
  console.log('Attempt', attempt);

  if (attempt === 2) {
    break;
  }
}
```

`break` diagram:

```text
Loop running
│
▼
Condition inside body
│
├── break reached → exit loop now
└── no break      → continue normal lifecycle
```

Use `break` when loop found what it needed or must stop early.

### `continue`

`continue` skips current iteration and moves to next one.

```javascript
for (let responseIndex = 0; responseIndex < 3; responseIndex += 1) {
  if (responseIndex === 1) {
    continue;
  }

  console.log('Validate response', responseIndex);
}
```

`continue` diagram:

```text
Current iteration
│
▼
continue reached
│
▼
skip rest of body
│
▼
go to update / next condition check
```

Use `continue` when current item should be skipped but loop should keep running.

### Avoiding infinite loops

Infinite loop happens when stopping condition is never reached.

```javascript
let attempt = 1;

while (attempt <= 3) {
  console.log('Attempt', attempt);
}
```

Infinite loop diagram:

```text
attempt = 1
│
▼
attempt <= 3 is true
│
▼
body runs
│
▼
attempt is still 1
│
▼
condition true again forever
```

Avoid it by ensuring update changes loop state:

```javascript
attempt += 1;
```

### Choosing the appropriate loop

Choosing loop type:

```text
Known counter range?
│
├── yes → for
└── no
    │
    ▼
    Need to run body at least once?
    │
    ├── yes → do...while
    └── no  → while
```

This is a guideline, not a law.

Future chapters will introduce `for...of`, `for...in`, array iteration methods and asynchronous loops.

---

## Внутренний механизм

At a conceptual level:

```text
Loop starts
│
▼
Initialize state
│
▼
Evaluate condition
│
▼
If true, execute body
│
▼
Update state
│
▼
Evaluate condition again
│
▼
Stop when condition is false
```

Complete loop picture:

```text
Initialization
│
▼
Condition
│
├── false
│   └── exit loop
│
└── true
    │
    ▼
    Body
    │
    ├── normal execution
    ├── break    → exit loop
    └── continue → next iteration
    │
    ▼
    Update
    │
    └── back to condition
```

Current position in JavaScript model:

```text
Conditionals
│
└── make one decision
    │
    ▼
Loops
│
└── repeat decisions/actions
```

Переход к Error Handling:

```text
Loop body runs
│
▼
Something can fail
│
▼
Next chapter:
What should happen if an error occurs during execution?
```

---

## Ментальная модель

### Factory conveyor

```text
Item enters conveyor
│
▼
Inspection step repeats
│
▼
Next item
```

Loop is the conveyor that keeps processing items until there are no more items.

### Checklist

```text
Checklist
│
├── item 1 checked
├── item 2 checked
├── item 3 checked
└── stop when list ends
```

### Assembly line

```text
Same operation
│
├── applied to item A
├── applied to item B
└── applied to item C
```

### Repeated inspection

QA loop:

```text
Response 1 → validate
Response 2 → validate
Response 3 → validate
```

### Security gate checking many visitors

```text
Visitor arrives
│
▼
Check badge
│
▼
Allow or reject
│
▼
Next visitor
```

Loop = repeated execution until stopping condition is reached.

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-22/
```

Запуск:

```bash
node examples/chapter-22/01-while.js
node examples/chapter-22/02-do-while.js
node examples/chapter-22/03-for.js
node examples/chapter-22/04-break-continue.js
node examples/chapter-22/05-common-mistakes.js
node examples/chapter-22/06-qa-example.js
```

### 01-while.js

Shows repetition while condition remains true.

### 02-do-while.js

Shows body running at least once.

### 03-for.js

Shows counter-based loop.

### 04-break-continue.js

Shows early stop and skipping current iteration.

### 05-common-mistakes.js

Shows a guarded version of missing update problem.

### 06-qa-example.js

Shows validation of multiple API-like responses.

---

## Частые вопросы

### Is loop just repeated `if`?

No. A loop repeats body and condition evaluation. `if` makes one decision.

### Which loop should I use most often?

For counter-based repetition, `for` is common. For unknown repetition count, `while` is often clearer.

### Is `do...while` common?

Less common, but useful when body must run at least once.

### Should I use `break` and `continue`?

Use them when they make the loop clearer. Avoid overusing them in a way that hides control flow.

### Why not teach array methods now?

Array iteration methods are important, but they rely on arrays and functions. They will be studied later.

---

## Распространенные мифы

### Миф: Loop repeats automatically until data ends

Реальность:

Loop repeats according to its condition and update logic.

### Миф: `while` and `for` are completely different ideas

Реальность:

They both express repeated execution with condition and update. Syntax differs.

### Миф: Infinite loop is random

Реальность:

Infinite loop usually means stopping condition never becomes false.

### Миф: `break` and `continue` are bad

Реальность:

They are tools. Use them when they make intent clearer.

---

## Типичные ошибки

### Ошибка 1. Missing update

```javascript
let attempt = 1;

while (attempt <= 3) {
  console.log(attempt);
}
```

`attempt` never changes.

### Ошибка 2. Wrong condition

```javascript
for (let index = 0; index <= 3; index += 1) {
  console.log(index);
}
```

This runs for `0`, `1`, `2`, `3`. If you wanted three iterations, condition should be `index < 3`.

### Ошибка 3. Update in wrong direction

```javascript
let attempt = 1;

while (attempt <= 3) {
  attempt -= 1;
}
```

Condition moves away from stopping.

### Ошибка 4. Confuse `break` and `continue`

```text
break    → stop loop
continue → skip current iteration
```

### Ошибка 5. Put too much logic inside one loop

If loop body becomes large, future functions can help organize logic. Functions are a future section.

---

## Практическое использование

Loops are useful when:

```text
same action repeats
state changes each iteration
condition decides when to stop
```

Practical reading checklist:

```text
1. What is repeated?
2. What is initialized?
3. What condition controls repetition?
4. What body runs?
5. What update moves loop toward stop?
6. Can break or continue change normal flow?
7. Can the loop become infinite?
```

---

## Использование в Automation QA

### Validating many API responses

```javascript
for (let index = 0; index < responses.length; index += 1) {
  const response = responses[index];
  console.log(response.statusCode === 200);
}
```

QA validation example:

```text
responses
│
├── response 0 → validate
├── response 1 → validate
└── response 2 → validate
```

### Checking table rows

Loop can check row by row:

```text
row 1
row 2
row 3
```

Detailed DOM and Playwright APIs will be studied later.

### Processing test data

```text
user 1 → create test data
user 2 → create test data
user 3 → create test data
```

### Polling until condition changes

Polling means repeat check until status changes or max attempts reached.

```text
attempt 1 → status pending
attempt 2 → status pending
attempt 3 → status ready
```

Asynchronous polling will be studied later.

### Avoiding endless retries

Always have a stopping condition:

```text
retry while not ready
but stop after max attempts
```

---

## Итоги

Loops answer:

```text
What if the same decision or action must happen many times?
```

Core model:

```text
A loop repeats an algorithm.
Each iteration evaluates whether repetition should continue.
Every loop consists of:
│
├── initialization
├── condition
├── body
└── update
```

Main loop forms:

```text
while
do...while
for
```

Control tools:

```text
break    → stop loop
continue → skip current iteration
```

Next chapter explains Error Handling:

```text
What should happen if an error occurs during execution?
```

---

## Что нужно запомнить

* Loop repeats execution.
* Loop repeats until stopping condition is reached.
* Iteration is one pass through loop body.
* Initialization prepares loop state.
* Condition decides whether to continue.
* Body contains repeated work.
* Update moves loop toward stopping.
* `while` checks condition before body.
* `do...while` runs body at least once.
* `for` is useful for clear counter lifecycle.
* `break` stops loop.
* `continue` skips current iteration.
* Infinite loops usually happen when condition never becomes false.

---

## Проверьте себя

Ответьте без запуска кода.

1. Why do loops exist?
2. What is repeated in a loop?
3. What is iteration?
4. What are four core parts of a loop?
5. When does `while` stop?
6. What is special about `do...while`?
7. When is `for` useful?
8. What does `break` do?
9. What does `continue` do?
10. How does this chapter lead to Error Handling?

---

## Практика

Практика находится в файле:

```text
practice/chapter-22.md
```

Сначала решайте predict output задания без запуска. Главная цель - видеть lifecycle: initialization, condition, body, update.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-22.md
```

Читайте решения после самостоятельной попытки. Проверяйте reasoning: what is repeated and when does repetition stop?
