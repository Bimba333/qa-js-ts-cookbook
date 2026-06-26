# Решения: Nullish Coalescing

## 1. Концептуальные вопросы

### 1.1 Какую проблему решает `??`?

**Ответ:** `??` выбирает fallback value when current value is `null` or `undefined`.

**Объяснение:** Optional Chaining may safely return `undefined`; `??` decides what value to use instead.

**Типичная ошибка:** think `??` replaces every "empty-looking" value.

**Связь с Automation QA:** config defaults often require fallback only when value is absent.

### 1.2 Какие values are nullish?

**Ответ:** `null` and `undefined`.

**Объяснение:** only these two trigger `??` fallback.

**Типичная ошибка:** include `0`, `false` or `''`.

**Связь с Automation QA:** `0` retries may be valid configuration.

### 1.3 Когда fallback используется?

**Ответ:** when left side result is `null` or `undefined`.

**Объяснение:** JavaScript checks the left expression result.

**Типичная ошибка:** expect fallback when left value is `0`.

**Связь с Automation QA:** missing timeout can use default; explicit timeout should remain.

### 1.4 Когда original value сохраняется?

**Ответ:** when it is not `null` and not `undefined`.

**Объяснение:** `??` preserves all other values.

**Типичная ошибка:** think false-like values are replaced.

**Связь с Automation QA:** `false` can be a meaningful flag.

### 1.5 Почему `??` не заменяет `0`?

**Ответ:** because `0` is neither `null` nor `undefined`.

**Объяснение:** `??` performs nullish check only.

**Типичная ошибка:** confuse `??` with broader logical behavior.

**Связь с Automation QA:** `retries: 0` can intentionally disable retries.

### 1.6 Почему `??` не заменяет `false`?

**Ответ:** because `false` is not nullish.

**Объяснение:** fallback is only for `null` and `undefined`.

**Типичная ошибка:** expect `false ?? true` to become `true`.

**Связь с Automation QA:** `headless: false` can be intentional.

### 1.7 Чем Optional Chaining отличается от `??`?

**Ответ:** Optional Chaining safely traverses property path; `??` chooses fallback value.

**Объяснение:** they solve different consecutive problems.

**Типичная ошибка:** expect `?.` to provide fallback.

**Связь с Automation QA:** safe API read and default config are separate concerns.

### 1.8 Почему часто используется после Optional Chaining?

**Ответ:** because Optional Chaining may return `undefined`, and `??` can replace that with fallback.

**Объяснение:** this is a natural two-step flow.

**Типичная ошибка:** use fallback before safe traversal.

**Связь с Automation QA:** nested optional response fields often need readable fallback values.

### 1.9 Чем отличается от `||` на высоком уровне?

**Ответ:** `??` checks only `null` and `undefined`; `||` has broader logical behavior.

**Объяснение:** logical operators are future topic.

**Типичная ошибка:** replace all `||` with `??` mechanically.

**Связь с Automation QA:** preserving `0` and `false` often matters in config.

### 1.10 Где полезен в Automation QA?

**Ответ:** configuration defaults, optional API fields, retry counts, timeout values and assertion helpers.

**Объяснение:** all these places often distinguish absent value from intentional value.

**Типичная ошибка:** hide required missing fields with fallback.

**Связь с Automation QA:** required contract fields should still fail clearly.

---

## 2. Identify result

### 2.1

**Ответ:** `5000`.

**Объяснение:** left side is `undefined`, so fallback is used.

**Типичная ошибка:** expect `undefined` to remain.

**Связь с Automation QA:** missing timeout uses default.

### 2.2

**Ответ:** `'not provided'`.

**Объяснение:** left side is `null`, so fallback is used.

**Типичная ошибка:** think fallback applies only to `undefined`.

**Связь с Automation QA:** nullable API fields can get display fallback.

### 2.3

**Ответ:** `0`.

**Объяснение:** `0` is not `null` or `undefined`.

**Типичная ошибка:** expect fallback `2`.

**Связь с Automation QA:** zero retries can be intentional.

### 2.4

**Ответ:** `false`.

**Объяснение:** `false` is not nullish.

**Типичная ошибка:** expect fallback `true`.

**Связь с Automation QA:** boolean config flags must be preserved.

### 2.5

**Ответ:** empty string `''`.

**Объяснение:** `''` is not `null` or `undefined`.

**Типичная ошибка:** expect `'default'`.

