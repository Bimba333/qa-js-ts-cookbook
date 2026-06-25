# Stack & Heap

## Связь с предыдущей главой

Предыдущая глава объяснила references через observable behavior:

```javascript
const user = {
  name: 'Anna',
};

const admin = user;

admin.name = 'Kate';

console.log(user.name);
```

Результат:

```text
Kate
```

Мы уже понимаем основную идею:

```text
Variables do not contain objects.
Variables refer to object values.
Multiple variables can refer to the same object.
```

Теперь появляется следующий вопрос:

> Почему почти все книги, статьи и схемы рисуют Stack and Heap?

Ответ: Stack & Heap diagrams are conceptual tools. Они помогают визуализировать behavior with primitive values, object values and references.

Важно:

```text
Stack & Heap diagrams
│
├── help understand JavaScript behavior
├── are useful mental maps
└── are not exact descriptions of every JavaScript engine
```

Главный вопрос этой главы:

> What does this diagram help us understand?

---

## Предварительные требования

Для этой главы нужно понимать:

* что primitive values are indivisible;
* что Object values group related information;
* что variables give named access;
* что references connect variables with object values conceptually;
* что multiple variables can refer to the same object;
* что property update through one reference is visible through another reference.

Не требуется знать Garbage Collector internals, memory allocation algorithms, engine optimizations, V8 implementation details, SpiderMonkey implementation or JavaScript specification internals. Эти темы не разбираются в этой главе.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            110-140 минут
Разбор схем:             45-60 минут
Запуск примеров:         20-30 минут
Практика:                90-120 минут
Повторение материала:    25 минут
```

Уровень сложности: **L3**.

Тема опасна не сложностью синтаксиса, а неправильной уверенностью. Диаграмма помогает, но если воспринимать ее как буквальное устройство каждого engine, она начинает мешать.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/13-references.md
```

Текущая глава:

```text
docs/01-javascript/14-stack-and-heap.md
```

Следующая глава:

```text
docs/01-javascript/15-type-conversion.md
```

Следующая глава сменит фокус с memory model на value transformations: как JavaScript converts values between types.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем programmers use Stack & Heap diagrams;
* что Stack means in this conceptual model;
* что Heap means in this conceptual model;
* как primitive values обычно показывают на таких диаграммах;
* как object values обычно показывают на таких диаграммах;
* как references связывают Stack side and Heap side conceptually;
* как function calls relate to Stack на высоком уровне;
* как visual diagrams explain object sharing;
* как visual diagrams explain reassignment;
* какие misconceptions возникают вокруг Stack & Heap;
* почему эта модель полезна in Automation QA debugging;
* почему real JavaScript engines are more sophisticated than the diagram.

---

## Мотивация

Мы уже знаем поведение:

```javascript
const user = {
  name: 'Anna',
};

const admin = user;

admin.name = 'Kate';

console.log(user.name);
```

Но когда программа становится больше, одной фразы "оба variables refer to same object" недостаточно. Нужно видеть картину.

Без диаграммы:

```text
user and admin refer to the same object,
then admin mutates property,
then user sees updated property.
```

С диаграммой:

```text
Stack-like area           Heap-like area
───────────────           ──────────────
user  ───────────────┐
admin ───────────────┼──► Object A
                     │    └── name: "Kate"
```

Что эта диаграмма помогает понять?

```text
There is one object.
There are two variable entries.
Both entries lead to the same object.
Property update changes the shared object.
```

Это и есть причина, почему Stack & Heap diagrams are popular: they make reference behavior visible.

---

## Теория

### Почему programmers use Stack & Heap diagrams

Stack & Heap diagrams answer practical questions:

```text
Where do I draw variable names?
Where do I draw object values?
How do I show references?
Why did object change through another variable?
Why did reassignment not change old object?
```

Conceptual overview:

```text
Conceptual Memory Map
│
├── Stack-like area
│   ├── local variable entries
│   ├── primitive values in simple diagrams
│   └── references to objects
│
└── Heap-like area
    ├── object values
    ├── arrays
    ├── functions
    └── nested object values
```

Важно:

```text
This is a conceptual map.
It explains behavior.
It is not a promise of exact engine layout.
```

### Stack as a conceptual model

