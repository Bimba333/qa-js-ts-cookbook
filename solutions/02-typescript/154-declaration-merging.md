# Решения: Declaration Merging

## Концептуальные вопросы

### Ответ

В этой главе объединяются интерфейсы. Type aliases не объединяются. Объединение деклараций не создает свойства во время выполнения.

### Объяснение

Merging происходит в системе типов TypeScript.

### Типичная ошибка

Ожидать одинакового поведения от `interface` и `type`.

### Связь с Automation QA

Объектные contracts можно дополнять, но делать это нужно осторожно.

## Чтение кода

### Ответ

`ReportMeta` получает форму:

```ts
{
  title: string;
  status: "passed" | "failed";
}
```

### Объяснение

Два interface с одинаковым именем объединяются.

### Типичная ошибка

Думать, что второй interface заменяет первый.

### Связь с Automation QA

Так можно расширить metadata отчета.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку: duplicate identifier для `UserId`.

### Объяснение

Type aliases не объединяются.

### Типичная ошибка

Пытаться расширять type alias повторным объявлением.

### Связь с Automation QA

Для переиспользуемых unions лучше явно создавать новый type alias.

## Анализ типа

### Ответ

Если одно свойство объявлено с несовместимыми типами, TypeScript не может собрать единый безопасный контракт.

### Объяснение

Merging должен приводить к согласованной форме.

### Типичная ошибка

Считать, что TypeScript автоматически выберет один из вариантов.

### Связь с Automation QA

Несогласованный status в report metadata делает formatter ненадежным.

## Задание на отладку

### Ответ

```ts
interface ResultInfo {
  status: "passed" | "failed";
}
```

### Объяснение

Один interface с union type выражает оба допустимых значения без конфликта.

### Типичная ошибка

Пытаться объявить одно свойство двумя несовместимыми способами.

### Связь с Automation QA

Статус результата должен иметь один понятный контракт.

## Задание Automation QA

### Ответ

```ts
interface ReportContext {
  runId: string;
}

interface ReportContext {
  environment: "local" | "staging";
}
```

### Объяснение

После объединения `ReportContext` содержит оба поля.

### Типичная ошибка

Думать, что объект получит эти поля автоматически.

### Связь с Automation QA

Реальный объект context все равно должен содержать `runId` и `environment`.

## Мини-проект

### Ответ

```ts
interface ReportSummary {
  title: string;
}

interface ReportSummary {
  total: number;
}

interface ReportSummary {
  failed: number;
}

const summary: ReportSummary = {
  title: "smoke",
  total: 12,
  failed: 1,
};
```

### Объяснение

Три объявления interface объединяются в один контракт.

### Типичная ошибка

Разнести поля по объявлениям и забыть создать объект полной формы.

### Связь с Automation QA

Так можно описать summary для отчета, но источник полей должен быть понятным.
