export default [
  {
    id: 'ts-119-both-contracts',
    title: 'И тот договор, и этот',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите типы `Identified = { id: string }`, ' +
      '`Timestamped = { createdAt: string }` и ' +
      '`Record_ = Identified & Timestamped`. Напишите ' +
      '`combine(identified: Identified, timestamped: Timestamped): Record_` — ' +
      'сборку значения, удовлетворяющего обоим договорам, и ' +
      '`isRecord(value: unknown): value is Record_` — проверку формы во время ' +
      'выполнения. Оба поля обязательны: частичное совпадение не проходит.',
    starter: `type Identified = { id: string };
type Timestamped = { createdAt: string };
type Record_ = Identified & Timestamped;

function combine(identified: Identified, timestamped: Timestamped): Record_ {
  return { id: '', createdAt: '' };
}

function isRecord(value: unknown): value is Record_ {
  return false;
}`,
    hints: [
      'Пересечение требует выполнить оба договора одновременно.',
      'Сборка не должна изменять переданные объекты.',
      'Проверка формы должна отвергать объект, у которого есть только часть полей.'
    ],
    tests: [
      {
        name: 'сборка объединяет поля',
        code: `expect(combine({ id: 'a' }, { createdAt: '2026-01-01' }))
  .toEqual({ id: 'a', createdAt: '2026-01-01' });`
      },
      {
        name: 'аргументы не изменяются',
        code: `const identified = { id: 'a' };
const timestamped = { createdAt: '2026-01-01' };
combine(identified, timestamped);
expect(Object.keys(identified)).toEqual(['id']);
expect(Object.keys(timestamped)).toEqual(['createdAt']);`
      },
      {
        name: 'полная форма проходит проверку',
        code: `expect(isRecord({ id: 'a', createdAt: '2026-01-01' })).toBe(true);`
      },
      {
        name: 'частичная форма не проходит',
        code: `expect(isRecord({ id: 'a' })).toBe(false);
expect(isRecord({ createdAt: '2026-01-01' })).toBe(false);`
      },
      {
        name: 'неверный тип поля не проходит',
        code: `expect(isRecord({ id: 1, createdAt: '2026-01-01' })).toBe(false);`
      },
      {
        name: 'null и примитивы не проходят',
        code: `expect(isRecord(null)).toBe(false);
expect(isRecord('a')).toBe(false);`
      },
      {
        name: 'результат сборки проходит собственную проверку',
        code: `expect(isRecord(combine({ id: 'a' }, { createdAt: 'x' }))).toBe(true);`
      }
    ],
    solution: `type Identified = { id: string };
type Timestamped = { createdAt: string };
type Record_ = Identified & Timestamped;

function combine(identified: Identified, timestamped: Timestamped): Record_ {
  return { id: identified.id, createdAt: timestamped.createdAt };
}

function isRecord(value: unknown): value is Record_ {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === 'string'
    && typeof candidate.createdAt === 'string';
}`
  }
]
