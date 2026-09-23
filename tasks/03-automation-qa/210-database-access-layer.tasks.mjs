export default [
  {
    id: 'qa-210-row-to-model',
    title: 'Перевод строки таблицы в модель',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Слой доступа переводит язык схемы в язык сценария. Напишите ' +
      '`toWorkItem(row)`, превращающую строку `{ id, title, description, ' +
      'priority, status, version, created_at }` в модель ' +
      '`{ id, title, description, priority, status, version, createdAt }`. ' +
      'Требования: `version` приходит из драйвера строкой и должен стать числом; ' +
      '`created_at` — объект `Date`, в модели это строка ISO; `description` ' +
      'может быть `null` и остаётся `null`; лишние колонки в модель не попадают. ' +
      'Отсутствие `id` — ошибка `строка не содержит идентификатор`.',
    starter: `function toWorkItem(row) {
  // В модель попадает только то, что нужно сценарию.

  return {};
}`,
    hints: [
      'Имена колонок и имена полей модели не обязаны совпадать.',
      'Драйвер PostgreSQL отдаёт bigint строкой — это не ошибка данных.',
      'Лишние колонки не должны просачиваться через распространение объекта.'
    ],
    tests: [
      {
        name: 'строка превращается в модель',
        code: `expect(toWorkItem({
  id: 'WI-1',
  title: 'Вход',
  description: 'описание',
  priority: 'HIGH',
  status: 'NEW',
  version: '3',
  created_at: new Date('2026-01-01T00:00:00.000Z')
})).toEqual({
  id: 'WI-1',
  title: 'Вход',
  description: 'описание',
  priority: 'HIGH',
  status: 'NEW',
  version: 3,
  createdAt: '2026-01-01T00:00:00.000Z'
});`
      },
      {
        name: 'версия становится числом',
        code: `const model = toWorkItem({
  id: 'WI-1', title: 'a', description: null, priority: 'LOW', status: 'NEW',
  version: '10', created_at: new Date(0)
});
expect(typeof model.version).toBe('number');
expect(model.version).toBe(10);`
      },
      {
        name: 'пустое описание остаётся null',
        code: `const nullable = toWorkItem({
  id: 'WI-1', title: 'a', description: null, priority: 'LOW', status: 'NEW',
  version: '1', created_at: new Date(0)
});
expect(nullable.description).toBe(null);`
      },
      {
        name: 'лишние колонки не попадают в модель',
        code: `const extra = toWorkItem({
  id: 'WI-1', title: 'a', description: null, priority: 'LOW', status: 'NEW',
  version: '1', created_at: new Date(0),
  is_seed: true, owner_id: 'u-1'
});
expect(Object.keys(extra).sort()).toEqual(
  ['createdAt', 'description', 'id', 'priority', 'status', 'title', 'version']
);`
      },
      {
        name: 'время приводится к строке ISO',
        code: `const dated = toWorkItem({
  id: 'WI-1', title: 'a', description: null, priority: 'LOW', status: 'NEW',
  version: '1', created_at: new Date('2026-06-01T12:30:00.000Z')
});
expect(dated.createdAt).toBe('2026-06-01T12:30:00.000Z');`
      },
      {
        name: 'строка без идентификатора отвергается',
        code: `let message = '';
try { toWorkItem({ title: 'a' }); } catch (error) { message = error.message; }
expect(message).toBe('строка не содержит идентификатор');`
      }
    ],
    solution: `function toWorkItem(row) {
  if (typeof row.id !== 'string' || row.id === '') {
    throw new Error('строка не содержит идентификатор');
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description === null ? null : row.description,
    priority: row.priority,
    status: row.status,
    version: Number(row.version),
    createdAt: new Date(row.created_at).toISOString()
  };
}`
  }
]
