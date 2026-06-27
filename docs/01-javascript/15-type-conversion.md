# Type Conversion

## Связь с предыдущей главой

Предыдущие главы построили основу блока **Values and Types**:

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

Мы уже понимаем:

* JavaScript работает с values;
* values имеют types;
* primitive and object values behave differently;
* references explain object sharing;
* Stack & Heap diagrams are conceptual tools for visualizing values and references.

Теперь вопрос меняется.

До этого мы спрашивали:

```text
What kind of value is this?
Where is this value shown in the conceptual diagram?
What object does this variable refer to?
```

В этой главе главный вопрос другой:

> What type does this operation expect?

Начнем с наблюдаемого поведения:

```javascript
console.log('5' + 1);
console.log('5' - 1);
```

Результат:

```text
51
4
```

Одна и та же string value `'5'` в одном выражении стала частью string result, а в другом участвовала как number.

Вопрос:

> Почему JavaScript treat the same string differently?

Ответ этой главы: because operations expect particular types, and JavaScript may convert values to fit those expectations.

---

## Предварительные требования

Для этой главы нужно понимать:

* что value - информация, с которой работает программа;
* какие primitive types есть в JavaScript;
* чем String отличается from Number;
* что Boolean имеет values `true` and `false`;
* что `null`, `undefined` and `NaN` are important values;
* что object values are different, but object-to-primitive details are not part of this chapter;
* что `console.log` помогает observe result.

Не требуется знать `==`, `===`, `Object.is()`, abstract equality algorithm, operator specification details, object-to-primitive algorithm or Symbol conversion internals. Equality has its own chapter.

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

Type conversion кажется хаотичной только тогда, когда ее учат как набор странных результатов. В этой главе conversion объясняется как ответ на требование операции.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/14-stack-and-heap.md
```

Текущая глава:

```text
docs/01-javascript/15-type-conversion.md
```

Следующая глава:

```text
docs/01-javascript/16-equality.md
```

Следующая глава ответит на вопрос:

> What happens when JavaScript compares two values?

В этой главе equality algorithms не изучаются.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* why type conversion exists;
* чем implicit conversion differs from explicit conversion;
* когда использовать `Number()`;
* когда использовать `String()`;
* когда использовать `Boolean()`;
* common conversion rules;
* что такое truthy and falsy values;
* почему `NaN` appears during number conversion;
* что такое conversion chain на высоком уровне;
* почему conversion is not random;
* почему hidden conversion bugs appear in Automation QA;
* как работать with API strings, form values and environment variables.

---

## Мотивация

Начнем с кода:

```javascript
console.log('5' + 1);
console.log('5' - 1);
```

Результат:

```text
51
4
```

Если смотреть только на values, поведение кажется странным:

```text
"5" is String
1 is Number
```

Почему в первом случае result is `"51"`, а во втором `4`?

Секрет не в том, что JavaScript "случайно" выбирает behavior. Секрет в operation expectation.

```text
Operation
│
├── expects particular type
│
├── receives another type
│
└── conversion may happen
```

Conversion overview:

```text
Value enters operation
│
▼
Operation expects a type
│
▼
Value already matches?
│
├── yes → use value
└── no  → convert value
        │
        ▼
      use converted value
```

Главный вопрос:

> What type does this operation expect?

---

## Теория

### Почему type conversion exists

JavaScript receives values from many sources:

```text
Source
│
├── code literals
├── user input
├── forms
├── environment variables
├── API responses
├── JSON
└── browser APIs
```

These values do not always have the type your operation expects.

Example from Automation QA:

```javascript
const retriesFromEnv = '3';
const nextRetry = retriesFromEnv + 1;

console.log(nextRetry);
```

Результат:

```text
31
```

If you expected numeric addition, this is a bug. The operation did not receive the type you intended.

Conversion exists because JavaScript often tries to adapt values for operations.

Ментальная модель: translator.

```text
Operation speaks Number
│
Value arrives as String
│
Translator converts String to Number
│
Operation continues
```

### Implicit conversion

Implicit conversion happens when JavaScript converts value automatically.

```javascript
console.log('5' - 1);
```

The `-` operation expects numeric behavior.

Implicit conversion diagram:

```text
"5"        1
│          │
▼          ▼
String     Number
│
▼
converted to Number 5
│
▼
5 - 1
│
▼
4
```

What type does this operation expect?

```text
The subtraction operation expects Number-like values.
```

Implicit conversion is not always bad. It is dangerous when it is invisible and unexpected.

### Explicit conversion

Explicit conversion happens when programmer asks for conversion directly.

```javascript
const retriesFromEnv = '3';
const retries = Number(retriesFromEnv);

