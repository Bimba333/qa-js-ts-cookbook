export default [
  {
    id: 'fp-251-build-order',
    title: 'Порядок сборки слоёв',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'План реализации — это граф зависимостей. Напишите `buildOrder(deps)`: ' +
      'на вход приходит объект, где ключ — имя слоя, а значение — массив слоёв, ' +
      'от которых он зависит. Верните массив имён в таком порядке, чтобы каждый ' +
      'слой шёл после всех своих зависимостей. Слои, независимые друг от друга, ' +
      'упорядочивайте по имени — тогда результат воспроизводим.',
    starter: `function buildOrder(deps) {
  // Слой можно строить, когда все его зависимости уже построены.

  return Object.keys(deps);
}`,
    hints: [
      'На каждом шаге выбирайте слои, все зависимости которых уже в результате.',
      'Из нескольких готовых к сборке берите первый по алфавиту.',
      'Повторяйте, пока не разберёте все слои.'
    ],
    tests: [
      {
        name: 'зависимость идёт раньше зависимого',
        code: `const simple = { client: ['config'], config: [] };
expect(buildOrder(simple)).toEqual(['config', 'client']);`
      },
      {
        name: 'цепочка из трёх слоёв',
        code: `const chain = { scenario: ['client'], client: ['config'], config: [] };
expect(buildOrder(chain)).toEqual(['config', 'client', 'scenario']);`
      },
      {
        name: 'независимые слои упорядочены по имени',
        code: `const flat = { ui: [], api: [], database: [] };
expect(buildOrder(flat)).toEqual(['api', 'database', 'ui']);`
      },
      {
        name: 'ветвление: общий слой строится один раз',
        code: `const branching = {
  crossLayer: ['api', 'database'],
  api: ['config'],
  database: ['config'],
  config: []
};
expect(buildOrder(branching)).toEqual(['config', 'api', 'database', 'crossLayer']);`
      }
    ],
    solution: `function buildOrder(deps) {
  const order = [];
  const remaining = new Set(Object.keys(deps));

  while (remaining.size > 0) {
    const ready = [...remaining]
      .filter(name => deps[name].every(dependency => order.includes(dependency)))
      .sort();

    if (ready.length === 0) break;

    for (const name of ready) {
      order.push(name);
      remaining.delete(name);
    }
  }

  return order;
}`
  },
  {
    id: 'fp-251-cycle-is-an-error',
    title: 'Цикл в графе — это отказ',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Дополните `buildOrder(deps)`: если слои зависят друг от друга по кругу, ' +
      'порядка не существует. В этом случае бросьте `Error`, в сообщении ' +
      'которого перечислены имена слоёв, попавших в цикл, — отсортированные и ' +
      'разделённые запятой с пробелом. Неизвестная зависимость (её нет среди ' +
      'ключей) — тоже ошибка: сообщение должно содержать её имя.',
    starter: `function buildOrder(deps) {
  const order = [];
  const remaining = new Set(Object.keys(deps));

  while (remaining.size > 0) {
    const ready = [...remaining]
      .filter(name => deps[name].every(dependency => order.includes(dependency)))
      .sort();

    // Если готовых к сборке нет, а слои остались — порядка не существует.
    if (ready.length === 0) break;

    for (const name of ready) {
      order.push(name);
      remaining.delete(name);
    }
  }

  return order;
}`,
    hints: [
      'Сначала проверьте, что каждая зависимость есть среди ключей.',
      'Если готовых к сборке слоёв нет, а неразобранные остались — это цикл.',
      'В сообщение об ошибке попадают именно оставшиеся слои.'
    ],
    tests: [
      {
        name: 'корректный граф по-прежнему упорядочивается',
        code: `const ok = { client: ['config'], config: [] };
expect(buildOrder(ok)).toEqual(['config', 'client']);`
      },
      {
        name: 'цикл из двух слоёв даёт ошибку с их именами',
        code: `const pair = { a: ['b'], b: ['a'] };
expect(() => buildOrder(pair)).toThrow('a, b');`
      },
      {
        name: 'цикл не мешает сообщить о нём при большом графе',
        code: `const mixed = { config: [], left: ['right'], right: ['left'] };
expect(() => buildOrder(mixed)).toThrow('left, right');`
      },
      {
        name: 'неизвестная зависимость названа в сообщении',
        code: `const unknown = { client: ['secrets'] };
expect(() => buildOrder(unknown)).toThrow('secrets');`
      }
    ],
    solution: `function buildOrder(deps) {
  const names = Object.keys(deps);

  for (const name of names) {
    for (const dependency of deps[name]) {
      if (!names.includes(dependency)) {
        throw new Error('неизвестная зависимость: ' + dependency);
      }
    }
  }

  const order = [];
  const remaining = new Set(names);

  while (remaining.size > 0) {
    const ready = [...remaining]
      .filter(name => deps[name].every(dependency => order.includes(dependency)))
      .sort();

    if (ready.length === 0) {
      throw new Error('цикл в зависимостях: ' + [...remaining].sort().join(', '));
    }

    for (const name of ready) {
      order.push(name);
      remaining.delete(name);
    }
  }

  return order;
}`
  }
];
