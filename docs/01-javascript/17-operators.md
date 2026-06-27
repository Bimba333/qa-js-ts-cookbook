# Operators

## Связь с предыдущей главой

Предыдущие главы объяснили values, types, references, conceptual memory model, type conversion and equality.

```text
Primitive Types
│
▼
Object Type
│
▼
References
│
▼
Stack & Heap
│
▼
Type Conversion
│
▼
Equality
```

Теперь начинается новый блок: **Program Control**.

До этого мы изучали, что такое values and how they compare. Теперь вопрос другой:

> How does JavaScript perform operations on values?

Начнем с простого выражения:

```javascript
2 + 3
```

Вопрос:

> What is `+`?

`2` and `3` are values. `+` is the action performed on them.

Главный вопрос этой главы:

> What operation is being performed?

---

## Предварительные требования

Для этой главы нужно понимать:

* что value is information JavaScript works with;
* что values have types;
* что type conversion can happen when an operation expects another type;
* что equality operators compare values;
* что objects contain properties;
* что variables give named access to values.

Не требуется знать bitwise operators, optional chaining, nullish coalescing, destructuring, spread, rest, precedence tables or short-circuit evaluation details. Эти темы будут изучаться позже.

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

Operators look familiar because `+`, `-`, `=`, `&&`, `typeof` are short. But short syntax does not mean simple behavior. Каждый operator performs an operation and produces a result.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/16-equality.md
```

Текущая глава:

```text
docs/01-javascript/17-operators.md
```

Следующая глава:

```text
docs/01-javascript/18-conditionals.md
```

Следующая глава объяснит Conditionals: how programs choose different paths based on evaluated results.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* what an operator is;
* what operands are;
* difference between unary, binary and ternary operators;
* why operators are grouped into categories;
* what arithmetic operators do at a high level;
* what comparison operators do;
* what logical operators do at a high level;
* what assignment operators do;
* how `typeof` helps inspect values;
* what `delete`, `in` and `instanceof` mean at a high level;
* what operator result means;
* why operator precedence exists conceptually;
* how operators appear in Automation QA code.

---

## Мотивация

Посмотрите на выражение:

```javascript
2 + 3
```

Здесь есть values:

```text
2
3
```

И есть action:

```text
+
```

Диаграмма Operator overview:

```text
Value
│
├── 2
│
Operator
│
├── +
│
Value
│
└── 3
│
▼
Результат
│
└── 5
```

Operators are the language mechanism that transforms, combines and evaluates values.

```text
Operands
│
▼
Operator
│
▼
Результат
```

Главный вопрос:

> What operation is being performed?

---

## Теория

### Operator, operand, result

Do not start with syntax. Start with behavior.

```javascript
const total = 2 + 3;
```

What operation is being performed?

```text
Addition.
```

Operand → Operator → Result:

```text
2       +       3
│       │       │
│       │       └── operand
│       └────────── operator
└────────────────── operand

Результат
│
└── 5
```

Operator receives operands and produces a result.

```text
Input value
│
├── operand
│
Action
│
├── operator
│
Output value
│
└── result
```

### Unary operators

Unary operator works with one operand.

```javascript
const valueType = typeof 'Anna';
```

Unary operator diagram:

```text
Operator
│
├── typeof
│
Operand
│
└── "Anna"
│
▼
Результат
│
└── "string"
```

Other unary examples:

```javascript
!true;
-5;
typeof 200;
```

This chapter does not list every unary operator. It builds the model:

```text
one operand
│
▼
unary operator
│
▼
result
```

### Binary operators

Binary operator works with two operands.

```javascript
const total = 2 + 3;
const isExpected = 200 === 200;
```

Binary operator diagram:

```text
Left operand
│
├── 2
│
Operator
│
├── +
│
Right operand
│
└── 3
│
▼
Результат
│
└── 5
```

Equality is also binary:

```text
200     ===     200
│       │       │
left    op      right
│
▼
true
```

### Ternary operator

JavaScript has one common ternary operator:

```javascript
const label = isActive ? 'active' : 'inactive';
```

Ternary means three operands.

Ternary operator diagram:

```text
condition ? valueIfTrue : valueIfFalse
│           │             │
│           │             └── third operand
│           └──────────────── second operand
└──────────────────────────── first operand

