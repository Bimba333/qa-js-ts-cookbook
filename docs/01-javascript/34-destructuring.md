# Destructuring

## Связь с предыдущей главой

Предыдущая глава начала раздел Objects.

Главная модель была такой:

```text
Object
│
▼
one entity
│
▼
many named properties
```

Например:

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  active: true
};
```

Object удобно хранит related data together.

Теперь появляется следующий вопрос:

> Как удобно извлечь только те properties, которые нужны прямо сейчас?

Можно писать так:

```javascript
const userName = user.name;
const userRole = user.role;
```

Это работает. Но когда таких извлечений много, код начинает шуметь:

```text
user.name
user.role
user.active
user.email
│
▼
same object repeated again and again
```

Destructuring отвечает на этот вопрос.

Главная модель главы:

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

Важно сразу:

```text
Destructuring
│
≠
creating a new object
```

Destructuring читает existing properties and creates variables from them.

---

## Предварительные требования

Для этой главы нужно понимать:

* что object groups related data;
* что object состоит из properties;
* что property имеет key and value;
* как читать property через dot notation;
* как читать property через bracket notation;
* что missing property returns `undefined`;
* что variable дает named access к value.

Не требуется знать array destructuring, rest properties, spread with objects, parameter destructuring, deep nested patterns or TypeScript typing. Эти темы будут изучаться позже.

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

Destructuring выглядит как короткий syntax. Но важно понимать не сокращение, а механизм: JavaScript берет object, находит properties по именам и создает variables.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/33-objects.md
```

Текущая глава:

```text
docs/01-javascript/34-destructuring.md
```

Следующая глава:

```text
docs/01-javascript/35-optional-chaining.md
```

Следующая глава ответит:

> Как безопасно читать nested properties, которые могут отсутствовать?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем существует destructuring;
* почему destructuring удобен при работе с objects;
* что destructuring извлекает значения из existing properties;
* как object destructuring создает variables;
* как происходит matching by property name;
* что destructuring не меняет исходный object;
* как работают default значения;
* зачем нужно renaming;
* что такое nested destructuring на высоком уровне;
* какие ошибки встречаются чаще всего;
* как destructuring используется в Automation QA.

---

## Мотивация

Начнем с проблемы.

Есть API-ответ:

```javascript
const response = {
  status: 200,
  body: {
    id: 101,
    name: 'Anna',
    role: 'admin'
  },
  durationMs: 340
};
```

Тесту нужны только `status` and `body`.

Обычный вариант:

```javascript
const status = response.status;
const body = response.body;
```

Он понятен, но повторяет `response`:

```text
response.status
response.body
│
▼
same source object
│
▼
manual extraction
```

Если properties больше, шум растет:

```javascript
const status = response.status;
const body = response.body;
const durationMs = response.durationMs;
```

Вопрос:

> Можно ли сказать: возьми из `response` эти properties и создай для них variables?

Да.

```javascript
const { status, body, durationMs } = response;
```

Модель:

```text
response object
│
├── status
├── body
└── durationMs
│
▼
destructuring
│
├── const status
├── const body
└── const durationMs
```

Что важно:

```text
response remains the same object
```

Destructuring не "разбирает" object физически и не создает новый object. Он создает variables from existing property значения.

---

## Теория

Destructuring нужен, когда object содержит много named properties, а текущему участку кода нужны только некоторые из них.

```text
Object with many properties
│
▼
current code needs selected values
│
▼
destructuring extracts them into variables
```

### Object destructuring syntax

Базовая форма:

```javascript
const { name, role } = user;
```

Это означает:

```text
from object user
│
├── read property "name"
└── read property "role"
│
▼
create variables
│
├── name
└── role
```

Эквивалент без destructuring:

```javascript
const name = user.name;
const role = user.role;
```

Но destructuring выражает намерение компактнее:

```text
I need these properties from this object
```

### Variable names

В простом destructuring variable name совпадает с property key:

```javascript
const { name } = user;
```

Модель:

```text
property key "name"
│
▼
variable name
```

Это не случайность. Matching происходит by property name.

### Property matching

JavaScript не берет "первую", "вторую" или "третью" property.

Object destructuring matches by property name:

```javascript
const user = {
  role: 'admin',
  name: 'Anna'
};

const { name, role } = user;
```

Порядок properties в object здесь не является основой matching.

```text
pattern asks for "name"
│
▼
object has "name"
│
▼
name = 'Anna'
```

### Missing property

Если property отсутствует, variable получит `undefined`:

```javascript
const { email } = user;

console.log(email);
```

Модель:

```text
pattern asks for "email"
│
▼
object has no "email"
│
▼
email = undefined
```

Это продолжает правило из предыдущей главы:

