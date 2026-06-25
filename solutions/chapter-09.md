# Решения. Глава 9. Variables

## Концептуальные вопросы

### 1. Почему variables существуют

Ответ:

Variables существуют, чтобы программист мог работать с сохраненной информацией через понятные имена.

Рассуждение:

Memory хранит information, но код должен обращаться к ней читаемо. Identifier дает named access.

Типичная ошибка:

Думать, что variable нужна только для сокращения записи.

Automation QA connection:

В тестах variables дают имена configuration, test data, expected и actual values.

### 2. Почему variable не коробка

Ответ:

Variable лучше понимать как named access к stored information, а не как физическую коробку.

Рассуждение:

Модель коробки мешает понять reassignment, `const`, references и будущие темы про objects.

Типичная ошибка:

Считать, что value физически лежит "внутри variable".

Automation QA connection:

При debugging важно понимать, что `baseUrl` — имя доступа к текущей сохраненной информации.

### 3. Identifier

Ответ:

Identifier — имя, которое используется в коде для доступа к информации.

Рассуждение:

В `const browserName = 'chromium'` identifier — `browserName`.

Типичная ошибка:

Путать identifier с value.

Automation QA connection:

Хорошие identifiers вроде `expectedStatus` и `actualStatus` делают assertions читаемыми.

### 4. Declaration

Ответ:

Declaration регистрирует identifier.

Рассуждение:

`let testStatus;` сообщает engine, что имя `testStatus` существует.

Типичная ошибка:

Считать declaration записью meaningful value.

Automation QA connection:

Declaration без initialization может использоваться для значения, которое появится позже в setup.

### 5. Initialization

Ответ:

Initialization дает initial value при declaration.

Рассуждение:

`const baseUrl = 'https://example.com'` одновременно объявляет `baseUrl` и дает ему initial value.

Типичная ошибка:

Не отличать initialization от later assignment.

Automation QA connection:

Большинство stable test data лучше initialized сразу через `const`.

### 6. Assignment

Ответ:

Assignment записывает value в уже существующий named access.

Рассуждение:

После `let testStatus;` строка `testStatus = 'created';` является assignment.

Типичная ошибка:

Называть любое `=` initialization.

Automation QA connection:

Fixture может объявить status заранее и assignment-ить его после шага подготовки.

### 7. Reassignment

Ответ:

Reassignment — новое assignment для variable, у которой уже было value.

Рассуждение:

`testStatus = 'ready'` после `testStatus = 'created'` заменяет current value.

Типичная ошибка:

Ожидать, что read вернет старое value.

Automation QA connection:

Status сущности в тесте часто меняется: `created → active`.

### 8. Declaration vs assignment

Ответ:

Declaration регистрирует имя. Assignment записывает значение.

Рассуждение:

Это разные операции engine: сначала имя должно существовать, затем с ним можно связать value.

Типичная ошибка:

Считать `let status;` и `status = 'ready';` одинаковыми действиями.

Automation QA connection:

При чтении setup-кода важно видеть, где имя создано, а где оно получило данные.

### 9. Declaration without initialization

Ответ:

Это объявление identifier без initial meaningful value.

Рассуждение:

`let testStatus;` регистрирует имя, но programmer value еще не предоставлен. Reading дает `undefined`.

Типичная ошибка:

Ожидать пустую строку или `null`.

Automation QA connection:

Если helper возвращает `undefined`, причина может быть в том, что variable была declared, но не получила value.

### 10. Почему `const` initialized сразу

Ответ:

Потому что `const` запрещает reassignment. Если не дать value сразу, его нельзя будет записать позже.

Рассуждение:

`const` должен получить initial value в declaration.

Типичная ошибка:

Писать `const userName;` и планировать assignment позже.

Automation QA connection:

Stable test data через `const` должна быть известна в момент объявления.

### 11. Когда уместен `let`

Ответ:

`let` уместен, когда value должно измениться.

Рассуждение:

Если status, counter или temporary state меняется, `let` честно сообщает о reassignment.

Типичная ошибка:

Использовать `let` везде по привычке.

Automation QA connection:

`let retryCount` или `let setupStatus` читаются как значения, которые будут обновляться.

### 12. Почему `var` не modern default

Ответ:

`var` имеет исторические особенности, а современный код обычно лучше выражает намерение через `const` и `let`.

Рассуждение:

`const` показывает отсутствие reassignment, `let` показывает возможность reassignment.

Типичная ошибка:

Считать `var`, `let`, `const` полными синонимами.

Automation QA connection:

В новых Playwright-проектах `const` и `let` улучшают читаемость test code.

## Identify declaration / initialization / assignment

### Фрагмент 1

Ответ:

```text
const baseUrl = 'https://example.com';
│
└── declaration + initialization

console.log(baseUrl);
│
└── read
```

Рассуждение:

`baseUrl` registered и сразу получает initial value.

Типичная ошибка:

Называть `console.log` assignment.

Automation QA connection:

Так обычно хранят stable configuration.

### Фрагмент 2

Ответ:

```text
let testStatus;
│
└── declaration without initialization

testStatus = 'created';
│
└── assignment

console.log(testStatus);
│
└── read
```

Рассуждение:

Declaration и assignment находятся на разных строках.

Типичная ошибка:

Считать первую строку initialization.

Automation QA connection:

Так может выглядеть setup, где value появляется после отдельного шага.

### Фрагмент 3

Ответ:

```text
let retryCount = 0;
│
└── declaration + initialization

retryCount = 1;
│
└── reassignment

retryCount = 2;
│
└── reassignment

console.log(retryCount);
│
└── read
```

Рассуждение:

После initial value каждое новое assignment является reassignment.

Типичная ошибка:

Ожидать, что все прошлые values читаются через `retryCount`.

Automation QA connection:

Retry counters в тестах работают по такой модели.

## Predict output before running

### Задача 1

Ответ:

```text
undefined
```

Рассуждение:

`let testStatus;` declared identifier без programmer-provided value.

Типичная ошибка:

Ожидать ошибку или пустую строку.

Automation QA connection:

`undefined` часто показывает, что test data не была initialized.

### Задача 2

Ответ:

```text
ready
```

Рассуждение:

`testStatus` initialized как `'created'`, затем reassignment-ится на `'ready'`.

Типичная ошибка:

Ожидать `created`.

Automation QA connection:

Status после setup может отличаться от initial status.

### Задача 3

Ответ:

```text
https://example.com/login
```

Рассуждение:

`baseUrl` и `path` initialized, затем их values используются для initialization `loginUrl`.

Типичная ошибка:

Не заметить, что `loginUrl` хранит результат выражения.

Automation QA connection:

Так часто собирается URL для `page.goto` или API request.

## Predict variable state

Ответ:

```text
Step | Operation                    | Current variable state
1    | declaration                  | setupStatus → undefined
2    | assignment                   | setupStatus → "started"
3    | reassignment                 | setupStatus → "finished"
4    | read                         | setupStatus → "finished"
```

Вывод:

```text
finished
```

Рассуждение:

Read получает current value после последнего reassignment.

Типичная ошибка:

Записать `started` как итоговое значение.

Automation QA connection:

Setup status в fixture может меняться до того, как тест начнет основной сценарий.

## Code reading

Ответ:

Identifiers:

```text
browserName
testStatus
expectedTitle
```

Initialized сразу:

```text
browserName → "chromium"
testStatus → "created"
expectedTitle → "Dashboard"
```

Reassignment:

```text
testStatus → "ready"
```

Values в конце:

```text
browserName   → "chromium"
testStatus    → "ready"
expectedTitle → "Dashboard"
```

Рассуждение:

Только `testStatus` меняется после initialization.

Типичная ошибка:

Считать `expectedTitle` изменяемым только потому, что он выводится позже.

Automation QA connection:

Так можно анализировать readable test setup перед assertions.

## Debugging tasks

### Задача 1

Ответ:

Инженер не учел reassignment.

```text
testStatus initialized with "created"
│
▼
testStatus reassigned to "ready"
│
▼
read gives "ready"
```

Рассуждение:

`console.log` читает current value.

Типичная ошибка:

Запомнить первое value и игнорировать дальнейшие assignments.

Automation QA connection:

При падении проверки нужно смотреть все updates test state до assertion.

### Задача 2

Ответ:

`const` должен быть initialized в момент declaration.

Рассуждение:

Later assignment для `const` невозможен, потому что `const` запрещает reassignment.

Типичная ошибка:

Использовать `const` как `let`, но "более строго".

Automation QA connection:

Если value появится только после async setup или helper call, нужно объявлять `const` там, где value уже доступно, или использовать другой дизайн.

### Задача 3

Ответ:

Лучше `const`, потому что `baseUrl` не меняется.

Рассуждение:

`let` сообщает читателю, что reassignment возможен и ожидаем.

Типичная ошибка:

Использовать `let` по умолчанию.

Automation QA connection:

Configuration values должны выглядеть стабильными, если тест не должен их менять.

## QA-oriented tasks

### Сценарий 1

Ответ:

```text
baseUrl                → const
browserName            → const
current setup status   → let
expected user status   → const
actual user status     → const, если получен один раз
```

Рассуждение:

Configuration и expected values обычно не reassignment-ятся. Setup status меняется по ходу подготовки. Actual status может быть `const`, если он получен один раз и дальше только читается.

Типичная ошибка:

Использовать `let` для всего test data.

Automation QA connection:

Хороший выбор keyword делает тестовый сценарий легче читать.

### Сценарий 2

Ответ:

Для `userName` происходит declaration + initialization.

```text
const userName = buildUserName();
│
├── declare userName
├── call helper
└── initialize userName with helper result
```

Рассуждение:

Результат helper получает readable name.

Типичная ошибка:

Считать, что `userName` initialized до вызова helper.

Automation QA connection:

Так test data builders передают результаты в тест.

### Сценарий 3

Ответ:

Лучше `let`.

```javascript
let status = 'created';

status = 'active';
```

Рассуждение:

Status должен измениться, значит reassignment является частью сценария.

Типичная ошибка:

Использовать `const` и потом пытаться изменить status.

Automation QA connection:

Lifecycle сущностей в API/UI тестах часто требует явного изменения status.

## Mini-project

Один из вариантов:

```javascript
const baseUrl = 'https://example.com';
const browserName = 'chromium';
let testStatus = 'created';

testStatus = 'ready';

const expectedStatus = 'ready';
const actualStatus = testStatus;

console.log(baseUrl);
console.log(browserName);
console.log(testStatus);
console.log(expectedStatus);
console.log(actualStatus);
```

Таблица:

```text
Identifier     | Keyword | Initial value           | Reassignment? | Why this keyword?
baseUrl        | const   | "https://example.com"   | no            | configuration is stable
browserName    | const   | "chromium"              | no            | configuration is stable
testStatus     | let     | "created"               | yes           | status changes
expectedStatus | const   | "ready"                 | no            | expected value is stable
actualStatus   | const   | current testStatus      | no            | captured once for comparison
```

Рассуждение:

`const` используется там, где named access не должен reassignment-иться. `let` используется для changing state.

Типичная ошибка:

Использовать `let` для `baseUrl`, `browserName`, `expectedStatus` и `actualStatus` без причины.

Automation QA connection:

Мини-проект повторяет структуру реального теста: configuration, changing setup state, expected и actual values.

## Возможные улучшения

После выполнения практики можно:

* пройти по своему Playwright-тесту и заменить лишние `let` на `const`;
* выписать все reassignment в одном тесте;
* проверить, помогают ли identifiers понять сценарий без комментариев;
* вернуться к этой главе перед изучением Scope.
