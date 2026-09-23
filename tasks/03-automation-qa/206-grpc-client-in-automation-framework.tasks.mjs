export default [
  {
    id: 'qa-206-domain-client',
    title: 'Клиент предметной области поверх stub',
    difficulty: 'hard',
    lang: 'grpc',
    prompt:
      'Спрячьте транспорт за клиентом предметной области. Напишите класс ' +
      '`WorkItemsClient` с конструктором `(client, metadata)` и методами ' +
      '`get(id)`, `search(request)` и `transition(id, targetStatus, ' +
      'expectedVersion)`, возвращающими промисы с телом ответа. ' +
      'Промисы, метаданные и разбор колбэка должны остаться внутри класса: ' +
      'в теле `solve` не должно быть ни `new Promise`, ни обращений к ' +
      '`client.GetWorkItem` и подобным. Создайте запись через `api.post`, ' +
      'переведите её в `IN_PROGRESS` и верните ' +
      '`{ item, moved, found, failure }`, где `failure` — ' +
      '`{ code }` при чтении `00000000-0000-4000-8000-000000000000`.',
    starter: `class WorkItemsClient {
  constructor(client, metadata) {
    this.client = client;
    this.metadata = metadata;
  }

  get(id) {}

  search(request) {}

  transition(id, targetStatus, expectedVersion) {}
}

export default async function solve({ client, metadata, api }) {
  const workItems = new WorkItemsClient(client, metadata);

  // Здесь должны быть только шаги сценария.

  return { item: null, moved: null, found: 0, failure: null };
}`,
    hints: [
      'Превращение колбэка в промис стоит написать один раз внутри класса.',
      'Метаданные подставляет клиент, а не каждый вызов сценария.',
      'Отказ удобно возвращать наружу как ошибку и ловить в сценарии.'
    ],
    tests: [
      {
        name: 'запись прочитана через клиент',
        code: `expect(typeof result.item.id).toBe('string');
expect(result.item.title).toBe('Клиент фреймворка');`
      },
      {
        name: 'переход выполнен',
        code: `expect(result.moved.item.status).toBe('IN_PROGRESS');
expect(result.moved.item.version).toBe(result.item.version + 1);`
      },
      {
        name: 'поиск работает через тот же клиент',
        code: `expect(result.found > 0).toBe(true);`
      },
      {
        name: 'отказ доходит до сценария со статусом',
        code: `expect(result.failure.code).toBe(grpc.status.NOT_FOUND);`
      },
      {
        name: 'в сценарии нет транспортного кода',
        code: `const body = source.slice(source.indexOf('export default'));
expect(/new Promise|client\\.(Get|Search|Transition)/.test(body)).toBe(false);`
      },
      {
        name: 'транспорт спрятан в классе',
        code: `const declaration = source.slice(0, source.indexOf('export default'));
expect(/new Promise/.test(declaration)).toBe(true);`
      }
    ],
    solution: `class WorkItemsClient {
  constructor(client, metadata) {
    this.client = client;
    this.metadata = metadata;
  }

  #call(method, request) {
    return new Promise((resolve, reject) => {
      this.client[method](request, this.metadata, (error, response) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }

  get(id) {
    return this.#call('GetWorkItem', { id });
  }

  search(request) {
    return this.#call('SearchWorkItems', request);
  }

  transition(id, targetStatus, expectedVersion) {
    return this.#call('TransitionWorkItem', { id, targetStatus, expectedVersion });
  }
}

export default async function solve({ client, metadata, api }) {
  const workItems = new WorkItemsClient(client, metadata);

  const created = await api.post('/work-items', {
    title: 'Клиент фреймворка',
    description: 'Транспорт спрятан за клиентом',
    priority: 'LOW'
  });

  const item = await workItems.get(created.body.id);
  const moved = await workItems.transition(item.id, 'IN_PROGRESS', item.version);
  const search = await workItems.search({ limit: 1 });

  let failure = null;

  try {
    await workItems.get('00000000-0000-4000-8000-000000000000');
  } catch (error) {
    failure = { code: error.code };
  }

  return { item, moved, found: search.items.length, failure };
}`
  }
]
