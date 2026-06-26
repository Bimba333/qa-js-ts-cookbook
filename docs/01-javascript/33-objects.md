# Objects

## Связь с предыдущей главой

Предыдущая глава завершила блок Functions и объяснила `bind()`.

Главная модель была такой:

```text
bind()
│
├── chooses receiver
└── creates function for later invocation
```

В главах про `this`, `call()`, `apply()` и `bind()` мы постоянно видели objects:

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test'
};
```

Там object был нужен как receiver:

```text
apiClient
│
└── receiver for method invocation
```

Теперь мы начинаем новый раздел и возвращаемся к objects как к самостоятельной теме.

Главный вопрос этой главы:

> Как хранить related data together?

Не как десять отдельных variables.

А как одну entity:

```text
Object
│
▼
one entity
│
▼
many named properties
```

---

## Предварительные требования

Для этой главы нужно понимать:

* что primitive value представляет одно indivisible value;
* что variable дает named access к value;
* что `const` запрещает reassignment identifier;
* что function object тоже относится к object values;
* что `this` часто указывает на receiver object;
* что dot notation уже встречалась в `object.method()`;
* что references объясняют shared object behavior на концептуальном уровне.

Не требуется знать prototypes, descriptors, classes, `Object.create()`, `Object.assign()`, destructuring, optional chaining, property attributes или JSON. Эти темы будут изучаться позже.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            130-160 минут
Разбор схем:             55-75 минут
Запуск примеров:         20-30 минут
Практика:                110-140 минут
Повторение материала:    30 минут
```

Уровень сложности: **L3**.

Синтаксис object literal выглядит простым. Но правильная модель objects важна для всего, что будет дальше: destructuring, optional chaining, object methods, prototypes, classes, API testing and framework configuration.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/32-bind.md
```

Текущая глава:

```text
docs/01-javascript/33-objects.md
```

Следующая глава:

```text
docs/01-javascript/34-destructuring.md
```

Следующая глава ответит:

> Как удобно извлекать values из object?

---

## Цели обучения

После изучения этой главы вы будете понимать:

* зачем objects существуют;
* почему grouping related data делает код понятнее;
* что object literal создает object value;
* что property состоит из key и value;
* как читать properties через dot notation;
* когда нужна bracket notation;
* как добавлять properties;
* как обновлять properties;
* как удалять properties на базовом уровне;
* почему object не стоит описывать только как "key-value pairs";
* как objects используются в Automation QA;
* какие ошибки чаще всего возникают при работе с objects.

---

## Мотивация

Начнем с проблемы.

Допустим, тест проверяет пользователя:

```javascript
const userId = 101;
const userName = 'Anna';
const userRole = 'admin';
const userActive = true;
const userEmail = 'anna@example.test';
```

Каждая variable понятна отдельно.

Но программа пока не говорит главного:

```text
userId
userName
userRole
userActive
userEmail
│
▼
all describe one user
```

Данные связаны, но связь выражена только в голове читателя.

Проблема:

```text
Separate variables
│
├── userId
├── userName
├── userRole
├── userActive
└── userEmail

Question
│
└── Where is the user?
```

Object позволяет выразить эту связь явно:

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  active: true,
  email: 'anna@example.test'
};
```

Теперь в коде есть одна entity:

```text
user
│
├── id:     101
├── name:   'Anna'
├── role:   'admin'
├── active: true
└── email:  'anna@example.test'
```

Главное изменение:

```text
many related variables
│
▼
one object
│
▼
many named properties
```

Для Automation QA это не абстрактная тема. API responses, request payloads, user profiles, configuration objects and expected data almost always are objects.

---

## Теория

Не начинаем с определения. Сначала сформулируем проблему.

Если данные описывают одну сущность, они должны быть сгруппированы:

```text
User profile
│
├── identity
├── contact data
├── role
└── state
```

Object решает эту задачу:

```text
Object
│
▼
one entity
│
▼
named parts of information
```

### Почему objects существуют

Primitive values хороши для отдельных значений:

```javascript
const statusCode = 200;
const isActive = true;
const environment = 'staging';
```

Но программа редко работает только с одним isolated value.

В реальном коде values образуют смысловые группы:

```text
API response
│
├── status
├── body
└── headers

Test user
│
├── name
├── role
└── active

Configuration
│
├── baseUrl
├── timeout
└── retries
```

Object нужен, чтобы такая группа стала одним value.

Важно:

```text
Object is not just syntax
│
▼
Object expresses relationship between values
```

### Object literal

