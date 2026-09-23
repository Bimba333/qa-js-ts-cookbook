export default [
  {
    id: 'js-78-await-sequence',
    title: 'Последовательные шаги через await',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `runInOrder(steps)`, которая принимает массив функций, ' +
      'возвращающих промисы, выполняет их **по очереди** и возвращает массив ' +
      'результатов в том же порядке. Следующий шаг начинается только после ' +
      'завершения предыдущего.',
    starter: `async function runInOrder(steps) {
  // Каждый шаг должен дождаться предыдущего.
}`,
    hints: [
      'Последовательность создаёт расположение await, а не сам язык.',
      'Промисы нельзя создавать заранее все сразу — иначе они начнут выполняться параллельно.',
      'Собирать результаты удобно в обычный массив.'
    ],
    tests: [
      {
        name: 'возвращает результаты в порядке шагов',
        code: `expect(await runInOrder([
  () => Promise.resolve('a'),
  () => Promise.resolve('b')
])).toEqual(['a', 'b']);`
      },
      {
        name: 'шаги выполняются последовательно',
        code: `const order = [];
await runInOrder([
  async () => { order.push('начало 1'); order.push('конец 1'); },
  async () => { order.push('начало 2'); order.push('конец 2'); }
]);
expect(order).toEqual(['начало 1', 'конец 1', 'начало 2', 'конец 2']);`
      },
      {
        name: 'для пустого списка возвращает пустой массив',
        code: `expect(await runInOrder([])).toEqual([]);`
      },
      {
        name: 'возвращает промис',
        code: `expect(runInOrder([]) instanceof Promise).toBe(true);`
      }
    ],
    solution: `async function runInOrder(steps) {
  const results = [];

  for (const step of steps) {
    results.push(await step());
  }

  return results;
}`
  },

  {
    id: 'js-78-catch-needs-await',
    title: 'Перехват ошибки асинхронной операции',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `safeRun(operation)`, которая вызывает асинхронную функцию ' +
      '`operation` и возвращает объект `{ ok: true, value }` при успехе или ' +
      '`{ ok: false, message }` при ошибке. Ошибка должна быть перехвачена внутри ' +
      'функции, а не уходить наружу.',
    starter: `async function safeRun(operation) {
  try {
    // Без await ошибка не попадёт в catch.
  } catch (error) {
    // Верните описание ошибки.
  }
}`,
    hints: [
      'Без await вызов вернёт отклонённый промис, и catch не сработает.',
      'В блоке try перед возвратом промиса await обязателен.',
      'В message передавайте текст ошибки, а не сам объект.'
    ],
    tests: [
      {
        name: 'успешный случай',
        code: `expect(await safeRun(async () => 42)).toEqual({ ok: true, value: 42 });`
      },
      {
        name: 'ошибка перехвачена',
        code: `expect(await safeRun(async () => { throw new Error('упало'); }))
  .toEqual({ ok: false, message: 'упало' });`
      },
      {
        name: 'наружу ошибка не уходит',
        code: `let escaped = false;
try { await safeRun(async () => { throw new Error('упало'); }); }
catch (error) { escaped = true; }
expect(escaped).toBe(false);`
      },
      {
        name: 'работает с функцией, возвращающей промис',
        code: `expect(await safeRun(() => Promise.resolve('ok'))).toEqual({ ok: true, value: 'ok' });`
      }
    ],
    solution: `async function safeRun(operation) {
  try {
    const value = await operation();

    return { ok: true, value };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}`
  }
]
