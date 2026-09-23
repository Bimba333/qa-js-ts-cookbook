export default [
  {
    id: 'qa-202-metadata-carries-token',
    title: 'Метаданные переносят доказательство доступа',
    difficulty: 'hard',
    lang: 'grpc',
    prompt:
      'Решение получает `{ client, metadata, grpc, token }`. Выполните ' +
      '`SearchWorkItems` с `limit: 1` дважды: один раз с **пустыми** метаданными ' +
      '`new grpc.Metadata()`, другой раз с метаданными, которые вы соберёте сами ' +
      'из `token` (заголовок `authorization` со значением `Bearer <token>`). ' +
      'Готовый объект `metadata` для второго вызова использовать нельзя — ' +
      'соберите свой. Верните `{ anonymous, authorized }`: для отказа — объект ' +
      '`{ code, details }`, для успеха — число найденных записей.',
    starter: `export default async function solve({ client, grpc, token }) {
  // Метаданные — отдельный аргумент вызова, а не часть сообщения.

  return { anonymous: null, authorized: 0 };
}`,
    hints: [
      'Отказ приходит в колбэк первым аргументом, а не выбрасывается.',
      'Числовой код отказа лежит в поле code объекта ошибки.',
      'Значение заголовка авторизации начинается со слова Bearer и пробела.'
    ],
    tests: [
      {
        name: 'без метаданных вызов отклонён',
        code: `expect(result.anonymous.code).toBe(grpc.status.UNAUTHENTICATED);`
      },
      {
        name: 'отказ объясняет причину',
        code: `expect(typeof result.anonymous.details).toBe('string');
expect(result.anonymous.details.length > 0).toBe(true);`
      },
      {
        name: 'со своими метаданными вызов проходит',
        code: `expect(result.authorized).toBe(1);`
      },
      {
        name: 'код отказа сверяется с константой, а не с числом',
        code: `expect(grpc.status[result.anonymous.code]).toBe('UNAUTHENTICATED');`
      },
      {
        name: 'метаданные собраны в решении',
        code: `expect(/new grpc\\.Metadata\\(\\)/.test(source)).toBe(true);
expect(/metadata\\.set|\\.set\\(\\s*'authorization'/i.test(source)).toBe(true);`
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

export default async function solve({ client, grpc, token }) {
  const empty = new grpc.Metadata();
  const refused = await call(client, 'SearchWorkItems', { limit: 1 }, empty);

  const authorized = new grpc.Metadata();
  authorized.set('authorization', 'Bearer ' + token);

  const allowed = await call(client, 'SearchWorkItems', { limit: 1 }, authorized);

  return {
    anonymous: { code: refused.error.code, details: refused.error.details },
    authorized: allowed.response.items.length
  };
}`
  }
]
