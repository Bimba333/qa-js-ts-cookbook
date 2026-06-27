# References

## Связь с предыдущей главой

Предыдущая глава объяснила, зачем JavaScript нужен Object Type.

Primitive value представляет одно indivisible value:

```text
Primitive
│
└── one value
```

Object value groups related information:

```text
Object
│
└── user
    ├── name: "Anna"
    ├── role: "user"
    └── active: true
```

Теперь появляется следующий вопрос.

Если object содержит много related values, как несколько variables могут работать with the same object?

Начнем с поведения, которое часто удивляет:

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

Вопрос:

> Почему изменился `user`, если мы меняли `admin`?

Эта глава отвечает на него через references.

Главный вопрос главы:

> What object is this variable referring to right now?

---

## Предварительные требования

Для этой главы нужно понимать:

* что variable дает named access к value;
* что primitive values are indivisible;
* что object value groups related information;
* что object contains properties;
* что property can be read and updated;
* что `const` prevents reassignment of identifier, but does not freeze object properties.

Не требуется знать Stack & Heap, Garbage Collector, memory addresses, engine optimizations, pointer implementation, Prototype Chain или object freezing. Эти темы будут изучаться позже.

Важно: в этой главе reference объясняется conceptually. Мы не описываем implementation details.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            110-140 минут
Разбор схем:             40-55 минут
Запуск примеров:         20-30 минут
Практика:                90-120 минут
Повторение материала:    25 минут
```

Уровень сложности: **L3**.

Это одна из ключевых тем для Automation QA. Ошибки с shared test data, expected objects and helper functions often come from misunderstanding references.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/12-object-type.md
```

Текущая глава:

```text
docs/01-javascript/13-references.md
```

Следующая глава:

```text
docs/01-javascript/14-stack-and-heap.md
```

Следующая глава объяснит commonly used conceptual memory model: Stack & Heap. В этой главе мы не используем эту модель, потому что сначала нужно понять observable behavior references.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* почему references exist;
* что reference означает conceptually;
* чем reference отличается от object;
* почему multiple variables can refer to one object;
* что происходит при reading through a reference;
* что происходит при updating through a reference;
* что означает assigning one reference to another variable;
* почему primitive assignment behaves differently;
* чем identity отличается от copied primitive values на концептуальном уровне;
* почему unexpected object changes часто возникают in Automation QA;
* как helper functions can modify shared objects;
* как безопаснее работать with expected test data.

---

## Мотивация

Начнем не с определения.

Посмотрите на код:

```javascript
const user = {
  name: 'Anna',
};

const admin = user;

admin.name = 'Kate';

console.log(user.name);
```

Если думать, что variable contains object, хочется ожидать:

```text
user.name  → "Anna"
admin.name → "Kate"
```

Но результат другой:

```text
Kate
```

Диаграмма удивительного поведения:

```text
const user = { name: "Anna" }
│
▼
const admin = user
│
▼
admin.name = "Kate"
│
▼
console.log(user.name)
│
▼
"Kate"
```

Это невозможно объяснить моделью "каждая variable содержит собственный object".

Нужна другая модель:

```text
Variable
│
└── refers to object value
```

`user` and `admin` are two ways to reach the same object.

```text
user  ─────┐
           ▼
        Object
           │
           └── name: "Kate"
           ▲
admin ─────┘
```

Главный вопрос:

> What object is this variable referring to right now?

---

## Теория

### Почему references exist

Objects can be large, structured and mutable.

```text
user
│
├── identity
│   ├── id
│   └── email
│
├── profile
│   ├── firstName
│   └── lastName
│
└── status
    ├── role
    └── isActive
```

Если бы every assignment of object created a full independent copy, JavaScript programs became harder to reason about and less practical:

```text
Assign object
│
├── copy every property?
├── copy nested objects?
├── keep identity?
└── update which copy?
```

Instead JavaScript allows variables to refer to object values.

