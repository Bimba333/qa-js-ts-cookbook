# Практика: JSON

## Концептуальные вопросы

1. Чем JavaScript object отличается от JSON text?
2. Что делает `JSON.stringify()`?
3. Что делает `JSON.parse()`?
4. Почему functions и `undefined` не подходят для JSON?
5. Почему circular references нельзя сериализовать в обычный JSON?

## Чтение кода

Что хранится в переменной `body`?

```javascript
const payload = {
  email: 'qa@example.com',
  role: 'admin',
};

const body = JSON.stringify(payload);

console.log(typeof body);
console.log(body);
```

## Предскажите результат

Что выведет код?

```javascript
const text = '{"status":"passed","duration":1200}';
const result = JSON.parse(text);

console.log(result.status);
console.log(result.duration);
```

## Задание на отладку

Почему этот код выбросит ошибку?

```javascript
const responseText = '{status: passed}';

const response = JSON.parse(responseText);
console.log(response.status);
```

Исправьте JSON text.

## Задание Automation QA

Создайте request body для API login:

```text
email
password
rememberMe
```

Преобразуйте объект в JSON text.

## Мини-проект

Напишите две функции:

* `saveFixture(data)` — возвращает JSON text;
* `loadFixture(text)` — возвращает JavaScript object.

Проверьте работу на объекте test user.
