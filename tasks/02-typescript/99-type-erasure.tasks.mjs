export default [
  {
    id: 'ts-99-what-survives-compilation',
    title: 'Что доживает до выполнения',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите `type WorkItem = { id: string; version: number }` и класс ' +
      '`Session` с полем `id`. Напишите `isWorkItem(value: unknown): value is WorkItem` — ' +
      'проверку формы, потому что `instanceof` для типа невозможен. ' +
      'Напишите `classify(value: unknown)`, возвращающую ' +
      '`{ isSession, isWorkItem, kind }`: принадлежность классу через ' +
      '`instanceof`, соответствие форме через стража и строку ' +
      '`"класс" | "форма" | "ни то, ни другое"`. Класс проверяется первым.',
    starter: `type WorkItem = { id: string; version: number };

class Session {
  constructor(public id: string) {}
}

function isWorkItem(value: unknown): value is WorkItem {
  return false;
}

function classify(value: unknown) {
  return { isSession: false, isWorkItem: false, kind: '' };
}`,
    hints: [
      'Класс порождает код и потому доступен instanceof.',
      'Тип исчезает после компиляции: проверять нужно форму значения.',
      'Экземпляр класса может случайно совпасть по форме — порядок проверок важен.'
    ],
    tests: [
      {
        name: 'класс опознаётся через instanceof',
        code: `const classified = classify(new Session('S-1'));
expect(classified.isSession).toBe(true);
expect(classified.kind).toBe('класс');`
      },
      {
        name: 'форма опознаётся стражем',
        code: `const classified = classify({ id: 'WI-1', version: 2 });
expect(classified.isSession).toBe(false);
expect(classified.isWorkItem).toBe(true);
expect(classified.kind).toBe('форма');`
      },
      {
        name: 'чужое значение не подходит ни под что',
        code: `expect(classify({ id: 'WI-1' }).kind).toBe('ни то, ни другое');
expect(classify(null).kind).toBe('ни то, ни другое');`
      },
      {
        name: 'страж проверяет типы полей',
        code: `expect(isWorkItem({ id: 'WI-1', version: '2' })).toBe(false);
expect(isWorkItem({ id: 1, version: 2 })).toBe(false);`
      },
      {
        name: 'массив формой не является',
        code: `expect(isWorkItem([])).toBe(false);`
      },
      {
        name: 'класс существует во время выполнения, тип — нет',
        code: `expect(typeof Session).toBe('function');
expect(new Session('S-1') instanceof Session).toBe(true);`
      }
    ],
    solution: `type WorkItem = { id: string; version: number };

class Session {
  constructor(public id: string) {}
}

function isWorkItem(value: unknown): value is WorkItem {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === 'string'
    && typeof candidate.version === 'number';
}

function classify(value: unknown) {
  const isSession = value instanceof Session;
  const matchesShape = isWorkItem(value);

  let kind = 'ни то, ни другое';

  if (isSession) {
    kind = 'класс';
  } else if (matchesShape) {
    kind = 'форма';
  }

  return { isSession, isWorkItem: matchesShape, kind };
}`
  }
]