**Связь с Automation QA:** empty label can be meaningful data.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
5000
undefined
```

**Объяснение:** variable gets fallback; source object is not updated.

**Типичная ошибка:** expect `config.timeout` to become `5000`.

**Связь с Automation QA:** local defaults do not mutate config object.

### 3.2

**Ответ:**

```text
0
```

**Объяснение:** `0` is preserved.

**Типичная ошибка:** expect `2`.

**Связь с Automation QA:** retries `0` can mean no retries.

### 3.3

**Ответ:**

```text
not provided
```

**Объяснение:** `middleName` is `null`, so fallback is used.

**Типичная ошибка:** think only missing properties trigger fallback.

**Связь с Automation QA:** API can explicitly return `null`.

### 3.4

**Ответ:**

```text
unknown
```

**Объяснение:** Optional Chaining returns `undefined`; `??` replaces it with fallback.

**Типичная ошибка:** forget that `??` is the fallback step, not `?.`.

**Связь с Automation QA:** optional nested fields often need display values.

---

## 4. Optional Chaining + ??

### 4.1

**Ответ:** `retries` becomes `2`.

**Объяснение:** `config.retryPolicy?.retries` safely returns `undefined`; `?? 2` uses fallback.

**Типичная ошибка:** think `retryPolicy` is created.

**Связь с Automation QA:** missing retry policy can have default retry count.

### 4.2

**Ответ:** `name` becomes `'Anna'`.

**Объяснение:** Optional Chaining finds actual value, so `??` keeps it.

**Типичная ошибка:** think fallback always applies.

**Связь с Automation QA:** existing API field should be preserved.

### 4.3

**Ответ:** `name` becomes `'anonymous'`.

**Объяснение:** profile is missing, Optional Chaining returns `undefined`, fallback is used.

**Типичная ошибка:** expect TypeError.

**Связь с Automation QA:** optional profile data can still produce stable output.

---

## 5. Debugging tasks

### 5.1

**Ответ:** code is correct; expectation is wrong.

**Объяснение:** `0` is not `null` or `undefined`, so `??` keeps it.

**Типичная ошибка:** expect `??` to replace `0`.

**Связь с Automation QA:** `retries: 0` often intentionally disables retries.

### 5.2

**Ответ:** print `timeout`, not `config.timeout`, or explicitly assign property if mutation is intended.

```javascript
const config = {};

const timeout = config.timeout ?? 5000;

console.log(timeout);
```

**Объяснение:** `??` creates expression result; it does not write into object.

**Типичная ошибка:** expect fallback to mutate source data.

**Связь с Automation QA:** framework defaults should be distinguished from raw config.

### 5.3

**Ответ:** using fallback `0` for required `id` may hide contract bug.

**Объяснение:** if `id` is required, missing id should fail clearly instead of becoming `0`.

**Типичная ошибка:** add fallback to every missing field.

**Связь с Automation QA:** required API fields should be validated, not silently replaced.

---

## 6. QA-oriented tasks

### 6.1

```javascript
const config = {
  retries: 0
};

const retries = config.retries ?? 2;
const timeout = config.timeout ?? 5000;

console.log(retries);
console.log(timeout);
```

**Объяснение:** `retries` stays `0`; `timeout` gets fallback because it is `undefined`.

**Типичная ошибка:** expect retries fallback.

**Связь с Automation QA:** zero retries can be a valid explicit setup.

### 6.2

```javascript
const response = {
  body: {
    user: {
      profile: {}
    }
  }
};

const displayName = response.body.user.profile?.displayName ?? 'anonymous';
const city = response.body.user.profile?.address?.city ?? 'unknown';

console.log(displayName);
console.log(city);
```

**Объяснение:** both optional reads produce `undefined`, then fallbacks are used.

**Типичная ошибка:** omit `?.` before optional `address`.

**Связь с Automation QA:** optional profile fields often need readable fallback.

### 6.3

```javascript
const settings = {
  retryPolicy: {
    retries: null
  }
};

const retries = settings.retryPolicy?.retries ?? 3;

console.log(retries);
```

**Объяснение:** left side is `null`, so fallback `3` is used.

**Типичная ошибка:** think only `undefined` triggers fallback.

**Связь с Automation QA:** configuration may explicitly use `null`.

### 6.4

**Ответ:** `??` keeps `0` because `0` is neither `null` nor `undefined`. It replaces `undefined` because `undefined` is nullish.

**Объяснение:** `??` is a nullish check, not a general emptiness check.

**Типичная ошибка:** confuse nullish with broader logical behavior.

**Связь с Automation QA:** preserving `0` matters for retries, timeout and limits.

---

## 7. Mini-project

Один из возможных вариант:

```javascript
const apiResponse = {
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

const city = apiResponse.body.user.profile?.address?.city ?? 'unknown city';
const timeout = config.timeout ?? 5000;
const retries = config.retries ?? 2;

console.log(city);
console.log(timeout);
console.log(retries);
```

Expected output:

```text
unknown city
5000
0
```

**Объяснение:** city fallback used because address path returns `undefined`. Timeout fallback used because `config.timeout` is `undefined`. Retries original value preserved because `0` is not nullish.

**Типичная ошибка:** expect `retries` to become `2`.

**Связь с Automation QA:** this mirrors config + optional API field handling.

**Возможное улучшение:** required fields should be asserted separately instead of receiving fallback silently.

---

## 8. Контрольные вопросы

1. `??` checks whether left result is `null` or `undefined`.
2. `null` and `undefined` trigger fallback.
3. `false ?? true` returns `false` because `false` is not nullish.
4. `null ?? 'x'` returns `'x'` because `null` is nullish.
5. `??` returns expression result; it does not write to object property.
6. Next topic is Object Methods.

**Общий вывод:** `??` is fallback selection only for `null` and `undefined`.
