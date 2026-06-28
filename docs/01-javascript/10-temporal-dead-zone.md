# Temporal Dead Zone

## Связь с предыдущей главой

Предыдущая глава объяснила Hoisting без мифа о переносе кода:

```text
Hoisting is NOT moving code.

Hoisting is the observable result
of the engine preparing declarations
during the Creation Phase.
```

Мы увидели важное различие:

```text
function declaration
│
└── registered as callable function

var
│
└── registered with undefined

let / const
│
└── registered but not initialized
```

Теперь появляется последний вопрос в этой цепочке:

> Если engine уже знает identifier `let` или `const`, почему access все равно запрещен?

Эта глава объясняет Temporal Dead Zone как естественное следствие уже изученной модели:

```text
Creation Phase
│
▼
identifier is registered
│
▼
Execution Phase starts
│
▼
identifier is still not initialized
│
▼
access is forbidden
│
▼
execution reaches declaration
│
▼
identifier is initialized
│
▼
access becomes allowed
```

Главная модель главы:

```text
The identifier already exists.
The engine already knows about it.
Access is temporarily forbidden until initialization.
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что Execution Context имеет Creation Phase и Execution Phase;
* что Lexical Environment содержит Environment Record;
* что Hoisting — результат подготовки declarations during Creation Phase;
* что `let` и `const` registered during Creation Phase;
* что `let` и `const` are not initialized immediately;
* что `var` registered with `undefined`.

Не требуется знать Closures, modules, детали спецификации ECMAScript или optimization details. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            100-130 минут
Разбор схем:              45-60 минут
Запуск примеров:          25-35 минут
Практика:                 90-120 минут
Повторение материала:     30 минут
```

Уровень сложности: **L3**.

L3 означает фундаментальный уровень: TDZ объясняет поведение `let` и `const` до initialization и завершает связку Creation Phase → Lexical Environment → Hoisting.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/09-hoisting.md
```

Следующая глава:

```text
docs/01-javascript/11-primitive-types.md
```

Следующая глава начнет раздел о значения and types. Функции как отдельная большая тема будут изучаться позже в разделе Functions; в этой главе function declarations используются только как уже знакомое сравнение с `let`, `const` и `var`.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* что такое Temporal Dead Zone;
* почему TDZ существует;
* почему `let` и `const` не нужно называть "not hoisted";
* чем registration отличается от initialization;
* когда TDZ begins;
* когда TDZ ends;
* как TDZ работает для `let`;
* как TDZ работает для `const`;
* почему `var` behaves differently;
* почему access before initialization дает ReferenceError;
* как читать TDZ errors в helper files;
* почему modern Playwright code предпочитает `const`;
* как избегать declaration order mistakes.

---

## Мотивация

Начнем с наблюдаемого поведения.

```javascript
// console.log(user);

let user = 'Anna';

console.log(user);
```

Если оставить код как есть, результат:

```text
Anna
```

Если раскомментировать первую строку:

```javascript
console.log(user);

let user = 'Anna';
```

программа завершится ошибкой:

```text
ReferenceError
```

Теперь сравним с `var`:

```javascript
console.log(user);

var user = 'Anna';
```

Результат:

```text
undefined
```

Вопрос:

```text
let user
│
├── known to engine during Creation Phase
└── still forbidden before initialization

var user
│
├── known to engine during Creation Phase
└── readable as undefined before assignment
```

Что отличается?

Не нужно отвечать "let не hoisted". Это неточно.

Более правильный вопрос:

> В каком состоянии находится identifier прямо сейчас?

---

## Теория

### Наблюдаемое поведение

Сначала посмотрим на три cases.

`var`:

```javascript
console.log(status);

var status = 'ready';
```

```text
undefined
```

`let`:

```javascript
// console.log(status);

let status = 'ready';
```

Если раскомментировать read before initialization:

```text
ReferenceError
```

`const`:

```javascript
// console.log(baseUrl);

