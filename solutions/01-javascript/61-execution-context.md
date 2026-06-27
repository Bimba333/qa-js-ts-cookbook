# Решения: Execution Context

## Концептуальные вопросы

### 1. Что создается, когда JavaScript начинает выполнять файл?

Ответ: Global Execution Context.

Объяснение: это execution unit для top-level code.

Ошибка: думать, что файл выполняется без подготовки.

QA связь: как test runner готовит test execution, JavaScript готовит execution environment.

### 2. Когда создается Function Execution Context?

Ответ: при function call.

Объяснение: function body выполняется только после invocation.

Ошибка: считать, что function declaration already executes body.

QA связь: helper body runs only when helper is called.

### 3. Почему function declaration не означает немедленное выполнение function body?

Ответ: declaration only makes function available.

Объяснение: execution starts at call expression, например `a()`.

Ошибка: смешивать declaration and invocation.

QA связь: declared helper does nothing until test calls it.

### 4. Чем Global Execution Context отличается от Function Execution Context?

Ответ: Global Context belongs to file-level code; Function Context belongs to one function call.

Объяснение: each call gets its own execution unit.

Ошибка: считать, что все code runs in one identical context.

QA связь: test-level setup and helper-local data live at different levels.

### 5. Как Execution Context связан с примером `a() -> b() -> c()`?

Ответ: calls `a`, `b`, `c` each create Function Execution Context.

Объяснение: every called function needs an environment to run its body.

Ошибка: видеть только output and ignore function execution units.

QA связь: helper chains create nested execution steps.

## Чтение кода

Ответ: при запуске файла создается Global Execution Context. При `a()` создается context for `a`; внутри него call `b()` creates context for `b`; внутри `b()` call `c()` creates context for `c`.

Объяснение: function context appears at invocation time.

Ошибка: думать, что contexts for all functions are fully executing immediately at file load.

QA связь: helper chain executes only when test reaches calls.

## Предскажите результат выполнения

Ответ:

```text
before
a
after
```

Объяснение: top-level code logs `before`, then call `a()` runs function body, then execution returns and logs `after`.

Ошибка: ожидать `a` before `before`.

QA связь: test steps run in written execution order, except when a step calls helper body.

## Debugging

Ответ: `message` belongs to Function Execution Context of `c()`, so it is not available outside.

Объяснение: local variable exists inside function execution environment.

Ошибка: ожидать local value at global level.

QA связь: helper-local data should be returned or passed if caller needs it.

## QA analogy

Ответ: both describe prepared execution environment.

Объяснение: test runner prepares test execution; JavaScript prepares code execution.

Ошибка: растягивать аналогию дальше подготовки execution.

QA связь: useful only to understand preparation before running.

## Мини-сценарий

Ответ:

```javascript
function c() {
  const message = 'inside c';
  console.log(message);
}

function b() {
  c();
}

function a() {
  b();
}

a();
```

Объяснение: `a()` creates context for `a`, `b()` creates context for `b`, `c()` creates context for `c`.

Ошибка: считать, что `message` belongs to all contexts.

QA связь: local helper data belongs to a specific helper call.
