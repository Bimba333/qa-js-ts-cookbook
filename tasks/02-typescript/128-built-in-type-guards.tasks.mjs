export default [
  {
    id: 'ts-128-describe-value',
    title: 'Разбор значения встроенными проверками',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `describeValue(value: unknown): string`, возвращающую одно из слов: ' +
      '`null`, `array`, `date`, `object`, `number`, `string`, `boolean`, `function`, ' +
      '`undefined`, `other`. Порядок проверок важен: `null` и массив опознаются ' +
      'раньше, чем объект, а `NaN` считается `other`.',
    starter: `function describeValue(value: unknown): string {
  // typeof, Array.isArray и instanceof различают разные случаи.
  return 'other';
}`,
    hints: [
      'typeof null возвращает "object" — этот случай проверяется первым.',
      'Массив и дата тоже имеют typeof "object".',
      'NaN ловится через Number.isNaN, а не сравнением.'
    ],
    tests: [
      {
        name: 'null опознаётся раньше объекта',
        code: `expect(describeValue(null)).toBe('null');`
      },
      {
        name: 'массив отличается от объекта',
        code: `expect(describeValue([])).toBe('array');
expect(describeValue({})).toBe('object');`
      },
      {
        name: 'дата опознаётся отдельно',
        code: `expect(describeValue(new Date(0))).toBe('date');`
      },
      {
        name: 'примитивы опознаются по typeof',
        code: `expect(describeValue(1)).toBe('number');
expect(describeValue('a')).toBe('string');
expect(describeValue(false)).toBe('boolean');`
      },
      {
        name: 'функция и undefined',
        code: `expect(describeValue(() => {})).toBe('function');
expect(describeValue(undefined)).toBe('undefined');`
      },
      {
        name: 'NaN не считается числом',
        code: `expect(describeValue(NaN)).toBe('other');`
      }
    ],
    solution: `function describeValue(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';

  const kind = typeof value;

  if (kind === 'number') {
    return Number.isNaN(value) ? 'other' : 'number';
  }

  if (kind === 'object' || kind === 'string' || kind === 'boolean'
    || kind === 'function' || kind === 'undefined') {
    return kind;
  }

  return 'other';
}`
  }
]
