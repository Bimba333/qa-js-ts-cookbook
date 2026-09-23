export default [
  {
    id: 'qa-214-api-matches-database',
    title: 'Сверка ответа API с базой',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Создайте задачу с заголовком `Сверка слоёв`, описанием `Данные для сравнения` ' +
      'и приоритетом `MEDIUM`, затем прочитайте её через `GET /work-items/<id>`. ' +
      'Верните `{ id, api }`: идентификатор и тело ответа чтения. ' +
      'Проверки сравнят его с записью в базе — поля должны совпасть без ' +
      'преобразований на стороне решения.',
    starter: `export default async function solve(api) {
  // Создайте запись и прочитайте её отдельным запросом.

  return { id: '', api: null };
}`,
    hints: [
      'Ответ на создание и ответ на чтение — разные запросы.',
      'Возвращать надо тело ответа целиком, ничего не переименовывая.',
      'Идентификатор приходит в ответе на создание.'
    ],
    tests: [
      {
        name: 'запись создана и прочитана',
        code: `expect(typeof result.id).toBe('string');
expect(result.api.id).toBe(result.id);`
      },
      {
        name: 'заголовок совпадает с базой',
        code: `const titleRows = await query("select title from work_items where id = '" + result.id + "'");
expect(titleRows).toHaveLength(1);
expect(titleRows[0].title).toBe(result.api.title);`
      },
      {
        name: 'приоритет и статус совпадают с базой',
        code: `const stateRows = await query("select priority, status from work_items where id = '" + result.id + "'");
expect(stateRows[0].priority).toBe(result.api.priority);
expect(stateRows[0].status).toBe(result.api.status);`
      },
      {
        name: 'версия совпадает с базой и является числом',
        code: `const versionRows = await query("select version from work_items where id = '" + result.id + "'");
expect(Number(versionRows[0].version)).toBe(result.api.version);
expect(typeof result.api.version).toBe('number');`
      },
      {
        name: 'заголовок задан условием задачи',
        code: `expect(result.api.title).toBe('Сверка слоёв');`
      }
    ],
    solution: `export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Сверка слоёв',
    description: 'Данные для сравнения',
    priority: 'MEDIUM'
  });

  const id = created.body.id;
  const read = await api.get('/work-items/' + id);

  return { id, api: read.body };
}`
  }
]