Object literal - это способ создать object value прямо в коде:

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};
```

Модель:

```text
object literal
│
▼
creates object value
│
▼
variable user refers to that object
```

В этой главе мы используем references только на высоком уровне. Подробности уже были в главе `References`.

### Property

Object состоит из properties.

Property - это named part of an object.

```text
user
│
├── id property
├── name property
└── role property
```

Каждая property имеет:

```text
Property
│
├── key
└── value
```

Пример:

```javascript
const user = {
  name: 'Anna'
};
```

Здесь:

```text
key   -> name
value -> 'Anna'
```

Не стоит сводить object только к фразе "key-value pairs". Такая фраза полезна, но неполна. Для чтения кода важнее видеть object как одну entity with named properties.

### Keys

Key - это имя property.

```javascript
const response = {
  status: 200,
  ok: true
};
```

Keys:

```text
response
│
├── status
└── ok
```

Key отвечает на вопрос:

> Как называется эта часть object?

### Values

Value - это информация, stored in property.

```text
response.status -> 200
response.ok     -> true
```

Values могут быть разными:

```javascript
const testResult = {
  name: 'login test',
  passed: true,
  durationMs: 340,
  error: null
};
```

На этом уровне достаточно понимать:

```text
Property value
│
└── any JavaScript value
```

Подробные главы про nested objects, arrays and methods будут позже.

### Dot notation

Dot notation используется, когда property key известен заранее и является обычным identifier-like name:

```javascript
console.log(user.name);
```

Модель:

```text
user.name
│
├── find object referred by user
├── look for property "name"
└── read its value
```

Dot notation хорошо читается:

```javascript
console.log(response.status);
console.log(response.ok);
console.log(config.baseUrl);
```

### Bracket notation

Bracket notation используется, когда key:

* хранится в variable;
* содержит пробел или символы, которые нельзя написать после dot;
* выбирается dynamically.

Пример с dynamic key:

```javascript
const fieldName = 'role';

console.log(user[fieldName]);
```

Модель:

```text
user[fieldName]
│
├── read fieldName -> 'role'
├── look for property 'role'
└── return value
```

Bracket notation required:

```javascript
const response = {
  'status code': 200
};

console.log(response['status code']);
```

Такой key нельзя прочитать через `response.status code`.

### Reading properties

Reading property не меняет object.

```javascript
const role = user.role;
```

Модель:

```text
user
│
├── role: 'admin'
│
▼
read role
│
▼
'admin'
```

Если property отсутствует, результатом будет `undefined`:

```javascript
console.log(user.permissions);
```

На этом этапе важно не пугаться:

```text
Missing property
│
▼
undefined
```

Optional Chaining будет изучаться позже. Он помогает безопаснее читать вложенные свойства, но сейчас мы не вводим эту тему.

### Adding properties

Object можно расширить, добавив новую property:

```javascript
user.lastLogin = '2026-06-26';
```

Модель:

```text
Before
│
└── user has no lastLogin

Write
│
└── user.lastLogin = '2026-06-26'

After
│
└── user has lastLogin property
```

### Updating properties

Если property уже существует, assignment обновляет ее value:

```javascript
user.role = 'owner';
```

Модель:

```text
Before
│
└── role: 'admin'

Update
│
└── role = 'owner'

After
│
└── role: 'owner'
```

### Deleting properties

`delete` удаляет property из object на базовом уровне:

```javascript
delete user.lastLogin;
```

Модель:

```text
Before
│
└── lastLogin exists

delete
│
└── remove property

After
│
└── lastLogin is absent
```

Мы не разбираем property descriptors and attributes. Они объясняют, почему не каждую property всегда можно удалить. Это будущая глава.

### Object lifecycle

Базовый lifecycle object в этой главе:

```text
create object
│
▼
read properties
│
▼
add properties
│
▼
update properties
│
▼
delete properties when needed
```

Это не lifecycle memory management. Garbage Collector будет изучаться позже.

---

## Внутренний механизм

Спросим вопрос главы:

> Why is grouping useful?

Когда engine видит object literal:

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};
```

Концептуально происходит следующее:

```text
Object literal
│
▼
create object value
│
▼
create properties
│
├── id
│
├── name
│
└── role
│
▼
user refers to object
```

### Reading flow

```javascript
user.name;
```

Engine делает:

```text
read identifier user
│
▼
get object value
│
▼
look for property key "name"
│
▼
return property value
```

### Writing flow

```javascript
user.role = 'owner';
```

Engine делает:

```text
read identifier user
│
▼
get object value
│
▼
find or create property "role"
│
▼
store new value
```

Если property существовала, value обновляется.

Если property не существовала, property добавляется.

### Dot notation flow

```javascript
user.email;
```

```text
dot notation
│
▼
property key is written in code
│
▼
"email"
```

