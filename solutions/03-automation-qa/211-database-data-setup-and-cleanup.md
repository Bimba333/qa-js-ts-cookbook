# Решения: Подготовка и очистка данных в database

## 1. Владение тестовыми данными
### Ответ
Сценарий создаёт уникальные сущности владельца и задачи, а затем удаляет задачу перед владельцем. Fixture может выполнять очистку, если получает их точные ID.
### Объяснение
Владелец жизненного цикла должен быть один и определён явно.
### Типичная ошибка
Передавать очистку другому тесту.
### Связь с Automation QA
Повторный запуск не зависит от соседних сценариев.

## 2. Предскажите результат
### Ответ
PostgreSQL отклонит удаление владельца с нарушением внешнего ключа, пока задача ссылается на него.
### Объяснение
Ограничение защищает ссылочную целостность.
### Типичная ошибка
Отключать ограничение для упрощения очистки.
### Связь с Automation QA
Удаление идёт в обратном порядке зависимостей.

## 3. Отладка опасной очистки
### Ответ
```ts
await client.query("DELETE FROM tasks WHERE id = $1", [ownedTaskId]);
```
### Объяснение
Точный ключ ограничивает изменение данными владельца.
### Типичная ошибка
Использовать широкий префикс заголовка.
### Связь с Automation QA
Очистка не затрагивает параллельные сценарии.

## 4. Реализация идемпотентной очистки
### Ответ
```ts
const result = await client.query("DELETE FROM tasks WHERE id = $1", [taskId]);
expect([0, 1]).toContain(result.rowCount);
```
### Объяснение
1 означает удалённую строку, 0 — уже отсутствующую. Оба результата допустимы для идемпотентной очистки по точному ID.
### Типичная ошибка
Расширять `WHERE`, если `rowCount` равен 0.
### Связь с Automation QA
Очистка безопасно повторяется после частичного падения.

## 5. Очистка после падения
### Ответ
```ts
let scenarioError: unknown;
try {
  await runScenario();
} catch (error) {
  scenarioError = error;
} finally {
  let cleanupError: unknown;
  try {
    await client.query("DELETE FROM tasks WHERE id = $1", [taskId]);
  } catch (error) {
    cleanupError = error;
  }

  if (scenarioError !== undefined && cleanupError !== undefined) {
    throw new AggregateError([scenarioError, cleanupError]);
  }
  if (scenarioError !== undefined) {
    throw scenarioError;
  }
  if (cleanupError !== undefined) {
    throw cleanupError;
  }
}
```
### Объяснение
`finally` выполняется после ошибок проверки и запроса. Во вспомогательной функции обе причины следует объединять через `AggregateError`, чтобы ошибка очистки не скрыла исходную ошибку.
### Типичная ошибка
Размещать очистку последней строкой `try`.
### Связь с Automation QA
Падение не оставляет устаревшие данные.

## 6. Мини-проект: связанный жизненный цикл
### Ответ
```ts
try {
  await client.query("INSERT INTO owners (id, name) VALUES ($1, $2)", [ownerId, name]);
  await client.query("INSERT INTO tasks (id, title, priority, owner_id) VALUES ($1, $2, $3, $4)", [taskId, title, "low", ownerId]);
  const row = await client.query("SELECT owner_id FROM tasks WHERE id = $1", [taskId]);
  expect(row.rows[0]?.owner_id).toBe(ownerId);
} finally {
  await client.query("DELETE FROM tasks WHERE id = $1", [taskId]);
  await client.query("DELETE FROM owners WHERE id = $1", [ownerId]);
}
```
### Объяснение
Уникальные ID и порядок зависимостей делают жизненный цикл детерминированным.
### Типичная ошибка
Использовать общего владельца для всех тестов.
### Связь с Automation QA
Сценарий полностью владеет графом данных.
