# Практика. Глава 30. Spread

## Концептуальные вопросы

Ответьте своими словами.

1. Зачем существует Spread?
2. Какое направление у Spread?
3. Какое направление у Rest?
4. Почему `...` нельзя понимать как одну универсальную операцию?
5. Что делает Spread в function call?
6. Что делает Spread в array literal?
7. Что делает Spread в object literal?
8. Что такое shallow copy на высоком уровне?
9. Почему порядок object properties важен?
10. Где Spread полезен в Automation QA?

## Rest vs Spread

Объясните разницу между Rest и Spread в каждом примере.

### Задача 1

```javascript
function collectValues(...values) {
  console.log(values);
}
```

### Задача 2

```javascript
const values = [200, 201, 204];

collectValues(...values);
```

### Задача 3

```javascript
const copiedValues = [...values];
```

## Identify Spread direction

Для каждого примера укажите, что раскрывается и куда.

### Задача 1

```javascript
const statuses = [200, 201, 204];

console.log(...statuses);
```

### Задача 2

```javascript
const allStatuses = [...smokeStatuses, ...regressionStatuses];
```

### Задача 3

```javascript
const requestPayload = {
  ...basePayload,
  email: 'anna@example.com'
};
```

## Предскажите вывод перед запуском

### Задача 1

```javascript
const statuses = [200, 201];

console.log([...statuses, 204]);
```

### Задача 2

```javascript
function showStatuses(firstStatus, secondStatus) {
  console.log(firstStatus);
  console.log(secondStatus);
}

const statuses = [200, 201];

showStatuses(...statuses);
```

### Задача 3

```javascript
const baseUser = {
  role: 'user'
};

const adminUser = {
  ...baseUser,
  role: 'admin'
};

console.log(adminUser.role);
```

### Задача 4

```javascript
const baseConfig = {
  retries: 1
};

const config = {
  retries: 2,
  ...baseConfig
};

console.log(config.retries);
```

## Задачи на отладку

### Задача 1

Почему объяснение неверно?

```text
В function call ...statuses собирает arguments в array.
```

### Задача 2

Почему результат role равен `user`, а не `admin`?

```javascript
const baseUser = {
  role: 'user'
};

const user = {
  role: 'admin',
  ...baseUser
};
```

### Задача 3

Почему нельзя считать это deep copy?

```javascript
const copiedPayload = {
  ...basePayload
};
```

### Задача 4

Почему этот setup может быть трудно читать?

```javascript
const payload = { ...base, ...user, ...override, role: 'admin' };
```

## QA-oriented tasks

### Сценарий 1. Merge test data

Создайте `baseUser` и `adminUser`.

`adminUser` должен использовать object spread и переопределить `role`.

### Сценарий 2. Copy request payload

Создайте `basePayload`.

Создайте `requestPayload` через shallow copy и добавьте `email`.

### Сценарий 3. Compose helper arguments

Создайте function `validateThreeStatuses(firstStatus, secondStatus, thirdStatus)`.

Создайте array `statuses`.

Вызовите функцию через Spread.

### Сценарий 4. Extend configuration

Создайте `baseConfig` и `localConfig`.

`localConfig` должен расширять `baseConfig`.

## Мини-проект

Создайте файл:

```text
playground/spread-qa-setup.js
```

В нем:

1. Создайте `basePayload`.
2. Создайте `adminPayload` через object spread.
3. Создайте `smokeStatuses`.
4. Создайте `regressionStatuses`.
5. Объедините statuses через array spread.
6. Создайте helper `validateThreeStatuses`.
7. Передайте первые три status values через Spread.
8. Добавьте отчет:

```text
Operation | Input collection | Spread result | QA meaning
```
