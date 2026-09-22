export default [
  {
    id: 'qa-193-version-conflict',
    title: 'Конфликт версий при обновлении',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Создайте задачу через REST, обновите ей заголовок с правильной ожидаемой версией, ' +
      'а затем повторите обновление с той же — уже устаревшей — версией. ' +
      'Верните объект `{ created, updated, stale }` с тремя ответами стенда.',
    starter: `/**
 * api.post(path, body), api.get(path), api.patch(path, body), api.delete(path)
 * Каждый вызов возвращает { status, headers, body }.
 */
export default async function solve(api) {
  // 1. Создайте задачу: POST /work-items
  // 2. Обновите заголовок с expectedVersion от созданной записи
  // 3. Повторите обновление с той же expectedVersion

  return { created: null, updated: null, stale: null };
}`,
    hints: [
      'Создание возвращает полную запись: в ней есть и идентификатор, и начальная версия.',
      'Обновление требует поля expectedVersion — стенд сверяет его с текущей версией строки.',
      'Успешное обновление увеличивает версию, поэтому повтор с прежним значением уже не совпадёт.'
    ],
    tests: [
      {
        name: 'создание возвращает 201 и первую версию',
        code: `expect(result.created.status).toBe(201);
expect(result.created.body.version).toBe(1);`
      },
      {
        name: 'первое обновление проходит и повышает версию',
        code: `expect(result.updated.status).toBe(200);
expect(result.updated.body.version).toBe(2);`
      },
      {
        name: 'повтор с устаревшей версией даёт 409',
        code: `expect(result.stale.status).toBe(409);
expect(result.stale.body.code).toBe('VERSION_CONFLICT');`
      },
      {
        name: 'отказ не изменил запись',
        code: `const current = await api.get('/work-items/' + result.created.body.id);
expect(current.body.version).toBe(2);
expect(current.body.title).toBe(result.updated.body.title);`
      },
      {
        name: 'запись действительно сохранена в базе',
        code: `const stored = await query(
  "SELECT version FROM work_items WHERE id = '" + result.created.body.id + "'"
);
expect(Number(stored[0].version)).toBe(2);`
      }
    ],
    solution: `export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Задача для проверки конфликта версий',
    description: 'Создана решением задачи',
    priority: 'MEDIUM'
  });

  const updated = await api.patch('/work-items/' + created.body.id, {
    title: 'Обновлённый заголовок',
    expectedVersion: created.body.version
  });

  const stale = await api.patch('/work-items/' + created.body.id, {
    title: 'Попытка записи из устаревшего состояния',
    expectedVersion: created.body.version
  });

  return { created, updated, stale };
}`
  }
]