```text
reading missing property
│
▼
undefined
```

### Default значения

Default value используется, если extracted value is `undefined`:

```javascript
const { role = 'guest' } = user;
```

Модель:

```text
read user.role
│
├── value exists -> use value
└── value is undefined -> use default
```

Пример:

```javascript
const user = {
  name: 'Anna'
};

const { role = 'guest' } = user;

console.log(role);
```

Результат:

```text
guest
```

Default value не добавляет property в object.

```text
default value
│
▼
affects created variable
│
▼
does not modify source object
```

### Renaming variables

Иногда property key не подходит как local variable name.

Например, object has `name`, но в коде лучше `userName`:

```javascript
const { name: userName } = user;
```

Модель:

```text
property key "name"
│
▼
read value
│
▼
create variable userName
```

Важно:

```text
name: userName
│
├── name     -> property key
└── userName -> new variable
```

Это частое место ошибок.

### Nested destructuring preview

Object может содержать nested object:

```javascript
const response = {
  status: 200,
  body: {
    name: 'Anna'
  }
};
```

Можно извлечь nested value:

```javascript
const {
  body: { name }
} = response;
```

Высокоуровневая модель:

```text
response
│
└── body
    └── name
│
▼
extract name
```

В этой главе nested destructuring только preview. Deep nested patterns can become hard to read, and optional chaining will be studied next.

### Object remains unchanged

Это центральное правило.

```javascript
const { name } = user;
```

После этой строки:

```text
user object
│
└── unchanged

name variable
│
└── created from user.name
```

Destructuring:

```text
reads existing properties
│
▼
creates variables
│
▼
does not create a new object
│
▼
does not remove properties
```

---

## Внутренний механизм

Посмотрим, что делает engine conceptually.

Код:

```javascript
const { status, body } = response;
```

Шаги:

```text
1. Read identifier response
2. Get object value
3. Look for property "status"
4. Create variable status
5. Store response.status value in status
6. Look for property "body"
7. Create variable body
8. Store response.body value in body
```

### Extraction flow

```text
source object
│
▼
destructuring pattern
│
▼
property lookup by name
│
▼
variable creation
│
▼
values assigned to variables
```

### Variable mapping

```javascript
const { name: userName } = user;
```

Сопоставление:

```text
source property
│
└── "name"
    │
    ▼
target variable
│
└── userName
```

### Default value flow

```javascript
const { timeout = 5000 } = config;
```

Концептуально:

```text
read config.timeout
│
├── not undefined -> timeout = actual value
└── undefined     -> timeout = 5000
```

### Existing object vs new variables

Очень важно отделить source object от created variables:

```text
Source
│
└── response object

Created
│
├── status variable
└── body variable
```

Destructuring не создает:

```text
new response object
```

Он создает:

```text
new variables
```

### Object identity unchanged

Если переменная ссылалась на object до destructuring, она продолжает ссылаться на тот же object после destructuring.

```text
before destructuring
│
└── response -> object

after destructuring
│
├── response -> same object
├── status   -> value from response.status
└── body     -> value from response.body
```

Это важно для понимания тестовых данных. Destructuring не делает защитную копию object.

---

## Ментальная модель

Представьте folder с документами:

```text
Folder: response
│
├── document: status
├── document: body
└── document: durationMs
```

Destructuring - это не создание новой папки.

Это выбор нужных documents:

```text
open folder
│
▼
take selected labeled documents
│
▼
put them on desk as variables
```

Еще одна модель: profile card.

```text
Profile card
│
├── id
├── name
├── role
└── active
```

Destructuring:

```text
select fields
│
├── name
└── role
│
▼
create local variables
```

Главная модель:

```text
Object
│
▼
many named properties
│
▼
take only required properties
│
▼
variables for current code
```

---

## Примеры кода

Примеры находятся в:

```text
examples/01-javascript/chapter-34/
```

Запуск:

```bash
node examples/01-javascript/chapter-34/01-basic-destructuring.js
node examples/01-javascript/chapter-34/02-default-values.js
node examples/01-javascript/chapter-34/03-renaming.js
node examples/01-javascript/chapter-34/04-common-mistakes.js
node examples/01-javascript/chapter-34/05-nested-preview.js
node examples/01-javascript/chapter-34/06-qa-example.js
```

### Пример 1. Basic destructuring

```javascript
const response = {
  status: 200,
  body: 'created',
  durationMs: 340
};

const { status, body } = response;

console.log(status);
console.log(body);
```

### Пример 2. Default значения

```javascript
const config = {
  baseUrl: 'https://api.example.test'
};

const { baseUrl, timeout = 5000 } = config;

console.log(baseUrl);
console.log(timeout);
console.log(config.timeout);
```

`timeout` variable gets default value. `config.timeout` remains missing.