Stack in this chapter is a conceptual area where we draw active execution data: variable entries, primitive values and references.

Stack concept:

```text
Stack-like area
│
├── userName: "Anna"
├── age: 30
└── user: reference to Object A
```

What does this diagram help us understand?

```text
Which names are active right now.
Which primitive values are easy to show directly.
Which variables point to objects elsewhere in the diagram.
```

This continues earlier chapters:

```text
Execution Context creates environment
│
Call Stack manages active contexts
│
Variables give named access
│
Stack diagram shows active names in a compact way
```

Function call details are still high-level in this chapter. Execution Context and Call Stack internals were introduced earlier; here we only connect them to the conceptual memory picture.

### Heap as a conceptual model

Heap in this chapter is a conceptual area where we draw object values.

Heap concept:

```text
Heap-like area
│
├── Object A
│   ├── name: "Anna"
│   └── role: "user"
│
└── Object B
    ├── name: "Kate"
    └── role: "admin"
```

What does this diagram help us understand?

```text
Objects can be shared.
Objects can be mutated through references.
Objects can outlive one specific variable entry while still reachable.
```

Do not read this as:

```text
Every engine physically stores every object exactly here.
```

Read it as:

```text
The conceptual model represents object values separately from variable entries.
```

### Primitive values in the conceptual model

Primitive value diagram:

```javascript
let userName = 'Anna';
let adminName = userName;

adminName = 'Kate';
```

Conceptual diagram:

```text
Stack-like area
│
├── userName:  "Anna"
└── adminName: "Kate"
```

What does this diagram help us understand?

```text
Changing adminName does not change userName.
Primitive assignment is shown as independent values in this model.
```

Primitive assignment:

```text
Step 1
│
└── userName: "Anna"

Step 2: adminName = userName
│
├── userName:  "Anna"
└── adminName: "Anna"

Step 3: adminName = "Kate"
│
├── userName:  "Anna"
└── adminName: "Kate"
```

### Object values in the conceptual model

Object value diagram:

```javascript
const user = {
  name: 'Anna',
  role: 'user',
};
```

Conceptual diagram:

```text
Stack-like area           Heap-like area
───────────────           ──────────────
user ───────────────────► Object A
                          ├── name: "Anna"
                          └── role: "user"
```

What does this diagram help us understand?

```text
Variable entry is drawn separately.
Object value is drawn as grouped information.
Reference connects them.
```

### Variable → Reference → Object

The core diagram:

```text
Variable
│
▼
Reference
│
▼
Object
```

Expanded:

```text
Stack-like area           Heap-like area
───────────────           ──────────────
user ── reference ───────► Object A
                          ├── name: "Anna"
                          └── role: "user"
```

What does this diagram help us understand?

```text
The variable is not the object.
The reference is not the object.
The object is the grouped value reached through reference.
```

### Object assignment

```javascript
const user = {
  name: 'Anna',
};

const admin = user;
```

Object assignment diagram:

```text
Stack-like area           Heap-like area
───────────────           ──────────────
user  ───────────────┐
admin ───────────────┼──► Object A
                     │    └── name: "Anna"
```

What does this diagram help us understand?

```text
There is one object.
There are two variable entries.
Both references lead to the same object.
```

### Shared object

Shared object diagram:

```text
Stack-like area           Heap-like area
───────────────           ──────────────
defaultUser ─────────┐
testUser    ─────────┼──► Object A
adminUser   ─────────┘    ├── email: "anna@example.com"
                           └── role: "user"
```

What does this diagram help us understand?

```text
Mutating through any of these variables affects Object A.
All other variables that refer to Object A observe the change.
```

### Mutation

```javascript
adminUser.role = 'admin';
```

Mutation diagram:

```text
Before
│
├── defaultUser ──┐
└── adminUser   ──┼──► Object A
                  │    └── role: "user"

After adminUser.role = "admin"
│
├── defaultUser ──┐
└── adminUser   ──┼──► Object A
                  │    └── role: "admin"
```

What does this diagram help us understand?

```text
The reference did not change.
The object property changed.
```

### Reassignment

```javascript
let currentUser = {
  name: 'Anna',
};

const firstUser = currentUser;

currentUser = {
  name: 'Kate',
};
```

