export default [
  {
    id: 'qa-209-count-by-status',
    title: 'Количество задач по статусам',
    difficulty: 'easy',
    lang: 'sql',
    prompt:
      'Напишите запрос, который возвращает количество seed-задач по каждому статусу. ' +
      'Колонки: `status` и `total`. Отсортируйте по статусу по возрастанию. ' +
      'Записи, созданные тестами, учитывать не нужно.',
    starter: `-- Верните status и total по seed-задачам.
SELECT 1;`,
    standSetup: `await api.post('/work-items', {
  title: 'Запись проверки, не относящаяся к seed',
  description: 'Создана подготовкой задачи',
  priority: 'LOW'
});`,
    hints: [
      'Учебные строки отличаются значением колонки is_seed.',
      'Количество по группам считается агрегатной функцией с группировкой.',
      'Порядок задаётся через ORDER BY, имя колонки — через AS.'
    ],
    tests: [
      {
        name: 'возвращает четыре строки — по одной на статус',
        code: `expect(rows).toHaveLength(4);`
      },
      {
        name: 'колонки называются status и total',
        code: `expect(Object.keys(rows[0]).sort()).toEqual(['status', 'total']);`
      },
      {
        name: 'статусы отсортированы по возрастанию',
        code: `expect(rows.map(row => row.status)).toEqual(['CANCELLED', 'DONE', 'IN_PROGRESS', 'NEW']);`
      },
      {
        name: 'сумма совпадает с числом seed-задач',
        code: `const total = rows.reduce((sum, row) => sum + Number(row.total), 0);
expect(total).toBe(248);`
      }
    ],
    solution: `SELECT status,
       count(*) AS total
  FROM work_items
 WHERE is_seed
 GROUP BY status
 ORDER BY status;`
  },

  {
    id: 'qa-209-null-order-and-limit',
    title: 'Порядок с NULL и ограничение выборки',
    difficulty: 'medium',
    lang: 'sql',
    prompt:
      'Напишите запрос, который возвращает три seed-задачи с колонками `title` и ' +
      '`description`, отсортированные так: сначала записи с заполненным описанием, ' +
      'затем с `NULL`; внутри групп — по `title` по возрастанию. Верните ровно три ' +
      'строки.',
    starter: `-- Три seed-задачи: сначала с описанием, затем без.
SELECT 1;`,
    hints: [
      'При сортировке по возрастанию NULL по умолчанию попадают в конец.',
      'Порядок NULL можно задать явно через NULLS FIRST или NULLS LAST.',
      'Количество строк ограничивается через LIMIT.'
    ],
    tests: [
      {
        name: 'возвращает ровно три строки',
        code: `expect(rows).toHaveLength(3);`
      },
      {
        name: 'колонки называются title и description',
        code: `expect(Object.keys(rows[0]).sort()).toEqual(['description', 'title']);`
      },
      {
        name: 'записи с описанием идут раньше пустых',
        code: `const filled = rows.filter(row => row.description !== null).length;
const firstNullIndex = rows.findIndex(row => row.description === null);
expect(firstNullIndex === -1 || firstNullIndex === filled).toBe(true);`
      },
      {
        name: 'заголовки внутри выборки отсортированы',
        code: `const titles = rows.filter(row => row.description !== null).map(row => row.title);
expect(titles).toEqual([...titles].sort());`
      }
    ],
    solution: `SELECT title,
       description
  FROM work_items
 WHERE is_seed
 ORDER BY description NULLS LAST, title
 LIMIT 3;`
  }
]
