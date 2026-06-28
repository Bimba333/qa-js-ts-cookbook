# Equality

## Связь с предыдущей главой

Предыдущая глава объяснила Type Conversion:

```text
Operation expects a type
│
▼
Value has another type
│
▼
JavaScript may convert value
```

Теперь появляется следующий вопрос:

> Как JavaScript решает, равны ли два значения?

Начнем с наблюдаемого поведения:

```javascript
console.log(5 == '5');
console.log(5 === '5');
```

Результат:

```text
true
false
```

Обе строки сравнивают same visible значения: `5` and `'5'`.

Но ответы разные.

Вопрос:

> Почему ответы отличаются?

В предыдущей главе мы узнали: JavaScript sometimes converts значения. В этой главе мы увидим, что different equality operators answer different questions.

Главный вопрос главы:

> Что именно сравнивается?

---

## Предварительные требования

Для этой главы нужно понимать:

* что значения have types;
* чем Number differs from String;
* что Type Conversion может произойти, когда операция ожидает другой тип;
* что objects are compared differently from primitive значения;
* что references explain object identity;
* что `NaN` can appear during number conversion;
* что `+0` and `-0` are numeric значения with a special edge case.

Не требуется знать SameValue algorithm details, SameValueZero, Map/Set comparison rules, deep equality libraries, JSON comparison or testing frameworks. Эти темы будут упоминаться только как future topics.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            120-150 минут
Разбор схем:             45-60 минут
Запуск примеров:         25-35 минут
Практика:                100-130 минут
Повторение материала:    30 минут
```

Уровень сложности: **L3**.

Equality опасно, потому что синтаксис маленький, а семантика важная. Один лишний `=` может изменить, произойдёт ли conversion перед сравнением.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/15-type-conversion.md
```

Текущая глава:

```text
docs/01-javascript/16-equality.md
```

Следующая глава:

```text
docs/01-javascript/17-operators.md
```

Следующая глава расширит тему operations and operators. Здесь мы изучаем only equality operators.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* why equality is needed;
* why JavaScript has multiple equality operators;
* how strict equality `===` works at a conceptual level;
* how loose equality `==` works at a conceptual level;
* what `Object.is()` is for;
* difference between identity and value;
* how primitive comparison works;
* how object comparison works;
* why `NaN` is special;
* why `+0` and `-0` are special for `Object.is()`;
* practical comparison strategy for everyday code;
* why Automation QA usually prefers strict equality.

---

## Мотивация

Начнем with observable поведение:

```javascript
console.log(5 == '5');
console.log(5 === '5');
```

Вывод:

```text
true
false
```

If equality meant only "look the same", both answers would be the same.

But JavaScript has different equality questions:

```text
==
│
└── Can these values become comparable?

===
│
└── Are these already the same type and value?

Object.is()
│
└── Are these exactly the same according to Object.is rules?
```

Equality overview:

```text
Compare two values
│
├── loose equality ==
│   └── may convert before comparison
│
├── strict equality ===
│   └── no type conversion
│
└── Object.is()
    └── special exact comparison semantics
```

Главный вопрос:

> Что именно сравнивается?

---

## Теория

### Зачем нужно equality

Programs constantly make decisions:

```text
Is response status expected?
Is user role admin?
Is API field missing?
Is parsed value equal to expected value?
Is this object the same object as before?
```

В коде:

```javascript
const statusCode = 200;
const expectedStatusCode = 200;

console.log(statusCode === expectedStatusCode);
```

Equality is needed to answer:

```text
Do these two values match according to this comparison rule?
```

### Почему в JavaScript несколько equality operators

JavaScript was designed to be flexible with значения from different contexts. That flexibility produced two common comparison modes:

```text
Loose equality
│
└── allows conversion

Strict equality
│
└── avoids conversion
```

Later, `Object.is()` became useful for a few exact edge cases.

Comparison questions:

```text
==
│
└── Can these values become comparable?

===
│
└── Same type and same value?

Object.is()
│
└── Same according to Object.is semantics?
```

### Strict equality `===`

Strict equality does not perform type conversion.

```javascript
console.log(5 === '5');
```

Результат:

```text
false
```

`===` поток:

```text
Compare with ===
│
▼
Types are the same?
│
├── no  → false
└── yes → compare values
```

`===` without conversion:

```text
5        "5"
│        │
Number   String
│        │
└── types differ
    │
    ▼
  false
```

`===` спрашивает:

> Are these already the same type and value?

### Loose equality `==`