const baseUrl = 'https://example.com';
```

Если раскомментировать read before initialization:

```text
ReferenceError
```

Наблюдение:

```text
var before assignment
│
└── readable as undefined

let / const before initialization
│
└── known but not accessible
```

### Почему простое объяснение "not hoisted" неверно

Если сказать:

```text
let and const are not hoisted
```

то возникает неправильная модель:

```text
Creation Phase
│
└── engine does not know let/const identifiers
```

Но это не та модель, которую мы строили в Hoisting.

Более точная модель:

```text
Creation Phase
│
├── let identifier is registered
└── const identifier is registered

Before initialization
│
└── access is forbidden
```

То есть проблема не в том, что identifier неизвестен. Проблема в его состояние.

```text
Identifier state
│
├── registered
├── not initialized
└── access forbidden
```

### Что такое Temporal Dead Zone

Теперь можно ввести термин.

Temporal Dead Zone, или TDZ, — период от начала scope до initialization `let` или `const`, когда identifier already exists in Environment Record, but access is forbidden.

```text
Scope starts
│
▼
Creation Phase registers identifier
│
▼
TDZ begins
│
▼
Execution reaches declaration line
│
▼
identifier is initialized
│
▼
TDZ ends
```

Важно:

```text
TDZ is not about code movement.
TDZ is about identifier state before initialization.
```

### Почему существует TDZ

TDZ exists to prevent reading `let` and `const` before the program has explicitly initialized them.

Без TDZ:

```text
let status
│
└── could be read before meaningful value exists
```

С TDZ:

```text
let status
│
├── registered early
├── protected before initialization
└── readable only after initialization
```

TDZ делает ошибки заметнее.

```javascript
// console.log(baseUrl);

const baseUrl = 'https://example.com';
```

Если `baseUrl` нужен до declaration line, программа должна явно показать проблему, а не silently return `undefined`.

Что состояние identifier прямо сейчас:

```text
baseUrl
│
├── registered
├── not initialized
└── locked
```

### Registration vs initialization

Registration:

```text
Engine creates identifier record.
```

Инициализация:

```text
Engine gives identifier its first usable value.
```

Диаграмма registration:

```text
Creation Phase
│
▼
Environment Record
│
└── user → registered
```

Диаграмма initialization:

```text
Execution reaches:
let user = "Anna"
│
▼
Environment Record
│
└── user → "Anna"
```

TDZ существует между этими двумя состояниями.

```text
Registered
│
▼
TDZ
│
▼
Initialized
```

### When TDZ begins

TDZ начинается, когда выполнение входит в scope, содержащий объявление `let` или `const`.

Для global scope:

```javascript
// console.log(user);

let user = 'Anna';
```

Временная шкала:

```text
Global scope starts
│
▼
Creation Phase registers user
│
▼
TDZ for user begins
│
▼
Execution reaches let user = "Anna"
│
▼
TDZ ends
```

Для block scope:

```javascript
if (true) {
  // console.log(status);

  let status = 'active';
}
```

Временная шкала:

```text
Block scope entered
│
▼
status is in TDZ
│
▼
execution reaches let status = "active"
│
▼
status initialized
```

### When TDZ ends

TDZ заканчивается, когда выполнение доходит до объявления и происходит initialization.

```javascript
let user = 'Anna';

console.log(user);
```

Временная шкала:

```text
Before declaration line
│
└── user in TDZ

Declaration line executes
│
└── user initialized with "Anna"

After declaration line
│
└── user readable
```

В каком состоянии этот identifier прямо сейчас:

```text
Line before declaration
│
└── registered, not initialized, access forbidden

Declaration line
│
└── initialization happens

Line after declaration
│
└── initialized, access allowed
```

### TDZ for let

`let` can be declared without immediate meaningful value:

```javascript
let user;

console.log(user);
```

Результат:

```text
undefined
```

Почему это не TDZ error?

Потому что execution reached declaration line. `user` was initialized, even if its value is `undefined`.

let lifecycle:

```text
Creation Phase
│
└── user registered, uninitialized
    │
    ▼
