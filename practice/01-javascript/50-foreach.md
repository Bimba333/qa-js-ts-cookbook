# Практика: forEach()

## Концептуальные вопросы

1. Зачем существует `forEach()`?
2. Что передается в `forEach()`?
3. Что получает callback на каждом шаге?
4. Для каких задач подходит `forEach()`?
5. Возвращает ли `forEach()` новый array?
6. Чем `forEach()` отличается от `for...of` на уровне формы записи?

## Чтение кода

```javascript
const testRun = ['login', 'create order', 'payment'];

testRun.forEach(function (testCase) {
  console.log(`Run ${testCase}`);
});
```

Ответьте:

* сколько раз вызовется function;
* какие значения получит `testCase`;
* что делает этот код как side effect.

## Предскажите результат выполнения

```javascript
const tests = ['login', 'payment'];

const result = tests.forEach(function (testCase) {
  console.log(testCase);
});

console.log(result);
```

Сначала запишите ответ без запуска.

## Отладка

Автор ожидал получить новый array из titles.

```javascript
const tests = [{ title: 'login' }, { title: 'payment' }];

const titles = tests.forEach(function (testCase) {
  return testCase.title;
});

console.log(titles);
```

Объясните проблему. Не используйте `map()`: эта тема будет позже.

## QA-сценарий

Есть подготовленный тестовый запуск:

```javascript
const testRun = [
  { id: 'T-1', title: 'login smoke' },
  { id: 'T-2', title: 'pay order' },
];
```

Через `forEach()` выведите строку регистрации каждого test case.

## Мини-проект

Создайте файл `playground/foreach-test-runner.js`.

Требования:

* создать array test case objects;
* для каждого test case вывести start message;
* для каждого test case вывести finish message;
* сохранить исходный array без изменений;
* объяснить, почему `forEach()` здесь используется для side effects.
