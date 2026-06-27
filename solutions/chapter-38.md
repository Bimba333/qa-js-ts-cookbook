# Решения: Optional Chaining

## 1. Концептуальные вопросы

### 1.1 Какую проблему решает Optional Chaining?

**Ответ:** он позволяет safely read nested properties when some level may be `null` or `undefined`.

**Объяснение:** ordinary access tries to continue even when intermediate value is missing.

**Распространённая ошибка:** считать Optional Chaining default value mechanism.

**Связь с Automation QA:** API responses often have optional nested fields.

### 1.2 Почему ordinary access can throw TypeError?

**Ответ:** because JavaScript tries to read property from `undefined` or `null`.

**Объяснение:** `user.profile.name` fails if `profile` is `undefined`.

**Распространённая ошибка:** think missing nested property always returns `undefined`; only the direct missing read does.

**Связь с Automation QA:** flaky response shape can crash test before assertion.

### 1.3 Что проверяет `?.`?

**Ответ:** whether the current value is `null` or `undefined` before continuing the chain.

**Объяснение:** if current value is `null` or `undefined`, traversal stops.

**Распространённая ошибка:** place `?.` after the risky access.

**Связь с Automation QA:** put checkpoint before optional response levels.

### 1.4 Why return undefined instead of throwing?

**Ответ:** because `?.` explicitly tells JavaScript to stop safely when the current value is `null` or `undefined`.

**Объяснение:** safe stop result is `undefined`.

**Распространённая ошибка:** expect empty string, `false` or default value.

**Связь с Automation QA:** helper can receive `undefined` and decide assertion behavior.

### 1.5 Задает ли fallback value?

**Ответ:** нет.

**Объяснение:** Optional Chaining only returns `undefined` on safe stop. Fallback values are next chapter.

**Распространённая ошибка:** expect `config.retryPolicy?.retries` to become `0` or `3`.

**Связь с Automation QA:** config defaults need separate logic.

### 1.6 Меняет ли object?

**Ответ:** нет.

**Объяснение:** it only reads.

**Распространённая ошибка:** think missing path is created.

**Связь с Automation QA:** response object remains unchanged.

### 1.7 Что такое short-circuiting?

**Ответ:** early stop of the rest of property chain.

**Объяснение:** if checkpoint fails, later properties are not read.

**Распространённая ошибка:** think JavaScript still evaluates full chain.

**Связь с Automation QA:** prevents crash while reading optional nested field.

### 1.8 На каких levels ставить `?.`?

**Ответ:** before levels that may be `null` or `undefined`.

**Объяснение:** checkpoint protects only the access where it is placed.

**Распространённая ошибка:** put one `?.` too late.

**Связь с Automation QA:** optional `body`, `user`, `profile` may each need checkpoint.

### 1.9 Когда может быть вреден?

**Ответ:** when field is required and missing data should fail loudly.

**Объяснение:** Optional Chaining can hide an invalid response shape by returning `undefined`.

**Распространённая ошибка:** use it everywhere.

**Связь с Automation QA:** required fields like `id` should usually be asserted clearly.

### 1.10 Где полезен в Automation QA?

**Ответ:** optional API fields, nested response objects, optional config, payload validation and assertion helpers.

**Объяснение:** these structures often have partially optional paths.

**Распространённая ошибка:** use Optional Chaining instead of schema validation.

**Связь с Automation QA:** safe reading and validation are different steps.

---

## 2. Identify result

### 2.1

**Ответ:** `'Anna'`.

**Объяснение:** `profile` is neither `null` nor `undefined`, so chain continues to `name`.

**Распространённая ошибка:** assume `?.` always returns `undefined`.

**Связь с Automation QA:** optional access still returns actual value when checked levels are neither `null` nor `undefined`.

### 2.2

**Ответ:** `undefined`.

**Объяснение:** `profile` is `undefined`, so `profile?.name` stops.

**Распространённая ошибка:** expect TypeError.

**Связь с Automation QA:** optional field can be safely absent.

### 2.3

**Ответ:** `undefined`.

**Объяснение:** `settings` is `undefined`, so chain stops before reading `theme`.

**Распространённая ошибка:** expect default theme.

