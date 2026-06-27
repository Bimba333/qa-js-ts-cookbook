# Решения: Memory Model

## Концептуальные вопросы

### 1. Зачем программе memory во время execution?

Ответ: to keep values available between operations.

Объяснение: without memory, variables and objects could not be read later.

Ошибка: treating each line as isolated.

QA связь: test data must stay available across test steps.

### 2. Что в conceptual model хранится на Stack?

Ответ: active frames, local primitive values and references.

Объяснение: Stack follows active function calls.

Ошибка: put long-lived object contents directly into stack frame.

QA связь: helper-local values belong to active helper execution.

### 3. Что в conceptual model хранится в Heap?

Ответ: object values.

Объяснение: objects can be referenced from variables and shared between calls.

Ошибка: думать, что variable contains entire object.

QA связь: shared test data object can be seen by multiple helpers.

### 4. Почему variable with object value удобно рисовать как reference?

Ответ: because multiple variables can point to same object.

Объяснение: mutation through one variable is visible through another.

Ошибка: expecting object copy on assignment.

QA связь: payload mutation bugs often come from shared references.

### 5. Почему Stack/Heap model не нужно считать точным описанием engine internals?

Ответ: it is a practical conceptual model.

Объяснение: real engines may optimize storage, but observable behavior is explained well by this model.

Ошибка: treating diagram as physical memory map.

QA связь: debugging needs behavior model, not engine internals.

## Чтение кода

Ответ: `c` frame is on Call Stack. `count` is local primitive value in that frame. Object `{ name: 'Anna' }` is represented in Heap. `user` keeps reference to that object.

Объяснение: primitive and object values are modeled differently.

Ошибка: say `user` directly contains whole object.

QA связь: test helper may keep reference to a shared test data object.

## Предскажите результат выполнения

Ответ:

```text
active
```

Объяснение: `sameUser` and `user` refer to the same object.

Ошибка: expect `created`.

QA связь: second helper can mutate data seen by first helper.

## Debugging

Ответ: `sameUser` is not a separate copy; it refers to same Heap object.

Объяснение: assignment copies reference, not object contents.

Ошибка: expecting independent object after assignment.

QA связь: shared payload mutation can break later assertions.

## QA analogy

Ответ: both helpers can hold references to same test data object.

Объяснение: if one helper mutates property, another reference sees changed object.

Ошибка: assume every helper gets deep copy automatically.

QA связь: copy test data explicitly when isolation matters.

## Мини-сценарий

Ответ:

```javascript
function c() {
  const count = 3;
  const user = { name: 'Anna', status: 'created' };
  const sameUser = user;

  sameUser.status = 'active';

  console.log(count);
  console.log(user.status);
}

function b() {
  c();
}

function a() {
  b();
}

a();
```

Объяснение:

```text
c frame
├── count -> 3
├── user -> reference ──► Heap object
└── sameUser ───────────► same Heap object
```

Ошибка: draw two heap objects.

QA связь: two helpers may accidentally share one mutable object.
