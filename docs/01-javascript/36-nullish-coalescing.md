# Nullish Coalescing

## Связь с предыдущей главой

Предыдущая глава объяснила Optional Chaining.

Главная модель была такой:

```text
Object path
│
▼
Check current value
│
├── null/undefined -> stop safely -> undefined
└── otherwise -> continue
```

Optional Chaining safely traverses nested properties, but it does not choose a fallback value.

Например:

```javascript
const retries = config.retryPolicy?.retries;
```

Если `retryPolicy` отсутствует:

```text
config.retryPolicy
│
▼
undefined
│
▼
retries = undefined
```

Теперь появляется следующий вопрос:

> Какое value использовать, если результат `null` or `undefined`?

Nullish Coalescing отвечает:

```text
Current value
│
▼
Is it null or undefined?
│
├── yes -> use fallback
└── no  -> keep current value
```

Главная мысль главы:

```text
?? replaces only null and undefined
```

Он не заменяет `0`, `false`, `''` or `NaN`.

---

## Предварительные требования

Для этой главы нужно понимать:

* что object может содержать optional properties;
* что missing property gives `undefined`;
* что Optional Chaining safely returns `undefined`;
* что `null` and `undefined` represent absent or intentionally empty values in different situations;
* что variable receives expression result;
* что Automation QA code often uses configuration defaults.

Не требуется знать logical operators in detail, precedence rules, assignment operators, `??=`, complex expression parsing or TypeScript. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            120-150 минут
Разбор схем:             50-70 минут
Запуск примеров:         20-30 минут
Практика:                100-130 минут
Повторение материала:    25 минут
```

Уровень сложности: **L3**.

`??` кажется маленьким operator, но он фиксирует важную инженерную идею: fallback нужен только тогда, когда value действительно отсутствует as `null` or `undefined`.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/35-optional-chaining.md
```

Текущая глава:

```text
docs/01-javascript/36-nullish-coalescing.md
```

Следующая глава:

```text
docs/01-javascript/37-object-methods.md
```

Следующая глава ответит:

> Как objects могут хранить не только data, но и behavior?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует `??`;
* что такое nullish values;
* когда используется fallback value;
* как работает evaluation order;
* что short-circuiting означает для `??`;
* как соединять Optional Chaining and `??`;
* чем `??` отличается от `||` на высоком уровне;
* почему `??` keeps `0`, `false`, `''` and `NaN`;
* какие ошибки чаще всего встречаются;
* как `??` используется в Automation QA.

---

## Мотивация

Начнем с проблемы.

Есть configuration object:

```javascript
const config = {
  baseUrl: 'https://api.example.test'
};
```

Test helper хочет прочитать retries:

```javascript
const retries = config.retryPolicy?.retries;
```

Optional Chaining безопасно остановится:

```text
config.retryPolicy
│
▼
undefined
│
▼
retries = undefined
```

Но helper не может работать с `undefined`. Ему нужен конкретный fallback:

```text
if retries is missing
│
▼
use 2
```

Можно написать:

```javascript
const retries = config.retryPolicy?.retries ?? 2;
```

Модель:

```text
config.retryPolicy?.retries
│
▼
undefined
│
▼
is null or undefined?
│
├── yes -> 2
└── no  -> keep original value
```

Теперь `retries` becomes `2`.

Важно:

```text
0 ?? 2
│
▼
0
```

`0` is not `null` and not `undefined`.

---

## Теория

Nullish Coalescing exists because not every value that looks "empty" means "absent".

In JavaScript:

```text
null
undefined
│
└── nullish values
```

`??` asks exactly one question:

```text
Is the left side null or undefined?
```

It does not ask:

```text
Is the value false-like?
```

We will not study truthy/falsy or logical operators here. The only distinction in this chapter is:

```text
null or undefined
│
vs
everything else
```

### Syntax

```javascript
const result = value ?? fallback;
```

Meaning:

```text
value
│
▼
is null or undefined?
│
├── yes -> fallback
└── no  -> value
```

### Nullish values

Nullish values are:

```text
null
undefined
```

Only these two trigger fallback.

```javascript
console.log(undefined ?? 'fallback');
console.log(null ?? 'fallback');
```

Both use fallback.

### Existing values

Values that are not `null` or `undefined` are preserved:

```javascript
console.log(0 ?? 10);
console.log(false ?? true);
console.log('' ?? 'default');
```