### Bracket notation flow

```javascript
const key = 'email';

user[key];
```

```text
bracket notation
│
▼
evaluate expression inside brackets
│
▼
key -> 'email'
│
▼
use 'email' as property key
```

### Memory intuition

На высоком уровне:

```text
variable user
│
▼
refers to object value
│
▼
object contains named properties
```

Это только intuition. В этой главе мы не рисуем precise engine implementation, property attributes, hidden classes or optimization details.

### Property lookup

В этой главе property lookup означает простой вопрос:

> Есть ли у этого object property с таким key?

```text
object
│
├── key exists
│   └── return value
│
└── key does not exist
    └── return undefined
```

Prototype Chain тоже участвует в property lookup, но это будущая глава. Сейчас мы говорим только о собственных, очевидных properties object literal.

### Object identity preview

Object identity уже встречалась в главах про References и Equality.

Здесь достаточно напомнить:

```text
Two objects with same properties
│
▼
can still be different objects
```

Пример:

```javascript
const firstUser = { id: 101 };
const secondUser = { id: 101 };

console.log(firstUser === secondUser);
```

Результат:

```text
false
```

Подробно object comparison уже рассматривался в `Equality`, а более глубокие модели будут возвращаться в будущих главах.

---

## Ментальная модель

Object удобно представлять как profile card.

```text
Profile card: user
│
├── id: 101
├── name: Anna
├── role: admin
└── active: true
```

Одна карточка описывает одну entity.

Другая модель: folder.

```text
Folder: test user
│
├── document: id
├── document: name
├── document: role
└── document: active
```

Еще одна модель: cabinet with labeled boxes.

```text
Cabinet: config
│
├── box "baseUrl"
├── box "timeout"
└── box "retries"
```

Важное ограничение моделей:

```text
These models explain grouping
│
▼
they do not describe exact engine storage
```

Главная модель:

```text
Object
│
▼
one entity
│
▼
many named properties
```

---

## Примеры кода

Примеры находятся в:

```text
examples/chapter-36/
```

Запуск:

```bash
node examples/chapter-36/01-object-literal.js
node examples/chapter-36/02-read-properties.js
node examples/chapter-36/03-update-properties.js
node examples/chapter-36/04-bracket-notation.js
node examples/chapter-36/05-common-mistakes.js
node examples/chapter-36/06-qa-example.js
```

### Пример 1. Object literal

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  active: true
};

console.log(user);
```

Object literal группирует related data.

### Пример 2. Read properties

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  active: true
};

console.log(user.name);
console.log(user.role);
```

Dot notation читает properties by key.

### Пример 3. Update properties

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  active: true
};

user.role = 'owner';
user.lastLogin = '2026-06-26';

console.log(user.role);
console.log(user.lastLogin);
```

Assignment может обновлять существующую property или добавлять новую.

### Пример 4. Bracket notation

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  'last login': '2026-06-26'
};

const fieldName = 'role';

console.log(user[fieldName]);
console.log(user['last login']);
```

Bracket notation нужна для dynamic keys and keys that cannot be written after dot.

### Пример 5. Common mistakes

```javascript
const user = {
  id: 101,
  name: 'Anna'
};

console.log(user.email);

user.email = 'anna@example.test';

console.log(user.email);
```

Missing property дает `undefined`. После adding property value доступно.

### Пример 6. QA example

```javascript
const apiResponse = {
  status: 200,
  body: {
    id: 101,
    name: 'Anna',
    role: 'admin'
  }
};

const expectedUser = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};

console.log(apiResponse.status);
console.log(apiResponse.body.name);
console.log(expectedUser.role);
```

Nested object показан только conceptually. Подробная работа с вложенными structures будет развиваться дальше.

---

## Частые вопросы

### Object - это просто key-value pairs?

Это полезное короткое описание, но недостаточное.

Лучше думать так:

```text
Object
│
▼
one entity
│
▼
many named properties
```

Key-value view помогает читать property. Entity view помогает проектировать данные.

### Почему `const user = {}` позволяет менять `user.name`?

`const` запрещает reassignment identifier.

```text
const user
│
└── cannot point to another value
```

Но object properties можно изменять:

```text
user.name
│
└── property inside object can be updated
```

Object freezing будет изучаться позже.

### Что будет, если property отсутствует?

Reading missing property returns `undefined`.

```text
object has no key
│
▼
undefined
```

### Когда нужна bracket notation?

Bracket notation нужна, когда key выбирается dynamically или не может быть записан через dot notation.

```javascript
const key = 'status';

response[key];
```

### Можно ли удалять properties?