Результат
│
└── one of two values
```

This chapter only introduces the shape. Conditionals will explain decision-making in detail later.

### Operator categories

Operators are grouped by the kind of operation they perform.

Operator categories:

```text
Operators
│
├── Arithmetic
├── Comparison
├── Logical
├── Assignment
├── Type inspection
├── Property / object-related
└── Other specialized categories
```

What operation is being performed?

```text
Arithmetic   → calculate
Comparison   → compare
Logical      → combine/evaluate logic
Assignment   → store/update value
typeof       → inspect type category
delete       → remove property at high level
in           → check property presence
instanceof   → check runtime object relationship at high level
```

### Arithmetic operators

Arithmetic operators perform numeric-like calculations.

```javascript
const itemPrice = 100;
const itemCount = 3;
const totalPrice = itemPrice * itemCount;
```

Arithmetic operators diagram:

```text
Number-like operand
│
▼
Arithmetic operator
│
▼
Number-like result
```

Примеры:

```text
+  addition
-  subtraction
*  multiplication
/  division
%  remainder
```

This chapter does not teach every arithmetic operator individually. The mental model is enough:

```text
operands
│
▼
calculation
│
▼
result
```

Type conversion may happen if operands are not the expected type. Type Conversion chapter explained why.

### Comparison operators

Comparison operators compare values and produce Boolean result.

```javascript
const statusCode = 200;
const isSuccess = statusCode === 200;
```

Comparison operators diagram:

```text
Value A
│
▼
Comparison operator
│
▼
Value B
│
▼
Boolean result
```

Примеры:

```text
===  strict equality
!==  strict inequality
>    greater than
<    less than
>=   greater than or equal
<=   less than or equal
```

Equality was studied in the previous chapter. Other comparison operators will appear naturally in conditionals and loops.

### Logical operators

Logical operators work with values used as logical decisions.

```javascript
const isStatusOk = statusCode === 200;
const hasUser = true;
const canContinue = isStatusOk && hasUser;
```

Logical operators diagram:

```text
Logical input
│
▼
Logical operator
│
▼
Logical result / selected value
```

Common logical operators:

```text
&&  AND
||  OR
!   NOT
```

This chapter does not teach short-circuit evaluation details. They will be explained later when conditionals need them.

At this level:

```text
&& combines conditions
|| combines alternatives
!  negates a condition-like value
```

### Assignment operators

Assignment operators store or update values through identifiers or properties.

```javascript
let retryCount = 0;
retryCount = 1;
```

Assignment operators diagram:

```text
Target
│
├── retryCount
│
Operator
│
├── =
│
Value
│
└── 1
│
▼
Updated target
```

Other assignment-like forms exist:

```javascript
retryCount += 1;
```

At a high level:

```text
read current value
│
perform operation
│
assign result back
```

Detailed operator variants will be studied when needed.

### `typeof`

`typeof` is a unary operator that returns a string describing type category.

```javascript
console.log(typeof 200);
console.log(typeof 'Anna');
console.log(typeof true);
```

`typeof` diagram:

```text
typeof
│
▼
value
│
▼
type category string
```

Automation QA uses `typeof` for debugging unexpected API values:

```javascript
const statusCode = '200';

console.log(typeof statusCode);
```

Результат:

```text
string
```

### `delete`

`delete` removes a property from an object at a high level.

```javascript
const user = {
  name: 'Anna',
  temporaryCode: '1234',
};

delete user.temporaryCode;
```

`delete` diagram:

```text
Object
│
├── name
└── temporaryCode
    │
    ▼
delete property
│
▼
Object
│
└── name
```

This chapter does not teach lower-level memory behavior or performance details.

### `in`

`in` checks whether a property is present in an object.

```javascript
const user = {
  name: 'Anna',
};

console.log('name' in user);
console.log('role' in user);
```

`in` diagram:

```text
property name
│
▼
in
│
▼
object
│
▼
Boolean result
```

Результат:

```text
true
false
```

At this level, `in` means:

```text
Does this object have this property available?
```

Prototype-related details will be studied later.

### `instanceof`

`instanceof` checks runtime relationship between object and constructor-like function at a high level.

```javascript
const createdAt = new Date();

