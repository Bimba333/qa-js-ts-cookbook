# Решения. Глава 11. Lexical Environment

## Концептуальные вопросы

### 1. Почему Scope нужен внутренний механизм

Ответ:

Scope описывает правила видимости, но engine нужна структура, где хранятся identifiers и links outward.

Рассуждение:

Чтобы выполнить lookup, engine должен знать current identifiers и outer environment.

Типичная ошибка:

Думать, что Scope существует только как абстрактное правило без внутренней модели.

Automation QA connection:

Эта модель помогает понять, почему helper-local names не доступны тесту.

### 2. Что такое Lexical Environment

Ответ:

Lexical Environment — conceptual internal structure, которая содержит Environment Record и Outer Environment Reference.

Рассуждение:

Record хранит identifiers текущей области, outer reference связывает ее с внешней областью.

Типичная ошибка:

Учить Lexical Environment как сухое определение без связи со Scope.

Automation QA connection:

Помогает объяснять lookup configuration values inside helpers.

### 3. Environment Record

Ответ:

Environment Record хранит records identifiers текущего environment.

Рассуждение:

Если function имеет `path`, function Environment Record conceptually содержит `path`.

Типичная ошибка:

Считать Environment Record обычным JavaScript object.

Automation QA connection:

Helper local variables можно представить как records helper environment.

### 4. Outer Environment Reference

Ответ:

Outer Environment Reference — link из current Lexical Environment к outer Lexical Environment.

Рассуждение:

Если identifier не найден current record, lookup follows outer reference.

Типичная ошибка:

Путать outer reference с Call Stack.

Automation QA connection:

Helper может read outer `baseUrl` because its environment has an outer link.

### 5. Связь со Scope

Ответ:

Scope задает rules visibility, Lexical Environment реализует эти rules через records and outer links.

Рассуждение:

Scope Chain conceptually соответствует chain of linked environments.

Типичная ошибка:

Считать Scope и Lexical Environment полными синонимами.

Automation QA connection:

При debugging tests полезно разделять rule and structure.

### 6. Связь с Execution Context

Ответ:

Execution Context использует Lexical Environment для resolving identifiers during execution.

Рассуждение:

Active Execution Context имеет current Lexical Environment.

Типичная ошибка:

Считать Execution Context только Call Stack entry.

Automation QA connection:

При падении helper важно понимать не только active function, но и identifiers доступные внутри нее.

### 7. Связь с Variables

Ответ:

Variables создают identifiers, а Environment Record хранит records об этих identifiers.

Рассуждение:

`const userName = 'qa-user'` creates identifier record in current environment.

Типичная ошибка:

Думать, что variables живут вне environment.

Automation QA connection:

Test data variables become records in their test/helper environment.

### 8. Связь с Memory

Ответ:

Memory хранит information; Lexical Environment хранит named access records к этой information.

Рассуждение:

Это разные layers одной модели.

Типичная ошибка:

Называть Environment Record всей памятью программы.

Automation QA connection:

Помогает отличать "где хранится значение" от "как identifier resolved".

### 9. Связь с Call Stack

Ответ:

Call Stack показывает active Execution Context, а Lexical Environment explains identifier resolution inside that context.

Рассуждение:

Call Stack отвечает "что выполняется", Lexical Environment отвечает "как ищется имя".

Типичная ошибка:

Объяснять lookup порядком вызовов.

Automation QA connection:

Stack trace и environment lookup нужны вместе при debugging.

### 10. Linked environments и Scope Chain

Ответ:

Scope Chain можно представить как chain of Lexical Environments, связанных через Outer Environment Reference.

Рассуждение:

Lookup moves from current record to outer record through links.

Типичная ошибка:

Думать, что engine scans whole file.

Automation QA connection:

Nested helpers читают outer configuration через predictable lookup path.

### 11. Почему не ordinary object

Ответ:

Lexical Environment — internal conceptual structure, not a regular JavaScript object.

Рассуждение:

Код не может напрямую получить Environment Record как обычный value.

Типичная ошибка:

Пытаться представить `environment.userName` as real code.

Automation QA connection:

Модель нужна для reasoning, not для написания API calls.

### 12. Bridge to Hoisting

Ответ:

Hoisting объяснит, когда declarations affect Environment Records before execution.

Рассуждение:

После понимания "где records хранятся" можно объяснять "когда records появляются".

Типичная ошибка:

Учить Hoisting как магическое поднятие строк.

Automation QA connection:

Понимание Hoisting помогает читать legacy helper code with `var` and function declarations.

## Identify Lexical Environments

Ответ:

Global Lexical Environment:

```text
Environment Record
├── baseUrl
└── testLogin

Outer Environment Reference
└── null
```

Function Lexical Environment для `testLogin`:

```text
Environment Record
└── userName

Outer Environment Reference
└── Global Lexical Environment
```

Block Lexical Environment:

```text
Environment Record
└── expectedStatus

Outer Environment Reference
└── Function Lexical Environment
```

Рассуждение:

Каждый level хранит свои identifiers and outer link.

Типичная ошибка:

Поместить `expectedStatus` в function record, игнорируя block.

Automation QA connection:

Так можно анализировать test scope, helper scope and assertion block data.

## Predict identifier lookup

### Задача 1

Ответ:

`path`:

```text
Function Environment Record → found
```

`baseUrl`:

```text
Function Environment Record → not found
Outer → Global Environment Record → found
```

Рассуждение:

Function local data and outer config resolved through different records.

Типичная ошибка:

Считать `baseUrl` local только потому, что function uses it.

Automation QA connection:

Page helpers часто используют local route and global base URL.

### Задача 2

Ответ:

`status inside printStatus`:

```text
Function Environment Record → status found
```

Рассуждение:

Local `status` shadows global `status`, lookup stops at current record.

Типичная ошибка:

Продолжить lookup до global status.

Automation QA connection:

Shadowing expected/actual status can confuse tests.

### Задача 3

Ответ:

`message`:

```text
Block Environment Record → found
```

`testName`:

```text
Block Environment Record → not found
Outer → Global Environment Record → found
```

Рассуждение:

Block uses its local message and outer testName.

Типичная ошибка:

Думать, что block cannot read outer identifiers.

Automation QA connection:

Assertion block can read test-level data.

## Predict output before running

### Задача 1

Ответ:

```text
https://example.com/profile
```

Рассуждение:

`path` found in function record, `baseUrl` found through outer global environment.

Типичная ошибка:

Ожидать ReferenceError for `baseUrl`.

Automation QA connection:

Route helper can combine global base URL and local path.

### Задача 2

Ответ:

```text
inner
outer
```

Рассуждение:

Inside function lookup finds local status. Outside function lookup finds global status.

Типичная ошибка:

Думать, что local status overwrites global status.

Automation QA connection:

Shadowing does not mutate outer test data.

## Debugging

### Задача 1

Ответ:

`path` exists in Function Lexical Environment of `printUrl`, not in Global Lexical Environment.

Рассуждение:

Global code lookup starts in global record and cannot search inside function record.

Типичная ошибка:

Думать, что calling function exposes local records.

Automation QA connection:

Helper-local values must be returned or exposed intentionally if test needs them.

### Задача 2

Ответ:

Call Stack shows that `helper` is executing. Lexical Environment explains why `baseUrl` can be resolved.

Рассуждение:

Lookup uses helper environment and outer global environment.

Типичная ошибка:

Explaining all visibility through caller/callee order.

Automation QA connection:

Stack trace tells where execution is; environment model tells where identifier came from.

### Задача 3

Ответ:

Inside `checkStatus`, current Environment Record has local `status`.

```text
Function Record: status → "local"
│
▼
lookup stops
```

Рассуждение:

Outer global `status` remains, but is shadowed.

Типичная ошибка:

Think local declaration changes global status.

Automation QA connection:

Use precise names to avoid status shadowing in assertions.

## QA-oriented tasks

### Сценарий 1

Ответ:

```text
Helper Function Lexical Environment
│
├── Environment Record
│   ├── requestBody
│   ├── normalizedEmail
│   └── responseStatus
│
└── Outer Environment Reference
    └── outer test/module/global environment
```

Рассуждение:

These identifiers are helper-local records, so outside code does not access them directly.

Типичная ошибка:

Move helper internals to global variables for convenience.

Automation QA connection:

Isolation keeps helpers reusable and tests readable.

### Сценарий 2

Ответ:

`path` lookup:

```text
Helper Environment Record → found
```

`baseUrl` lookup:

```text
Helper Environment Record → not found
Outer → Global/Config Environment Record → found
```

Рассуждение:

Nested helper can use local data and outer configuration through linked environments.

Типичная ошибка:

Treat all helper inputs as global.

Automation QA connection:

This explains route builders in Playwright frameworks.

### Сценарий 3

Ответ:

Stack trace shows execution path:

```text
test → page object → helper
```

Lexical Environment model shows identifier resolution path:

```text
helper record → outer records
```

Both are needed: stack trace tells where code ran, environment model tells where names came from.

Рассуждение:

Runtime failure can depend on both call chain and resolved values.

Типичная ошибка:

Read only stack trace and ignore variables resolved in helper.

Automation QA connection:

This is common when wrong `baseUrl`, token or expected status is read inside helper.

## Mini-project

Один из вариантов:

```javascript
const baseUrl = 'https://example.com';

function testLogin() {
  const userName = 'qa-user';

  if (true) {
    const loginUrl = baseUrl + '/login?user=' + userName;

    console.log(loginUrl);
  }
}

testLogin();
```

Diagram:

```text
Block Lexical Environment
├── Record: loginUrl
└── Outer → Function Lexical Environment
    ├── Record: userName
    └── Outer → Global Lexical Environment
        ├── Record: baseUrl, testLogin
        └── Outer → null
```

Lookup:

```text
loginUrl → Block Record
userName → Block Record → Function Record
baseUrl  → Block Record → Function Record → Global Record
```

Рассуждение:

Block environment stores block-local `loginUrl`, function environment stores `userName`, global environment stores `baseUrl`.

Типичная ошибка:

Put all identifiers into one global record.

Automation QA connection:

This mirrors a real UI test: global config, test-local data, block-local composed URL.

## Возможные улучшения

После выполнения практики можно:

* нарисовать Lexical Environments для одного реального Playwright helper;
* сравнить stack trace path and environment lookup path;
* найти shadowing in test code;
* вернуться к этой главе перед Hoisting.
