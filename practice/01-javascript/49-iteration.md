# Практика: Iteration

## Концептуальные вопросы

1. Зачем нужна iteration?
2. Что делает `for...of`?
3. Что получает loop variable на каждом шаге?
4. Когда `for...of` читается лучше, чем ручной доступ по indexes?
5. Изменяет ли `for...of` array сам по себе?
6. Почему body важнее самого факта обхода?

## Чтение кода

```javascript
const testRun = ['login', 'create order', 'payment'];

for (const testCase of testRun) {
  console.log(`Prepare ${testCase}`);
}
```

Ответьте:

* сколько раз выполнится body;
* какие значения получит `testCase`;
* изменится ли `testRun`.

## Предскажите результат выполнения

```javascript
const tests = ['login', 'payment'];

for (const test of tests) {
  console.log(test);
}

console.log('done');
```

Сначала запишите ответ без запуска.

## Отладка

Автор хотел вывести titles, но выводит весь object.

```javascript
const testRun = [
  { title: 'login smoke' },
  { title: 'pay order' },
];

for (const testCase of testRun) {
  console.log(testCase);
}
```

Исправьте код.

## QA-сценарий

Есть снимок:

```javascript
const smokeRun = ['login smoke', 'create order'];
```

Пройдите по каждому test case и выведите:

```text
Preparing: <test case>
```

## Мини-проект

Создайте файл `playground/iterate-test-run.js`.

Требования:

* создать array test case objects;
* каждый object должен иметь `id`, `title`, `priority`;
* пройти по array через `for...of`;
* вывести readable execution plan;
* не изменять исходный array.
