export default [
  {
    id: 'ts-133-first-or-null',
    title: 'Дженерик-функция для первого элемента',
    difficulty: 'easy',
    lang: 'ts',
    prompt:
      'Напишите дженерик-функцию `firstOrNull<T>(items: T[]): T | null`, которая ' +
      'возвращает первый элемент массива или `null` для пустого массива. Тип ' +
      'результата должен сохранять тип элементов.',
    starter: `function firstOrNull<T>(items: T[]): T | null {
  // Пустой массив обрабатывается отдельно.
  return null;
}`,
    hints: [
      'Параметр типа T связывает вход и выход функции.',
      'Для пустого массива обращение по индексу даёт undefined, а нужен null.',
      'Возвращать нужно первый элемент, а не его копию.'
    ],
    tests: [
      {
        name: 'возвращает первый элемент',
        code: `expect(firstOrNull(['a', 'b'])).toBe('a');`
      },
      {
        name: 'для пустого массива возвращает null',
        code: `expect(firstOrNull([])).toBe(null);`
      },
      {
        name: 'работает с объектами',
        code: `expect(firstOrNull([{ id: 1 }, { id: 2 }])).toEqual({ id: 1 });`
      },
      {
        name: 'возвращает тот же объект, а не копию',
        code: `const item = { id: 1 };
expect(firstOrNull([item]) === item).toBe(true);`
      }
    ],
    solution: `function firstOrNull<T>(items: T[]): T | null {
  return items.length === 0 ? null : items[0];
}`
  },

  {
    id: 'ts-133-group-by-key',
    title: 'Группировка по значению поля',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите дженерик-функцию `groupBy<T>(items: T[], readKey: (item: T) => string)`, ' +
      'которая возвращает объект, где ключ — результат `readKey`, а значение — массив ' +
      'элементов с этим ключом. Порядок элементов внутри группы сохраняется.',
    starter: `function groupBy<T>(items: T[], readKey: (item: T) => string): Record<string, T[]> {
  // Аккумулятором может быть объект.
  return {};
}`,
    hints: [
      'Тип ключа задан как string, а тип элементов остаётся параметром.',
      'Перед добавлением нужно убедиться, что массив для ключа существует.',
      'Порядок внутри группы должен совпадать с исходным.'
    ],
    tests: [
      {
        name: 'группирует по статусу',
        code: `expect(groupBy(
  [{ name: 'a', status: 'passed' }, { name: 'b', status: 'failed' }, { name: 'c', status: 'passed' }],
  (item) => item.status
)).toEqual({
  passed: [{ name: 'a', status: 'passed' }, { name: 'c', status: 'passed' }],
  failed: [{ name: 'b', status: 'failed' }]
});`
      },
      {
        name: 'для пустого массива возвращает пустой объект',
        code: `expect(groupBy([], (item: string) => item)).toEqual({});`
      },
      {
        name: 'сохраняет порядок внутри группы',
        code: `expect(groupBy(['z', 'a', 'zz'], (item) => String(item.length)))
  .toEqual({ '1': ['z', 'a'], '2': ['zz'] });`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = ['a', 'b'];
groupBy(source, (item) => item);
expect(source).toEqual(['a', 'b']);`
      }
    ],
    solution: `function groupBy<T>(items: T[], readKey: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = readKey(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);

    return groups;
  }, {});
}`
  }
]
