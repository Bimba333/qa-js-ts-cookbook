# Решения: Objects

## 1. Концептуальные вопросы

### 1.1 Какую проблему решает object?

**Ответ:** object позволяет хранить related data together как одну entity with named properties.

**Объяснение:** если `id`, `name`, `role` и `active` описывают одного пользователя, object делает эту связь явной.

**Распространённая ошибка:** думать, что object нужен только для "больших" данных.

**Связь с Automation QA:** test user, API response, config and payload usually are objects.

### 1.2 Почему пять отдельных variables не всегда лучше, чем один object?

**Ответ:** отдельные variables не показывают, что данные принадлежат одной entity.

**Объяснение:** object группирует смысл, а не только значения.

**Распространённая ошибка:** создавать длинные наборы `userName`, `userEmail`, `userRole` вместо `user`.

**Связь с Automation QA:** helpers проще принимать один `testUser`, чем много отдельных arguments.

### 1.3 Что такое property?

**Ответ:** property - named part of an object.

**Объяснение:** property имеет key и value.

**Распространённая ошибка:** называть property только value.

**Связь с Automation QA:** `response.status` and `response.body` are properties of response object.

### 1.4 Что такое key?

**Ответ:** key - имя property.

**Объяснение:** key отвечает на вопрос: "как называется эта часть object?"

**Распространённая ошибка:** путать key `name` и value `'Anna'`.

**Связь с Automation QA:** assertion часто проверяет, что нужные keys есть in API response.

### 1.5 Что такое property value?

**Ответ:** property value - значение, stored in property.

**Объяснение:** в `name: 'Anna'` key is `name`, value is `'Anna'`.

**Распространённая ошибка:** думать, что key and value are both variables.

**Связь с Automation QA:** expected values сравниваются с actual property values.

### 1.6 Почему object лучше понимать как entity?

**Ответ:** потому что design данных зависит от смысла: какие values belong together.

**Объяснение:** фраза "key-value pairs" описывает форму, но не объясняет, почему эти pairs должны быть в одном object.

**Распространённая ошибка:** создавать object без смысловой границы.

**Связь с Automation QA:** `config`, `payload`, `expectedUser` are meaningful entities.

### 1.7 Что делает object literal?

**Ответ:** object literal создает object value.

**Объяснение:** braces with properties produce a new object.

**Распространённая ошибка:** думать, что literal только "формат записи", без создания value.

**Связь с Automation QA:** test data often starts as object literal.

### 1.8 Чем dot notation отличается от bracket notation?

**Ответ:** dot notation использует key, written directly in code. Bracket notation вычисляет expression inside brackets and uses result as key.

**Объяснение:** `user.name` ищет key `"name"`, `user[fieldName]` сначала читает `fieldName`.

**Распространённая ошибка:** писать `user.fieldName`, ожидая value из variable `fieldName`.

**Связь с Automation QA:** dynamic validation fields require bracket notation.

### 1.9 Когда bracket notation required?

**Ответ:** когда key хранится в variable, выбирается dynamically или не может быть записан после dot, например содержит пробел.

**Объяснение:** `response['status code']` works, `response.status code` does not.

**Распространённая ошибка:** использовать dot notation for dynamic key.

**Связь с Automation QA:** validating table fields or API fields by variable key uses bracket notation.

### 1.10 Почему reading missing property returns `undefined`?

**Ответ:** JavaScript не нашел property with requested key and returns `undefined`.

**Объяснение:** missing property - это не syntax error.

**Распространённая ошибка:** считать `undefined` признаком сломанного object literal.

**Связь с Automation QA:** absence of expected field in API response often appears as `undefined`.

---

## 2. Определите properties, keys and values

### 2.1

**Ответ:**

* object variable: `user`;
* keys: `id`, `name`, `role`;
* values: `101`, `'Anna'`, `'admin'`.

**Объяснение:** каждая строка inside object literal describes one property.

**Распространённая ошибка:** считать `user` property key. `user` is variable name.

**Связь с Automation QA:** user object can represent expected profile.

### 2.2

**Ответ:**

* object variable: `config`;
* keys: `baseUrl`, `timeout`, `retries`;
* values: `'https://api.example.test'`, `5000`, `2`.

**Объяснение:** config groups environment settings.

**Распространённая ошибка:** хранить config values в несвязанных variables.

**Связь с Automation QA:** configuration objects are used across API and UI tests.

### 2.3

**Ответ:**

* object variable: `response`;
* keys: `status`, `ok`, `error`;
* values: `200`, `true`, `null`.

