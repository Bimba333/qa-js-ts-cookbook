export default [
  {
    id: 'qa-199-client-follows-contract',
    title: 'Клиент повторяет контракт',
    difficulty: 'medium',
    lang: 'grpc',
    prompt:
      'Сгенерированный клиент — это отражение `.proto`, а не самостоятельный код. ' +
      'Верните `{ methods, aliases, works, missing }`: имена методов службы, ' +
      'доступных на клиенте (те, что начинаются с заглавной буквы), их варианты ' +
      'с маленькой буквы, результат вызова `searchWorkItems` **через вариант с ' +
      'маленькой буквы** (число найденных записей при `limit: 1`) и признак того, ' +
      'что метода `CreateWorkItem` у клиента нет.',
    starter: `export default async function solve({ client, metadata }) {
  // Методы объявлены в прототипе клиента, а не в самом объекте.

  return { methods: [], aliases: [], works: 0, missing: false };
}`,
    hints: [
      'Свойства прототипа даёт Object.getPrototypeOf вместе с Object.keys.',
      'Загрузчик добавляет к каждому методу вариант имени с маленькой буквы.',
      'Отсутствие метода проверяется обычным сравнением с undefined.'
    ],
    tests: [
      {
        name: 'клиент знает три вызова контракта',
        code: `expect(result.methods.sort())
  .toEqual(['GetWorkItem', 'SearchWorkItems', 'TransitionWorkItem']);`
      },
      {
        name: 'у каждого метода есть вариант с маленькой буквы',
        code: `expect(result.aliases.sort())
  .toEqual(['getWorkItem', 'searchWorkItems', 'transitionWorkItem']);`
      },
      {
        name: 'вызов через вариант имени работает',
        code: `expect(result.works).toBe(1);`
      },
      {
        name: 'методов вне контракта у клиента нет',
        code: `expect(result.missing).toBe(true);`
      },
      {
        name: 'клиент действительно подключён к стенду',
        code: `expect(typeof client.close).toBe('function');`
      }
    ],
    solution: `function call(client, method, request, metadata) {
  return new Promise((resolve, reject) => {
    client[method](request, metadata, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

export default async function solve({ client, metadata }) {
  const names = Object.keys(Object.getPrototypeOf(client));

  const methods = names.filter(name => /^[A-Z]/.test(name));
  const aliases = names.filter(name => /^[a-z]/.test(name) && name !== 'close');

  const found = await call(client, 'searchWorkItems', { limit: 1 }, metadata);

  return {
    methods,
    aliases,
    works: found.items.length,
    missing: client.CreateWorkItem === undefined
  };
}`
  }
]
