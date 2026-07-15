# Решения: Type Assertions

## Концептуальные вопросы

### Ответ

`as` сообщает TypeScript, каким типом считать значение. Assertion не проверяет данные во время выполнения. Guard доказывает тип проверками, а assertion только обещает его.

### Объяснение

После компиляции assertion исчезает из JavaScript.

### Типичная ошибка

Использовать `as`, чтобы спрятать ошибку вместо исправления проверки.

### Связь с Automation QA

В больших тестовых проектах unsafe assertion может переносить ошибку далеко от места получения данных.

## Чтение кода

### Ответ

Код опасен, потому что любое `unknown` значение будет считаться `Config`.

### Объяснение

Если в `value` нет `retries`, проверка во время выполнения это не поймает.

### Типичная ошибка

Считать `as Config` преобразованием данных.

### Связь с Automation QA

Конфигурация тестов должна проверяться явно, а не только утверждаться типом.

## Предскажите результат проверки

### Ответ

Да, TypeScript будет считать `count` числом.

### Объяснение

Двойной assertion через `unknown` заставляет компилятор доверять разработчику, но реальное значение остается строкой.

### Типичная ошибка

Путать статический тип и значение во время выполнения.

### Связь с Automation QA

Так можно случайно передать строку туда, где helper ожидает число повторов.

## Анализ типа

### Ответ

Если массив пустой, `items[0]` будет `undefined`, а `!` скрывает это от TypeScript.

### Объяснение

Non-null assertion не добавляет проверку длины массива.

### Типичная ошибка

Ставить `!` вместо проверки `items.length`.

### Связь с Automation QA

Списки тестов, отчетов или ошибок могут быть пустыми.

## Задание на отладку

### Ответ

```ts
type ReportConfig = {
  outputDir: string;
};

function outputDir(value: unknown): string {
  if (typeof value === "object" && value !== null && "outputDir" in value && typeof value.outputDir === "string") {
    const config = value as ReportConfig;
    return config.outputDir;
  }

  return "reports";
}
```

### Объяснение

Assertion используется после проверок, которые делают его осмысленным.

### Типичная ошибка

Делать assertion в первой строке функции.

### Связь с Automation QA

Это безопаснее для чтения настроек отчета из внешнего источника.

## Задание Automation QA

### Ответ

```ts
type ReportConfig = {
  outputDir: string;
};

function readOutputDir(value: unknown): string {
  if (typeof value === "object" && value !== null && "outputDir" in value && typeof value.outputDir === "string") {
    return (value as ReportConfig).outputDir;
  }

  return "reports";
}
```

### Объяснение

Код сначала доказывает наличие строки `outputDir`.

### Типичная ошибка

Использовать assertion без fallback-значения.

### Связь с Automation QA

Report helper должен устойчиво работать даже при неполной конфигурации.

## Мини-проект

### Ответ

```ts
type ApiResponse = {
  data: string;
};

function unsafe(value: unknown): string {
  return (value as ApiResponse).data;
}

function isApiResponse(value: unknown): value is ApiResponse {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "data" in value && typeof value.data === "string";
}

function safe(value: unknown): string {
  if (isApiResponse(value)) {
    return value.data;
  }

  return "Некорректный ответ";
}
```

### Объяснение

Guard проверяет данные, assertion только обещает форму.

### Типичная ошибка

Оставить только unsafe-подход ради короткого кода.

### Связь с Automation QA

Безопасный подход лучше масштабируется в API testing.
