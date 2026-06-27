# Решения: bind()

## 1. Концептуальные вопросы

### 1.1 Какую проблему решает `bind()`?

**Ответ:** `bind()` позволяет явно выбрать receiver заранее и получить новую function для будущих вызовов.

**Объяснение:** `call()` и `apply()` выбирают receiver и сразу выполняют function. `bind()` выбирает receiver, но возвращает function.

**Распространённая ошибка:** думать, что `bind()` просто вызывает function с нужным `this`.

**Связь с Automation QA:** это удобно для reusable validators, которые должны много раз работать с одной configuration.

### 1.2 Почему `bind()` не выполняет function сразу?

**Ответ:** потому что задача `bind()` - подготовить новую function, а не выполнить исходную.

**Объяснение:** invocation происходит только тогда, когда вызывается returned function.

**Распространённая ошибка:** ожидать output сразу после строки с `bind()`.

**Связь с Automation QA:** prepared helper можно создать в setup, а вызывать позже в тестах.

### 1.3 Что возвращает `bind()`?

**Ответ:** новую function object.

**Объяснение:** эта function связана с target function и заранее выбранным receiver.

**Распространённая ошибка:** считать, что `bind()` возвращает результат выполнения target function.

**Связь с Automation QA:** переменная после `bind()` обычно хранит helper, а не результат проверки.

### 1.4 Чем `bind()` отличается от `call()`?

**Ответ:** `call()` вызывает function сразу, `bind()` возвращает новую function для будущего вызова.

**Объяснение:** оба механизма выбирают receiver явно, но момент выполнения разный.

**Распространённая ошибка:** использовать `bind()`, когда нужен одноразовый немедленный вызов.

**Связь с Automation QA:** для одного вызова `call()` может быть проще, для серии проверок `bind()` часто читабельнее.

### 1.5 Чем `bind()` отличается от `apply()`?

**Ответ:** `apply()` вызывает function сразу и передает arguments через array или array-like collection. `bind()` возвращает новую function.

**Объяснение:** `apply()` решает задачу передачи ordered argument list, `bind()` - задачу delayed invocation с fixed receiver.

**Распространённая ошибка:** сравнивать `bind()` и `apply()` только по синтаксису.

**Связь с Automation QA:** `apply()` полезен, когда данные уже лежат в array, `bind()` - когда нужен reusable helper.

### 1.6 Что такое fixed receiver?

**Ответ:** receiver, заранее выбранный через `bind()` для будущих вызовов bound function.

**Объяснение:** при вызове bound function `this` берется из binding, а не из обычной формы вызова.

**Распространённая ошибка:** думать, что receiver будет каждый раз определяться заново как у обычного method call.

**Связь с Automation QA:** fixed receiver может быть environment config, API client или reporting context.

### 1.7 Почему `bind()` не изменяет original function?

**Ответ:** потому что `bind()` создает новую function.

**Объяснение:** original function остается такой же и может быть вызвана с другим receiver через `call()` или `apply()`.

**Распространённая ошибка:** ожидать, что после `validate.bind(config)` сама `validate` уже привязана.

**Связь с Automation QA:** один общий validator можно привязать к разным configs и получить несколько helpers.

### 1.8 Что означает delayed invocation?

**Ответ:** function подготавливается сейчас, а выполняется позже.

**Объяснение:** `bind()` возвращает function object, который можно сохранить и вызвать в другой строке.

**Распространённая ошибка:** не различать создание function и ее invocation.

**Связь с Automation QA:** helper можно создать при настройке suite и вызвать в конкретных тестах.

### 1.9 В каком случае `bind()` делает код читаемее?

**Ответ:** когда один receiver используется для многих будущих вызовов.

**Объяснение:** вместо повторяющегося `.call(config, ...)` появляется named helper.

**Распространённая ошибка:** применять `bind()` для одного вызова без необходимости.

**Связь с Automation QA:** `validateStagingResponse(...)` обычно читается лучше, чем повторяющийся `validateResponse.call(stagingConfig, ...)`.

