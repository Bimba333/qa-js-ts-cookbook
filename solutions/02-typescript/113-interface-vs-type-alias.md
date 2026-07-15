# Решения: Interface vs Type Alias

## Концептуальные вопросы

### 1. Когда interface удобен?

Ответ: когда нужно описать публичный объектный договор.

Объяснение: особенно если важны свойства и методы объекта.

Типичная ошибка: считать interface обязательным для любого объекта.

Связь с Automation QA: logger или reporter удобно описывать interface.

### 2. Когда type alias удобен?

Ответ: когда нужно дать имя типу или форме данных.

Объяснение: данные запроса и конфигурация часто хорошо читаются как aliases.

Типичная ошибка: использовать alias с неясным именем.

Связь с Automation QA: данные API-запроса удобно назвать через `type`.

### 3. Почему не нужно превращать выбор в спор о стиле?

Ответ: цель — понятный и поддерживаемый код.

Объяснение: оба инструмента полезны, если применяются последовательно.

Типичная ошибка: выбирать синтаксис без учета назначения.

Связь с Automation QA: команда должна быстро читать общие договоры.

### 4. Что общего у interface и type alias после компиляции?

Ответ: оба исчезают из JavaScript.

Объяснение: они нужны TypeScript для проверки на compile time.

Типичная ошибка: искать interface или alias в runtime.

Связь с Automation QA: runtime checks остаются отдельной задачей.

### 5. Как выбрать инструмент для QA-кода?

Ответ: interface — для поведения объекта, type alias — для формы данных.

Объяснение: это простое правило помогает не спорить о стиле.

Типичная ошибка: применять правило механически без смысла.

Связь с Automation QA: поведение reporter и данные login request имеют разную природу.

## Чтение кода

Ответ: `Writer` описывает поведение через interface, `ReportData` описывает данные через type alias.

Объяснение: договор метода удобно описать как interface, форму данных — как alias.

Типичная ошибка: не различать поведение и данные.

Связь с Automation QA: это помогает проектировать helpers.

## Предскажите результат проверки

Ответ: код согласован.

Объяснение: объект имеет метод `write` с нужной сигнатурой.

Типичная ошибка: забыть параметр метода.

Связь с Automation QA: writer соответствует договору.

## Задание на отладку

Ответ:

```typescript
type LoginPayload = {
  email: string;
  password: string;
};

const payload: LoginPayload = {
  email: 'qa@example.test',
  password: 'secret',
};
```

Объяснение: `password` является обязательным свойством.

Типичная ошибка: считать alias только подсказкой, а не договором.

Связь с Automation QA: данные login request должны быть полными.

## Задание Automation QA

Ответ:

```typescript
interface Writer {
  write(message: string): void;
}

type LoginPayload = {
  email: string;
  password: string;
};
```

Объяснение: interface описывает поведение, type alias описывает данные.

Типичная ошибка: выбирать инструмент только по привычке.

Связь с Automation QA: это дает понятную структуру общих helpers.

## Мини-проект

Ответ:

```typescript
interface Reporter {
  write(message: string): void;
}

type ReportData = {
  title: string;
  passed: boolean;
};

function writeReport(reporter: Reporter, data: ReportData): void {
  reporter.write(`${data.title}: ${data.passed}`);
}

const consoleReporter: Reporter = {
  write(message: string): void {
    console.log(message);
  },
};

writeReport(consoleReporter, { title: 'smoke', passed: true });
```

Объяснение: функция принимает поведение через interface и данные через alias.

Типичная ошибка: смешивать поведение и данные запроса в одном неясном типе.

Связь с Automation QA: такой подход помогает разделять responsibilities.
