# async и await

## Связь с предыдущей главой

Предыдущая глава показала Promise API:

```text
then()
catch()
finally()
```

Теперь мы смотрим на другой способ писать тот же асинхронный поток. `async` и `await` не отменяют Promise и Event Loop. Они дают более читаемую форму записи.

## Главный вопрос

> Почему появились `async` и `await`?

Короткий ответ: чтобы асинхронный код читался как последовательный, оставаясь асинхронным внутри.

## Мотивация

Цепочка Promise может выглядеть так:

```javascript
prepareEnvironment()
  .then(function login(configuration) {
    return executeLogin(configuration);
  })
  .then(function runTests(session) {
    return executeTests(session);
  });
```

С `await` тот же поток читается как последовательность шагов:

```javascript
const configuration = await prepareEnvironment();
const session = await executeLogin(configuration);
const result = await executeTests(session);
```

Это особенно важно в тестах, где порядок действий должен быть очевидным.

## Теория

`async` перед функцией означает: функция всегда возвращает Promise.

```javascript
async function prepareEnvironment() {
  return { environment: 'staging' };
}
```

Даже если внутри возвращается обычное значение, снаружи функция возвращает Promise с этим значением.

`await` используется внутри `async`-функции. Он ожидает завершения Promise и возвращает его успешный результат:

```javascript
const configuration = await prepareEnvironment();
```

`await` не блокирует весь JavaScript. Он приостанавливает выполнение текущей `async`-функции до результата Promise, а остальной механизм асинхронности продолжает работать через Event Loop и очереди.

## Внутренний механизм

Концептуально:

```text
async function
│
▼
возвращает Promise
```

```text
await promise
│
▼
пауза внутри async-функции
│
▼
Promise завершился
│
▼
продолжить функцию с результатом
```

Пока текущая `async`-функция ждет результат, остальной JavaScript продолжает работать обычным образом. Event Loop может обрабатывать другие готовые задачи. Приостанавливается только эта `async`-функция, а не весь JavaScript-код.

Это не новая модель выполнения. Это более удобная запись поверх Promise.

```text
Promise.then(...)
│
▼
await
│
▼
та же асинхронная природа, более линейный код
```

## Главная ментальная модель

Главная модель главы:

```text
async / await
│
▼
синхронно выглядящий код поверх асинхронного выполнения
```

## Практические примеры

Примеры находятся в:

```text
examples/01-javascript/chapter-78/
```

Запуск:

```bash
node examples/01-javascript/chapter-78/01-async-function.js
node examples/01-javascript/chapter-78/02-await.js
node examples/01-javascript/chapter-78/03-return-value.js
node examples/01-javascript/chapter-78/04-qa-flow.js
```

## Пример Automation QA

Тестовый поток:

```javascript
async function runFramework() {
  const configuration = await prepareEnvironment();
  const session = await login(configuration);
  const result = await executeTests(session);
  return generateReport(result);
}
```

Такой код читается как сценарий тестового запуска, но каждый шаг может быть асинхронным.

## Распространённые ошибки

### Ошибка 1. Думать, что `async` делает код синхронным

`async`-функция возвращает Promise. Она не превращает асинхронную работу в синхронную.

### Ошибка 2. Забывать `await`

Если не написать `await`, переменная получит Promise, а не готовый результат.

### Ошибка 3. Использовать `await` вне `async`-функции без понимания контекста

В этой главе используем простое правило: `await` пишется внутри `async`-функции.

## Практика

Практика находится в:

```text
practice/01-javascript/78-async-await.md
```

Решения находятся в:

```text
solutions/01-javascript/78-async-await.md
```

## Краткие итоги

`async` и `await` улучшают читаемость асинхронного кода.

Главное:

* `async`-функция возвращает Promise;
* `await` ожидает результат Promise внутри `async`-функции;
* код выглядит последовательным, но остается асинхронным;
* `await` не блокирует весь JavaScript;
* эта форма особенно удобна для тестовых сценариев.

## Переход к следующей главе

Теперь код стал читаемее.

Следующий вопрос:

> Как правильно обрабатывать ошибки в асинхронном коде?

Ответ — через rejected Promise, `try/catch` и распространение ошибок.
