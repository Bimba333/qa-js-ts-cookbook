# Решения: Tuples

## Концептуальные вопросы

### 1. Чем tuple отличается от обычного массива?

Ответ: tuple описывает фиксированные позиции, а массив описывает общий тип элементов.

Объяснение: в tuple важны длина, порядок и тип каждой позиции.

Типичная ошибка: использовать tuple как обычный список.

Связь с Automation QA: tuple подходит для короткого технического результата.

### 2. Почему порядок позиций важен для tuple?

Ответ: каждая позиция имеет собственный смысл и тип.

Объяснение: `[number, string]` отличается от `[string, number]`.

Типичная ошибка: поменять позиции местами.

Связь с Automation QA: `[statusCode, statusText]` должен сохранять порядок.

### 3. Как записать tuple `[number, string]`?

Ответ:

```typescript
const response: [number, string] = [200, 'OK'];
```

Объяснение: первая позиция — число, вторая — строка.

Типичная ошибка: записать значения в обратном порядке.

Связь с Automation QA: так можно описать короткий response summary.

### 4. Для чего нужен optional tuple element?

Ответ: для позиции, которая может отсутствовать.

Объяснение: например, error message есть только при падении проверки.

Типичная ошибка: делать все позиции обязательными, когда часть данных условная.

Связь с Automation QA: failed check может иметь message, а passed check — нет.

### 5. Когда лучше заменить tuple объектом?

Ответ: когда позиций много или их смысл неочевиден.

Объяснение: объект с именованными полями читается лучше.

Типичная ошибка: создавать длинный tuple ради краткости.

Связь с Automation QA: сложный test result лучше описывать объектом.

## Чтение кода

Ответ:

```typescript
const response: [number, string] = [200, 'OK'];
```

Позиция `0` содержит число, позиция `1` содержит строку.

Объяснение: tuple задает тип каждой позиции отдельно.

Типичная ошибка: считать обе позиции одним общим типом.

Связь с Automation QA: это удобно для коротких response summaries.

## Предскажите результат проверки

Ответ: код согласован.

```typescript
const result: [string, boolean, string?] = ['login', false, 'timeout'];
```

Объяснение: первые две позиции обязательны, третья строковая позиция необязательна.

Типичная ошибка: думать, что optional element всегда должен отсутствовать.

Связь с Automation QA: сообщение об ошибке появляется только у неуспешной проверки.

## Задание на отладку

Ответ:

```typescript
const response: [number, string] = [200, 'OK'];
```

Объяснение: tuple `[number, string]` требует число на первой позиции и строку на второй.

Типичная ошибка: путать порядок значений.

Связь с Automation QA: порядок status code и status text должен быть стабильным.

## Задание Automation QA

Ответ:

```typescript
const checkResult: [string, boolean, string?] = [
  'checkout submit',
  false,
  'button is disabled',
];
```

Объяснение: tuple содержит название проверки, boolean-результат и необязательное сообщение.

Типичная ошибка: добавлять четвертую позицию без явного договора.

Связь с Automation QA: короткий result tuple можно использовать для простого report output.

## Мини-проект

Ответ:

```typescript
function formatCheckResult(result: [string, boolean, string?]): string {
  const checkName = result[0];
  const passed = result[1];
  const message = result[2];

  if (passed) {
    return `${checkName}: passed`;
  }

  return `${checkName}: failed (${message ?? 'no details'})`;
}

console.log(formatCheckResult(['login', true]));
console.log(formatCheckResult(['checkout', false, 'timeout']));
```

Объяснение: функция читает позиции tuple по их договору.

Типичная ошибка: использовать tuple с большим количеством неочевидных позиций.

Связь с Automation QA: такой formatter может подготовить краткую строку для report.
