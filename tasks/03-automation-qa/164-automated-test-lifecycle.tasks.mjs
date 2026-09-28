export default [
  {
    id: 'qa-164-lifecycle-stages',
    title: 'Нормальный и аварийный путь теста',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите асинхронную функцию `runLifecycle(stages)`, где `stages` — ' +
      'объект с функциями `setup`, `body`, `verify`, `diagnose`, `cleanup`; ' +
      'любая может отсутствовать. Порядок обычного пути: подготовка → тело → ' +
      'проверка. Если любой из этих шагов бросил ошибку, дальнейшие шаги ' +
      'обычного пути пропускаются и вызывается `diagnose(error)`. `cleanup` ' +
      'выполняется всегда. Верните ' +
      '`{ status, executed, error }`: `пройден` или `упал`, список выполненных ' +
      'шагов по порядку и сообщение исходной ошибки либо `null`. Ошибка ' +
      'внутри `cleanup` не должна подменять исходную.',
    starter: `async function runLifecycle(stages) {
  // Очистка выполняется при любом исходе, а диагностика — только при падении.

  return { status: 'пройден', executed: [], error: null };
}`,
    hints: [
      'Обычный путь удобно выполнить в `try`, а очистку — в `finally`.',
      'Диагностика запускается только при падении и получает исходную ошибку.',
      'Если очистка тоже упала, исходную ошибку терять нельзя: она сообщает, что именно сломалось в сценарии.'
    ],
    tests: [
      {
        name: 'обычный путь проходит полностью',
        code: `const order = [];
const result = await runLifecycle({
  setup: () => order.push('setup'),
  body: () => order.push('body'),
  verify: () => order.push('verify'),
  cleanup: () => order.push('cleanup')
});
expect(result.status).toBe('пройден');
expect(result.executed).toEqual(['setup', 'body', 'verify', 'cleanup']);
expect(result.error).toBe(null);`
      },
      {
        name: 'падение тела пропускает проверку',
        code: `const failed = await runLifecycle({
  setup: () => {},
  body: () => { throw new Error('шаг упал'); },
  verify: () => {},
  diagnose: () => {},
  cleanup: () => {}
});
expect(failed.status).toBe('упал');
expect(failed.executed).toEqual(['setup', 'body', 'diagnose', 'cleanup']);
expect(failed.error).toBe('шаг упал');`
      },
      {
        name: 'падение подготовки не запускает тело',
        code: `const early = await runLifecycle({
  setup: () => { throw new Error('подготовка упала'); },
  body: () => {},
  diagnose: () => {},
  cleanup: () => {}
});
expect(early.executed).toEqual(['setup', 'diagnose', 'cleanup']);
expect(early.error).toBe('подготовка упала');`
      },
      {
        name: 'отсутствующие шаги пропускаются',
        code: `const partial = await runLifecycle({ body: () => {} });
expect(partial.executed).toEqual(['body']);
expect(partial.status).toBe('пройден');`
      },
      {
        name: 'диагностика не запускается на успешном пути',
        code: `let diagnosed = false;
await runLifecycle({ body: () => {}, diagnose: () => { diagnosed = true; } });
expect(diagnosed).toBe(false);`
      },
      {
        name: 'ошибка очистки не подменяет исходную',
        code: `const both = await runLifecycle({
  body: () => { throw new Error('исходная'); },
  cleanup: () => { throw new Error('очистка'); }
});
expect(both.error).toBe('исходная');
expect(both.status).toBe('упал');`
      },
      {
        name: 'асинхронные шаги дожидаются',
        code: `const slow = await runLifecycle({
  body: async () => { await Promise.resolve(); },
  verify: async () => { await Promise.resolve(); }
});
expect(slow.executed).toEqual(['body', 'verify']);`
      }
    ],
    solution: `async function runLifecycle(stages) {
  const executed = [];
  let error = null;

  async function step(name, argument) {
    if (typeof stages[name] !== 'function') return;

    executed.push(name);
    await stages[name](argument);
  }

  try {
    await step('setup');
    await step('body');
    await step('verify');
  } catch (thrown) {
    error = thrown.message;

    try {
      await step('diagnose', thrown);
    } catch {
      // Диагностика не должна подменять причину падения.
    }
  } finally {
    try {
      await step('cleanup');
    } catch {
      // Очистка сообщает о своей беде, но исходная ошибка важнее.
    }
  }

  return { status: error === null ? 'пройден' : 'упал', executed, error };
}`
  }
]
