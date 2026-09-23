export default [
  {
    id: 'qa-190-client-returns-model',
    title: 'Клиент отдаёт данные, а не транспорт',
    difficulty: 'hard',
    lang: 'api',
    prompt:
      'Постройте маленький клиент поверх транспорта. Напишите ' +
      '`createWorkItemClient(api)` с методами `create(data)` и `getById(id)`. ' +
      'Методы возвращают **тело** записи, а не ответ целиком. Неожиданный код ' +
      'состояния — ошибка с сообщением `<METHOD> <path> вернул <status>`. ' +
      'Ожидаемые коды: `201` для создания и `200` для чтения. ' +
      'Верните `{ created, read, missing, malformed }`: созданную запись ' +
      '(заголовок `Граница клиента`, приоритет `LOW`), её же через чтение, ' +
      'сообщение ошибки при чтении несуществующей записи ' +
      '`00000000-0000-4000-8000-000000000000` и сообщение при чтении записи с ' +
      'неверным форматом идентификатора `WI-404`. Коды в этих двух случаях разные — ' +
      'это и надо увидеть.',
    starter: `function createWorkItemClient(api) {
  return {
    async create(data) { return null; },
    async getById(id) { return null; }
  };
}

export default async function solve(api) {
  const client = createWorkItemClient(api);

  return { created: null, read: null, missing: '', malformed: '' };
}`,
    hints: [
      'Проверка кода состояния — работа клиента, проверка данных — работа теста.',
      'Наружу отдаётся тело ответа, чтобы тест не знал про транспорт.',
      'Сообщение об ошибке должно называть метод, путь и полученный код.',
      'Неверный формат идентификатора и отсутствующая запись — разные отказы.'
    ],
    tests: [
      {
        name: 'создание вернуло запись, а не ответ',
        code: `expect(typeof result.created.id).toBe('string');
expect(result.created.status).toBe('NEW');
expect(result.created.title).toBe('Граница клиента');`
      },
      {
        name: 'чтение вернуло ту же запись',
        code: `expect(result.read.id).toBe(result.created.id);
expect(result.read.version).toBe(result.created.version);`
      },
      {
        name: 'клиент не отдаёт транспортные поля',
        code: `expect(result.created.body).toBeUndefined();
expect(result.created.headers).toBeUndefined();`
      },
      {
        name: 'отсутствующая запись даёт 404',
        code: `expect(result.missing)
  .toBe('GET /work-items/00000000-0000-4000-8000-000000000000 вернул 404');`
      },
      {
        name: 'неверный формат идентификатора даёт 400',
        code: `expect(result.malformed).toBe('GET /work-items/WI-404 вернул 400');`
      },
      {
        name: 'запись действительно создана на стенде',
        code: `const response = await api.get('/work-items/' + result.created.id);
expect(response.status).toBe(200);
expect(response.body.priority).toBe('LOW');`
      }
    ],
    solution: `function createWorkItemClient(api) {
  const expectStatus = (response, method, path, expected) => {
    if (response.status !== expected) {
      throw new Error(method + ' ' + path + ' вернул ' + response.status);
    }

    return response.body;
  };

  return {
    async create(data) {
      const response = await api.post('/work-items', data);

      return expectStatus(response, 'POST', '/work-items', 201);
    },

    async getById(id) {
      const path = '/work-items/' + id;
      const response = await api.get(path);

      return expectStatus(response, 'GET', path, 200);
    }
  };
}

export default async function solve(api) {
  const client = createWorkItemClient(api);

  const created = await client.create({
    title: 'Граница клиента',
    description: 'Клиент отдаёт модель',
    priority: 'LOW'
  });

  const read = await client.getById(created.id);

  const messageOf = async id => {
    try {
      await client.getById(id);
      return '';
    } catch (error) {
      return error.message;
    }
  };

  const missing = await messageOf('00000000-0000-4000-8000-000000000000');
  const malformed = await messageOf('WI-404');

  return { created, read, missing, malformed };
}`
  }
]
