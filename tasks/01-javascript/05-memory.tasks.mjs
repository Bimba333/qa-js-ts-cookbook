export default [
  {
    id: 'js-05-memory-model',
    title: 'Имя, значение и три операции',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Смоделируйте память из этой главы. Функция `createMemory()` возвращает ' +
      'объект с методами `store(name, value)`, `read(name)`, `update(name, value)` ' +
      'и `names()`. `store` заводит новое имя и бросает `Error` с сообщением ' +
      '`имя уже занято`, если оно уже есть. `read` и `update` бросают `Error` ' +
      'с сообщением `имя не найдено` для незнакомого имени. `names()` возвращает ' +
      'имена в порядке их появления.',
    starter: `function createMemory() {
  // Хранилище должно быть недоступно снаружи напрямую.

  return {
    store(name, value) {},
    read(name) {},
    update(name, value) {},
    names() { return []; }
  };
}`,
    hints: [
      'Соответствие «имя → значение» удобно держать в `Map`: она сохраняет порядок вставки и отличает отсутствие ключа от значения `undefined`.',
      'Разница между `store` и `update` только в том, какое состояние имени считается ошибкой.',
      'Наружу отдавайте копию списка имён, иначе вызывающий код сможет менять внутреннее состояние.'
    ],
    tests: [
      {
        name: 'сохранённое значение читается',
        code: `const memory = createMemory();
memory.store('retries', 3);
expect(memory.read('retries')).toBe(3);`
      },
      {
        name: 'обновление заменяет значение',
        code: `const updated = createMemory();
updated.store('retries', 3);
updated.update('retries', 5);
expect(updated.read('retries')).toBe(5);`
      },
      {
        name: 'повторное объявление имени запрещено',
        code: `const twice = createMemory();
twice.store('env', 'local');
expect(() => twice.store('env', 'ci')).toThrow('имя уже занято');`
      },
      {
        name: 'чтение незнакомого имени — ошибка',
        code: `const empty = createMemory();
expect(() => empty.read('нет')).toThrow('имя не найдено');
expect(() => empty.update('нет', 1)).toThrow('имя не найдено');`
      },
      {
        name: 'имена идут в порядке появления',
        code: `const ordered = createMemory();
ordered.store('a', 1);
ordered.store('b', 2);
ordered.update('a', 3);
expect(ordered.names()).toEqual(['a', 'b']);`
      },
      {
        name: 'значение `undefined` тоже является значением',
        code: `const holder = createMemory();
holder.store('empty', undefined);
expect(holder.read('empty')).toBe(undefined);
expect(holder.names()).toEqual(['empty']);`
      }
    ],
    solution: `function createMemory() {
  const cells = new Map();

  return {
    store(name, value) {
      if (cells.has(name)) throw new Error('имя уже занято');
      cells.set(name, value);
    },
    read(name) {
      if (!cells.has(name)) throw new Error('имя не найдено');
      return cells.get(name);
    },
    update(name, value) {
      if (!cells.has(name)) throw new Error('имя не найдено');
      cells.set(name, value);
    },
    names() {
      return [...cells.keys()];
    }
  };
}`
  }
]
