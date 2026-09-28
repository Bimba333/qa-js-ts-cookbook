export default [
  {
    id: 'js-85-module-registry',
    title: 'Модуль вычисляется один раз',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Смоделируйте загрузку модулей. Функция `createRegistry(definitions)` ' +
      'получает объект `{ имя: функция }`, где функция возвращает экспорт ' +
      'модуля и может принимать `require` для своих зависимостей. Возвращённый ' +
      'объект имеет методы `require(name)` и `evaluations()`. Каждый модуль ' +
      'вычисляется **не более одного раза**, дальше отдаётся сохранённый ' +
      'результат. `evaluations()` возвращает имена в порядке первого вычисления. ' +
      'Неизвестное имя даёт `Error` с сообщением `модуль не найден`.',
    starter: `function createRegistry(definitions) {
  // Результат первого вычисления нужно запомнить.

  return {
    require(name) {},
    evaluations() { return []; }
  };
}`,
    hints: [
      'Разделяйте «модуль ещё не вычислялся» и «модуль вернул `undefined`»: первое проверяется наличием ключа в кеше.',
      'Функция модуля получает `require` — тот же самый, чтобы её зависимости тоже кешировались.',
      'Порядок вычислений задаётся тем, кого запросили первым, а не порядком ключей в определениях.'
    ],
    tests: [
      {
        name: 'модуль отдаёт свой экспорт',
        code: `const registry = createRegistry({ config: () => ({ env: 'local' }) });
expect(registry.require('config')).toEqual({ env: 'local' });`
      },
      {
        name: 'повторный запрос не вычисляет заново',
        code: `let calls = 0;
const cached = createRegistry({ config: () => { calls += 1; return calls; } });
cached.require('config');
cached.require('config');
expect(calls).toBe(1);`
      },
      {
        name: 'оба запроса получают один и тот же объект',
        code: `const shared = createRegistry({ state: () => ({}) });
expect(shared.require('state') === shared.require('state')).toBe(true);`
      },
      {
        name: 'зависимости тоже кешируются',
        code: `let configCalls = 0;
const graph = createRegistry({
  config: () => { configCalls += 1; return { retries: 2 }; },
  client: require => ({ retries: require('config').retries }),
  reporter: require => ({ retries: require('config').retries })
});
graph.require('client');
graph.require('reporter');
expect(configCalls).toBe(1);`
      },
      {
        name: 'порядок вычислений отражает запросы',
        code: `const ordered = createRegistry({
  a: () => 'a',
  b: require => require('a') + 'b'
});
ordered.require('b');
expect(ordered.evaluations()).toEqual(['b', 'a']);`
      },
      {
        name: 'неизвестное имя даёт ошибку',
        code: `const empty = createRegistry({});
expect(() => empty.require('нет')).toThrow('модуль не найден');`
      },
      {
        name: 'модуль со значением `undefined` не вычисляется дважды',
        code: `let emptyCalls = 0;
const silent = createRegistry({ nothing: () => { emptyCalls += 1; } });
silent.require('nothing');
silent.require('nothing');
expect(emptyCalls).toBe(1);`
      }
    ],
    solution: `function createRegistry(definitions) {
  const cache = new Map();
  const order = [];

  function require(name) {
    if (cache.has(name)) return cache.get(name);
    if (!Object.hasOwn(definitions, name)) throw new Error('модуль не найден');

    order.push(name);
    const value = definitions[name](require);
    cache.set(name, value);

    return value;
  }

  return {
    require,
    evaluations() {
      return [...order];
    }
  };
}`
  }
]
