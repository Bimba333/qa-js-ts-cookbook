# Практика: Execution Context

## Концептуальные вопросы

1. Что создается, когда JavaScript начинает выполнять файл?
2. Когда создается Function Execution Context?
3. Почему объявление функции не означает немедленное выполнение тела функции?
4. Чем Global Execution Context отличается от Function Execution Context?
5. Как Execution Context связан с примером `a() -> b() -> c()`?

## Чтение кода

```javascript
function c() {
  const message = 'inside c';
  console.log(message);
}

function b() {
  c();
}

function a() {
  b();
}

a();
```

Опишите:

* какой Execution Context создается при запуске файла;
* какой Execution Context создается при вызове `a()`;
* какой Execution Context создается при вызове `b()`;
* какой Execution Context создается при вызове `c()`.

## Предскажите результат выполнения

```javascript
function a() {
  console.log('a');
}

console.log('before');
a();
console.log('after');
```

Сначала запишите вывод без запуска.

## Отладка

Автор ожидал, что `message` будет доступен вне функции:

```javascript
function c() {
  const message = 'inside c';
}

c();
console.log(message);
```

Объясните, почему это не работает через модель Execution Context.

## QA-аналогия

Коротко сопоставьте:

```text
тестовый раннер создает выполнение теста
JavaScript создает Execution Context
```

Не расширяйте аналогию. Укажите только, в чем они похожи.

## Мини-сценарий

Напишите файл, где:

* `a()` вызывает `b()`;
* `b()` вызывает `c()`;
* `c()` создает локальную переменную `message`;
* `c()` печатает `message`.

После кода подпишите, какой вызов функции создает какой Function Execution Context.
