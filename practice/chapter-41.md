# Практика: Object Descriptors

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем descriptors существуют;
* отличать property value from property metadata;
* понимать `writable`, `enumerable`, `configurable`;
* читать descriptor через `Object.getOwnPropertyDescriptor()`;
* создавать property через `Object.defineProperty()`;
* предсказывать behavior readonly and hidden properties;
* применять descriptors in QA framework infrastructure.

---

## 1. Концептуальные вопросы

1. Почему property is not only value?
2. Что такое property metadata?
3. Что описывает descriptor?
4. What rule controls assignment?
5. What rule controls Object.keys visibility?
6. What rule controls whether the property definition itself may be changed?
7. Why can two properties with equal values behave differently?
8. Почему non-enumerable property is not private?
9. Почему descriptors are not business data?
10. Где descriptors полезны in Automation QA?

---

## 2. Identify descriptor behavior

### Задание 2.1

```javascript
Object.defineProperty(config, 'baseUrl', {
  value: 'https://api.example.test',
  writable: false,
  enumerable: true,
  configurable: false
});
```

Ответьте:

* Can value be reassigned?
* Will key appear in `Object.keys(config)`?
* Can the property definition be changed?
* Is deletion allowed as one visible consequence?

### Задание 2.2

```javascript
Object.defineProperty(helper, 'internalId', {
  value: 'run-001',
  enumerable: false
});
```

Ответьте:

* Will `internalId` appear in `Object.keys(helper)`?
* Can `helper.internalId` still be read directly?

### Задание 2.3

```javascript
const user = {
  name: 'Anna'
};
```

Use `Object.getOwnPropertyDescriptor()` mentally:

* Is `name` usually writable?
* Is it usually enumerable?
* Is it usually configurable?

---

## 3. Предскажите результат выполнения

### Задание 3.1

```javascript
const config = {
  environment: 'staging'
};

console.log(Object.keys(config));
console.log(Object.getOwnPropertyDescriptor(config, 'environment').writable);
```

### Задание 3.2

```javascript
const helper = {
  name: 'status helper'
};

Object.defineProperty(helper, 'internalId', {
  value: 'helper-001',
  enumerable: false
});

console.log(Object.keys(helper));
console.log(helper.internalId);
```

### Задание 3.3

```javascript
'use strict';

const config = {};

Object.defineProperty(config, 'environment', {
  value: 'staging',
  writable: false,
  enumerable: true,
  configurable: true
});

try {
  config.environment = 'production';
} catch (error) {
  console.log(error.name);
}

console.log(config.environment);
```

---

## 4. Debugging tasks

### Задание 4.1

```javascript
const config = {};

Object.defineProperty(config, 'environment', {
  value: 'staging'
});

config.environment = 'production';

console.log(config.environment);
```

Автор ожидал `production`. Объясните проблему and fix descriptor.

### Задание 4.2

```javascript
const helper = {};

Object.defineProperty(helper, 'internalId', {
  value: 'run-001',
  enumerable: false
});

console.log(helper.internalId);
```

Автор ожидал, что hidden property нельзя прочитать. Объясните.

### Задание 4.3

```javascript
const config = {};

Object.defineProperty(config, 'timeout', {
  value: 5000,
  writable: true
});

console.log(Object.keys(config));
```

Автор ожидал `timeout` in keys. Исправьте descriptor.

---

## 5. QA-oriented tasks

### Задание 5.1

Создайте `frameworkConfig` with readonly enumerable `baseUrl`.

### Задание 5.2

Добавьте non-enumerable `internalRunId` to helper object.

### Задание 5.3

Прочитайте descriptor for `baseUrl` and explain each field.

### Задание 5.4

Ответьте:

> Why can two properties with equal values behave differently?

---

## 6. Мини-проект

Создайте small framework infrastructure object.

Требования:

1. Создайте `frameworkConfig`.
2. Define readonly enumerable `baseUrl`.
3. Define writable enumerable `timeout`.
4. Define non-enumerable `internalRunId`.
5. Выведите `Object.keys(frameworkConfig)`.
6. Выведите direct access to `internalRunId`.
7. Попробуйте изменить `baseUrl` inside `try/catch` in strict mode.
8. Измените `timeout`.
9. Выведите descriptors for all three properties.
10. Объясните, какие rules controlled each operation.

---

## 7. Контрольные вопросы

1. Property descriptor describes value or behavior?
2. Which descriptor field controls assignment?
3. Which descriptor field controls enumeration?
4. Which descriptor field controls whether the property definition itself may be changed?
5. Why are descriptors useful for framework infrastructure?
