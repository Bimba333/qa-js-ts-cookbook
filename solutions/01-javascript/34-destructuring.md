# Решения: Destructuring

## 1. Концептуальные вопросы

### 1.1 Какую проблему решает object destructuring?

**Ответ:** destructuring позволяет удобно извлекать selected property values из object into variables.

**Объяснение:** вместо повторения `response.status`, `response.body`, `response.durationMs` можно явно указать, какие properties нужны.

**Распространённая ошибка:** считать destructuring только сокращением записи.

**Связь с Automation QA:** API response часто содержит много fields, а тесту нужны только несколько.

### 1.2 Почему это не только "короткий синтаксис"?

**Ответ:** destructuring выражает намерение: взять конкретные values from object.

**Объяснение:** code reader сразу видит selected properties.

**Распространённая ошибка:** применять destructuring везде, даже когда оно ухудшает readability.

**Связь с Automation QA:** helper becomes clearer when it extracts only assertion-related fields.

### 1.3 Что именно создает destructuring?

**Ответ:** variables.

**Объяснение:** source object already exists; destructuring reads properties and creates variables.

**Распространённая ошибка:** думать, что создается новый object.

**Связь с Automation QA:** destructuring does not clone response or payload.

### 1.4 Does destructuring change the object?

**Ответ:** нет.

**Объяснение:** destructuring reads property values. It does not add, update or delete properties.

**Распространённая ошибка:** ожидать, что extracted property исчезнет from object.

**Связь с Automation QA:** `apiResponse` remains available for later assertions.

### 1.5 Как происходит matching?

**Ответ:** by property name.

**Объяснение:** `const { role } = user` asks for property key `"role"`.

**Распространённая ошибка:** думать, что matching идет по позиции.

**Связь с Automation QA:** order of response fields does not matter for object destructuring.

### 1.6 Что будет, если property отсутствует?

**Ответ:** created variable gets `undefined`, unless default value is provided.

**Объяснение:** this follows normal missing property reading behavior.

**Распространённая ошибка:** ожидать syntax error.

**Связь с Automation QA:** missing API field can become `undefined` in assertion helper.

### 1.7 Для чего нужны default values?

**Ответ:** чтобы local variable получила fallback value when extracted value is `undefined`.

**Объяснение:** default value affects variable, not source object.

**Распространённая ошибка:** ожидать, что default value добавит property to object.

**Связь с Automation QA:** config timeout can have local fallback.

### 1.8 Для чего нужно renaming?

**Ответ:** чтобы property value попала в variable with different name.

**Объяснение:** `name: userName` means read property `name`, create variable `userName`.

**Распространённая ошибка:** думать, что both `name` and `userName` are created.

**Связь с Automation QA:** `expectedName` and `actualName` make assertions clearer.

### 1.9 Почему deep nested destructuring может ухудшить readability?

**Ответ:** pattern becomes hard to scan.

**Объяснение:** when many nested levels appear in one statement, code hides the path.

**Распространённая ошибка:** compress too much extraction into one line.

**Связь с Automation QA:** API responses can be deeply nested; clear extraction steps are often better.

### 1.10 Где destructuring полезен в Automation QA?

**Ответ:** API responses, configs, expected data, payload processing and assertion helpers.

**Объяснение:** these objects contain multiple properties, but each check often needs selected fields.

**Распространённая ошибка:** destructure fields too early before it is clear which values are needed.

**Связь с Automation QA:** readable tests show exactly which fields are validated.

---

## 2. Определите extracted variables

### 2.1

**Ответ:** created variables: `name`, `role`.

**Объяснение:** destructuring asks for properties `"name"` and `"role"`.

**Распространённая ошибка:** include `id`, although it was not extracted.

**Связь с Automation QA:** tests often extract only fields used in assertions.

### 2.2

**Ответ:** extracted values: `200` into `status`, `340` into `durationMs`.

**Объяснение:** `body` exists but is not requested in pattern.

**Распространённая ошибка:** assume all object properties are extracted.

**Связь с Automation QA:** destructuring can ignore fields irrelevant for current check.

### 2.3

**Ответ:** created variables: `apiBaseUrl`, `timeout`.

**Объяснение:** `baseUrl: apiBaseUrl` renames property value into variable `apiBaseUrl`.

**Распространённая ошибка:** expect variable `baseUrl` to exist.

