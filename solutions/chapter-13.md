# Решения. Глава 13. Temporal Dead Zone

## Концептуальные вопросы

### 1. Что такое TDZ

Ответ:

Temporal Dead Zone — период от начала scope до initialization `let` или `const`, когда identifier registered, но access forbidden.

Рассуждение:

Engine уже знает identifier, но он еще not initialized.

Типичная ошибка:

Считать TDZ физическим местом в памяти.

Automation QA connection:

Помогает читать ReferenceError in helper files.

### 2. Почему TDZ существует

Ответ:

TDZ prevents reading `let` and `const` before meaningful initialization.

Рассуждение:

Instead of silently returning `undefined`, code fails loudly.

Типичная ошибка:

Считать TDZ случайной странностью `let`.

Automation QA connection:

Ошибки declaration order в тестах становятся заметнее.

### 3. Почему не "not hoisted"

Ответ:

`let` and `const` are registered during Creation Phase, but not initialized.

Рассуждение:

Они hoisted in the sense of registration, but access is forbidden before initialization.

Типичная ошибка:

Объяснять поведение отсутствием registration.

Automation QA connection:

Точная формулировка помогает в code review and debugging.

### 4. Registration

Ответ:

Registration — создание identifier record in Environment Record.

Рассуждение:

This happens during Creation Phase.

Типичная ошибка:

Путать registration with initialization.

Automation QA connection:

Explains why engine can report identifier name in TDZ error.

### 5. Initialization

Ответ:

Initialization — момент, когда identifier получает first usable value.

Рассуждение:

For `let user;`, initialization happens when declaration line executes, with value `undefined`.

Типичная ошибка:

Думать, что initialization always means non-undefined value.

Automation QA connection:

Helps understand unset helper variables.

### 6. When TDZ begins

Ответ:

TDZ begins when scope starts and identifier is registered uninitialized.

Рассуждение:

For block `let/const`, TDZ begins when block scope is entered.

Типичная ошибка:

Считать TDZ начинающейся только на line before declaration.

Automation QA connection:

Block-level assertion data follows this rule.

### 7. When TDZ ends

Ответ:

TDZ ends when execution reaches declaration line and initialization happens.

Рассуждение:

After initialization, access becomes allowed.

Типичная ошибка:

Считать, что TDZ ends only after assigning non-empty value.

Automation QA connection:

`let value;` is readable after declaration, even if value is `undefined`.

### 8. TDZ for let

Ответ:

`let` is registered during Creation Phase, remains uninitialized during TDZ, and initializes at declaration line.

Рассуждение:

`let user;` initializes with `undefined`; `let user = 'Anna'` initializes with `'Anna'`.

Типичная ошибка:

Expect `let` to behave like `var`.

Automation QA connection:

Useful for setup variables that receive value later.

### 9. TDZ for const

Ответ:

`const` is registered during Creation Phase and initialized at declaration line with required value.

Рассуждение:

`const` cannot be declared without initialization.

Типичная ошибка:

Attempt to declare `const` first and assign later.

Automation QA connection:

Stable configuration should be declared before use.

### 10. Почему var behaves differently

Ответ:

`var` is initialized with `undefined` during Creation Phase.

Рассуждение:

So it can be read before assignment line.

Типичная ошибка:

Thinking `var` is safer because it does not throw.

Automation QA connection:

`undefined` can hide declaration order bugs in old tests.

### 11. ReferenceError before initialization

Ответ:

Это ошибка access to registered but uninitialized identifier.

Рассуждение:

Engine knows the identifier but refuses access while it is in TDZ.

Типичная ошибка:

Thinking identifier is missing.

Automation QA connection:

Error message tells you to check declaration order.

### 12. TDZ ReferenceError vs missing identifier

Ответ:

TDZ ReferenceError: identifier exists but is uninitialized. Missing identifier: lookup cannot find identifier.

Рассуждение:

Both can be ReferenceError, but states differ.

Типичная ошибка:

Debug both cases the same way.

Automation QA connection:

TDZ suggests reorder declarations; missing identifier suggests wrong name/import/scope.

## Identify TDZ

### Фрагмент 1

Ответ:

TDZ starts at beginning of scope and ends at `let userName = 'Anna';`.

Рассуждение:

After declaration line, `userName` initialized and readable.

Типичная ошибка:

Say `userName` does not exist before declaration.

Automation QA connection:

Same pattern happens in helper-local variables.

### Фрагмент 2

Ответ:

TDZ for `status` starts when block is entered and ends at `const status = 'active';`.

Рассуждение:

Block scope controls TDZ for block-level `const`.

Типичная ошибка:

Start TDZ at global scope instead of block scope.

Automation QA connection:

Useful for block-scoped assertion values.

### Фрагмент 3

Ответ:

TDZ starts at scope beginning and ends at `let retryCount;`.

Рассуждение:

Declaration without assigned value still initializes with `undefined`.

Типичная ошибка:

Think TDZ continues because no meaningful value assigned.

Automation QA connection:

Retry counters can be declared first and assigned later.

