export default [
  {
    id: 'ts-117-enum-leaves-code',
    title: 'Enum оставляет объект во время выполнения',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите числовой `enum Priority { LOW, MEDIUM, HIGH }` и строковый ' +
      '`enum Status { NEW = "NEW", DONE = "DONE" }`. Напишите ' +
      '`describeRuntime()`, возвращающую объект ' +
      '`{ priorityIsObject, statusIsObject, reverseLookup, statusReverse, names }`: ' +
      'признаки того, что оба enum существуют во время выполнения как объекты; ' +
      '`reverseLookup` — значение `Priority[1]`; `statusReverse` — значение ' +
      '`Status["DONE"]`; `names` — ключи `Priority`, у которых значение является ' +
      'числом.',
    starter: `enum Priority { LOW, MEDIUM, HIGH }

enum Status { NEW = 'NEW', DONE = 'DONE' }

function describeRuntime() {
  // Числовой enum хранит и прямое, и обратное отображение.
  return {
    priorityIsObject: false,
    statusIsObject: false,
    reverseLookup: '',
    statusReverse: '',
    names: []
  };
}`,
    hints: [
      'После компиляции enum превращается в обычный объект.',
      'У числового enum ключи есть и для имён, и для чисел.',
      'Отобрать нужные ключи помогает проверка типа значения.'
    ],
    tests: [
      {
        name: 'оба enum существуют во время выполнения',
        code: `const described = describeRuntime();
expect(described.priorityIsObject).toBe(true);
expect(described.statusIsObject).toBe(true);`
      },
      {
        name: 'числовой enum даёт обратное отображение',
        code: `expect(describeRuntime().reverseLookup).toBe('MEDIUM');`
      },
      {
        name: 'строковый enum обратного отображения не имеет',
        code: `expect(describeRuntime().statusReverse).toBe('DONE');
expect(Status['DONE']).toBe('DONE');
expect(Status[0]).toBeUndefined();`
      },
      {
        name: 'имена вариантов собраны из объекта',
        code: `expect(describeRuntime().names).toEqual(['LOW', 'MEDIUM', 'HIGH']);`
      },
      {
        name: 'числовые значения идут с нуля',
        code: `expect(Priority.LOW).toBe(0);
expect(Priority.HIGH).toBe(2);`
      },
      {
        name: 'объединение литералов кода не оставляет',
        code: `const STATUSES = ['NEW', 'DONE'] as const;
expect(Array.isArray(STATUSES)).toBe(true);
expect(typeof Status).toBe('object');`
      }
    ],
    solution: `enum Priority { LOW, MEDIUM, HIGH }

enum Status { NEW = 'NEW', DONE = 'DONE' }

function describeRuntime() {
  const names = Object.keys(Priority)
    .filter(key => typeof (Priority as Record<string, unknown>)[key] === 'number');

  return {
    priorityIsObject: typeof Priority === 'object',
    statusIsObject: typeof Status === 'object',
    reverseLookup: Priority[1],
    statusReverse: Status['DONE'],
    names
  };
}`
  }
]
