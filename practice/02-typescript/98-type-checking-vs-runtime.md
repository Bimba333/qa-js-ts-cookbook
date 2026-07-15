# Практика: Type Checking vs Runtime

## Концептуальные вопросы

1. Чем compile time отличается от runtime?
2. Что проверяет TypeScript во время type checking?
3. Почему TypeScript не может гарантировать форму данных, пришедших из API?
4. Почему runtime-ошибки не исчезают после перехода на TypeScript?
5. Где проходит граница ответственности TypeScript?

## Чтение кода

Какая проблема видна до запуска?

```typescript
function getStatusText(status: string) {
  return status.toUpperCase();
}

getStatusText(200);
```

## Предскажите результат

Что произойдет в JavaScript runtime?

```javascript
function getStatusText(status) {
  return status.toUpperCase();
}

console.log(getStatusText(200));
```

## Задание на отладку

Почему этот код может пройти type checking, но все равно требовать runtime-проверки?

```typescript
function printStatus(status: string) {
  console.log(status.toUpperCase());
}

const apiStatus = JSON.parse('{"status": 200}').status;

printStatus(apiStatus);
```

## Задание Automation QA

Представьте API helper:

```typescript
function assertStatus(status: string) {
  console.log(`Expected status: ${status}`);
}
```

Ответьте:

* что TypeScript может проверить до запуска;
* что останется runtime-риском;
* какую дополнительную проверку должен сделать тест.

## Мини-проект

Составьте две колонки:

* `type checking`;
* `runtime`.

Разнесите по ним:

* неверный аргумент функции;
* ошибка сети;
* неожиданный JSON response;
* несовпадение типа переменной;
* падение сервера.