## Predict output

### Задача 1

Ответ:

```text
undefined
Anna
```

Рассуждение:

`let userName;` ends TDZ and initializes with `undefined`; later assignment gives `'Anna'`.

Типичная ошибка:

Expect ReferenceError after `let userName;`.

Automation QA connection:

Setup variables can be intentionally initialized before later assignment.

### Задача 2

Ответ:

```text
undefined
created
```

Рассуждение:

`var status` initialized with `undefined` during Creation Phase; assignment happens later.

Типичная ошибка:

Expect ReferenceError like `let`.

Automation QA connection:

Legacy code can silently continue with `undefined`.

### Задача 3

Ответ:

With first line commented:

```text
https://example.com
```

If uncommented:

```text
ReferenceError before initialization
```

Рассуждение:

`const baseUrl` is in TDZ before declaration line.

Типичная ошибка:

Expect undefined.

Automation QA connection:

Config constants must be declared before building derived URLs.

## Determine identifier state

Ответ:

```text
Line | Identifier | State
1    | userName   | registered, uninitialized, TDZ
3    | userName   | initialized, readable
4    | role       | initialized, readable after line
5    | status     | was undefined before line, assigned "created" on line
7    | userName   | readable
8    | role       | readable
9    | status     | readable
```

Рассуждение:

Creation Phase prepares all records, but states differ.

Типичная ошибка:

Mark `userName` as missing before line 3.

Automation QA connection:

State table helps debug ReferenceError in setup code.

## Debugging tasks

### Задача 1

Ответ:

Engine knows `baseUrl`; it is registered in Environment Record. Error means access happened before initialization.

Рассуждение:

TDZ ReferenceError is about state, not absence.

Типичная ошибка:

Search for misspelling only, ignoring declaration order.

Automation QA connection:

In helper files, check whether derived constants are declared before dependencies.

### Задача 2

Ответ:

Ошибка: `loginUrl` reads `baseUrl` while `baseUrl` is in TDZ.

Corrected:

```javascript
const baseUrl = 'https://example.com';
const loginUrl = baseUrl + '/login';
```

Рассуждение:

Dependency must be initialized before derived value.

Типичная ошибка:

Think `const baseUrl` will be available because it appears later in file.

Automation QA connection:

Common mistake in Playwright URL builders.

### Задача 3

Ответ:

Точнее:

```text
let and const are registered during Creation Phase,
but access before initialization is forbidden.
```

Рассуждение:

This preserves Hoisting model and explains TDZ.

Типичная ошибка:

Use shortcut that contradicts Lexical Environment model.

Automation QA connection:

Precise language improves team debugging and mentoring.

## QA-oriented tasks

### Сценарий 1

Ответ:

Helper падает because `loginUrl` tries to read `baseUrl` before `baseUrl` initialization.

Corrected:

```javascript
const baseUrl = 'https://example.com';
const loginUrl = baseUrl + '/login';
```

Рассуждение:

`baseUrl` is registered but in TDZ until declaration line executes.

Типичная ошибка:

Blame string concatenation instead of declaration order.

Automation QA connection:

URL builders should declare base config before derived URLs.

### Сценарий 2

Ответ:

Output:

```text
undefined
```

This can hide a bug because test continues with missing expected value.

Рассуждение:

`var` is readable before assignment.

Типичная ошибка:

Treat undefined as valid expected status.

Automation QA connection:

Modern tests prefer `const` to fail earlier on ordering mistakes.

### Сценарий 3

Ответ:

TDZ makes reads before initialization fail loudly. This helps find declaration order mistakes instead of silently using `undefined`.

Рассуждение:

`const` also communicates that value should not be reassigned.

Типичная ошибка:

Use `var` to avoid ReferenceError, hiding real issue.

Automation QA connection:

Fail-fast behavior is valuable in Playwright setup and helpers.

## Mini-project

Один из вариантов:

```javascript
const baseUrl = 'https://example.com';
let userName;

console.log(userName);

userName = 'Anna';

console.log(baseUrl);
console.log(userName);

var status = 'created';

console.log(status);
```

Timeline:

```text
Creation Phase
├── baseUrl → uninitialized
├── userName → uninitialized
└── status → undefined

Execution Phase
├── initialize baseUrl
├── initialize userName with undefined
├── read userName → undefined
├── assign userName → "Anna"
├── read baseUrl → "https://example.com"
├── read userName → "Anna"
├── assign status → "created"
└── read status → "created"
```

Рассуждение:

`baseUrl` and `userName` have TDZ before their declaration lines, but all reads in this project happen after initialization.

Типичная ошибка:

Put `console.log(baseUrl)` before `const baseUrl`.

Automation QA connection:

This mirrors test setup: config first, mutable setup value second, status after action.

## Возможные улучшения

После выполнения практики можно:

* inspect helper files for derived constants before dependencies;
* replace `var` with `let` / `const` in new code where appropriate;
* add declaration-order checklist to code review;
* revisit Hoisting and Lexical Environment if TDZ feels mysterious.
