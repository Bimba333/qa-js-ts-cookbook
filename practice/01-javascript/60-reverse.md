# Практика: reverse()

## Концептуальные вопросы

1. Что именно инвертирует `reverse()`?
2. Чем inversion of текущий порядок отличается от ordering by rule?
3. Что произойдет, если вызвать `reverse()` два раза?
4. Почему reverse shared array может быть опасен?
5. Когда reverse view полезен для debugging?

## Чтение кода

```javascript
const testCases = [
  { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' },
  { id: 'T-2', title: 'create order', status: 'failed', priority: 'high' },
  { id: 'T-3', title: 'pay order', status: 'passed', priority: 'medium' },
];

testCases.reverse();

console.log(testCases[0].id);
console.log(testCases[2].id);
```

Ответьте:

* какой id будет первым;
* какой id будет последним;
* изменился ли исходный array.

## Предскажите результат выполнения

```javascript
const testIds = ['T-1', 'T-2', 'T-3'];

testIds.reverse();
testIds.reverse();

console.log(testIds);
```

Сначала запишите ответ без запуска.

## Отладка

Автор думал, что `reverse()` создаст новый array.

```javascript
const testIds = ['T-1', 'T-2', 'T-3'];
const reversedIds = testIds.reverse();

console.log(testIds);
console.log(reversedIds);
```

Объясните проблему. Исправьте код так, чтобы сохранить исходного порядка.

## QA-сценарий

Есть ordered execution list. Переверните его для анализа последних executed tests первыми.

## Мини-проект

Создайте файл `playground/reverse-debug-order.js`.

Требования:

* создать array `testCases` из пяти objects;
* вывести исходный порядок ids;
* перевернуть порядок;
* вывести reversed order ids;
* отсортировать по id и затем перевернуть;
* объяснить, где `reverse()` изменил исходный массив.
