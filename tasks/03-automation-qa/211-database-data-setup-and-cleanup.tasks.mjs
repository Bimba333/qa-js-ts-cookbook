export default [
  {
    id: 'qa-211-cleanup-is-idempotent',
    title: 'Повторное удаление безопасно',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Создайте задачу, удалите её, затем попробуйте удалить ещё раз. Верните объект ' +
      '`{ created, firstDelete, secondDelete, afterDelete }`, где последний — ответ ' +
      'на чтение удалённой записи. Проверки убедятся, что повторное удаление не ' +
      'ломает сценарий.',
    starter: `export default async function solve(api) {
  // 1. Создайте задачу
  // 2. Удалите её
  // 3. Повторите удаление
  // 4. Прочитайте запись после удаления

  return { created: null, firstDelete: null, secondDelete: null, afterDelete: null };
}`,
    hints: [
      'Удаление выполняется по идентификатору созданной записи.',
      'Повторное удаление не должно выбрасывать исключение — это обычный ответ.',
      'Чтение удалённой записи сообщает о её отсутствии.'
    ],
    tests: [
      {
        name: 'создание проходит',
        code: `expect(result.created.status).toBe(201);`
      },
      {
        name: 'первое удаление успешно',
        code: `expect(result.firstDelete.status >= 200 && result.firstDelete.status < 300).toBe(true);`
      },
      {
        name: 'повторное удаление не ломает сценарий',
        code: `expect(result.secondDelete.status >= 200 && result.secondDelete.status < 500).toBe(true);`
      },
      {
        name: 'после удаления запись не читается',
        code: `expect(result.afterDelete.status).toBe(404);`
      },
      {
        name: 'запись действительно удалена со стенда',
        code: `const current = await api.get('/work-items/' + result.created.body.id);
expect(current.status).toBe(404);`
      }
    ],
    solution: `export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Запись для проверки очистки',
    description: 'Создана задачей главы 211',
    priority: 'LOW'
  });

  const id = created.body.id;
  const firstDelete = await api.delete('/work-items/' + id);
  const secondDelete = await api.delete('/work-items/' + id);
  const afterDelete = await api.get('/work-items/' + id);

  return { created, firstDelete, secondDelete, afterDelete };
}`
  },

  {
    id: 'qa-211-unique-title-per-run',
    title: 'Уникальные данные для параллельного запуска',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Создайте две задачи с уникальными заголовками, построенными от общего ' +
      'префикса, и верните объект `{ first, second, found }`, где `found` — ответ на ' +
      '`GET /work-items?limit=100`. Заголовки не должны совпадать между собой.',
    starter: `export default async function solve(api) {
  // Уникальность заголовка обеспечивает сам сценарий.

  return { first: null, second: null, found: null };
}`,
    hints: [
      'Уникальный суффикс можно получить из счётчика или случайного значения.',
      'Оба заголовка должны отличаться, иначе записи станут неразличимы.',
      'Чтение списка нужно, чтобы убедиться: обе записи попали на стенд.',
      'Максимальный размер страницы у стенда — 100; большее значение отклоняется.'
    ],
    tests: [
      {
        name: 'обе записи созданы',
        code: `expect(result.first.status).toBe(201);
expect(result.second.status).toBe(201);`
      },
      {
        name: 'заголовки различаются',
        code: `expect(result.first.body.title === result.second.body.title).toBe(false);`
      },
      {
        name: 'идентификаторы различаются',
        code: `expect(result.first.body.id === result.second.body.id).toBe(false);`
      },
      {
        name: 'обе записи доступны для чтения',
        code: `const a = await api.get('/work-items/' + result.first.body.id);
const b = await api.get('/work-items/' + result.second.body.id);
expect(a.status + b.status).toBe(400);`
      },
      {
        name: 'список читается успешно',
        code: `expect(result.found.status).toBe(200);`
      }
    ],
    solution: `export default async function solve(api) {
  const prefix = 'Проверка-211-' + Math.floor(Math.random() * 1_000_000);

  const first = await api.post('/work-items', {
    title: prefix + '-1',
    description: 'Первая запись сценария',
    priority: 'LOW'
  });

  const second = await api.post('/work-items', {
    title: prefix + '-2',
    description: 'Вторая запись сценария',
    priority: 'HIGH'
  });

  const found = await api.get('/work-items?limit=100');

  return { first, second, found };
}`
  }
]
