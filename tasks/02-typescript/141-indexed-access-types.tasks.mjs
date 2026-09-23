export default [
  {
    id: 'ts-141-pluck-values',
    title: 'Сбор значений одного поля',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` — функцию, ' +
      'которая собирает значения одного поля из массива объектов. Элементы, ' +
      'у которых поле отсутствует или равно `undefined`, в результат не попадают. ' +
      'Тип элемента результата описывается индексным доступом `T[K]`.',
    starter: `function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  // Пропускайте элементы без значения.
  return [];
}`,
    hints: [
      'Запись T[K] — это тип значения поля K у типа T.',
      'Отсутствующее поле и явный undefined выглядят одинаково.',
      'Значения нельзя преобразовывать: число должно остаться числом.'
    ],
    tests: [
      {
        name: 'собирает строковые значения',
        code: `expect(pluck([{ id: 'a' }, { id: 'b' }], 'id')).toEqual(['a', 'b']);`
      },
      {
        name: 'пропускает элементы без значения',
        code: `const items = [{ id: 'a' }, {}, { id: 'c' }] as { id?: string }[];
expect(pluck(items, 'id')).toEqual(['a', 'c']);`
      },
      {
        name: 'числа остаются числами',
        code: `const values = pluck([{ version: 0 }, { version: 2 }], 'version');
expect(values).toEqual([0, 2]);
expect(typeof values[0]).toBe('number');`
      },
      {
        name: 'значение null сохраняется',
        code: `expect(pluck([{ note: null }], 'note')).toEqual([null]);`
      },
      {
        name: 'пустой массив даёт пустой результат',
        code: `expect(pluck([], 'id')).toEqual([]);`
      }
    ],
    solution: `function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  const values: T[K][] = [];

  for (const item of items) {
    const value = item[key];

    if (value !== undefined) {
      values.push(value);
    }
  }

  return values;
}`
  },

  {
    id: 'ts-141-group-by-field',
    title: 'Группировка по значению поля',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите `groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]>`. ' +
      'Ключ карты — значение поля, значение — массив элементов в исходном порядке. ' +
      'Map, а не объект: значением ключа может быть число или булево.',
    starter: `function groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  return new Map();
}`,
    hints: [
      'Map сохраняет тип ключа, объект превратил бы его в строку.',
      'Для каждого элемента нужно либо создать группу, либо дополнить существующую.',
      'Порядок внутри группы — порядок исходного массива.'
    ],
    tests: [
      {
        name: 'группирует по строковому полю',
        code: `const grouped = groupBy(
  [{ status: 'OPEN', id: 1 }, { status: 'DONE', id: 2 }, { status: 'OPEN', id: 3 }],
  'status'
);
expect(grouped.get('OPEN').map(item => item.id)).toEqual([1, 3]);`
      },
      {
        name: 'число не превращается в строку',
        code: `const grouped = groupBy([{ level: 1 }, { level: 1 }], 'level');
expect(grouped.get(1)).toHaveLength(2);
expect(grouped.get('1')).toBeUndefined();`
      },
      {
        name: 'булево значение остаётся ключом',
        code: `const grouped = groupBy([{ done: true }, { done: false }], 'done');
expect(grouped.get(true)).toHaveLength(1);
expect(grouped.get(false)).toHaveLength(1);`
      },
      {
        name: 'пустой массив даёт пустую карту',
        code: `expect(groupBy([], 'any').size).toBe(0);`
      },
      {
        name: 'исходный массив не меняется',
        code: `const items = [{ status: 'OPEN' }];
groupBy(items, 'status');
expect(items).toHaveLength(1);`
      }
    ],
    solution: `function groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const groups = new Map<T[K], T[]>();

  for (const item of items) {
    const groupKey = item[key];
    const group = groups.get(groupKey);

    if (group === undefined) {
      groups.set(groupKey, [item]);
    } else {
      group.push(item);
    }
  }

  return groups;
}`
  }
]
