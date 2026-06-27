# Практика: includes()

## Концептуальные вопросы

1. Зачем существует `includes()`?
2. Что принимает `includes()`?
3. Что возвращает `includes()`?
4. Почему `includes()` удобен для simple arrays?
5. Почему `includes()` не подходит для поиска object by condition?
6. Почему порядок `allowedValues.includes(actualValue)` читается лучше?

## Чтение кода

```javascript
const allowedStatuses = ['passed', 'failed', 'skipped'];
const status = 'failed';

const result = allowedStatuses.includes(status);

console.log(result);
```

Ответьте:

* что будет выведено;
* почему callback не нужен;
* какой вопрос задает этот код.

## Предскажите результат выполнения

```javascript
const allowedPriorities = ['high', 'medium', 'low'];

console.log(allowedPriorities.includes('critical'));
```

Сначала запишите ответ без запуска.

## Debugging

Автор хотел проверить, что status входит в список разрешенных.

```javascript
const allowedStatuses = ['passed', 'failed', 'skipped'];
const testCase = { id: 'T-1', title: 'login smoke', status: 'passed', priority: 'high' };

const isValid = testCase.status.includes(allowedStatuses);

console.log(isValid);
```

Что не так? Исправьте код.

## QA scenario

Создайте `allowedStatuses` и проверьте, что status каждого test case входит в этот список. Используйте `includes()` внутри уже изученной проверки всех elements.

## Мини-проект

Создайте файл `playground/includes-validation.js`.

Требования:

* создать array `testCases` из пяти objects;
* создать `allowedStatuses`;
* создать `allowedPriorities`;
* проверить status одного test case;
* проверить priority одного test case;
* проверить, что все test cases используют только allowed values.
