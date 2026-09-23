export default [
  {
    id: 'qa-200-unary-call',
    title: 'Unary-вызов и его результат',
    difficulty: 'hard',
    lang: 'grpc',
    prompt:
      'Решение получает `{ client, metadata, grpc }`: готовый клиент службы ' +
      '`WorkItemService`, метаданные с токеном и модуль `@grpc/grpc-js`. ' +
      'Методы клиента работают через колбэк — превратите вызов в промис сами. ' +
      'Выполните `SearchWorkItems` с `limit: 1`, возьмите первую запись и ' +
      'прочитайте её же через `GetWorkItem`. Верните `{ total, listed, item }`: ' +
      'общее число записей из ответа поиска, первую запись из выборки и ответ ' +
      'чтения.',
    starter: `export default async function solve({ client, metadata }) {
  // Вызов метода: client.SearchWorkItems(request, metadata, callback)
  // Колбэк устроен как (error, response).

  return { total: 0, listed: null, item: null };
}`,
    hints: [
      'Промис создаётся вокруг вызова: resolve в колбэке без ошибки, reject — с ошибкой.',
      'Метаданные передаются вторым аргументом, до колбэка.',
      'Ответ GetWorkItem — сама запись, а не обёртка вокруг неё.'
    ],
    tests: [
      {
        name: 'поиск вернул общее число записей',
        code: `expect(typeof result.total).toBe('number');
expect(result.total > 0).toBe(true);`
      },
      {
        name: 'из выборки взята одна запись',
        code: `expect(typeof result.listed.id).toBe('string');
expect(result.listed.id.length > 0).toBe(true);`
      },
      {
        name: 'чтение вернуло ту же запись',
        code: `expect(result.item.id).toBe(result.listed.id);
expect(result.item.title).toBe(result.listed.title);`
      },
      {
        name: 'перечисления приходят строками',
        code: `expect(typeof result.item.status).toBe('string');
expect(['NEW', 'IN_PROGRESS', 'DONE', 'CANCELLED'].includes(result.item.status)).toBe(true);`
      },
      {
        name: 'та же запись видна через REST',
        code: `const response = await api.get('/work-items/' + result.item.id);
expect(response.status).toBe(200);
expect(response.body.title).toBe(result.item.title);`
      },
      {
        name: 'версия пришла числом',
        code: `expect(typeof result.item.version).toBe('number');`
      }
    ],
    solution: `function callUnary(invoke) {
  return new Promise((resolve, reject) => {
    invoke((error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

export default async function solve({ client, metadata }) {
  const found = await callUnary(callback =>
    client.SearchWorkItems({ limit: 1 }, metadata, callback)
  );

  const listed = found.items[0];

  const item = await callUnary(callback =>
    client.GetWorkItem({ id: listed.id }, metadata, callback)
  );

  return { total: found.total, listed, item };
}`
  }
]
