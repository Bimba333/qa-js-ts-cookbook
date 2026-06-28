# Практика: Garbage Collector

## Концептуальные вопросы

1. Что делает Garbage Collector?
2. Что означает reachable object?
3. Почему JavaScript-разработчик обычно не освобождает память вручную?
4. Почему объект не удаляется только потому, что он "старый"?
5. Кто решает, когда именно запускать сборку мусора?

## Чтение кода

Какие объекты остаются reachable?

```javascript
const runner = {
  report: {
    status: 'passed',
  },
};

console.log(runner.report.status);
```

## Предскажите результат

Что выведет код?

```javascript
let report = {
  status: 'passed',
};

const archivedReport = report;

report = null;

console.log(archivedReport.status);
```

## Определение удерживаемых объектов

Определите, какой объект удерживается ссылкой:

```javascript
let currentReport = {
  testName: 'login',
  logs: ['start', 'finish'],
};

const lastReport = currentReport;

currentReport = null;
```

## Отладка

Почему нельзя написать тест, который ожидает немедленное освобождение памяти после `report = null`?

```javascript
let report = { status: 'passed' };

report = null;
```

## Задание Automation QA

Опишите жизненный цикл объекта отчета:

```text
создать отчет
загрузить отчет
сбросить ссылку
```

Покажите, в какой момент объект может стать кандидатом на сборку.

## Мини-проект

Нарисуйте объектный граф для тестового раннера:

```text
runner
currentReport
logs
config
```

Затем покажите, что изменится, если `runner.currentReport = null`.