### Пример 3. Renaming

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};

const { name: userName, role: userRole } = user;

console.log(userName);
console.log(userRole);
```

### Пример 4. Типичные ошибки

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};

const { name: userName } = user;

console.log(userName);
console.log(user.name);
```

`name: userName` creates `userName`, not `name`.

### Пример 5. Nested preview

```javascript
const response = {
  status: 200,
  body: {
    id: 101,
    name: 'Anna'
  }
};

const {
  body: { name }
} = response;

console.log(name);
```

Nested destructuring works, but deep patterns can reduce readability.

### Пример 6. QA example

```javascript
const apiResponse = {
  status: 200,
  body: {
    id: 101,
    name: 'Anna',
    role: 'admin'
  },
  durationMs: 340
};

const { status, body, durationMs } = apiResponse;
const { name, role } = body;

console.log(status);
console.log(name);
console.log(role);
console.log(durationMs);
```

---

## Частые вопросы

### Destructuring создает новый object?

Нет.

```text
destructuring
│
▼
reads properties
│
▼
creates variables
```

Source object остается тем же.

### Destructuring меняет object?

Нет.

```text
object before
│
└── same properties

object after
│
└── same properties
```

### Почему variable name должен совпадать с property key?

В простой форме destructuring matching идет by property name.

```javascript
const { role } = user;
```

JavaScript ищет property `"role"` and creates variable `role`.

### Что делать, если local variable должна называться иначе?

Использовать renaming:

```javascript
const { role: userRole } = user;
```

### Что будет, если property отсутствует?

Variable получит `undefined`, если нет default value.

```text
missing property
│
▼
undefined
```

---

## Распространенные мифы

### Миф: destructuring - это просто короткий синтаксис

Реальность:

Destructuring выражает намерение:

```text
from this object
│
▼
I need these properties
```

Краткость - следствие, но не главная идея.

### Миф: destructuring удаляет properties из object

Реальность:

Object остается unchanged.

```text
extract value
│
≠
remove property
```

### Миф: destructuring создает новый object

Реальность:

Создаются variables, not a new object.

```text
const { status } = response
│
▼
variable status
```

### Миф: порядок properties определяет matching

Реальность:

Object destructuring matches by property name.

---

## Типичные ошибки

### Ошибка 1. Думать, что renaming создает обе variables

Неправильное ожидание:

```javascript
const { name: userName } = user;

console.log(name);
```

Правильно:

```javascript
const { name: userName } = user;

console.log(userName);
```

`name` здесь property key, not created variable.

### Ошибка 2. Ожидать, что default value добавит property

```javascript
const config = {};
const { timeout = 5000 } = config;

console.log(config.timeout);
```

`config.timeout` is still `undefined`.

Значение по умолчанию относится к созданной переменной.

### Ошибка 3. Использовать deep nested destructuring там, где страдает читаемость

Слишком плотный pattern сложно читать:

```javascript
const {
  body: {
    data: {
      user: { name }
    }
  }
} = response;
```

Иногда лучше сделать extraction in steps. Optional Chaining будет изучаться в следующей главе.

### Ошибка 4. Забыть, что source object остается тем же

```javascript
const { body } = response;
```

Если `body` is object, variable `body` refers to that object. Destructuring не делает deep copy.

---

## Практическое использование

Destructuring удобно, когда текущий код работает с несколькими selected properties.

### API response

```javascript
const { status, body } = response;
```

Так тест сразу показывает, что важны `status` and `body`.

### Config значения

```javascript
const { baseUrl, timeout = 5000 } = config;
```

Это удобно для setup code.

### Ожидаемые данные пользователя

```javascript
const { name, role } = expectedUser;
```

Код фокусируется on значения required for assertion.

### Payload processing

```javascript
const { email, role } = payload;
```

Так helper clearly selects required payload поля.

---

## Использование в Automation QA

### Extracting status/body from API response

```javascript
const { status, body } = apiResponse;
```

Модель:

```text
apiResponse
│
├── status
└── body
│
▼
variables for assertions
```

### Reading config значения

```javascript
const { baseUrl, retries = 2 } = stagingConfig;
```

Default value помогает задать fallback for local variable, не меняя config object.

### Ожидаемые данные пользователя

```javascript
const { name: expectedName, role: expectedRole } = expectedUser;
```

Renaming makes assertion code clearer:

```text
expectedName
expectedRole
```

### Assertion helpers

Helper может извлечь только нужные поля from response object:

```javascript
const { status, body } = response;
```

Parameter destructuring будет отдельной темой позже. Сейчас мы destructure inside code block.

---

## Диаграммы главы

### 1. Why destructuring exists

```text
Object has many properties
│
▼
current code needs a few
│
▼
destructuring
```