Result:

```text
0
false

```

The third output is empty string. It is preserved.

### Fallback values

Fallback value is used only when current value is `null` or `undefined`.

```javascript
const timeout = config.timeout ?? 5000;
```

Model:

```text
config.timeout
│
├── null/undefined -> 5000
└── otherwise      -> config.timeout
```

### Evaluation order

JavaScript evaluates left side first:

```text
left expression
│
▼
is result null or undefined?
│
├── yes -> evaluate/use right side
└── no  -> keep left result
```

### Short-circuiting

If left side is not `null` and not `undefined`, fallback is not needed.

```text
left value is available
│
▼
right side is skipped
```

This is short-circuiting at a high level.

### Optional Chaining + `??`

The most natural combination:

```javascript
const retries = config.retryPolicy?.retries ?? 2;
```

Two-step model:

```text
Optional Chaining
│
▼
safe traversal result
│
▼
Nullish Coalescing
│
▼
fallback if result is null/undefined
```

Optional Chaining answers:

```text
Can I safely read this path?
```

Nullish Coalescing answers:

```text
What should I use if result is null or undefined?
```

### Comparison with `||` preview

`||` will be studied with logical operators later.

For now, only remember the high-level difference:

```text
?? checks only null and undefined
|| has broader logical behavior
```

That is why:

```javascript
console.log(0 ?? 10);
```

keeps `0`.

This matters in QA config:

```javascript
const retries = config.retries ?? 2;
```

If `retries` is intentionally `0`, `??` keeps `0`.

---

## Внутренний механизм

Рассмотрим:

```javascript
const timeout = config.timeout ?? 5000;
```

Conceptual engine flow:

```text
1. Evaluate config.timeout
2. Get value
3. Check: is value null or undefined?
4. If yes -> use 5000
5. If no  -> use original value
6. Assign result to timeout
```

### Value inspection

```text
current value
│
▼
is null or undefined?
│
├── yes -> fallback
└── no  -> original value
```

### Undefined path

```text
config.timeout
│
▼
undefined
│
▼
fallback used
```

### Null path

```text
response.body.middleName
│
▼
null
│
▼
fallback used
```

### Existing value path

```text
config.retries
│
▼
0
│
▼
0 is neither null nor undefined
│
▼
0 preserved
```

### Variable assignment

```javascript
const retries = config.retryPolicy?.retries ?? 2;
```

Engine conceptual flow:

```text
safe traversal result
│
▼
nullish check
│
▼
final result
│
▼
assign to retries
```

Source object remains unchanged.

---

## Ментальная модель

Представьте backup plan.

```text
Primary value
│
▼
is it null or undefined?
│
├── yes -> backup plan
└── no  -> primary value
```

Spare key model:

```text
main key exists as usable value
│
▼
use main key

main key is null/undefined
│
▼
use spare key
```

Fallback box:

```text
box with value
│
├── null/undefined -> open fallback box
└── other value    -> keep box value
```

Главная модель:

```text
Current value
│
▼
Is it null or undefined?
│
├── yes -> use fallback
└── no  -> keep current value
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-39/
```

Запуск:

```bash
node examples/chapter-39/01-basic-nullish.js
node examples/chapter-39/02-undefined.js
node examples/chapter-39/03-null.js
node examples/chapter-39/04-optional-chaining.js
node examples/chapter-39/05-common-mistakes.js
node examples/chapter-39/06-qa-example.js
```

### Пример 1. Basic nullish

```javascript
const configuredTimeout = 3000;
const timeout = configuredTimeout ?? 5000;

console.log(timeout);
```

### Пример 2. Undefined

```javascript
const config = {};

const timeout = config.timeout ?? 5000;

console.log(timeout);
```

### Пример 3. Null

```javascript
const user = {
  middleName: null
};

const middleName = user.middleName ?? 'not provided';

console.log(middleName);
```

### Пример 4. Optional Chaining

```javascript
const config = {};

const retries = config.retryPolicy?.retries ?? 2;

console.log(retries);
```

### Пример 5. Common mistakes

```javascript
const config = {
  retries: 0,
  verbose: false,
  label: ''
};

console.log(config.retries ?? 2);
console.log(config.verbose ?? true);
console.log(config.label ?? 'default');
```

`??` keeps `0`, `false` and empty string.

### Пример 6. QA example

