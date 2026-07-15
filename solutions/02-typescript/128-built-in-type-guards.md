# Решения: Built-in Type Guards

## Концептуальные вопросы

### Ответ

TypeScript понимает `typeof`, `instanceof`, `in`, сравнение значений и truthiness-проверки. `typeof` лучше подходит для примитивов. Truthiness может быть опасен, потому что пустая строка, `0` и `false` тоже считаются falsy.

### Объяснение

Встроенный type guard — это обычная JavaScript-проверка, которую TypeScript умеет использовать для сужения типа.

### Типичная ошибка

Использовать truthiness там, где нужна точная проверка на `undefined` или `null`.

### Связь с Automation QA

В helpers часто нужно отличать реальную ошибку от отсутствующего значения.

## Чтение кода

### Ответ

После `typeof value === "number"` тип — `number`. После проверки `value === null` этот вариант исключен. В последней строке остается `string`.

### Объяснение

TypeScript последовательно исключает варианты из union type.

### Типичная ошибка

Думать, что порядок проверок не влияет на понятность кода.

### Связь с Automation QA

Похожая логика используется при форматировании входных данных для отчетов.

## Предскажите результат проверки

### Ответ

TypeScript разрешает `response.data`, потому что проверка `"data" in response` доказывает вариант `Success`.

### Объяснение

Один вариант union type содержит `data`, другой — `error`.

### Типичная ошибка

Использовать `in` без понимания, что проверяемое значение должно быть объектом.

### Связь с Automation QA

Так можно различать успешный и ошибочный API-ответ.

## Анализ типа

### Ответ

Пустая строка попадет в ветку `return "Anonymous"`.

### Объяснение

`""` является falsy. Если пустая строка является допустимым значением, нужно проверять `name !== undefined`.

### Типичная ошибка

Смешивать отсутствие значения и пустое значение.

### Связь с Automation QA

В конфигурации пустая строка иногда означает намеренно заданное значение.

## Задание на отладку

### Ответ

```ts
function hasMessage(value: unknown): boolean {
  return typeof value === "object" && value !== null && "message" in value;
}
```

### Объяснение

Оператор `in` безопасно применять после проверки, что значение является объектом и не равно `null`.

### Типичная ошибка

Применять `in` к `unknown` напрямую.

### Связь с Automation QA

Так начинается безопасная обработка неизвестного ответа API.

## Задание Automation QA

### Ответ

```ts
type ApiResult =
  | { status: "ok"; body: string }
  | { status: "error"; message: string };

function resultText(result: ApiResult): string {
  if (result.status === "ok") {
    return result.body;
  }

  return result.message;
}
```

### Объяснение

Equality narrowing по `status` выбирает конкретный вариант.

### Типичная ошибка

Пытаться читать `body` и `message` без проверки.

### Связь с Automation QA

Так удобно описывать результат API helper.

## Мини-проект

### Ответ

```ts
function formatUnknownError(error: Error | string | null): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Неизвестная ошибка";
}
```

### Объяснение

Каждая проверка отвечает за свой вариант типа.

### Типичная ошибка

Сначала проверять truthiness и потерять контроль над пустой строкой.

### Связь с Automation QA

Ошибки helpers могут приходить в разных формах, но отчету нужен один текст.
