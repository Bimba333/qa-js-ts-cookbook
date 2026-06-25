# Решения. Глава 12. Hoisting

## Концептуальные вопросы

### 1. Почему Hoisting существует

Ответ:

Hoisting существует как observable result того, что engine prepares declarations during Creation Phase.

Рассуждение:

Execution начинается не сразу. Сначала engine prepares Lexical Environment and Environment Records.

Типичная ошибка:

Думать, что Hoisting — отдельный механизм переноса строк.

Automation QA connection:

Это помогает читать old helpers and framework code without myths.

### 2. Почему code does not move upward

Ответ:

Source code сохраняет original order. Engine only prepares declaration records before execution.

Рассуждение:

Execution Phase runs lines in source order.

Типичная ошибка:

Рисовать переписанный source file as if engine changed it.

Automation QA connection:

При debugging старого JS важно анализировать preparation, not imaginary rewritten code.

### 3. Creation Phase

Ответ:

During Creation Phase engine creates Execution Context, prepares Lexical Environment and registers declarations.

Рассуждение:

This happens before code lines start executing.

Типичная ошибка:

Считать, что all identifiers appear only when execution reaches their lines.

Automation QA connection:

Explains why function declarations in old test framework can be used early.

### 4. Execution Phase

Ответ:

During Execution Phase engine runs source code in original order.

Рассуждение:

Reads, assignments and calls happen as execution reaches corresponding lines.

Типичная ошибка:

Смешивать preparation with actual assignment.

Automation QA connection:

Helps debug why config variable is `undefined` before assignment line.

### 5. Function declaration registration

Ответ:

Function declaration registered as callable binding during Creation Phase.

Рассуждение:

That is why it can be called before its source line.

Типичная ошибка:

Thinking function body moved upward.

Automation QA connection:

Legacy framework helpers often use declarations before their physical location.

### 6. var registration

Ответ:

`var` identifier registered with `undefined` during Creation Phase.

Рассуждение:

Assignment happens later during Execution Phase.

Типичная ошибка:

Expecting assigned value before assignment line.

Automation QA connection:

Old Node.js helpers may print `undefined` for config variables.

### 7. let registration

Ответ:

`let` identifier registered during Creation Phase but not initialized like `var`.

Рассуждение:

Access before initialization is restricted; TDZ explains it next.

Типичная ошибка:

Saying `let is not hoisted`.

Automation QA connection:

Modern test code relies on `let`/`const`; understanding the timing prevents wrong explanations.

### 8. const registration

Ответ:

`const` identifier registered during Creation Phase and initialized when execution reaches declaration line.

Рассуждение:

`const` also must receive value at declaration.

Типичная ошибка:

Expecting `const` to behave like `var`.

Automation QA connection:

Stable test data with `const` is safe after declaration, not before.

### 9. Declaration vs initialization

Ответ:

Declaration registers identifier. Initialization gives first meaningful value.

Рассуждение:

Hoisting mostly concerns declaration preparation, not moving initialization upward.

Типичная ошибка:

Treating `var a = 5` as one preparation step with value `5`.

Automation QA connection:

Debugging setup values requires knowing whether assignment already ran.

### 10. Почему `var a = 5` does not expose `5` before line

Ответ:

Creation Phase prepares `a` with `undefined`; assignment `a = 5` happens only during Execution Phase.

Рассуждение:

The value `5` is not assigned until execution reaches the source line.

Типичная ошибка:

Thinking complete statement is hoisted.

Automation QA connection:

Old helper variables can exist but still have no configured value yet.

### 11. Почему TDZ next

Ответ:

TDZ explains why `let` and `const` are registered but cannot be accessed before initialization.

Рассуждение:

Hoisting gives the preparation model; TDZ explains access restrictions.

Типичная ошибка:

Trying to solve all `let`/`const` behavior in Hoisting chapter.

Automation QA connection:

Helps read modern Playwright code errors accurately.

### 12. Hoisting and Lexical Environment

Ответ:

Hoisting is related to how declarations affect Environment Records during Creation Phase.

Рассуждение:

Lexical Environment provides the place where identifier records are prepared.

Типичная ошибка:

Explaining Hoisting without Environment Records.

Automation QA connection:

Good mental model prevents false debugging stories in JS/TS test projects.

## Predict output

### Задача 1

Ответ:

```text
ready
```

Рассуждение:

Function declaration registered as callable before Execution Phase.

Типичная ошибка:

Expect ReferenceError because function appears later.

Automation QA connection:

Legacy setup helpers may work this way.

### Задача 2

Ответ:

```text
undefined
Anna
```

Рассуждение:

Creation Phase registers `userName` with `undefined`; assignment happens later.

Типичная ошибка:

Expect `Anna` in first output.

Automation QA connection:

Explains old config helper behavior.

### Задача 3

Ответ:

```text
undefined
ready
```

Рассуждение:

`testStatus` starts as `undefined`, then assignment to `'created'`, then reassignment to `'ready'`.

Типичная ошибка:

Ignore reassignment to ready.

Automation QA connection:

Status variables in setup can change before assertion.

### Задача 4

Ответ:

With first line commented:

```text
https://example.com
```

If uncommented, access before initialization fails. The next chapter explains this as TDZ.

Рассуждение:

`const` is initialized only when execution reaches declaration line.

Типичная ошибка:

Expect `undefined` like `var`.

Automation QA connection:

Modern config constants are safe only after declaration.

## Identify Creation Phase

Ответ:

```text
Identifier | Declaration kind      | Creation Phase state
runTest    | function declaration  | registered as callable function
userName   | var                   | registered with undefined
userRole   | let                   | registered, not initialized
baseUrl    | const                 | registered, not initialized
```

Рассуждение:

Creation Phase prepares records before execution starts.

Типичная ошибка:

Put assigned values `Anna`, `admin`, URL into Creation Phase for all declarations.

Automation QA connection:

This table is a practical way to read old JavaScript setup files.

## Identify declaration vs initialization

Ответ:

```text
console.log(environmentName);
│
└── read

var environmentName = 'staging';
│
├── declaration: var environmentName
└── assignment / initialization during execution: "staging"

environmentName = 'production';
│
└── assignment / reassignment

console.log(environmentName);
│
└── read
```

Рассуждение:

Declaration part affects Creation Phase; assignments run during Execution Phase.

Типичная ошибка:

Treat full `var environmentName = 'staging'` as Creation Phase value.

Automation QA connection:

Useful for debugging env variables in legacy test helpers.

## Debugging

### Задача 1

Ответ:

Engine did not rewrite source code. It registered `userName` during Creation Phase.

Рассуждение:

Execution still runs `console.log` before assignment line, so it reads prepared `undefined`.

Типичная ошибка:

Draw `var userName` line above `console.log` as changed source.

Automation QA connection:

Avoids wrong explanations in code reviews.

### Задача 2

Ответ:

Creation Phase:

```text
userName → undefined
```

Execution Phase:

```text
console.log(userName) → undefined
var userName = "Anna" → assignment
```

Рассуждение:

Assigned value does not exist at first read.

Типичная ошибка:

Confuse declaration preparation with assignment.

Automation QA connection:

Same pattern can hide bugs in old setup code.

### Задача 3

Ответ:

It is more accurate to say `let` and `const` are registered during Creation Phase but not initialized before their declaration line.

Рассуждение:

Access before initialization is restricted by TDZ.

Типичная ошибка:

Say "not hoisted" and miss why engine knows the identifier.

Automation QA connection:

Modern JS errors become easier to explain.

## QA-oriented tasks

### Сценарий 1

Ответ:

It works because `setupTest` function declaration is registered as callable during Creation Phase.

Рассуждение:

Execution can call it before source line.

Типичная ошибка:

Think framework rewrites helper order.

Automation QA connection:

Common in legacy framework files.

### Сценарий 2

Ответ:

Expected output:

```text
undefined
```

Рассуждение:

`configName` registered with `undefined`; assignment to `'local'` happens after first read.

Типичная ошибка:

Expect `local`.

Automation QA connection:

Useful for debugging old Node.js helper configuration.

### Сценарий 3

Ответ:

1. In new code, do not intentionally rely on Hoisting for readability.
2. Declaring helpers before usage makes execution easier to read.
3. Hoisting still matters for reading existing JavaScript and debugging old helper files.

Рассуждение:

Understanding a mechanism is not the same as using it as style.

Типичная ошибка:

Use Hoisting tricks to show language knowledge.

Automation QA connection:

Test code should optimize for clear scenario reading.

## Mini-project

Один из вариантов:

```javascript
runSetup();

console.log(environmentName);

var environmentName = 'staging';

console.log(environmentName);

let userRole = 'admin';
const baseUrl = 'https://example.com';

console.log(userRole);
console.log(baseUrl);

function runSetup() {
  console.log('setup');
}
```

Creation Phase:

```text
runSetup        → function
environmentName → undefined
userRole        → registered, not initialized
baseUrl         → registered, not initialized
```

Execution Phase:

```text
call runSetup → "setup"
read environmentName → undefined
assign environmentName → "staging"
read environmentName → "staging"
initialize userRole → "admin"
initialize baseUrl → "https://example.com"
read userRole
read baseUrl
```

Рассуждение:

The output follows prepared records and original source order.

Типичная ошибка:

Move all declarations to top mentally and assign values too early.

Automation QA connection:

This mirrors old setup files with mixed function declarations, `var`, `let`, and `const`.

## Возможные улучшения

После выполнения практики можно:

* взять один old helper file and mark Creation Phase records;
* заменить confusing `var` usage in new code with `let` / `const`;
* rewrite examples so code order is easier to read;
* return to this chapter before Temporal Dead Zone.
