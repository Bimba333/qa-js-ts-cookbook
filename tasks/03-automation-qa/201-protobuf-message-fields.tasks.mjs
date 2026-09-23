export default [
  {
    id: 'qa-201-default-hides-absence',
    title: 'Значение по умолчанию скрывает отсутствие',
    difficulty: 'hard',
    lang: 'grpc',
    prompt:
      'В proto3 нулевое значение поля и его отсутствие выглядят одинаково. ' +
      'Покажите это. Выполните `SearchWorkItems` три раза с `limit: 3`: ' +
      'без поля `status`, с `status: "WORK_ITEM_STATUS_UNSPECIFIED"` и с ' +
      '`status: "DONE"`. Верните `{ omitted, unspecified, filtered }`: для первых ' +
      'двух — массив статусов найденных записей, для третьего — тоже массив ' +
      'статусов. Дополнительно верните `sample` — первую запись первой выборки.',
    starter: `export default async function solve({ client, metadata }) {
  // Нулевое значение перечисления означает «не задано».

  return { omitted: [], unspecified: [], filtered: [], sample: null };
}`,
    hints: [
      'Незаданное поле сообщения приходит со значением по умолчанию.',
      'Для перечисления значение по умолчанию — вариант с номером ноль.',
      'Сравнивать нужно наборы статусов, а не длины ответов.'
    ],
    tests: [
      {
        name: 'без поля и с нулевым значением результат одинаков',
        code: `expect(result.unspecified).toEqual(result.omitted);`
      },
      {
        name: 'без фильтра статусы разные или произвольные',
        code: `expect(result.omitted.length).toBe(3);`
      },
      {
        name: 'с конкретным статусом фильтр работает',
        code: `expect(result.filtered.length > 0).toBe(true);
expect(result.filtered.every(status => status === 'DONE')).toBe(true);`
      },
      {
        name: 'все поля записи присутствуют, даже незаполненные',
        code: `const fields = ['id', 'title', 'description', 'status', 'priority',
  'ownerId', 'createdBy', 'testRunId', 'creatorTestId', 'createdAt', 'updatedAt', 'version'];
expect(fields.every(field => field in result.sample)).toBe(true);`
      },
      {
        name: 'строковые поля приходят строками, а не undefined',
        code: `expect(typeof result.sample.creatorTestId).toBe('string');
expect(typeof result.sample.testRunId).toBe('string');`
      },
      {
        name: 'числовое поле приходит числом',
        code: `expect(typeof result.sample.version).toBe('number');`
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

const statusesOf = response => response.items.map(item => item.status);

export default async function solve({ client, metadata }) {
  const omitted = await call(client, 'SearchWorkItems', { limit: 3 }, metadata);

  const unspecified = await call(client, 'SearchWorkItems',
    { limit: 3, status: 'WORK_ITEM_STATUS_UNSPECIFIED' }, metadata);

  const filtered = await call(client, 'SearchWorkItems',
    { limit: 3, status: 'DONE' }, metadata);

  return {
    omitted: statusesOf(omitted),
    unspecified: statusesOf(unspecified),
    filtered: statusesOf(filtered),
    sample: omitted.items[0]
  };
}`
  }
]