Да, через `delete`, но в этой главе мы рассматриваем только базовую модель. Подробности property descriptors будут позже.

---

## Распространенные мифы

### Миф: object нужен только для больших данных

Реальность:

Object нужен там, где есть related data.

```text
Even three related values
│
▼
can justify object
```

### Миф: dot notation и bracket notation делают разные вещи

Реальность:

Обе формы читают property by key. Разница в том, как key задается.

```text
dot
│
└── key written directly

bracket
│
└── key comes from expression
```

### Миф: `delete` присваивает `undefined`

Реальность:

`delete` удаляет property.

```text
property exists with undefined
│
≠
property does not exist
```

Подробные способы проверять наличие property будут изучаться позже.

---

## Типичные ошибки

### Ошибка 1. Хранить related data в отдельных variables

Неправильно:

```javascript
const baseUrl = 'https://api.example.test';
const timeout = 5000;
const retries = 2;
```

Если это одна configuration, лучше сгруппировать:

```javascript
const config = {
  baseUrl: 'https://api.example.test',
  timeout: 5000,
  retries: 2
};
```

### Ошибка 2. Использовать dot notation для dynamic key

Неправильно:

```javascript
const fieldName = 'role';

console.log(user.fieldName);
```

Что произошло:

```text
user.fieldName
│
└── looks for key "fieldName"
```

Исправление:

```javascript
console.log(user[fieldName]);
```

### Ошибка 3. Думать, что missing property - это ошибка syntax

```javascript
console.log(user.email);
```

Если `email` отсутствует, результат `undefined`.

Это runtime result, а не syntax error.

### Ошибка 4. Путать updating и adding

```javascript
user.role = 'owner';
user.email = 'anna@example.test';
```

Если `role` существовал, он обновился.

Если `email` не существовал, он был добавлен.

### Ошибка 5. Удалять property там, где лучше создать новый object

В тестовых данных иногда лучше явно создать нужный expected object, чем сначала создать лишнее поле и удалить его.

```text
clear test data
│
▼
better assertions
```

Immutable patterns будут изучаться позже.

---

## Практическое использование

Objects используются каждый раз, когда нужно выразить entity.

### Configuration object

```javascript
const config = {
  baseUrl: 'https://api.example.test',
  timeout: 5000,
  retries: 2
};
```

Модель:

```text
config
│
├── baseUrl
├── timeout
└── retries
```

### User profile

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  active: true
};
```

### Request payload

```javascript
const createUserPayload = {
  name: 'Anna',
  role: 'admin',
  active: true
};
```

### Expected result

```javascript
const expectedUser = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};
```

Главный практический вопрос:

> Какие values принадлежат одной entity?

Если ответ ясен, object часто делает код лучше.

---

## Использование в Automation QA

Automation QA код почти невозможно писать без objects.

### API response objects

Response часто выглядит как object:

```javascript
const response = {
  status: 200,
  body: {
    id: 101,
    name: 'Anna'
  }
};
```

Даже если реальный response приходит из HTTP client, в тесте вы обычно работаете с object-like structure.

### Test data objects

```javascript
const testUser = {
  name: 'Anna',
  email: 'anna@example.test',
  role: 'admin'
};
```

Такой object легче передавать в helpers, чем набор отдельных arguments.

### User profiles

```text
User profile
│
├── identity
├── credentials
├── role
└── state
```

В тестах профили часто становятся fixtures. Fixtures будут подробно изучаться в Automation QA части курса.

### Configuration objects

```javascript
const stagingConfig = {
  baseUrl: 'https://staging.example.test',
  timeout: 5000,
  retries: 2
};
```

Configuration object делает setup читаемым:

```text
one environment
│
▼
one config object
```

### Request payloads

```javascript
const payload = {
  name: 'Anna',
  role: 'admin'
};
```

Payload как object помогает явно видеть, что отправляется в API.

### Expected vs actual structure

```text
expectedUser
│
└── what test expects

actualUser
│
└── what API returned
```

Чем яснее object structure, тем проще писать assertions.

---

## Диаграммы главы

### 1. Why objects exist

```text
Related data
│
▼
needs one entity
│
▼
Object
```

### 2. Separate variables

```text
userId
userName
userRole
userActive
│
▼
many names, hidden relationship
```

### 3. Grouped data

```text
user
│
├── id
├── name
├── role
└── active
```

### 4. Object literal

```text
{
  key: value
}
│
▼
object value
```

### 5. Property structure

```text
Property
│
├── key
└── value
```

### 6. Keys and values

```text
name: 'Anna'
│     │
│     └── value
└── key
```

### 7. Reading property

```text
user.name
│
▼
read property "name"
│
▼
'Anna'
```

### 8. Writing property

```text
user.email = value
│
▼
write value into property
```

### 9. Updating property

```text
role: 'admin'
│
▼
role = 'owner'
│
▼
role: 'owner'
```

### 10. Deleting property

```text
property exists
│
▼
delete property
│
▼
property absent
```

### 11. Dot notation

```text
object.key
│
└── key written directly
```

### 12. Bracket notation

```text
object[expression]
│
└── expression produces key
```

### 13. Current JavaScript model

```text
Values
│
├── Primitive values
└── Object values
    │
    └── Objects section begins here
