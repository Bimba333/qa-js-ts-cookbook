# Практика: Objects

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем objects существуют;
* группировать related data в object;
* определять properties, keys and values;
* читать properties через dot notation;
* использовать bracket notation там, где она required;
* добавлять, обновлять и удалять properties;
* предсказывать вывод кода;
* находить ошибки в object access;
* применять objects в Automation QA scenarios.

---

## 1. Концептуальные вопросы

Ответьте своими словами.

1. Какую проблему решает object?
2. Почему пять отдельных variables не всегда лучше, чем один object?
3. Что такое property?
4. Что такое key?
5. Что такое property value?
6. Почему object лучше понимать как entity, а не только как "key-value pairs"?
7. Что делает object literal?
8. Чем dot notation отличается от bracket notation?
9. Когда bracket notation required?
10. Почему reading missing property returns `undefined`?

---

## 2. Определите properties, keys and values

Для каждого object выпишите:

* имя object variable;
* property keys;
* property values.

### Задание 2.1

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};
```

### Задание 2.2

```javascript
const config = {
  baseUrl: 'https://api.example.test',
  timeout: 5000,
  retries: 2
};
```

### Задание 2.3

```javascript
const response = {
  status: 200,
  ok: true,
  error: null
};
```

---

## 3. Reading properties

Предскажите вывод.

### Задание 3.1

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};

console.log(user.name);
console.log(user.role);
```

### Задание 3.2

```javascript
const config = {
  baseUrl: 'https://api.example.test',
  timeout: 5000
};

console.log(config.baseUrl);
console.log(config.retries);
```

### Задание 3.3

```javascript
const response = {
  status: 200,
  body: {
    name: 'Anna'
  }
};

console.log(response.status);
console.log(response.body.name);
```

---

## 4. Dot notation или bracket notation

Для каждого случая выберите подходящую форму доступа.

### Задание 4.1

```javascript
const user = {
  name: 'Anna'
};
```

Нужно прочитать `name`, key известен заранее.

### Задание 4.2

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};

const fieldName = 'role';
```

Нужно прочитать property, имя которой лежит в `fieldName`.

### Задание 4.3

```javascript
const response = {
  'status code': 200
};
```

Нужно прочитать property `'status code'`.

### Задание 4.4

Ответьте отдельно:

> When is bracket notation required?

---

## 5. Adding, updating, deleting

Предскажите итоговое состояние object.

### Задание 5.1

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};

user.role = 'owner';
user.email = 'anna@example.test';

console.log(user);
```

### Задание 5.2

```javascript
const config = {
  baseUrl: 'https://api.example.test',
  timeout: 5000,
  retries: 2
};

delete config.retries;

console.log(config.retries);
console.log(config);
```

---

## 6. Предскажите результат выполнения

Сначала предскажите результат без запуска.

### Задание 6.1

```javascript
const testUser = {
  name: 'Anna',
  active: true
};

console.log(testUser.name);
console.log(testUser.email);
```

### Задание 6.2

```javascript
const key = 'status';

const response = {
  status: 201,
  ok: true
};

console.log(response.key);
console.log(response[key]);
```

### Задание 6.3

```javascript
const payload = {
  name: 'Anna'
};

payload.role = 'admin';
payload.name = 'Kate';

console.log(payload.name);
console.log(payload.role);
```

### Задание 6.4

```javascript
const firstUser = {
  id: 101
};

const secondUser = {
  id: 101
};

console.log(firstUser === secondUser);
```

---

## 7. Debugging tasks

Найдите ошибку и исправьте код.

### Задание 7.1

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};

const fieldName = 'role';

console.log(user.fieldName);
```

### Задание 7.2

```javascript
const response = {
  'status code': 200
};

console.log(response.status code);
```

### Задание 7.3

```javascript
const config = {
  baseUrl: 'https://api.example.test'
};

console.log(config.timeout);

config.timeout = 5000;
```

Нужно вывести timeout после добавления property.

---

## 8. QA-oriented tasks

### Задание 8.1

Создайте object `testUser` со свойствами:

* `name`;
* `email`;
* `role`;
* `active`.

Выведите `name` и `role`.

### Задание 8.2

Создайте object `stagingConfig` со свойствами:

* `baseUrl`;
* `timeout`;
* `retries`.

Обновите `timeout`, добавьте property `environment`, затем выведите весь object.

### Задание 8.3

Создайте object `apiResponse`:

* `status`;
* `ok`;
* `body`.

Внутри `body` создайте object пользователя с `id`, `name`, `role`.

Выведите:

* status;
* user name;
* user role.

### Задание 8.4

Есть object:

```javascript
const actualUser = {
  id: 101,
  name: 'Anna',
  role: 'admin',
  internalToken: 'secret'
};
```

Удалите `internalToken` перед сравнением с expected data.

---

## 9. Мини-проект

Создайте небольшой набор test data для API проверки.

Требования:

1. Создайте `requestPayload` для создания пользователя.
2. Создайте `expectedUser` с ожидаемыми данными пользователя.
3. Создайте `apiResponse` с `status` и `body`.
4. Прочитайте несколько properties через dot notation.
5. Прочитайте одну property через bracket notation using variable key.
6. Добавьте property `checkedAt`.
7. Обновите одну property.
8. Удалите служебную property перед выводом результата.
9. Объясните, почему эти данные лучше хранить в objects, а не в отдельных variables.

---

## 10. Контрольные вопросы

Ответьте кратко.

1. Что лучше выражает object: отдельное значение или entity?
2. Что происходит при `object.key = value`, если key уже есть?
3. Что происходит при `object.key = value`, если key отсутствует?
4. Что делает `delete object.key` на базовом уровне?
5. Почему `object[fieldName]` отличается от `object.fieldName`?
6. Почему objects важны для API testing?
7. Какая следующая тема логически продолжает objects?
