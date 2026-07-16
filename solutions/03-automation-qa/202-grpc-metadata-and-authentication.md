# Решения: Metadata и аутентификация gRPC

## Задача 1. Концептуальные вопросы
### Ответ
Request message передаёт данные операции, а metadata — служебный контекст вызова: данные доступа, correlation ID и другие атрибуты протокола. Аутентификация устанавливает, кто вызывает service, а авторизация определяет, разрешена ли ему конкретная операция.
### Объяснение
Бизнес-данные и контекст call имеют разные обязанности и изменяются по разным причинам.
### Типичная ошибка
Помещать token внутрь каждого request message.
### Связь с Automation QA
Разделение позволяет независимо проверять контракт данных и правила доступа.

## Задача 2. Анализ доступа
### Ответ
Отсутствующий либо недействительный token должен приводить к `UNAUTHENTICATED`. Допустимый read-only token для запрещённой операции записи должен приводить к `PERMISSION_DENIED`.
### Объяснение
Во втором случае вызывающая сторона уже распознана, но не обладает требуемым правом.
### Типичная ошибка
Возвращать один status для всех отказов в доступе.
### Связь с Automation QA
Точный status показывает, на каком этапе нарушена граница безопасности.

## Задача 3. Предскажите результат
### Ответ
Параллельные calls могут получить чужой token: результат зависит от порядка изменений общего изменяемого объекта.
### Объяснение
Metadata должна создаваться для конкретного call либо неизменяемого контекста fixture.
### Типичная ошибка
Переиспользовать один изменяемый `Metadata` между тестами.
### Связь с Automation QA
Отдельные metadata для каждого call сохраняют изоляцию при параллельном выполнении.

## Задача 4. Поиск ошибки
### Ответ
Записывать в лог следует безопасные поля, например correlation ID, RPC method и status code. Значение authorization нужно исключить или заменить маркером `[REDACTED]`.
### Объяснение
Данные доступа не становятся безопасными только потому, что работа ведётся с учебным service или в тестовом окружении.
### Типичная ошибка
Прикладывать полное содержимое metadata к отчёту.
### Связь с Automation QA
Безопасная диагностика предотвращает утечку секретов в артефакты CI.

## Задача 5. Automation QA
### Ответ
Допустимый token проверяет успешный response и возвращённые correlation metadata. Отсутствующий и недействительный token ожидают `UNAUTHENTICATED`. Read-only token ожидает `PERMISSION_DENIED`. Каждый сценарий создаёт собственные metadata с уникальным correlation ID.
### Объяснение
Матрица разделяет личность вызывающей стороны, право доступа и трассировку request.
### Типичная ошибка
Проверять только наличие ошибки без точного status.
### Связь с Automation QA
Независимые сценарии дают понятный набор регрессионных проверок доступа.

## Задача 6. Мини-проект
### Ответ
```ts
const metadata = new Metadata();
metadata.set("authorization", "Bearer test-token");
metadata.set("x-correlation-id", "case-202");

const { response: task, initialMetadata } = await callUnaryWithMetadata<Task__Output>((callback) =>
  client.createAuthorizedTask({ title: "Secured" }, metadata, callback));

expect(task.title).toBe("Secured");
expect(initialMetadata.get("x-correlation-id")).toContain("case-202");

await expect(callUnary((callback) =>
  client.createAuthorizedTask({ title: "Missing" }, callback)))
  .rejects.toMatchObject({ code: status.UNAUTHENTICATED });

const invalid = new Metadata();
invalid.set("authorization", "Bearer invalid-token");

await expect(callUnary((callback) =>
  client.createAuthorizedTask({ title: "Denied" }, invalid, callback)))
  .rejects.toMatchObject({ code: status.UNAUTHENTICATED });

const readOnly = new Metadata();
readOnly.set("authorization", "Bearer read-token");

await expect(callUnary((callback) =>
  client.createAuthorizedTask({ title: "Forbidden" }, readOnly, callback)))
  .rejects.toMatchObject({ code: status.PERMISSION_DENIED });
```
### Объяснение
Metadata создаётся для каждого call, а негативные сценарии различают status аутентификации и авторизации.
### Типичная ошибка
Использовать реальные данные доступа в запускаемом примере.
### Связь с Automation QA
Тот же шаблон применяется fixture, которая выдаёт безопасный контекст аутентифицированного client.
