# Variables

## Связь с предыдущей главой

В предыдущей главе была построена модель memory: значение хранится в некотором месте, а программа обращается к нему по имени.

Теперь появляется следующий вопрос:

> Как программист создает named access к этой сохраненной информации?

Мы не можем напрямую сказать engine: "положи это значение в концептуальную location #42 и потом достань его оттуда". Такой стиль был бы неудобным и небезопасным для чтения программы.

Вместо этого JavaScript дает variables.

Variables — это не коробки. В этой главе variable будет рассматриваться как named access к информации, которой управляет JavaScript Engine.

Общая цепочка теперь такая:

---

## Предварительные требования

Для этой главы нужно понимать:

* что JavaScript выполняется engine;
* что Execution Context является рабочей средой выполнения;
* что Call Stack показывает активный Execution Context;
* что memory хранит значения и связанную с ними информацию;
* что identifier — имя, через которое программа обращается к сохраненной информации.

Не требуется знать Hoisting, Temporal Dead Zone, Scope, Closures или Lexical Environment. Если эти темы появляются в тексте, они объясняются одной фразой и будут подробно разобраны в отдельных главах.

---

## Время изучения

Ориентировочное время:

```text
Чтение главы:            100-130 минут
Разбор схем:              40-50 минут
Запуск примеров:          25-35 минут
Практика:                 90-120 минут
Повторение материала:     30 минут
```

Уровень сложности: **L3**.

L3 означает фундаментальный уровень: глава объясняет не только синтаксис `var`, `let` и `const`, а саму причину существования variables и внутреннюю модель работы с named access.

---

## Навигация

Предыдущая глава:

```text
docs/01-javascript/05-memory.md
```

Следующая глава:

```text
docs/01-javascript/07-scope.md
```

Следующая глава объяснит Scope: почему один identifier доступен в одном месте программы и недоступен в другом. Scope — это правила доступности имен; подробно он будет изучаться позже.

---

## Цели обучения

После изучения этой главы вы будете понимать:

* что такое variable;
* почему variables существуют;
* почему variable не стоит представлять как коробку;
* что такое identifier;
* что такое declaration;
* что такое initialization;
* что такое assignment;
* что такое reassignment;
* чем declaration отличается от assignment;
* что означает declaration without initialization;
* как variable связана с memory;
* как variable связана с Execution Context;
* как variable связана с Call Stack;
* зачем в JavaScript есть `var`, `let` и `const`;
* почему `const` не означает "неизменяемое значение" в общем смысле;
* как выбирать `let` и `const` в тестовом коде;
* какие ошибки чаще всего встречаются при работе с variables.

---

## Мотивация

Начнем с наблюдаемого поведения.

```javascript
let userName = 'Anna';

console.log(userName);
```

Мы пишем не так:

```text
engine.store(value: "Anna", location: #1042)
engine.read(location: #1042)
```

Мы пишем проще:

```text
userName
```

Вопрос:

Переменная нужна не потому, что программисту хочется "коробку". Переменная нужна потому, что программе нужен понятный способ:

* зарегистрировать имя;
* связать имя со значением;
* прочитать значение позже;
* иногда изменить связь с текущей информацией;
* сделать код читаемым для человека.

Рассмотрим сквозной пример, который будет проходить через главу:

```javascript
const baseUrl = 'https://example.com';
let testStatus = 'created';

testStatus = 'ready';

console.log(baseUrl);
console.log(testStatus);
```

На поверхности это простой код. Внутри engine происходит несколько разных действий:

```text
register identifier: baseUrl
initialize baseUrl with value

register identifier: testStatus
initialize testStatus with value

assign new value to testStatus

read baseUrl
read testStatus
```

Главный вопрос главы:

> Что engine делает прямо сейчас?

---

## Теория

### Проблема прямой работы с memory

Представим, что variables не существуют.

Код стал бы нечитаемым:

Проблема:

Variables решают эту проблему.

### Что такое variable

Variable — это named access к сохраненной информации, управляемой JavaScript Engine.

Важно:

```text
Variable is not a box.
Variable is not the value itself.
Variable is a named way to access stored information.
```

Концептуально:

Когда вы пишете:

```javascript
const userName = 'Anna';
```

engine не создаёт физическую коробку с наклейкой `userName` в том учебном смысле, который часто показывают новичкам. Более точная модель:

```text
запись в среде выполнения:  userName  ──→  [ 'Anna' ]
```

Что происходит внутри engine прямо сейчас:

```text
Engine регистрирует имя.
Engine связывает имя с информацией.
Engine позволит читать эту информацию по имени.
```