### 1.10 Почему detached function - не единственное применение `bind()`?

**Ответ:** потому что `bind()` является общим механизмом явного выбора receiver заранее.

**Объяснение:** восстановление receiver у detached function - только один сценарий. Другой сценарий - создание prepared helper для многих вызовов.

**Распространённая ошибка:** определять `bind()` только через detached functions.

**Связь с Automation QA:** чаще важна не detached function сама по себе, а reusable function с конкретной configuration.

---

## 2. Определите receiver

### 2.1

**Ответ:** `this` внутри `printName` будет `user`.

**Объяснение:** `printName.bind(user)` возвращает bound function с fixed receiver `user`.

**Распространённая ошибка:** искать receiver в форме `printUserName()`. Для bound function receiver уже выбран.

**Связь с Automation QA:** так можно привязать helper к конкретному config object.

### 2.2

**Ответ:** receiver будет `stagingClient`, вывод будет:

```text
https://staging.example.test/users
```

**Объяснение:** `buildUrl.bind(stagingClient)` создает function, которая использует `stagingClient` как `this`.

**Распространённая ошибка:** ожидать, что `productionClient` как-то влияет на вызов. Он нигде не используется.

**Связь с Automation QA:** полезно для API client helpers с заранее выбранным `baseUrl`.

### 2.3

**Ответ:** receiver останется `reportConfig`, результат:

```text
smoke: passed
```

**Объяснение:** `formatSmokeMessage` уже bound function. В этой базовой модели receiver выбран через `bind(reportConfig)`.

**Распространённая ошибка:** думать, что `.call(anotherConfig, ...)` обязательно заменит receiver у bound function.

**Связь с Automation QA:** если helper уже привязан к suite config, его поведение предсказуемо при обычном использовании.

---

## 3. Определите returned function

### 3.1

**Ответ:** returned function хранится в `validateOk`.

**Объяснение:** правая часть `validateStatus.bind(config)` возвращает новую function, и она присваивается `validateOk`.

**Распространённая ошибка:** считать `validateOk` boolean-результатом проверки.

**Связь с Automation QA:** `validateOk` - reusable validator.

### 3.2

**Ответ:** returned function сначала хранится в `result`.

**Объяснение:** `result` - function. `line` - результат вызова этой function с argument `'login'`.

**Распространённая ошибка:** плохое имя `result` может ввести в заблуждение. Лучше назвать `createSmokeLine`.

**Связь с Automation QA:** имена bound helpers должны показывать, что это function.

### 3.3

**Ответ:** returned function не сохраняется.

**Объяснение:** `printEnvironment.bind(local)` создает function, но результат выражения никуда не присваивается.

**Распространённая ошибка:** ожидать, что original `printEnvironment` изменится.

**Связь с Automation QA:** потерянный bound helper означает, что настройка не будет использована.

---

## 4. Предскажите результат выполнения

### 4.1

**Ответ:**

```text
staging
```

**Объяснение:** `getStagingEnvironment` - bound function с receiver `config`.

**Распространённая ошибка:** думать, что `this` будет `undefined`, потому что вызов выглядит как standalone. Для bound function receiver уже выбран.

**Связь с Automation QA:** helper может безопасно использовать environment config.

### 4.2

**Ответ:**

```text
qa /users 200
function
```

**Объяснение:** первый вызов выполняет bound function. Второй показывает, что `formatQaStatus` является function.

**Распространённая ошибка:** считать, что переменная после `bind()` содержит строку.

**Связь с Automation QA:** prepared validators остаются functions, которые можно вызывать много раз.

### 4.3

**Ответ:**

```text
before
https://api.example.test
after
```

**Объяснение:** `bind()` создает `prepared`, но вывод `baseUrl` происходит только при `prepared()`.

**Распространённая ошибка:** ожидать вывод до `before`.

**Связь с Automation QA:** создание helper в setup не равно выполнению проверки.

### 4.4

**Ответ:**

