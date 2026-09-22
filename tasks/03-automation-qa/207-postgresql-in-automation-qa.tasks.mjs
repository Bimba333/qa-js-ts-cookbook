export default [
  {
    id: 'qa-207-seed-priorities',
    title: 'Распределение задач по приоритетам',
    difficulty: 'easy',
    lang: 'sql',
    prompt:
      'Напишите запрос, который возвращает количество seed-задач по каждому приоритету. ' +
      'Колонки: `priority` и `total`. Отсортируйте результат по приоритету по возрастанию. ' +
      'Учитывайте только учебные данные, созданные seed.',
    starter: `-- Верните priority и total по seed-задачам.
-- Подсказка: служебный признак seed-строк — колонка is_seed.
SELECT 1;`,
    // В базе появляются записи, созданные тестом: без фильтра по is_seed
    // подсчёт собьётся, и проверка это увидит.
    standSetup: `await api.post('/work-items', {
  title: 'Запись проверки, не относящаяся к seed',
  description: 'Создана подготовкой задачи',
  priority: 'LOW'
});`,
    hints: [
      'Записи, созданные тестами, отличаются от учебных значением колонки is_seed.',
      'Количество по группам считается агрегатной функцией с группировкой по приоритету.',
      'Колонку результата можно переименовать через AS, а порядок задать через ORDER BY.'
    ],
    tests: [
      {
        name: 'возвращает три строки — по одной на приоритет',
        code: `expect(rows).toHaveLength(3);`
      },
      {
        name: 'колонки называются priority и total',
        code: `expect(Object.keys(rows[0]).sort()).toEqual(['priority', 'total']);`
      },
      {
        name: 'приоритеты отсортированы по возрастанию',
        code: `expect(rows.map(row => row.priority)).toEqual(['HIGH', 'LOW', 'MEDIUM']);`
      },
      {
        name: 'сумма совпадает с числом seed-задач',
        code: `const total = rows.reduce((sum, row) => sum + Number(row.total), 0);
expect(total).toBe(248);`
      }
    ],
    solution: `SELECT priority,
       count(*) AS total
  FROM work_items
 WHERE is_seed
 GROUP BY priority
 ORDER BY priority;`
  }
]
