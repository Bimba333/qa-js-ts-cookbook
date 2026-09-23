export default [
  {
    id: 'qa-174-hook-order',
    title: 'Порядок хуков и падение теста',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `runSuite(suite)` — крошечный исполнитель. `suite` содержит ' +
      '`beforeAll`, `beforeEach`, `afterEach`, `afterAll` (любой может ' +
      'отсутствовать) и массив `tests` вида `{ name, fn }`. Порядок: `beforeAll` ' +
      'один раз, затем для каждого теста `beforeEach` → тест → `afterEach`, ' +
      'в конце `afterAll`. `afterEach` и `afterAll` выполняются **даже если** ' +
      'тест или `beforeEach` бросили ошибку. Верните ' +
      '`{ results, log }`: массив `{ name, status }` (`passed` или `failed`) и ' +
      'журнал вызовов — имена хуков и тестов в порядке выполнения. ' +
      'Если упал `beforeAll`, тесты не запускаются, но `afterAll` выполняется.',
    starter: `async function runSuite(suite) {
  // Уборка обязана выполниться даже после падения.

  return { results: [], log: [] };
}`,
    hints: [
      'Журнал удобно пополнять в самом исполнителе, а не в хуках.',
      'Падение теста не должно прерывать оставшиеся тесты.',
      'finally гарантирует попытку уборки.'
    ],
    tests: [
      {
        name: 'порядок вызовов при успехе',
        code: `const trace = [];
const suite = {
  beforeAll: () => {},
  beforeEach: () => {},
  afterEach: () => {},
  afterAll: () => {},
  tests: [{ name: 'первый', fn: () => {} }, { name: 'второй', fn: () => {} }]
};
const run = await runSuite(suite);
expect(run.log).toEqual([
  'beforeAll',
  'beforeEach', 'первый', 'afterEach',
  'beforeEach', 'второй', 'afterEach',
  'afterAll'
]);`
      },
      {
        name: 'все тесты отмечены пройденными',
        code: `const passing = await runSuite({
  tests: [{ name: 'a', fn: () => {} }, { name: 'b', fn: () => {} }]
});
expect(passing.results).toEqual([
  { name: 'a', status: 'passed' },
  { name: 'b', status: 'passed' }
]);`
      },
      {
        name: 'падение теста не отменяет уборку',
        code: `const failing = await runSuite({
  afterEach: () => {},
  tests: [{ name: 'падает', fn: () => { throw new Error('упал'); } }]
});
expect(failing.results).toEqual([{ name: 'падает', status: 'failed' }]);
expect(failing.log).toEqual(['падает', 'afterEach']);`
      },
      {
        name: 'падение одного теста не мешает следующему',
        code: `const mixed = await runSuite({
  tests: [
    { name: 'падает', fn: () => { throw new Error('упал'); } },
    { name: 'проходит', fn: () => {} }
  ]
});
expect(mixed.results.map(item => item.status)).toEqual(['failed', 'passed']);`
      },
      {
        name: 'падение beforeEach помечает тест упавшим',
        code: `const broken = await runSuite({
  beforeEach: () => { throw new Error('подготовка не удалась'); },
  afterEach: () => {},
  tests: [{ name: 'тест', fn: () => {} }]
});
expect(broken.results).toEqual([{ name: 'тест', status: 'failed' }]);
expect(broken.log).toEqual(['beforeEach', 'afterEach']);`
      },
      {
        name: 'падение beforeAll отменяет тесты, но не afterAll',
        code: `const noRun = await runSuite({
  beforeAll: () => { throw new Error('общая подготовка не удалась'); },
  afterAll: () => {},
  tests: [{ name: 'тест', fn: () => {} }]
});
expect(noRun.results).toEqual([]);
expect(noRun.log).toEqual(['beforeAll', 'afterAll']);`
      },
      {
        name: 'асинхронные хуки дожидаются',
        code: `const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const async = await runSuite({
  beforeEach: async () => { await delay(5); },
  tests: [{ name: 'тест', fn: async () => { await delay(5); } }]
});
expect(async.log).toEqual(['beforeEach', 'тест']);`
      }
    ],
    solution: `async function runSuite(suite) {
  const log = [];
  const results = [];

  const callHook = async name => {
    const hook = suite[name];

    if (hook === undefined) return true;

    log.push(name);

    try {
      await hook();

      return true;
    } catch {
      return false;
    }
  };

  const prepared = await callHook('beforeAll');

  if (prepared) {
    for (const test of suite.tests) {
      let status = 'passed';

      try {
        const ready = await callHook('beforeEach');

        if (!ready) {
          status = 'failed';
        } else {
          log.push(test.name);
          await test.fn();
        }
      } catch {
        status = 'failed';
      } finally {
        await callHook('afterEach');
      }

      results.push({ name: test.name, status });
    }
  }

  await callHook('afterAll');

  return { results, log };
}`
  }
]
