# Решения. Глава 10. Scope

## Концептуальные вопросы

### 1. Зачем существует Scope

Ответ:

Scope существует, чтобы определить, где identifiers visible и откуда к ним можно обращаться.

Рассуждение:

Без Scope все names были бы visible everywhere, что приводило бы к collisions и неуправляемому состоянию.

Типичная ошибка:

Считать Scope дополнительным синтаксисом, а не правилом видимости.

Automation QA connection:

Scope помогает изолировать test data, helper internals и fixture setup.

### 2. Visibility of identifiers

Ответ:

Visibility означает, можно ли access identifier из текущего места кода.

Рассуждение:

Identifier может существовать внутри функции, но быть invisible снаружи.

Типичная ошибка:

Думать, что если функция была вызвана, ее local identifiers стали доступны outside.

Automation QA connection:

Helper-local values не должны случайно использоваться тестом напрямую.

### 3. Global Scope

Ответ:

Global Scope — внешний scope программы или файла.

Рассуждение:

Identifiers в Global Scope могут быть найдены при outward lookup из inner scopes.

Типичная ошибка:

Хранить весь test state globally.

Automation QA connection:

Global Scope подходит для stable constants в маленьких примерах, но global mutable state опасен.

### 4. Function Scope

Ответ:

Function Scope — область видимости identifiers, объявленных внутри функции.

Рассуждение:

Function-local identifiers visible inside function и hidden from outside.

Типичная ошибка:

Пытаться читать function-local variable после вызова функции.

Automation QA connection:

Helper implementation details должны оставаться в helper scope.

### 5. Block Scope

Ответ:

Block Scope — область видимости внутри `{ ... }` для `let` и `const`.

Рассуждение:

Identifier, объявленный через `const` внутри `if`, visible внутри блока.

Типичная ошибка:

Ожидать block-local value after block.

Automation QA connection:

Block Scope помогает держать temporary assertion data рядом с проверкой.

### 6. Parent scope

Ответ:

Parent scope — внешний scope по отношению к текущему.

Рассуждение:

Для block scope parent может быть function scope.

Типичная ошибка:

Думать, что parent scope всегда Global Scope.

Automation QA connection:

Test scope может быть parent для block-level assertion setup.

### 7. Child scope

Ответ:

Child scope — вложенный scope внутри parent scope.

Рассуждение:

Function scope является child для Global Scope, а block scope может быть child для function scope.

Типичная ошибка:

Ожидать, что parent видит all child identifiers.

Automation QA connection:

Fixture internals могут быть child scope по отношению к test runner logic и не обязаны быть visible.

### 8. Scope Chain

Ответ:

Scope Chain — conceptual chain outward scopes, по которой engine ищет identifier.

Рассуждение:

Lookup starts in current scope, then parent, then parent of parent.

Типичная ошибка:

Путать Scope Chain с Call Stack.

Automation QA connection:

Это помогает понимать, почему helper читает global config, но test не читает helper-local variables.

### 9. Identifier lookup

Ответ:

Identifier lookup — процесс поиска visible identifier.

Рассуждение:

Engine проверяет current scope и движется outward until found or failed.

Типичная ошибка:

Думать, что engine ищет имя по всему файлу.

Automation QA connection:

При debugging undefined/ReferenceError нужно понять, в каком scope ищется identifier.

### 10. Variable shadowing

Ответ:

Shadowing происходит, когда inner scope объявляет identifier с тем же name, что и outer scope.

Рассуждение:

Lookup использует ближайший visible identifier.

Типичная ошибка:

Думать, что outer variable была перезаписана.

Automation QA connection:

Shadowing `status` или `userName` в tests может запутать expected и actual values.

### 11. Visibility vs lifetime

Ответ:

Visibility отвечает, где identifier можно access. Lifetime отвечает, как долго информация существует или нужна.

Рассуждение:

Это связанные, но разные вопросы.

Типичная ошибка:

Считать invisible identifier удаленным во всех смыслах.

Automation QA connection:

Debugging test data требует отдельно думать о доступности имени и о времени жизни данных.

### 12. Scope Chain не Call Stack

Ответ:

Call Stack управляет active Execution Contexts. Scope Chain управляет conceptual lookup path для identifiers.

Рассуждение:

Это разные механизмы: один про выполнение, другой про видимость имен.

Типичная ошибка:

Объяснять видимость переменных порядком вызовов функций.

Automation QA connection:

Stack trace показывает call path, но не заменяет анализ scopes.

## Determine variable visibility

### Фрагмент 1

Ответ:

`baseUrl` declared in Global Scope. Он visible в Global Scope и может быть найден внутри `printBaseUrl` через outward lookup.

Рассуждение:

Function scope не имеет local `baseUrl`, поэтому lookup идет в parent Global Scope.

Типичная ошибка:

Считать, что функция видит только local variables.

Automation QA connection:

Helpers часто читают global stable configuration.

### Фрагмент 2

Ответ:

`userName` visible inside `prepareUser` only.

Рассуждение:

Он declared in Function Scope.

Типичная ошибка:

Ожидать access к `userName` после `prepareUser()`.

Automation QA connection:

Temporary helper data не должна протекать в тест.

### Фрагмент 3

Ответ:

`expectedStatus` visible inside block only.

Рассуждение:

`const` внутри `{ ... }` создает block-scoped identifier.

Типичная ошибка:

Читать `expectedStatus` after block.

