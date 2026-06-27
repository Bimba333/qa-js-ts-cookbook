# Решения. Глава 18. Type Conversion

## Концептуальные вопросы

### 1. Почему существует type conversion?

Ответ:

Type conversion существует потому, что операции часто ожидают один тип значения, а получают другой.

Объяснение:

Values приходят из API, форм, переменных окружения и кода. Их реальные types не всегда совпадают с тем, что ожидает операция.

Распространённая ошибка:

Считать, что conversion происходит случайно.

Связь с Automation QA:

В тестах часто приходят строки там, где для проверки нужны numbers или booleans.

### 2. Что означает ожидание операции?

Ответ:

Это означает, что каждая операция лучше всего работает с определенными value types.

Объяснение:

Вычитание ожидает numeric values. Построение текста ожидает string values. Условия используют Boolean conversion.

Распространённая ошибка:

Смотреть только на входные values и не учитывать операцию, которая с ними выполняется.

Связь с Automation QA:

Assertions часто падают именно потому, что expected type и actual type отличаются.

### 3. Что такое implicit conversion?

Ответ:

Implicit conversion — это автоматическое преобразование, которое запускает JavaScript-операция.

Объяснение:

`'5' - 1` преобразует `'5'` в Number, потому что вычитание ожидает Number.

Распространённая ошибка:

Думать, что implicit означает "без правил".

Связь с Automation QA:

Скрытая implicit conversion может маскировать ошибку в тесте.

### 4. Что такое explicit conversion?

Ответ:

Explicit conversion — это преобразование, которое программист явно вызывает через `Number()`, `String()` или `Boolean()`.

Объяснение:

Такой код показывает намерение явно.

Распространённая ошибка:

Использовать трюки вроде вычитания нуля вместо понятного преобразования.

Связь с Automation QA:

Explicit conversion делает test setup проще для ревью.

### 5. Почему explicit conversion лучше в тестах?

Ответ:

Она документирует ожидаемый type и уменьшает риск скрытого поведения.

Объяснение:

`Number(retriesFromEnv)` понятнее, чем надежда на то, что какая-то операция сама преобразует значение.

Распространённая ошибка:

Позволять assertion или операции выполнять conversion неявно.

Связь с Automation QA:

Читаемые тесты падают с более понятной причиной.

### 6. Что делает `Number()`?

Ответ:

`Number()` преобразует value в Number или возвращает `NaN`, если осмысленное numeric conversion невозможно.

Объяснение:

`Number('5')` дает `5`; `Number('abc')` дает `NaN`.

Распространённая ошибка:

Считать, что каждая строка может стать полезным number.

Связь с Automation QA:

Парсинг numeric fields из API требует отдельной проверки.

### 7. Что означает `NaN`?

Ответ:

`NaN` появляется, когда Number conversion не может получить осмысленное числовое значение.

Объяснение:

`Number(undefined)` и `Number('abc')` — типичные примеры.

Распространённая ошибка:

Игнорировать `NaN` и продолжать numeric calculation.

Связь с Automation QA:

`NaN` часто показывает неправильное поле response или ошибку парсинга.

### 8. Что делает `String()`?

Ответ:

`String()` преобразует value в строковое представление.

Объяснение:

`String(200)` становится `'200'`; `String(null)` становится `'null'`.

Распространённая ошибка:

Думать, что `null` превращается в пустую строку.

Связь с Automation QA:

Это полезно при заполнении text fields и построении читаемых логов.

### 9. Что делает `Boolean()`?

Ответ:

`Boolean()` преобразует value по правилам truthy/falsy.

Объяснение:

Непустые строки являются truthy; пустая строка является falsy.

Распространённая ошибка:

Ожидать, что `Boolean('false')` вернет `false`.

Связь с Automation QA:

Переменные окружения вроде `'false'` требуют явного semantic parsing.

### 10. Что такое truthy?

Ответ:

Truthy value становится `true` при Boolean conversion.

Объяснение:

Примеры: `'hello'`, `'false'`, `1`, `{}`, `[]`.

Распространённая ошибка:

Считать truthy value семантически истинным.

Связь с Automation QA:

Непустой UI-текст является truthy, даже если в нем написано `"false"`.

### 11. Что такое falsy?

Ответ:

Falsy value становится `false` при Boolean conversion.

Объяснение:

Примеры: `false`, `0`, `''`, `null`, `undefined`, `NaN`.

Распространённая ошибка:

Думать, что все "пустые на вид" values ведут себя одинаково в любом контексте.

Связь с Automation QA:

Отсутствующие API-поля могут стать falsy при Boolean conversion.

### 12. Почему conversion не случайна?

Ответ:

Conversion следует правилам языка и зависит от того, какой type ожидает операция.

Объяснение:

Одно и то же value может преобразовываться по-разному в разных операциях, потому что операции ожидают разные types.

