# Решения: keyof

## Концептуальные вопросы

### Ответ

`keyof Type` создает union известных ключей типа. Он работает с типом, а не с объектом во время выполнения. `Object.keys()` выполняется во время выполнения и возвращает массив строк.

### Объяснение

`keyof` нужен для проверки допустимых имен свойств на этапе компиляции.

### Типичная ошибка

Считать `keyof` аналогом `Object.keys()`.

### Связь с Automation QA

Так можно ограничивать имена локаторов, полей формы и колонок отчета.

## Чтение кода

### Ответ

`UserKey` получает тип `"id" | "email" | "active"`.

### Объяснение

TypeScript берет все известные ключи `User`.

### Типичная ошибка

Ожидать тип `string`.

### Связь с Automation QA

Так helper принимает только реальные поля test data.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку, потому что `"passwordInput"` не входит в `keyof LocatorMap`.

### Объяснение

Допустимы только `"submitButton"` и `"emailInput"`.

### Типичная ошибка

Передавать произвольную строку вместо ключа контракта.

### Связь с Automation QA

Это защищает от опечаток в именах локаторов.

## Анализ типа

### Ответ

`Object.keys(user)` возвращает строки во время выполнения, потому что реальный объект может содержать свойства, которых нет в статическом типе.

### Объяснение

TypeScript не считает результат `Object.keys()` автоматически безопасным `Array<keyof User>`.

### Типичная ошибка

Смешивать перечисление ключей во время выполнения и union ключей на этапе проверки типов.

### Связь с Automation QA

Данные из внешних источников могут иметь лишние поля.

## Задание на отладку

### Ответ

```ts
type Report = {
  title: string;
  status: "passed" | "failed";
};

function readReportField(report: Report, field: keyof Report) {
  return report[field];
}
```

### Объяснение

`field` ограничен реальными ключами `Report`.

### Типичная ошибка

Оставить `field: string` и получить небезопасный доступ.

### Связь с Automation QA

Так report helper не принимает несуществующую колонку.

## Задание Automation QA

### Ответ

```ts
type PageLocators = {
  loginButton: string;
  emailInput: string;
  passwordInput: string;
};

function getLocatorName(name: keyof PageLocators): keyof PageLocators {
  return name;
}
```

### Объяснение

Параметр и результат ограничены ключами `PageLocators`.

### Типичная ошибка

Типизировать имя локатора как обычный `string`.

### Связь с Automation QA

Это снижает риск опечаток в Page Object helpers.

## Мини-проект

### Ответ

```ts
function selectField<ObjectType>(
  object: ObjectType,
  key: keyof ObjectType
) {
  return object[key];
}
```

### Объяснение

`keyof ObjectType` гарантирует, что ключ существует в типе объекта.

### Типичная ошибка

Пытаться передать ключ, которого нет в объектном контракте.

### Связь с Automation QA

Так можно безопасно выбирать поле из test data или response model.
