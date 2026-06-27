# Практика: Call Stack

## Концептуальные вопросы

1. Зачем JavaScript нужен Call Stack?
2. Что происходит со stack при function call?
3. Что происходит со stack, когда function завершается?
4. Почему после `c()` JavaScript возвращается в `b()`?
5. Что означает правило: выполняется top frame?

## Чтение кода

```javascript
function c() {
  console.log('c');
}

function b() {
  c();
  console.log('b');
}

function a() {
  b();
  console.log('a');
}

a();
```

Нарисуйте Call Stack в момент, когда выполняется `c()`.

## Предскажите результат выполнения

```javascript
function c() {
  console.log('enter c');
  console.log('leave c');
}

function b() {
  console.log('enter b');
  c();
  console.log('leave b');
}

function a() {
  console.log('enter a');
  b();
  console.log('leave a');
}

a();
```

Сначала запишите output без запуска.

## Debugging

Есть stack trace:

```text
Error: Failure inside c
    at c
    at b
    at a
```

Где возникла ошибка? Какие functions привели execution к этому месту?

## QA analogy

Сравните:

```text
test -> helper -> assertion
```

и:

```text
a -> b -> c
```

Что в этой аналогии соответствует top stack frame?

## Мини-сценарий

Напишите `a()`, `b()`, `c()` так, чтобы каждая function печатала:

* `enter <name>`;
* вызов следующей function, если она есть;
* `leave <name>`.

После кода нарисуйте порядок push/pop для всех functions.