Loose equality may perform conversion before comparison.

```javascript
console.log(5 == '5');
```

Результат:

```text
true
```

`==` поток:

```text
Compare with ==
│
▼
Types are the same?
│
├── yes → compare values
│
└── no
    │
    ▼
  try conversion according to rules
    │
    ▼
  compare converted values
```

Type conversion before `==`:

```text
5        "5"
│        │
Number   String
         │
         ▼
       Number("5") → 5
│        │
└────────┘
    │
    ▼
  true
```

`==` спрашивает:

> Can these значения become comparable?

Это полезно только когда conversion действительно нужна. Большей части тестового кода стоит избегать скрытого преобразования при сравнении.

### `Object.is()`

`Object.is()` is a comparison function with its own exact semantics.

```javascript
console.log(Object.is(5, 5));
console.log(Object.is(NaN, NaN));
console.log(Object.is(+0, -0));
```

Object.is схема:

```text
Object.is(valueA, valueB)
│
▼
Compare using Object.is rules
│
├── NaN and NaN → true
├── +0 and -0  → false
└── otherwise similar to strict exact comparison for common primitives
```

`Object.is()` спрашивает:

> Are these exactly the same according to Object.is rules?

Detailed SameValue algorithm is not part of this chapter.

### Primitive comparison

Primitive значения are compared by value.

```javascript
console.log(200 === 200);
console.log('admin' === 'admin');
console.log(true === true);
```

Primitive comparison схема:

```text
Primitive A          Primitive B
│                    │
▼                    ▼
value and type       value and type
│                    │
└──── compare ───────┘
```

Примеры:

```text
200 === 200          → true
"admin" === "admin"  → true
true === true        → true
200 === "200"        → false
```

Что именно сравнивается?

```text
For primitives with ===:
type and value.
```

### Object comparison

Objects are compared by identity, not by shape.

```javascript
const firstUser = {
  name: 'Anna',
};

const secondUser = {
  name: 'Anna',
};

console.log(firstUser === secondUser);
```

Результат:

```text
false
```

Object comparison схема:

```text
firstUser ─────────► Object A
                    └── name: "Anna"

secondUser ────────► Object B
                    └── name: "Anna"

Object A is not Object B
│
▼
false
```

Same reference:

```javascript
const firstUser = {
  name: 'Anna',
};

const sameUser = firstUser;

console.log(firstUser === sameUser);
```

Схема:

```text
firstUser ─────┐
sameUser  ─────┘──► Object A
                    └── name: "Anna"
```

Результат:

```text
true
```

Что именно сравнивается?

```text
For objects:
whether both variables refer to the same object.
```

Deep equality libraries, JSON comparison and testing framework object matchers will be studied later.

### Identity vs value

Identity and value are different questions.

Identity vs value схема:

```text
Primitive comparison
│
└── compare value directly

Object comparison
│
└── compare identity: same object or not
```

Identical twins mental model:

```text
Twin A and Twin B
│
├── look similar
└── are still two different people
```

Two objects may look identical but still have different identity.

### NaN comparison

`NaN` is special.

```javascript
console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
```

Результаты:

```text
false
true
```

NaN comparison схема:

```text
NaN === NaN
│
▼
false

Object.is(NaN, NaN)
│
▼
true
```

Что именно сравнивается?

```text
=== follows strict equality behavior.
Object.is() has special NaN semantics.
```

In practice, `Number.isNaN()` is often used to check `NaN`. Detailed Number utilities will be covered later.

### `+0` and `-0`

For most everyday code, `+0` and `-0` behave as equal with `===`.

```javascript
console.log(+0 === -0);
console.log(Object.is(+0, -0));
```

Результаты:

```text
true
false
```

`+0` vs `-0` схема:

```text
+0 === -0
│
▼
true

Object.is(+0, -0)
│
▼
false
```

This is one of the few places where `Object.is()` has visibly different поведение.

### Decision tree

Recommended decision tree:

```text
Need to compare values?
│
▼
Are you intentionally relying on conversion?
│
├── yes → consider == carefully
│
└── no
    │
    ▼
  Need special NaN or +0/-0 semantics?
    │
    ├── yes → Object.is()
    └── no  → ===
```

Recommended comparison strategy:

```text
Default
│
└── use ===

Intentional conversion
│
└── use == only when rules are desired and understood

Special exact cases
│
└── use Object.is()
```

---

## Внутренний механизм

At a conceptual level, equality is an operation with a chosen comparison rule.

