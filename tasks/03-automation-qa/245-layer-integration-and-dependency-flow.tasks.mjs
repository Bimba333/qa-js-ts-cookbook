export default [
  {
    id: 'qa-245-composition-root',
    title: 'Сборка графа в одном месте',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `compose(definitions, requested)`, которая собирает ' +
      'объекты по их зависимостям. `definitions` — объект ' +
      '`{ имя: { needs: [имена], create: (deps) => значение } }`, где `deps` — ' +
      'объект уже созданных зависимостей. Возвращается объект только с ' +
      '`requested` именами. Каждое имя создаётся **не более одного раза**, ' +
      'даже если его запросили несколько потребителей. Неизвестное имя даёт ' +
      '`Error` с сообщением `нет определения`, цикл — `Error` с сообщением ' +
      '`циклическая зависимость`.',
    starter: `function compose(definitions, requested) {
  // Зависимости создаются раньше потребителей и переиспользуются.

  return {};
}`,
    hints: [
      'Порядок создания задаётся самим графом: перед вызовом `create` должны быть готовы все `needs`.',
      'Кеш созданных объектов одновременно обеспечивает единственность экземпляра.',
      'Цикл ловится множеством имён, которые сейчас находятся в процессе создания.'
    ],
    tests: [
      {
        name: 'объект без зависимостей',
        code: `expect(compose({ config: { needs: [], create: () => ({ env: 'local' }) } }, ['config']))
  .toEqual({ config: { env: 'local' } });`
      },
      {
        name: 'зависимость создаётся раньше потребителя',
        code: `const order = [];
compose({
  config: { needs: [], create: () => { order.push('config'); return 1; } },
  client: { needs: ['config'], create: () => { order.push('client'); return 2; } }
}, ['client']);
expect(order).toEqual(['config', 'client']);`
      },
      {
        name: 'зависимость передаётся в создатель',
        code: `expect(compose({
  config: { needs: [], create: () => ({ retries: 3 }) },
  client: { needs: ['config'], create: deps => ({ retries: deps.config.retries }) }
}, ['client'])).toEqual({ client: { retries: 3 } });`
      },
      {
        name: 'общая зависимость создаётся один раз',
        code: `let created = 0;
compose({
  config: { needs: [], create: () => { created += 1; return {}; } },
  api: { needs: ['config'], create: () => ({}) },
  db: { needs: ['config'], create: () => ({}) }
}, ['api', 'db']);
expect(created).toBe(1);`
      },
      {
        name: 'возвращаются только запрошенные имена',
        code: `expect(Object.keys(compose({
  config: { needs: [], create: () => 1 },
  client: { needs: ['config'], create: () => 2 }
}, ['client']))).toEqual(['client']);`
      },
      {
        name: 'неизвестное имя даёт ошибку',
        code: `expect(() => compose({}, ['нет'])).toThrow('нет определения');`
      },
      {
        name: 'цикл обнаруживается',
        code: `expect(() => compose({
  a: { needs: ['b'], create: () => 1 },
  b: { needs: ['a'], create: () => 2 }
}, ['a'])).toThrow('циклическая зависимость');`
      },
      {
        name: 'экземпляр один и тот же для всех потребителей',
        code: `const built = compose({
  config: { needs: [], create: () => ({}) },
  api: { needs: ['config'], create: deps => deps.config },
  db: { needs: ['config'], create: deps => deps.config }
}, ['api', 'db']);
expect(built.api === built.db).toBe(true);`
      }
    ],
    solution: `function compose(definitions, requested) {
  const built = new Map();
  const building = new Set();

  function resolve(name) {
    if (built.has(name)) return built.get(name);
    if (building.has(name)) throw new Error('циклическая зависимость');
    if (!Object.hasOwn(definitions, name)) throw new Error('нет определения');

    building.add(name);

    const definition = definitions[name];
    const deps = {};

    for (const need of definition.needs) deps[need] = resolve(need);

    const value = definition.create(deps);

    building.delete(name);
    built.set(name, value);

    return value;
  }

  const result = {};
  for (const name of requested) result[name] = resolve(name);

  return result;
}`
  }
]
