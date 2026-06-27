# Решения: Object Descriptors

## 1. Концептуальные вопросы

### 1.1 Почему property is not only value?

**Ответ:** because property also has metadata controlling behavior.

**Объяснение:** two properties can have same value but different assignment, enumeration and property-definition rules.

**Распространённая ошибка:** think property is only key-value pair.

**Связь с Automation QA:** framework config fields may need protection from accidental mutation.

### 1.2 Что такое property metadata?

**Ответ:** information about property rules.

**Объяснение:** `writable`, `enumerable`, `configurable` are metadata fields.

**Распространённая ошибка:** treat metadata as business data.

**Связь с Automation QA:** internal run IDs may be metadata-like technical information.

### 1.3 Что описывает descriptor?

**Ответ:** descriptor describes property value and behavior rules.

**Объяснение:** for data properties it includes `value`, `writable`, `enumerable`, `configurable`.

**Распространённая ошибка:** remember only `value`.

**Связь с Automation QA:** descriptors help infrastructure objects behave predictably.

### 1.4 What rule controls assignment?

**Ответ:** `writable`.

**Объяснение:** if `writable` is `false`, assignment cannot change value.

**Распространённая ошибка:** think `const` controls object property writes. It controls variable reassignment, not descriptor rules.

**Связь с Automation QA:** readonly baseUrl can prevent accidental environment switch.

### 1.5 What rule controls Object.keys visibility?

**Ответ:** `enumerable`.

**Объяснение:** `Object.keys()` includes enumerable own properties.

**Распространённая ошибка:** think non-enumerable means inaccessible.

**Связь с Automation QA:** internal metadata can be hidden from ordinary config listings.

### 1.6 What rule controls whether property definition may be changed?

**Ответ:** `configurable`.

**Объяснение:** `configurable` controls whether the property definition itself may be changed. Deletion is one visible consequence of that rule.

**Распространённая ошибка:** confuse `writable` and `configurable`.

**Связь с Automation QA:** important infrastructure properties can be protected from accidental definition changes, including deletion.

### 1.7 Why can equal values behave differently?

**Ответ:** because descriptors can be different.

**Объяснение:** value equality does not imply same metadata.

**Распространённая ошибка:** compare only visible value.

**Связь с Automation QA:** two configs may print same value but one is readonly.

### 1.8 Почему non-enumerable is not private?

**Ответ:** because it can still be read directly if key is known.

**Объяснение:** non-enumerable only affects enumeration.

**Распространённая ошибка:** use non-enumerable as security mechanism.

**Связь с Automation QA:** internal IDs can be hidden from reports but not secured.

### 1.9 Почему descriptors are not business data?

**Ответ:** they describe rules for property operations.

**Объяснение:** business data is `baseUrl`; metadata is `writable: false`.

**Распространённая ошибка:** store domain meaning in descriptor flags.

**Связь с Automation QA:** descriptor flags are infrastructure mechanics.

### 1.10 Где полезны in Automation QA?

**Ответ:** immutable configuration, hidden framework internals, helper metadata, internal service objects.

**Объяснение:** these are framework-level concerns.

**Распространённая ошибка:** overuse descriptors in ordinary test data.

**Связь с Automation QA:** payloads and expected API data usually should remain plain objects.

---

## 2. Identify descriptor behavior

### 2.1

**Ответ:**

* Reassign? No, `writable: false`.
* In `Object.keys`? Yes, `enumerable: true`.
* Property definition change? No, `configurable: false`.
* Deletion? No as one visible consequence of `configurable: false`.

**Объяснение:** each operation checks a different rule.

**Распространённая ошибка:** expect one flag to control all behavior.

**Связь с Automation QA:** stable framework config may be visible but readonly.

### 2.2

**Ответ:**

* `Object.keys(helper)` will not include `internalId`.
* `helper.internalId` can still be read directly.

**Объяснение:** `enumerable: false` hides from enumeration only.

**Распространённая ошибка:** think hidden means private.

**Связь с Automation QA:** internal metadata can be kept out of ordinary report fields.

### 2.3

**Ответ:** for object literal property, usually writable: true, enumerable: true, configurable: true.

**Объяснение:** object literal creates ordinary data property.

**Распространённая ошибка:** assume `defineProperty` defaults are the same.

**Связь с Automation QA:** ordinary test data should usually behave normally.

---

## 3. Предскажите результат выполнения

### 3.1

**Ответ:**

```text
[ 'environment' ]
true
```

**Объяснение:** object literal property is enumerable and writable by default.

**Распространённая ошибка:** think all descriptors are restrictive.

**Связь с Automation QA:** ordinary config object properties are usually simple.

### 3.2

**Ответ:**

```text
[ 'name' ]
helper-001
```

**Объяснение:** `internalId` is non-enumerable, but direct read works.

**Распространённая ошибка:** expect `undefined` for direct read.

**Связь с Automation QA:** hidden internal metadata can still be available to framework code.

### 3.3

**Ответ:**

```text
TypeError
staging
```

