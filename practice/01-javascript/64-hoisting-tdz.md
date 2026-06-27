# Практика: Hoisting + TDZ

## Концептуальные вопросы

1. Почему hoisting не означает перемещение строк кода?
2. Почему function declaration можно вызвать до строки declaration?
3. Что получает `var` during Creation Phase?
4. В каком state находятся `let` и `const` до initialization?
5. Чем `undefined` before assignment отличается от TDZ?

## Чтение кода

```javascript
a();

function a() {
  b();
}

function b() {
  c();
}

function c() {
  console.log('c');
}
```

Объясните, почему вызов `a()` работает before function declarations.

## Предскажите результат выполнения

```javascript
function c() {
  console.log(value);

  var value = 'inside c';

  console.log(value);
}

c();
```

Сначала запишите output без запуска.

## Debugging

Найдите причину ошибки:

```javascript
function c() {
  console.log(message);

  let message = 'inside c';
}

c();
```

Объясните state `message` в момент `console.log(message)`.

## QA analogy

В test helper читается `baseUrl`, но `const baseUrl = ...` находится ниже.

Почему это не то же самое, что function declaration hoisting?

## Мини-сценарий

Напишите три коротких примера:

* function declaration called before declaration line;
* `var` read before assignment;
* safe `let` usage after initialization.

После каждого примера подпишите lifecycle identifier.
