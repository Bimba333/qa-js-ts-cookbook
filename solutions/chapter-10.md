# Решения. Глава 10. Scope

## Концептуальные вопросы

### 1. Зачем существует Scope

Ответ:

Scope существует, чтобы определить, где identifiers visible и откуда к ним можно обращаться.

Объяснение:

Без Scope все names были бы visible everywhere, что приводило бы к collisions и неуправляемому состоянию.

Распространённая ошибка:

Считать Scope дополнительным синтаксисом, а не правилом видимости.

Связь с Automation QA:

Scope помогает изолировать test data, helper internals и fixture setup.

### 2. Visibility of identifiers

Ответ:

Visibility означает, можно ли access identifier из текущего места кода.

Объяснение:

Identifier может существовать внутри функции, но быть invisible снаружи.

Распространённая ошибка:

Думать, что если функция была вызвана, ее local identifiers стали доступны outside.

Связь с Automation QA:

Helper-local values не должны случайно использоваться тестом напрямую.

### 3. Global Scope

Ответ:

Global Scope — внешний scope программы или файла.

Объяснение:

Identifiers в Global Scope могут быть найдены при outward lookup из inner scopes.

Распространённая ошибка:

Хранить весь test state globally.

Связь с Automation QA:

Global Scope подходит для stable constants в маленьких примерах, но global mutable state опасен.

### 4. Function Scope

Ответ:

Function Scope — область видимости identifiers, объявленных внутри функции.

Объяснение:

Function-local identifiers visible inside function и hidden from outside.

Распространённая ошибка:

Пытаться читать function-local variable после вызова функции.

Связь с Automation QA:

Helper implementation details должны оставаться в helper scope.

### 5. Block Scope

Ответ:

Block Scope — область видимости внутри `{ ... }` для `let` и `const`.

Объяснение:

Identifier, объявленный через `const` внутри `if`, visible внутри блока.

Распространённая ошибка:

Ожидать block-local value after block.

Связь с Automation QA:

Block Scope помогает держать temporary assertion data рядом с проверкой.

### 6. Parent scope

Ответ:

Parent scope — внешний scope по отношению к текущему.

Объяснение:

Для block scope parent может быть function scope.

Распространённая ошибка:

Думать, что parent scope всегда Global Scope.

Связь с Automation QA:

Test scope может быть parent для block-level assertion setup.

### 7. Child scope

Ответ:

Child scope — вложенный scope внутри parent scope.

Объяснение:

Function scope является child для Global Scope, а block scope может быть child для function scope.

Распространённая ошибка:

Ожидать, что parent видит all child identifiers.

Связь с Automation QA:

Fixture internals могут быть child scope по отношению к test runner logic и не обязаны быть visible.

### 8. Scope Chain

Ответ:

Scope Chain — conceptual chain outward scopes, по которой engine ищет identifier.

Объяснение:

Lookup starts in current scope, then parent, then parent of parent.

Распространённая ошибка:

Путать Scope Chain с Call Stack.

Связь с Automation QA:

Это помогает понимать, почему helper читает global config, но test не читает helper-local variables.

### 9. Identifier lookup

Ответ:

Identifier lookup — процесс поиска visible identifier.

Объяснение:

Engine проверяет current scope и движется outward until found or failed.

Распространённая ошибка:

Думать, что engine ищет имя по всему файлу.

Связь с Automation QA:

При debugging undefined/ReferenceError нужно понять, в каком scope ищется identifier.

### 10. Variable shadowing

Ответ:

Shadowing происходит, когда inner scope объявляет identifier с тем же name, что и outer scope.

Объяснение:

Lookup использует ближайший visible identifier.

Распространённая ошибка:

Думать, что outer variable была перезаписана.

Связь с Automation QA:

Shadowing `status` или `userName` в tests может запутать expected и actual values.

### 11. Visibility vs lifetime

Ответ:

Visibility отвечает, где identifier можно access. Lifetime отвечает, как долго информация существует или нужна.

Объяснение:

Это связанные, но разные вопросы.

Распространённая ошибка:

Считать invisible identifier удаленным во всех смыслах.

Связь с Automation QA:

Debugging test data требует отдельно думать о доступности имени и о времени жизни данных.

### 12. Scope Chain не Call Stack

Ответ:

Call Stack управляет active Execution Contexts. Scope Chain управляет conceptual lookup path для identifiers.

Объяснение:

Это разные механизмы: один про выполнение, другой про видимость имен.

Распространённая ошибка:

Объяснять видимость переменных порядком вызовов функций.

Связь с Automation QA:

Stack trace показывает call path, но не заменяет анализ scopes.

## Определите видимость переменных

### Фрагмент 1

Ответ:

`baseUrl` declared in Global Scope. Он visible в Global Scope и может быть найден внутри `printBaseUrl` через outward lookup.

Объяснение:

Function scope не имеет local `baseUrl`, поэтому lookup идет в parent Global Scope.

Распространённая ошибка:

Считать, что функция видит только local variables.

Связь с Automation QA:

Helpers часто читают global stable configuration.

### Фрагмент 2

Ответ:

`userName` visible inside `prepareUser` only.

Объяснение:

Он declared in Function Scope.

Распространённая ошибка:

Ожидать access к `userName` после `prepareUser()`.

Связь с Automation QA:

Temporary helper data не должна протекать в тест.

### Фрагмент 3

Ответ:

`expectedStatus` visible inside block only.

Объяснение:

`const` внутри `{ ... }` создает block-scoped identifier.

Распространённая ошибка:

Читать `expectedStatus` after block.

Связь с Automation QA:

Temporary assertion values можно ограничивать block scope.

## Определите Scope

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

Объяснение:

Lookup starts from current block and moves outward only.

Распространённая ошибка:

Искать `baseUrl` directly in Global without checking current and function scopes.

Связь с Automation QA:

Так строятся helpers, которые используют local path и outer config.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
local
global
```

Объяснение:

Inside function local `status` shadows global `status`. Outside function lookup finds global `status`.

Распространённая ошибка:

Ожидать два раза `global`.

Связь с Automation QA:

Shadowing может запутать expected status в тестах.

### Задача 2

Ответ:

```text
login
active
```

Объяснение:

Block can read outer `testName` and its own `expectedStatus`.

Распространённая ошибка:

Думать, что block не видит global identifiers.

Связь с Automation QA:

Assertion block может читать test-level data.

### Задача 3

Ответ:

```text
https://example.com/profile
```

Объяснение:

Function scope has `path`; `baseUrl` found in Global Scope through outward lookup.

Распространённая ошибка:

Считать `baseUrl` inaccessible because it is outside function.

Связь с Automation QA:

Page helpers часто соединяют global config and local route.

## Задачи на отладку

### Задача 1

Ответ:

`userName` declared inside Function Scope and visible only there.

Объяснение:

Global Scope cannot search inside `prepareUser` function scope.

Распространённая ошибка:

Думать, что function call exports local variables.

Связь с Automation QA:

Helper должен return нужное значение, если тест должен его использовать. `return` будет изучаться позже подробнее.

### Задача 2

Ответ:

Выводится `local`, потому что local `status` shadows global `status`.

Объяснение:

Lookup starts in current function scope and stops at first match.

Распространённая ошибка:

Игнорировать declaration inside function.

Связь с Automation QA:

Имена `status`, `response`, `user` лучше делать точнее, чтобы избегать accidental shadowing.

### Задача 3

Ответ:

Global mutable state может сделать тесты зависимыми от порядка выполнения.

Объяснение:

`testA` меняет global `currentUserName`, а `testB` читает текущее global value. Это связывает независимые сценарии.

Распространённая ошибка:

Использовать global variable как shared scratchpad.

Связь с Automation QA:

Параллельные или независимые Playwright tests должны минимизировать shared mutable state.

## QA-задачи

### Сценарий 1

Ответ:

`requestBody`, `normalizedEmail`, `responseStatus` должны оставаться helper-local, если тесту нужен только итог helper.

Объяснение:

Scope скрывает implementation details и уменьшает поверхность ошибок.

Распространённая ошибка:

Делать helper internals global для удобства debugging.

Связь с Automation QA:

Чистый helper проще переиспользовать и менять.

### Сценарий 2

Ответ:

`authToken` не обязан быть visible в тесте, если тест использует только готовую страницу или session.

Объяснение:

Fixture может скрывать setup details. Тест видит то, что нужно сценарию, а не весь механизм подготовки.

Распространённая ошибка:

Раскрывать fixture internals в каждом тесте.

Связь с Automation QA:

Это повышает readability Playwright tests и снижает coupling.

### Сценарий 3

Ответ:

Shadowing problematic, если reader ожидает test-level `expectedStatus`, но helper использует local identifier с тем же name.

Объяснение:

Lookup берет nearest identifier, поэтому одинаковые names в nested scopes могут скрыть смысл.

Распространённая ошибка:

Называть все status-like values одинаково.

Связь с Automation QA:

Лучше использовать precise names: `expectedUserStatus`, `apiResponseStatus`, `uiStatusText`.

## Мини-проект

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

Объяснение:

Inner block can search outward to function and global scopes. Global Scope cannot read function-local or block-local identifiers.

Распространённая ошибка:

Пытаться read `actualStatus` after the block.

Связь с Automation QA:

Это модель Playwright test: global config, test-local data, block-local assertion details.

## Возможные улучшения

После выполнения практики можно:

* взять один реальный тест и нарисовать его scopes;
* найти all global mutable variables;
* переименовать shadowed identifiers в более точные names;
* вернуться к этой главе перед Lexical Environment.