```text
https://api.example.test/users
false
```

**Объяснение:** оба вызова `bind()` создают разные function objects, даже если target function и receiver одинаковые.

**Распространённая ошибка:** ожидать `true`, потому что receiver один и тот же.

**Связь с Automation QA:** если нужно сравнивать или удалять handlers/helpers по identity, важно хранить конкретную function.

---

## 5. Почему `bind()` не выполняется сразу?

**Ответ:**

1. `regression` не выводится, потому что `printSuite.bind(config)` не вызывает `printSuite`.
2. В `preparedPrint` хранится новая function.
3. Нужно вызвать `preparedPrint()`.

Исправленный код:

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
preparedPrint();
```

**Объяснение:** `bind()` отвечает за preparation, invocation делает `preparedPrint()`.

**Распространённая ошибка:** перепутать returned function и результат выполнения.

**Связь с Automation QA:** подготовка assertion helper не должна запускать assertion раньше времени.

---

## 6. Debugging tasks

### 6.1

**Проблема:** returned function не сохранена.

Исправление:

```javascript
'use strict';

function validateStatus(actualStatus) {
  return actualStatus === this.expectedStatus;
}

const config = {
  expectedStatus: 200
};

const validateExpectedStatus = validateStatus.bind(config);

console.log(validateExpectedStatus(200));
```

**Объяснение:** original `validateStatus` не изменился после `bind()`.

**Распространённая ошибка:** вызывать original function и ожидать fixed receiver.

**Связь с Automation QA:** так часто ломаются helpers, которые "привязали", но продолжили вызывать старую function.

### 6.2

**Проблема:** в консоль выводится сама function, а не результат ее invocation.

Исправление:

```javascript
'use strict';

function createReportLine(testName) {
  return this.suite + ': ' + testName;
}

const smokeConfig = {
  suite: 'smoke'
};

const reportLine = createReportLine.bind(smokeConfig);

console.log(reportLine('login'));
```

**Объяснение:** `reportLine` - function. Чтобы получить string, ее нужно вызвать.

**Распространённая ошибка:** забыть parentheses.

**Связь с Automation QA:** reusable report helper должен быть вызван с test name.

### 6.3

**Проблема:** missing argument `path`.

Исправление:

```javascript
'use strict';

function buildUrl(path) {
  return this.baseUrl + path;
}

const apiClient = {
  baseUrl: 'https://api.example.test'
};

const buildApiUrl = buildUrl.bind(apiClient);

console.log(buildApiUrl('/users'));
```

**Объяснение:** `bind(apiClient)` фиксирует receiver, но не передает `path`, если он не указан отдельно.

**Распространённая ошибка:** думать, что `bind()` решает все arguments автоматически.

**Связь с Automation QA:** bound API helper все равно должен получить endpoint path.

---

## 7. Перепишите `call()` через `bind()`

### 7.1

```javascript
'use strict';

function validateStatus(path, actualStatus, expectedStatus) {
  return this.environment + ' ' + path + ': ' + (actualStatus === expectedStatus);
}

const staging = {
  environment: 'staging'
};

const validateStagingStatus = validateStatus.bind(staging);

console.log(validateStagingStatus('/users', 200, 200));
console.log(validateStagingStatus('/orders', 201, 201));
console.log(validateStagingStatus('/profile', 200, 200));
```

**Объяснение:** receiver `staging` выбран один раз, затем helper вызывается как обычная function.

**Распространённая ошибка:** оставить `.call(staging, ...)` после создания bound helper.

**Связь с Automation QA:** это делает набор API checks компактнее.

### 7.2

```javascript
'use strict';

function buildUrl(path) {
  return this.baseUrl + path;
}

const client = {
  baseUrl: 'https://api.example.test'
};

const buildApiUrl = buildUrl.bind(client);