### Identifier

Identifier — имя, которое используется в коде.

```javascript
const browserName = 'chromium';
```

Здесь:

```text
Identifier: browserName
Value:      "chromium"
```

Identifier должен быть понятным человеку, потому что он описывает смысл сохраненной информации.

Плохо:

```javascript
const x = 'chromium';
```

Лучше:

```javascript
const browserName = 'chromium';
```

В Automation QA identifier часто отражает роль данных:

```javascript
const baseUrl = 'https://example.com';
const expectedStatus = 'active';
const actualStatus = 'active';
```

```text
baseUrl         ──→  [ 'https://example.com' ]
expectedStatus  ──→  [ 'active' ]
actualStatus    ──→  [ 'active' ]
```

### Declaration

Declaration — регистрация identifier в текущей среде выполнения.

```javascript
let testStatus;
```

Эта строка не дает meaningful value для теста. Она говорит engine:

Диаграмма declaration:

```text
testStatus  ──→  [ ??? ]
   имя есть      значения ещё нет
```

Declaration as registration:

Hoisting — это особенности того, как declarations учитываются во время подготовки к выполнению; отдельная глава будет позже. Сейчас достаточно понимать declaration как регистрацию имени.

### Declaration without initialization

Declaration without initialization — объявление имени без начального meaningful value.

```javascript
let testStatus;

console.log(testStatus);
```

Результат:

```text
undefined
```

`undefined` — специальное значение JavaScript, которое часто означает отсутствие присвоенного meaningful value. Primitive Types будут изучаться позже; сейчас важно только поведение.

Концептуально:

```text
testStatus  ──→  [ undefined ]
```

Что происходит внутри engine прямо сейчас:

```text
Engine знает имя testStatus.
Engine не получил пользовательское значение для этого имени.
Read возвращает undefined.
```

### Initialization

Initialization — первое связывание variable с начальным value в момент объявления.

```javascript
let testStatus = 'created';
```

Здесь одновременно происходят две вещи:

```text
declaration:     testStatus  ──→  [ ??? ]
initialization:  testStatus  ──→  [ 'created' ]
```

Memory view:

Что происходит внутри engine прямо сейчас:

```text
Engine регистрирует identifier.
Engine получает initial value.
Engine делает значение доступным через identifier.
```

### Assignment

Assignment — запись value в уже существующий named access.

```javascript
let testStatus;

testStatus = 'created';
```

Первая строка — declaration. Вторая строка — assignment.

```text
строка 1:  testStatus  ──→  [ undefined ]
строка 2:  testStatus  ──→  [ 'created' ]
```

Declaration vs assignment:

Что происходит внутри engine прямо сейчас:

```text
Engine видит existing identifier.
Engine записывает value, которое будет читаться через этот identifier.
```

### Reassignment

Reassignment — новое assignment для variable, которая уже имела value.

```javascript
let testStatus = 'created';

testStatus = 'ready';
```

Концептуально:

```text
было:  testStatus  ──→  [ 'created' ]
стало: testStatus  ──→  [ 'ready' ]
```

Прежнее значение больше не доступно через это имя.

Важно: один identifier не означает, что через него одновременно читаются все прошлые значения.

### Declaration vs assignment

Эти операции часто смешивают.

```javascript
let testStatus;          // declaration
testStatus = 'created';  // assignment
testStatus = 'ready';    // reassignment
```

```text
declaration      имя зарегистрировано
assignment       имя получило значение впервые
reassignment     значение заменено на другое
```

Сравнение:

```text
Operation       | What happens
----------------|-------------------------------
Declaration     | name is registered
Initialization  | initial value is provided
Assignment      | value is written
Reassignment    | existing value is replaced
```

### Variable lifecycle

На высоком уровне lifecycle variable можно представить так:

Не каждая variable проходит все этапы.

```javascript
const baseUrl = 'https://example.com';
```

Здесь есть declaration и initialization, но нет reassignment.

```javascript
let testStatus;

testStatus = 'created';
testStatus = 'ready';
```

Здесь declaration отделена от assignment, а затем есть reassignment.

Variable lifetime — период, когда named access существует и может использоваться в своей области доступности. Scope объяснит правила этой доступности в следующей главе.

### `const`

`const` создает variable, которую нельзя reassignment-ить.

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
```

```text
baseUrl  ──→  [ 'https://example.com' ]   связь зафиксирована
```

Нельзя:

```javascript
const baseUrl = 'https://example.com';