console.log(createdAt instanceof Date);
```

`instanceof` diagram:

```text
object
│
▼
instanceof
│
▼
constructor-like value
│
▼
Boolean result
```

This chapter only introduces the operator. Prototypes, constructors and classes will be studied later.

### Operator result

Every operator produces a result.

```text
2 + 3
│
└── result: 5

statusCode === 200
│
└── result: true

typeof value
│
└── result: "string"
```

Operator result diagram:

```text
Operation
│
├── operands
├── operator
└── result
```

This result can be:

```text
stored in variable
passed to function
used in condition
combined with another operator
```

### Operator precedence

When expression has multiple operators, JavaScript needs an order.

```javascript
const result = 2 + 3 * 4;
```

Conceptual precedence diagram:

```text
Expression
│
└── 2 + 3 * 4
        │
        ▼
      * happens before +
        │
        ▼
      2 + 12
        │
        ▼
      14
```

This chapter does not teach precedence tables. The practical rule for now:

```text
If expression is not obvious, use parentheses.
```

```javascript
const result = 2 + (3 * 4);
```

---

## Внутренний механизм

At a conceptual level, an operator is an instruction to the engine:

```text
Read operand(s)
│
▼
Apply operator rules
│
▼
Produce result
```

Complete operator picture:

```text
Source code expression
│
▼
Engine identifies operator
│
▼
Engine identifies operands
│
▼
Engine applies category rules
│
├── arithmetic
├── comparison
├── logical
├── assignment
└── specialized
│
▼
Engine produces result
│
▼
Result is used by surrounding code
```

Current position in JavaScript model:

```text
Values and Types
│
├── Primitive Types
├── Object Type
├── References
├── Stack & Heap
├── Type Conversion
└── Equality
    │
    ▼
