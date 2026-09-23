export default [
  {
    id: 'js-65-private-state',
    title: 'Замыкание хранит состояние, недоступное снаружи',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `createRunRegistry()` с методами `register(id)`, `has(id)`, ' +
      '`count()` и `snapshot()`. Зарегистрированные идентификаторы живут в ' +
      'замыкании: снаружи их видно только через методы, а `Object.keys` ' +
      'возвращённого объекта не должен содержать хранилище. Повторная ' +
      'регистрация того же идентификатора ничего не меняет и возвращает `false`, ' +
      'первая — `true`. `snapshot()` возвращает копию списка: её изменение не ' +
      'должно затрагивать реестр.',
    starter: `function createRunRegistry() {
  return {
    register(id) { return false; },
    has(id) { return false; },
    count() { return 0; },
    snapshot() { return []; }
  };
}`,
    hints: [
      'Хранилище объявляется в функции, а не в возвращаемом объекте.',
      'Повторная регистрация должна отличаться по возвращаемому значению.',
      'Возврат внутреннего массива открыл бы реестр для изменений снаружи.'
    ],
    tests: [
      {
        name: 'первая регистрация принимается',
        code: `const registry = createRunRegistry();
expect(registry.register('R-1')).toBe(true);
expect(registry.has('R-1')).toBe(true);
expect(registry.count()).toBe(1);`
      },
      {
        name: 'повторная регистрация отклоняется',
        code: `const registry = createRunRegistry();
registry.register('R-1');
expect(registry.register('R-1')).toBe(false);
expect(registry.count()).toBe(1);`
      },
      {
        name: 'состояние недоступно снаружи',
        code: `const registry = createRunRegistry();
registry.register('R-1');
expect(Object.keys(registry).sort()).toEqual(['count', 'has', 'register', 'snapshot']);
expect(JSON.stringify(registry)).toBe('{}');`
      },
      {
        name: 'снимок не связан с реестром',
        code: `const registry = createRunRegistry();
registry.register('R-1');
const snapshot = registry.snapshot();
snapshot.push('R-2');
expect(registry.count()).toBe(1);
expect(registry.has('R-2')).toBe(false);`
      },
      {
        name: 'реестры независимы',
        code: `const first = createRunRegistry();
const second = createRunRegistry();
first.register('R-1');
expect(second.count()).toBe(0);`
      },
      {
        name: 'снимок содержит зарегистрированное в порядке добавления',
        code: `const registry = createRunRegistry();
registry.register('R-2');
registry.register('R-1');
expect(registry.snapshot()).toEqual(['R-2', 'R-1']);`
      }
    ],
    solution: `function createRunRegistry() {
  const ids = [];

  return {
    register(id) {
      if (ids.includes(id)) {
        return false;
      }

      ids.push(id);

      return true;
    },

    has(id) {
      return ids.includes(id);
    },

    count() {
      return ids.length;
    },

    snapshot() {
      return [...ids];
    }
  };
}`
  }
]