// baseUrl = 'https://staging.example.com';
```

Строка reassignment закомментирована, потому что такой код приведет к runtime error.

Важно: `const` запрещает reassignment identifier. Он не означает, что любое сложное value становится полностью неизменяемым. Object Type и mutability будут изучаться позже.

Что происходит внутри engine прямо сейчас:

```text
Engine регистрирует identifier.
Engine требует initial value.
Engine запрещает later reassignment для этого identifier.
```

### `let`

`let` создает variable, которую можно reassignment-ить.

```javascript
let testStatus = 'created';

testStatus = 'ready';

console.log(testStatus);
```

```text
testStatus  ──→  [ 'created' ]  ──→  [ 'ready' ]
```

`let` подходит, когда значение действительно меняется по ходу выполнения.

Пример из Automation QA:

```javascript
let retryCount = 0;

retryCount = 1;
```

Если значение не должно меняться, обычно лучше `const`.

### `var`

`var` — старый способ объявления variables.

```javascript
var legacyStatus = 'created';
```

На базовом уровне:

Но `var` имеет исторические особенности поведения, связанные с Hoisting и Scope. Hoisting — поведение declarations во время подготовки execution; Scope — правила доступности identifiers. Эти темы будут изучаться позже.

В современном коде курса и Automation QA проектах мы будем предпочитать:

```text
const by default
let when reassignment is needed
var mainly for reading legacy code
```

### Почему в JavaScript есть `var`, `let` и `const`

Исторически сначала был `var`. Он появился в раннем JavaScript и долго был единственным способом объявлять variables.

Позже появились `let` и `const`, потому что практике разработки понадобились более явные правила:

* `let` — когда named access должен позволять reassignment;
* `const` — когда named access не должен переназначаться;
* `var` — старый механизм, который остается в языке для совместимости.

Временная шкала:

Comparison:

```text
Keyword | Requires initialization | Allows reassignment | Modern default
--------|-------------------------|---------------------|---------------
var     | no                      | yes                 | no
let     | no                      | yes                 | when needed
const   | yes                     | no                  | yes
```

`const` requires initialization:

```javascript
// const baseUrl;
```

Эта строка закомментирована, потому что `const` без initial value является syntax error. Syntax error возникает до выполнения кода; этот механизм был разобран в главе про выполнение JavaScript.

### Variables + Memory

Variables дают readable access к memory.

Более точно:

Variables не заменяют memory. Они являются способом работать с information, которая хранится и управляется engine.

### Variables + Execution Context

Execution Context — среда, в которой engine выполняет код. Variables регистрируются для выполнения в этой среде.

Для global-кода:

Для function execution:

Подробная структура Lexical Environment будет изучаться позже. Сейчас важно только: variables не существуют "в воздухе"; они существуют внутри модели execution.

### Variables + Call Stack

Call Stack показывает, какой Execution Context активен прямо сейчас. Active context определяет, с какими registered identifiers engine работает в данный момент.

Когда вызывается функция:

Это не объяснение Scope. Это связь уже изученных механизмов:

### Переход к Scope

После variables возникает новый вопрос:

```javascript
const baseUrl = 'https://example.com';

function printBaseUrl() {
  console.log(baseUrl);
}
```

Почему function может прочитать `baseUrl`?

И другой вопрос:

```javascript
function prepareUser() {
  const userName = 'Anna';
}

// console.log(userName);
```

Почему `userName` нельзя читать снаружи функции?

Ответ даст Scope.

Scope — правила, которые определяют, где identifier доступен. Это следующая глава. В текущей главе мы изучаем, как identifier создается и связывается с information; в следующей — где этот identifier можно использовать.

---

## Внутренний механизм

Для каждой variable engine выполняет набор операций.

Если есть initialization:

Если declaration отделена от assignment:

Если есть reassignment:

Сквозной пример:

```javascript
const baseUrl = 'https://example.com';
let testStatus = 'created';

testStatus = 'ready';

console.log(baseUrl);
console.log(testStatus);
```

Engine diary:

Что происходит внутри engine прямо сейчас:

---

## Ментальная модель

### Labels on storage shelves

Не используйте модель "variable is a box". Более точная учебная модель — label on storage shelf.

Label помогает найти информацию. Label не является самой информацией.

### Notebook of names

Можно представить variables как записи в блокноте имен.

Когда происходит reassignment, запись обновляется:

```text
Before
testStatus: "created"

