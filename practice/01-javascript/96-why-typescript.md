# Практика: Почему появился TypeScript

## Концептуальные вопросы

1. Почему JavaScript остается фундаментом для TypeScript?
2. Какая проблема возникает из-за dynamic typing в больших проектах?
3. Почему late error detection дорого обходится Automation QA framework?
4. Почему refactoring сложнее без дополнительных проверок?
5. Почему TypeScript не заменяет good JavaScript practices?

## Чтение кода

Где может появиться ошибка договоренности?

```javascript
function createUserPayload(user) {
  return {
    name: user.name,
    role: user.role,
  };
}

const user = {
  fullName: 'Anna',
  role: 'admin',
};

console.log(createUserPayload(user));
```

## Предскажите результат

Что выведет код?

```javascript
function getTestTitle(test) {
  return test.title;
}

const test = {
  name: 'checkout test',
};

console.log(getTestTitle(test));
```

## Задание на отладку

Почему такая ошибка может обнаружиться поздно?

```javascript
function buildRequest(data) {
  return {
    email: data.email,
  };
}

const testData = {
  userEmail: 'qa@example.com',
};
```

## Задание Automation QA

Опишите проблему в большом test framework:

```text
test data
│
▼
request builder
│
▼
api client
│
▼
assertion
```

Где ошибка формы данных может стать дорогой?

## Мини-проект

Опишите, какие проблемы TypeScript должен помочь обнаруживать в будущем разделе:

* неправильная форма test data;
* неверные параметры helper-функции;
* небезопасный refactoring;
* ошибки между modules.

Не используйте TypeScript syntax.