Распространённая ошибка:

Запоминать результаты без понимания ожиданий операции.

Связь с Automation QA:

Понимание правил ускоряет debugging.

### 13. Почему equality изучается отдельно?

Ответ:

Equality имеет собственные правила сравнения и должна изучаться отдельно.

Объяснение:

Conversions могут появляться внутри сравнений, но equality algorithms не являются темой этой главы.

Распространённая ошибка:

Смешивать conversion rules и equality behavior слишком рано.

Связь с Automation QA:

Assertions требуют аккуратной стратегии сравнения.

## Определите преобразования

### Задача 1

Ответ:

Explicit conversion. `Number()` выполняет numeric conversion. Результат: `200`.

Объяснение:

Строка `'200'` может стать Number `200`.

Распространённая ошибка:

Оставить status code строкой, когда numeric assertion ожидает number.

Связь с Automation QA:

API может возвращать status code как string.

### Задача 2

Ответ:

Explicit conversion. `String()` создает строковое представление. Результат: `'false'`.

Объяснение:

Boolean false становится string text `'false'`.

Распространённая ошибка:

Ожидать пустую строку.

Связь с Automation QA:

Это полезно в логах и form fields.

### Задача 3

Ответ:

Explicit conversion. `Boolean()` применяет truthy/falsy rules. Результат: `false`.

Объяснение:

Пустая строка является falsy.

Распространённая ошибка:

Считать каждую строку truthy, не проверяя пустую строку.

Связь с Automation QA:

Пустое поле формы может стать `false` при Boolean conversion.

### Задача 4

Ответ:

Implicit conversion. Вычитание ожидает Number. Результат: `4`.

Объяснение:

`'5'` становится Number `5`.

Распространённая ошибка:

Ожидать string operation.

Связь с Automation QA:

Numeric calculations со строками из API могут казаться рабочими из-за implicit conversion.

### Задача 5

Ответ:

Implicit conversion. При string operand оператор `+` здесь создает string concatenation. Результат: `'51'`.

Объяснение:

Number `1` адаптируется к string context.

Распространённая ошибка:

Ожидать numeric addition.

Связь с Automation QA:

Баг с env values: `'3' + 1` превращается в `'31'`.

## Предскажите вывод перед запуском

### Задача 1

Ответ:

```text
5
0
NaN
NaN
0
```

Объяснение:

Numeric strings преобразуются в numbers. Пустая строка и `null` преобразуются в `0`. Non-numeric string и `undefined` дают `NaN`.

Распространённая ошибка:

Ожидать, что пустая строка даст `NaN`.

Связь с Automation QA:

Input parsing должен осознанно обрабатывать пустые и некорректные values.

### Задача 2

Ответ:

```text
200
true
null
undefined
```

Объяснение:

Это string representations, даже если console output может не показывать кавычки.

Распространённая ошибка:

Забыть, что результат имеет type String.

Связь с Automation QA:

String conversion полезна для UI text values.

### Задача 3

Ответ:

```text
true
true
false
false
true
false
```

Объяснение:

Непустые строки являются truthy. Пустая строка, zero и `NaN` являются falsy.

Распространённая ошибка:

Ожидать, что `'false'` или `'0'` дадут `false`.

Связь с Automation QA:

Env strings опасны для Boolean conversion.

### Задача 4

Ответ:

```text
51
4
10
```

Объяснение:

`+` со строкой здесь создает string result. `-` и `*` ожидают Number.

Распространённая ошибка:

Считать, что все arithmetic-like operators одинаково работают со строками.

Связь с Automation QA:

Hidden conversion bugs часто появляются в расчетах из API strings.

## Упражнения на truthy и falsy

Ответ:

Truthy:

```text
true
1
"hello"
"false"
"0"
[]
{}
```

Falsy:

```text
false
0
""
null
undefined
NaN
```

Объяснение:

Boolean conversion следует фиксированным truthy/falsy rules.

Распространённая ошибка:

Думать, что empty array или empty object являются falsy.

Связь с Automation QA:

Пустые response objects или arrays все равно являются truthy.

## Чтение кода

Ответ:

Hidden conversion: `retriesFromEnv + 1` создает string concatenation behavior.

Explicit conversion: `Boolean(headlessFromEnv)`.

Bug: `retryCount` становится `'31'`; `headless` становится `true`.

Более понятный вариант:

```javascript
const retriesFromEnv = '3';
const headlessFromEnv = 'false';

const retryCount = Number(retriesFromEnv) + 1;
const booleanTextMap = {
  true: true,
  false: false,
};

const headless = booleanTextMap[headlessFromEnv];

console.log(retryCount);
console.log(headless);
```

Объяснение:

Config values являются strings. Их нужно парсить в соответствии с ожидаемым type.

Распространённая ошибка:

Использовать `Boolean('false')`.

Связь с Automation QA:

Environment parsing — частый источник bugs в test config.

## Задачи на отладку

### Задача 1

Ответ:

Проблема: `retriesFromEnv` — String, а `+` здесь выполняет string concatenation.

Исправление:

```javascript
const retriesFromEnv = '3';
const nextRetry = Number(retriesFromEnv) + 1;

console.log(nextRetry);
```

Объяснение:

Numeric addition ожидает Number values.

Распространённая ошибка:

Считать, что строка, похожая на число, уже является Number.

Связь с Automation QA:

Env variables являются strings.

### Задача 2

Ответ:

`Boolean('false')` возвращает `true`, потому что `'false'` — непустая строка.

Более точный parsing:

```javascript
const headlessFromEnv = 'false';
const booleanTextMap = {
  true: true,
  false: false,
};

const headless = booleanTextMap[headlessFromEnv];
```

Объяснение:

Boolean conversion проверяет truthiness, а не смысл текста.

Распространённая ошибка:

Считать текст `"false"` Boolean false.

Связь с Automation QA:

Такая ошибка может неожиданно изменить browser launch settings.

### Задача 3

Ответ:

Вывод:

```text
NaN
```

Объяснение:

`'not available'` не может быть преобразовано в осмысленный Number.

Распространённая ошибка:

Игнорировать некорректное numeric field.

Связь с Automation QA:

API response validation должна ловить некорректные numeric data.

## QA-задачи

### Сценарий 1

Ответ:

```javascript
const response = {
  statusCode: '200',
};

const statusCode = Number(response.statusCode);
```

Объяснение:

Тест ожидает numeric status code, но API field является String.

Распространённая ошибка:

Сравнивать визуально похожие values без учета type.

Связь с Automation QA:

API contract может представлять numbers как strings.

### Сценарий 2

Ответ:

```javascript
const ageFromInput = '30';
const age = Number(ageFromInput);
const nextAge = age + 1;
```

Объяснение:

Form values часто являются strings; numeric calculation ожидает Number.

Распространённая ошибка:

Использовать `ageFromInput + 1` и получить `'301'`.

Связь с Automation QA:

UI automation часто читает text input values.

### Сценарий 3

Ответ:

```javascript
const retriesFromEnv = '2';
const headlessFromEnv = 'false';

const retries = Number(retriesFromEnv);
const booleanTextMap = {
  true: true,
  false: false,
};

const headless = booleanTextMap[headlessFromEnv];
```

Объяснение:

Retries должен быть Number. Headless требует явного semantic parsing.

Распространённая ошибка:

Использовать `Boolean(headlessFromEnv)`.

Связь с Automation QA:

Корректный config parsing предотвращает неправильный browser mode и retry count.

### Сценарий 4

Ответ:

Checklist:

```text
1. Какой источник создал value?
2. Какой текущий type?
3. Какой type ожидает операция?
4. Conversion implicit или explicit?
5. Может ли Number conversion дать NaN?
6. Влияют ли непустые строки на Boolean conversion?
7. Env variables парсятся осознанно?
8. Form values преобразуются перед numeric operations?
```

Объяснение:

Большинство conversion bugs появляются из-за несовпадения received type и expected operation type.

Распространённая ошибка:

Отлаживать финальный assertion, не проверив входные types.

Связь с Automation QA:

Это полезно для debugging API, UI и Playwright config.

## Мини-проект

Возможное решение:

```javascript
const rawConfig = {
  retries: '3',
  headless: 'false',
  timeoutMs: '5000',
  baseUrl: 'https://example.com',
};

const parsedConfig = {
  retries: Number(rawConfig.retries),
  headless: {
    true: true,
    false: false,
  }[rawConfig.headless],
  timeoutMs: Number(rawConfig.timeoutMs),
  baseUrl: String(rawConfig.baseUrl),
};

console.log(rawConfig);
console.log(parsedConfig);

console.log(typeof parsedConfig.retries);
console.log(typeof parsedConfig.headless);
console.log(typeof parsedConfig.timeoutMs);
console.log(typeof parsedConfig.baseUrl);
```

Отчет:

```text
Property  | Raw value             | Raw type | Parsed value          | Parsed type | Почему нужна conversion
--------- | --------------------- | -------- | --------------------- | ----------- | -----------------------
retries   | "3"                   | string   | 3                     | number      | retry count числовой
headless  | "false"               | string   | false                 | boolean     | browser mode boolean
timeoutMs | "5000"                | string   | 5000                  | number      | timeout участвует в расчетах
baseUrl   | "https://example.com" | string   | "https://example.com" | string      | URL остается текстом
```

Объяснение:

Raw config имитирует env values. Parsed config делает ожидаемые types явными.

Распространённая ошибка:

Использовать `Boolean(rawConfig.headless)` и получить `true`.

Связь с Automation QA:

Это основа надежного framework configuration parsing.
