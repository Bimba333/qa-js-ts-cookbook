export default [
  {
    id: 'ts-116-frozen-statuses',
    title: 'Список допустимых статусов',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите `const STATUSES = [...] as const` со значениями `NEW`, ' +
      '`IN_PROGRESS`, `DONE` и тип `Status = typeof STATUSES[number]`. ' +
      'Напишите `isStatus(value: unknown): value is Status`, которая проверяет ' +
      'принадлежность значения списку. Проверка должна читать сам список, ' +
      'а не повторять значения строками.',
    starter: `const STATUSES = ['NEW', 'IN_PROGRESS', 'DONE'] as const;

type Status = typeof STATUSES[number];

function isStatus(value: unknown): value is Status {
  return false;
}`,
    hints: [
      'as const делает массив доступным только для чтения и сохраняет литералы.',
      'typeof STATUSES[number] — это объединение элементов массива.',
      'Проверку принадлежности даёт includes у массива.'
    ],
    tests: [
      {
        name: 'известный статус распознаётся',
        code: `expect(isStatus('NEW')).toBe(true);
expect(isStatus('DONE')).toBe(true);`
      },
      {
        name: 'неизвестное значение отвергается',
        code: `expect(isStatus('CLOSED')).toBe(false);`
      },
      {
        name: 'не строковое значение отвергается',
        code: `expect(isStatus(0)).toBe(false);
expect(isStatus(null)).toBe(false);`
      },
      {
        name: 'проверка опирается на список, а не на копию значений',
        code: `expect(STATUSES.every(status => isStatus(status))).toBe(true);
expect(STATUSES).toHaveLength(3);`
      },
      {
        name: 'список не изменяется во время выполнения',
        code: `expect(STATUSES[0]).toBe('NEW');
expect(STATUSES[2]).toBe('DONE');`
      }
    ],
    solution: `const STATUSES = ['NEW', 'IN_PROGRESS', 'DONE'] as const;

type Status = typeof STATUSES[number];

function isStatus(value: unknown): value is Status {
  return typeof value === 'string'
    && (STATUSES as readonly string[]).includes(value);
}`
  }
]
