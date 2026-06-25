# Решения. Глава 8. Memory

## Концептуальные вопросы

### 1. Почему любой программе нужна memory

Ответ:

Memory нужна, чтобы программа могла сохранять информацию между шагами выполнения.

Рассуждение:

Если значение появилось на одной строке и используется на следующей, engine должен где-то сохранить эту информацию.

Типичная ошибка:

Думать, что JavaScript просто перечитывает предыдущие строки.

Automation QA connection:

Test data, tokens, URLs и expected values должны сохраняться между шагами теста.

### 2. Что такое value

Ответ:

Value — конкретная информация, с которой работает программа.

Рассуждение:

`'passed'`, `2`, `true` можно сохранить, прочитать, вывести или использовать в вычислении.

Типичная ошибка:

Путать value с identifier.

Automation QA connection:

Expected status `'active'` или browser name `'chromium'` являются values, которые тест использует в проверках и настройках.

### 3. Что такое identifier

Ответ:

Identifier — имя, через которое программа обращается к сохраненной информации.

Рассуждение:

В `const status = 'ready'` identifier — `status`, а value — `'ready'`.

Типичная ошибка:

Считать, что identifier и value являются одним объектом мышления.

Automation QA connection:

В тестах `baseUrl`, `userName`, `expectedStatus` — identifiers для доступа к сохраненным values.

### 4. Почему identifier и value нельзя считать одним и тем же

Ответ:

Identifier — имя, value — данные. Одно имя может использоваться для чтения текущей сохраненной информации.

Рассуждение:

Если `status` обновлен с `'created'` на `'finished'`, identifier остался тем же, но читаемое value изменилось.

Типичная ошибка:

Ожидать старое значение только потому, что identifier не изменился.

Automation QA connection:

Это помогает искать ошибки, когда `baseUrl` или `token` были обновлены раньше, чем использованы в тесте.

### 5. Store value

Ответ:

Store value означает сохранить информацию так, чтобы программа могла использовать ее позже.

Рассуждение:

После `const browserName = 'chromium'` программа может прочитать `browserName` в следующих строках.

Типичная ошибка:

Думать, что сохранение происходит только в момент вывода.

Automation QA connection:

Fixture сохраняет подготовленные данные, которые тест читает позже.

### 6. Read value

Ответ:

Read value означает получить сохраненную информацию по identifier и использовать ее в текущей операции.

Рассуждение:

В `console.log(browserName)` engine должен найти текущее value для `browserName`.

Типичная ошибка:

Не отличать чтение от хранения.

Automation QA connection:

Assertion читает actual и expected values перед сравнением.

### 7. Update value

Ответ:

Update value означает изменить сохраненную информацию, которую программа прочитает позже.

Рассуждение:

После `status = 'finished'` следующее чтение `status` даст `'finished'`.

Типичная ошибка:

Ожидать, что старое value продолжит читаться после update.

Automation QA connection:

Неправильный update config value может привести к запуску теста против неверного окружения.

### 8. Temporary и long-lived information

Ответ:

Temporary information нужна на короткий момент вычисления. Long-lived information нужна нескольким последующим шагам.

Рассуждение:

Результат `'qa' + '-user'` может быть временным до сохранения, а `userName` может использоваться дальше.

Типичная ошибка:

Считать, что каждое промежуточное значение живет так же долго, как сохраненное.

Automation QA connection:

Собранный URL может быть temporary, а `baseUrl` часто является long-lived configuration data.

### 9. Memory и Execution Context

Ответ:

Execution Context является средой выполнения, а memory хранит информацию, нужную этому выполнению.

Рассуждение:

Function Execution Context может иметь информацию, которая нужна конкретному вызову функции.

Типичная ошибка:

Считать, что Execution Context — это только порядок строк.

Automation QA connection:

Helper function при вызове работает со своей информацией: подготовленными строками, статусами, промежуточными результатами.

### 10. Memory и Call Stack

Ответ:

Call Stack показывает активный Execution Context, а memory показывает информацию, с которой этот context работает.

Рассуждение:

Engine выполняет верхний context и читает или обновляет информацию, нужную этому context.

Типичная ошибка:

Ожидать, что Call Stack сам хранит все values программы.

Automation QA connection:

Stack trace показывает путь вызовов, а memory model помогает понять, какие values были сохранены или обновлены на этом пути.

### 11. Почему не Stack & Heap

Ответ:

Эта глава строит базовую концепцию хранения информации. Stack & Heap — более конкретная модель памяти, которая будет изучаться позже.

Рассуждение:

Если начать со Stack & Heap слишком рано, читатель будет запоминать термины без понимания, зачем программе память.

Типичная ошибка:

Пытаться объяснить каждое value через Stack & Heap до изучения типов и references.

Automation QA connection:

Для debugging тестов сначала достаточно понимать store, read и update.

### 12. Почему не Garbage Collector

Ответ:

Garbage Collector — механизм автоматического освобождения памяти, но сначала нужно понять, зачем данные вообще хранятся и когда становятся ненужными.

Рассуждение:

Эта глава рассматривает removing information только на высоком уровне.

Типичная ошибка:

Объяснять lifetime данных через Garbage Collector до понимания Execution Context и memory.

Automation QA connection:

В обычном debugging тестов важнее понять, какое значение было сохранено и прочитано, чем знать момент очистки памяти.

## Identify stored values

### Фрагмент 1

Ответ:

```text
Identifier: testStatus
Value: "passed"
```

Рассуждение:

`testStatus` — имя для доступа к сохраненной информации, `'passed'` — value.

Типичная ошибка:

Записать `console.log` как stored value.

Automation QA connection:

Так хранится expected test status.

### Фрагмент 2

Ответ:

```text
Identifier: browserName
Value: "chromium"

Identifier: retryCount
Value: 2
```

Рассуждение:

Обе строки создают named access к values, которые читаются позже.

Типичная ошибка:

Считать, что `console.log` создает новые values.

Automation QA connection:

Browser name и retry count часто встречаются в test configuration.

### Фрагмент 3

Ответ:

```text
Initial state:
pageTitle → "Login"

After update:
pageTitle → "Dashboard"
```

Рассуждение:

Identifier остался тем же, но сохраненная информация изменилась.

Типичная ошибка:

Ожидать, что `pageTitle` хранит оба значения одновременно.

Automation QA connection:

Page title может измениться после navigation, и тест должен читать актуальное значение.

## Predict the output before running

### Задача 1

Ответ:

```text
created
finished
```

Memory timeline:

```text
store status → "created"
read status  → "created"
update status → "finished"
read status  → "finished"
```

Рассуждение:

Второй вывод получает обновленное value.

Типичная ошибка:

Ожидать два раза `created`.

Automation QA connection:

Так часто проявляются ошибки в test state, когда status меняется между steps.

### Задача 2

Ответ:

```text
qa-user
```

Memory timeline:

```text
store prefix → "qa"
temporary combine "qa" + "-user" → "qa-user"
store userName → "qa-user"
read userName
```

Рассуждение:

Промежуточный результат используется для сохранения final value.

Типичная ошибка:

Не выделить temporary result.

Automation QA connection:

Так builders могут собирать test usernames.

### Задача 3

Ответ:

```text
staging
staging
```

Memory timeline:

```text
store environment → "staging"
read environment → "staging"
read environment → "staging"
```

Рассуждение:

Value не обновлялось, поэтому оба чтения получают одно и то же.

Типичная ошибка:

Думать, что после первого чтения value исчезает.

Automation QA connection:

Config values часто читаются много раз в рамках одного запуска.

## Predict memory state

Ответ:

```text
Step | Operation        | Memory state
1    | store attempt    | attempt → 1
2    | update attempt   | attempt → 2
3    | update attempt   | attempt → 3
4    | read attempt     | attempt → 3
```

Вывод:

```text
3
```

Рассуждение:

Каждый update меняет текущее значение, доступное для следующего read.

Типичная ошибка:

Думать, что все значения `1`, `2`, `3` одинаково доступны через один identifier.

Automation QA connection:

Retry counters и attempt numbers часто обновляются, поэтому важно читать актуальное состояние.

## Code reading

Ответ:

```text
Long-lived:
testName → "checkout"
message  → "Running test: checkout"

Temporary:
"Running test: " + testName промежуточно создает итоговую строку
```

Рассуждение:

`testName` читается при создании `message` и позже выводится. `message` сохраняет итоговую строку. Само соединение строк является временным шагом.

Типичная ошибка:

Считать `message` temporary только потому, что он создан через выражение.

Automation QA connection:

В отчетах тестов message может быть сохраненным значением, а сборка строки — временной операцией.

## Small coding tasks

### Задача 1

Один из вариантов:

```javascript
const browserName = 'chromium';

console.log(browserName);
console.log(browserName);
```

Рассуждение:

`browserName` сохраняется один раз и читается два раза.

Типичная ошибка:

Создавать два разных identifiers вместо повторного read.

Automation QA connection:

Browser name может использоваться в нескольких местах setup-кода.

### Задача 2

Один из вариантов:

```javascript
let status = 'new';

status = 'done';

console.log(status);
```

Рассуждение:

Первый шаг сохраняет начальное value, второй обновляет его, третий читает итоговое состояние.

Типичная ошибка:

Ожидать вывод `new`.

Automation QA connection:

Test status или setup status часто обновляется по мере выполнения сценария.

## Debugging tasks

### Задача 1

Ответ:

Инженер не учел update.

```text
store status → "created"
update status → "finished"
read status → "finished"
```

Рассуждение:

`console.log` читает текущее сохраненное value, а не первое value, которое когда-либо было связано с identifier.

Типичная ошибка:

Читать код только сверху и запоминать первое присваивание.

Automation QA connection:

Так можно ошибиться при анализе статуса сущности в API-тесте.

### Задача 2

Ответ:

Нужно искать строку update, потому что read только показывает текущее состояние.

```text
store baseUrl → staging
update baseUrl → prod
read baseUrl → prod
```

Рассуждение:

Ошибка могла появиться раньше, чем неправильный URL был использован.

Типичная ошибка:

Искать проблему только в строке `console.log` или `page.goto`.

Automation QA connection:

В Playwright неправильный `baseUrl` часто проявляется в navigation step, но причина может быть в configuration setup.

## QA-oriented tasks

### Сценарий 1

Ответ:

```text
Memory before login step
│
├── userName → prepared user name
└── password → prepared password
```

Рассуждение:

Login step должен прочитать оба values, подготовленные раньше.

Типичная ошибка:

Думать о login step отдельно от preparation step.

Automation QA connection:

Так устроены тесты, где данные создаются перед UI-действиями.

### Сценарий 2

Ответ:

Ошибка могла появиться:

* в fixture, где `baseUrl` был сохранен;
* в helper, где `baseUrl` был прочитан;
* в промежуточном update, если значение было изменено;
* в сборке итогового URL.

Stack trace показывает цепочку вызовов, но не заменяет анализ memory state.

Таблица:

```text
Step | Operation       | Memory
1    | store baseUrl   | baseUrl → ?
2    | read baseUrl    | baseUrl → ?
3    | build final URL | finalUrl → ?
4    | open page       | finalUrl is used
```

Рассуждение:

Чтобы найти причину, нужно понять, где неправильное value появилось впервые.

Типичная ошибка:

Исправлять Playwright action, хотя ошибка в сохраненном config value.

Automation QA connection:

Это типичный debugging flow для `page.goto`, API base URLs и test environments.

### Сценарий 3

Ответ:

До сравнения должны быть доступны:

```text
expectedStatus → expected value
actualStatus   → value received from system
```

Рассуждение:

Assertion не может сравнить значения, если они не были получены или сохранены до проверки.

Типичная ошибка:

Считать assertion магическим действием, которое само знает expected и actual.

Automation QA connection:

Любая проверка API, UI или DB опирается на values, подготовленные или полученные раньше.

## Mini-project

Один из вариантов:

```javascript
const baseUrl = 'https://example.com';
const path = '/login';
const loginUrl = baseUrl + path;

console.log(loginUrl);

let status = 'created';

status = 'ready';

console.log(status);
```

Timeline:

```text
store baseUrl → "https://example.com"
store path → "/login"
temporary combine baseUrl + path → "https://example.com/login"
store loginUrl → "https://example.com/login"
read loginUrl
store status → "created"
update status → "ready"
read status
```

Рассуждение:

`baseUrl` и `path` являются сохраненными values. Соединение строк создает temporary result. `loginUrl` сохраняет итоговый URL. `status` сначала имеет одно value, затем обновляется.

Типичная ошибка:

Не отличить temporary combine от сохраненного `loginUrl`.

Automation QA connection:

Мини-проект повторяет типичную структуру UI/API-теста: base URL, path, final URL, status подготовки.

## Возможные улучшения

После выполнения практики можно:

* добавить рядом с каждым примером таблицу `identifier → current value`;
* взять реальный Playwright-тест и выписать все stored values;
* отметить строки, где происходит update test state;
* вернуться к этой практике перед главой про Variables.