Conceptual idea:

```text
Object value exists
│
▼
Variable gets a reference to it
│
▼
Another variable can receive same reference
│
▼
Both variables reach same object
```

Reference exists to let code work with object values without treating every object assignment as independent duplication.

### Что такое reference conceptually

Reference is a conceptual connection from a variable to an object value.

Не запоминайте это как implementation detail. В этой главе reference means:

```text
Variable
│
└── can reach an object value
```

Диаграмма Object + Reference:

```text
user
│
└── reference
    │
    ▼
  Object value
  │
  └── name: "Anna"
```

Reference is not the object itself.

```text
Reference
│
└── way to reach object

Object
│
└── actual grouped information
```

Ментальная модель bookmark:

```text
Bookmark
│
└── points to a page in a book

Page
│
└── actual content
```

Bookmark is not the page. Reference is not the object.

### Reference vs object

Object is the value with properties.

Reference is how variable reaches that object.

```javascript
const user = {
  name: 'Anna',
};
```

Conceptually:

```text
Variable: user
│
└── reference
    │
    ▼
Object value
│
└── name: "Anna"
```

Object answers:

```text
What information is grouped together?
```

Reference answers:

```text
Which object does this variable refer to?
```

### Primitive assignment

Primitive values behave differently.

```javascript
let userName = 'Anna';
let adminName = userName;

adminName = 'Kate';

console.log(userName);
console.log(adminName);
```

Output:

```text
Anna
Kate
```

Диаграмма primitive assignment:

```text
Initial
│
├── userName  → "Anna"
└── adminName → "Anna"

After adminName = "Kate"
│
├── userName  → "Anna"
└── adminName → "Kate"
```

At this conceptual level, assignment of primitive value gives another variable its own primitive value.

Primitive comparison:

```text
Primitive values
│
├── "Anna"
├── 30
└── true

Assignment
│
└── value is copied conceptually
```

This is why changing `adminName` does not affect `userName`.

### Object assignment

Object assignment behaves differently.

```javascript
const user = {
  name: 'Anna',
};

const admin = user;
```

Диаграмма object assignment:

```text
Before assignment
│
└── user
    │
    ▼
  Object
  └── name: "Anna"

After const admin = user
│
├── user
│   │
│   ▼
│ Object
│ └── name: "Anna"
│   ▲
│   │
└── admin
```

One object, two variables:

```text
user  ─────┐
           ▼
        Object
           │
           └── name: "Anna"
           ▲
admin ─────┘
```

What object is `admin` referring to right now?

```text
The same object as user.
```

### Multiple variables referring to one object

Several variables can refer to one object:

```javascript
const user = {
  name: 'Anna',
  role: 'user',
};

const admin = user;
const currentUser = user;
```

Shared object diagram:

```text
user        ──┐
admin       ──┼──► Object
currentUser ──┘    │
                   ├── name: "Anna"
                   └── role: "user"
```

This is not three users.

This is:

```text
one object
three variables referring to it
```

Ментальная модель multiple labels pointing to one folder:

```text
Label: user
Label: admin
Label: currentUser
        │
        ▼
Folder with documents
│
├── name
└── role
```

### Reading through a reference

When code reads:

```javascript
console.log(admin.name);
```

Engine conceptually does:

```text
admin
│
▼
follow reference to object
│
▼
find property name
│
▼
read property value
```

Диаграмма reading through reference:

```text
admin.name
│
├── admin refers to Object
│
├── Object has property name
│
└── returned value: "Anna"
```

Question:

> What object is `admin` referring to right now?

Ответ:

```text
The object that contains name: "Anna".
```

### Updating through a reference

When code updates:

```javascript
admin.name = 'Kate';
```

Engine conceptually does:

```text
admin
│
▼
follow reference to object
│
▼
find property name
│
▼
replace property value
```

Диаграмма updating through reference:

```text
Before
│
├── user  ──┐
└── admin ──┼──► Object
            │    └── name: "Anna"

Operation
│
└── admin.name = "Kate"

After
│
├── user  ──┐
└── admin ──┼──► Object
            │    └── name: "Kate"
```

`user.name` also shows `"Kate"` because `user` refers to the same object.

### Assigning one reference to another variable

This line:

```javascript
const admin = user;
```

does not create a new object.

It makes `admin` refer to the same object as `user`.

Variables + References:

```text
Variable user
│
└── reference to Object A

const admin = user
│
▼
Variable admin
│
└── reference to Object A
```

This is the central idea of the chapter:

```text
Variables do not contain objects.
Variables refer to object values.
Multiple variables can refer to the same object.
```

### Reference reassignment

If variable is declared with `let`, it can later refer to another object.

```javascript
let currentUser = {
  name: 'Anna',
};

const admin = currentUser;

currentUser = {
  name: 'Kate',
};

console.log(admin.name);
console.log(currentUser.name);
```

Output:

```text
Anna
Kate
```

Диаграмма reference reassignment:

```text
Step 1
│
├── currentUser ──┐
└── admin       ──┘
                  ▼
              Object A
              └── name: "Anna"

Step 2: currentUser = { name: "Kate" }
│
├── admin       ──► Object A
│                  └── name: "Anna"
│
└── currentUser ─► Object B
                   └── name: "Kate"
```

Question:

> What object is `currentUser` referring to right now?

After reassignment:

```text
Object B.
```

Question:

> What object is `admin` referring to right now?

Ответ:

```text
Object A.
```

### Identity vs copied primitive values

Primitive values are compared as values.

```javascript
const firstName = 'Anna';
const secondName = 'Anna';

console.log(firstName === secondName);
```

Conceptually:

```text
"Anna" compared with "Anna"
│
└── same primitive value
```

Object values are different. Two objects with same properties are still two different objects.

```javascript
const firstUser = {
  name: 'Anna',
};

const secondUser = {
  name: 'Anna',
};

console.log(firstUser === secondUser);
```

Conceptual object comparison:

```text
firstUser ──► Object A
              └── name: "Anna"

secondUser ─► Object B
              └── name: "Anna"

Object A and Object B are not the same object.
```

Object comparison here is about identity:

```text
Do both variables refer to the same object?
```

not:

```text
Do both objects have same-looking properties?
```

Detailed equality rules will be studied in a later chapter. Сейчас важно понять identity concept.

### Why primitives behave differently

Primitive values are indivisible.

```text
Primitive
│
└── one value
```

Object values are structured and can be updated through properties.

```text
Object
│
├── property
├── property
└── property
```

Because objects are worked with through references, changing property through one variable can be observed through another variable referring to the same object.

Common comparison:

```text
Primitive assignment
│
├── let a = "Anna"
├── let b = a
└── b = "Kate"
    │
    └── a remains "Anna"

Object assignment
│
├── const a = { name: "Anna" }
├── const b = a
└── b.name = "Kate"
    │
    └── a.name is "Kate"
```

---

## Внутренний механизм

В этой главе internal mechanism remains conceptual.

Мы не говорим, где именно находятся objects physically. Мы не используем Stack & Heap. Мы не называем reference address. Это будет позже.

Сейчас механизм такой:

```text
Object value is created
│
▼
Variable receives a reference to it
│
▼
Another variable can receive same reference
│
▼
Property read follows reference
│
▼
Property update follows reference
```

### Complete reference flow

```javascript
const user = {
  name: 'Anna',
};

const admin = user;

admin.name = 'Kate';

console.log(user.name);
```

Complete execution diagram:

```text
1. Create Object
│
▼
Object A
└── name: "Anna"

2. user refers to Object A
│
▼
user ──► Object A

3. admin receives same reference
│
▼
user  ──┐
admin ──┘──► Object A

4. admin.name = "Kate"
│
▼
user  ──┐
admin ──┘──► Object A
            └── name: "Kate"

5. user.name
│
▼
read name from Object A
│
▼
"Kate"
```

