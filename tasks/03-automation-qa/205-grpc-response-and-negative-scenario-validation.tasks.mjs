export default [
  {
    id: 'qa-205-three-levels',
    title: 'Три уровня проверки RPC',
    difficulty: 'hard',
    lang: 'grpc',
    prompt:
      'Проверьте вызов на всех трёх уровнях. Создайте запись через ' +
      '`api.post(\'/work-items\', ...)` с заголовком `Три уровня`, переведите её ' +
      'в `IN_PROGRESS` вызовом `TransitionWorkItem`, а затем повторите тот же ' +
      'переход с уже устаревшей версией. Верните ' +
      '`{ transition, afterSuccess, refusal, afterRefusal }`: ответ успешного ' +
      'перехода, состояние записи после него (через `GetWorkItem`), ' +
      '`{ code }` отказа и состояние записи после отказа.',
    starter: `export default async function solve({ client, metadata, api }) {
  // Уровень 1 — как завершился вызов, уровень 2 — что в сообщении,
  // уровень 3 — изменилось ли состояние на сервере.

  return { transition: null, afterSuccess: null, refusal: null, afterRefusal: null };
}`,
    hints: [
      'Ответ TransitionWorkItem оборачивает запись в поле item.',
      'После отказа состояние должно остаться прежним — это и надо показать.',
      'Состояние читается отдельным вызовом, а не берётся из ответа перехода.'
    ],
    tests: [
      {
        name: 'уровень 1: переход завершился успешно',
        code: `expect(result.transition.item.status).toBe('IN_PROGRESS');`
      },
      {
        name: 'уровень 2: версия выросла ровно на единицу',
        code: `expect(result.afterSuccess.version).toBe(result.transition.item.version);
expect(result.afterSuccess.status).toBe('IN_PROGRESS');`
      },
      {
        name: 'повтор от старой версии отклонён',
        code: `expect(result.refusal.code).toBe(grpc.status.FAILED_PRECONDITION);`
      },
      {
        name: 'уровень 3: отказ не изменил состояние',
        code: `expect(result.afterRefusal.status).toBe(result.afterSuccess.status);
expect(result.afterRefusal.version).toBe(result.afterSuccess.version);`
      },
      {
        name: 'то же состояние видно через REST',
        code: `const response = await api.get('/work-items/' + result.afterRefusal.id);
expect(response.body.status).toBe('IN_PROGRESS');
expect(response.body.version).toBe(result.afterRefusal.version);`
      },
      {
        name: 'заголовок задан условием',
        code: `expect(result.afterSuccess.title).toBe('Три уровня');`
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
    title: 'Три уровня',
    description: 'Проверка ответа и состояния',
    priority: 'MEDIUM'
  });

  const id = created.body.id;
  const initialVersion = created.body.version;

  const moved = await call(client, 'TransitionWorkItem',
    { id, targetStatus: 'IN_PROGRESS', expectedVersion: initialVersion }, metadata);

  const afterSuccess = await call(client, 'GetWorkItem', { id }, metadata);

  const refused = await call(client, 'TransitionWorkItem',
    { id, targetStatus: 'DONE', expectedVersion: initialVersion }, metadata);

  const afterRefusal = await call(client, 'GetWorkItem', { id }, metadata);

  return {
    transition: moved.response,
    afterSuccess: afterSuccess.response,
    refusal: { code: refused.error.code },
    afterRefusal: afterRefusal.response
  };
}`
  }
]