TDZ
│
▼
Execution reaches let user;
│
└── user initialized with undefined
    │
    ▼
Access allowed
```

Для `let user = 'Anna'`:

```text
Creation Phase
│
└── user registered, uninitialized

Before line
│
└── TDZ

Line: let user = "Anna"
│
└── initialized with "Anna"

After line
│
└── readable
```

### TDZ for const

`const` must be initialized at declaration.

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
```

const lifecycle:

```text
Creation Phase
│
└── baseUrl registered, uninitialized

Before declaration line
│
└── TDZ

Line: const baseUrl = "https://example.com"
│
└── initialized with value

After line
│
└── readable, reassignment forbidden
```

Нельзя:

```javascript
// const baseUrl;
```

Это syntax error, потому что `const` требует initialization at declaration.

TDZ для `const` похож на TDZ для `let`, но есть дополнительное правило:

```text
const
│
├── access forbidden before initialization
├── must initialize at declaration
└── reassignment forbidden after initialization
```

### Почему var ведёт себя иначе

`var` ведёт себя иначе, потому что Creation Phase инициализирует его значением `undefined`.

```javascript
console.log(user);

var user = 'Anna';
```

var lifecycle comparison:

```text
Creation Phase
│
└── user registered and initialized with undefined

Before assignment line
│
└── user readable as undefined

Assignment line
│
└── user assigned "Anna"

After assignment line
│
└── user readable as "Anna"
```

Сравнение:

```text
var
│
└── registered + initialized with undefined during Creation Phase

let / const
│
└── registered but not initialized during Creation Phase
```

Именно поэтому:

```text
var before line       → undefined
let/const before line → ReferenceError
```

### ReferenceError before initialization

Когда code пытается access `let` / `const` before initialization, engine throws ReferenceError.

```javascript
// console.log(user);

let user = 'Anna';
```

Если раскомментировать:

```text
ReferenceError: Cannot access 'user' before initialization
```

Что состояние identifier прямо сейчас:

```text
user
│
├── registered in Environment Record
├── not initialized
└── access forbidden
```

Это важный момент: ReferenceError здесь не означает, что engine вообще не знает identifier. Он знает identifier, но запрещает доступ к нему до initialization.

### Lexical Environment during TDZ

Во время TDZ Environment Record уже содержит identifier record.

```text
Lexical Environment
│
└── Environment Record
    └── user → uninitialized
```

Access attempt:

```text
console.log(user)
│
▼
lookup user
│
▼
Environment Record has user
│
▼
state: uninitialized
│
▼
throw ReferenceError
```

Это отличается от missing identifier:

```text
lookup unknownName
│
▼
not found in Environment Record
│
▼
not found outward
│
▼
ReferenceError
```

Обе ситуации могут быть ReferenceError, но причины разные:

```text
TDZ ReferenceError
│
└── identifier exists but is not initialized

Missing identifier ReferenceError
│
└── identifier not found
```

### Environment Record before initialization

Для кода:

```javascript
// console.log(user);

let user = 'Anna';
const role = 'admin';
var status = 'created';
```

До выполнения:

```text
Environment Record
│
├── user   → uninitialized
├── role   → uninitialized
└── status → undefined
```

Before initialization line:

```text
user
│
└── TDZ

role
│
└── TDZ

status
│
└── readable as undefined
```

After initialization lines:

```text
Environment Record
│
├── user   → "Anna"
├── role   → "admin"
└── status → "created"
```

### Identifier состояние transitions

Identifier состояние transitions:

```text
let / const
│
├── registered
├── uninitialized
├── TDZ access forbidden
├── initialized
└── access allowed
```

Для `var`:

```text
var
│
├── registered
├── initialized with undefined
├── access allowed
├── assigned later
└── access returns assigned value
```

Comparison table:

```text
Declaration | Creation Phase state     | Before line access | Initialization
------------|--------------------------|--------------------|----------------
var         | initialized as undefined | allowed            | assignment line
let         | uninitialized            | ReferenceError     | declaration line
const       | uninitialized            | ReferenceError     | declaration line
```

### Complete execution movie

Для кода:

```javascript
// console.log(user);

let user = 'Anna';
const role = 'admin';
var status = 'created';

console.log(user);
console.log(role);
console.log(status);
```

Movie:

```text
Engine receives Source Code
│
▼
Creation Phase starts
│
▼
Environment Record prepared
│
├── user   → uninitialized
│
├── role   → uninitialized
│
└── status → undefined
│
▼
Execution Phase starts
│
▼
line before let user
│
└── user is still in TDZ
│
▼
line: let user = "Anna"
│
└── user initialized
│
▼
line: const role = "admin"
│
└── role initialized
│
▼
line: var status = "created"
│
└── status assigned
│
▼
console.log reads initialized identifiers
```

### Текущее место в модели JavaScript

Текущая позиция:

```text
Execution Context
│
├── Creation Phase
│   └── registers identifiers
│
└── Execution Phase
    └── initializes let/const when declaration line executes
```

Full path:

```text
Execution Context
│
▼
Lexical Environment
│
▼
Hoisting
│
▼
Temporal Dead Zone
```

TDZ completes the explanation of `let` and `const` Hoisting:

```text
They are registered.
They are known.
They are temporarily locked.
They become usable after initialization.
```

### Переход к Functions

Следующая большая группа тем постепенно приведет к значения, types, operators and functions. Functions will later explain how parameters, return значения and function calls create more situations where Scope and Lexical Environment matter.

Мост:

```text
TDZ
│
└── explains identifier state before initialization

Functions
│
└── will create new execution contexts and new environments
```

Функции как отдельная тема будут изучаться позже; сейчас достаточно помнить, что every function call can create its own execution environment.

---

## Внутренний механизм

TDZ mechanism на conceptual level:

```text
Creation Phase
│
▼
let/const identifier registered
│
▼
identifier state: uninitialized
│
▼
Execution Phase starts
│
▼
until declaration line:
access forbidden
│
▼
declaration line executes
│
▼
identifier initialized
│
▼
access allowed
```

В каком состоянии этот identifier прямо сейчас:

```text
Before declaration line
│
└── registered + uninitialized + locked

On declaration line
│
└── initialization happens

After declaration line
│
└── initialized + readable
```

Для `var`:

```text
Creation Phase
│
└── registered + initialized with undefined

Before assignment
│
└── readable as undefined

After assignment
│
└── readable as assigned value
```

TDZ is not a place in memory. It is a period of execution where an identifier has a restricted состояние.

---

## Ментальная модель

### Reserved parking place

`let` / `const` похожи на reserved parking place.

```text
Creation Phase
│
└── parking place reserved for user

Before initialization
│
└── car is not allowed to use it yet

Initialization
│
└── permission activated
```

Identifier exists, но access forbidden.

### Locked room

TDZ похож на locked room.

```text
Room exists.
Name is on the door.
Engine knows the room.
Door is locked until initialization.
```

```text
Before initialization
│
└── locked room

After initialization
│
└── unlocked room
```

### Sealed storage box

Environment Record has a sealed box.

```text
Environment Record
│
└── user → sealed box
```

Reading before initialization:

```text
Open box?
│
└── forbidden
```

After initialization:

```text
user → "Anna"
```

### Registration before permission

```text
Registration
│
└── identifier is known

Permission
│
└── access allowed after initialization
```

TDZ lives between registration and permission.

### Waiting until activation

```text
registered
│
▼
waiting for activation
│
▼
initialized
│
▼
usable
```

Итоговая модель:

```text
The identifier already exists.
The engine already knows about it.
Access is temporarily forbidden until initialization.
```

---

## Примеры кода