Reassignment diagram:

```text
Before reassignment
│
├── currentUser ──┐
└── firstUser   ──┼──► Object A
                  │    └── name: "Anna"

After reassignment
│
├── firstUser   ─────► Object A
│                       └── name: "Anna"
│
└── currentUser ─────► Object B
                        └── name: "Kate"
```

What does this diagram help us understand?

```text
Reassignment changes what currentUser refers to.
It does not mutate Object A.
It does not move firstUser.
```

### Function calls and Stack at a high level

Function calls create active work. Earlier chapters explained Execution Context and Call Stack. Here we draw a simplified memory map.

```javascript
function updateRole(user) {
  user.role = 'admin';
}

const testUser = {
  role: 'user',
};

updateRole(testUser);
```

Function call high-level diagram:

```text
Global active area        Heap-like area
──────────────────        ──────────────
testUser ───────────────► Object A
                          └── role: "user"

During updateRole(testUser)
────────────────────────
user ───────────────────► Object A
                          └── role: "user"
```

After mutation:

```text
testUser ───────────────► Object A
                          └── role: "admin"
```

What does this diagram help us understand?

```text
Function parameter can refer to same object as outer variable.
Mutation inside function changes shared object.
```

Function internals, parameters and return behavior will be studied in detail later. This is only high-level connection.

### Nested object

Nested object conceptual diagram:

```javascript
const user = {
  profile: {
    name: 'Anna',
  },
};
```

Diagram:

```text
Stack-like area           Heap-like area
───────────────           ──────────────
user ───────────────────► Object A
                          └── profile ──► Object B
                                          └── name: "Anna"
```

What does this diagram help us understand?

```text
Nested object is also an object value in the conceptual map.
Several levels can be connected.
Changing nested property may affect shared nested object.
```

Detailed copying of nested objects will be studied later with spread, structured data and immutability patterns.

### Identity

Object identity diagram:

```javascript
const firstUser = { name: 'Anna' };
const secondUser = { name: 'Anna' };
const sameUser = firstUser;
```

Diagram:

```text
firstUser ──────────────► Object A
                          └── name: "Anna"

secondUser ─────────────► Object B
                          └── name: "Anna"

sameUser ───────────────► Object A
```

What does this diagram help us understand?

```text
firstUser and sameUser refer to same object.
firstUser and secondUser refer to different objects.
Same-looking properties do not mean same identity.
```

### Complete execution picture

For the common example:

```javascript
const user = {
  name: 'Anna',
};

const admin = user;

admin.name = 'Kate';

console.log(user.name);
```

Complete execution picture:

```text
1. Create object
│
▼
Heap-like area
└── Object A
    └── name: "Anna"

2. user refers to Object A
│
▼
Stack-like area           Heap-like area
user ───────────────────► Object A
                          └── name: "Anna"

3. admin receives same reference
│
▼
user  ───────────────┐
admin ───────────────┼──► Object A
                     │    └── name: "Anna"

4. admin.name = "Kate"
│
▼
user  ───────────────┐
admin ───────────────┼──► Object A
                     │    └── name: "Kate"

5. user.name
│
▼
read name from Object A
│
▼
"Kate"
```

---

## Внутренний механизм

This chapter does not describe exact JavaScript engine internals.

Real engines are sophisticated:

```text
Real JavaScript engines
│
├── optimize code
├── use internal representations
├── may move data
├── may inline or specialize operations
└── do not have to match simple textbook diagrams literally
```

The model in this chapter is intentionally conceptual:

```text
Conceptual Stack & Heap model
│
├── explains observable behavior
├── helps draw references
├── helps debug shared mutation
└── prepares for deeper memory management topics
```

### Current position in JavaScript model

```text
JavaScript Engine
│
├── Runtime context
├── Execution Context
├── Call Stack
├── Memory
├── Variables
├── Scope
├── Lexical Environment
├── Hoisting / TDZ
├── Primitive Types
├── Object Type
├── References
└── Stack & Heap conceptual diagrams
```

What does this diagram help us understand?

```text
We are not learning a new syntax feature.
We are learning a map for previously observed behavior.
```

### Myth vs reality