console.log(retries + 1);
```

Explicit conversion diagram:

```text
"3"
│
▼
Number("3")
│
▼
3
│
▼
3 + 1
│
▼
4
```

What type does this operation expect?

```text
Numeric addition expects Number values.
```

Explicit conversion is usually better in tests because it documents intent.

```text
Hidden intent
│
└── "3" - 0

Clear intent
│
└── Number("3")
```

### Number conversion

`Number()` converts value to Number.

```javascript
console.log(Number('5'));
console.log(Number('5.5'));
console.log(Number(''));
console.log(Number(true));
console.log(Number(false));
console.log(Number(null));
console.log(Number(undefined));
```

Number conversion diagram:

```text
Input value
│
▼
Number(value)
│
▼
Number result or NaN
```

Common results:

```text
Number("5")        → 5
Number("5.5")      → 5.5
Number("")         → 0
Number(true)       → 1
Number(false)      → 0
Number(null)       → 0
Number(undefined)  → NaN
Number("abc")      → NaN
```

Operation expects Number:

```text
Numeric operation
│
├── subtraction
├── multiplication
├── division
└── numeric calculation
```

Diagram:

```text
Operation expects Number
│
▼
Received String "10"
│
▼
Convert to Number 10
│
▼
Continue operation
```

### NaN during conversion

`NaN` means Not-a-Number. It appears when JavaScript tries to produce a Number but cannot produce meaningful numeric value.

```javascript
console.log(Number('abc'));
console.log(Number(undefined));
```

NaN diagram:

```text
Value
│
└── "abc"
    │
    ▼
Number("abc")
│
▼
No meaningful numeric result
│
▼
NaN
```

What type does this operation expect?

```text
Number conversion expects value that can become a Number.
```

In Automation QA, `NaN` often means test parsed wrong field:

```text
Expected numeric price
│
Received "not available"
│
Number("not available")
│
NaN
```

### String conversion

`String()` converts value to String.

```javascript
console.log(String(5));
console.log(String(true));
console.log(String(false));
console.log(String(null));
console.log(String(undefined));
```

String conversion diagram:

```text
Input value
│
▼
String(value)
│
▼
String result
```

Common results:

```text
String(5)          → "5"
String(true)       → "true"
String(false)      → "false"
String(null)       → "null"
String(undefined)  → "undefined"
```

Operation expects String:

```text
Text operation
│
├── building message
├── logging readable value
├── filling form field
└── creating URL parameter
```

Diagram:

```text
Operation expects String
│
▼
Received Number 200
│
▼
String(200)
│
▼
"200"
```

### Boolean conversion

`Boolean()` converts value to Boolean.

```javascript
console.log(Boolean('text'));
console.log(Boolean(''));
console.log(Boolean(1));
console.log(Boolean(0));
console.log(Boolean(null));
```

Boolean conversion diagram:

```text
Input value
│
▼
Boolean(value)
│
▼
true or false
```

Boolean conversion is used when operation expects condition-like value.

```text
Condition expects Boolean-like decision
│
▼
Value converted to true or false
```

Detailed conditionals will be studied later. Here we only need conversion model.

### Truthy values

Truthy value is a value that becomes `true` in Boolean conversion.

Truthy values diagram:

```text
Truthy examples
│
├── "hello"
├── "0"
├── "false"
├── 1
├── -1
├── []
└── {}
```

Важно:

```javascript
console.log(Boolean('false'));
console.log(Boolean('0'));
```

Результат:

```text
true
true
```

Why?

```text
Non-empty string
│
▼
Boolean conversion
│
▼
true
```

This matters for environment variables:

```javascript
const headlessFromEnv = 'false';

console.log(Boolean(headlessFromEnv));
```

Результат:

```text
true
```

The string `'false'` is not Boolean `false`.

### Falsy values

Falsy value is a value that becomes `false` in Boolean conversion.

Falsy values diagram:

```text
Falsy values
│
├── false
├── 0
├── -0
├── 0n
├── ""
├── null
├── undefined
└── NaN
```

Примеры:

```javascript
console.log(Boolean(false));
console.log(Boolean(0));
console.log(Boolean(''));
console.log(Boolean(null));
console.log(Boolean(undefined));
console.log(Boolean(NaN));
```

Falsy does not mean "bad". It means:

```text
Boolean(value) produces false.
```

### Conversion chains at a high level

Sometimes conversion happens in steps.

```javascript
console.log('Total: ' + 5);
```

Conceptual chain:

```text
String operation
│
▼
Number 5 converted to String "5"
│
▼
"Total: " + "5"
│
▼
"Total: 5"
```

Another chain:

```javascript
console.log(Number(String(5)));
```

Diagram:

```text
5
│
▼
String(5)
│
▼
"5"
│
▼
Number("5")
│
▼
5
```

This chapter keeps conversion chains high-level. Operator specification details are not needed here.

### Conversion table

Common conversion table:

```text
Value        Number(value)   String(value)     Boolean(value)
-----------  --------------  ----------------  --------------
"5"          5               "5"               true
"abc"        NaN             "abc"             true
""           0               ""                false
0            0               "0"               false
1            1               "1"               true
true         1               "true"            true
false        0               "false"           false
null         0               "null"            false
undefined    NaN             "undefined"       false
NaN          NaN             "NaN"             false
```

Do not memorize the table mechanically. Use the question:

> What type does this operation expect?

---

## Внутренний механизм

At a conceptual level, conversion follows a decision flow.

Conversion decision flow:

```text
Operation begins
│
▼
Operation expects type
│
▼
Value has expected type?
│
├── yes
│   └── use value directly
│
└── no
    └── convert value according to rules
        │
        ▼
      use converted value