After
testStatus: "ready"
```

### Registry of identifiers

Declaration — это регистрация имени.

После registration engine знает, что такое имя существует в текущей модели выполнения.

### Declaration as registration

### Assignment as changing stored information

Итоговая модель:

---

## Примеры кода

Примеры к этой главе находятся в папке:

```text
examples/01-javascript/chapter-06/
```

Запускайте их из корня проекта.

### Пример 1. Declaration

Файл:

```text
examples/01-javascript/chapter-06/01-declaration.js
```

Показывает declaration without initialization.

### Пример 2. Initialization

Файл:

```text
examples/01-javascript/chapter-06/02-initialization.js
```

Показывает declaration вместе с initial value.

### Пример 3. Assignment

Файл:

```text
examples/01-javascript/chapter-06/03-assignment.js
```

Показывает declaration отдельно от assignment.

### Пример 4. Reassignment

Файл:

```text
examples/01-javascript/chapter-06/04-reassignment.js
```

Показывает изменение current value через `let`.

### Пример 5. `var`, `let`, `const`

Файл:

```text
examples/01-javascript/chapter-06/05-var-let-const.js
```

Показывает базовое поведение трех declaration keywords без углубления в Hoisting и Scope.

### Пример 6. Типичные ошибки

Файл:

```text
examples/01-javascript/chapter-06/06-common-mistakes.js
```

Показывает типичные ошибки через безопасные закомментированные строки и корректный вариант.

---

## Частые вопросы

### Variable — это коробка?

Нет. Модель коробки слишком рано создает неправильное ощущение, будто variable физически содержит value. В этой книге variable рассматривается как named access к информации, которой управляет engine.

### Чем declaration отличается от initialization?

Declaration регистрирует identifier. Initialization дает initial value в момент объявления.

### Чем assignment отличается от initialization?

Initialization — первое значение при объявлении. Assignment — запись value в уже существующий named access.

### Почему `const` должен сразу получить value?

Потому что `const` запрещает reassignment. Если не дать initial value, потом нельзя будет корректно записать значение через reassignment.

### Почему вообще использовать `let`, если есть `const`?

`let` нужен, когда value действительно меняется по ходу выполнения: счетчик попыток, текущий статус, промежуточный результат, который будет обновлен.

### Нужно ли использовать `var`?

В новом коде обычно нет. Но `var` нужно понимать, потому что он встречается в legacy-коде и имеет особенности, которые будут изучаться позже.

---

## Распространённые мифы

### Миф 1. Variable хранит value внутри себя как коробка

Реальность:

Variable лучше понимать как named access к stored information.

### Миф 2. `const` делает любое значение неизменяемым

Реальность:

`const` запрещает reassignment identifier. Сложные значения и mutability будут изучаться позже в главах про objects и references.

### Миф 3. Declaration и assignment — одно и то же

Реальность:

Declaration регистрирует имя. Assignment записывает value.

### Миф 4. `var`, `let` и `const` отличаются только стилем

Реальность:

У них разные правила. В этой главе важны initialization и reassignment; Hoisting и Scope отличия будут изучаться позже.

---

## Распространённые ошибки

### Ошибка 1. Использовать `let` там, где значение не меняется

Неправильный код:

```javascript
let baseUrl = 'https://example.com';

console.log(baseUrl);
```

Что произошло:

`baseUrl` не reassignment-ится, но `let` говорит читателю, что изменение возможно.

Почему это проблема:

Код становится менее очевидным.

Исправленный вариант:

```javascript
const baseUrl = 'https://example.com';

console.log(baseUrl);
```

### Ошибка 2. Ожидать старое значение после reassignment

Неправильная модель:

```javascript
let testStatus = 'created';

testStatus = 'ready';

console.log(testStatus);
```

Ожидание:

```text
created
```

Реальность:

```text
ready
```

Почему:

Read получает current value после reassignment.

### Ошибка 3. Объявлять `const` без initial value

Неправильный код:

```javascript
// const userName;
```

Что произошло:

Такой код является syntax error, потому что `const` должен быть initialized сразу.

Исправленный вариант:

```javascript
const userName = 'Anna';
```

Если value появится позже, нужен другой дизайн или `let`:

```javascript
let userName;

userName = 'Anna';
```

### Ошибка 4. Переобъявлять один и тот же identifier через `let` или `const`

Неправильный код:

```javascript
const status = 'created';
// const status = 'ready';
```

Что произошло:

Один и тот же identifier нельзя заново объявить в том же месте выполнения через `const`. Подробные правила места выполнения объяснит Scope.

Исправленный вариант:

```javascript
let status = 'created';

