# Решения. Глава 7. Call Stack

## Концептуальные вопросы

### 1. Что такое Call Stack

Ответ:

Call Stack — структура, которая хранит активные Execution Contexts и определяет, какой context выполняется сейчас.

Рассуждение:

Execution Context описывает рабочую среду. Call Stack управляет порядком таких сред.

Типичная ошибка:

Считать Call Stack самим Execution Context.

Automation QA connection:

Stack traces в тестах отражают цепочку вызовов, связанную с Call Stack.

### 2. Почему Call Stack нужен после Execution Context

Ответ:

Потому что во время nested function calls активных contexts может быть несколько, и engine должен знать, какой выполнять сейчас и куда вернуться.

Рассуждение:

Без Call Stack engine не смог бы корректно вернуться из inner function в outer function.

Типичная ошибка:

Объяснять возврат из функции только порядком строк.

Automation QA connection:

Это помогает понимать цепочки test → fixture → helper → utility.

### 3. Push

Ответ:

Push — добавление нового Execution Context на верх Call Stack.

Рассуждение:

Function call создает Function Execution Context и помещает его сверху.

Типичная ошибка:

Думать, что push происходит при объявлении функции.

Automation QA connection:

Метод Page Object попадает в stack при вызове, а не при объявлении класса или объекта.

### 4. Pop

Ответ:

Pop — снятие верхнего Execution Context со stack после завершения функции.

Рассуждение:

После pop активным становится предыдущий context.

Типичная ошибка:

Считать, что завершенная функция продолжает занимать верх stack.

Automation QA connection:

Это помогает понимать, почему после helper выполнение возвращается в тест.

### 5. Last in — first out

Ответ:

Последний добавленный context завершается первым.

Рассуждение:

Если `first` вызвал `second`, а `second` вызвал `third`, сначала завершается `third`, затем `second`, затем `first`.

Типичная ошибка:

Ожидать завершение функций в порядке вызова.

### 6. Как engine возвращается

Ответ:

После pop текущего context верхним становится предыдущий context. Engine продолжает выполнение там, где был сделан вызов.

Рассуждение:

Call Stack сохраняет цепочку возврата.

Automation QA connection:

После выполнения helper тест продолжает выполнение со следующего шага.

### 7. Empty stack

Ответ:

Call Stack становится empty, когда завершен Global Execution Context.

Рассуждение:

Для синхронной программы это означает, что выполнять больше нечего.

Типичная ошибка:

Переносить сюда async-поведение. Оно будет изучаться позже.

### 8. Stack trace

Ответ:

Stack trace — текстовая цепочка вызовов, которая привела к ошибке.

Рассуждение:

Он помогает понять не только место ошибки, но и путь до нее.

Automation QA connection:

В Playwright stack trace помогает найти, упал тест, Page Object, fixture или helper.

### 9. Stack overflow

Ответ:

Stack overflow — ситуация, когда активных вызовов стало слишком много и stack больше не может расти.

Рассуждение:

Частая причина — рекурсия без корректной остановки.

Типичная ошибка:

Путать stack overflow со stack trace.

### 10. Почему не Event Loop

Ответ:

Сначала нужно понять синхронный Call Stack. Event Loop объясняет асинхронное возвращение работы в stack и будет изучаться позже.

Рассуждение:

Без базовой модели stack async будет выглядеть магией.

## Предскажите Call Stack

Файл:

```text
examples/chapter-07/02-nested-calls.js
```

Ожидаемый вывод:

```text
first start
second start
third
second finish
first finish
```

Максимальное состояние Call Stack:

```text
Call Stack
├── third
├── second
├── first
└── Global
```

Порядок pop:

```text
pop third
pop second
pop first
pop Global
```

Рассуждение:

Каждый nested call добавляет context сверху. Завершение идет в обратном порядке.

Типичная ошибка:

Ожидать `first finish` до выполнения `third`.

Automation QA connection:

Так же читаются вложенные вызовы helper-функций в тестовом фреймворке.

## Нарисуйте stack вручную

После старта:

```text
Call Stack
└── Global
```

После `loadConfig`:

```text
Call Stack
├── loadConfig
└── Global
```

После `readFilePath`:

```text
Call Stack
├── readFilePath
├── loadConfig
└── Global
```