```

### Implicit mechanism

Implicit conversion is triggered by operation.

```text
"5" - 1
│
▼
Subtraction expects Number
│
▼
"5" converted to 5
│
▼
5 - 1
│
▼
4
```

### Explicit mechanism

Explicit conversion is triggered by programmer.

```text
Number("5")
│
▼
Programmer asks for Number conversion
│
▼
Conversion rules are applied
│
▼
5
```

### Current position in JavaScript model

```text
JavaScript model so far
│
├── Values have types
├── Objects can be referenced
├── Stack & Heap diagrams visualize references
└── Type Conversion adapts values for operations
```

Current position diagram:

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
```

### Complete conversion picture

```text
Input value
│
├── has current type
│
▼
Operation
│
├── expects Number / String / Boolean
│
▼
Conversion needed?
│
├── no → use value
└── yes
    ├── implicit conversion
    └── explicit conversion
        │
        ▼
      converted value
        │
        ▼
      operation result
```

---

## Ментальная модель

### Переводчик

Conversion is like translator:

```text
Operation language: Number
Incoming value:     String
Translator:         Number()
Result:             Number value
```

### Адаптер

Conversion is like adapter:

```text
Device expects Type A
Cable has Type B
Adapter converts connection
```

In JavaScript:

```text
Operation expects Number
Value is String
Conversion adapts value
```

### Electrical plug adapter

```text
Socket expects one plug shape
Device has another plug shape
Adapter makes it fit
```

The adapter is not random. It follows a physical rule. Conversion also follows rules.

### Currency exchange

```text
You have USD
Store expects EUR
Exchange converts amount
```

Conversion rate matters. JavaScript conversion rules matter too.

### Universal connector

JavaScript tries to be flexible:

```text
Value from form
Value from API
Value from env
Value from code
│
▼
Operations need usable types
```

Flexibility is useful, but hidden conversion can create bugs.

---

## Примеры кода

Все примеры находятся в:

```text
examples/chapter-18/
```

Запуск:

```bash
node examples/chapter-18/01-number-conversion.js
node examples/chapter-18/02-string-conversion.js
node examples/chapter-18/03-boolean-conversion.js
node examples/chapter-18/04-implicit-conversion.js
node examples/chapter-18/05-explicit-conversion.js
node examples/chapter-18/06-common-mistakes.js
```

### 01-number-conversion.js

Shows `Number()` conversion for API-like values.

### 02-string-conversion.js

Shows `String()` conversion for logs and form-like values.

### 03-boolean-conversion.js

Shows truthy and falsy behavior.

### 04-implicit-conversion.js

Shows operation-driven conversion.

### 05-explicit-conversion.js

Shows programmer-driven conversion.

### 06-common-mistakes.js

Shows hidden conversion bug with environment-like value.

---

## Частые вопросы

### Is conversion random?

No. Conversion follows rules. It looks random when the expected type of operation is unclear.

### Should I avoid all implicit conversion?

In production and test code, explicit conversion is often clearer. But implicit conversion exists and must be understood because JavaScript uses it in many operations.

### Is `Boolean('false')` false?

No.

```javascript
Boolean('false');
```

returns:

```text
true
```

because non-empty strings are truthy.

### Why does `Number('abc')` produce `NaN`?

Because JavaScript tried to convert string to Number but could not produce meaningful numeric value.

### Will equality explain more conversion?

Yes. Equality has its own chapter. This chapter does not teach `==`, `===`, `Object.is()` or equality algorithms.

---

## Распространенные мифы

### Миф: JavaScript converts values randomly

Реальность:

Conversion happens because an operation expects a particular type and rules are applied.

### Миф: `Boolean(value)` checks whether value is meaningful

Реальность:

It checks truthiness according to JavaScript rules. A string like `'false'` is truthy.

### Миф: `Number()` always produces useful number

Реальность:

If conversion fails, result can be `NaN`.

### Миф: Type conversion and equality are the same topic

Реальность:

Equality uses conversion in some cases, but comparisons have their own rules and will be studied next.

---

## Типичные ошибки