**Объяснение:** `null` здесь тоже property value.

**Распространённая ошибка:** игнорировать properties with `null`.

**Связь с Automation QA:** `error: null` often means operation succeeded without error details.

---

## 3. Reading properties

### 3.1

**Ответ:**

```text
Anna
admin
```

**Объяснение:** `user.name` reads value of key `name`; `user.role` reads value of key `role`.

**Распространённая ошибка:** путать property access with variable access.

**Связь с Automation QA:** так читаются fields from expected test user.

### 3.2

**Ответ:**

```text
https://api.example.test
undefined
```

**Объяснение:** `baseUrl` exists, `retries` does not exist in this object.

**Распространённая ошибка:** ожидать runtime error for missing property.

**Связь с Automation QA:** missing config property often becomes `undefined`.

### 3.3

**Ответ:**

```text
200
Anna
```

**Объяснение:** `response.body` is object, then `.name` reads its property.

**Распространённая ошибка:** забыть, что nested object тоже имеет properties.

**Связь с Automation QA:** API response body often contains nested data.

---

## 4. Dot notation или bracket notation

### 4.1

**Ответ:**

```javascript
console.log(user.name);
```

**Объяснение:** key `name` known in advance and can be written after dot.

**Распространённая ошибка:** использовать bracket notation без необходимости. Это не ошибка, но dot notation читабельнее.

**Связь с Automation QA:** fixed response fields usually read through dot notation.

### 4.2

**Ответ:**

```javascript
console.log(user[fieldName]);
```

**Объяснение:** key is stored in variable `fieldName`.

**Распространённая ошибка:** `user.fieldName` looks for key literally named `"fieldName"`.

**Связь с Automation QA:** dynamic field validation uses this pattern.

### 4.3

**Ответ:**

```javascript
console.log(response['status code']);
```

**Объяснение:** key contains a space, so dot notation cannot express it.

**Распространённая ошибка:** писать invalid syntax `response.status code`.

**Связь с Automation QA:** external data sometimes has keys that are not convenient JavaScript identifiers.

### 4.4

**Ответ:** bracket notation required when key is dynamic or cannot be written with dot notation.

**Объяснение:** brackets allow expression-based key access.

**Распространённая ошибка:** считать bracket notation just alternative style. Иногда это requirement.

**Связь с Automation QA:** API fields, table columns and config keys can be selected dynamically.

---

## 5. Adding, updating, deleting

### 5.1

**Ответ:** итоговый object:

```javascript
{
  name: 'Anna',
  role: 'owner',
  email: 'anna@example.test'
}
```

**Объяснение:** `role` existed and was updated. `email` did not exist and was added.

**Распространённая ошибка:** считать any assignment as only update. It can add property too.

**Связь с Automation QA:** test data may be extended with fields before request.

### 5.2

**Ответ:**

```text
undefined
```

Then object no longer has `retries`:

```javascript
{
  baseUrl: 'https://api.example.test',
  timeout: 5000
}
```

**Объяснение:** `delete config.retries` removes property. Reading it later returns `undefined`.

**Распространённая ошибка:** думать, что `delete` assigns `undefined`.

**Связь с Automation QA:** service fields can be removed before comparing public expected data.

---

## 6. Предскажите результат выполнения

### 6.1

**Ответ:**

```text
Anna
undefined
```

**Объяснение:** `name` exists; `email` does not.

**Распространённая ошибка:** ожидать error for missing property.

**Связь с Automation QA:** missing response fields often show up as `undefined`.

### 6.2

**Ответ:**

```text
undefined
201
```

**Объяснение:** `response.key` searches property literally named `key`. `response[key]` reads variable `key`, gets `'status'`, then reads `response.status`.

**Распространённая ошибка:** confuse dot notation and bracket notation.

**Связь с Automation QA:** dynamic assertion field names require bracket notation.

### 6.3

**Ответ:**

```text
Kate
admin
```

**Объяснение:** `role` was added, `name` was updated.

**Распространённая ошибка:** forget that object properties can be changed even when object variable is `const`.

**Связь с Automation QA:** request payload can be prepared step by step.

### 6.4

**Ответ:**

```text
false
```

**Объяснение:** two object literals create two different objects even if properties look the same.

**Распространённая ошибка:** compare objects by `===` expecting structural equality.

**Связь с Automation QA:** object equality in assertions requires framework-specific matchers, studied later.

---

## 7. Debugging tasks

### 7.1

**Проблема:** `user.fieldName` looks for key `"fieldName"`.

Исправление:

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};

const fieldName = 'role';

