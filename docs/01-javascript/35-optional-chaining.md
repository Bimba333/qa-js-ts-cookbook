# Optional Chaining

## Связь с предыдущей главой

Предыдущая глава объяснила Destructuring.

Главная модель была такой:

```text
Object
│
▼
many named properties
│
▼
extract required values
│
▼
new variables
```

Destructuring удобно извлекает values из existing properties.

Но теперь появляется другая проблема.

Иногда property chain выглядит так:

```javascript
response.body.user.profile.name
```

И она работает, если весь путь существует:

```text
response
│
└── body
    └── user
        └── profile
            └── name
```

Но в реальном API response часть пути может отсутствовать:

```text
response
│
└── body
    └── user
        └── profile is missing
```

Главный вопрос этой главы:

> Что происходит, если один уровень property chain не существует?

Optional Chaining отвечает:

```text
Object path
│
▼
check current value
│
▼
is null or undefined?
│
├── yes -> stop safely -> undefined
└── no  -> continue
```

Важно сразу:

```text
Optional Chaining
│
≠
default value
```

Optional Chaining не выбирает fallback value. Он только safely traverses a property chain and returns `undefined` when traversal cannot continue.

---

## Предварительные требования

Для этой главы нужно понимать:

* что object groups related data;
* что property читается через dot notation;
* что nested object может содержать nested properties;
* что reading missing property returns `undefined`;
* что destructuring извлекает existing properties into variables;
* что `undefined` означает отсутствие usable value в данном месте.

Не требуется знать Nullish Coalescing, logical operators, optional element access, advanced chaining, TypeScript optional properties or proxies. Эти темы будут изучаться позже.

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

Optional Chaining выглядит маленьким operator, но он меняет mental model чтения nested data: теперь code can safely stop at missing level instead of crashing.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/34-destructuring.md
```

Текущая глава:

```text
docs/01-javascript/35-optional-chaining.md
```

Следующая глава:

```text
docs/01-javascript/36-nullish-coalescing.md
```

Следующая глава ответит:

> Какое value использовать, если результат `null` or `undefined`?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует Optional Chaining;
* какую проблему решает safe property access;
* как работает operator `?.`;
* что происходит при чтении nested properties;
* что такое short-circuiting на уровне property chain;
* почему результатом становится `undefined`;
* почему Optional Chaining не задает default value;
* как выглядит optional method call на высоком уровне;
* какие ошибки встречаются чаще всего;
* как Optional Chaining используется в Automation QA.

---

## Мотивация

Начнем с реальной проблемы.

API response иногда возвращает profile:

```javascript
const responseWithProfile = {
  body: {
    user: {
      profile: {
        name: 'Anna'
      }
    }
  }
};
```

Тогда ordinary property access работает:

```javascript
console.log(responseWithProfile.body.user.profile.name);
```

Путь существует:

```text
responseWithProfile
│
└── body
    └── user
        └── profile
            └── name
```

Но другой response может не содержать `profile`:

```javascript
const responseWithoutProfile = {
  body: {
    user: {}
  }
};
```

Обычный доступ ломается:

```javascript
console.log(responseWithoutProfile.body.user.profile.name);
```

Проблема:

```text
responseWithoutProfile.body.user.profile
│
▼
undefined
│
▼
try to read .name from undefined
│
▼
TypeError
```

Вопрос:

> Как безопасно пройти по цепочке, если один уровень может отсутствовать?

Optional Chaining:

```javascript
const name = responseWithoutProfile.body.user.profile?.name;

console.log(name);
```

Результат:

```text
undefined
```

Code safely continues.

---

## Теория

Optional Chaining существует для safe property access in chains where some level can be `null` or `undefined`.

Обычная цепочка:

```javascript
response.body.user.profile.name
```

читает каждый уровень без safety checkpoint:

```text
read response
│
▼
read body
│
▼
read user
│
▼
read profile
│
▼
read name
```

Если intermediate level is `undefined`, следующий property access throws.

Optional Chaining добавляет checkpoint:

```javascript
response.body.user.profile?.name
```

Модель:

```text
read profile
│
├── neither null nor undefined -> read name
└── null/undefined -> stop and return undefined
```

### Operator `?.`

`?.` означает:

```text
before reading next property
│
▼
check current value
│
├── null or undefined -> stop safely
└── otherwise -> continue
```

Пример:

```javascript
const city = user.profile?.address?.city;
```

Каждый `?.` ставит checkpoint.

```text
profile?
│
├── neither null nor undefined -> address?
└── null/undefined -> undefined

