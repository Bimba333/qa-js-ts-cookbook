export default [
  {
    id: 'qa-188-read-response-levels',
    title: 'Три уровня ответа при создании',
    difficulty: 'easy',
    lang: 'api',
    prompt:
      'Создайте задачу через `POST /work-items` и верните объект ' +
      '`{ created, fetched }`: первый — ответ на создание, второй — ответ на чтение ' +
      'созданной записи по её идентификатору. Проверки посмотрят код состояния, ' +
      'заголовки и тело.',
    starter: `/**
 * api.post(path, body), api.get(path), api.patch(path, body), api.delete(path)
 * Каждый вызов возвращает { status, headers, body }.
 */
export default async function solve(api) {
  // 1. Создайте задачу: POST /work-items
  // 2. Прочитайте её по идентификатору из ответа

  return { created: null, fetched: null };
}`,
    hints: [
      'Создание возвращает полную запись — идентификатор берётся из её тела.',
      'Ключи заголовков в ответе приведены к нижнему регистру.',
      'Чтение выполняется по пути с идентификатором.'
    ],
    tests: [
      {
        name: 'создание возвращает 201',
        code: `expect(result.created.status).toBe(201);`
      },
      {
        name: 'ответ на создание содержит JSON',
        code: `expect(String(result.created.headers['content-type'])).toContain('application/json');`
      },
      {
        name: 'созданная запись начинается в статусе NEW и первой версии',
        code: `expect(result.created.body.status).toBe('NEW');
expect(result.created.body.version).toBe(1);`
      },
      {
        name: 'чтение возвращает ту же запись',
        code: `expect(result.fetched.status).toBe(200);
expect(result.fetched.body.id).toBe(result.created.body.id);`
      },
      {
        name: 'запись действительно сохранена на стенде',
        code: `const current = await api.get('/work-items/' + result.created.body.id);
expect(current.status).toBe(200);`
      }
    ],
    solution: `export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Проверка структуры ответа',
    description: 'Создана задачей главы 188',
    priority: 'MEDIUM'
  });

  const fetched = await api.get('/work-items/' + created.body.id);

  return { created, fetched };
}`
  },

  {
    id: 'qa-188-missing-resource',
    title: 'Ответ на неизвестный идентификатор',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Запросите задачу по заведомо несуществующему идентификатору ' +
      '`00000000-0000-4000-8000-000000000000` и верните объект ' +
      '`{ missing }` с ответом стенда. Ответ должен приходить обычным образом, ' +
      'без выбрасывания исключения.',
    starter: `export default async function solve(api) {
  // Неуспешный код состояния — это тоже полученный ответ.

  return { missing: null };
}`,
    hints: [
      'Код 4xx приходит обычным ответом, а не исключением.',
      'Идентификатор нужно подставить в путь запроса.',
      'В теле отказа стенд сообщает машиночитаемый код.'
    ],
    tests: [
      {
        name: 'возвращается 404',
        code: `expect(result.missing.status).toBe(404);`
      },
      {
        name: 'тело содержит машиночитаемый код',
        code: `expect(typeof result.missing.body.code).toBe('string');`
      },
      {
        name: 'ответ пришёл, а не исключение',
        code: `expect(result.missing).toBeTruthy();`
      },
      {
        name: 'тип содержимого — JSON',
        code: `expect(String(result.missing.headers['content-type'])).toContain('application/json');`
      }
    ],
    solution: `export default async function solve(api) {
  const missing = await api.get('/work-items/00000000-0000-4000-8000-000000000000');

  return { missing };
}`
  }
]