```text
Two values enter comparison
│
▼
Operator chooses comparison mode
│
├── == may convert
├── === does not convert
└── Object.is() follows its own rules
│
▼
Result is Boolean
```

### Complete comparison picture

```text
Value A
│
├── type
└── value / identity

Value B
│
├── type
└── value / identity

Comparison operator
│
├── ==
│   └── conversion may happen
│
├── ===
│   └── conversion never happens
│
└── Object.is()
    └── special exact semantics

Результат
│
└── true / false
```

### Текущее место в модели JavaScript

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
│
▼
Type Conversion
│
▼
Equality
```

Что именно сравнивается?

```text
Primitive values
│
└── type and value

Object values
│
└── identity

Loose equality
│
└── possibly converted values
```

### Переход к Operators

Equality operators are only one group of operators.

Next chapter expands the question:

```text
How do JavaScript operators transform, combine and evaluate values?
```

Переход к Operators:

```text
Equality
│
└── comparison operators
    │
    ▼
Operators
│
└── broader operation model
```

---

## Ментальная модель

### Passport check

`===` is like passport check:

```text
Passport check
│
├── same document type?
├── same person?
└── no adaptation
```

If type differs, `===` says false.

### Переводчик перед сравнением

`==` is like translator before comparison:

```text
Person A speaks Number
Person B speaks String
│
▼
Translator tries to make them comparable
│
▼
Then comparison happens
```

### Fingerprint

`Object.is()` is like fingerprint for special exact cases:

```text
Fingerprint check
│
└── stricter about certain edge cases
```

### Identical twins

Objects with same shape are like identical twins:

```text
Twin A
Twin B
│
├── look alike
└── not same person
```

Two objects may look the same but are not the same object.

### Labels on boxes

Variables are labels. Objects are boxes.

```text
label firstUser ───► Box A
label secondUser ──► Box B
```

If two labels point to same box, object equality by identity is true.

---

## Примеры кода

Все примеры находятся в:

```text
examples/01-javascript/chapter-16/
```

Запуск:

```bash
node examples/01-javascript/chapter-16/01-strict-equality.js
node examples/01-javascript/chapter-16/02-loose-equality.js
node examples/01-javascript/chapter-16/03-object-is.js
node examples/01-javascript/chapter-16/04-object-comparison.js
node examples/01-javascript/chapter-16/05-nan.js
node examples/01-javascript/chapter-16/06-common-mistakes.js
```

### 01-strict-equality.js

Shows `===` without conversion.

### 02-loose-equality.js

Shows `==` with conversion.

### 03-object-is.js

Shows `Object.is()` edge cases.

### 04-object-comparison.js

Shows object identity comparison.

### 05-nan.js

Shows why `NaN` needs special attention.

### 06-common-mistakes.js

Shows hidden conversion mistake in test-like data.

---

## Частые вопросы

### Should I always use `===`?

Use `===` by default. It avoids hidden type conversion and makes comparisons easier to reason about.

### Is `==` always bad?

Нет. Это опасно при случайном использовании. Используйте это только тогда, когда правила conversion действительно нужны и понятны.

### Зачем существует `Object.is()`?

It handles a few exact comparison cases differently, especially `NaN` and `+0` / `-0`.

### Почему два одинаково выглядящих объекта не равны?

Because object comparison checks identity, not shape.

### Как test frameworks глубоко сравнивают объекты?

Тестовые фреймворки и инструменты глубокого сравнения имеют свои механизмы. Они будут разобраны позже, когда появятся testing frameworks.

---

## Распространенные мифы

### Миф: `==` means wrong and `===` means correct

Реальность:

`==` means comparison with possible conversion. `===` means comparison without conversion. Practical recommendation is to prefer `===`, but the real difference is semantic.

### Миф: Objects with same properties are equal

Реальность:

Objects are compared by identity.

### Миф: `Object.is()` is just another spelling for `===`

Реальность:

They are similar in many common cases, but differ for `NaN` and `+0` / `-0`.

### Миф: Equality can be learned as a table

Реальность:

Tables help, but reasoning starts with: what exactly is being compared?

Equality myths схема:

```text
Myth
│
├── memorize all results
└── ignore comparison mode

Reality
│
├── identify operator
├── identify types
├── identify conversion
└── identify identity vs value
```

---

## Типичные ошибки

### Ошибка 1. Rely on `==` accidentally

```javascript
const expectedStatus = 200;
const actualStatus = '200';

