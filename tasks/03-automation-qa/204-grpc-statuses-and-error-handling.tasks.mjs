export default [
  {
    id: 'qa-204-status-map',
    title: 'Разные причины — разные статусы',
    difficulty: 'hard',
    lang: 'grpc',
    prompt:
      'Соберите карту отказов. Выполните четыре вызова и верните ' +
      '`{ notFound, invalidId, staleVersion, forbidden }`, где каждое значение — ' +
      '`{ code, name }` (`name` из `grpc.status`): ' +
      '1) `GetWorkItem` с корректным, но несуществующим идентификатором ' +
      '`00000000-0000-4000-8000-000000000000`; ' +
      '2) `GetWorkItem` с идентификатором неверного формата `WI-404`; ' +
      '3) `TransitionWorkItem` над **своей** записью с устаревшей ' +
      '`expectedVersion`; ' +
      '4) `TransitionWorkItem` над seed-записью из выборки. ' +
      'Свою запись создайте через `api.post(\'/work-items\', ...)` и переведите ' +
      'её в `IN_PROGRESS`, чтобы версия выросла.',
    starter: `export default async function solve({ client, metadata, grpc, api }) {
  // Четыре разные причины отказа должны дать четыре разных статуса.

  return { notFound: null, invalidId: null, staleVersion: null, forbidden: null };
}`,
    hints: [
      'Свою запись удобно создать через REST, а менять — через gRPC.',
      'Устаревшая версия — это та, что была до успешного перехода.',
      'Seed-запись можно взять из ответа SearchWorkItems.'
    ],
    tests: [
      {
        name: 'несуществующая запись',
        code: `expect(result.notFound.name).toBe('NOT_FOUND');
expect(result.notFound.code).toBe(grpc.status.NOT_FOUND);`
      },
      {
        name: 'неверный формат идентификатора',
        code: `expect(result.invalidId.name).toBe('INVALID_ARGUMENT');`
      },
      {
        name: 'устаревшая версия',
        code: `expect(result.staleVersion.name).toBe('FAILED_PRECONDITION');`
      },
      {
        name: 'запрещённая операция',
        code: `expect(result.forbidden.name).toBe('PERMISSION_DENIED');`
      },
      {
        name: 'четыре причины дали четыре разных кода',
        code: `const codes = [
  result.notFound.code,
  result.invalidId.code,
  result.staleVersion.code,
  result.forbidden.code
];
expect(new Set(codes).size).toBe(4);`
      }
    ],
    solution: `function call(client, method, request, metadata) {
  return new Promise(resolve => {
    client[method](request, metadata, (error, response) => {
      if (error) resolve({ error });
      else resolve({ response });
    });
  });
}

const describe = (outcome, grpc) => ({
  code: outcome.error.code,
  name: grpc.status[outcome.error.code]
});

export default async function solve({ client, metadata, grpc, api }) {
  const missing = await call(client, 'GetWorkItem',
    { id: '00000000-0000-4000-8000-000000000000' }, metadata);

  const malformed = await call(client, 'GetWorkItem', { id: 'WI-404' }, metadata);

  const created = await api.post('/work-items', {
    title: 'Карта статусов',
    description: 'Запись для проверки отказов',
    priority: 'LOW'
  });

  const first = created.body.version;

  await call(client, 'TransitionWorkItem',
    { id: created.body.id, targetStatus: 'IN_PROGRESS', expectedVersion: first }, metadata);

  const stale = await call(client, 'TransitionWorkItem',
    { id: created.body.id, targetStatus: 'DONE', expectedVersion: first }, metadata);

  const seedSearch = await call(client, 'SearchWorkItems', { limit: 1 }, metadata);
  const seedItem = seedSearch.response.items[0];

  const forbidden = await call(client, 'TransitionWorkItem',
    { id: seedItem.id, targetStatus: 'DONE', expectedVersion: seedItem.version }, metadata);

  return {
    notFound: describe(missing, grpc),
    invalidId: describe(malformed, grpc),
    staleVersion: describe(stale, grpc),
    forbidden: describe(forbidden, grpc)
  };
}`
  }
]