console.log(buildApiUrl('/users'));
console.log(buildApiUrl('/orders'));
```

**Объяснение:** `buildApiUrl` уже знает receiver.

**Распространённая ошибка:** ожидать, что `bind()` построит URL без вызова.

**Связь с Automation QA:** API helper становится привязанным к конкретному client config.

---

## 8. QA-oriented tasks

### 8.1

```javascript
'use strict';

function assertStatus(testName, actualStatus, expectedStatus) {
  return this.suite + ' ' + testName + ': ' + (actualStatus === expectedStatus);
}

const smokeSuite = {
  suite: 'smoke'
};

const assertSmokeStatus = assertStatus.bind(smokeSuite);

console.log(assertSmokeStatus('login', 200, 200));
console.log(assertSmokeStatus('checkout', 500, 200));
```

**Объяснение:** `assertSmokeStatus` - reusable helper with fixed receiver.

**Распространённая ошибка:** передавать `smokeSuite` как обычный first argument вместо binding receiver.

**Связь с Automation QA:** suite metadata не нужно повторять в каждом assertion.

### 8.2

```javascript
'use strict';

function requestPath(path) {
  return this.baseUrl + path;
}

const billingClient = {
  baseUrl: 'https://billing.example.test'
};

const requestBillingPath = requestPath.bind(billingClient);

console.log(requestBillingPath('/invoices'));
console.log(requestBillingPath('/payments'));
console.log(requestBillingPath('/refunds'));
```

**Объяснение:** receiver `billingClient` выбран один раз.

**Распространённая ошибка:** забыть передать path при вызове prepared helper.

**Связь с Automation QA:** так можно подготовить helpers для разных API domains.

### 8.3

**Ответ:** второй вариант обычно читается лучше, если таких вызовов много.

**Объяснение:** имя `validateStagingResponse` фиксирует намерение. Код ниже фокусируется на path и status, а не на постоянном receiver.

**Распространённая ошибка:** всегда заменять `call()` на `bind()`. Если вызов один, `call()` может быть яснее.

**Связь с Automation QA:** в больших spec files снижение повторения делает проверки понятнее.

---

## 9. Мини-проект

Один из возможных вариантов:

```javascript
'use strict';

function formatApiCheck(path, actualStatus, expectedStatus) {
  const passed = actualStatus === expectedStatus;

  return this.project + ' ' + this.environment + ' ' + path + ': ' + passed;
}

const stagingBilling = {
  project: 'billing',
  environment: 'staging'
};

const localBilling = {
  project: 'billing',
  environment: 'local'
};

const formatStagingBillingCheck = formatApiCheck.bind(stagingBilling);
const formatLocalBillingCheck = formatApiCheck.bind(localBilling);

console.log(typeof formatStagingBillingCheck);

console.log(formatStagingBillingCheck('/invoices', 200, 200));
console.log(formatStagingBillingCheck('/payments', 500, 200));

console.log(formatLocalBillingCheck('/invoices', 200, 200));
console.log(formatLocalBillingCheck('/payments', 200, 200));
```

**Объяснение:** `typeof formatStagingBillingCheck` показывает, что `bind()` вернул function. Реальные строки появляются только после invocation.

**Распространённая ошибка:** назвать переменную `stagingResult`, хотя она хранит function.

**Связь с Automation QA:** такой подход отделяет configuration от конкретных checks.

**Возможное улучшение:** выбрать имена helpers так, чтобы было ясно, что это functions: `formatStagingBillingCheck`, `formatLocalBillingCheck`.

---

## 10. Контрольные вопросы

1. При обычном `object.method()` receiver выбирается формой вызова.
2. При `call()` receiver выбирает разработчик через первый argument.
3. При `apply()` receiver выбирает разработчик через первый argument.
4. При `bind()` receiver выбирает разработчик заранее, при создании bound function.
5. Execution происходит после вызова returned function.
6. `bind()` полезен для reusable validators, потому что config выбирается один раз.
7. Если не сохранить результат `bind()`, новая function потеряется.

**Общий вывод:** `bind()` завершает базовую модель manual receiver selection. Он нужен не для немедленного запуска, а для подготовки function к будущим вызовам.
