# Решения: Call Stack

## Концептуальные вопросы

### 1. Зачем JavaScript нужен Call Stack?

Ответ: чтобы управлять active function calls.

Объяснение: stack remembers current function and callers.

Ошибка: думать, что nested calls complete without return tracking.

QA связь: stack trace in tests shows helper call chain.

### 2. Что происходит со stack при function call?

Ответ: new frame is pushed on top.

Объяснение: called function becomes current execution.

Ошибка: считать, что caller disappears.

QA связь: test waits while helper runs.

### 3. Что происходит со stack, когда function завершается?

Ответ: its frame is popped.

Объяснение: execution returns to caller.

Ошибка: забыть return flow.

QA связь: after helper finishes, test continues.

### 4. Почему после `c()` JavaScript возвращается в `b()`?

Ответ: because `b()` is the caller below `c()` on Call Stack.

Объяснение: when `c` frame pops, `b` frame becomes top.

Ошибка: ожидать jump to global immediately.

QA связь: assertion helper returns to test helper, not directly to runner.

### 5. Что означает правило: выполняется top frame?

Ответ: JavaScript executes only the function frame at the top of Call Stack.

Объяснение: synchronous execution has one current frame.

Ошибка: думать, что `a`, `b`, `c` run simultaneously.

QA связь: synchronous test helper chain executes step by step.

## Чтение кода

Ответ:

```text
top
│
├── c
├── b
├── a
└── Global
```

Объяснение: `a()` called `b()`, and `b()` called `c()`.

Ошибка: draw `a` on top while `c` is executing.

QA связь: top stack frame is where the current failure usually happens.

## Предскажите результат выполнения

Ответ:

```text
enter a
enter b
enter c
leave c
leave b
leave a
```

Объяснение: calls go down into nested functions; completion returns back outward.

Ошибка: print all enter lines and then forget leave order.

QA связь: setup helper completes before caller continues.

## Debugging

Ответ: error happened in `c`; calls came through `b`, then `a`.

Объяснение: stack trace top shows error location, lower lines show callers.

Ошибка: fixing `a` when bug is inside `c`.

QA связь: Playwright helper stack traces are read the same way.

## QA analogy

Ответ: top stack frame corresponds to currently running assertion/helper.

Объяснение: if assertion runs now, test and helper wait below it.

Ошибка: reading stack as chronological list only.

QA связь: current failing helper is usually near the top.

## Мини-сценарий

Ответ:

```javascript
function c() {
  console.log('enter c');
  console.log('leave c');
}

function b() {
  console.log('enter b');
  c();
  console.log('leave b');
}

function a() {
  console.log('enter a');
  b();
  console.log('leave a');
}

a();
```

Объяснение:

```text
push a -> push b -> push c -> pop c -> pop b -> pop a
```

Ошибка: pop caller before callee.

QA связь: nested helpers finish in reverse order of calls.