```javascript
const apiResponse = {
  status: 200,
  body: {
    user: {
      profile: {
        name: 'Anna'
      }
    }
  }
};

const config = {
  retries: 0
};

const userName = apiResponse.body.user.profile?.name ?? 'anonymous';
const city = apiResponse.body.user.profile?.address?.city ?? 'unknown city';
const retries = config.retries ?? 2;

console.log(userName);
console.log(city);
console.log(retries);
```

---

## Частые вопросы

### `??` заменяет все "пустые" values?

Нет.

`??` replaces only:

```text
null
undefined
```

It keeps:

```text
0
false
''
NaN
```

### `??` это то же самое, что Optional Chaining?

Нет.

```text
Optional Chaining
│
└── safe traversal

Nullish Coalescing
│
└── fallback selection
```

### `??` меняет source object?

Нет.

It produces expression result.

### Когда использовать `??`?

Когда fallback should be used only for `null` or `undefined`.

### Нужно ли использовать `??` после каждого Optional Chaining?

Нет.

Если `undefined` is acceptable result, fallback не нужен.

---

## Распространенные мифы

### Миф: `??` заменяет любое "false-like" value

Реальность:

```text
only null and undefined
```

### Миф: `??` исправляет данные в object

Реальность:

It chooses result value. It does not write back to object.

### Миф: `??` нужен только после Optional Chaining

Реальность:

Optional Chaining + `??` is common, but `??` can work with any expression result.

### Миф: `??` всегда лучше `||`

Реальность:

They solve different problems. Logical operators will be studied later. In this chapter, use `??` when fallback is only for `null` or `undefined`.

---

## Типичные ошибки

### Ошибка 1. Ожидать replacement for `0`

```javascript
const retries = 0 ?? 2;
```

Result:

```text
0
```

`0` is not `null` and not `undefined`.

### Ошибка 2. Ожидать replacement for `false`

```javascript
const verbose = false ?? true;
```

Result:

```text
false
```

### Ошибка 3. Думать, что fallback writes into object

```javascript
const config = {};
const timeout = config.timeout ?? 5000;

console.log(config.timeout);
```

`config.timeout` remains `undefined`.

### Ошибка 4. Использовать fallback там, где missing value should fail

If API field is required, fallback can hide a contract problem.

```text
required field missing
│
▼
test should fail clearly
```

---

## Практическое использование

### Configuration defaults

```javascript
const timeout = config.timeout ?? 5000;
const retries = config.retries ?? 2;
```

### Optional API fields

```javascript
const middleName = user.middleName ?? 'not provided';
```

### Retry counts

```javascript
const retries = config.retryPolicy?.retries ?? 2;
```

If retries is `0`, `??` keeps `0`.

### Timeout values

```javascript
const timeoutMs = config.timeouts?.api ?? 5000;
```

### Assertion helpers

```javascript
const displayName = response.body.user.profile?.displayName ?? response.body.user.profile?.name;
```

This keeps fallback logic explicit.

---

## Использование в Automation QA

### Configuration defaults

Automation frameworks often use config objects:

```javascript
const timeout = testConfig.timeout ?? 5000;
```

If timeout is missing, use default.

If timeout is `0`, keep `0`.

### Optional API fields

```javascript
const city = response.body.user.profile?.address?.city ?? 'unknown';
```

Optional Chaining safely reads. `??` chooses fallback.

### Retry counts

```javascript
const retries = config.retryPolicy?.retries ?? 2;
```

This is important because `0` may mean "do not retry".

### Assertion helpers

```javascript
const label = response.body.user.profile?.label ?? 'unlabeled user';
```

Helper receives a stable value without changing source response.

---

## Диаграммы главы

### 1. Why ?? exists

```text
safe read result
│
▼
may be null/undefined
│
▼
need fallback value
```

### 2. Optional Chaining → ??

```text
?. 
│
▼
undefined
│
▼
??
│
▼
fallback
```

### 3. Value inspection

```text
current value
│
▼
is null or undefined?
```

### 4. Fallback decision

```text
null/undefined
│
├── yes -> fallback
└── no  -> current value
```

### 5. Null

```text
null
│
▼
use fallback
```

### 6. Undefined

```text
undefined
│
▼
use fallback
```

### 7. Existing value

```text
0 / false / ''
│
▼
keep value
```

### 8. Evaluation flow

