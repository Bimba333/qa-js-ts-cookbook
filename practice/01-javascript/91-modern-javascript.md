# Практика: Modern JavaScript Features

## Концептуальные вопросы

1. Почему modern JavaScript — это не набор отдельных фич?
2. Как modules помогают контролировать границы проекта?
3. Зачем optional chaining полезен в test result objects?
4. Когда `async` / `await` делает helper-код понятнее?
5. Почему не стоит использовать современный синтаксис только ради самого синтаксиса?

## Чтение кода

Какие изученные возможности JavaScript используются вместе?

```javascript
async function createSummary(result) {
  const { title, meta = {} } = result;
  const owner = meta.owner ?? 'unknown';
  const browser = meta.environment?.browser ?? 'chromium';

  return { title, owner, browser };
}
```

## Предскажите результат

Что выведет код?

```javascript
const result = {
  title: 'login test',
  meta: {},
};

const browser = result.meta.environment?.browser ?? 'chromium';

console.log(browser);
```

## Задание на отладку

Почему этот код может стать трудным для поддержки?

```javascript
async function runEverything(page, user, report) {
  await page.goto('/login');
  await page.fill('#user', user.name);
  await page.click('#submit');
  report.steps.push('login finished');
  return report;
}
```

## Задание Automation QA

Опишите, как разделить большой helper на части:

```text
login
test data
assertion
report
```

Какие части должны быть отдельными modules или helper-функциями?

## Мини-проект

Спроектируйте `createModernTestSummary(testResult)`.

Функция должна использовать:

* destructuring;
* optional chaining;
* nullish coalescing;
* spread.

Она должна вернуть объект summary для отчета.
