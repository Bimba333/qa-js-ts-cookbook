export default [
  {
    id: 'qa-187-request-parts',
    title: 'Части запроса: путь, параметры, тело',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Соберите три разных запроса и верните объект ' +
      '`{ created, filtered, updated }`. ' +
      '`created` — ответ на создание задачи с заголовком `Структура запроса`, ' +
      'описанием `Метод, путь, тело` и приоритетом `LOW` (тело запроса). ' +
      '`filtered` — ответ на `GET /work-items` с параметрами строки запроса ' +
      '`priority=LOW` и `limit=100`. ' +
      '`updated` — ответ на изменение созданной задачи: статус `IN_PROGRESS` ' +
      'и `expectedVersion`, равный текущей версии записи.',
    starter: `export default async function solve(api) {
  // Создание — тело запроса, выборка — параметры строки запроса,
  // изменение — путь с идентификатором плюс тело.

  return { created: null, filtered: null, updated: null };
}`,
    hints: [
      'Параметры строки запроса пишутся после вопросительного знака в пути.',
      'Идентификатор созданной записи приходит в теле ответа на создание.',
      'Изменение требует указать версию, от которой оно делается.'
    ],
    tests: [
      {
        name: 'создание вернуло 201',
        code: `expect(result.created.status).toBe(201);`
      },
      {
        name: 'выборка отфильтрована по приоритету',
        code: `expect(result.filtered.status).toBe(200);
expect(result.filtered.body.items.every(item => item.priority === 'LOW')).toBe(true);`
      },
      {
        name: 'созданная запись попала в выборку',
        code: `expect(result.filtered.body.items.some(item => item.id === result.created.body.id)).toBe(true);`
      },
      {
        name: 'изменение прошло и подняло версию',
        code: `expect(result.updated.status).toBe(200);
expect(result.updated.body.version).toBe(result.created.body.version + 1);`
      },
      {
        name: 'новый статус сохранён на стенде',
        code: `const response = await api.get('/work-items/' + result.created.body.id);
expect(response.body.status).toBe('IN_PROGRESS');`
      }
    ],
    solution: `export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Структура запроса',
    description: 'Метод, путь, тело',
    priority: 'LOW'
  });

  const filtered = await api.get('/work-items?priority=LOW&limit=100');

  const updated = await api.patch('/work-items/' + created.body.id, {
    status: 'IN_PROGRESS',
    expectedVersion: created.body.version
  });

  return { created, filtered, updated };
}`
  }
]
