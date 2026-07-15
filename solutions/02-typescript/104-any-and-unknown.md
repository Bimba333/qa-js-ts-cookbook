# Решения: any и unknown

## Концептуальные вопросы

### 1. Почему `any` опасен?

Ответ: `any` отключает значимую часть проверки TypeScript.

Объяснение: компилятор перестает защищать обращения к свойствам и методам.

Типичная ошибка: использовать `any`, чтобы быстро убрать ошибку.

Связь с Automation QA: ошибка в response body может пройти до runtime.

### 2. Чем `unknown` отличается от `any`?

Ответ: `unknown` сохраняет проверку и требует уточнения перед использованием.

Объяснение: TypeScript не позволит обращаться с `unknown` как с известным типом без проверки.

Типичная ошибка: думать, что `unknown` так же свободен, как `any`.

Связь с Automation QA: внешние данные лучше начинать с `unknown`.

### 3. Почему `unknown` требует проверки перед использованием?

Ответ: потому что TypeScript не знает, какие операции безопасны.

Объяснение: сначала нужно убедиться, что значение действительно строка, число или объект нужной формы.

Типичная ошибка: пытаться вызвать метод напрямую.

Связь с Automation QA: API response нельзя считать корректным без проверки.

### 4. Где в QA-проекте появляются неизвестные данные?

Ответ: в API responses, config files, environment variables и внешних fixtures.

Объяснение: эти источники находятся вне полной власти TypeScript.

Типичная ошибка: доверять внешнему источнику как типизированному коду.

Связь с Automation QA: внешние данные должны проходить runtime-проверку.

### 5. Почему `unknown` не является runtime-валидацией?

Ответ: `unknown` только ограничивает использование значения на этапе компиляции.

Объяснение: реальную проверку пишет разработчик.

Типичная ошибка: думать, что TypeScript сам проверит JSON.

Связь с Automation QA: assertions и runtime-checks все равно нужны.

## Чтение кода

Ответ: TypeScript разрешит оба обращения, потому что `body` имеет тип `any`.

```typescript
const body: any = { status: 'ok' };

console.log(body.status);
console.log(body.missing.value);
```

Объяснение: `any` отключает защиту, хотя второе обращение опасно в runtime.

Типичная ошибка: считать отсутствие TypeScript-ошибки доказательством безопасности.

Связь с Automation QA: такой код может упасть только во время тестового запуска.

## Предскажите результат проверки

Ответ: TypeScript не должен разрешать вызов `toUpperCase()` без проверки.

```typescript
function printValue(value: unknown): void {
  console.log(value.toUpperCase());
}
```

Объяснение: у `unknown` нельзя вызывать строковые методы, пока значение не проверено.

Типичная ошибка: использовать `unknown` как `any`.

Связь с Automation QA: response body нужно уточнить перед использованием.

## Задание на отладку

Ответ:

```typescript
function normalize(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }

  return '';
}
```

Объяснение: проверка `typeof` уточняет значение до строки.

Типичная ошибка: заменить `unknown` на `any` вместо проверки.

Связь с Automation QA: helper должен безопасно обрабатывать неожиданные внешние данные.

## Задание Automation QA

Ответ: нужно проверить, что значение имеет тип `string`.

```typescript
function printBodyAsString(body: unknown): void {
  if (typeof body === 'string') {
    console.log(body);
    return;
  }

  console.log('body is not a string');
}
```

Объяснение: без проверки TypeScript не знает, можно ли работать со значением как со строкой.

Типичная ошибка: доверять API response без проверки.

Связь с Automation QA: это снижает риск падения helper на неожиданных данных.

## Мини-проект

Ответ:

```typescript
function printResponseStatus(value: unknown): void {
  if (typeof value === 'string') {
    console.log(`status: ${value}`);
    return;
  }

  console.log('status is not a string');
}

printResponseStatus('ok');
printResponseStatus(200);
```

Объяснение: функция использует `unknown`, а затем явно проверяет тип.

Типичная ошибка: обращаться к значению до проверки.

Связь с Automation QA: такой helper безопаснее для данных из API.
