# Решения. Глава 17. Stack & Heap

## Концептуальные вопросы

### 1. Why use Stack & Heap diagrams

Ответ:

They help visualize primitive значения, object значения, references, sharing, mutation and reassignment.

Объяснение:

The diagram turns invisible reference поведение into a map.

Распространённая ошибка:

Think the diagram is valuable only if it is exact engine implementation.

Связь с Automation QA:

Diagrams help debug shared request bodies and fixture состояние.

### 2. Not exact engine implementation

Ответ:

Real JavaScript engines are optimized and more sophisticated than textbook diagrams.

Объяснение:

The chapter teaches a conceptual model, not V8 or SpiderMonkey internals.

Распространённая ошибка:

Teach simplified diagrams as physical truth.

Связь с Automation QA:

For debugging tests, поведение model is more useful than engine internals.

### 3. Stack-like area

Ответ:

It is where diagrams show active variable entries, primitive значения and references.

Объяснение:

It represents currently active names in a compact way.

Распространённая ошибка:

Assume every drawn primitive is physically stored exactly there.

Связь с Automation QA:

Useful to track variables in a test or helper.

### 4. Heap-like area

Ответ:

It is where diagrams show object значения.

Объяснение:

Objects are drawn separately so references and sharing are visible.

Распространённая ошибка:

Say every object is physically stored exactly as drawn.

Связь с Automation QA:

Useful to see shared payload objects.

### 5. Primitive значения

Ответ:

They are often drawn directly near variable names in stack-like area.

Объяснение:

This explains why primitive reassignment does not mutate another variable.

Распространённая ошибка:

Apply object sharing поведение to primitives.

Связь с Automation QA:

Primitive expected значения are not mutated like shared objects.

### 6. Object значения

Ответ:

They are drawn in heap-like area, with variables pointing to them.

Объяснение:

This makes reference sharing visible.

Распространённая ошибка:

Draw copied object after direct assignment.

Связь с Automation QA:

Shared object diagrams reveal payload mutation.

### 7. Arrow from variable to object

Ответ:

It represents conceptual reference from variable to object.

Объяснение:

The arrow says: this variable can reach this object.

Распространённая ошибка:

Treat arrow as a low-level implementation claim.

Связь с Automation QA:

It shows which test variables operate on same data.

### 8. Mutation vs reassignment

Ответ:

Mutation changes property in same object. Reassignment changes which object a variable refers to.

Объяснение:

In mutation, arrow stays, object content changes. In reassignment, arrow moves to another object.

Распространённая ошибка:

Use both words interchangeably.

Связь с Automation QA:

Отладка требует понимать whether helper mutated data or variable was reassigned.

### 9. Two variables, one object

Ответ:

Direct object assignment copies the reference conceptually.

Объяснение:

`const admin = user` means both variables refer to same object.

Распространённая ошибка:

Assume object was cloned.

Связь с Automation QA:

Common source of shared test data bugs.

### 10. Same-looking objects

Ответ:

Two object literals create two different object значения, even if properties look identical.

Объяснение:

Identity asks whether variables refer to the same object.

Распространённая ошибка:

Expect strict comparison to compare structure.

Связь с Automation QA:

Use structure assertions for API responses.

### 11. Function parameter

Ответ:

Parameter can refer to the same object passed by вызывающий код.

Объяснение:

If function updates property, вызывающий код's object is updated.

Распространённая ошибка:

Assume function receives independent copy.

Связь с Automation QA:

Helpers can mutate payloads.

### 12. Flaky tests

Ответ:

Diagrams show hidden shared состояние and where mutation happens.

Объяснение:

Flakiness often appears when shared object is changed by another test or helper.

Распространённая ошибка:

Look only at final assertion.

Связь с Automation QA:

Memory maps help debug Playwright fixtures and shared configs.

## Draw memory diagrams

### Задача 1

Ответ:

```text
Stack-like area
│
├── userName:  "Anna"
└── adminName: "Kate"
```

Объяснение:

Primitive reassignment changes `adminName`, not `userName`.

Распространённая ошибка:

Draw reference sharing for primitives.

Связь с Automation QA:

Primitive expected значения are usually simple to reason about.

### Задача 2

Ответ:

```text
Stack-like area           Heap-like area
user  ───────────────┐
admin ───────────────┘──► Object A
                          └── name: "Anna"
```

Объяснение:

Only one object literal exists. `admin = user` shares reference.

Распространённая ошибка:

Draw Object B for `admin`.

Связь с Automation QA:

Direct assignment of payload creates shared object.

### Задача 3

Ответ:

```text
oldUser     ───────► Object A
                    └── name: "Anna"

currentUser ───────► Object B
                    └── name: "Kate"
```

Объяснение:

Reassignment moves `currentUser` to new object. `oldUser` remains with Object A.

Распространённая ошибка:

Think reassignment updates Object A.

Связь с Automation QA:

Важно при сохранении исходных тестовых данных.

### Задача 4

Ответ:

```text
Stack-like area           Heap-like area
user ───────────────────► Object A
                          └── profile ──► Object B
                                          └── name: "Anna"
```

Объяснение:

Nested object is also represented as object value in the conceptual map.

Распространённая ошибка:

Draw nested object as primitive поле.

Связь с Automation QA:

API responses often have nested objects.

## Определите shared objects

### Задача 1

Ответ:

Objects created: 1. `defaultPayload` and `adminPayload` refer to same object. Mutation: `adminPayload.role = 'admin'`. No reassignment.

Объяснение:

Direct assignment shares reference.

Распространённая ошибка:

Expect `defaultPayload.role` to stay `'user'`.

Связь с Automation QA:

Shared request body changed unexpectedly.

### Задача 2

Ответ:

Objects created: 2. No shared object. No mutation. No reassignment.

Объяснение:

Two object literals create two object значения.

Распространённая ошибка:

Think identical properties mean same object.

Связь с Automation QA:

Expected and actual objects can be structurally same but not identical.

### Задача 3

Ответ:

Objects created: 2. `selectedUser` first refers to Object A, then is reassigned to Object B. No shared object remains.

Объяснение:

Second object literal creates new object; assignment moves the variable's reference.

Распространённая ошибка:

Call reassignment a mutation.

Связь с Automation QA:

Useful when replacing request payload entirely.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
admin
```

Объяснение:

`admin` and `user` refer to same object, so mutation through `admin` is visible through `user`.

Распространённая ошибка:

Expect `user.role` to remain `'user'`.

Связь с Automation QA:

Same issue with shared fixtures.

### Задача 2

Ответ:

```text
Anna
Kate
```

Объяснение:

`firstUser` remains connected to Object A. `currentUser` moves to Object B.

Распространённая ошибка:

Think reassignment affects all aliases.

Связь с Automation QA:

Preserved references keep old object.

### Задача 3

Ответ:

```text
false
```

Объяснение:

The variables refer to two different objects.

Распространённая ошибка:

Expect structure comparison.

Связь с Automation QA:

Use suitable assertions for object structure.

## Задачи на отладку

### Задача 1

Ответ:

Схема:

```text
defaultPayload ──┐
requestPayload ──┘──► Object A
                      └── role: "admin"
```

Bug: `requestPayload` is not a new object. It refers to same object as `defaultPayload`.

Объяснение:

Mutation through `requestPayload` updates Object A.

Распространённая ошибка:

Think direct assignment copied the object.

Связь с Automation QA:

This causes request data leaks between tests.

### Задача 2

Ответ:

Вывод:

```text
true
```

The helper parameter refers to the same object as `testUser`.

Объяснение:

`user.deleted = true` mutates Object A.

Распространённая ошибка:

Assume helper receives a copy.

Связь с Automation QA:

Payload builders can mutate вызывающий код's object.

### Задача 3

Ответ:

`false`, because `expected` and `actual` refer to different objects.

Объяснение:

Strict comparison checks identity for objects.

Распространённая ошибка:

Expect same properties to be enough.

Связь с Automation QA:

Use deep equality or поле assertions where appropriate.

## QA-задачи

### Сценарий 1

Ответ:

Risk схема:

```text
fixture defaultUser ──┐
test local user    ───┘──► Object A
                           └── role: changed by test
```

Объяснение:

If fixture returns shared object and test mutates it, shared состояние changes.

Распространённая ошибка:

Treat fixture result as private data without checking creation strategy.

Связь с Automation QA:

Fixture mutation can produce flaky tests.

### Сценарий 2

Ответ:

```javascript
const defaultPayload = {
  email: 'anna@example.com',
  role: 'user',
};

const adminPayload = {
  ...defaultPayload,
  role: 'admin',
};
```

Схема:

```text
defaultPayload ─────► Object A
                      ├── email: "anna@example.com"
                      └── role: "user"

adminPayload ───────► Object B
                      ├── email: "anna@example.com"
                      └── role: "admin"
```

Объяснение:

Object spread creates a new first-level object.

Распространённая ошибка:

Use `const adminPayload = defaultPayload`.

Связь с Automation QA:

Safe payload variants reduce shared состояние risk.

### Сценарий 3

Ответ:

Чек-лист:

```text
1. Draw variables used in test.
2. Draw objects separately.
3. Mark direct assignments.
4. Mark helper calls.
5. Mark property mutations.
6. Check if fixture returns shared object.
7. Check if expected object was mutated.
8. Check if payload variant was copied or shared.
```

Объяснение:

The flaky role value likely comes from shared mutation.

Распространённая ошибка:

Only inspect assertion line.

Связь с Automation QA:

This is a practical Playwright debugging workflow.

## Мини-проект

Возможное решение:

```javascript
const defaultPayload = {
  email: 'anna@example.com',
  role: 'user',
};

const sharedPayload = defaultPayload;

sharedPayload.role = 'admin';

const safePayload = {
  ...defaultPayload,
  role: 'manager',
};

function addTrackingId(payload) {
  payload.trackingId = 'track-123';
}

addTrackingId(safePayload);

console.log(defaultPayload);
console.log(sharedPayload);
console.log(safePayload);
```

Концептуальная таблица:

```text
Variable       | Heap-like object | Shared?                       | QA risk
-------------- | ---------------- | ----------------------------- | ------------------------
defaultPayload | Object A          | shared with sharedPayload      | can be mutated
sharedPayload  | Object A          | shared with defaultPayload     | mutates default payload
safePayload    | Object B          | separate first-level object    | safer, but nested needs care
```

Объяснение:

`sharedPayload` and `defaultPayload` refer to Object A. `safePayload` is a new first-level object, then helper mutates that object by adding `trackingId`.

Распространённая ошибка:

Think `sharedPayload` is independent.

Связь с Automation QA:

This mirrors real request payload preparation in API and Playwright tests.