### 2. Object before extraction

```text
response
│
├── status
├── body
└── durationMs
```

### 3. Needed properties

```text
needed now
│
├── status
└── body
```

### 4. Destructuring process

```text
object
│
▼
pattern
│
▼
property values
│
▼
variables
```

### 5. Property matching

```text
{ status }
│
▼
look for property "status"
```

### 6. Variable creation

```text
property value
│
▼
new variable
```

### 7. Default значения

```text
property missing
│
▼
undefined
│
▼
use default
```

### 8. Renaming

```text
name: userName
│     │
│     └── variable
└── property key
```

### 9. Nested object preview

```text
response
│
└── body
    └── name
```

### 10. Текущая модель JavaScript

```text
Objects
│
├── object literals
└── destructuring
```

### 11. QA response object

```text
apiResponse
│
├── status
├── body
└── durationMs
```

### 12. API payload

```text
payload
│
├── name
├── email
└── role
```

### 13. Читаемость

```text
response.status
response.body
response.durationMs
│
▼
const { status, body, durationMs } = response
```

### 14. Типичные ошибки

```text
name: userName
│
└── does not create name variable
```

### 15. Missing property

```text
ask for email
│
▼
object has no email
│
▼
email = undefined
```

### 16. Extraction flow

```text
source
│
▼
lookup
│
▼
value
│
▼
variable
```

### 17. Variable mapping

```text
source key
│
▼
target variable
```

### 18. Object unchanged

```text
before: object with properties
after:  same object with properties
```

### 19. Переход к Optional Chaining

```text
nested property
│
▼
may be missing
│
▼
Optional Chaining
```

### 20. Краткая ментальная модель

```text
open folder
│
▼
select documents
│
▼
place on desk
```

### 21. Complete destructuring model

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
variables
```

### 22. Folder analogy

```text
Folder
│
├── status document
├── body document
└── duration document
```

### 23. Property selection

```text
select
│
├── status
└── body
```

### 24. Object identity unchanged

```text
response -> same object
│
├── before destructuring
└── after destructuring
```

### 25. Existing object vs new variables

```text
existing object
│
▼
new variables
```

### 26. Matching by property name

```text
pattern key
│
▼
object key
│
▼
match
```

### 27. Default value flow

```text
value undefined?
│
├── yes -> default
└── no  -> actual value
```

### 28. QA expected data

```text
expectedUser
│
├── name
└── role
│
▼
expectedName
expectedRole
```

### 29. Extraction timeline

```text
read object
│
▼
match properties
│
▼
create variables
│
▼
continue execution
```

### 30. Итоговая схема

```text
Destructuring
│
├── reads existing object
├── extracts selected values
├── creates variables
└── leaves object unchanged
```

---

## Практика

Практика находится в:

```text
practice/01-javascript/34-destructuring.md
```

Рекомендуемый порядок:

```text
1. Ответить на концептуальные вопросы.
2. Определить extracted variables.
3. Предсказать вывод кода.
4. Запустить examples/01-javascript/chapter-34/.
5. Выполнить debugging tasks.
6. Сделать QA mini-project.
7. Свериться с solutions/01-javascript/34-destructuring.md.
```

---

## Решения

Решения находятся в:

```text
solutions/01-javascript/34-destructuring.md
```

Не открывайте решения до самостоятельной попытки. Главный навык этой главы - видеть, какие значения are extracted and which variables are created.

---

## Итоги

Destructuring продолжает тему Objects.

```text
Objects
│
▼
group related data

Destructuring
│
▼
extract selected values from object
```

Главная модель:

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
object remains unchanged
```

Destructuring не создает новый object. Он создает variables from existing properties.

---

## Что нужно запомнить

* Destructuring извлекает значения from object properties.
* Destructuring создает variables.
* Source object не меняется.
* Object destructuring matches by property name.
* Missing property gives `undefined`.
* Default value applies to created variable, not to source object.
* Renaming syntax `key: variableName` создает `variableName`.
* Nested destructuring exists, but deep patterns can hurt readability.
* Array destructuring, rest properties and parameter destructuring будут изучаться позже.
* В Automation QA destructuring удобно для API responses, configs, payloads and assertions.

---

## Проверьте себя

Ответьте без запуска кода.

1. Какую проблему решает destructuring?
2. Создает ли destructuring новый object?
3. Меняет ли destructuring source object?
4. Как object destructuring выбирает properties?
5. Что будет, если property отсутствует?
6. Когда сработает default value?
7. Что создает `const { name: userName } = user`?
8. Почему destructuring не стоит понимать только как "короткий синтаксис"?
9. Где destructuring полезен в Automation QA?
10. Какая следующая тема логически продолжает destructuring?
