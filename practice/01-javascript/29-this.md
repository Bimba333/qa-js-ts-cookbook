# Практика: this

## Проверка понимания

1. Зачем в JavaScript существует `this`?

2. Что такое execution объект выполнения?

3. Когда определяется `this`: при создании функции или при ее вызове?

4. Почему `this` не нужно искать через Scope Chain как обычный identifier?

5. Чем method invocation отличается от global invocation?

6. Что такое detached function?

7. Почему Arrow Function нельзя считать просто короткой заменой method, если внутри используется `this`?

8. Чем Closure отличается от `this`?

---

## Анализ кода

### Задание 1

Определите объект выполнения и значение `this`.

```javascript
const user = {
  name: 'Anna',
  printName: function () {
    console.log(this.name);
  }
};

user.printName();
```

Ответьте:

* какая форма invocation используется;
* кто объект выполнения;
* что выведет код.

---

### Задание 2

Прочитайте код.

```javascript
const firstClient = {
  name: 'first',
  printName: function () {
    console.log(this.name);
  }
};

const secondClient = {
  name: 'second',
  printName: firstClient.printName
};

firstClient.printName();
secondClient.printName();
```

Ответьте:

* один function object используется или два;
* почему результаты разные;
* кто объект выполнения в каждом вызове.

---

## Предскажите результат выполнения кода

### Задание 3

Не запускайте код. Сначала предскажите вывод.

```javascript
'use strict';

function showReceiver() {
  console.log(this);
}

showReceiver();
```

---

### Задание 4

Не запускайте код. Сначала предскажите вывод.

```javascript
const response = {
  status: 200,
  isSuccessful: function () {
    return this.status === 200;
  }
};

console.log(response.isSuccessful());
```

---

### Задание 5

Не запускайте код. Сначала предскажите вывод.

```javascript
'use strict';

const helper = {
  prefix: 'API',
  format: function (message) {
    return this.prefix + ': ' + message;
  }
};

const format = helper.format;

console.log(format('Failed'));
```

Объясните, почему код приводит к ошибке.

---

## Closure vs this

### Задание 6

Разделите источники данных.

```javascript
function createPrinter(prefix) {
  return function printName() {
    console.log(prefix + ': ' + this.name);
  };
}

const printWithRole = createPrinter('admin');

const user = {
  name: 'Anna',
  print: printWithRole
};

user.print();
```

Ответьте:

* откуда берется `prefix`;
* откуда берется `this.name`;
* какой вопрос решает Closure;
* какой вопрос решает `this`.

---

## Определите объект выполнения

### Задание 7

Для каждого вызова определите объект выполнения.

```javascript
const apiClient = {
  baseUrl: 'https://api.example.test',
  buildUrl: function (path) {
    return this.baseUrl + path;
  }
};

apiClient.buildUrl('/users');

const buildUrl = apiClient.buildUrl;

buildUrl('/orders');
```

---

## Отладка

### Задание 8

Код должен вывести:

```text
API: Request failed
```

Но сейчас он ломается.

```javascript
'use strict';

const logger = {
  prefix: 'API',
  log: function (message) {
    console.log(this.prefix + ': ' + message);
  }
};

const log = logger.log;

log('Request failed');
```

Исправьте код без `call()`, `apply()` и `bind()`.

---

### Задание 9

Код выглядит как method, но `this` работает не так, как ожидается.

```javascript
const user = {
  name: 'Anna',
  getName: () => {
    return this.name;
  }
};

console.log(user.getName());
```

Исправьте object method так, чтобы он возвращал `name` текущего объект выполнения.

---

## QA-задачи

### Задание 10

Создайте объект `apiClient`.

Он должен содержать:

* property `baseUrl`;
* method `buildUrl(path)`;
* method `validateStatus(response)`.

`buildUrl(path)` должен использовать `this.baseUrl`.

`validateStatus(response)` должен возвращать `true`, если `response.status === 200`.

---

### Задание 11

Создайте объект `assertions`.

Он должен содержать:

* property `expectedStatus: 200`;
* method `statusIsExpected(response)`.

Method должна использовать `this.expectedStatus`.

Проверьте на response:

```javascript
{ status: 200 }
{ status: 500 }
```

---

## Мини-проект

### Задание 12

Создайте небольшой QA helper object `responseHelper`.

Требования:

1. `responseHelper` должен хранить `expectedStatus`.
2. `responseHelper` должен хранить `serviceName`.
3. Method `isExpectedStatus(response)` должна использовать `this.expectedStatus`.
4. Method `formatError(response)` должна использовать `this.serviceName` и `this.expectedStatus`.
5. Вызовите methods как object methods.
6. Затем сохраните одну method в отдельную переменную и вызовите ее.
7. Объясните, почему объект выполнения был потерян.
8. Исправьте вызов без `call()`, `apply()` и `bind()`.

Нарисуйте схему:

```text
responseHelper.method()
│
└── this -> responseHelper

detachedMethod()
│
└── this -> ?
```
