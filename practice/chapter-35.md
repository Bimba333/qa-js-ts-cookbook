# Практика: bind()

## Цели практики

После выполнения заданий вы должны уметь:

* объяснять, зачем существует `bind()`;
* отличать `bind()` от `call()` и `apply()`;
* определять receiver bound function;
* понимать, что `bind()` возвращает новую function;
* предсказывать результат выполнения кода;
* находить ошибки, связанные с delayed invocation;
* применять `bind()` в реалистичных Automation QA helpers.

---

## 1. Концептуальные вопросы

Ответьте своими словами.

1. Какую проблему решает `bind()`?
2. Почему `bind()` не выполняет function сразу?
3. Что возвращает `bind()`?
4. Чем `bind()` отличается от `call()`?
5. Чем `bind()` отличается от `apply()`?
6. Что такое fixed receiver?
7. Почему `bind()` не изменяет original function?
8. Что означает delayed invocation?
9. В каком случае `bind()` делает код читаемее?
10. Почему detached function - не единственное применение `bind()`?

---

## 2. Определите receiver

Для каждого фрагмента укажите, каким будет `this` внутри function.

### Задание 2.1

```javascript
'use strict';

function printName() {
  console.log(this.name);
}

const user = {
  name: 'Anna'
};

const printUserName = printName.bind(user);

printUserName();
```

### Задание 2.2

```javascript
'use strict';

function buildUrl(path) {
  return this.baseUrl + path;
}

const stagingClient = {
  baseUrl: 'https://staging.example.test'
};

const productionClient = {
  baseUrl: 'https://prod.example.test'
};

const buildStagingUrl = buildUrl.bind(stagingClient);

console.log(buildStagingUrl('/users'));
```

### Задание 2.3

```javascript
'use strict';

function formatMessage(text) {
  return this.prefix + ': ' + text;
}

const reportConfig = {
  prefix: 'smoke'
};

const formatSmokeMessage = formatMessage.bind(reportConfig);

const anotherConfig = {
  prefix: 'regression'
};

console.log(formatSmokeMessage.call(anotherConfig, 'passed'));
```

---

## 3. Определите returned function

В каждом примере укажите, какая переменная хранит function, возвращенную `bind()`.

### Задание 3.1

```javascript
function validateStatus(status) {
  return this.expectedStatus === status;
}

const config = {
  expectedStatus: 200
};

const validateOk = validateStatus.bind(config);
```

### Задание 3.2

```javascript
function createLine(name) {
  return this.suite + ' ' + name;
}

const smoke = {
  suite: 'smoke'
};

const result = createLine.bind(smoke);
const line = result('login');
```

### Задание 3.3

```javascript
function printEnvironment() {
  console.log(this.environment);
}

const local = {
  environment: 'local'
};

printEnvironment.bind(local);
```

---

## 4. Предскажите результат выполнения

Сначала предскажите результат без запуска.

### Задание 4.1

```javascript
'use strict';

function getEnvironment() {
  return this.environment;
}

const config = {
  environment: 'staging'
};

const getStagingEnvironment = getEnvironment.bind(config);

console.log(getStagingEnvironment());
```

### Задание 4.2

```javascript
'use strict';

function formatStatus(path, status) {
  return this.environment + ' ' + path + ' ' + status;
}

const config = {
  environment: 'qa'
};

const formatQaStatus = formatStatus.bind(config);

console.log(formatQaStatus('/users', 200));
console.log(typeof formatQaStatus);
```

### Задание 4.3

```javascript
'use strict';

function printBaseUrl() {
  console.log(this.baseUrl);
}

const client = {
  baseUrl: 'https://api.example.test'
};

const prepared = printBaseUrl.bind(client);

console.log('before');
prepared();
console.log('after');
```

### Задание 4.4

```javascript
'use strict';

function buildUrl(path) {
  return this.baseUrl + path;
}

const client = {
  baseUrl: 'https://api.example.test'
};

const buildApiUrl = buildUrl.bind(client);
const anotherBuildApiUrl = buildUrl.bind(client);

console.log(buildApiUrl('/users'));
console.log(buildApiUrl === anotherBuildApiUrl);
```

---

## 5. Почему `bind()` не выполняется сразу?

Объясните результат.

