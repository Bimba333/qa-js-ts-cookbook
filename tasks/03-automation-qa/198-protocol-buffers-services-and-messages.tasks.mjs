export default [
  {
    id: 'qa-198-message-per-rpc',
    title: 'У каждого вызова своё сообщение',
    difficulty: 'medium',
    lang: 'grpc',
    prompt:
      'Контракт объявляет для каждого вызова свои сообщения запроса и ответа. ' +
      'Выполните все три вызова службы и верните ' +
      '`{ searchKeys, getKeys, transitionKeys }` — отсортированные списки полей ' +
      'верхнего уровня каждого ответа. Для перехода создайте свою запись через ' +
      '`api.post` и переведите её в `IN_PROGRESS`.',
    starter: `export default async function solve({ client, metadata, api }) {
  // Ответ поиска, ответ чтения и ответ перехода устроены по-разному.

  return { searchKeys: [], getKeys: [], transitionKeys: [] };
}`,
    hints: [
      'Поиск возвращает список и общее число, а не одну запись.',
      'Чтение возвращает саму запись без обёртки.',
      'Ответ перехода объявлен отдельным сообщением с одним полем.'
    ],
    tests: [
      {
        name: 'ответ поиска — список и счётчик',
        code: `expect(result.searchKeys).toEqual(['items', 'total']);`
      },
      {
        name: 'ответ чтения — сама запись',
        code: `expect(result.getKeys.includes('id')).toBe(true);
expect(result.getKeys.includes('items')).toBe(false);`
      },
      {
        name: 'ответ перехода оборачивает запись',
        code: `expect(result.transitionKeys).toEqual(['item']);`
      },
      {
        name: 'три ответа устроены по-разному',
        code: `const shapes = [
  result.searchKeys.join(','),
  result.getKeys.join(','),
  result.transitionKeys.join(',')
];
expect(new Set(shapes).size).toBe(3);`
      },
      {
        name: 'запись чтения содержит поля контракта',
        code: `for (const field of ['id', 'title', 'status', 'priority', 'version']) {
  expect(result.getKeys.includes(field)).toBe(true);
}`
      }
    ],
    solution: `function call(client, method, request, metadata) {
  return new Promise((resolve, reject) => {
    client[method](request, metadata, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

export default async function solve({ client, metadata, api }) {
  const search = await call(client, 'SearchWorkItems', { limit: 1 }, metadata);

  const created = await api.post('/work-items', {
    title: 'Сообщения контракта',
    description: 'По одному сообщению на вызов',
    priority: 'LOW'
  });

  const read = await call(client, 'GetWorkItem', { id: created.body.id }, metadata);

  const moved = await call(client, 'TransitionWorkItem', {
    id: created.body.id,
    targetStatus: 'IN_PROGRESS',
    expectedVersion: created.body.version
  }, metadata);

  return {
    searchKeys: Object.keys(search).sort(),
    getKeys: Object.keys(read).sort(),
    transitionKeys: Object.keys(moved).sort()
  };
}`
  }
]
