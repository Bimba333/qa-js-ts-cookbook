# Практика: Execution Context

## Концептуальные вопросы

1. Что создается, когда JavaScript начинает выполнять файл?
2. Когда создается Function Execution Context?
3. Почему function declaration не означает немедленное выполнение function body?
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

* какой context создается при запуске файла;
* какой context создается при вызове `a()`;
* какой context создается при вызове `b()`;
* какой context создается при вызове `c()`.

## Предскажите результат выполнения

```javascript
function a() {
  console.log('a');
}

console.log('before');
a();
console.log('after');
```

Сначала запишите output без запуска.

## Debugging

Автор ожидал, что `message` будет доступен outside function:

```javascript
function c() {
  const message = 'inside c';
}

c();
console.log(message);
```

Объясните, почему это не работает через модель Execution Context.

## QA analogy

Коротко сопоставьте:

```text
test runner creates test execution
JavaScript creates Execution Context
```

Не расширяйте аналогию. Укажите только, в чем они похожи.

## Мини-сценарий

Напишите файл, где:

* `a()` вызывает `b()`;
* `b()` вызывает `c()`;
* `c()` создает local variable `message`;
* `c()` печатает `message`.

После кода подпишите, какой function call создает какой Function Execution Context.
