export default [
  {
    id: 'js-76-timer-order',
    title: 'Порядок таймеров и вложенный таймер',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `timerOrder()`, возвращающую промис с массивом записей. ' +
      'Запланируйте: `setTimeout` на 10 мс с записью `поздний`; ' +
      '`setTimeout` на 0 мс с записью `ранний`; внутри раннего таймера — ещё ' +
      'один `setTimeout` на 0 мс с записью `вложенный`; и микрозадачу с записью ' +
      '`микрозадача`. Промис разрешается, когда выполнены все четыре записи.',
    starter: `function timerOrder() {
  const log = [];

  return Promise.resolve(log);
}`,
    hints: [
      'Между двумя макрозадачами очередь микрозадач опустошается полностью.',
      'Таймер, запланированный внутри таймера, попадёт в очередь позже.',
      'Разрешать промис нужно после последней записи, а не после первой.'
    ],
    tests: [
      {
        name: 'микрозадача выполняется раньше любого таймера',
        code: `expect((await timerOrder())[0]).toBe('микрозадача');`
      },
      {
        name: 'нулевой таймер раньше десятимиллисекундного',
        code: `const order = await timerOrder();
expect(order.indexOf('ранний') < order.indexOf('поздний')).toBe(true);`
      },
      {
        name: 'вложенный таймер выполняется после раннего',
        code: `const order = await timerOrder();
expect(order.indexOf('ранний') < order.indexOf('вложенный')).toBe(true);`
      },
      {
        name: 'записей ровно четыре',
        code: `expect(await timerOrder()).toHaveLength(4);`
      },
      {
        name: 'порядок воспроизводится',
        code: `const first = await timerOrder();
const second = await timerOrder();
expect(second).toEqual(first);`
      },
      {
        name: 'все записи на месте',
        code: `const order = await timerOrder();
for (const entry of ['микрозадача', 'ранний', 'вложенный', 'поздний']) {
  expect(order.includes(entry)).toBe(true);
}`
      }
    ],
    solution: `function timerOrder() {
  const log = [];

  return new Promise(resolve => {
    const done = () => {
      if (log.length === 4) {
        resolve(log);
      }
    };

    setTimeout(() => {
      log.push('поздний');
      done();
    }, 10);

    setTimeout(() => {
      log.push('ранний');

      setTimeout(() => {
        log.push('вложенный');
        done();
      }, 0);

      done();
    }, 0);

    queueMicrotask(() => {
      log.push('микрозадача');
      done();
    });
  });
}`
  }
]
