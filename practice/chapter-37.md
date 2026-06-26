# Практика: Destructuring

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существует destructuring;
* определять, какие variables создаются;
* понимать matching by property name;
* использовать default values;
* использовать renaming;
* предсказывать результат выполнения кода;
* находить ошибки в destructuring patterns;
* применять destructuring в Automation QA scenarios.

---

## 1. Концептуальные вопросы

1. Какую проблему решает object destructuring?
2. Почему destructuring не нужно понимать только как "короткий синтаксис"?
3. Что именно создает destructuring?
4. Does destructuring change the object?
5. Как происходит matching в object destructuring?
6. Что будет, если property отсутствует?
7. Для чего нужны default values?
8. Для чего нужно renaming?
9. Почему deep nested destructuring может ухудшить readability?
10. Где destructuring полезен в Automation QA?

---

## 2. Определите extracted variables

### Задание 2.1

```javascript
const user = {
  id: 101,
  name: 'Anna',
  role: 'admin'
};

const { name, role } = user;
```

Какие variables созданы?

### Задание 2.2

```javascript
const response = {
  status: 200,
  body: 'created',
  durationMs: 340
};

const { status, durationMs } = response;
```

Какие values extracted?

### Задание 2.3

```javascript
const config = {
  baseUrl: 'https://api.example.test',
  timeout: 5000
};

const { baseUrl: apiBaseUrl, timeout } = config;
```

Какие variables созданы?

---

## 3. Предскажите результат выполнения

Сначала предскажите результат без запуска.

### Задание 3.1

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};

const { name, role } = user;

console.log(name);
console.log(role);
```

### Задание 3.2

```javascript
const user = {
  name: 'Anna'
};

const { role } = user;

console.log(role);
```

### Задание 3.3

```javascript
const config = {
  baseUrl: 'https://api.example.test'
};

const { timeout = 5000 } = config;

console.log(timeout);
console.log(config.timeout);
```

### Задание 3.4

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};

const { name: userName } = user;

console.log(userName);
console.log(user.name);
```

---

## 4. Default values

Для каждого примера определите value created variable.

### Задание 4.1

```javascript
const config = {};

const { retries = 2 } = config;
```

### Задание 4.2

```javascript
const config = {
  retries: 5
};

const { retries = 2 } = config;
```

### Задание 4.3

```javascript
const user = {
  role: undefined
};

const { role = 'guest' } = user;
```

---

## 5. Renaming

Перепишите destructuring так, чтобы created variables имели указанные names.

### Задание 5.1

Object:

```javascript
const user = {
  name: 'Anna',
  role: 'admin'
};
```

Нужны variables:

* `userName`;
* `userRole`.

### Задание 5.2

Object:

```javascript
const response = {
  status: 200,
  body: 'created'
};
```

Нужны variables:

* `responseStatus`;
* `responseBody`.

---

## 6. Debugging tasks

Найдите ошибку и исправьте код.

### Задание 6.1

```javascript
const user = {
  name: 'Anna'
};

const { name: userName } = user;

console.log(name);
```

### Задание 6.2

```javascript
const config = {};

const { timeout = 5000 } = config;

console.log(config.timeout);
```

Нужно вывести `5000`.

### Задание 6.3

```javascript
const response = {
  status: 200,
  body: {
    name: 'Anna'
  }
};

const { status, name } = response;

console.log(name);
```

Нужно вывести user name from `response.body`.

---

## 7. QA-oriented tasks

### Задание 7.1

Есть API response:

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
```

Извлеките `status`, `body`, `durationMs`.

### Задание 7.2

Из `body` предыдущего задания извлеките `name` and `role`.

### Задание 7.3

Есть config:

```javascript
const config = {
  baseUrl: 'https://api.example.test'
};
```

Извлеките `baseUrl` and `timeout`, где `timeout` должен быть `5000` by default.

### Задание 7.4

Есть expected user:

```javascript
const expectedUser = {
  name: 'Anna',
  role: 'admin'
};
```

Извлеките values в variables `expectedName` and `expectedRole`.

---

## 8. Mini-project

Создайте один файл с QA scenario.

Требования:

1. Создайте object `apiResponse` with `status`, `body`, `durationMs`.
2. В `body` храните user data: `id`, `name`, `role`, `active`.
3. Создайте object `expectedUser`.
4. Извлеките `status`, `body`, `durationMs` from `apiResponse`.
5. Извлеките `name` and `role` from `body`.
6. Извлеките expected values using renaming: `expectedName`, `expectedRole`.
7. Используйте default value for missing config timeout.
8. Выведите все values.
9. Отдельно объясните, изменился ли `apiResponse` после destructuring.

---

## 9. Контрольные вопросы

1. Что создает destructuring: object или variables?
2. Почему source object remains unchanged?
3. Что означает `name: userName`?
4. Когда default value используется?
5. Почему `const { name } = response` не найдет `response.body.name`?
6. Какая следующая тема помогает безопасно читать nested properties?
