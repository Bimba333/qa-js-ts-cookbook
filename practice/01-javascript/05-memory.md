# Практика. Глава 8. Memory

## Концептуальные вопросы

Ответьте своими словами.

1. Почему любой программе нужна memory?
2. Что такое value на концептуальном уровне?
3. Что такое identifier?
4. Почему identifier и value нельзя считать одним и тем же?
5. Что значит store value?
6. Что значит read value?
7. Что значит update value?
8. Чем temporary information отличается от long-lived information?
9. Как memory связана с Execution Context?
10. Как memory связана с Call Stack?
11. Почему эта глава не объясняет Stack & Heap?
12. Почему эта глава не объясняет Garbage Collector?

## Определите сохраненные значения

Для каждого фрагмента выпишите identifiers и значения, которые можно увидеть в коде.

### Фрагмент 1

```javascript
const testStatus = 'passed';

console.log(testStatus);
```

### Фрагмент 2

```javascript
const browserName = 'chromium';
const retryCount = 2;

console.log(browserName);
console.log(retryCount);
```

### Фрагмент 3

```javascript
let pageTitle = 'Login';

pageTitle = 'Dashboard';

console.log(pageTitle);
```

## Предскажите вывод перед запуском

Перед запуском предскажите вывод и memory состояние после каждой значимой строки.

### Задача 1

```javascript
let status = 'created';

console.log(status);

status = 'finished';

console.log(status);
```

### Задача 2

```javascript
const prefix = 'qa';
const userName = prefix + '-user';

console.log(userName);
```

### Задача 3

```javascript
const environment = 'staging';

console.log(environment);
console.log(environment);
```

## Предскажите состояние памяти

Для кода ниже заполните таблицу:

```text
Step | Operation | Memory state
```

Код:

```javascript
let attempt = 1;

attempt = 2;
attempt = 3;

console.log(attempt);
```

## Чтение кода

Прочитайте код и объясните, какая информация temporary, а какая long-lived.

```javascript
const testName = 'checkout';
const message = 'Running test: ' + testName;

console.log(message);
console.log(testName);
```

## Небольшие задачи на код

### Задача 1

Создайте файл:

```text
playground/memory-store-read.js
```

В файле:

* сохраните имя браузера;
* выведите его два раза;
* перед каждым выводом мысленно отметьте операцию read.

### Задача 2

Создайте файл:

```text
playground/memory-update.js
```

В файле:

* сохраните status со значением `'new'`;
* обновите status на `'done'`;
* выведите итоговое значение.

## Задачи на отладку

### Задача 1

Инженер ожидал увидеть `created`, но получил `finished`.

```javascript
let status = 'created';

status = 'finished';

console.log(status);
```

Объясните ошибку в mental model.

### Задача 2

Инженер видит неправильный URL в тесте:

```javascript
let baseUrl = 'https://staging.example.com';

baseUrl = 'https://prod.example.com';

console.log(baseUrl);
```

Объясните, почему нужно искать строку update, а не только строку read.

## QA-задачи

### Сценарий 1

Playwright-тест готовит test data:

```text
store userName
store password
read userName in login step
read password in login step
```

Нарисуйте conceptual memory состояние перед login step.

### Сценарий 2

Fixture подготовила `baseUrl`, helper прочитал `baseUrl`, а тест открыл неправильную страницу.

Ответьте:

1. Где могла появиться ошибка?
2. Почему stack trace недостаточно без memory model?
3. Какую таблицу memory состояние вы бы составили?

### Сценарий 3

Assertion сравнивает expected status с actual status.

Опишите, какие значения должны быть сохранены до сравнения.

## Мини-проект

Создайте файл:

```text
playground/memory-timeline.js
```

В нем должно быть:

* `baseUrl` со значением `'https://example.com'`;
* `path` со значением `'/login'`;
* `loginUrl`, который получается из `baseUrl` и `path`;
* вывод `loginUrl`;
* `status`, который сначала равен `'created'`, а потом обновляется на `'ready'`;
* вывод итогового `status`.

После кода нарисуйте временная шкала:

```text
store baseUrl
store path
temporary combine baseUrl + path
store loginUrl
read loginUrl
store status
update status
read status
```