**Связь с Automation QA:** renamed config values can avoid collisions.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
Anna
admin
```

**Объяснение:** properties `name` and `role` exist.

**Распространённая ошибка:** think destructuring modifies user.

**Связь с Automation QA:** simple extraction from expected user.

### 3.2

**Ответ:**

```text
undefined
```

**Объяснение:** property `role` is missing.

**Распространённая ошибка:** expect empty string or error.

**Связь с Automation QA:** missing API field often appears as `undefined`.

### 3.3

**Ответ:**

```text
5000
undefined
```

**Объяснение:** variable `timeout` gets default value; `config.timeout` remains missing.

**Распространённая ошибка:** expect default value to be written into config.

**Связь с Automation QA:** fallback config values should not be confused with modifying config object.

### 3.4

**Ответ:**

```text
Anna
Anna
```

**Объяснение:** `userName` is created from `user.name`; source object remains unchanged.

**Распространённая ошибка:** think renaming removes or changes `user.name`.

**Связь с Automation QA:** expected values can be renamed without changing test data.

---

## 4. Default values

### 4.1

**Ответ:** `retries` is `2`.

**Объяснение:** property missing gives `undefined`, so default is used.

**Распространённая ошибка:** expect `config.retries` to become `2`.

**Связь с Automation QA:** local fallback for optional config.

### 4.2

**Ответ:** `retries` is `5`.

**Объяснение:** actual value exists, so default is ignored.

**Распространённая ошибка:** think default always overrides.

**Связь с Automation QA:** explicit config should win over fallback.

### 4.3

**Ответ:** `role` is `'guest'`.

**Объяснение:** extracted value is `undefined`, so default applies.

**Распространённая ошибка:** think default only applies when key is absent. It applies when extracted value is `undefined`.

**Связь с Automation QA:** optional response field may be present but undefined.

---

## 5. Renaming

### 5.1

```javascript
const { name: userName, role: userRole } = user;
```

**Объяснение:** `name` and `role` are property keys; `userName` and `userRole` are variables.

**Распространённая ошибка:** write `const { userName, userRole } = user`, which looks for different keys.

**Связь с Automation QA:** readable local names improve assertions.

### 5.2

```javascript
const { status: responseStatus, body: responseBody } = response;
```

**Объяснение:** values are extracted from `status` and `body`.

**Распространённая ошибка:** expect both `status` and `responseStatus` to exist.

**Связь с Automation QA:** names like `responseStatus` clarify value source.

---

## 6. Debugging tasks

### 6.1

**Проблема:** variable `name` was not created.

Исправление:

```javascript
const user = {
  name: 'Anna'
};

const { name: userName } = user;

console.log(userName);
```

**Объяснение:** `name` is property key, `userName` is created variable.

**Распространённая ошибка:** misunderstand renaming syntax.

**Связь с Automation QA:** this error often appears with `expectedName` / `actualName`.

### 6.2

**Проблема:** code prints source object property, not created variable.

Исправление:

```javascript
const config = {};

const { timeout = 5000 } = config;

console.log(timeout);
```

**Объяснение:** default value belongs to variable `timeout`.

**Распространённая ошибка:** expect destructuring to mutate config.

**Связь с Automation QA:** local defaults should be used through local variable.

### 6.3

**Проблема:** `name` is nested inside `response.body`, not directly inside `response`.

Исправление:

```javascript
const response = {
  status: 200,
  body: {
    name: 'Anna'
  }
};

const { body } = response;
const { name } = body;

console.log(name);
```

**Объяснение:** extraction in steps is readable and avoids deep pattern.

**Распространённая ошибка:** destructure from wrong object level.

**Связь с Automation QA:** API fields often live inside `body`, not at response root.

---

## 7. QA-oriented tasks

### 7.1

```javascript
const { status, body, durationMs } = apiResponse;
```

**Объяснение:** these variables are created from root response properties.

**Распространённая ошибка:** expect nested user properties to be extracted too.

**Связь с Automation QA:** common first step in API assertions.

### 7.2

```javascript
const { name, role } = body;
```

**Объяснение:** after extracting `body`, user fields can be extracted from it.

**Распространённая ошибка:** destructure `name` from `apiResponse` root.

**Связь с Automation QA:** response body usually holds domain data.

### 7.3

```javascript
const { baseUrl, timeout = 5000 } = config;
```

**Объяснение:** `baseUrl` exists; `timeout` uses default.

**Распространённая ошибка:** think config was updated with timeout.

**Связь с Automation QA:** local fallback for environment configuration.

### 7.4

```javascript
const { name: expectedName, role: expectedRole } = expectedUser;
```

**Объяснение:** renaming clarifies that values are expected.

**Распространённая ошибка:** use `{ expectedName, expectedRole }`, which looks for keys with those names.

**Связь с Automation QA:** expected/actual naming reduces assertion ambiguity.

---

## 8. Мини-проект

Один из возможных вариантов:

```javascript
const apiResponse = {
  status: 200,
  body: {
    id: 101,
    name: 'Anna',
    role: 'admin',
    active: true
  },
  durationMs: 340
};

const expectedUser = {
  name: 'Anna',
  role: 'admin'
};

const config = {
  baseUrl: 'https://api.example.test'
};

const { status, body, durationMs } = apiResponse;
const { name, role } = body;
const { name: expectedName, role: expectedRole } = expectedUser;
const { timeout = 5000 } = config;

console.log(status);
console.log(durationMs);
console.log(name);
console.log(role);
console.log(expectedName);
console.log(expectedRole);
console.log(timeout);
console.log(apiResponse.body.name);
```

**Объяснение:** destructuring creates variables from existing properties. `apiResponse` remains unchanged.

**Распространённая ошибка:** expect destructuring to remove `status`, `body` or `durationMs` from `apiResponse`.

**Связь с Automation QA:** this mirrors API test code that extracts response values for assertions.

**Возможное улучшение:** when nested properties may be missing, use Optional Chaining after studying the next chapter.

---

## 9. Контрольные вопросы

1. Destructuring creates variables.
2. Source object remains unchanged because destructuring only reads property values.
3. `name: userName` reads property `name` and creates variable `userName`.
4. Default value is used when extracted value is `undefined`.
5. `const { name } = response` looks for `response.name`, not `response.body.name`.
6. Optional Chaining helps safely read nested properties that may not exist.

**Общий вывод:** destructuring is controlled extraction from object properties into variables, not object creation and not object mutation.
