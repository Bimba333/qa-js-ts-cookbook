export default [
  {
    id: 'js-18-status-exit-code',
    title: 'Код завершения по статусу прогона',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `exitCode(results)`, которая возвращает `1`, если среди ' +
      'результатов есть хотя бы один `failed`; `0`, если все `passed` или ' +
      '`skipped`; и `2` для пустого прогона — потому что запуск без тестов успешным ' +
      'считать нельзя.',
    starter: `function exitCode(results) {
  // Выполняется ровно одна ветка.
}`,
    hints: [
      'Пустой прогон стоит проверить первым.',
      'Наличие хотя бы одного падения проверяется одним обходом.',
      'Все три ветки должны быть покрыты.'
    ],
    tests: [
      {
        name: 'есть падение — код 1',
        code: `expect(exitCode([
  { status: 'passed' },
  { status: 'failed' }
])).toBe(1);`
      },
      {
        name: 'все прошли — код 0',
        code: `expect(exitCode([{ status: 'passed' }, { status: 'skipped' }])).toBe(0);`
      },
      {
        name: 'пустой прогон — код 2',
        code: `expect(exitCode([])).toBe(2);`
      },
      {
        name: 'только пропущенные — код 0',
        code: `expect(exitCode([{ status: 'skipped' }])).toBe(0);`
      }
    ],
    solution: `function exitCode(results) {
  if (results.length === 0) {
    return 2;
  }

  if (results.some((result) => result.status === 'failed')) {
    return 1;
  }

  return 0;
}`
  },

  {
    id: 'js-18-priority-order',
    title: 'Числовой вес приоритета',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `priorityWeight(priority)`, которая возвращает `0` для ' +
      '`HIGH`, `1` для `MEDIUM`, `2` для `LOW` и `3` для любого другого значения. ' +
      'Такой вес удобно использовать для сортировки.',
    starter: `function priorityWeight(priority) {
  // Неизвестное значение должно попадать в ветку по умолчанию.
}`,
    hints: [
      'Разбор набора значений удобно сделать через switch.',
      'Ветка по умолчанию обязательна: набор может расшириться.',
      'Регистр значений важен — подстраивать его не нужно.'
    ],
    tests: [
      {
        name: 'известные значения',
        code: `expect([priorityWeight('HIGH'), priorityWeight('MEDIUM'), priorityWeight('LOW')])
  .toEqual([0, 1, 2]);`
      },
      {
        name: 'неизвестное значение уходит в конец',
        code: `expect(priorityWeight('URGENT')).toBe(3);`
      },
      {
        name: 'другой регистр считается неизвестным',
        code: `expect(priorityWeight('high')).toBe(3);`
      },
      {
        name: 'подходит для сортировки',
        code: `const sorted = ['LOW', 'HIGH', 'MEDIUM']
  .sort((a, b) => priorityWeight(a) - priorityWeight(b));
expect(sorted).toEqual(['HIGH', 'MEDIUM', 'LOW']);`
      }
    ],
    solution: `function priorityWeight(priority) {
  switch (priority) {
    case 'HIGH':
      return 0;
    case 'MEDIUM':
      return 1;
    case 'LOW':
      return 2;
    default:
      return 3;
  }
}`
  }
]
