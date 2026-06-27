# Практика: Optional Chaining

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существует Optional Chaining;
* определять, где property chain stops;
* понимать result `undefined`;
* отличать Optional Chaining от default values;
* предсказывать output;
* находить ошибки placement of `?.`;
* применять Optional Chaining в Automation QA scenarios.

---

## 1. Концептуальные вопросы

1. Какую проблему решает Optional Chaining?
2. Почему ordinary access can throw TypeError?
3. Что проверяет operator `?.`?
4. Why does Optional Chaining return undefined instead of throwing?
5. Задает ли Optional Chaining fallback value?
6. Меняет ли Optional Chaining object?
7. Что такое short-circuiting в property chain?
8. На каких levels нужно ставить `?.`?
9. Когда Optional Chaining может быть вреден?
10. Где Optional Chaining полезен в Automation QA?

---

## 2. Identify result

### Задание 2.1

```javascript
const user = {
  profile: {
    name: 'Anna'
  }
};

const name = user.profile?.name;
```

Какое value будет в `name`?

### Задание 2.2

```javascript
const user = {};

const name = user.profile?.name;
```

Какое value будет в `name`?

### Задание 2.3

```javascript
const response = {
  body: {
    user: {}
  }
};

const theme = response.body.user.settings?.theme;
```

Какое value будет в `theme`?

---

## 3. Предскажите результат выполнения

Сначала предскажите результат без запуска.

### Задание 3.1

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

console.log(response.body.user.profile?.name);
```

### Задание 3.2

```javascript
const response = {
  body: {
    user: {}
  }
};

console.log(response.body.user.profile?.name);
console.log('done');
```

### Задание 3.3

```javascript
const config = {};

const retries = config.retryPolicy?.retries;

console.log(retries);
console.log(config.retryPolicy);
```

### Задание 3.4

```javascript
const payload = {
  discount: null
};

console.log(payload.discount?.promoCode);
```

---

## 4. Debugging tasks

Найдите проблему и исправьте код.

### Задание 4.1

```javascript
const response = {
  body: {}
};

const name = response.body.user.profile?.name;

console.log(name);
```

`user` может отсутствовать.

### Задание 4.2

```javascript
const config = {};

const timeout = config.timeout?.value;

console.log(timeout);
```

Автор ожидал default `5000`. Объясните проблему. Не используйте Nullish Coalescing.

### Задание 4.3

```javascript
const response = {};

const role = response.body.user?.role;

console.log(role);
```

`body` может отсутствовать.

---

## 5. QA-oriented tasks

### Задание 5.1

Есть response:

```javascript
const response = {
  status: 200,
  body: {
    user: {
      id: 101,
      profile: {
        name: 'Anna'
      }
    }
  }
};
```

Безопасно прочитайте:

* profile name;
* user settings theme.

### Задание 5.2

Есть config:

```javascript
const config = {
  baseUrl: 'https://api.example.test'
};
```

Безопасно прочитайте `config.retryPolicy.retries`.

### Задание 5.3

Есть payload:

```javascript
const payload = {
  user: {
    name: 'Anna'
  }
};
```

Безопасно прочитайте `payload.user.address.city`.

### Задание 5.4

Объясните, в каком случае Optional Chaining should not be used:

* optional field `middleName`;
* required field `id`.

---

## 6. Optional method call preview

Предскажите результат.

```javascript
const reporter = {};

reporter.log?.('test passed');

console.log('after reporter');
```

---

## 7. Мини-проект

Создайте QA scenario.

Требования:

1. Создайте `apiResponse` with nested `body.user.profile`.
2. Создайте второй response without `profile`.
3. Безопасно прочитайте `profile.name` from both responses.
4. Безопасно прочитайте optional `profile.address.city`.
5. Создайте config without `retryPolicy`.
6. Безопасно прочитайте `retryPolicy.retries`.
7. Выведите все results.
8. Объясните, где chain stops.
9. Отдельно объясните, почему Optional Chaining did not provide default values.

---

## 8. Контрольные вопросы

1. Что возвращает Optional Chaining when chain stops?
2. Почему code continues after safe stop?
3. Почему `?.` должен стоять before missing level?
4. Чем safe access отличается от validation?
5. Какая следующая тема нужна для fallback values?
