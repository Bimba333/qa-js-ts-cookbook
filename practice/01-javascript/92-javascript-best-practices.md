# Практика: JavaScript Best Practices

## Концептуальные вопросы

1. Почему readability важнее cleverness?
2. Что означает single responsibility для helper-функции?
3. Почему duplication опасен в Page Objects?
4. Когда defensive programming полезен?
5. Почему premature optimization может ухудшить код?

## Чтение кода

Какие best practices нарушены?

```javascript
function t(a, b, c) {
  if (!a) return false;
  console.log(b);
  c.push(a);
  return c.length > 0;
}
```

## Предскажите результат

Что выведет код?

```javascript
function isSuccessfulStatus(status) {
  return status === 'passed' || status === 'skipped';
}

console.log(isSuccessfulStatus('failed'));
```

## Задание на отладку

Почему такой helper трудно поддерживать?

```javascript
function prepareAndAssert(user, page, report) {
  user.active = true;
  page.currentUser = user;
  report.steps.push('user prepared');
  return page.currentUser.active === true;
}
```

## Задание Automation QA

Опишите, как применить best practices к Playwright-проекту:

* fixtures;
* Page Objects;
* assertions;
* helpers;
* reporting.

Для каждого пункта укажите одну ответственность.

## Мини-проект

Спроектируйте небольшой набор helper-функций для проверки test result:

* `isPassed(status)`;
* `createStatusMessage(title, status)`;
* `validateTestResult(result)`.

Объясните, почему эти функции легче поддерживать, чем один большой helper.