### Current position in JavaScript model

```text
JavaScript Engine
│
├── executes code
├── creates Execution Context
├── uses Call Stack
├── stores information
├── exposes named access through Variables
├── works with Primitive values
├── works with Object values
└── uses References to let variables reach objects
```

The current block:

```text
Primitive Types
│
▼
Object Type
│
▼
References
│
▼
Stack & Heap
```

### Схема типичных ошибок

```text
Mistake
│
└── "admin got its own object"

Reality
│
└── admin refers to same object as user

Consequence
│
└── admin.name update is visible through user.name
```

### Переход к Stack & Heap

References explain behavior:

```text
Several variables can refer to one object.
```

But they do not yet explain the common memory picture:

```text
Where are primitive values conceptually placed?
Where are object values conceptually placed?
Why do diagrams often show Stack and Heap?
```

Next chapter answers those questions. It will introduce Stack & Heap as a conceptual model, not as a precise engine implementation.

Bridge diagram:

```text
References
│
└── explain observable object sharing
    │
    ▼
Stack & Heap
│
└── explain common conceptual memory diagram
```

---

## Ментальная модель

### Library catalog card

Reference похожа на library catalog card.

```text
Catalog card: user
│
└── points to Book A

Catalog card: admin
│
└── points to Book A

Book A
│
└── actual content
```

Two cards can point to the same book. Editing the book changes what both cards lead to.

### Bookmark in a book

Bookmark tells you where to go. It is not the page.

```text
Bookmark
│
└── leads to page

Page
│
└── contains text
```

Variable reference leads to object. It is not the object itself.

### Address written on paper

Use this only as a conceptual navigation metaphor, not as implementation.

```text
Paper note: "Room 204"
│
└── helps find room

Room 204
│
└── actual place with objects inside
```

The note is not the room. Reference is not the object.

### Shared key to one room

Several people can have keys to the same room.

```text
key user  ──┐
key admin ──┼──► one room
key owner ──┘
```

If one person changes the whiteboard in that room, everyone entering the same room sees the change.

### Multiple labels pointing to one folder

```text
Label: user
Label: admin
Label: currentUser
        │
        ▼
Folder
│
├── name: "Kate"
└── role: "admin"
```

This model is useful for test data:

```text
expectedUser and actualUser should not accidentally point to the same mutable object.
```

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-16/
```

Запуск:

```bash
node examples/chapter-16/01-primitive-copy.js
node examples/chapter-16/02-object-reference.js
node examples/chapter-16/03-two-variables.js
node examples/chapter-16/04-update-through-reference.js
node examples/chapter-16/05-reference-reassignment.js
node examples/chapter-16/06-common-mistakes.js
```

### 01-primitive-copy.js

Показывает primitive assignment:

```javascript
let userName = 'Anna';
let adminName = userName;

adminName = 'Kate';

console.log(userName);
console.log(adminName);
```

`userName` remains `'Anna'`.

### 02-object-reference.js

Показывает object assignment:

```javascript
const user = {
  name: 'Anna',
};

const admin = user;

admin.name = 'Kate';

console.log(user.name);
```

`user` and `admin` refer to the same object.

### 03-two-variables.js

Показывает one object, two variables:

```javascript
const user = {
  name: 'Anna',
  role: 'user',
};

const currentUser = user;
```

Both variables read from the same object.

### 04-update-through-reference.js

Показывает updating through reference:

```javascript
currentUser.role = 'admin';
```

The property belongs to the shared object.

### 05-reference-reassignment.js

Показывает reference reassignment with `let`:

```javascript
let currentUser = { name: 'Anna' };
const firstUser = currentUser;

currentUser = { name: 'Kate' };
```

`currentUser` now refers to another object.

### 06-common-mistakes.js

Показывает common mistake with expected object mutation:

```javascript
const expectedUser = {
  name: 'Anna',
};