console.log(expectedStatus == actualStatus);
```

Результат:

```text
true
```

The test may pass while actual type is wrong.

### Ошибка 2. Compare objects by shape with `===`

```javascript
const expectedUser = {
  name: 'Anna',
};

const actualUser = {
  name: 'Anna',
};

console.log(expectedUser === actualUser);
```

Результат:

```text
false
```

### Ошибка 3. Forget `NaN`

```javascript
console.log(NaN === NaN);
```

Результат:

```text
false
```

### Ошибка 4. Use Object.is everywhere

`Object.is()` is useful, but not the default comparison tool for all code.

### Ошибка 5. Compare before parsing

If API returns `"200"` and test expects `200`, parse intentionally before comparison or assert that API really returns string.

---

## Практическое использование

Practical comparison strategy:

```text
1. Prefer === by default.
2. Convert explicitly before comparison if needed.
3. Use == only when conversion is intentional.
4. Use Object.is() for special semantics.
5. For objects, know whether you need identity or structure.
```

QA assertion example:

```javascript
const actualStatusCode = Number('200');
const expectedStatusCode = 200;

console.log(actualStatusCode === expectedStatusCode);
```

Схема:

```text
API value "200"
│
▼
explicit conversion
│
▼
Number 200
│
▼
strict comparison with expected 200
│
▼
true
```

---

## Использование в Automation QA

### Почему assertions обычно используют strict equality

Tests should reveal type mismatches, not hide them.

```javascript
const expectedStatusCode = 200;
const actualStatusCode = '200';

console.log(expectedStatusCode === actualStatusCode);
```

Результат:

```text
false
```

Это полезно, потому что API вернул String, а не Number.

### Comparing API значения

If API contract says number:

```text
Expected: 200 as Number
Actual:   "200" as String
```

Do not let `==` hide this mismatch.

### Comparing parsed значения

If API intentionally returns string and test needs Number for calculation:

```javascript
const actualStatusCode = Number('200');
const expectedStatusCode = 200;

console.log(actualStatusCode === expectedStatusCode);
```

### Comparing object references

```javascript
const expectedUser = {
  name: 'Anna',
};

const actualUser = {
  name: 'Anna',
};
```

`expectedUser === actualUser` checks identity, not structure. Testing frameworks provide matchers for structure comparison. They will be studied later.

### Avoiding hidden conversion bugs

Чек-лист:

```text
1. What are the types of both values?
2. Is conversion intentional?
3. Is comparison checking value or identity?
4. Should parsing happen before comparison?
5. Is Object.is() needed for NaN or +0/-0?
```

---

## Итоги

Equality отвечает:

```text
How does JavaScript decide whether two values are equal?
```

Основная модель:

```text
==
│
└── may convert values before comparison

===
│
└── never performs type conversion

Object.is()
│
└── follows its own comparison rules
```

Primitive значения are compared by type and value with `===`.

Objects are compared by identity.

Recommended strategy:

```text
Prefer === by default.
Use == only when conversion rules are intentionally desired.
Use Object.is() for the few cases where its semantics are specifically needed.
```

---

## Что нужно запомнить

* Equality is a comparison operation.
* Always ask: what exactly is being compared?
* `==` may convert значения before comparison.
* `===` never performs type conversion.
* `Object.is()` has its own comparison semantics.
* Primitive значения compare by value and type with `===`.
* Objects compare by identity.
* Same-looking objects are not necessarily equal.
* `NaN === NaN` is false.
* `Object.is(NaN, NaN)` is true.
* `+0 === -0` is true.
* `Object.is(+0, -0)` is false.
* Prefer `===` by default in test code.

---

## Проверьте себя

Ответьте без запуска кода.

1. Почему `5 == '5'` отличается от `5 === '5'`?
2. Какой вопрос задаёт `==`?
3. Какой вопрос задаёт `===`?
4. Какой вопрос задаёт `Object.is()`?
5. Do objects compare by shape or identity?
6. Почему два одинаково выглядящих объекта могут быть не равны?
7. Что особенного в `NaN === NaN`?
8. Что особенного в `Object.is(+0, -0)`?
9. Почему QA assertions обычно предпочитают strict equality?
10. When is `==` acceptable?

---

## Практика

Практика находится в файле:

```text
practice/01-javascript/16-equality.md
```

Сначала решайте без запуска. Главная цель - reasoning, not memorized tables.

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/16-equality.md
```

Читайте решения после самостоятельной попытки. Проверяйте вопрос: what exactly is being compared?