**Объяснение:** strict mode assignment to non-writable property throws; value remains unchanged.

**Распространённая ошибка:** expect silent failure in strict mode.

**Связь с Automation QA:** readonly config can fail loudly if accidental mutation happens.

---

## 4. Debugging tasks

### 4.1

**Проблема:** `Object.defineProperty()` defaults `writable` to `false` when omitted.

Fix:

```javascript
const config = {};

Object.defineProperty(config, 'environment', {
  value: 'staging',
  writable: true,
  enumerable: true,
  configurable: true
});

config.environment = 'production';

console.log(config.environment);
```

**Объяснение:** assignment requires `writable: true`.

**Распространённая ошибка:** omit descriptor flags.

**Связь с Automation QA:** explicit descriptor rules reduce infrastructure surprises.

### 4.2

**Ответ:** hidden from enumeration does not mean unreadable.

**Объяснение:** `enumerable: false` only affects operations like `Object.keys()`.

**Распространённая ошибка:** use descriptors for privacy.

**Связь с Automation QA:** internal values can be hidden from listings but still accessible.

### 4.3

Fix:

```javascript
const config = {};

Object.defineProperty(config, 'timeout', {
  value: 5000,
  writable: true,
  enumerable: true
});

console.log(Object.keys(config));
```

**Объяснение:** `Object.keys()` requires `enumerable: true`.

**Распространённая ошибка:** set `writable` and forget `enumerable`.

**Связь с Automation QA:** visible config reports depend on enumerable properties.

---

## 5. QA-oriented tasks

### 5.1

```javascript
const frameworkConfig = {};

Object.defineProperty(frameworkConfig, 'baseUrl', {
  value: 'https://api.example.test',
  writable: false,
  enumerable: true,
  configurable: false
});
```

**Объяснение:** baseUrl visible in keys but protected from reassignment and property-definition changes at high level. Deletion is one consequence of that protection.

**Распространённая ошибка:** forget `enumerable: true` and wonder why baseUrl is absent from keys.

**Связь с Automation QA:** environment URL should often be stable after setup.

### 5.2

```javascript
const helper = {};

Object.defineProperty(helper, 'internalRunId', {
  value: 'run-001',
  enumerable: false
});
```

**Объяснение:** internalRunId does not appear in `Object.keys`.

**Распространённая ошибка:** think this makes it secure.

**Связь с Automation QA:** framework internals can stay out of ordinary output.

### 5.3

```javascript
const descriptor = Object.getOwnPropertyDescriptor(frameworkConfig, 'baseUrl');

console.log(descriptor);
```

**Объяснение:** `value` is URL; `writable` controls assignment; `enumerable` controls keys; `configurable` controls whether the property definition itself may be changed. Deletion is one visible consequence.

**Распространённая ошибка:** read only `value`.

**Связь с Automation QA:** descriptor inspection helps debug framework objects.

### 5.4

**Ответ:** because their descriptor metadata can be different.

**Объяснение:** equal values do not imply equal behavior rules.

**Распространённая ошибка:** judge property behavior by visible value only.

**Связь с Automation QA:** same baseUrl string can be mutable in one config and readonly in another.

---

## 6. Мини-проект

Один из возможных вариант:

```javascript
'use strict';

const frameworkConfig = {};

Object.defineProperty(frameworkConfig, 'baseUrl', {
  value: 'https://api.example.test',
  writable: false,
  enumerable: true,
  configurable: false
});

Object.defineProperty(frameworkConfig, 'timeout', {
  value: 5000,
  writable: true,
  enumerable: true,
  configurable: true
});

Object.defineProperty(frameworkConfig, 'internalRunId', {
  value: 'run-001',
  enumerable: false
});

console.log(Object.keys(frameworkConfig));
console.log(frameworkConfig.internalRunId);

try {
  frameworkConfig.baseUrl = 'https://prod.example.test';
} catch (error) {
  console.log(error.name);
}

frameworkConfig.timeout = 7000;

console.log(frameworkConfig.baseUrl);
console.log(frameworkConfig.timeout);

console.log(Object.getOwnPropertyDescriptor(frameworkConfig, 'baseUrl'));
console.log(Object.getOwnPropertyDescriptor(frameworkConfig, 'timeout'));
console.log(Object.getOwnPropertyDescriptor(frameworkConfig, 'internalRunId'));
```

**Объяснение:** `baseUrl` is readonly and visible. `timeout` is writable and visible. `internalRunId` is hidden from keys but readable directly.

**Распространённая ошибка:** expect `internalRunId` to be private.

**Связь с Automation QA:** this is realistic for framework config and internal run metadata.

**Возможное улучшение:** future chapters on sealing/freezing can explain broader object-level restrictions.

---

## 7. Контрольные вопросы

1. Descriptor describes property value and behavior; the chapter emphasizes behavior rules.
2. `writable`.
3. `enumerable`.
4. `configurable`.
5. Descriptors are useful for framework infrastructure because they protect and organize technical properties.

**Общий вывод:** descriptors are property metadata. They explain why property operations behave differently.
