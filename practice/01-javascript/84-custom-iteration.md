# Практика: Custom Iteration

## Концептуальные вопросы

1. Что нужно добавить объекту, чтобы он стал iterable?
2. Что должен вернуть метод `Symbol.iterator`?
3. Чем ручной iterator отличается от iterator на основе generator?
4. Когда собственная итерация полезна в тестовом фреймворке?
5. Почему не стоит делать собственный iterable-объект без необходимости?

## Чтение кода

Прочитайте код и объясните, что будет выведено:

```javascript
const suite = {
  tests: ['login', 'checkout'],
  *[Symbol.iterator]() {
    for (const test of this.tests) {
      yield test;
    }
  },
};

for (const test of suite) {
  console.log(test);
}
```

## Предскажите результат выполнения

```javascript
const suite = {
  tests: ['report'],
  [Symbol.iterator]() {
    return this.tests[Symbol.iterator]();
  },
};

for (const test of suite) {
  console.log(test);
}
```

## Отладка

Почему этот код некорректен?

```javascript
const suite = {
  tests: ['login'],
  [Symbol.iterator]() {
    return this.tests;
  },
};

for (const test of suite) {
  console.log(test);
}
```

## Задание Automation QA

Создайте объект `testSuite` с полями `name`, `owner` и `tests`. Реализуйте `Symbol.iterator` через generator так, чтобы `for...of` обходил только `tests`.

## Мини-проект

Создайте объект `report`, который хранит:

* название запуска;
* массив логов;
* массив скриншотов.

Сделайте объект iterable так, чтобы обход возвращал сначала логи, потом скриншоты.