status = 'ready';
```

Если status должен изменяться, используйте reassignment, а не повторную declaration.

### Ошибка 5. Использовать плохие identifiers

Неправильный код:

```javascript
const data = 'active';
```

Что произошло:

Имя `data` не объясняет, что именно хранится.

Исправленный вариант:

```javascript
const expectedUserStatus = 'active';
```

---

## Практическое использование

При чтении variables задавайте пять вопросов:

```text
1. Где identifier объявлен?
2. Есть ли initialization?
3. Есть ли assignment позже?
4. Есть ли reassignment?
5. Что будет прочитано в текущей строке?
```

Таблица анализа:

```text
Line | Code                         | Operation
-----|------------------------------|------------------------
1    | const baseUrl = "..."        | declaration + initialization
2    | let testStatus = "created"   | declaration + initialization
3    | testStatus = "ready"         | reassignment
4    | console.log(testStatus)      | read
```

Практическое правило: объявляйте через `const` по умолчанию и меняйте на `let` только тогда, когда действительно нужно переприсваивание.

Это правило не заменяет понимание. Оно просто помогает писать более читаемый код.

---

## Использование в Automation QA

### Storing configuration

Configuration значения обычно не должны reassignment-иться внутри теста.

```javascript
const baseUrl = 'https://example.com';
const browserName = 'chromium';
```

Почему `const`:

### Storing test data

Test data может быть stable:

```javascript
const userName = 'qa-user';
const password = 'secret';
```

Если значение строится постепенно, может понадобиться `let`, но это должно быть осознанно.

```javascript
let userStatus = 'created';

userStatus = 'activated';
```

### Expected vs actual значения

В assertions часто полезно явно разделять expected и actual.

```javascript
const expectedStatus = 'active';
const actualStatus = 'active';

console.log(expectedStatus);
console.log(actualStatus);
```

```text
expectedStatus  ──→  [ 'active' ]   что ожидаем
actualStatus    ──→  [ 'active' ]   что получили
```

Хорошие identifiers уменьшают количество ошибок при чтении теста.

### Helper results

Helper может вернуть value, которое нужно сохранить.

```javascript
function buildUserName() {
  return 'qa-user';
}

const userName = buildUserName();
```

`return` будет подробно изучаться позже. Сейчас важно: результат helper получает readable name.

### Fixture variables

Fixture часто подготавливает значения для теста.

Если fixture меняет status, это должно быть видно через `let`.

### Почему выбор `let` или `const` улучшает читаемость

`const` сообщает:

```text
This named access will not be reassigned.
```

`let` сообщает:

```text
This named access may change.
```

Для Automation QA это важно, потому что тесты читаются как сценарии. Если значение меняется, это должно быть видно. Если значение не меняется, `const` снижает когнитивную нагрузку.

---

## Итоги

Variables нужны, чтобы программист мог работать с stored information через понятные names.

Главная модель: имя — это способ обратиться к сохранённому значению, а declaration, assignment и reassignment — три разных момента в жизни этой связи.

В этой главе были разобраны:

`const` запрещает reassignment. `let` разрешает reassignment. `var` остается в языке по историческим причинам и будет важен при изучении Hoisting и Scope.

Следующая глава объяснит Scope: где объявленные identifiers доступны и почему одно имя можно прочитать в одном месте программы, но нельзя прочитать в другом.

---

## Что нужно запомнить

✓ Variable — named access к сохраненной информации.

✓ Variable не нужно представлять как коробку.

✓ Identifier — имя, используемое в коде.

✓ Declaration регистрирует identifier.

✓ Initialization дает initial value при declaration.

✓ Assignment записывает value в существующий named access.

✓ Reassignment заменяет current value.

✓ `const` запрещает reassignment.

✓ `let` разрешает reassignment.

✓ `var` нужен для понимания legacy-кода и будущих тем.

✓ Следующая тема — Scope, то есть правила доступности identifiers.

---

## Проверьте себя

1. Почему variables существуют?

2. Почему variable не стоит объяснять как коробку?

3. Что такое identifier?

4. Что делает declaration?

5. Что делает initialization?

6. Чем assignment отличается от declaration?

7. Что такое reassignment?

8. Почему `const` должен получить initial value сразу?

9. Когда уместен `let`?

10. Почему `var` не является modern default?

---

## Практика

Практика к этой главе находится в файле:

```text
practice/01-javascript/06-variables.md
```

Перед практикой запустите примеры из раздела «Примеры кода» и для каждого файла выпишите операции:

```text
declaration
initialization
assignment
reassignment
read
```

---

## Решения

Решения находятся в файле:

```text
solutions/01-javascript/06-variables.md
```

Открывайте решения после самостоятельной попытки. В этой главе важно сравнивать не только вывод программы, но и список операций, которые engine выполняет с identifiers и значения.