const actualUser = expectedUser;
actualUser.name = 'Kate';
```

Both variables refer to one object.

---

## Частые вопросы

### Reference is the same as object?

No.

```text
Reference
│
└── way to reach object

Object
│
└── value with properties
```

### Reference is a pointer?

This course does not use pointer implementation here. Reference is introduced as a language concept and mental model. Implementation details and engine internals are not needed for this chapter.

### Does `const` protect object from changes?

No.

```javascript
const user = {
  name: 'Anna',
};

user.name = 'Kate';
```

`const` prevents reassignment of `user`, not updating object properties.

### How can I avoid accidental mutation in tests?

At a simple level, create a new object for expected data instead of reusing a shared mutable object.

```javascript
const defaultUser = {
  name: 'Anna',
  role: 'user',
};

const expectedAdmin = {
  ...defaultUser,
  role: 'admin',
};
```

Object spread syntax creates a new object at the first level. Spread will be studied later in detail.

### Are arrays affected by references too?

Yes. Arrays are object values, so variables can refer to the same array. Arrays will be studied in a dedicated chapter.

---

## Распространенные мифы

### Миф: variable contains object

Реальность:

Variable refers to object value.

```text
Wrong
│
└── user contains full object

Better
│
└── user refers to object
```

### Миф: assigning object creates independent copy

Реальность:

Assigning object reference to another variable makes both variables refer to the same object.

```javascript
const admin = user;
```

means conceptually:

```text
admin refers to same object as user
```

### Миф: if objects look the same, they are the same

Реальность:

Two different object values may have same properties but different identity.

```text
Object A { name: "Anna" }
Object B { name: "Anna" }
```

They are not the same object.

### Миф: references require Stack & Heap knowledge first

Реальность:

References can be understood from observable behavior first. Stack & Heap will make the memory diagram clearer later.

---

## Типичные ошибки

### Ошибка 1. Неожиданно изменить shared object

```javascript
const expectedUser = {
  name: 'Anna',
};

const actualUser = expectedUser;

actualUser.name = 'Kate';

console.log(expectedUser.name);
```

Результат:

```text
Kate
```

Problem:

```text
expectedUser and actualUser refer to the same object.
```

### Ошибка 2. Думать, что object assignment copies properties

```javascript
const user = {
  name: 'Anna',
};

const admin = user;
```

This does not create a second object.

### Ошибка 3. Сравнивать object identity instead of structure

```javascript
const expectedUser = {
  name: 'Anna',
};

const actualUser = {
  name: 'Anna',
};

console.log(expectedUser === actualUser);
```

Conceptually these are two different objects.

Detailed equality and assertion strategies will be studied later.

### Ошибка 4. Mutate helper input

```javascript
function markAsAdmin(user) {
  user.role = 'admin';
}
```

This helper changes the object it receives. Functions will be studied later, but the reference behavior is already visible: if вызывающий код and helper work with same object, mutation is shared.

### Ошибка 5. Hide shared mutable test data

```javascript
const defaultUser = {
  name: 'Anna',
  role: 'user',
};

const testUser = defaultUser;
```

If `testUser` is changed, `defaultUser` is changed too.

---

## Практическое использование

References matter whenever objects are assigned, passed or reused.

### Shared configuration

```javascript
const config = {
  retries: 2,
};

const localConfig = config;

localConfig.retries = 3;

console.log(config.retries);
```

`config.retries` is `3`, because both variables refer to same object.

### Preparing new object from existing data

Sometimes you want a new object instead of shared reference.

```javascript
const defaultUser = {
  name: 'Anna',
  role: 'user',
};

