export default [
  {
    id: 'ts-134-longest-by-length',
    title: 'Ограничение по форме',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `longest<T extends { length: number }>(items: T[]): T | undefined` — ' +
      'функцию, возвращающую элемент с наибольшей длиной. При равной длине ' +
      'возвращается первый встреченный. Для пустого массива — `undefined`.',
    starter: `function longest<T extends { length: number }>(items: T[]): T | undefined {
  return undefined;
}`,
    hints: [
      'Ограничение extends { length: number } допускает и строки, и массивы.',
      'Возвращать нужно сам элемент, а не его длину.',
      'При равенстве длины первый найденный не заменяется.'
    ],
    tests: [
      {
        name: 'находит самую длинную строку',
        code: `expect(longest(['ab', 'abcd', 'a'])).toBe('abcd');`
      },
      {
        name: 'работает с массивами',
        code: `const target = [1, 2, 3];
expect(longest([[1], target, [1, 2]])).toBe(target);`
      },
      {
        name: 'при равной длине берётся первый',
        code: `expect(longest(['ab', 'cd'])).toBe('ab');`
      },
      {
        name: 'пустой массив даёт undefined',
        code: `expect(longest([])).toBeUndefined();`
      },
      {
        name: 'элемент нулевой длины тоже возвращается',
        code: `expect(longest([''])).toBe('');`
      }
    ],
    solution: `function longest<T extends { length: number }>(items: T[]): T | undefined {
  let best: T | undefined = undefined;

  for (const item of items) {
    if (best === undefined || item.length > best.length) {
      best = item;
    }
  }

  return best;
}`
  },

  {
    id: 'ts-134-merge-defaults',
    title: 'Слияние с настройками по умолчанию',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите `withDefaults<T extends object>(defaults: T, overrides: Partial<T>): T`. ' +
      'Поля `overrides` перекрывают значения по умолчанию, но **только** если ' +
      'значение не `undefined`. Исходные объекты изменяться не должны.',
    starter: `function withDefaults<T extends object>(defaults: T, overrides: Partial<T>): T {
  return { ...defaults, ...overrides };
}`,
    hints: [
      'Распространение объекта копирует и явные undefined — это и есть ловушка.',
      'Перекрывать стоит поэлементно, с проверкой значения.',
      'Ни один из аргументов не должен измениться.'
    ],
    tests: [
      {
        name: 'перекрывает заданные поля',
        code: `expect(withDefaults({ retries: 1, timeout: 5000 }, { retries: 3 }))
  .toEqual({ retries: 3, timeout: 5000 });`
      },
      {
        name: 'явный undefined не затирает значение по умолчанию',
        code: `expect(withDefaults({ retries: 1 }, { retries: undefined }))
  .toEqual({ retries: 1 });`
      },
      {
        name: 'значение false и 0 перекрывают',
        code: `expect(withDefaults({ debug: true, retries: 3 }, { debug: false, retries: 0 }))
  .toEqual({ debug: false, retries: 0 });`
      },
      {
        name: 'исходные объекты не меняются',
        code: `const defaults = { retries: 1 };
const overrides = { retries: 3 };
withDefaults(defaults, overrides);
expect(defaults.retries).toBe(1);
expect(overrides.retries).toBe(3);`
      },
      {
        name: 'пустые перекрытия возвращают копию',
        code: `const defaults = { retries: 1 };
const merged = withDefaults(defaults, {});
expect(merged).toEqual({ retries: 1 });
expect(merged === defaults).toBe(false);`
      }
    ],
    solution: `function withDefaults<T extends object>(defaults: T, overrides: Partial<T>): T {
  const result = { ...defaults };

  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const value = overrides[key];

    if (value !== undefined) {
      result[key] = value as T[keyof T];
    }
  }

  return result;
}`
  }
]