```javascript
'use strict';

function printSuite() {
  console.log(this.suite);
}

const config = {
  suite: 'regression'
};

const preparedPrint = printSuite.bind(config);

console.log('configured');
```

Вопросы:

1. Почему `regression` не выводится?
2. Что хранится в `preparedPrint`?
3. Как изменить код, чтобы `regression` появился в выводе?

---

## 6. Debugging tasks

Найдите ошибку и исправьте код.

### Задание 6.1

```javascript
'use strict';

function validateStatus(actualStatus) {
  return actualStatus === this.expectedStatus;
}

const config = {
  expectedStatus: 200
};

validateStatus.bind(config);

console.log(validateStatus(200));
```

### Задание 6.2

```javascript
'use strict';

function createReportLine(testName) {
  return this.suite + ': ' + testName;
}

const smokeConfig = {
  suite: 'smoke'
};

const reportLine = createReportLine.bind(smokeConfig);

console.log(reportLine);
```

### Задание 6.3

```javascript
'use strict';

function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const buildApiUrl = buildUrl.bind(apiClient);

console.log(buildApiUrl());
```

---

## 7. Перепишите `call()` через `bind()`

Перепишите код так, чтобы receiver выбирался один раз.

### Задание 7.1

```javascript
'use strict';

function validateStatus(path, actualStatus, expectedStatus) {
  return this.environment + ' ' + path + ': ' + (actualStatus === expectedStatus);
}

const staging = {
  environment: 'staging'
};

console.log(validateStatus.call(staging, '/users', 200, 200));
console.log(validateStatus.call(staging, '/orders', 201, 201));
console.log(validateStatus.call(staging, '/profile', 200, 200));
```

### Задание 7.2

```javascript
'use strict';

function buildUrl(path) {
  return this.baseUrl + path;
}

const client = {
  baseUrl: 'https://api.example.test'
};

console.log(buildUrl.call(client, '/users'));
console.log(buildUrl.call(client, '/orders'));
```

---

## 8. QA-oriented tasks

### Задание 8.1

Есть helper:

```javascript
'use strict';

function assertStatus(testName, actualStatus, expectedStatus) {
  return this.suite + ' ' + testName + ': ' + (actualStatus === expectedStatus);
}

const smokeSuite = {
  suite: 'smoke'
};
```

Создайте bound function для smoke suite и вызовите ее для двух проверок:

* `login`, `200`, `200`;
* `checkout`, `500`, `200`.

### Задание 8.2

Есть API client:

```javascript
'use strict';

function requestPath(path) {
  return this.baseUrl + path;
}

const billingClient = {
  baseUrl: 'https://billing.example.test'
};
```

Создайте reusable helper для billing client и постройте URL для:

* `/invoices`;
* `/payments`;
* `/refunds`.

### Задание 8.3

Объясните, что лучше читается в большом тестовом файле и почему:

```javascript
validateResponse.call(stagingConfig, '/users', 200, 200);
validateResponse.call(stagingConfig, '/orders', 201, 201);
validateResponse.call(stagingConfig, '/profile', 200, 200);
```

или:

```javascript
const validateStagingResponse = validateResponse.bind(stagingConfig);

validateStagingResponse('/users', 200, 200);
validateStagingResponse('/orders', 201, 201);
validateStagingResponse('/profile', 200, 200);
```

---

## 9. Mini-project

Создайте небольшой QA helper module в одном файле.

Требования:

1. Создайте function `formatApiCheck(path, actualStatus, expectedStatus)`.
2. Function должна использовать `this.project` и `this.environment`.
3. Создайте два config objects:
   * `stagingBilling`;
   * `localBilling`.
4. Через `bind()` создайте две prepared functions:
   * `formatStagingBillingCheck`;
   * `formatLocalBillingCheck`.
5. Вызовите каждую function минимум два раза.
6. Покажите, что `bind()` не выполняет function сразу, а только возвращает новую function.

---

## 10. Контрольные вопросы

Ответьте кратко.

1. Кто выбирает receiver при обычном `object.method()` вызове?
2. Кто выбирает receiver при `call()`?
3. Кто выбирает receiver при `apply()`?
4. Кто выбирает receiver при `bind()`?
5. Когда происходит execution после `bind()`?
6. Почему `bind()` полезен для reusable validators?
7. Что потеряется, если вызвать `bind()` без сохранения результата?
