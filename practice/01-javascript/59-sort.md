# Практика: sort()

## Концептуальные вопросы

1. Какой ordering rule нужен, чтобы отсортировать test cases по `id`?
2. Почему default sort может поставить `T-10` перед `T-2`?
3. Когда нужен compare function?
4. Какой order нужен, чтобы high priority tests оказались выше?
5. Что произойдет с current array после вызова `sort()`?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
];

testCases.sort(function (firstTest, secondTest) {
  return firstTest.id.localeCompare(secondTest.id);
});

console.log(testCases[0].id);
console.log(testCases[2].id);
```

Ответьте:

* какой id будет первым;
* какой id будет последним;
* изменился ли исходный array.

## Предскажите результат выполнения

```javascript
const testIds = ['T-3', 'T-1', 'T-10', 'T-2'];

testIds.sort();

console.log(testIds);
```

Сначала запишите ответ без запуска.

## Debugging

Автор хотел отсортировать high priority tests выше.

```javascript
const testCases = [
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-4', title: 'logout smoke', status: 'skipped', priority: 'low' },
];

testCases.sort();

console.log(testCases);
```

Что не так? Исправьте код через explicit priority order.

## QA scenario

Отсортируйте test cases по status: failed first, skipped second, passed last.

## Мини-проект

Создайте файл `playground/sort-ci-report.js`.

Требования:

* создать array `testCases` из пяти objects;
* отсортировать по `id`;
* отсортировать по `priority`;
* отсортировать по `status`;
* после каждой сортировки вывести порядок ids;
* явно показать, что `sort()` изменяет source array.