const adminUser = {
  ...defaultUser,
  role: 'admin',
};
```

This uses object spread to create a new first-level object. Detailed spread behavior will be studied later.

### Complete reference overview

```text
References
│
├── connect variables with object values
├── allow multiple variables to refer to same object
├── make shared updates observable
├── differ from primitive assignment
├── explain object identity
└── prepare for Stack & Heap model
```

---

## Использование в Automation QA

### Shared test data

Shared test data is convenient but risky:

```javascript
const defaultUser = {
  email: 'anna@example.com',
  role: 'user',
};

const adminUser = defaultUser;

adminUser.role = 'admin';
```

Now `defaultUser.role` is also `'admin'`.

In tests, this can make one test affect another.

### Accidental mutation of expected objects

```javascript
const expectedUser = {
  email: 'anna@example.com',
  role: 'user',
};

const actualUser = expectedUser;
actualUser.role = 'admin';
```

This destroys the meaning of `expectedUser`.

Better:

```javascript
const expectedUser = {
  email: 'anna@example.com',
  role: 'user',
};

const actualUser = {
  email: 'anna@example.com',
  role: 'admin',
};
```

Now they are separate objects.

### Copying test data safely

For simple first-level objects:

```javascript
const defaultUser = {
  email: 'anna@example.com',
  role: 'user',
};

const adminUser = {
  ...defaultUser,
  role: 'admin',
};
```

This reduces accidental mutation of shared object. It is a first-level copy technique; nested object copying will be studied later.

### Helper functions modifying objects

```javascript
function addRole(user) {
  user.role = 'admin';
}

const testUser = {
  email: 'anna@example.com',
  role: 'user',
};

addRole(testUser);

console.log(testUser.role);
```

Output:

```text
admin
```

The helper modified the object that `testUser` refers to.

Functions will be studied later. Here the important part is reference behavior.

### Debugging unexpected object changes

When object changes unexpectedly, ask:

```text
Which variables refer to this object?
Which helper received this object?
Which line updated a property?
Was object copied or only reference assigned?
```

This mental checklist helps debug Playwright fixtures, request payload builders, shared configs and API expected objects.

---

## Итоги

References explain why object assignment behaves differently from primitive assignment.

Primitive assignment:

```text
let a = "Anna"
let b = a
b = "Kate"

a remains "Anna"
```

Object assignment:

```text
const user = { name: "Anna" }
const admin = user
admin.name = "Kate"

user.name becomes "Kate"
```

Core model:

```text
Variables do not contain objects.
Variables refer to object values.
Multiple variables can refer to the same object.
```

Reference is not the object. It is the conceptual connection that lets a variable reach an object.

The next chapter will explain Stack & Heap as the common conceptual memory model behind this behavior.

---

## Что нужно запомнить

* Object assignment does not create an independent copy.
* Variables refer to object values.
* Multiple variables can refer to the same object.
* Updating property through one variable affects the shared object.
* Other variables referring to that object observe the update.
* Primitive assignment behaves differently at this conceptual level.
* Object identity asks whether variables refer to the same object.
* Same-looking objects may still be different objects.
* Shared test data can be accidentally mutated.
* Helper functions can change objects they receive.
* Stack & Heap will be studied next; references should first be understood through behavior.

---

## Проверьте себя

Ответьте без запуска кода.

1. Почему `admin.name = 'Kate'` can change `user.name`?
2. Reference and object are the same thing?
3. Что означает `const admin = user` for object values?
4. Что происходит при primitive assignment?
5. Что означает object identity?
6. Почему two same-looking objects may not be equal by identity?
7. Что такое reference reassignment?
8. Почему shared expected object is risky in tests?
9. Какой вопрос помогает debug references?
10. Почему Stack & Heap не нужны для первого понимания references?

---

## Практика

Практика находится в файле:

```text
practice/chapter-16.md
```

Сначала решайте задания самостоятельно. Для этой темы особенно важно рисовать diagrams by hand: какая variable refers to which object right now.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-16.md
```

Читайте решения после самостоятельной попытки. Проверяйте не только output, но и reasoning: какой object общий, какой object новый, где произошло property update, где произошло reassignment.
