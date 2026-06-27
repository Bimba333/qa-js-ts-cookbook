# Практика: Memory Model

## Концептуальные вопросы

1. Зачем программе memory во время execution?
2. Что в conceptual model хранится на Stack?
3. Что в conceptual model хранится в Heap?
4. Почему variable with object value удобно рисовать как reference?
5. Почему Stack/Heap model не нужно считать точным описанием engine internals?

## Чтение кода

```javascript
function c() {
  const count = 3;
  const user = { name: 'Anna' };

  console.log(count);
  console.log(user.name);
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

* где в conceptual model находится frame `c`;
* где находится primitive value `3`;
* где находится object `{ name: 'Anna' }`;
* что хранит variable `user`.

## Предскажите результат выполнения

```javascript
function c() {
  const user = { name: 'Anna', status: 'created' };
  const sameUser = user;

  sameUser.status = 'active';

  console.log(user.status);
}

c();
```

Сначала запишите output без запуска.

## Debugging

Автор думал, что `sameUser` — отдельная копия:

```javascript
const user = { status: 'created' };
const sameUser = user;

sameUser.status = 'active';

console.log(user.status);
```

Объясните ошибку через Heap и reference.

## QA analogy

В test helper передали object with test data. Второй helper изменил property этого object.

Почему первый helper позже может увидеть changed data?

## Мини-сценарий

Напишите `a() -> b() -> c()`, где `c()`:

* создает primitive `count`;
* создает object `user`;
* создает вторую variable, referring to same object;
* меняет property через вторую variable;
* печатает property через первую variable.

После кода нарисуйте Stack/Heap diagram.
