export default [
  {
    id: 'js-59-sort-durations',
    title: 'Сортировка длительностей по возрастанию',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `sortedDurations(durations)`, которая принимает массив чисел ' +
      'и возвращает **новый** массив, отсортированный по возрастанию. Исходный ' +
      'массив изменяться не должен.',
    starter: `function sortedDurations(durations) {
  // sort() сортирует на месте и сравнивает как строки без компаратора.
}`,
    hints: [
      'Без компаратора значения приводятся к строкам: [10, 9] станет [10, 9].',
      'sort() изменяет исходный массив — сначала нужна копия.',
      'Компаратор возвращает число: отрицательное, ноль или положительное.'
    ],
    tests: [
      {
        name: 'сортирует по величине, а не как строки',
        code: `expect(sortedDurations([10, 9, 1, 80])).toEqual([1, 9, 10, 80]);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [10, 9, 1];
sortedDurations(source);
expect(source).toEqual([10, 9, 1]);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(sortedDurations([])).toEqual([]);`
      },
      {
        name: 'возвращает новый массив',
        code: `const source = [2, 1];
expect(sortedDurations(source) === source).toBe(false);`
      }
    ],
    solution: `function sortedDurations(durations) {
  return [...durations].sort((first, second) => first - second);
}`
  },

  {
    id: 'js-59-sort-by-status-then-name',
    title: 'Сортировка по статусу, затем по имени',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `sortResults(results)`, которая возвращает новый массив ' +
      '`{ name, status }`, отсортированный так: сначала все `failed`, затем ' +
      'остальные; внутри группы — по имени по возрастанию. Исходный массив ' +
      'изменяться не должен.',
    starter: `function sortResults(results) {
  // Компаратор может учитывать два признака по очереди.
}`,
    hints: [
      'Сначала сравните принадлежность к группе failed, потом имена.',
      'Для строк удобно использовать localeCompare().',
      'Если первый признак равен, компаратор должен перейти ко второму.'
    ],
    tests: [
      {
        name: 'упавшие идут первыми',
        code: `expect(sortResults([
  { name: 'b', status: 'passed' },
  { name: 'a', status: 'failed' }
])).toEqual([
  { name: 'a', status: 'failed' },
  { name: 'b', status: 'passed' }
]);`
      },
      {
        name: 'внутри группы сортировка по имени',
        code: `expect(sortResults([
  { name: 'z', status: 'failed' },
  { name: 'a', status: 'failed' }
]).map((r) => r.name)).toEqual(['a', 'z']);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [
  { name: 'b', status: 'passed' },
  { name: 'a', status: 'failed' }
];
sortResults(source);
expect(source[0].name).toBe('b');`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(sortResults([])).toEqual([]);`
      }
    ],
    solution: `function sortResults(results) {
  return [...results].sort((first, second) => {
    const firstFailed = first.status === 'failed' ? 0 : 1;
    const secondFailed = second.status === 'failed' ? 0 : 1;

    if (firstFailed !== secondFailed) {
      return firstFailed - secondFailed;
    }

    return first.name.localeCompare(second.name);
  });
}`
  }
]
