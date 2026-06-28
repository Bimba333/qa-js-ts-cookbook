# Практика: splice()

## Концептуальные вопросы

1. Зачем существует `splice()`?
2. Почему `push()` и `unshift()` не решают задачу изменения середины array?
3. Что означает `startIndex`?
4. Что означает `deleteCount`?
5. Что возвращает `splice()`?
6. Изменяет ли `splice()` исходный array?
7. Почему array после `splice()` нужно читать как новое состояние?
8. Почему старые indexes после `splice()` становятся небезопасными?

## Чтение кода

```javascript
const testCases = ['login', 'old checkout', 'payment', 'logout'];
const removed = testCases.splice(1, 1, 'new checkout');

console.log(testCases);
console.log(removed);
```

Ответьте:

* какой element удален;
* какой element вставлен;
* каким стал `testCases`;
* что находится в `removed`.
* какие indexes изменились после операции.

## Предскажите результат выполнения

```javascript
const plan = ['login', 'create order', 'pay order'];

plan.splice(2, 0, 'apply discount');

console.log(plan);
console.log(plan.length);
```

Сначала запишите ответ без запуска.

## Отладка

Автор хотел удалить только `deprecated test`.

```javascript
const tests = ['login', 'deprecated test', 'payment', 'logout'];

tests.splice(1, 2);

console.log(tests);
```

Что не так? Исправьте код.

После исправления объясните, почему следующий `splice()` в этом же array нельзя планировать по старым indexes.

## QA-сценарий

Есть regression plan:

```javascript
const regressionPlan = [
  'login smoke',
  'create order',
  'pay order',
  'logout smoke'
];
```

Добавьте `apply discount` перед `pay order`, не используя `push()` или `unshift()`.

## Мини-проект

Создайте файл `playground/splice-test-plan.js`.

Требования:

* создать array из пяти test cases;
* удалить один устаревший test case из середины;
* вставить новый test case в середину;
* заменить один test case;
* после каждой операции коротко записать текущее состояние array в комментарии;
* вывести итоговый plan;
* вывести все removed tests.