```text
evaluate left
│
▼
nullish check
│
▼
choose result
```

### 9. Short-circuit

```text
left is not null/undefined
│
▼
right side not needed
```

### 10. QA configuration

```text
config.timeout
│
├── value -> use value
└── undefined -> default
```

### 11. API response

```text
response optional field
│
├── present -> value
└── null/undefined -> fallback
```

### 12. Readability

```text
value ?? fallback
│
└── explicit missing-value policy
```

### 13. Common mistakes

```text
0 ?? 2
│
▼
0
```

### 14. || preview

```text
??
│
└── null/undefined only

||
│
└── broader logical behavior later
```

### 15. Current JavaScript model

```text
Objects
│
├── Destructuring
├── Optional Chaining
└── Nullish Coalescing
```

### 16. Complete ?? model

```text
value
│
▼
null or undefined?
│
├── yes -> fallback
└── no  -> value
```

### 17. Reserve value

```text
primary value absent
│
▼
reserve value
```

### 18. Backup plan

```text
main plan unavailable
│
▼
backup plan
```

### 19. Decision tree

```text
check value
│
├── null
├── undefined
└── other
```

### 20. Variable assignment

```text
chosen result
│
▼
assigned to variable
```

### 21. Fallback timeline

```text
read value
│
▼
inspect
│
▼
choose fallback or original
```

### 22. Automation QA config

```text
retryPolicy?.retries
│
▼
?? 2
```

### 23. Optional API field

```text
profile?.address?.city
│
▼
?? 'unknown'
```

### 24. Chaining with ?.

```text
safe traversal
│
▼
fallback selection
```

### 25. Mental model summary

```text
backup plan
│
spare key
│
reserve value
```

### 26. Existing value preserved

```text
false
│
▼
kept
```

### 27. Nullish values only

```text
null
undefined
│
▼
fallback
```

### 28. Safe traversal + fallback

```text
?. reads safely
│
▼
?? fills only null/undefined
```

### 29. Undefined path

```text
missing property
│
▼
undefined
│
▼
fallback
```

### 30. Complete flow

```text
expression
│
▼
result
│
▼
nullish?
│
▼
final value
```

### 31. Bridge to Object Methods

```text
objects store data
│
▼
next: objects store behavior
```

### 32. Summary diagram

```text
Current value
│
▼
Is it null or undefined?
│
├── Yes -> Use fallback
└── No  -> Keep current value
```

---

## Практика

Практика находится в:

```text
practice/chapter-39.md
```

Рекомендуемый порядок:

```text
1. Ответить на концептуальные вопросы.
2. Определить result expressions.
3. Предсказать вывод кода.
4. Запустить examples/chapter-39/.
5. Выполнить debugging tasks.
6. Сделать QA mini-project.
7. Свериться с solutions/chapter-39.md.
```

---

## Решения

Решения находятся в:

```text
solutions/chapter-39.md
```

Не открывайте решения до самостоятельной попытки. Главный навык главы - понимать, когда fallback is used and when original value is preserved.

---

## Итоги

Nullish Coalescing продолжает Optional Chaining.

```text
Optional Chaining
│
▼
safe traversal
│
▼
result may be undefined
│
▼
Nullish Coalescing
│
▼
fallback only for null/undefined
```

Главная модель:

```text
Current value
│
▼
Is it null or undefined?
│
├── Yes -> Use fallback
└── No  -> Keep current value
```

---

## Что нужно запомнить

* `??` exists for fallback values.
* Fallback is used only for `null` and `undefined`.
* `??` keeps `0`, `false`, `''` and `NaN`.
* `??` does not change source object.
* Left side is evaluated first.
* If left side is not nullish, fallback is not needed.
* Optional Chaining and `??` work naturally together.
* `??` is not the same as `||`.
* In QA, `??` is useful for config defaults and optional API fields.
* Object Methods are the next step: objects can contain behavior as well as data.

---

## Quick Check

Ответьте без запуска кода.

1. Какую проблему решает `??`?
2. Какие values are nullish?
3. Когда fallback is used?
4. Почему `0 ?? 2` returns `0`?
5. Почему `undefined ?? 2` returns `2`?
6. Меняет ли `??` source object?
7. Как Optional Chaining and `??` work together?
8. Чем `??` differs from `||` at high level?
9. Где `??` useful in Automation QA?
10. Какая следующая тема логически продолжает Objects section?
