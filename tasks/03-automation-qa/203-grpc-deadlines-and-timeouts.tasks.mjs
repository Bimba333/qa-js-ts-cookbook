export default [
  {
    id: 'qa-203-deadline-is-absolute',
    title: 'Граница времени задаётся клиентом',
    difficulty: 'hard',
    lang: 'grpc',
    prompt:
      'Выполните `SearchWorkItems` с `limit: 1` дважды: с заведомо недостижимым ' +
      'сроком (1 миллисекунда) и с разумным (5 секунд). Срок передаётся в ' +
      'параметрах вызова четвёртым аргументом: ' +
      '`client.Method(request, metadata, { deadline }, callback)`. ' +
      'Верните `{ expired, completed }`: для первого вызова — `{ code, name }`, ' +
      'где `name` берётся из `grpc.status`, для второго — число найденных записей.',
    starter: `export default async function solve({ client, metadata, grpc }) {
  // Срок — это момент времени, а не длительность.

  return { expired: null, completed: 0 };
}`,
    hints: [
      'Deadline задаётся объектом Date, к которому прибавлено нужное время.',
      'Истёкший срок приходит как обычный отказ, а не как исключение.',
      'Имя статуса можно получить из grpc.status по числовому коду.'
    ],
    tests: [
      {
        name: 'недостижимый срок даёт отказ',
        code: `expect(result.expired.code).toBe(grpc.status.DEADLINE_EXCEEDED);`
      },
      {
        name: 'имя статуса прочитано из справочника',
        code: `expect(result.expired.name).toBe('DEADLINE_EXCEEDED');`
      },
      {
        name: 'с разумным сроком вызов проходит',
        code: `expect(result.completed).toBe(1);`
      },
      {
        name: 'срок задан датой, а не числом миллисекунд',
        code: `expect(/deadline/.test(source)).toBe(true);
expect(/new Date|Date\\.now/.test(source)).toBe(true);`
      }
    ],
    solution: `function call(client, method, request, metadata, options) {
  return new Promise(resolve => {
    client[method](request, metadata, options, (error, response) => {
      if (error) resolve({ error });
      else resolve({ response });
    });
  });
}

const deadlineAfter = milliseconds => ({ deadline: new Date(Date.now() + milliseconds) });

export default async function solve({ client, metadata, grpc }) {
  const tooLate = await call(client, 'SearchWorkItems', { limit: 1 }, metadata, deadlineAfter(1));
  const inTime = await call(client, 'SearchWorkItems', { limit: 1 }, metadata, deadlineAfter(5000));

  return {
    expired: { code: tooLate.error.code, name: grpc.status[tooLate.error.code] },
    completed: inTime.response.items.length
  };
}`
  }
]
