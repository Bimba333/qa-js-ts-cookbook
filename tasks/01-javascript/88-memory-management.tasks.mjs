export default [
  {
    id: 'js-88-bounded-cache',
    title: 'Кеш с ограниченным размером',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Неограниченный кеш — типичная утечка. Напишите `createCache(limit)` ' +
      'с методами `set(key, value)`, `get(key)`, `size()` и `keys()`. Когда ' +
      'записей становится больше `limit`, удаляется давнее всего ' +
      '**использованная** запись: `get` и повторный `set` считаются ' +
      'использованием и обновляют её давность. `get` для отсутствующего ключа ' +
      'возвращает `undefined`. `keys()` возвращает ключи от давних к свежим.',
    starter: `function createCache(limit) {
  // При переполнении удаляется давнее всего использованная запись.

  return {
    set(key, value) {},
    get(key) {},
    size() { return 0; },
    keys() { return []; }
  };
}`,
    hints: [
      '`Map` хранит ключи в порядке вставки, и первый ключ итератора — самый давний.',
      'Чтобы отметить запись как свежую, её нужно удалить и вставить заново: тогда она окажется в конце порядка.',
      'Вытеснение выполняется после вставки: сначала добавили, потом проверили, не превышен ли предел.'
    ],
    tests: [
      {
        name: 'записи читаются',
        code: `const cache = createCache(2);
cache.set('a', 1);
expect(cache.get('a')).toBe(1);`
      },
      {
        name: 'отсутствующий ключ даёт `undefined`',
        code: `expect(createCache(2).get('нет')).toBe(undefined);`
      },
      {
        name: 'размер не превышает предел',
        code: `const bounded = createCache(2);
bounded.set('a', 1);
bounded.set('b', 2);
bounded.set('c', 3);
expect(bounded.size()).toBe(2);`
      },
      {
        name: 'вытесняется самая давняя запись',
        code: `const evicting = createCache(2);
evicting.set('a', 1);
evicting.set('b', 2);
evicting.set('c', 3);
expect(evicting.get('a')).toBe(undefined);
expect(evicting.keys()).toEqual(['b', 'c']);`
      },
      {
        name: 'чтение обновляет давность',
        code: `const used = createCache(2);
used.set('a', 1);
used.set('b', 2);
used.get('a');
used.set('c', 3);
expect(used.get('a')).toBe(1);
expect(used.get('b')).toBe(undefined);`
      },
      {
        name: 'повторный `set` обновляет значение, а не добавляет запись',
        code: `const updated = createCache(2);
updated.set('a', 1);
updated.set('a', 2);
expect(updated.size()).toBe(1);
expect(updated.get('a')).toBe(2);`
      },
      {
        name: 'значение `undefined` хранится как значение',
        code: `const holder = createCache(2);
holder.set('empty', undefined);
expect(holder.size()).toBe(1);
expect(holder.keys()).toEqual(['empty']);`
      }
    ],
    solution: `function createCache(limit) {
  const entries = new Map();

  function touch(key, value) {
    entries.delete(key);
    entries.set(key, value);
  }

  return {
    set(key, value) {
      touch(key, value);

      while (entries.size > limit) {
        const oldest = entries.keys().next().value;
        entries.delete(oldest);
      }
    },
    get(key) {
      if (!entries.has(key)) return undefined;

      const value = entries.get(key);
      touch(key, value);

      return value;
    },
    size() {
      return entries.size;
    },
    keys() {
      return [...entries.keys()];
    }
  };
}`
  }
]
