export default [
  {
    id: 'qa-186-methods-and-meaning',
    title: 'Метод определяет смысл запроса',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Покажите разницу между методами на одной записи. Создайте задачу с ' +
      'заголовком `Смысл метода`, затем выполните: чтение той же записи дважды, ' +
      'удаление и повторное чтение. Верните ' +
      '`{ created, readFirst, readSecond, deleted, readAfterDelete }` — пять ответов ' +
      'стенда. Обрабатывать отказ как исключение не нужно: клиент возвращает ' +
      'ответ с кодом состояния.',
    starter: `export default async function solve(api) {
  // Чтение не меняет состояние, удаление меняет.

  return {
    created: null,
    readFirst: null,
    readSecond: null,
    deleted: null,
    readAfterDelete: null
  };
}`,
    hints: [
      'Повторное чтение должно давать тот же результат.',
      'Удаление возвращает ответ без тела.',
      'После удаления запись читаться не должна.'
    ],
    tests: [
      {
        name: 'создание вернуло 201',
        code: `expect(result.created.status).toBe(201);`
      },
      {
        name: 'два чтения подряд дали одно и то же',
        code: `expect(result.readFirst.status).toBe(200);
expect(result.readSecond.status).toBe(200);
expect(result.readSecond.body.version).toBe(result.readFirst.body.version);`
      },
      {
        name: 'чтение не изменило запись',
        code: `expect(result.readFirst.body.version).toBe(result.created.body.version);`
      },
      {
        name: 'удаление прошло',
        code: `expect(result.deleted.status === 204 || result.deleted.status === 200).toBe(true);`
      },
      {
        name: 'после удаления запись не читается',
        code: `expect(result.readAfterDelete.status).toBe(404);`
      },
      {
        name: 'запись действительно исчезла со стенда',
        code: `const again = await api.get('/work-items/' + result.created.body.id);
expect(again.status).toBe(404);`
      }
    ],
    solution: `export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Смысл метода',
    description: 'Чтение, удаление, повторное чтение',
    priority: 'LOW'
  });

  const path = '/work-items/' + created.body.id;

  const readFirst = await api.get(path);
  const readSecond = await api.get(path);
  const deleted = await api.delete(path);
  const readAfterDelete = await api.get(path);

  return { created, readFirst, readSecond, deleted, readAfterDelete };
}`
  }
]
