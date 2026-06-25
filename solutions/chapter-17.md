# Решения. Глава 17. Stack & Heap

## Концептуальные вопросы

### 1. Why use Stack & Heap diagrams

Ответ:

They help visualize primitive values, object values, references, sharing, mutation and reassignment.

Рассуждение:

The diagram turns invisible reference behavior into a map.

Типичная ошибка:

Think the diagram is valuable only if it is exact engine implementation.

Automation QA connection:

Diagrams help debug shared request bodies and fixture state.

### 2. Not exact engine implementation

Ответ:

Real JavaScript engines are optimized and more sophisticated than textbook diagrams.

Рассуждение:

The chapter teaches a conceptual model, not V8 or SpiderMonkey internals.

Типичная ошибка:

Teach simplified diagrams as physical truth.

Automation QA connection:

For debugging tests, behavior model is more useful than engine internals.

### 3. Stack-like area

Ответ:

It is where diagrams show active variable entries, primitive values and references.

Рассуждение:

It represents currently active names in a compact way.

Типичная ошибка:

Assume every drawn primitive is physically stored exactly there.

Automation QA connection:

Useful to track variables in a test or helper.

### 4. Heap-like area

Ответ:

It is where diagrams show object values.

Рассуждение:

Objects are drawn separately so references and sharing are visible.

Типичная ошибка:

Say every object is physically stored exactly as drawn.

Automation QA connection:

Useful to see shared payload objects.

### 5. Primitive values

Ответ:

They are often drawn directly near variable names in stack-like area.

Рассуждение:

This explains why primitive reassignment does not mutate another variable.

Типичная ошибка:

Apply object sharing behavior to primitives.

Automation QA connection:

Primitive expected values are not mutated like shared objects.

### 6. Object values

Ответ:

They are drawn in heap-like area, with variables pointing to them.

Рассуждение:

This makes reference sharing visible.

Типичная ошибка:

Draw copied object after direct assignment.

Automation QA connection:

Shared object diagrams reveal payload mutation.

### 7. Arrow from variable to object

Ответ:

It represents conceptual reference from variable to object.

Рассуждение:

The arrow says: this variable can reach this object.

Типичная ошибка:

Treat arrow as a low-level implementation claim.

Automation QA connection:

It shows which test variables operate on same data.

### 8. Mutation vs reassignment

Ответ:

Mutation changes property in same object. Reassignment changes which object a variable refers to.

Рассуждение:

In mutation, arrow stays, object content changes. In reassignment, arrow moves to another object.

Типичная ошибка:

Use both words interchangeably.

Automation QA connection:

Debugging needs to know whether helper mutated data or variable was reassigned.

### 9. Two variables, one object

Ответ:

Direct object assignment copies the reference conceptually.

Рассуждение:

`const admin = user` means both variables refer to same object.

Типичная ошибка:

Assume object was cloned.

Automation QA connection:

Common source of shared test data bugs.

### 10. Same-looking objects

Ответ:

Two object literals create two different object values, even if properties look identical.

Рассуждение:

Identity asks whether variables refer to the same object.

Типичная ошибка:

Expect strict comparison to compare structure.

Automation QA connection:

Use structure assertions for API responses.

### 11. Function parameter

Ответ:

Parameter can refer to the same object passed by caller.

Рассуждение:

If function updates property, caller's object is updated.

Типичная ошибка:

Assume function receives independent copy.

Automation QA connection:

Helpers can mutate payloads.

### 12. Flaky tests

Ответ:

Diagrams show hidden shared state and where mutation happens.

Рассуждение:

Flakiness often appears when shared object is changed by another test or helper.

Типичная ошибка:

Look only at final assertion.

Automation QA connection:

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

Рассуждение:

Primitive reassignment changes `adminName`, not `userName`.

Типичная ошибка:

Draw reference sharing for primitives.

Automation QA connection:

Primitive expected values are usually simple to reason about.

### Задача 2

Ответ:

```text
Stack-like area           Heap-like area
user  ───────────────┐
admin ───────────────┘──► Object A
                          └── name: "Anna"
```

Рассуждение:

Only one object literal exists. `admin = user` shares reference.

Типичная ошибка:

Draw Object B for `admin`.

Automation QA connection:

Direct assignment of payload creates shared object.

### Задача 3

Ответ:

```text
oldUser     ───────► Object A
                    └── name: "Anna"

currentUser ───────► Object B
                    └── name: "Kate"
```

Рассуждение:

Reassignment moves `currentUser` to new object. `oldUser` remains with Object A.

Типичная ошибка:

Think reassignment updates Object A.

Automation QA connection:

Important when preserving original test data.

### Задача 4

Ответ:

```text
Stack-like area           Heap-like area
user ───────────────────► Object A
                          └── profile ──► Object B
                                          └── name: "Anna"
```