address?
│
├── neither null nor undefined -> city
└── null/undefined -> undefined
```

### Nested properties

Nested data in Automation QA common:

```javascript
const response = {
  body: {
    user: {
      profile: {
        email: 'anna@example.test'
      }
    }
  }
};
```

Safe access:

```javascript
const email = response.body.user.profile?.email;
```

Если `profile` есть, result is email.

Если `profile` missing, result is `undefined`.

### Short-circuiting

Short-circuiting означает early stop.

```text
current value is null or undefined
│
▼
do not evaluate rest of chain
│
▼
return undefined
```

Пример:

```javascript
const name = response.body.user.profile?.name;
```

Если `profile` is `undefined`, JavaScript не пытается читать `.name`.

### Undefined result

Optional Chaining returns `undefined` when it stops safely.

```text
missing level
│
▼
safe stop
│
▼
undefined
```

Это не default value.

```text
Optional Chaining
│
└── returns undefined

Default value
│
└── future topic with Nullish Coalescing
```

### Comparison with ordinary access

Ordinary access:

```javascript
response.body.user.profile.name;
```

```text
profile is undefined
│
▼
read .name from undefined
│
▼
TypeError
```

Optional Chaining:

```javascript
response.body.user.profile?.name;
```

```text
profile is undefined
│
▼
stop safely
│
▼
undefined
```

### Optional method call preview

Optional Chaining can also be used with method calls:

```javascript
reporter.log?.('test passed');
```

High-level meaning:

```text
if reporter.log is neither null nor undefined
│
▼
call it
│
else
▼
return undefined
```

This chapter only previews optional method calls. We do not study advanced call forms here.

---

## Внутренний механизм

Рассмотрим:

```javascript
const city = response.body.user.profile?.address?.city;
```

Conceptual engine flow:

```text
1. Read response
2. Read body
3. Read user
4. Read profile
5. Check profile for null/undefined
6. If null/undefined -> result undefined
7. If neither null nor undefined -> read address
8. Check address for null/undefined
9. If null/undefined -> result undefined
10. If neither null nor undefined -> read city
```

### Property access flow

```text
current value
│
▼
optional checkpoint?
│
├── null/undefined -> stop
└── neither null nor undefined -> continue
```

### Existing path

```text
response
│
└── body exists
    └── user exists
        └── profile exists
            └── name exists
                │
                ▼
              'Anna'
```

### Missing path

```text
response
│
└── body exists
    └── user exists
        └── profile missing
            │
            ▼
       optional checkpoint stops
            │
            ▼
        undefined
```

### Object unchanged

Optional Chaining only reads.

```text
before optional chaining
│
└── object structure

after optional chaining
│
└── same object structure
```

It does not add missing properties.

It does not create fallback objects.

It does not change response.

### Variable assignment

```javascript
const name = response.body.user.profile?.name;
```

If path exists:

```text
name = 'Anna'
```

If path stops:

```text
name = undefined
```

The variable receives the result of traversal.

---

## Ментальная модель

Представьте hallway with doors:

```text
Door: body
│
▼
Door: user
│
▼
Door: profile
│
▼
Door: name
```

Ordinary access идет вперед и ожидает, что каждая дверь существует.

Optional Chaining ставит checkpoint:

```text
arrive at door value
│
├── null/undefined -> stop safely
└── otherwise      -> continue
```

Staircase model:

```text
Step 1: response
Step 2: body
Step 3: user
Step 4: profile
Step 5: name
```

If a step is missing:

```text
do not fall
│
▼
stop
│
▼
undefined
```

Bridge segments:

```text
segment value is neither null nor undefined
│
▼
walk forward

segment value is null or undefined
│
▼
stop before crossing
```

Главная модель:

```text
Read property
│
▼
If current value is neither null nor undefined
│
▼
Continue
│
▼
If current value is null or undefined, stop safely
│
▼
Return undefined
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-38/
```

Запуск:

```bash
node examples/chapter-38/01-basic-optional-chaining.js
node examples/chapter-38/02-nested-properties.js
node examples/chapter-38/03-short-circuit.js
node examples/chapter-38/04-common-mistakes.js
node examples/chapter-38/05-method-preview.js
node examples/chapter-38/06-qa-example.js
```

### Пример 1. Basic Optional Chaining

```javascript
const user = {
  profile: {
    name: 'Anna'
  }
};

const userWithoutProfile = {};

console.log(user.profile?.name);
console.log(userWithoutProfile.profile?.name);
```

### Пример 2. Nested properties

```javascript
const response = {
  body: {
    user: {
      profile: {
        email: 'anna@example.test'
      }
    }
  }
};

console.log(response.body.user.profile?.email);
console.log(response.body.user.settings?.theme);
```

### Пример 3. Short-circuit

```javascript
const response = {
  body: {
    user: {}
  }
};

const profileName = response.body.user.profile?.name;

console.log(profileName);
console.log('execution continues');
```

### Пример 4. Common mistakes

```javascript
const response = {
  body: {}
};

const name = response.body.user?.profile?.name;