Program Control
│
└── Operators
```

Operators are the first step toward control flow because conditionals depend on expression results.

Переход к Conditionals:

```text
Operator result
│
▼
Boolean-like decision
│
▼
Conditional chooses path
```

---

## Ментальная модель

### Калькулятор

Arithmetic operator is like a calculator:

```text
Input:  2 and 3
Action: +
Output: 5
```

### Machine processing inputs

```text
Input value(s)
│
▼
Machine: operator
│
▼
Output result
```

### Factory conveyor

```text
Operand enters conveyor
│
▼
Operator station transforms it
│
▼
Result leaves conveyor
```

### Recipe step

```text
Ingredients
│
▼
Recipe action
│
▼
Prepared result
```

Operator is the recipe action.

### Function-like mental model

An operator is not literally a function in syntax, but it can be imagined like:

```text
operator(left, right) → result
```

Example:

```text
(2, 3) through + → 5
```

This model helps remember:

```text
Operator receives operands and produces result.
```

---

## Примеры кода

Все примеры находятся в:

```text
examples/01-javascript/chapter-17/
```

Запуск:

```bash
node examples/01-javascript/chapter-17/01-arithmetic.js
node examples/01-javascript/chapter-17/02-comparison.js
node examples/01-javascript/chapter-17/03-logical.js
node examples/01-javascript/chapter-17/04-assignment.js
node examples/01-javascript/chapter-17/05-special-operators.js
node examples/01-javascript/chapter-17/06-common-mistakes.js
```

### 01-arithmetic.js

Shows arithmetic operators as calculations.

### 02-comparison.js

Shows comparison operators producing Boolean results.

### 03-logical.js

Shows logical operators combining condition-like values.

### 04-assignment.js

Shows assignment and assignment update.

### 05-special-operators.js

Shows `typeof`, `delete`, `in` and `instanceof` at a high level.

### 06-common-mistakes.js

Shows unclear precedence and type-related operator mistake.

---

## Частые вопросы

### Is an operator the same as a function?

No. Operator has its own syntax. But as a mental model, it is useful to imagine an action that receives operands and produces result.

### Do all operators return Boolean?

No. Comparison operators often return Boolean. Arithmetic operators return numeric-like results. `typeof` returns string. Assignment returns a value but its main purpose is updating target.

### Should I memorize precedence tables now?

No. This chapter only introduces precedence conceptually. Use parentheses when expression is not obvious.

### Are `delete`, `in` and `instanceof` important for QA?

Yes, but at different levels. `in` helps verify object properties, `typeof` helps debugging, and `instanceof` can help runtime validation. Their deeper mechanics come later.

---

## Распространенные мифы

### Миф: Operators are just symbols

Реальность:

Operators are actions performed on values.

### Миф: All operators behave like arithmetic

Реальность:

Different categories have different purposes and results.

### Миф: Precedence should always be memorized

Реальность:

Understanding precedence concept is important, but readable code often uses parentheses.

### Миф: `typeof` is a function

Реальность:

`typeof` is an operator.

---

## Типичные ошибки

### Ошибка 1. Ignore operator result

```javascript
200 === 200;
```

This produces `true`, but if result is not used, nothing visible happens.

### Ошибка 2. Mix string and number with `+`

```javascript
const retryCount = '3';
console.log(retryCount + 1);
```

Результат:

```text
31
```

Type Conversion chapter explains why.

### Ошибка 3. Misread precedence

```javascript
const result = 2 + 3 * 4;
```

If not sure, write:

```javascript
const result = 2 + (3 * 4);
```

### Ошибка 4. Use `delete` without understanding object shape

Deleting property changes object structure.

### Ошибка 5. Use `in` as value comparison

`in` checks property presence, not property value.

---

## Практическое использование

Operators appear everywhere:

```javascript
const total = price * count;
const isSuccess = statusCode === 200;
const canRetry = isFailed && retryCount < 3;
retryCount += 1;
const valueType = typeof value;
```

Practical reading checklist:

```text
1. Find the operator.
2. Identify operands.
3. Identify operator category.
4. Ask what operation is being performed.
5. Determine result.
6. Check whether type conversion may be involved.
```

---

## Использование в Automation QA

### Assertions

Assertions are built on comparison results.

```javascript
const isStatusExpected = statusCode === 200;
```

### Conditional checks

Conditionals use results of expressions:

```javascript
const canContinue = isStatusExpected && hasUser;
```

Detailed conditional behavior comes next.

### Response validation

```javascript
const hasId = 'id' in responseBody;
```

`in` checks property presence.

### `typeof` in debugging

```javascript
console.log(typeof responseBody.statusCode);
```

This helps detect `"200"` vs `200`.

### `instanceof` in runtime validation

```javascript
const startedAt = new Date();
console.log(startedAt instanceof Date);
```

Useful at runtime, but detailed constructor/prototype behavior will be studied later.

---

## Итоги

Operators are actions that receive operands and produce results.

```text
Operand(s)
│
▼
Operator
│
▼
Результат
```

Operators belong to categories:

```text
Arithmetic
Comparison
Logical
Assignment
Type inspection
Object/property-related
```

This chapter is an overview. Future chapters explain many categories in more detail.

The key question:

```text
What operation is being performed?
```

The next chapter uses operator results to explain Conditionals.

---

## Что нужно запомнить

* Operator performs an operation on operands.
* Operand is a value used by operator.
* Every operator produces a result.
* Unary operators work with one operand.
* Binary operators work with two operands.
* Ternary operator works with three operands.
* Operators belong to categories.
* Arithmetic operators calculate.
* Comparison operators compare.
* Logical operators combine/evaluate condition-like values.
* Assignment operators update targets.
* `typeof` inspects type category.
* `delete`, `in` and `instanceof` are specialized operators.
* Precedence decides order when multiple operators appear.
* Use parentheses when expression order is not obvious.

---

## Проверьте себя

Ответьте без запуска кода.

1. What is an operator?
2. What is an operand?
3. What is operator result?
4. What operation is performed by `2 + 3`?
5. What category does `===` belong to?
6. What category does `typeof` belong to?
7. What does `in` check?
8. What does `delete` do at a high level?
9. Why does precedence exist?
10. How do operators prepare us for conditionals?

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/17-operators.md
```

Сначала решайте predict output задания без запуска. Главная цель - определить operator, operands, category and result.

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/17-operators.md
```

Читайте решения после самостоятельной попытки. Проверяйте reasoning: what operation is being performed?
