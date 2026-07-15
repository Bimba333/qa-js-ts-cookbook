# Решения: Typed Classes

## Концептуальные вопросы

### Ответ

TypeScript проверяет поля, параметры constructor, присваивания внутри constructor, параметры методов и возвращаемые значения методов.

### Объяснение

Сам класс остается JavaScript-классом во время выполнения. TypeScript добавляет статическую проверку до запуска.

### Типичная ошибка

Думать, что тип поля автоматически проверит данные из API во время выполнения.

### Связь с Automation QA

Так можно безопаснее описывать helpers, report entries и Page Object-подобные модели.

## Чтение кода

### Ответ

Экземпляр `TestCase` имеет свойства `title`, `retries` и метод `label()`.

### Объяснение

Поля объявлены в классе и инициализируются в конструкторе. Метод находится в теле класса и доступен экземплярам.

### Типичная ошибка

Путать class value и instance type.

### Связь с Automation QA

Экземпляр такого класса может представлять один тестовый сценарий.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку.

```ts
class ReportEntry {
  status: "passed" | "failed";

  constructor(status: "passed" | "failed") {
    this.status = status;
  }
}

// Ошибка: "skipped" не входит в допустимый union.
const entry = new ReportEntry("skipped");
```

### Объяснение

Конструктор принимает только `"passed"` или `"failed"`.

### Типичная ошибка

Расширять union случайными строками без изменения контракта.

### Связь с Automation QA

Так report model не принимает неподдерживаемый статус.

## Анализ типа

### Ответ

`entry: ReportEntry` описывает объект, созданный классом, то есть instance type.

### Объяснение

Имя класса в позиции типа обычно означает тип экземпляра. Сам constructor находится на стороне значения класса.

### Типичная ошибка

Ожидать, что `ReportEntry` в позиции типа описывает `new ReportEntry`.

### Связь с Automation QA

Функции helpers обычно принимают экземпляры моделей, а не constructors.

## Задание на отладку

### Ответ

```ts
class ApiRequest {
  method: "GET" | "POST";

  constructor(method: "GET" | "POST") {
    this.method = method;
  }
}
```

### Объяснение

Поле принимает только `"GET"` или `"POST"`, поэтому constructor должен принимать тот же ограниченный тип.

### Типичная ошибка

Принимать `string`, а затем присваивать ее в поле с более узким типом.

### Связь с Automation QA

API helpers должны ограничивать HTTP method допустимыми значениями.

## Задание Automation QA

### Ответ

```ts
class ReportEntry {
  title: string;
  status: "passed" | "failed";

  constructor(title: string, status: "passed" | "failed") {
    this.title = title;
    this.status = status;
  }

  toLine(): string {
    return `${this.status}: ${this.title}`;
  }
}
```

### Объяснение

Класс описывает проверяемую форму report entry и метод для строкового представления.

### Типичная ошибка

Оставить `status: string` и потерять проверку допустимых статусов.

### Связь с Automation QA

Такой класс можно использовать при генерации текстового отчета.

## Мини-проект

### Ответ

```ts
class TestRun {
  id: string;
  tests: string[];

  constructor(id: string) {
    this.id = id;
    this.tests = [];
  }

  addTest(title: string): void {
    this.tests.push(title);
  }

  getCount(): number {
    return this.tests.length;
  }
}
```

### Объяснение

Все поля явно типизированы и инициализированы. Методы имеют понятные параметры и возвращаемые значения.

### Типичная ошибка

Объявить поле `tests`, но не инициализировать его.

### Связь с Automation QA

Так можно моделировать набор тестов внутри одного запуска.
