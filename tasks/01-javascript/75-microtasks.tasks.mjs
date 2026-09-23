export default [
  {
    id: 'js-75-microtask-order',
    title: 'Микрозадачи идут раньше таймеров',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `collectOrder()`, которая возвращает промис с массивом строк — ' +
      'порядком выполнения. Запланируйте в таком порядке: синхронную запись ' +
      '`синхронно`; `setTimeout` с записью `таймер`; ' +
      '`Promise.resolve().then` с записью `промис`; ' +
      '`queueMicrotask` с записью `микрозадача`; ещё одну синхронную запись ' +
      '`синхронно 2`. Дождитесь завершения всех запланированных записей и ' +
      'верните журнал.',
    starter: `function collectOrder() {
  const log = [];

  // Планируйте записи в порядке из условия, а не в порядке выполнения.

  return Promise.resolve(log);
}`,
    hints: [
      'Синхронный код выполняется целиком до любых отложенных записей.',
      'Очередь микрозадач опустошается перед следующей макрозадачей.',
      'Дождаться таймера можно промисом, который разрешается в его колбэке.'
    ],
    tests: [
      {
        name: 'синхронные записи идут первыми',
        code: `const order = await collectOrder();
expect(order.slice(0, 2)).toEqual(['синхронно', 'синхронно 2']);`
      },
      {
        name: 'микрозадачи идут после синхронного кода',
        code: `const order = await collectOrder();
expect(order.slice(2, 4)).toEqual(['промис', 'микрозадача']);`
      },
      {
        name: 'таймер выполняется последним',
        code: `const order = await collectOrder();
expect(order[order.length - 1]).toBe('таймер');`
      },
      {
        name: 'журнал содержит все пять записей',
        code: `const order = await collectOrder();
expect(order).toHaveLength(5);`
      },
      {
        name: 'порядок воспроизводится',
        code: `const first = await collectOrder();
const second = await collectOrder();
expect(second).toEqual(first);`
      },
      {
        name: 'полный порядок',
        code: `expect(await collectOrder()).toEqual([
  'синхронно', 'синхронно 2', 'промис', 'микрозадача', 'таймер'
]);`
      }
    ],
    solution: `function collectOrder() {
  const log = [];

  return new Promise(resolve => {
    log.push('синхронно');

    setTimeout(() => {
      log.push('таймер');
      resolve(log);
    }, 0);

    Promise.resolve().then(() => {
      log.push('промис');
    });

    queueMicrotask(() => {
      log.push('микрозадача');
    });

    log.push('синхронно 2');
  });
}`
  }
]
