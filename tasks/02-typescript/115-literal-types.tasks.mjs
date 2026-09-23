export default [
  {
    id: 'ts-115-allowed-values',
    title: 'Набор допустимых значений',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите `type Priority = "LOW" | "MEDIUM" | "HIGH"` и массив ' +
      '`PRIORITIES` с теми же значениями через `as const`. Напишите ' +
      '`isPriority(value: unknown): value is Priority` — проверку по массиву, ' +
      'а не по повторённым строкам; `weightOf(priority: Priority): number` — ' +
      '`1`, `2`, `3` соответственно; и ' +
      '`sortByPriority(items: { priority: Priority }[])` — сортировку копии по ' +
      'убыванию веса, не изменяя исходный массив.',
    starter: `type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;

function isPriority(value: unknown): value is Priority {
  return false;
}

function weightOf(priority: Priority): number {
  return 0;
}

function sortByPriority(items: { priority: Priority }[]): { priority: Priority }[] {
  return items;
}`,
    hints: [
      'Литеральный тип существует до запуска, список значений — во время выполнения.',
      'Сортировка на месте изменила бы исходный массив.',
      'Вес удобно задать одним объектом соответствия.'
    ],
    tests: [
      {
        name: 'известные значения проходят',
        code: `expect(isPriority('LOW')).toBe(true);
expect(isPriority('HIGH')).toBe(true);`
      },
      {
        name: 'чужое значение не проходит',
        code: `expect(isPriority('URGENT')).toBe(false);
expect(isPriority(1)).toBe(false);
expect(isPriority(null)).toBe(false);`
      },
      {
        name: 'проверка опирается на список',
        code: `expect(PRIORITIES.every(value => isPriority(value))).toBe(true);
expect(PRIORITIES).toHaveLength(3);`
      },
      {
        name: 'вес задан для всех вариантов',
        code: `expect(weightOf('LOW')).toBe(1);
expect(weightOf('MEDIUM')).toBe(2);
expect(weightOf('HIGH')).toBe(3);`
      },
      {
        name: 'сортировка по убыванию веса',
        code: `expect(sortByPriority([
  { priority: 'LOW' },
  { priority: 'HIGH' },
  { priority: 'MEDIUM' }
]).map(item => item.priority)).toEqual(['HIGH', 'MEDIUM', 'LOW']);`
      },
      {
        name: 'исходный массив не изменяется',
        code: `const items: { priority: Priority }[] = [{ priority: 'LOW' }, { priority: 'HIGH' }];
sortByPriority(items);
expect(items.map(item => item.priority)).toEqual(['LOW', 'HIGH']);`
      },
      {
        name: 'пустой список',
        code: `expect(sortByPriority([])).toEqual([]);`
      }
    ],
    solution: `type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;

const WEIGHTS: Record<Priority, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };

function isPriority(value: unknown): value is Priority {
  return typeof value === 'string'
    && (PRIORITIES as readonly string[]).includes(value);
}

function weightOf(priority: Priority): number {
  return WEIGHTS[priority];
}

function sortByPriority(items: { priority: Priority }[]): { priority: Priority }[] {
  return [...items].sort((a, b) => weightOf(b.priority) - weightOf(a.priority));
}`
  }
]
