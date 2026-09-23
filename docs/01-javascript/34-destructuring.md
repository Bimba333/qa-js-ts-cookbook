# Destructuring

## Связь с предыдущей главой

Предыдущая глава начала раздел Objects.

Главная модель была такой: объект группирует связанные значения и даёт доступ к ним по ключу.

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

Destructuring отвечает на этот вопрос.

Главная модель главы: destructuring извлекает значения из объекта и сразу связывает их с именами.

Важно сразу:

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
const { status, body } = response;
       └─── имена совпадают с ключами ───┘
```

Что важно:

```text
response remains the same object
```

Destructuring не "разбирает" object физически и не создает новый object. Он создает variables from existing property значения.

---

## Теория

Destructuring нужен, когда object содержит много named properties, а текущему участку кода нужны только некоторые из них.

### Object destructuring syntax

Базовая форма:

```javascript
const { name, role } = user;
```

Это означает:

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
const { name } = user;   →  name получает значение user.name
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

### Missing property

Если property отсутствует, variable получит `undefined`:

```javascript
const { email } = user;

console.log(email);
```

Модель:

```text
свойства нет  →  переменная получает undefined
```

Это продолжает правило из предыдущей главы: обращение к несуществующему свойству даёт `undefined`, а не ошибку.

### Default значения

Default value используется, если extracted value is `undefined`:

```javascript
const { role = 'guest' } = user;
```

Модель:

```text
const { role = 'guest' } = user;
       значение по умолчанию сработает только при undefined
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

### Renaming variables

Иногда property key не подходит как local variable name.

Например, object has `name`, но в коде лучше `userName`:

```javascript
const { name: userName } = user;
```

Модель:

```text
const { name: userName } = user;
              └── новое имя переменной
```

Важно:

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
объект  →  извлечь нужные поля  →  отдельные имена
```

В этой главе nested destructuring только preview. Deep nested patterns can become hard to read, and optional chaining will be studied next.

### Object remains unchanged

Это центральное правило.

```javascript
const { name } = user;
```

После этой строки:

Destructuring:

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

### Variable mapping

```javascript
const { name: userName } = user;
```

Сопоставление:

### Default value flow

```javascript
const { timeout = 5000 } = config;
```

Концептуально:

### Existing object vs new variables

Очень важно отделить source object от created variables:

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

Это важно для понимания тестовых данных. Destructuring не делает защитную копию object.

---

## Ментальная модель

Представьте folder с документами:

Destructuring - это не создание новой папки.

Это выбор нужных documents:

Еще одна модель: profile card.

Destructuring:

Главная модель:

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

Source object остается тем же.

### Destructuring меняет object?

Нет.

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

---

## Распространённые мифы

### Миф: destructuring - это просто короткий синтаксис

Реальность:

Destructuring выражает намерение:

Краткость - следствие, но не главная идея.

### Миф: destructuring удаляет properties из object

Реальность:

Object остается unchanged.

### Миф: destructuring создает новый object

Реальность:

Создаются variables, not a new object.

### Миф: порядок properties определяет matching

Реальность:

Object destructuring matches by property name.

---

## Распространённые ошибки

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
const { status, body } = apiResponse;
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

### 2. Object before extraction

### 3. Needed properties

### 4. Destructuring process

### 5. Property matching

### 6. Variable creation

### 7. Default значения

### 8. Renaming

### 9. Nested object preview

### 10. Текущая модель JavaScript

### 11. QA response object

### 12. API payload

### 13. Читаемость

### 14. Типичные ошибки

### 15. Missing property

### 16. Extraction flow

### 17. Variable mapping

### 18. Object unchanged

```text
before: object with properties
after:  same object with properties
```

### 19. Переход к Optional Chaining

### 20. Краткая ментальная модель

### 21. Complete destructuring model

### 22. Folder analogy

### 23. Property selection

### 24. Object identity unchanged

### 25. Existing object vs new variables

### 26. Matching by property name

### 27. Default value flow

### 28. QA expected data

### 29. Extraction timeline

### 30. Итоговая схема

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

Главная модель: destructuring — это способ назвать нужные части объекта в одну строку вместо серии обращений.

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
