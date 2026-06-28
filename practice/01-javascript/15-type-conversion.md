# Практика. Глава 18. Type Conversion

## Концептуальные вопросы

Ответьте своими словами.

1. Почему type conversion exists?
2. Что означает вопрос: "Какой тип ожидает эта операция?"
3. Что такое implicit conversion?
4. Что такое explicit conversion?
5. Почему explicit conversion часто лучше в тестах?
6. Что делает `Number()`?
7. Когда `Number()` can produce `NaN`?
8. Что делает `String()`?
9. Что делает `Boolean()`?
10. Что такое truthy value?
11. Что такое falsy value?
12. Почему conversion is not random?
13. Почему equality has its own chapter?

## Определите преобразования

Для каждого выражения укажите:

* implicit or explicit conversion;
* what type operation expects;
* expected result.

### Задача 1

```javascript
Number('200');
```

### Задача 2

```javascript
String(false);
```

### Задача 3

```javascript
Boolean('');
```

### Задача 4

```javascript
'5' - 1;
```

### Задача 5

```javascript
'5' + 1;
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
console.log(Number('5'));
console.log(Number(''));
console.log(Number('abc'));
console.log(Number(undefined));
console.log(Number(null));
```

### Задача 2

```javascript
console.log(String(200));
console.log(String(true));
console.log(String(null));
console.log(String(undefined));
```

### Задача 3

```javascript
console.log(Boolean('false'));
console.log(Boolean('0'));
console.log(Boolean(''));
console.log(Boolean(0));
console.log(Boolean(1));
console.log(Boolean(NaN));
```

### Задача 4

```javascript
console.log('5' + 1);
console.log('5' - 1);
console.log('5' * 2);
```

## Упражнения на truthy и falsy

Разделите значения на truthy and falsy.

```javascript
false;
true;
0;
1;
'';
'hello';
'false';
'0';
null;
undefined;
NaN;
[];
{};
```

## Чтение кода

Прочитайте код и ответьте:

1. Где hidden conversion?
2. Где explicit conversion?
3. Где может появиться bug?
4. Как переписать код clearer?

```javascript
const retriesFromEnv = '3';
const headlessFromEnv = 'false';

const retryCount = retriesFromEnv + 1;
const headless = Boolean(headlessFromEnv);

console.log(retryCount);
console.log(headless);
```

## Задачи на отладку

### Задача 1

Тест ожидал `4`, но получил `'31'`.

```javascript
const retriesFromEnv = '3';
const nextRetry = retriesFromEnv + 1;

console.log(nextRetry);
```

Объясните проблему и исправьте код.

### Задача 2

Тест включил headless mode, хотя env value was `'false'`.

```javascript
const headlessFromEnv = 'false';
const headless = Boolean(headlessFromEnv);

console.log(headless);
```

Объясните проблему.

### Задача 3

API вернул price as string:

```javascript
const priceFromApi = 'not available';
const price = Number(priceFromApi);

console.log(price);
```

Что произошло and why?

## QA-задачи

### Сценарий 1. API returns string status code

API-ответ:

```json
{
  "statusCode": "200"
}
```

Тест ожидает numeric status code. Напишите conversion and explain why.

### Сценарий 2. Form значения

UI form returns age as string:

```javascript
const ageFromInput = '30';
```

Нужно использовать age in numeric calculation. Напишите код.

### Сценарий 3. Environment variables

Values:

```javascript
const retriesFromEnv = '2';
const headlessFromEnv = 'false';
```

Parse them intentionally for test config.

### Сценарий 4. Hidden conversion audit

Составьте checklist для поиска hidden conversion bugs in tests.

## Мини-проект

Создайте файл:

```text
playground/type-conversion-report.js
```

В нем:

1. Создайте объект `rawConfig`:
   * `retries: '3'`;
   * `headless: 'false'`;
   * `timeoutMs: '5000'`;
   * `baseUrl: 'https://example.com'`.
2. Создайте объект `parsedConfig`:
   * `retries` as Number;
   * `headless` as Boolean using explicit string check;
   * `timeoutMs` as Number;
   * `baseUrl` as String.
3. Выведите both objects.
4. Выведите `typeof` for every parsed property.
5. Добавьте report table:

```text
Property | Raw value | Raw type | Parsed value | Parsed type | Why conversion is needed
```
