# Практика: Nullish Coalescing

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существует `??`;
* определять, когда fallback используется;
* отличать `null`/`undefined` from other значения;
* понимать, почему `0`, `false` and `''` are preserved;
* соединять Optional Chaining and `??`;
* предсказывать вывод;
* применять `??` in QA configuration and API response scenarios.

---

## 1. Концептуальные вопросы

1. Какую проблему решает `??`?
2. Какие значения называются nullish?
3. Когда fallback value используется?
4. Когда original value сохраняется?
5. Почему `??` не заменяет `0`?
6. Почему `??` не заменяет `false`?
7. Чем Optional Chaining отличается от `??`?
8. Почему `??` часто используется после Optional Chaining?
9. Чем `??` отличается от `||` на высоком уровне?
10. Где `??` полезен в Automation QA?

---

## 2. Identify result

Укажите result expression.

### Задание 2.1

```javascript
const timeout = undefined ?? 5000;
```

### Задание 2.2

```javascript
const middleName = null ?? 'not provided';
```

### Задание 2.3

```javascript
const retries = 0 ?? 2;
```

### Задание 2.4

```javascript
const verbose = false ?? true;
```

### Задание 2.5

```javascript
const label = '' ?? 'default';
```

---

## 3. Предскажите результат выполнения

Сначала предскажите результат без запуска.

### Задание 3.1

```javascript
const config = {};

const timeout = config.timeout ?? 5000;

console.log(timeout);
console.log(config.timeout);
```

### Задание 3.2

```javascript
const config = {
  retries: 0
};

const retries = config.retries ?? 2;

console.log(retries);
```

### Задание 3.3

```javascript
const user = {
  middleName: null
};

const middleName = user.middleName ?? 'not provided';

console.log(middleName);
```

### Задание 3.4

```javascript
const response = {
  body: {
    user: {}
  }
};

const city = response.body.user.profile?.address?.city ?? 'unknown';

console.log(city);
```

---

## 4. Optional Chaining + ??

Для каждого примера объясните two-step flow.

### Задание 4.1

```javascript
const config = {};

const retries = config.retryPolicy?.retries ?? 2;
```

### Задание 4.2

```javascript
const response = {
  body: {
    user: {
      profile: {
        name: 'Anna'
      }
    }
  }
};

const name = response.body.user.profile?.name ?? 'anonymous';
```

### Задание 4.3

```javascript
const response = {
  body: {
    user: {}
  }
};

const name = response.body.user.profile?.name ?? 'anonymous';
```

---

## 5. Задания на отладку

Найдите проблему and explain fix.

### Задание 5.1

```javascript
const config = {
  retries: 0
};

const retries = config.retries ?? 2;

console.log(retries);
```

Автор ожидал `2`, но получил `0`.

### Задание 5.2

```javascript
const config = {};

const timeout = config.timeout ?? 5000;

console.log(config.timeout);
```

Автор ожидал, что `config.timeout` станет `5000`.

### Задание 5.3

```javascript
const response = {
  body: {
    user: {
      id: undefined
    }
  }
};

const userId = response.body.user.id ?? 0;

console.log(userId);
```

`id` is required поле. Explain risk.

---

## 6. QA-задачи

### Задание 6.1

Создайте config:

```javascript
const config = {
  retries: 0
};
```

Извлеките:

* `retries` with fallback `2`;
* `timeout` with fallback `5000`.

Explain why retries stays `0`.

### Задание 6.2

Есть response:

```javascript
const response = {
  body: {
    user: {
      profile: {}
    }
  }
};
```

Получите:

* `displayName` with fallback `'anonymous'`;
* `city` with fallback `'unknown'`.

### Задание 6.3

Есть API settings:

```javascript
const settings = {
  retryPolicy: {
    retries: null
  }
};
```

Получите retries with fallback `3`.

### Задание 6.4

Ответьте:

> Why does ?? keep 0 but replace undefined?

---

## 7. Мини-проект

Создайте QA-сценарий.

Требования:

1. Создайте `apiResponse` with optional nested `profile.address.city`.
2. Создайте `config` with `retries: 0` and without `timeout`.
3. Используйте Optional Chaining to safely read city.
4. Используйте `??` to provide fallback city `'unknown city'`.
5. Используйте `??` to provide fallback timeout `5000`.
6. Используйте `??` for retries fallback `2` and show that `0` is preserved.
7. Выведите results.
8. Объясните, какие fallback значения были использованы.
9. Объясните, какие original значения были preserved.

---

## 8. Контрольные вопросы

1. Что проверяет `??`?
2. Какие два значения trigger fallback?
3. Почему `false ?? true` returns `false`?
4. Почему `null ?? 'x'` returns `'x'`?
5. Почему `??` does not update object property?
6. Какая следующая тема в Objects section?
