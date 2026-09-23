export default [
  {
    id: 'qa-247-one-owner-one-id',
    title: 'Один идентификатор, один владелец',
    difficulty: 'hard',
    lang: 'api',
    prompt:
      'Проведите запись через весь жизненный цикл, используя каждый слой по ' +
      'назначению. Создайте запись через API (заголовок `Жизненный цикл`), ' +
      'прочитайте её через API, затем удалите её тоже через API. Верните ' +
      '`{ id, created, read, deleted, readAfterDelete }`: идентификатор, код ' +
      'состояния создания, тело чтения, код состояния удаления и код состояния ' +
      'чтения после удаления. Проверки сами заглянут в базу и убедятся, что ' +
      'строки там больше нет.',
    starter: `export default async function solve(api) {
  // Создание выдаёт обязательство: тот, кто создал, тот и удаляет.

  return { id: '', created: 0, read: null, deleted: 0, readAfterDelete: 0 };
}`,
    hints: [
      'Удаление выполняется по тому же идентификатору, что вернуло создание.',
      'После удаления чтение должно отвечать отказом, а не пустым телом.',
      'Проверять состояние базы напрямую из решения не нужно.'
    ],
    tests: [
      {
        name: 'запись создана',
        code: `expect(result.created).toBe(201);
expect(result.read.title).toBe('Жизненный цикл');`
      },
      {
        name: 'удаление прошло',
        code: `expect(result.deleted === 204 || result.deleted === 200).toBe(true);`
      },
      {
        name: 'после удаления запись не читается',
        code: `expect(result.readAfterDelete).toBe(404);`
      },
      {
        name: 'строки нет и в базе',
        code: `const dbRows = await query(
  "select count(*)::int as total from work_items where id = '" + result.id + "'"
);
expect(dbRows[0].total).toBe(0);`
      },
      {
        name: 'запись действительно принадлежала этому прогону',
        code: `expect(result.read.creatorTestId.length > 0).toBe(true);
expect(result.read.testRunId.length > 0).toBe(true);`
      },
      {
        name: 'повторное удаление тоже отвечает отказом',
        code: `const repeated = await api.delete('/work-items/' + result.id);
expect(repeated.status).toBe(404);`
      }
    ],
    solution: `export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Жизненный цикл',
    description: 'Создание, чтение, удаление',
    priority: 'LOW'
  });

  const id = created.body.id;
  const path = '/work-items/' + id;

  const read = await api.get(path);
  const deleted = await api.delete(path);
  const readAfterDelete = await api.get(path);

  return {
    id,
    created: created.status,
    read: read.body,
    deleted: deleted.status,
    readAfterDelete: readAfterDelete.status
  };
}`
  }
]
