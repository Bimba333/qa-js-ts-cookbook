# Практика: strict mode

## Концептуальные вопросы

1. Что включает идея `strict mode`?
2. Почему мягкая проверка может скрывать риск?
3. Почему `strict` полезен для configuration?
4. Почему нельзя просто отключать `strict`, чтобы ошибок стало меньше?
5. Почему `strict` не заменяет runtime-проверки?

## Чтение кода

Какой риск должен подсветить строгий режим?

```typescript
function normalizeBaseUrl(baseUrl: string | undefined) {
  return baseUrl.toLowerCase();
}
```

## Предскажите результат проверки

Будет ли этот код выглядеть более безопасным для strict mode?

```typescript
function buildUserUrl(baseUrl: string, userId: string) {
  return `${baseUrl}/users/${userId}`;
}

console.log(buildUserUrl('https://api.example.test', '42'));
```

## Задание на отладку

Найдите неясное место.

```typescript
let baseUrl;

baseUrl = 'https://api.example.test';

console.log(baseUrl);
```

Почему строгий режим просит делать намерение более явным?

## Задание Automation QA

В CI переменная окружения с `baseUrl` может отсутствовать.

Объясните:

* почему это не просто "редкий случай";
* почему strict mode должен заставить обработать отсутствие значения;
* почему хорошая ошибка конфигурации лучше падения в середине теста.

## Мини-проект

Опишите стратегию включения strict mode для нового Automation QA проекта:

* когда включать;
* какие части проекта проверять первыми;
* какие ошибки ожидать;
* почему не стоит откладывать strict mode до конца проекта.