console.log(user[fieldName]);
```

**Объяснение:** key is stored in variable, so bracket notation is required.

**Распространённая ошибка:** use dot notation for dynamic key.

**Связь с Automation QA:** reusable field validators often receive field name as argument.

### 7.2

**Проблема:** `response.status code` is invalid syntax.

Исправление:

```javascript
const response = {
  'status code': 200
};

console.log(response['status code']);
```

**Объяснение:** key contains a space.

**Распространённая ошибка:** trying to force dot notation for non-identifier keys.

**Связь с Automation QA:** some external payloads use keys inconvenient for dot notation.

### 7.3

**Проблема:** output happens before adding `timeout`.

Исправление:

```javascript
const config = {
  baseUrl: 'https://api.example.test'
};

config.timeout = 5000;

console.log(config.timeout);
```

**Объяснение:** property must exist before reading if expected value is required.

**Распространённая ошибка:** read before write.

**Связь с Automation QA:** setup order matters when preparing config objects.

---

## 8. QA-oriented tasks

### 8.1

```javascript
const testUser = {
  name: 'Anna',
  email: 'anna@example.test',
  role: 'admin',
  active: true
};

console.log(testUser.name);
console.log(testUser.role);
```

**Объяснение:** all user-related data is grouped inside one object.

**Распространённая ошибка:** split user data into unrelated variables.

**Связь с Automation QA:** test user objects are passed into setup helpers.

### 8.2

```javascript
const stagingConfig = {
  baseUrl: 'https://staging.example.test',
  timeout: 5000,
  retries: 2
};

stagingConfig.timeout = 7000;
stagingConfig.environment = 'staging';

console.log(stagingConfig);
```

**Объяснение:** `timeout` is updated; `environment` is added.

**Распространённая ошибка:** think `const` prevents property updates.

**Связь с Automation QA:** config objects often evolve during setup.

### 8.3

```javascript
const apiResponse = {
  status: 200,
  ok: true,
  body: {
    id: 101,
    name: 'Anna',
    role: 'admin'
  }
};

console.log(apiResponse.status);
console.log(apiResponse.body.name);
console.log(apiResponse.body.role);
```

**Объяснение:** response groups status and body; body groups user data.

**Распространённая ошибка:** flatten all response fields into separate variables.

**Связь с Automation QA:** this mirrors many REST API responses.

### 8.4

```javascript
const actualUser = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  internalToken: 'secret'
};

delete actualUser.internalToken;

console.log(actualUser);
```

**Объяснение:** service field removed before comparison.

**Распространённая ошибка:** set `internalToken = undefined` and assume property is absent.

**Связь с Automation QA:** API responses often contain fields that should be ignored in public assertions.

---

## 9. Мини-проект

Один из возможных вариантов:

```javascript
const requestPayload = {
  name: 'Anna',
  email: 'anna@example.test',
  role: 'admin'
};

const expectedUser = {
  name: 'Anna',
  email: 'anna@example.test',
  role: 'admin',
  active: true
};

const apiResponse = {
  status: 201,
  body: {
    id: 101,
    name: 'Anna',
    email: 'anna@example.test',
    role: 'admin',
    active: true,
    internalToken: 'secret'
  }
};

console.log(requestPayload.name);
console.log(expectedUser.role);
console.log(apiResponse.status);
console.log(apiResponse.body.email);

const fieldName = 'role';
console.log(apiResponse.body[fieldName]);

apiResponse.body.checkedAt = '2026-06-26';
apiResponse.body.role = 'owner';

delete apiResponse.body.internalToken;

console.log(apiResponse.body);
```

**Объяснение:** request, expected data and actual response are separate entities. Objects make that structure visible.

**Распространённая ошибка:** store `requestName`, `expectedName`, `actualName`, `actualRole` as scattered variables.

**Связь с Automation QA:** this mirrors realistic API test preparation.

**Возможное улучшение:** later, destructuring can make extracting `status` and `body` more concise.

---

## 10. Контрольные вопросы

1. Object лучше выражает entity.
2. If key exists, assignment updates property value.
3. If key is absent, assignment adds new property.
4. `delete object.key` removes property on базовом уровне.
5. `object[fieldName]` uses value of variable; `object.fieldName` looks for key `"fieldName"`.
6. Objects важны для API testing, потому что responses, payloads and expected data are grouped structures.
7. Следующая тема - Destructuring, потому что после создания object возникает вопрос, как удобно extracting values from it.

**Общий вывод:** object is one entity with many named properties. Syntax matters, but grouping is the main idea.
