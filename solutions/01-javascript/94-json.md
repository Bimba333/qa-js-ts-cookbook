# Решения: JSON

## Концептуальные вопросы

### 1. Чем JavaScript object отличается от JSON text?

Ответ: JavaScript object — значение в памяти, JSON text — строка для передачи или хранения.

Объяснение: объектом можно пользоваться в коде, а JSON text можно отправить по сети.

Типичная ошибка: считать JSON обычным объектом JavaScript.

Связь с Automation QA: API request body часто начинается как объект и отправляется как JSON text.

### 2. Что делает `JSON.stringify()`?

Ответ: превращает JavaScript value в JSON text.

Объяснение: это сериализация.

Типичная ошибка: ожидать, что после `JSON.stringify()` можно обращаться к полям через точку.

Связь с Automation QA: request body перед отправкой часто сериализуется.

### 3. Что делает `JSON.parse()`?

Ответ: превращает JSON text в JavaScript value.

Объяснение: это десериализация.

Типичная ошибка: передавать в `JSON.parse()` уже готовый объект.

Связь с Automation QA: response body после получения нужно превратить в объект для проверок.

### 4. Почему functions и `undefined` не подходят для JSON?

Ответ: JSON хранит данные, а не поведение и не специальные значения JavaScript.

Объяснение: functions не являются частью JSON-формата, а `undefined` не является JSON value.

Типичная ошибка: ожидать, что helper function сохранится в fixture.

Связь с Automation QA: fixture должен содержать данные, а не функции.

### 5. Почему circular references нельзя сериализовать в обычный JSON?

Ответ: JSON должен быть конечной структурой данных.

Объяснение: если объект ссылается сам на себя, сериализация не может построить обычное дерево JSON.

Типичная ошибка: случайно добавлять ссылку на родительский объект в child object.

Связь с Automation QA: сложные report objects не должны содержать циклические ссылки.

## Чтение кода

Ответ: `body` хранит строку.

Объяснение: `JSON.stringify(payload)` возвращает JSON text, поэтому `typeof body` будет `string`.

Типичная ошибка: думать, что `body.email` будет доступен после сериализации.

Связь с Automation QA: сериализованный request body уже готов к передаче, но не к обычной работе как объект.

## Предскажите результат

Ответ:

```text
passed
1200
```

Объяснение: `JSON.parse()` вернет объект с полями `status` и `duration`.

Типичная ошибка: ожидать, что числа из JSON всегда становятся строками.

Связь с Automation QA: API response после разбора можно проверять как обычный объект.

## Задание на отладку

Ответ:

```javascript
const responseText = '{"status":"passed"}';

const response = JSON.parse(responseText);
console.log(response.status);
```

Объяснение: в JSON имена свойств и строковые значения должны быть в двойных кавычках.

Типичная ошибка: писать JSON text как JavaScript object literal.

Связь с Automation QA: некорректный fixture file сломает загрузку test data.

## Задание Automation QA

Ответ:

```javascript
const requestBody = {
  email: 'qa@example.com',
  password: 'secret',
  rememberMe: true,
};

const jsonBody = JSON.stringify(requestBody);
```

Объяснение: объект удобен для создания данных, JSON text нужен для передачи.

Типичная ошибка: отправлять объект туда, где ожидается строка.

Связь с Automation QA: login request обычно отправляет сериализованный body.

## Мини-проект

Ответ:

```javascript
function saveFixture(data) {
  return JSON.stringify(data);
}

function loadFixture(text) {
  return JSON.parse(text);
}

const user = {
  email: 'qa@example.com',
  role: 'admin',
};

const saved = saveFixture(user);
const loaded = loadFixture(saved);

console.log(loaded.email);
```

Объяснение: первая функция сериализует данные, вторая десериализует их обратно.

Типичная ошибка: забыть, что между этими шагами данные находятся в виде строки.

Связь с Automation QA: fixtures часто сохраняются как JSON text и читаются обратно как objects.
