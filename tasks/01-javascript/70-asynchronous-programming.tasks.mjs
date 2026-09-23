export default [
  {
    id: 'js-70-start-and-finish',
    title: 'Запуск и завершение — разные моменты',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `startOperation(delayMs)` — функцию, которая **сразу** ' +
      'возвращает объект `{ started, promise }`, где `started` — признак того, ' +
      'что операция запущена, а `promise` разрешается значением `готово` через ' +
      'указанную задержку. Напишите `runBoth(delayMs)`, возвращающую промис с ' +
      '`{ order, result }`: порядок записей и значение из промиса. ' +
      'Записи: `запущено` сразу после вызова `startOperation`, `после запуска` ' +
      'следующей строкой, `завершено` — в обработчике промиса.',
    starter: `function startOperation(delayMs) {
  return { started: false, promise: Promise.resolve('') };
}

function runBoth(delayMs) {
  return Promise.resolve({ order: [], result: '' });
}`,
    hints: [
      'Асинхронная операция возвращает управление до своего завершения.',
      'Результат нельзя вернуть обычным значением — только промисом.',
      'Запись «завершено» появляется после обеих синхронных записей.'
    ],
    tests: [
      {
        name: 'операция сообщает о запуске сразу',
        code: `expect(startOperation(5).started).toBe(true);`
      },
      {
        name: 'значение приходит позже',
        code: `expect(await startOperation(5).promise).toBe('готово');`
      },
      {
        name: 'синхронные записи идут первыми',
        code: `const run = await runBoth(5);
expect(run.order).toEqual(['запущено', 'после запуска', 'завершено']);`
      },
      {
        name: 'результат доходит до вызывающего кода',
        code: `expect((await runBoth(5)).result).toBe('готово');`
      },
      {
        name: 'нулевая задержка ничего не меняет в порядке',
        code: `expect((await runBoth(0)).order).toEqual(['запущено', 'после запуска', 'завершено']);`
      },
      {
        name: 'порядок воспроизводится',
        code: `const first = await runBoth(1);
const second = await runBoth(1);
expect(second.order).toEqual(first.order);`
      }
    ],
    solution: `function startOperation(delayMs) {
  const promise = new Promise(resolve => {
    setTimeout(() => resolve('готово'), delayMs);
  });

  return { started: true, promise };
}

function runBoth(delayMs) {
  const order = [];

  const operation = startOperation(delayMs);
  order.push('запущено');
  order.push('после запуска');

  return operation.promise.then(result => {
    order.push('завершено');

    return { order, result };
  });
}`
  }
]