**Связь с Automation QA:** defaults require next topic, not Optional Chaining alone.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
Anna
```

**Объяснение:** checked values in the full path are neither `null` nor `undefined`.

**Распространённая ошибка:** overthink `?.`; it continues normally when current value is neither `null` nor `undefined`.

**Связь с Automation QA:** safe access works for successful full response too.

### 3.2

**Ответ:**

```text
undefined
done
```

**Объяснение:** `profile` missing, chain stops safely, execution continues.

**Распространённая ошибка:** expect crash.

**Связь с Automation QA:** test helper can continue to produce controlled assertion.

### 3.3

**Ответ:**

```text
undefined
undefined
```

**Объяснение:** `retryPolicy` missing. Optional chain returns `undefined`; config remains unchanged.

**Распространённая ошибка:** expect retryPolicy to be created.

**Связь с Automation QA:** optional config read does not mutate config.

### 3.4

**Ответ:**

```text
undefined
```

**Объяснение:** `discount` is `null`, so optional chain stops.

**Распространённая ошибка:** think `?.` only handles `undefined`; it handles `null` too.

**Связь с Automation QA:** nullable API fields are common.

---

## 4. Debugging tasks

### 4.1

Исправление:

```javascript
const response = {
  body: {}
};

const name = response.body.user?.profile?.name;

console.log(name);
```

**Объяснение:** `user` may be missing, so checkpoint must be before `.profile`.

**Распространённая ошибка:** place `?.` after risky level.

**Связь с Automation QA:** response body may not include user in error cases.

### 4.2

**Ответ:** `config.timeout?.value` can only safely read `value` if `timeout` is neither `null` nor `undefined`. It does not provide default `5000`.

Correct explanation code:

```javascript
const config = {};

const timeout = config.timeout?.value;

console.log(timeout);
```

Output remains:

```text
undefined
```

**Объяснение:** fallback values require Nullish Coalescing or another explicit default mechanism, studied next.

**Распространённая ошибка:** confuse safe traversal with fallback.

**Связь с Automation QA:** config defaults must be explicit.

### 4.3

Исправление:

```javascript
const response = {};

const role = response.body?.user?.role;

console.log(role);
```

**Объяснение:** `body` may be missing, so checkpoint must be there.

**Распространённая ошибка:** protect `user` but not `body`.

**Связь с Automation QA:** failed API responses may not have body.

---

## 5. QA-oriented tasks

### 5.1

```javascript
const profileName = response.body.user.profile?.name;
const userTheme = response.body.user.settings?.theme;
```

**Объяснение:** profile exists, settings may be missing.

**Распространённая ошибка:** use ordinary access for optional settings.

**Связь с Automation QA:** optional user settings are common in profile APIs.

### 5.2

```javascript
const retries = config.retryPolicy?.retries;
```

**Объяснение:** if retryPolicy missing, `retries` is `undefined`.

**Распространённая ошибка:** expect default retry count.

**Связь с Automation QA:** fallback will be added with Nullish Coalescing later.

### 5.3

```javascript
const city = payload.user.address?.city;
```

If `user` can also be missing:

```javascript
const city = payload.user?.address?.city;
```

**Объяснение:** checkpoint belongs before missing level.

**Распространённая ошибка:** put `?.` only at final property.

**Связь с Automation QA:** request payloads often omit optional address.

### 5.4

**Ответ:** Optional Chaining is appropriate for optional `middleName`, but usually not for required `id`.

**Объяснение:** if `id` is required, missing `id` should be visible as test failure.

**Распространённая ошибка:** make required data silently optional.

**Связь с Automation QA:** required contract fields should be validated explicitly.

---

## 6. Optional method call preview

**Ответ:**

```text
after reporter
```

**Объяснение:** `reporter.log` is missing, so optional method call stops safely and returns `undefined`. Execution continues.

**Распространённая ошибка:** expect TypeError.

**Связь с Automation QA:** optional reporter hooks can be called safely when configured.

---

## 7. Мини-проект

Один из возможных вариант:

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

const responseWithoutProfile = {
  body: {
    user: {}
  }
};

const config = {};

const firstName = responseWithProfile.body.user.profile?.name;
const secondName = responseWithoutProfile.body.user.profile?.name;

const firstCity = responseWithProfile.body.user.profile?.address?.city;
const secondCity = responseWithoutProfile.body.user.profile?.address?.city;

const retries = config.retryPolicy?.retries;

console.log(firstName);
console.log(secondName);
console.log(firstCity);
console.log(secondCity);
console.log(retries);
```

Expected output:

```text
Anna
undefined
undefined
undefined
undefined
```

**Объяснение:** chains stop at missing `profile`, `address` or `retryPolicy`. Optional Chaining returns `undefined`; it does not provide defaults.

**Распространённая ошибка:** expect `retries` to become some configured default.

**Связь с Automation QA:** realistic responses often have optional profile details and optional config sections.

**Возможное улучшение:** after studying Nullish Coalescing, add explicit fallback values.

---

## 8. Контрольные вопросы

1. It returns `undefined`.
2. Code continues because `?.` stops traversal safely instead of throwing.
3. `?.` must stand before the level that may be missing.
4. Safe access only reads safely; validation decides whether missing data is acceptable.
5. Nullish Coalescing is needed for fallback values.

**Общий вывод:** Optional Chaining is safe traversal, not validation and not default value selection.
