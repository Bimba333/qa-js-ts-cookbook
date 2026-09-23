export default [
  {
    id: 'ts-139-keyof-vs-object-keys',
    title: '`keyof` и `Object.keys` — разные вещи',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `readKeys<T extends object>(item: T)`, возвращающую ' +
      '`{ runtimeKeys, count, hasSymbol }`: строковые ключи объекта, полученные во ' +
      'время выполнения, их число и признак того, что у объекта есть ' +
      'символьные свойства — в список ключей они не попадают. Затем напишите ' +
      '`pickKnown<T, K extends keyof T>(item: T, keys: K[]): (keyof T)[]` — ' +
      'фильтр списка ключей: остаются только те, что действительно есть у ' +
      'объекта, в переданном порядке и без повторов.',
    starter: `function readKeys<T extends object>(item: T) {
  return { runtimeKeys: [] as string[], count: 0, hasSymbol: false };
}

function pickKnown<T extends object, K extends keyof T>(item: T, keys: K[]): (keyof T)[] {
  return [];
}`,
    hints: [
      'Object.keys возвращает строки и не видит символьных свойств.',
      'keyof существует только до запуска, поэтому фильтровать приходится по данным.',
      'Повтор ключа не должен попадать в результат дважды.'
    ],
    tests: [
      {
        name: 'ключи читаются во время выполнения',
        code: `const read = readKeys({ id: 'a', version: 1 });
expect(read.runtimeKeys).toEqual(['id', 'version']);
expect(read.count).toBe(2);`
      },
      {
        name: 'символьное свойство в список не попадает',
        code: `const marker = Symbol('marker');
const read = readKeys({ id: 'a', [marker]: true });
expect(read.runtimeKeys).toEqual(['id']);
expect(read.hasSymbol).toBe(true);`
      },
      {
        name: 'известные ключи остаются',
        code: `expect(pickKnown({ id: 'a', version: 1 }, ['version', 'id'])).toEqual(['version', 'id']);`
      },
      {
        name: 'отсутствующий ключ отбрасывается',
        code: `const partial = { id: 'a' } as { id: string; version?: number };
expect(pickKnown(partial, ['id', 'version'])).toEqual(['id']);`
      },
      {
        name: 'повторы убираются',
        code: `expect(pickKnown({ id: 'a' }, ['id', 'id'])).toEqual(['id']);`
      },
      {
        name: 'пустой список ключей',
        code: `expect(pickKnown({ id: 'a' }, [])).toEqual([]);`
      }
    ],
    solution: `function readKeys<T extends object>(item: T) {
  const runtimeKeys = Object.keys(item);

  return {
    runtimeKeys,
    count: runtimeKeys.length,
    hasSymbol: Object.getOwnPropertySymbols(item).length > 0
  };
}

function pickKnown<T extends object, K extends keyof T>(item: T, keys: K[]): (keyof T)[] {
  const seen = new Set<keyof T>();
  const known: (keyof T)[] = [];

  for (const key of keys) {
    if (Object.hasOwn(item, key as string) && !seen.has(key)) {
      seen.add(key);
      known.push(key);
    }
  }

  return known;
}`
  }
]