Automation QA connection:

Temporary assertion values можно ограничивать block scope.

## Identify Scope

Ответ:

Global Scope:

```text
baseUrl
buildLoginUrl
```

Function Scope:

```text
path
```

Block Scope:

```text
fullUrl
```

Lookup path для `baseUrl` внутри блока:

```text
Block Scope
│
▼
Function Scope
│
▼
Global Scope: baseUrl found
```

Lookup path для `path` внутри блока:

```text
Block Scope
│
▼
Function Scope: path found
```

Рассуждение:

Lookup starts from current block and moves outward only.

Типичная ошибка:

Искать `baseUrl` directly in Global without checking current and function scopes.

Automation QA connection:

Так строятся helpers, которые используют local path и outer config.

## Predict output before running

### Задача 1

Ответ:

```text
local
global
```

Рассуждение:

Inside function local `status` shadows global `status`. Outside function lookup finds global `status`.

Типичная ошибка:

Ожидать два раза `global`.

Automation QA connection:

Shadowing может запутать expected status в тестах.

### Задача 2

Ответ:

```text
login
active
```

Рассуждение:

Block can read outer `testName` and its own `expectedStatus`.

Типичная ошибка:

Думать, что block не видит global identifiers.

Automation QA connection:

Assertion block может читать test-level data.

### Задача 3

Ответ:

```text
https://example.com/profile
```

Рассуждение:

Function scope has `path`; `baseUrl` found in Global Scope through outward lookup.

Типичная ошибка:

Считать `baseUrl` inaccessible because it is outside function.

Automation QA connection:

Page helpers часто соединяют global config and local route.

## Debugging

### Задача 1

Ответ:

`userName` declared inside Function Scope and visible only there.

Рассуждение:

Global Scope cannot search inside `prepareUser` function scope.

Типичная ошибка:

Думать, что function call exports local variables.

Automation QA connection:

Helper должен return нужное значение, если тест должен его использовать. `return` будет изучаться позже подробнее.

### Задача 2

Ответ:

Выводится `local`, потому что local `status` shadows global `status`.

Рассуждение:

Lookup starts in current function scope and stops at first match.

Типичная ошибка:

Игнорировать declaration inside function.

Automation QA connection:

Имена `status`, `response`, `user` лучше делать точнее, чтобы избегать accidental shadowing.

### Задача 3

Ответ:

Global mutable state может сделать тесты зависимыми от порядка выполнения.

Рассуждение:

`testA` меняет global `currentUserName`, а `testB` читает текущее global value. Это связывает независимые сценарии.

Типичная ошибка:

Использовать global variable как shared scratchpad.

Automation QA connection:

Параллельные или независимые Playwright tests должны минимизировать shared mutable state.

## QA-oriented tasks

### Сценарий 1

Ответ:

`requestBody`, `normalizedEmail`, `responseStatus` должны оставаться helper-local, если тесту нужен только итог helper.

Рассуждение:

Scope скрывает implementation details и уменьшает поверхность ошибок.

Типичная ошибка:

Делать helper internals global для удобства debugging.

Automation QA connection:

Чистый helper проще переиспользовать и менять.

### Сценарий 2

Ответ:

`authToken` не обязан быть visible в тесте, если тест использует только готовую страницу или session.

Рассуждение:

Fixture может скрывать setup details. Тест видит то, что нужно сценарию, а не весь механизм подготовки.

Типичная ошибка:

Раскрывать fixture internals в каждом тесте.

Automation QA connection:

Это повышает readability Playwright tests и снижает coupling.

### Сценарий 3

Ответ:

Shadowing problematic, если reader ожидает test-level `expectedStatus`, но helper использует local identifier с тем же name.

Рассуждение:

Lookup берет nearest identifier, поэтому одинаковые names в nested scopes могут скрыть смысл.

Типичная ошибка:

Называть все status-like values одинаково.

Automation QA connection:

Лучше использовать precise names: `expectedUserStatus`, `apiResponseStatus`, `uiStatusText`.

## Mini-project

Один из вариантов:

```javascript
const baseUrl = 'https://example.com';

function testLogin() {
  const userName = 'qa-user';
  const expectedStatus = 'active';

  if (true) {
    const actualStatus = 'active';

    console.log(baseUrl);
    console.log(userName);
    console.log(expectedStatus);
    console.log(actualStatus);
  }
}

testLogin();
console.log(baseUrl);
```

Scope diagram:

```text
Global Scope
├── baseUrl
└── testLogin
    │
    ▼
    Function Scope: testLogin
    ├── userName
    └── expectedStatus
        │
        ▼
        Block Scope
        └── actualStatus
```

Visibility:

```text
baseUrl        → visible in Global, Function, Block through outward lookup
testLogin      → visible in Global
userName       → visible inside testLogin and nested block
expectedStatus → visible inside testLogin and nested block
actualStatus   → visible inside block only
```

Рассуждение:

Inner block can search outward to function and global scopes. Global Scope cannot read function-local or block-local identifiers.

Типичная ошибка:

Пытаться read `actualStatus` after the block.

Automation QA connection:

Это модель Playwright test: global config, test-local data, block-local assertion details.

## Возможные улучшения

После выполнения практики можно:

* взять один реальный тест и нарисовать его scopes;
* найти all global mutable variables;
* переименовать shadowed identifiers в более точные names;
* вернуться к этой главе перед Lexical Environment.