```

### 14. QA test data object

```text
testUser
│
├── name
├── email
└── role
```

### 15. API response object

```text
response
│
├── status
├── headers
└── body
```

### 16. Object lifecycle

```text
create
│
▼
read
│
▼
write
│
▼
update
│
▼
delete
```

### 17. Readability

```text
many related variables
│
▼
reader reconstructs entity

one object
│
▼
entity is explicit
```

### 18. Common mistakes

```text
user.fieldName
│
└── key is literally "fieldName"

user[fieldName]
│
└── key comes from variable
```

### 19. Memory intuition

```text
variable
│
▼
refers to object
│
▼
object has properties
```

### 20. Property lookup

```text
look for key
│
├── found -> value
└── absent -> undefined
```

### 21. Object identity preview

```text
{ id: 101 }
│
≠
{ id: 101 }
```

### 22. Bridge to Destructuring

```text
object has properties
│
▼
need convenient extraction
│
▼
Destructuring
```

### 23. Bridge to Optional Chaining

```text
nested object
│
▼
property may be absent
│
▼
Optional Chaining later
```

### 24. Complete object model

```text
Object
│
├── key: value
├── key: value
└── key: value
```

### 25. Mental model summary

```text
folder
│
▼
profile card
│
▼
labeled boxes
```

### 26. Object as profile

```text
Profile: Anna
│
├── id
├── email
└── role
```

### 27. Object as folder

```text
Folder: API test
│
├── request data
├── expected data
└── config data
```

### 28. Property access flow

```text
identifier
│
▼
object
│
▼
key
│
▼
value
```

### 29. Object evolution

```text
initial object
│
▼
add property
│
▼
update property
│
▼
delete property
```

### 30. Summary diagram

```text
Object
│
▼
one entity
│
▼
many named properties
│
▼
clearer program structure
```

---

## Практика

Практика находится в:

```text
practice/chapter-36.md
```

Рекомендуемый порядок:

```text
1. Ответить на концептуальные вопросы.
2. Определить properties, keys and values.
3. Предсказать вывод кода.
4. Запустить examples/chapter-36/.
5. Выполнить debugging tasks.
6. Сделать QA mini-project.
7. Свериться с solutions/chapter-36.md.
```

---

## Решения

Решения находятся в:

```text
solutions/chapter-36.md
```

Не открывайте решения до самостоятельной попытки. В этой теме важно не просто знать syntax, а уметь видеть:

```text
which data belongs together
```

---

## Итоги

Эта глава начала раздел Objects.

Главная модель:

```text
Object
│
▼
one entity
│
▼
many named properties
```

Objects нужны не потому, что JavaScript любит braces.

Objects нужны, потому что реальные программы работают с grouped information:

```text
user
config
response
payload
expected data
```

В этой главе мы изучили:

* object literals;
* properties;
* keys and values;
* reading properties;
* adding properties;
* updating properties;
* deleting properties;
* dot notation;
* bracket notation;
* QA use cases.

Следующая глава объяснит Destructuring:

```text
object has properties
│
▼
need convenient extraction
│
▼
destructuring
```

---

## Что нужно запомнить

* Object группирует related data.
* Object лучше понимать как одну entity with named properties.
* Property состоит из key и value.
* Object literal создает object value.
* Dot notation удобна для заранее известного key.
* Bracket notation нужна для dynamic keys и keys со специальными символами.
* Reading missing property returns `undefined`.
* Assignment может add or update property.
* `delete` удаляет property на базовом уровне.
* В Automation QA objects используются для API responses, request payloads, test data and configuration.
* Prototypes, descriptors, classes and JSON будут изучаться позже.

---

## Quick Check

Ответьте без запуска кода.

1. Почему objects существуют?
2. Почему object не стоит определять только как "key-value pairs"?
3. Что такое property?
4. Чем key отличается от value?
5. Что делает object literal?
6. Когда удобна dot notation?
7. Когда bracket notation required?
8. Что возвращает reading missing property?
9. Чем adding property отличается от updating property?
10. Как objects используются в Automation QA?
