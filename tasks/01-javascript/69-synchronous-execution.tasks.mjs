export default [
  {
    id: 'js-69-blocking-delays-everything',
    title: 'Синхронная работа задерживает всё остальное',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `runBlocking()`, возвращающую промис с массивом записей. ' +
      'Внутри: запланируйте `setTimeout` на 0 мс с записью `таймер`; ' +
      'выполните синхронную работу, которая занимает не меньше 30 мс ' +
      '(цикл по времени), и запишите `работа завершена`; затем запишите ' +
      '`после работы`. Промис разрешается в колбэке таймера. ' +
      'Дополнительно верните `blockedMs` — измеренную длительность ' +
      'синхронной работы: массив и число возвращаются как ' +
      '`{ order, blockedMs }`.',
    starter: `function runBlocking() {
  const order = [];

  return Promise.resolve({ order, blockedMs: 0 });
}`,
    hints: [
      'Таймер не может выполниться, пока стек занят.',
      'Синхронная задержка — это цикл, а не ожидание промиса.',
      'Промис разрешается там же, где выполняется колбэк таймера.'
    ],
    tests: [
      {
        name: 'синхронные записи идут первыми',
        code: `const result = await runBlocking();
expect(result.order.slice(0, 2)).toEqual(['работа завершена', 'после работы']);`
      },
      {
        name: 'таймер выполняется последним',
        code: `const result = await runBlocking();
expect(result.order[result.order.length - 1]).toBe('таймер');`
      },
      {
        name: 'записей ровно три',
        code: `expect((await runBlocking()).order).toHaveLength(3);`
      },
      {
        name: 'работа действительно заняла время',
        code: `expect((await runBlocking()).blockedMs >= 30).toBe(true);`
      },
      {
        name: 'таймер был запланирован до работы, но выполнился после',
        code: `const result = await runBlocking();
expect(result.order.indexOf('таймер')).toBe(2);`
      },
      {
        name: 'порядок воспроизводится',
        code: `const first = await runBlocking();
const second = await runBlocking();
expect(second.order).toEqual(first.order);`
      }
    ],
    solution: `function runBlocking() {
  const order = [];
  let blockedMs = 0;

  return new Promise(resolve => {
    setTimeout(() => {
      order.push('таймер');
      resolve({ order, blockedMs });
    }, 0);

    const startedAt = Date.now();

    // Цикл занимает стек: до его конца ни один колбэк не выполнится.
    while (Date.now() - startedAt < 30) {
      // Синхронная работа.
    }

    blockedMs = Date.now() - startedAt;

    order.push('работа завершена');
    order.push('после работы');
  });
}`
  }
]