### Ошибка 1. Add number to numeric string

```javascript
const retries = '3';

console.log(retries + 1);
```

Результат:

```text
31
```

The operation did not do numeric addition.

### Ошибка 2. Treat env string `'false'` as Boolean false

```javascript
const headless = 'false';

console.log(Boolean(headless));
```

Результат:

```text
true
```

### Ошибка 3. Ignore `NaN`

```javascript
const price = Number('not available');

console.log(price);
```

Результат:

```text
NaN
```

### Ошибка 4. Convert too late

If API returns string `"200"` but test expects Number `200`, decide conversion point explicitly.

### Ошибка 5. Memorize results without operation expectation

Better question:

```text
What type does this operation expect?
```

---

## Практическое использование

Use explicit conversion when input type is uncertain.

### API numeric field as string

```javascript
const responseStatus = '200';
const statusCode = Number(responseStatus);
```

### Form values

Form input values often arrive as strings:

```javascript
const ageFromForm = '30';
const age = Number(ageFromForm);
```

### Environment variables

Environment variables are commonly strings:

```javascript
const retries = Number('3');
const booleanTextMap = {
  true: true,
  false: false,
};

const headless = booleanTextMap.false;
```

This example uses an object as a simple lookup table. Equality rules will be studied next.

### Conversion checklist

```text
1. What value did I receive?
2. What type is it now?
3. What type does the operation expect?
4. Should conversion be explicit?
5. What happens if conversion produces NaN?
6. Is Boolean conversion using truthy/falsy rules?
```

---

## Использование в Automation QA

### API returns strings instead of numbers

```json
{
  "statusCode": "200"
}
```

Test may need:

```javascript
const statusCode = Number(response.statusCode);
```

Automation QA example diagram:

```text
API response field
│
└── "200" as String
    │
    ▼
Test expects Number
│
▼
Number("200")
│
▼
200
```

### Comparing JSON values

JSON can contain numbers, strings, booleans and null. Tests should not assume visually similar values are same type:

```text
"200"  is String
200    is Number
true   is Boolean
"true" is String
```

### Form values

Browser form inputs usually provide text-like values. If test reads `"30"` from input, numeric calculation needs conversion.

### Environment variables

Environment values often arrive as strings:

```text
HEADLESS="false"
RETRIES="3"
BASE_URL="https://example.com"
```

`HEADLESS="false"` is a non-empty string. Boolean conversion makes it `true`, so parse it intentionally.

### Avoiding hidden conversion bugs

Prefer:

```javascript
const retries = Number(retriesFromEnv);
```

over relying on implicit behavior.

When test fails unexpectedly, ask:

```text
What type did this value have before assertion?
What type did operation expect?
Did JavaScript convert it implicitly?
Should the test convert explicitly?
```

---

## Итоги

Type conversion answers:

```text
What happens when operation expects one type but receives another?
```

Core idea:

```text
JavaScript converts values because operations expect particular types.
Conversion follows rules.
It is not random.
```

Main conversion forms:

```text
Type Conversion
│
├── Implicit
│   └── operation triggers conversion
│
└── Explicit
    └── programmer calls Number(), String(), Boolean()
```

Important categories:

```text
Number conversion → may produce NaN
String conversion → produces text representation
Boolean conversion → uses truthy/falsy rules
```

Next chapter explains Equality:

```text
What happens when JavaScript compares two values?
```

---

## Что нужно запомнить

* Conversion happens because operation expects a type.
* Implicit conversion is triggered by JavaScript operation.
* Explicit conversion is requested by programmer.
* `Number()` can produce `NaN`.
* `String()` produces string representation.
* `Boolean()` uses truthy/falsy rules.
* Non-empty strings are truthy, including `'false'` and `'0'`.
* Falsy values include `false`, `0`, `''`, `null`, `undefined`, `NaN`.
* Hidden conversion bugs are common in tests.
* Environment variables and form values often arrive as strings.
* Equality has its own chapter.

---

## Проверьте себя

Ответьте без запуска кода.

1. Why does type conversion exist?
2. What is implicit conversion?
3. What is explicit conversion?
4. What does `Number('abc')` produce?
5. Is `Boolean('false')` true or false?
6. Why can `'5' + 1` differ from `'5' - 1`?
7. What type does subtraction expect?
8. Why are environment variables dangerous for Boolean conversion?
9. What is `NaN` in conversion context?
10. What question will the next chapter answer?

---

## Практика

Практика находится в файле:

```text
practice/chapter-18.md
```

Решайте задания без запуска там, где требуется predict output. Главная цель - научиться видеть expected type of operation.

---

## Решения

Решения находятся в файле:

```text
solutions/chapter-18.md
```

Читайте решения после самостоятельной попытки. Проверяйте reasoning: какая операция ожидала какой type and which conversion happened.
