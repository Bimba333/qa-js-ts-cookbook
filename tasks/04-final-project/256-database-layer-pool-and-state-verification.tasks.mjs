export default [
  {
    id: 'fp-256-release-always',
    title: 'Подключение возвращается в пул всегда',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Забытый `release()` не роняет прогон — он его подвешивает, потому что ' +
      'срок ожидания подключения по умолчанию не задан. Напишите ' +
      '`withClient(pool, body)`: возьмите клиента через `pool.connect()`, ' +
      'передайте его в `body`, верните результат и **всегда** освободите ' +
      'клиента через `client.release()`. Ошибку из `body` пропустите наружу. ' +
      'Повторное освобождение недопустимо: `release()` вызывается ровно один раз.',
    starter: `async function withClient(pool, body) {
  const client = await pool.connect();

  const value = await body(client);

  client.release();

  return value;
}`,
    hints: [
      'Освобождение принадлежит блоку finally.',
      'Проверьте, что release вызывается ровно один раз и при ошибке тоже.',
      'Результат возвращается после освобождения.'
    ],
    tests: [
      {
        name: 'клиент освобождён после успешной работы',
        code: `let okReleases = 0;
const okPool = {
  connect: async () => ({ id: 'c1', release() { okReleases += 1; } })
};
expect(await withClient(okPool, async client => client.id)).toBe('c1');
expect(okReleases).toBe(1);`
      },
      {
        name: 'клиент освобождён и после ошибки',
        code: `let failReleases = 0;
const failPool = {
  connect: async () => ({ release() { failReleases += 1; } })
};
let dbFailure = null;
try {
  await withClient(failPool, async () => { throw new Error('23505'); });
} catch (error) {
  dbFailure = error;
}
expect(dbFailure.message).toBe('23505');
expect(failReleases).toBe(1);`
      },
      {
        name: 'release не вызывается дважды',
        code: `let doubleReleases = 0;
const countingPool = {
  connect: async () => ({ release() { doubleReleases += 1; } })
};
await withClient(countingPool, async () => 'готово');
expect(doubleReleases).toBe(1);`
      },
      {
        name: 'клиент берётся из пула ровно один раз',
        code: `let connects = 0;
const singlePool = {
  connect: async () => { connects += 1; return { release() {} }; }
};
await withClient(singlePool, async () => null);
expect(connects).toBe(1);`
      }
    ],
    solution: `async function withClient(pool, body) {
  const client = await pool.connect();

  try {
    return await body(client);
  } finally {
    // Освобождение обязано произойти на любом пути выхода.
    client.release();
  }
}`
  },
  {
    id: 'fp-256-row-to-model',
    title: 'Строка таблицы приводится к модели',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Драйвер отдаёт типы PostgreSQL как есть: `bigint` приходит **строкой**, ' +
      '`timestamptz` — объектом `Date`, `NULL` — как `null`. Напишите ' +
      '`rowToWorkItem(row)`, который возвращает ' +
      '`{ id, title, total, createdAt, closedAt }`: `total` — число из строки, ' +
      '`createdAt` — строка ISO из `Date`, `closedAt` — строка ISO или `null`. ' +
      'Если `total` не приводится к целому числу, бросьте `Error` со словом ' +
      '`total` в сообщении.',
    starter: `function rowToWorkItem(row) {
  // Приведение типов — обязанность слоя доступа, а не теста.

  return {
    id: row.id,
    title: row.title,
    total: row.total,
    createdAt: row.created_at,
    closedAt: row.closed_at
  };
}`,
    hints: [
      'Number("12") даёт число, а Number("") — ноль: проверяйте результат.',
      'У объекта Date есть toISOString().',
      'Отсутствующая дата остаётся null, а не превращается в строку.'
    ],
    tests: [
      {
        name: 'bigint строкой превращается в число',
        code: `const bigintRow = rowToWorkItem({
  id: 'T-1',
  title: 'Отчёт',
  total: '12',
  created_at: new Date('2026-09-28T10:00:00.000Z'),
  closed_at: null
});
expect(bigintRow.total).toBe(12);`
      },
      {
        name: 'дата приводится к строке ISO',
        code: `const dateRow = rowToWorkItem({
  id: 'T-2',
  title: 'Отчёт',
  total: '0',
  created_at: new Date('2026-09-28T10:00:00.000Z'),
  closed_at: new Date('2026-09-29T11:30:00.000Z')
});
expect(dateRow.createdAt).toBe('2026-09-28T10:00:00.000Z');
expect(dateRow.closedAt).toBe('2026-09-29T11:30:00.000Z');`
      },
      {
        name: 'отсутствующая дата остаётся null',
        code: `const openRow = rowToWorkItem({
  id: 'T-3',
  title: 'Отчёт',
  total: '5',
  created_at: new Date('2026-09-28T10:00:00.000Z'),
  closed_at: null
});
expect(openRow.closedAt).toBeNull();`
      },
      {
        name: 'пустое значение total не становится нулём молча',
        code: `expect(() => rowToWorkItem({
  id: 'T-4',
  title: 'Отчёт',
  total: '',
  created_at: new Date('2026-09-28T10:00:00.000Z'),
  closed_at: null
})).toThrow('total');`
      }
    ],
    solution: `function rowToWorkItem(row) {
  const total = Number(row.total);

  if (row.total === '' || row.total === null || !Number.isInteger(total)) {
    throw new Error('поле total не приводится к целому числу: ' + row.total);
  }

  return {
    id: row.id,
    title: row.title,
    total,
    createdAt: row.created_at.toISOString(),
    closedAt: row.closed_at === null ? null : row.closed_at.toISOString()
  };
}`
  }
];