console.log(name);
```

Optional Chaining must be placed at each level that may be missing.

### Пример 5. Method preview

```javascript
const reporter = {
  log: function (message) {
    console.log('report:', message);
  }
};

const silentReporter = {};

reporter.log?.('test passed');
silentReporter.log?.('test skipped');
```

### Пример 6. QA example

```javascript
const apiResponse = {
  status: 200,
  body: {
    user: {
      id: 101,
      profile: {
        name: 'Anna'
      }
    }
  }
};

const userName = apiResponse.body.user.profile?.name;
const userTheme = apiResponse.body.user.settings?.theme;

console.log(apiResponse.status);
console.log(userName);
console.log(userTheme);
```

---

## Частые вопросы

### Optional Chaining задает default value?

Нет.

```text
missing path
│
▼
undefined
```

Default value будет темой следующей главы: Nullish Coalescing.

### Optional Chaining меняет object?

Нет.

Он только читает цепочку safely.

### Почему возвращается `undefined`, а не ошибка?

Потому что `?.` tells JavaScript:

```text
if current value is null or undefined
│
▼
stop traversal safely
```

### Нужно ли ставить `?.` на каждом уровне?

Только на тех уровнях, которые могут быть `null` or `undefined`.

Если `response.body` тоже может отсутствовать, нужно:

```javascript
response.body?.user?.profile?.name
```

### Это замена validation?

Нет.

Optional Chaining helps safe reading. It does not prove that data is valid.

---

## Распространенные мифы

### Миф: Optional Chaining исправляет данные

Реальность:

Он не исправляет response and does not add missing properties.

### Миф: Optional Chaining возвращает пустую строку или `null`

Реальность:

When it stops, result is `undefined`.

### Миф: Optional Chaining - это просто короткая запись многих `if`

Реальность:

Главная идея не в краткости, а в safe traversal of property chain.

### Миф: Optional Chaining можно поставить только один раз в начале

Реальность:

Checkpoint нужен на каждом level that may be missing.

---

## Типичные ошибки

### Ошибка 1. Поставить `?.` слишком поздно

Неправильно:

```javascript
response.body.user.profile?.name;
```

Если `user` missing, code still throws before reaching `profile?.`.

Исправление:

```javascript
response.body.user?.profile?.name;
```

### Ошибка 2. Ожидать default value

```javascript
const theme = user.settings?.theme;
```

If settings missing:

```text
theme = undefined
```

Not:

```text
theme = 'default'
```

Default value будет изучаться в Nullish Coalescing.

### Ошибка 3. Скрыть обязательную ошибку

Если property must exist, Optional Chaining может замаскировать проблему.

```text
required data missing
│
▼
test should fail clearly
```

Use Optional Chaining for truly optional paths.

### Ошибка 4. Думать, что object стал безопасным навсегда

Optional Chaining protects only the chain where it is used.

Other property access can still throw.

---

## Практическое использование

Optional Chaining useful when object shape is partially optional.

### Optional API fields

```javascript
const middleName = response.body.user.profile?.middleName;
```

### Nested response objects

```javascript
const city = response.body.user.profile?.address?.city;
```

### Optional configuration

```javascript
const retryCount = config.retryPolicy?.retries;
```

### Assertion helpers

```javascript
const actualRole = response.body.user?.role;
```

The helper can safely read optional field and then decide what assertion should do.

---

## Использование в Automation QA

### Optional API fields

Some API fields appear only for specific users:

```text
admin user
│
└── permissions

regular user
│
└── no permissions field
```

Optional Chaining:

```javascript
const permissions = response.body.user.permissions?.items;
```

### Nested response objects

API response can contain deeply nested data:

```javascript
const country = response.body.user.profile?.address?.country;
```

If address missing, test code does not crash during reading.

### Optional configuration

```javascript
const retries = config.retryPolicy?.retries;
```

This reads optional config safely. It does not provide default retries. That comes next with Nullish Coalescing.

### Payload validation

```javascript
const promoCode = payload.discount?.promoCode;
```

Useful when field is optional.

### Assertion helpers

Optional Chaining can make helper robust, but it must not hide required data bugs.

```text
optional field
│
└── safe access is appropriate

required field
│
└── missing value should fail clearly
```

---

## Диаграммы главы

### 1. Why Optional Chaining exists

```text
nested property path
│
▼
some level may be missing
│
▼
need safe traversal
```

### 2. Nested object

```text
response
│
└── body
    └── user
        └── profile
            └── name
```

### 3. Missing intermediate object

```text
response
│
└── body
    └── user
        └── profile missing
```

### 4. Property access flow

```text
read level
│
▼
read next level
│
▼
read next level
```

### 5. Safe stopping

```text
missing level
│
▼
stop safely
```

### 6. Undefined result

```text
safe stop
│
▼
undefined
```

### 7. Short-circuit

```text
checkpoint fails
│
▼
rest of chain skipped
```

### 8. Comparison with ordinary access

```text
ordinary access -> TypeError
optional access -> undefined
```

### 9. Current JavaScript model

```text
Objects
│
├── properties
├── destructuring
└── optional chaining
```

### 10. QA API response

```text
apiResponse
│
└── body
    └── user
        └── optional profile
