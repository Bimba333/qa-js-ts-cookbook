# Решения: Hoisting + TDZ

## Концептуальные вопросы

### 1. Почему hoisting не означает перемещение строк кода?

Ответ: because hoisting is preparation of declarations.

Объяснение: source code order stays the same; environment is prepared before execution.

Ошибка: imagine JavaScript physically moves declarations.

QA связь: setup availability is not the same as moving test lines.

### 2. Почему function declaration можно вызвать до строки declaration?

Ответ: function declaration is registered as callable during Creation Phase.

Объяснение: by Execution Phase, name already points to function.

Ошибка: apply `let` TDZ behavior to function declarations.

QA связь: helper declarations can be called earlier, though readability may suffer.

### 3. Что получает `var` during Creation Phase?

Ответ: initial value `undefined`.

Объяснение: reading before assignment returns `undefined`.

Ошибка: expect ReferenceError for `var`.

QA связь: `undefined` can hide setup order bugs.

### 4. В каком state находятся `let` и `const` до initialization?

Ответ: registered but inaccessible.

Объяснение: this period is TDZ.

Ошибка: say they are not hoisted.

QA связь: config declared with `const` must be initialized before helper reads it.

### 5. Чем `undefined` before assignment отличается от TDZ?

Ответ: `undefined` is accessible value; TDZ forbids access.

Объяснение: `var` returns `undefined`; `let`/`const` throw ReferenceError before initialization.

Ошибка: treat both as same missing value.

QA связь: ReferenceError gives clearer setup order failure.

## Чтение кода

Ответ: `a`, `b`, and `c` are function declarations registered during Creation Phase.

Объяснение: when Execution Phase reaches `a()`, `a` is already callable.

Ошибка: think lines are moved above `a()`.

QA связь: helper availability can be prepared before test execution line.

## Предскажите результат выполнения

Ответ:

```text
undefined
inside c
```

Объяснение: `var value` is registered with `undefined`, then assignment stores `'inside c'`.

Ошибка: expect ReferenceError.

QA связь: `var` can hide missing initialization in old helper code.

## Debugging

Ответ: `message` is in TDZ at `console.log(message)`.

Объяснение: identifier exists, but initialization line has not executed yet.

Ошибка: say JavaScript does not know this name.

QA связь: reading `const` test data before initialization fails early.

## QA analogy

Ответ: `const baseUrl` is registered but inaccessible until initialization.

Объяснение: function declarations become callable; `const` does not become readable before its line.

Ошибка: treat all declarations as same kind of hoisting.

QA связь: initialize test config before helper reads it.

## Мини-сценарий

Ответ:

```javascript
run();

function run() {
  console.log('run');
}
```

Lifecycle: function declaration registered as callable before execution.

```javascript
console.log(status);
var status = 'ready';
```

Lifecycle: `status` registered with `undefined`, then assigned.

```javascript
let safeStatus = 'ready';
console.log(safeStatus);
```

Lifecycle: `safeStatus` becomes accessible after initialization.

Ошибка: describe `let` as "not hoisted".

QA связь: safe setup order reduces test helper failures.
