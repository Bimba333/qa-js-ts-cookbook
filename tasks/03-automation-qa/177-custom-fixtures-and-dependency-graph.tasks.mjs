export default [
  {
    id: 'qa-177-resolve-fixtures',
    title: 'Граф зависимостей фикстур',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `buildFixtures(definitions)` — разрешение графа фикстур. ' +
      '`definitions` — объект, где значение — `{ deps, create }`: список имён ' +
      'зависимостей и функция, получающая объект уже созданных зависимостей. ' +
      'Функция возвращает `resolve(name)`, которая создаёт фикстуру и всё, от ' +
      'чего она зависит. Каждая фикстура создаётся **один раз** за жизнь ' +
      '`buildFixtures`. Неизвестная зависимость — ошибка ' +
      '`неизвестная фикстура: <имя>`, цикл — ошибка `цикл зависимостей: <имя>`.',
    starter: `function buildFixtures(definitions) {
  return {
    async resolve(name) { return null; }
  };
}`,
    hints: [
      'Созданные значения нужно запоминать, иначе фикстура создастся дважды.',
      'Цикл обнаруживается по имени, которое уже находится в процессе создания.',
      'Зависимости создаются до самой фикстуры.'
    ],
    tests: [
      {
        name: 'фикстура без зависимостей',
        code: `const fixtures = buildFixtures({
  config: { deps: [], create: () => ({ baseUrl: 'http://x' }) }
});
expect((await fixtures.resolve('config')).baseUrl).toBe('http://x');`
      },
      {
        name: 'зависимости создаются раньше',
        code: `const order = [];
const graph = buildFixtures({
  config: { deps: [], create: () => { order.push('config'); return { retries: 1 }; } },
  client: { deps: ['config'], create: ({ config }) => { order.push('client'); return { retries: config.retries }; } }
});
const client = await graph.resolve('client');
expect(order).toEqual(['config', 'client']);
expect(client.retries).toBe(1);`
      },
      {
        name: 'общая зависимость создаётся один раз',
        code: `let made = 0;
const shared = buildFixtures({
  config: { deps: [], create: () => { made += 1; return {}; } },
  a: { deps: ['config'], create: () => 'a' },
  b: { deps: ['config'], create: () => 'b' }
});
await shared.resolve('a');
await shared.resolve('b');
expect(made).toBe(1);`
      },
      {
        name: 'повторный resolve возвращает то же значение',
        code: `const stable = buildFixtures({ page: { deps: [], create: () => ({}) } });
expect(await stable.resolve('page')).toBe(await stable.resolve('page'));`
      },
      {
        name: 'неизвестная зависимость отвергается',
        code: `const broken = buildFixtures({ a: { deps: ['нет'], create: () => 1 } });
let message = '';
try { await broken.resolve('a'); } catch (error) { message = error.message; }
expect(message).toBe('неизвестная фикстура: нет');`
      },
      {
        name: 'цикл обнаруживается',
        code: `const cyclic = buildFixtures({
  a: { deps: ['b'], create: () => 1 },
  b: { deps: ['a'], create: () => 2 }
});
let cycleMessage = '';
try { await cyclic.resolve('a'); } catch (error) { cycleMessage = error.message; }
expect(cycleMessage).toBe('цикл зависимостей: a');`
      },
      {
        name: 'асинхронное создание дожидается',
        code: `const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const async = buildFixtures({
  slow: { deps: [], create: async () => { await delay(5); return 'готово'; } },
  user: { deps: ['slow'], create: ({ slow }) => slow + '!' }
});
expect(await async.resolve('user')).toBe('готово!');`
      }
    ],
    solution: `function buildFixtures(definitions) {
  const created = new Map();
  const inProgress = new Set();

  const resolve = async name => {
    if (created.has(name)) {
      return created.get(name);
    }

    const definition = definitions[name];

    if (definition === undefined) {
      throw new Error('неизвестная фикстура: ' + name);
    }

    if (inProgress.has(name)) {
      throw new Error('цикл зависимостей: ' + name);
    }

    inProgress.add(name);

    try {
      const dependencies = {};

      for (const dependency of definition.deps) {
        dependencies[dependency] = await resolve(dependency);
      }

      const value = await definition.create(dependencies);
      created.set(name, value);

      return value;
    } finally {
      inProgress.delete(name);
    }
  };

  return { resolve };
}`
  }
]