После `normalizePath`:

```text
Call Stack
├── normalizePath
├── readFilePath
├── loadConfig
└── Global
```

После завершения `normalizePath`:

```text
Call Stack
├── readFilePath
├── loadConfig
└── Global
```

После завершения всех функций:

```text
Call Stack
└── empty
```

Рассуждение:

Stack растет при вызовах и уменьшается при завершениях.

Типичная ошибка:

Снимать нижний context раньше верхнего.

Automation QA connection:

Это ровно та модель, которая нужна для чтения stack trace.

## Debugging

### Задача 1

Ответ:

Ошибка возникла в `buildUserData`.

`buildUserData` была вызвана из `createUser`.

Цепочка началась с `testScenario`.

Рассуждение:

Файл намеренно выбрасывает ошибку в глубокой функции. Stack trace показывает путь вызовов.

Типичная ошибка:

Читать только сообщение `Invalid user data` и не смотреть цепочку.

Automation QA connection:

В тестах ошибка может проявиться в utility, но начаться из неверного test setup.

### Задача 2

Ответ:

Нужно прочитать всю цепочку, потому что utility мог получить неверные данные от caller.

Рассуждение:

Stack trace помогает понять не только где упало, но и кто вызвал проблемный код.

Типичная ошибка:

Исправлять нижний helper, хотя ошибка вызвана неправильным аргументом из fixture.

Automation QA connection:

Это снижает риск чинить не тот слой framework.

## QA-сценарии

### Сценарий 1

Call Stack в момент `assertHeader`:

```text
Call Stack
├── assertHeader
├── waitForLoaded
├── profilePage.open
├── test
└── Global / runner context
```

Рассуждение:

Каждый вызов метода или функции добавляет context.

Типичная ошибка:

Думать, что в stack будет только строка теста.

Automation QA connection:

Page Object скрывает несколько внутренних вызовов за одной строкой теста.

### Сценарий 2

Ответ:

Если fixture вызывает `createUser`, а `createUser` вызывает `buildUserData`, ошибка в `buildUserData` может остановить подготовку до первого шага теста.

Схема:

```text
Call Stack
├── buildUserData
├── createUser
├── fixture
└── test runner
```

Рассуждение:

Тест еще не начал основной сценарий, потому что stack находится в цепочке подготовки.

Типичная ошибка:

Искать проблему в первом step теста, хотя ошибка произошла в fixture.

Automation QA connection:

Это частый сценарий падений setup-кода.

### Сценарий 3

Ответ:

Если helper вызывается два раза подряд, его Function Execution Context попадет в Call Stack два раза.

Обычно эти contexts не существуют одновременно, если вызовы последовательные: первый context завершится и будет снят, затем появится второй.

Рассуждение:

Один вызов — один context.

Типичная ошибка:

Считать, что второй вызов переиспользует тот же context.

Automation QA connection:

Так проще анализировать повторные вызовы builders и helpers.

## Мини-проект

Один из возможных вариантов:

```javascript
function startTest() {
  console.log('startTest start');
  prepareData();
  console.log('startTest finish');
}

function prepareData() {
  console.log('prepareData start');
  normalizeData();
  console.log('prepareData finish');
}

function normalizeData() {
  console.log('normalizeData start');
  console.log('normalizeData finish');
}

startTest();
```

Полный lifecycle:

```text
push Global
push startTest
push prepareData
push normalizeData
pop normalizeData
pop prepareData
pop startTest
pop Global
```

Максимальный stack:

```text
Call Stack
├── normalizeData
├── prepareData
├── startTest
└── Global
```

Рассуждение:

`startTest` вызывает `prepareData`, а `prepareData` вызывает `normalizeData`. Поэтому stack растет до `normalizeData`, а затем уменьшается в обратном порядке.

Типичная ошибка:

Рисовать pop в том же порядке, что push.

Automation QA connection:

Это модель типичного тестового сценария: test → data preparation → normalization.

## Возможные улучшения

После выполнения практики можно:

* взять реальный stack trace из тестового проекта и нарисовать его как Call Stack;
* добавить в заметки правило last in — first out;
* повторить эту главу перед изучением recursion;
* вернуться к примерам после главы про Scope.