```text
Myth
│
└── "This exact Stack/Heap picture is how every engine stores everything."

Reality
│
└── "This is a useful conceptual diagram for understanding behavior."
```

Myth vs reality diagram:

```text
Simple diagram
│
├── good for reasoning
├── good for debugging
└── not exact implementation

Real engine
│
├── more complex
├── optimized
└── implementation-specific
```

### Bridge to Type Conversion

Stack & Heap explains how we visualize values and object references.

Next, the course shifts to another kind of behavior:

```text
Value exists
│
▼
Operation expects another type
│
▼
JavaScript may convert value
```

Bridge to Equality and Type Conversion:

```text
Stack & Heap
│
└── Where do we draw values and references conceptually?
    │
    ▼
Type Conversion
│
└── How do values transform between types?
    │
    ▼
Equality
│
└── How does JavaScript compare values?
```

---

## Ментальная модель

### Desk and archive

Stack-like area is like a desk. Heap-like area is like an archive.

```text
Desk
│
├── current notes
├── active names
└── sticky notes to folders

Archive
│
├── folder: User A
├── folder: Config
└── folder: Payload
```

What does this model help understand?

```text
Active variables are easy to see on the desk.
Larger grouped information lives in folders.
Notes point from desk to folders.
```

### Sticky notes pointing to folders

```text
Sticky note: user
│
└── points to folder "Object A"

Folder Object A
│
├── name
└── role
```

Multiple sticky notes can point to one folder:

```text
user note  ──┐
admin note ──┼──► same folder
test note  ──┘
```

### Workspace and storage

```text
Workspace
│
├── currentUser
├── expectedUser
└── requestBody

Storage
│
├── Object A
├── Object B
└── Object C
```

The workspace shows what is active. Storage shows grouped objects.

### Index cards

Reference is like an index card:

```text
Index card
│
├── label: currentUser
└── points to: Object A

Object A
│
└── actual grouped data
```

### Conceptual map

Best mental model:

```text
Stack & Heap diagram
│
└── map, not territory
```

The map helps navigate. It is not the full physical world.

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-17/
```

Запуск:

```bash
node examples/chapter-17/01-primitive-memory.js
node examples/chapter-17/02-object-memory.js
node examples/chapter-17/03-reference-sharing.js
node examples/chapter-17/04-reassignment.js
node examples/chapter-17/05-function-call.js
node examples/chapter-17/06-common-mistakes.js
```

### 01-primitive-memory.js

Показывает conceptual primitive assignment.

### 02-object-memory.js

Показывает object value as grouped information reached through variable.

### 03-reference-sharing.js

Показывает shared object through two variables.

### 04-reassignment.js

Показывает difference between mutation and reassignment.

### 05-function-call.js

Показывает high-level function call and object mutation through parameter.

### 06-common-mistakes.js

Показывает accidental shared request body mutation.

---

## Частые вопросы

### Is Stack & Heap the real engine implementation?

No. It is a conceptual model used to understand behavior. Real engines are more sophisticated.

### Are primitives always physically on Stack?

This chapter does not make physical claims. In diagrams, primitive values are often drawn in stack-like area because it helps explain assignment behavior.

### Are objects always physically on Heap?

This chapter does not teach physical storage rules. It says: object values are drawn in heap-like area in the conceptual model.

### Why use the model if it is not exact?

Because it explains observable behavior well enough for reasoning, debugging and learning references.

### Does this chapter teach Garbage Collector?

No. Garbage Collector internals will be studied later. Here we only discuss diagrams for values, references and objects.

---

## Распространенные мифы

### Миф: The diagram is the engine

Реальность:

The diagram is a conceptual map.

### Миф: Objects are literally always in the exact same place shown by the drawing

Реальность:

The conceptual model represents objects separately from variable entries. Real engine layout can differ.

### Миф: Stack & Heap explains all JavaScript behavior

Реальность:

It explains a subset: references, sharing, mutation, reassignment and identity. It does not explain all language semantics.

### Миф: If I know Stack & Heap, I know Garbage Collector

Реальность:

Garbage Collector is a separate topic with its own mechanisms.

---

## Типичные ошибки

### Ошибка 1. Treat conceptual diagram as physical truth

Correct view:

```text
Use diagram to reason.
Do not overclaim implementation.
```

### Ошибка 2. Draw two objects after direct assignment

Wrong:

```text
user  ──► Object A
admin ──► Object B
```

For:

```javascript
const admin = user;
```

Better:

```text
user  ──┐
admin ──┘──► Object A
```

### Ошибка 3. Confuse reassignment with mutation

Mutation:

```text
same reference
same object
changed property
```

Reassignment:

```text
same variable name
new reference
different object
```

### Ошибка 4. Ignore shared nested objects

Nested object can also be shared in conceptual diagrams.

### Ошибка 5. Debug flaky tests without drawing shared state

If shared request body changes unexpectedly, draw:

```text
which variables point to which object
which helper changed which property
```

---

## Практическое использование

Stack & Heap diagrams are useful when:

* object is changed unexpectedly;
* helper mutates input;
* test data is reused;
* expected and actual objects look suspiciously connected;
* reassignment does not affect old variable;
* same-looking objects compare unexpectedly.

Practical checklist:

```text
1. Draw variable names.
2. Draw object values separately.
3. Connect variables to objects.
4. Mark shared references.
5. Mark mutation lines.
6. Mark reassignment lines.
7. Ask what each variable refers to after each step.
```

---

## Использование в Automation QA

### Shared request bodies

```javascript
const defaultPayload = {
  role: 'user',
};