```

### 11. Readability

```text
safe traversal
│
▼
intent visible in property chain
```

### 12. Common mistakes

```text
?. too late
│
▼
earlier missing level still throws
```

### 13. Optional method call preview

```text
method value is null or undefined?
│
├── yes -> undefined
└── no  -> call
```

### 14. Object traversal

```text
object
│
▼
property
│
▼
property
│
▼
value
```

### 15. Existing path

```text
all checked levels are neither null nor undefined
│
▼
final value returned
```

### 16. Missing path

```text
checked level is null or undefined
│
▼
undefined returned
```

### 17. Checkpoint model

```text
current value
│
├── null/undefined -> stop
└── otherwise -> continue
```

### 18. Hallway analogy

```text
door value is neither null nor undefined
│
▼
walk through

door value is null or undefined
│
▼
stop
```

### 19. Staircase analogy

```text
step value is neither null nor undefined
│
▼
go up

step value is null or undefined
│
▼
stop safely
```

### 20. Execution timeline

```text
read response
│
▼
read body
│
▼
checkpoint
│
▼
continue or stop
```

### 21. Bridge to Nullish Coalescing

```text
optional chaining result
│
▼
undefined
│
▼
need fallback value
```

### 22. Object unchanged

```text
read safely
│
▼
object remains unchanged
```

### 23. Safe access

```text
?. 
│
└── safe access checkpoint
```

### 24. Variable assignment

```text
optional chain result
│
▼
assigned to variable
```

### 25. API payload example

```text
payload
│
└── discount?
    └── promoCode?
```

### 26. Assertion helper

```text
helper
│
▼
read optional field
│
▼
decide assertion
```

### 27. Mental model summary

```text
path inspection
│
▼
checkpoint
│
▼
safe stop
```

### 28. Complete Optional Chaining model

```text
Object path
│
▼
Check current value
│
├── null/undefined -> undefined
└── otherwise -> continue
```

### 29. Property chain

```text
a
│
└── b
    └── c
        └── d
```

### 30. Early stop

```text
a.b missing
│
▼
do not read c.d
```

### 31. Undefined propagation

```text
missing checkpoint
│
▼
undefined result
│
▼
variable receives undefined
```

### 32. Summary diagram

```text
Optional Chaining
│
├── checks whether current value is null or undefined
├── continues if it is neither null nor undefined
├── stops safely if it is null or undefined
└── returns undefined
```

---

## Практика

Практика находится в:

```text
practice/chapter-38.md
```

Рекомендуемый порядок:

```text
1. Ответить на концептуальные вопросы.
2. Определить result optional chains.
3. Предсказать вывод кода.
4. Запустить examples/chapter-38/.
5. Выполнить debugging tasks.
6. Сделать QA mini-project.
7. Свериться с solutions/chapter-38.md.
```

---

## Решения

Решения находятся в:

```text
solutions/chapter-38.md
```

Не открывайте решения до самостоятельной попытки. Главный навык главы - понимать, где chain stops and why result becomes `undefined`.

---

## Итоги

Optional Chaining продолжает раздел Objects:

```text
Objects
│
▼
Destructuring
│
▼
Optional Chaining
```

Главная модель:

```text
Object path
│
▼
Check current value
│
├── null/undefined -> stop safely -> undefined
└── otherwise -> continue
```

Optional Chaining is not a default value mechanism. It only performs safe traversal.

---

## Что нужно запомнить

* Optional Chaining нужен для safe property access.
* `?.` checks whether current value is `null` or `undefined` before continuing.
* If current value is `null` or `undefined`, chain stops.
* Safe stop returns `undefined`.
* Optional Chaining does not create default values.
* Optional Chaining does not change object.
* `?.` should be placed before levels that may be missing.
* Optional method calls exist, but advanced cases come later.
* In Automation QA, Optional Chaining helps with optional API fields, nested responses and optional config.
* Nullish Coalescing will explain fallback values in the next chapter.

---

## Quick Check

Ответьте без запуска кода.

1. Какую проблему решает Optional Chaining?
2. Что делает operator `?.`?
3. Что произойдет, если current value is `undefined`?
4. Почему Optional Chaining returns `undefined` instead of throwing?
5. Задает ли Optional Chaining default value?
6. Меняет ли Optional Chaining source object?
7. Почему `?.` иногда нужно ставить на нескольких levels?
8. Когда Optional Chaining может скрыть проблему?
9. Где Optional Chaining полезен в Automation QA?
10. Какая следующая тема логически продолжает Optional Chaining?
