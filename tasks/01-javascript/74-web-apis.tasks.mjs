export default [
  {
    id: 'js-74-environment-does-the-waiting',
    title: 'Ждёт среда, а не ваш код',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `scheduleAll(delays)` — планирует по таймеру на каждую задержку ' +
      'из массива и возвращает промис с объектом ' +
      '`{ order, returnedBeforeAny, elapsedMs }`: порядок сработавших задержек, ' +
      'признак того, что функция вернула управление **до** срабатывания любого ' +
      'таймера, и общее время ожидания. Все таймеры планируются сразу, а не ' +
      'один за другим, поэтому общее время близко к самой большой задержке, ' +
      'а не к их сумме.',
    starter: `function scheduleAll(delays) {
  // Таймеры ведёт среда выполнения: планирование не блокирует код.

  return Promise.resolve({ order: [], returnedBeforeAny: false, elapsedMs: 0 });
}`,
    hints: [
      'Признак «вернулись раньше» можно установить сразу после планирования.',
      'Промис разрешается, когда сработал последний таймер.',
      'Порядок определяется величиной задержки, а не порядком планирования.'
    ],
    tests: [
      {
        name: 'порядок определяется задержкой',
        code: `const result = await scheduleAll([30, 0, 10]);
expect(result.order).toEqual([0, 10, 30]);`
      },
      {
        name: 'управление возвращается до срабатывания таймеров',
        code: `expect((await scheduleAll([10])).returnedBeforeAny).toBe(true);`
      },
      {
        name: 'ожидание идёт параллельно, а не подряд',
        code: `const result = await scheduleAll([30, 30, 30]);
expect(result.elapsedMs < 90).toBe(true);`
      },
      {
        name: 'сработали все таймеры',
        code: `expect((await scheduleAll([0, 5, 10])).order).toHaveLength(3);`
      },
      {
        name: 'пустой список задержек',
        code: `const result = await scheduleAll([]);
expect(result.order).toEqual([]);`
      },
      {
        name: 'одинаковые задержки сохраняют порядок планирования',
        code: `expect((await scheduleAll([5, 5])).order).toEqual([5, 5]);`
      }
    ],
    solution: `function scheduleAll(delays) {
  const order = [];
  const startedAt = Date.now();
  let returnedBeforeAny = false;

  const scheduled = delays.map(delay => new Promise(resolve => {
    setTimeout(() => {
      order.push(delay);
      resolve();
    }, delay);
  }));

  // Планирование завершилось, а ни один таймер ещё не сработал.
  returnedBeforeAny = order.length === 0;

  return Promise.all(scheduled).then(() => ({
    order,
    returnedBeforeAny,
    elapsedMs: Date.now() - startedAt
  }));
}`
  }
]
