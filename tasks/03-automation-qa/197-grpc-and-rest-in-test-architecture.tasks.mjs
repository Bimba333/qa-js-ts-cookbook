export default [
  {
    id: 'qa-197-same-record-two-protocols',
    title: 'Одна запись, две границы',
    difficulty: 'hard',
    lang: 'grpc',
    prompt:
      'Сравните две границы стенда на одной записи. Создайте запись через REST ' +
      '(`api.post`) с заголовком `Два протокола`, прочитайте её через `api.get` и ' +
      'через `GetWorkItem`, а затем запросите обеими границами несуществующую ' +
      'запись `00000000-0000-4000-8000-000000000000`. Верните ' +
      '`{ rest, grpc, sameFields, restMissing, grpcMissing, methods }`: два тела ' +
      'ответа, признак совпадения наборов полей, отказ REST в виде ' +
      '`{ status, code }`, отказ gRPC в виде `{ code }` и список имён методов ' +
      'gRPC-службы, доступных на клиенте.',
    starter: `export default async function solve({ client, metadata, api }) {
  // Данные у границ одинаковые. Разными оказываются набор операций
  // и способ сообщить об отказе.

  return {
    rest: null,
    grpc: null,
    sameFields: false,
    restMissing: null,
    grpcMissing: null,
    methods: []
  };
}`,
    hints: [
      'Имена методов службы видны среди свойств клиента.',
      'REST сообщает об отказе кодом состояния, gRPC — статусом вызова.',
      'Наборы полей удобно сравнивать после сортировки.'
    ],
    tests: [
      {
        name: 'обе границы вернули одну запись',
        code: `expect(result.grpc.id).toBe(result.rest.id);
expect(result.grpc.title).toBe('Два протокола');`
      },
      {
        name: 'наборы полей совпадают: контракт согласован',
        code: `expect(result.sameFields).toBe(true);`
      },
      {
        name: 'значения полей совпадают',
        code: `expect(result.grpc.status).toBe(result.rest.status);
expect(result.grpc.version).toBe(result.rest.version);
expect(result.grpc.createdAt).toBe(result.rest.createdAt);`
      },
      {
        name: 'REST сообщает об отказе кодом состояния',
        code: `expect(result.restMissing.status).toBe(404);
expect(typeof result.restMissing.code).toBe('string');`
      },
      {
        name: 'gRPC сообщает об отказе статусом вызова',
        code: `expect(result.grpcMissing.code).toBe(grpc.status.NOT_FOUND);`
      },
      {
        name: 'создание в gRPC-контракте отсутствует',
        code: `expect(result.methods.includes('GetWorkItem')).toBe(true);
expect(result.methods.includes('SearchWorkItems')).toBe(true);
expect(result.methods.includes('TransitionWorkItem')).toBe(true);
expect(result.methods.some(name => /create/i.test(name))).toBe(false);`
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

export default async function solve({ client, metadata, api }) {
  const created = await api.post('/work-items', {
    title: 'Два протокола',
    description: 'Чтение через REST и gRPC',
    priority: 'LOW'
  });

  const id = created.body.id;

  const rest = (await api.get('/work-items/' + id)).body;
  const viaGrpc = await call(client, 'GetWorkItem', { id }, metadata);

  const missingId = '00000000-0000-4000-8000-000000000000';
  const restMissingResponse = await api.get('/work-items/' + missingId);
  const grpcMissing = await call(client, 'GetWorkItem', { id: missingId }, metadata);

  const restFields = Object.keys(rest).sort().join(',');
  const grpcFields = Object.keys(viaGrpc.response).sort().join(',');

  // Методы службы объявлены в прототипе клиента, а не в самом объекте.
  const methods = Object.keys(Object.getPrototypeOf(client))
    .filter(name => /^[A-Z]/.test(name));

  return {
    rest,
    grpc: viaGrpc.response,
    sameFields: restFields === grpcFields,
    restMissing: { status: restMissingResponse.status, code: restMissingResponse.body.code },
    grpcMissing: { code: grpcMissing.error.code },
    methods
  };
}`
  }
]