Рассуждение:

Nested object is also represented as object value in the conceptual map.

Типичная ошибка:

Draw nested object as primitive field.

Automation QA connection:

API responses often have nested objects.

## Identify shared objects

### Задача 1

Ответ:

Objects created: 1. `defaultPayload` and `adminPayload` refer to same object. Mutation: `adminPayload.role = 'admin'`. No reassignment.

Рассуждение:

Direct assignment shares reference.

Типичная ошибка:

Expect `defaultPayload.role` to stay `'user'`.

Automation QA connection:

Shared request body changed unexpectedly.

### Задача 2

Ответ:

Objects created: 2. No shared object. No mutation. No reassignment.

Рассуждение:

Two object literals create two object values.

Типичная ошибка:

Think identical properties mean same object.

Automation QA connection:

Expected and actual objects can be structurally same but not identical.

### Задача 3

Ответ:

Objects created: 2. `selectedUser` first refers to Object A, then is reassigned to Object B. No shared object remains.

Рассуждение:

Second object literal creates new object; assignment moves the variable's reference.

Типичная ошибка:

Call reassignment a mutation.

Automation QA connection:

Useful when replacing request payload entirely.

## Predict the output before running

### Задача 1

Ответ:

```text
admin
```

Рассуждение:

`admin` and `user` refer to same object, so mutation through `admin` is visible through `user`.

Типичная ошибка:

Expect `user.role` to remain `'user'`.

Automation QA connection:

Same issue with shared fixtures.

### Задача 2

Ответ:

```text
Anna
Kate
```

Рассуждение:

`firstUser` remains connected to Object A. `currentUser` moves to Object B.

Типичная ошибка:

Think reassignment affects all aliases.

Automation QA connection:

Preserved references keep old object.

### Задача 3

Ответ:

```text
false
```

Рассуждение:

The variables refer to two different objects.

Типичная ошибка:

Expect structure comparison.

Automation QA connection:

Use suitable assertions for object structure.

## Debugging tasks

### Задача 1

Ответ:

Diagram:

```text
defaultPayload ──┐
requestPayload ──┘──► Object A
                      └── role: "admin"
```

Bug: `requestPayload` is not a new object. It refers to same object as `defaultPayload`.

Рассуждение:

Mutation through `requestPayload` updates Object A.

Типичная ошибка:

Think direct assignment copied the object.

Automation QA connection:

This causes request data leaks between tests.

### Задача 2

Ответ:

Output:

```text
true
```

The helper parameter refers to the same object as `testUser`.

Рассуждение:

`user.deleted = true` mutates Object A.

Типичная ошибка:

Assume helper receives a copy.

Automation QA connection:

Payload builders can mutate caller's object.

### Задача 3

Ответ:

`false`, because `expected` and `actual` refer to different objects.

Рассуждение:

Strict comparison checks identity for objects.

Типичная ошибка:

Expect same properties to be enough.

Automation QA connection:

Use deep equality or field assertions where appropriate.

## QA-oriented tasks

### Сценарий 1

Ответ:

Risk diagram:

```text
fixture defaultUser ──┐
test local user    ───┘──► Object A
                           └── role: changed by test
```

Рассуждение:

If fixture returns shared object and test mutates it, shared state changes.

Типичная ошибка:

Treat fixture result as private data without checking creation strategy.

Automation QA connection:

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

Diagram:

```text
defaultPayload ─────► Object A
                      ├── email: "anna@example.com"
                      └── role: "user"

adminPayload ───────► Object B
                      ├── email: "anna@example.com"
                      └── role: "admin"
```

Рассуждение:

Object spread creates a new first-level object.

Типичная ошибка:

Use `const adminPayload = defaultPayload`.

Automation QA connection:

Safe payload variants reduce shared state risk.

### Сценарий 3

Ответ:

Checklist:

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

Рассуждение:

The flaky role value likely comes from shared mutation.

Типичная ошибка:

Only inspect assertion line.

Automation QA connection:

This is a practical Playwright debugging workflow.

## Mini-project

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

Conceptual table:

```text
Variable       | Heap-like object | Shared?                       | QA risk
-------------- | ---------------- | ----------------------------- | ------------------------
defaultPayload | Object A          | shared with sharedPayload      | can be mutated
sharedPayload  | Object A          | shared with defaultPayload     | mutates default payload
safePayload    | Object B          | separate first-level object    | safer, but nested needs care
```

Рассуждение:

`sharedPayload` and `defaultPayload` refer to Object A. `safePayload` is a new first-level object, then helper mutates that object by adding `trackingId`.

Типичная ошибка:

Think `sharedPayload` is independent.

Automation QA connection:

This mirrors real request payload preparation in API and Playwright tests.