Примеры к этой главе находятся в папке:

```text
examples/01-javascript/chapter-10/
```

Запускайте их из корня проекта.

### Пример 1. let TDZ

Файл:

```text
examples/01-javascript/chapter-10/01-let-tdz.js
```

Показывает safe access after initialization и содержит закомментированный unsafe access.

### Пример 2. const TDZ

Файл:

```text
examples/01-javascript/chapter-10/02-const-tdz.js
```

Показывает, что `const` becomes readable only after initialization.

### Пример 3. var comparison

Файл:

```text
examples/01-javascript/chapter-10/03-var-comparison.js
```

Показывает, что `var` readable as `undefined` before assignment.

### Пример 4. Initialization

Файл:

```text
examples/01-javascript/chapter-10/04-initialization.js
```

Показывает момент, когда `let` declaration without value still initializes identifier with `undefined`.

### Пример 5. Safe access

Файл:

```text
examples/01-javascript/chapter-10/05-safe-access.js
```

Показывает безопасный порядок declaration before read.

### Пример 6. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-10/06-common-mistakes.js
```

Показывает common TDZ mistakes через comments and corrected code.

---

## Частые вопросы

### `let` и `const` hoisted?

Да, если под Hoisting понимать registration during Creation Phase. Но они не initialized like `var`, поэтому access before initialization forbidden.

### Почему тогда говорят "let is not hoisted"?

Так иногда упрощают для новичков. В этой книге мы используем более точную модель: registered but not initialized.

### TDZ — это ошибка?

Нет. TDZ — это период. Ошибка появляется, если code tries to access identifier during that period.

### Почему `var` не имеет TDZ в таком же смысле?

Потому что `var` initialized with `undefined` during Creation Phase, so access is allowed before assignment.

### TDZ есть только в global scope?

Нет. TDZ применяется к `let` / `const` в их scope: global, function или block.

---

## Распространенные мифы

### Миф 1. `let` и `const` не hoisted

Реальность:

Они registered during Creation Phase, but access is forbidden until initialization.

### Миф 2. ReferenceError значит, что engine не знает identifier

Реальность:

В TDZ engine знает identifier, но запрещает доступ потому что он не инициализирован.

### Миф 3. TDZ — это физическая зона в памяти

Реальность:

TDZ — период between registration and initialization.

### Миф 4. `let user;` остается в TDZ навсегда, пока нет value

Реальность:

Когда execution reaches `let user;`, identifier initializes with `undefined`, and TDZ ends.

---

## Типичные ошибки

### Ошибка 1. Читать `let` до declaration line

Неправильный код:

```javascript
// console.log(user);

let user = 'Anna';
```

Что произошло:

Access before initialization would throw ReferenceError.

Исправленный вариант:

```javascript
let user = 'Anna';

console.log(user);
```

### Ошибка 2. Ожидать `undefined` от `const`

Неправильная модель:

```text
const before initialization behaves like var.
```

Реальность:

`const` is registered but uninitialized until declaration line.

Исправленный вариант:

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
```

### Ошибка 3. Говорить "not hoisted"

Неправильная формулировка:

```text
let and const are not hoisted.
```

Исправленная формулировка:

```text
let and const are registered during Creation Phase,
but access before initialization is forbidden.
```

### Ошибка 4. Путать missing identifier и TDZ

Missing identifier:

```javascript
// console.log(unknownUser);
```

TDZ:

```javascript
// console.log(user);

let user = 'Anna';
```

Оба могут дать ReferenceError, но причины разные.

---

## Практическое использование

Правило для чтения кода:

```text
When you see let/const:
│
├── before declaration line → TDZ
└── after declaration line  → safe access
```

Порядок анализа:

```text
1. Найдите scope.
2. Найдите let/const declaration.
3. Определите начало scope.
4. От начала scope до declaration line — TDZ.
5. После declaration line — identifier initialized.
```

Таблица анализа:

```text
Identifier | Scope starts | Declaration line | Before line state | After line state
-----------|--------------|------------------|-------------------|-----------------
user       | line 1       | line 4           | TDZ               | initialized
baseUrl    | line 1       | line 6           | TDZ               | initialized
status     | line 1       | line 8 var       | undefined         | assigned later
```

Практическое правило:

```text
Declare before read.
Initialize before use.
Prefer const when reassignment is not needed.
Use let only when state changes.
```

---

## Использование в Automation QA

### Почему modern Playwright code prefers const

В тестах значения often should not be reassigned:

```javascript
const baseUrl = 'https://example.com';
const expectedStatus = 'active';
```

`const` делает intention explicit:

```text
This identifier is initialized here.
This identifier will not be reassigned.
```

TDZ помогает: access before initialization fails loudly вместо silently returning `undefined`.

### Interpreting ReferenceError correctly

Если Playwright helper падает с:

```text
ReferenceError: Cannot access 'baseUrl' before initialization
```

Это не значит:

```text
baseUrl does not exist anywhere.
```

Более точная модель:

```text
baseUrl is registered.
baseUrl is in TDZ.
Code reads it before initialization.
```

### Reading TDZ errors in helper files

Ошибка часто выглядит так:

```javascript
// const loginUrl = baseUrl + '/login';

const baseUrl = 'https://example.com';
```

Проблема — declaration order.

Исправление:

```javascript
const baseUrl = 'https://example.com';
const loginUrl = baseUrl + '/login';
```

### Avoiding declaration order mistakes

В test code лучше располагать dependencies before usage:

```text
configuration
│
▼
test data
│
▼
derived values
│
▼
actions
│
▼
assertions
```

Так reader and engine see initialized значения before access.

---

## Итоги

Temporal Dead Zone объясняет, почему `let` и `const` known to engine but inaccessible before initialization.

Главная модель:

```text
The identifier already exists.
The engine already knows about it.
Access is temporarily forbidden until initialization.
```

TDZ начинается, когда scope стартует и identifier зарегистрирован, но ещё не инициализирован. TDZ заканчивается, когда выполнение доходит до строки объявления и происходит initialization.

`var` ведёт себя иначе, потому что инициализируется значением `undefined` во время Creation Phase.

```text
var
│
└── registered + initialized with undefined

let / const
│
└── registered + uninitialized + locked until declaration line
```

Do not say `let` and `const` are "not hoisted." A more precise model is: they are registered during Creation Phase, but access before initialization is forbidden.

---

## Что нужно запомнить

✓ TDZ is a period, not a physical place.

✓ TDZ начинается при старте scope.

✓ TDZ заканчивается при initialization.

✓ `let` and `const` are registered during Creation Phase.

✓ `let` and `const` are not initialized immediately.

✓ Access before initialization throws ReferenceError.

✓ `var` is initialized with `undefined` during Creation Phase.

✓ `let user;` завершает TDZ, когда выполняется строка объявления.

✓ `const` must be initialized at declaration.

✓ Do not say `let` / `const` are "not hoisted."

---

## Проверьте себя

1. Что такое Temporal Dead Zone?

2. Почему TDZ существует?

3. Когда TDZ begins?

4. Когда TDZ ends?

5. Что значит registration?

6. Что значит initialization?

7. Почему `let` before initialization gives ReferenceError?

8. Почему `const` before initialization gives ReferenceError?

9. Почему `var` behaves differently?

10. Почему фраза "let/const are not hoisted" неточная?

---

## Практика

Практика к этой главе находится в файле:

```text
practice/01-javascript/10-temporal-dead-zone.md
```

Перед практикой запустите примеры из `examples/01-javascript/chapter-10/` и для каждого identifier выпишите состояние: registered, uninitialized, initialized, readable.

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/10-temporal-dead-zone.md
```

Открывайте решения после самостоятельной попытки. В этой главе важно сравнивать не только вывод, но и состояние identifier на каждой строке.