const adminPayload = defaultPayload;
adminPayload.role = 'admin';
```

Diagram:

```text
defaultPayload ──┐
adminPayload   ──┘──► Object A
                       └── role: "admin"
```

This explains why default request body changed unexpectedly.

### Fixture mutation

A fixture may return object. If test mutates it, another part of setup may observe changed state if same object is reused.

```text
fixtureData ──┐
testData    ──┘──► Object A
```

### Object reuse

Object reuse is not bad by itself. It becomes risky when mutable shared object is changed.

### Payload preparation

Safer first-level preparation:

```javascript
const adminPayload = {
  ...defaultPayload,
  role: 'admin',
};
```

Spread details will be studied later. Here it means: create a new first-level object instead of assigning same reference.

### Debugging shared state

When Playwright test is flaky, ask:

```text
Was the same object reused?
Did a helper mutate it?
Did fixture return shared object?
Did one test change data used by another test?
```

Memory diagrams help because flaky behavior often comes from hidden shared state.

---

## Итоги

Stack & Heap diagrams are conceptual tools.

They help visualize:

```text
Primitive values
Object values
References
Shared objects
Mutation
Reassignment
Function calls at a high level
Identity
```

They do not precisely describe every JavaScript engine.

Core mental model:

```text
Stack-like area
│
└── active variable entries and references

Heap-like area
│
└── object values in conceptual diagrams
```

Use this model as a map:

```text
Good map
│
├── helps navigate
└── does not replace real territory
```

Next chapter moves from memory visualization to value transformation: Type Conversion.

---

## Что нужно запомнить

* Stack & Heap diagrams are conceptual tools.
* They explain observable JavaScript behavior.
* They are not exact descriptions of every JavaScript engine.
* Stack-like area shows active names and references in diagrams.
* Heap-like area shows object values in diagrams.
* Primitive values are often drawn directly in stack-like area.
* Object variables are drawn as references to object values.
* Direct object assignment shares reference.
* Mutation changes shared object.
* Reassignment changes what variable refers to.
* Function parameters can refer to the same object as caller variables.
* Draw diagrams when debugging shared state in tests.

---

## Quick Check

Ответьте без запуска кода.

1. Why do programmers use Stack & Heap diagrams?
2. What does Stack mean in this conceptual chapter?
3. What does Heap mean in this conceptual chapter?
4. Why should we not treat the diagram as exact engine implementation?
5. How do you draw primitive assignment?
6. How do you draw object assignment?
7. What changes in mutation?
8. What changes in reassignment?
9. Why can helper function mutate caller's object?
10. How can memory diagrams help debug flaky tests?

---

## Практика

Практика находится в файле:

```text
practice/chapter-17.md
```

Рисуйте схемы вручную. Для этой главы это не дополнительное упражнение, а основной способ проверить понимание.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-17.md
```

Читайте решения после самостоятельной попытки и сравнивайте не только output, но и diagram reasoning.
