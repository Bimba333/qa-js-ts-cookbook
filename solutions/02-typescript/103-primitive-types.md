# Решения: Primitive Types

## Концептуальные вопросы

### 1. Какие TypeScript-типы соответствуют строке, числу и boolean?

Ответ: `string`, `number`, `boolean`.

Объяснение: это TypeScript-типы для знакомых JavaScript-примитивов.

Типичная ошибка: писать `String`, `Number`, `Boolean` для обычных примитивов.

Связь с Automation QA: эти типы часто описывают config.

### 2. Почему обычно пишут `string`, а не `String`?

Ответ: `string` описывает примитивную строку.

Объяснение: `String` относится к объектному wrapper-типу и почти никогда не нужен для обычных значений.

Типичная ошибка: переносить названия конструкторов JavaScript в TypeScript-типы.

Связь с Automation QA: значения config обычно являются примитивами.

### 3. Что описывает `undefined`?

Ответ: значение не задано.

Объяснение: в JavaScript `undefined` часто означает отсутствие присвоенного значения.

Типичная ошибка: использовать `undefined` и `null` без различия намерения.

Связь с Automation QA: env value может быть `undefined`, если переменная окружения не задана.

### 4. Что описывает `null`?

Ответ: намеренное отсутствие значения.

Объяснение: `null` обычно используют, когда отсутствие значения является явным состоянием.

Типичная ошибка: считать `null` и `undefined` одним и тем же договором.

Связь с Automation QA: selected browser может быть `null`, если выбор еще не сделан намеренно.

### 5. Какие значения описывают `bigint` и `symbol`?

Ответ: `bigint` описывает большие целые числа, а `symbol` описывает уникальные идентификаторы.

Объяснение: оба значения являются JavaScript-примитивами, поэтому TypeScript описывает их отдельными типами.

Типичная ошибка: заменять `bigint` обычным `number`, не понимая разницу в назначении.

Связь с Automation QA: такие типы встречаются реже, но могут появиться в технических идентификаторах или данных внешних систем.

### 6. Почему TypeScript не меняет runtime-значения?

Ответ: типы используются до запуска и исчезают после компиляции.

Объяснение: выполняется JavaScript, а не TypeScript-типы.

Типичная ошибка: ждать runtime-проверки от примитивного TypeScript-типа.

Связь с Automation QA: TypeScript помогает до запуска, но данные API все равно нужно проверять в runtime.

## Чтение кода

Ответ:

```typescript
const baseUrl = 'https://api.example.test';
const timeoutMs = 3000;
const debug = false;
```

TypeScript выведет `string`, `number`, `boolean`.

Объяснение: каждое значение является очевидным примитивом.

Типичная ошибка: вручную добавлять аннотации без необходимости.

Связь с Automation QA: такие переменные похожи на базовые test settings.

## Предскажите результат проверки

Ответ: код согласован.

```typescript
const statusCode: number = 200;
const statusText: string = 'OK';
const passed: boolean = true;
```

Объяснение: каждое значение соответствует указанному типу.

Типичная ошибка: искать проблему в корректных примитивных аннотациях.

Связь с Automation QA: status code и status text часто встречаются в API checks.

## Задание на отладку

Ответ:

```typescript
const timeoutMs: number = 5000;
const headless: boolean = true;
```

Объяснение: `number` должен получать число, `boolean` должен получать `true` или `false`.

Типичная ошибка: считать строку с цифрами числом.

Связь с Automation QA: неверные типы config могут сломать запуск в CI.

## Задание Automation QA

Ответ:

```typescript
const baseUrl: string = 'https://api.example.test';
const retries: number = 2;
const headless: boolean = true;
const reportName: string = 'smoke-report';
```

Объяснение: каждое поле описано простым примитивным типом.

Типичная ошибка: описывать числовые настройки строками.

Связь с Automation QA: config должен быть предсказуемым для runner и helpers.

## Мини-проект

Ответ:

```typescript
const projectName: string = 'checkout';
const runNumber: number = 42;
const isCi: boolean = true;
const environmentName: undefined = undefined;

console.log(projectName, runNumber, isCi, environmentName);
```

Объяснение: metadata состоит из знакомых JavaScript-примитивов, а окружение пока представлено значением `undefined`.

Типичная ошибка: считать `undefined` строкой с пустым значением.

Связь с Automation QA: такие данные часто попадают в report generation.
