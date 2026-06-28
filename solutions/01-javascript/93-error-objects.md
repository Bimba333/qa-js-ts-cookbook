# Решения: Error Objects

## Концептуальные вопросы

### 1. Почему `throw new Error()` лучше, чем `throw 'message'`?

Ответ: `Error object` содержит стандартную структуру ошибки.

Объяснение: у него есть `message`, `name` и stack trace для отладки.

Типичная ошибка: выбрасывать строку и потом терять информацию о типе ошибки.

Связь с Automation QA: reports и helpers лучше работают с полноценными Error objects.

### 2. Для чего нужны свойства `message` и `name`?

Ответ: `message` описывает проблему, а `name` показывает тип ошибки.

Объяснение: вместе они помогают понять, что произошло и к какой категории относится ошибка.

Типичная ошибка: писать слишком общее сообщение вроде `Failed`.

Связь с Automation QA: понятное сообщение ускоряет анализ failed test.

### 3. Почему stack trace полезен для отладки, но не должен парситься программно?

Ответ: stack trace помогает человеку найти путь вызовов, но его формат не является надежным контрактом.

Объяснение: разные среды выполнения могут отображать stack trace по-разному.

Типичная ошибка: строить логику приложения на разборе строки `stack`.

Связь с Automation QA: stack trace полезен в report, но не должен управлять поведением framework.

### 4. Когда уместно создать custom Error class?

Ответ: когда нужно явно отличать доменную ошибку от общей ошибки.

Объяснение: custom Error class дает понятное имя и сохраняет стандартное поведение `Error`.

Типичная ошибка: создавать custom classes для каждой мелкой проверки без реальной пользы.

Связь с Automation QA: `InvalidTestDataError` помогает отличить плохие test data от падения API.

### 5. Почему в Automation QA helper должен выбрасывать понятную ошибку?

Ответ: helper часто используется во многих тестах, поэтому его ошибка должна быстро объяснять причину падения.

Объяснение: плохое сообщение заставляет искать root cause вручную.

Типичная ошибка: выбрасывать `false`, строку или слишком общий `Error`.

Связь с Automation QA: понятные assertion helpers делают CI reports полезнее.

## Чтение кода

Ответ: в `catch` попадет Error object.

Объяснение: `error.name` выведет `Error`, а `error.message` выведет `baseUrl is required`.

Типичная ошибка: ожидать, что в `catch` попадет только текст сообщения.

Связь с Automation QA: такая ошибка похожа на проверку обязательной конфигурации перед запуском тестов.

## Предскажите результат

Ответ: код выведет `TypeError`.

Объяснение: `new TypeError()` создает Error object с именем `TypeError`.

Типичная ошибка: думать, что `TypeError` появляется только автоматически.

Связь с Automation QA: helper может сам выбросить `TypeError`, если получил значение неправильной формы.

## Задание на отладку

Ответ:

```javascript
function assertResponse(response) {
  if (!response.ok) {
    throw new Error('Response failed');
  }
}
```

Объяснение: `Error object` сохраняет стандартные свойства ошибки.

Типичная ошибка: выбрасывать строку, потому что она визуально короче.

Связь с Automation QA: полноценная ошибка лучше отображается в test report.

## Задание Automation QA

Ответ:

```javascript
function assertStatusCode(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, received ${response.status}`);
  }
}
```

Объяснение: сообщение содержит ожидаемое и фактическое значение.

Типичная ошибка: писать `Wrong status` без деталей.

Связь с Automation QA: такая ошибка сразу показывает причину failed API check.

## Мини-проект

Ответ:

```javascript
class InvalidTestDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidTestDataError';
  }
}

function validateUserData(user) {
  if (!user.email) {
    throw new InvalidTestDataError('email is required');
  }

  if (!user.role) {
    throw new InvalidTestDataError('role is required');
  }

  if (typeof user.role !== 'string') {
    throw new InvalidTestDataError('role must be a string');
  }
}
```

Объяснение: custom Error class описывает конкретную доменную проблему.

Типичная ошибка: выбрасывать общий `Error` без указания поля.

Связь с Automation QA: в большом framework это помогает отделить ошибку test data от ошибки приложения.
