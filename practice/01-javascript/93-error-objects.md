# Практика: Error Objects

## Концептуальные вопросы

1. Почему `throw new Error()` лучше, чем `throw 'message'`?
2. Для чего нужны свойства `message` и `name`?
3. Почему stack trace полезен для отладки, но не должен парситься программно?
4. Когда уместно создать custom Error class?
5. Почему в Automation QA helper должен выбрасывать понятную ошибку?

## Чтение кода

Что попадет в `catch`?

```javascript
function readConfig(config) {
  if (!config.baseUrl) {
    throw new Error('baseUrl is required');
  }

  return config.baseUrl;
}

try {
  readConfig({});
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}
```

## Предскажите результат

Что выведет код?

```javascript
try {
  throw new TypeError('Expected object');
} catch (error) {
  console.log(error.name);
}
```

## Задание на отладку

Почему такой код хуже для отладки?

```javascript
function assertResponse(response) {
  if (!response.ok) {
    throw 'Response failed';
  }
}
```

Перепишите идею так, чтобы helper выбрасывал Error object.

## Задание Automation QA

Напишите helper `assertStatusCode(response, expectedStatus)`.

Если `response.status` не равен `expectedStatus`, helper должен выбросить Error object с понятным сообщением.

## Мини-проект

Создайте custom Error class `InvalidTestDataError`.

Затем напишите функцию `validateUserData(user)`, которая проверяет:

* есть ли `email`;
* есть ли `role`;
* является ли `role` строкой.

При ошибке выбрасывайте `InvalidTestDataError`.
