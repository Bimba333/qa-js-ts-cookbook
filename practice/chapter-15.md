# Практика. Глава 15. Object Type

## Концептуальные вопросы

Ответьте своими словами.

1. Почему primitive values sometimes become insufficient?
2. Какую проблему решает Object Type?
3. Что означает фраза: object groups related information?
4. Что такое property?
5. Чем property name отличается от property value?
6. Почему `user` and `firstName` в примере ниже не являются одним и тем же видом имени?
7. Что происходит при чтении existing property?
8. Что происходит при чтении missing property?
9. Что означает updating property?
10. Что означает adding property?
11. Что означает deleting property на базовом уровне?
12. Почему nested object полезен для API responses?
13. Почему `const` не означает, что object properties нельзя менять?
14. Почему arrays and functions не разбираются подробно в этой главе?

```javascript
const user = {
  firstName: 'Anna',
};
```

## Identify properties

Для каждого object укажите:

* object name;
* property names;
* property values;
* какая информация grouped together.

### Задача 1

```javascript
const user = {
  firstName: 'Anna',
  lastName: 'Smith',
  age: 30,
};
```

### Задача 2

```javascript
const config = {
  baseUrl: 'https://example.com',
  retries: 2,
  headless: true,
};
```

### Задача 3

```javascript
const response = {
  statusCode: 200,
  body: {
    id: 101,
    email: 'anna@example.com',
  },
};
```

## Read object values

Прочитайте код и напишите, какие values будут прочитаны.

```javascript
const user = {
  profile: {
    firstName: 'Anna',
    lastName: 'Smith',
  },
  status: {
    role: 'admin',
    isActive: true,
  },
};

console.log(user.profile.firstName);
console.log(user.profile.lastName);
console.log(user.status.role);
console.log(user.status.isActive);
```

## Predict the output before running

### Задача 1

Перед запуском предскажите output.

```javascript
const user = {
  firstName: 'Anna',
  age: 30,
};

user.age = 31;
user.role = 'admin';

console.log(user.firstName);
console.log(user.age);
console.log(user.role);
```

### Задача 2

Перед запуском предскажите output.

```javascript
const user = {
  firstName: 'Anna',
  temporaryCode: '1234',
};

delete user.temporaryCode;

console.log(user.firstName);
console.log(user.temporaryCode);
```

### Задача 3

Перед запуском предскажите output.

```javascript
const user = {
  firstName: 'Anna',
};

console.log(user.firstName);
console.log(user.firstname);
```

## Code reading

Прочитайте код и ответьте:

1. Какая entity представлена object `expectedUser`?
2. Какие properties описывают identity пользователя?
3. Какие properties описывают state пользователя?
4. Где используется nested object?
5. Какие primitive values находятся внутри object?

```javascript
const expectedUser = {
  id: 101,
  profile: {
    firstName: 'Anna',
    lastName: 'Smith',
  },
  status: {
    role: 'admin',
    isActive: true,
    deletedAt: null,
  },
};
```

## Small coding tasks

### Задача 1

Создайте object `user`, который groups:

* `firstName`;
* `lastName`;
* `age`;
* `isActive`.

Выведите весь object.

### Задача 2

Создайте object `config`, который groups:

* `baseUrl`;
* `retries`;
* `headless`.

Выведите каждое property отдельно.

### Задача 3

Создайте object `order`, который groups:

* `id`;
* `status`;
* `total`.

Затем update `status` and print updated object.

### Задача 4

Создайте object `testResult` with properties:

* `name`;
* `status`.

Добавьте property `durationMs`.

Выведите object.

## Debugging tasks

### Задача 1

Код должен вывести `Anna`, но выводит `undefined`.

Найдите проблему.

```javascript
const user = {
  firstName: 'Anna',
};

console.log(user.firstname);
```

### Задача 2

Тест ожидал property `role`, но actual object содержит другое имя.

Объясните, почему assertion fails.

```javascript
const actualUser = {
  id: 101,
  userRole: 'admin',
};

console.log(actualUser.role);
```

### Задача 3

Инженер удалил property, а затем пытается использовать его.

Объясните результат.

```javascript
const session = {
  userId: 101,
  temporaryToken: 'abc',
};

delete session.temporaryToken;

console.log(session.temporaryToken);
```

### Задача 4

Объясните, почему object shape трудно читать.

```javascript
const user = {};

user.firstName = 'Anna';
user.lastName = 'Smith';
user.age = 30;
user.isActive = true;
```

Предложите более читаемый вариант.

## QA-oriented tasks

### Сценарий 1. API response

API response:

```json
{
  "id": 101,
  "email": "anna@example.com",
  "role": "admin",
  "active": true
}
```

Создайте JavaScript object `expectedUser`, который можно использовать for assertions.

### Сценарий 2. Expected vs actual structure

Expected:

```javascript
const expectedUser = {
  id: 101,
  email: 'anna@example.com',
  role: 'admin',
};
```

Actual:

```javascript
const actualUser = {
  id: 101,
  email: 'anna@example.com',
  userRole: 'admin',
};
```

Объясните structural mismatch.

### Сценарий 3. Configuration object

Создайте object `browserConfig`, который groups:

* `baseUrl`;
* `headless`;
* `viewportWidth`;
* `viewportHeight`.

Объясните, почему это удобнее, чем four separate variables.

### Сценарий 4. User profile object

UI profile screen shows:

```text
First name: Anna
Last name: Smith
Role: Admin
Active: Yes
```

Создайте object for expected profile data. Какие property names вы выберете и почему?

## Mini-project

Создайте файл:

```text
playground/user-profile-object.js
```

В нем нужно:

1. Создать object `userProfile` with nested objects:
   * `identity`;
   * `status`;
   * `settings`.
2. В `identity` хранить:
   * `id`;
   * `firstName`;
   * `lastName`;
   * `email`.
3. В `status` хранить:
   * `role`;
   * `isActive`;
   * `deletedAt`.
4. В `settings` хранить:
   * `theme`;
   * `emailNotifications`.
5. Вывести:
   * full object;
   * first name;
   * role;
   * email notifications setting.
6. Update `status.isActive`.
7. Add property `status.lastLoginAt`.
8. Delete property `settings.theme`.
9. Вывести updated object.

После выполнения напишите короткий разбор:

```text
Object name | Grouped information | Nested objects | Updated properties | Added properties | Removed properties
```
