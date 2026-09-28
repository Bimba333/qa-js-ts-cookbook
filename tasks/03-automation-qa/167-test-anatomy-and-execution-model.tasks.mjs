export default [
  {
    id: 'qa-167-missing-await',
    title: 'Пропущенное ожидание',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Тело теста — асинхронная функция, и незавершённая операция в ней ' +
      'остаётся незамеченной. Напишите асинхронную функцию ' +
      '`runTest(body)`, которая вызывает `body(track)` и возвращает ' +
      '`{ status, pending }`. `track` получает промис, регистрирует его и ' +
      'возвращает обратно. После завершения тела посчитайте, сколько ' +
      'зарегистрированных промисов ещё не завершилось: это и есть `pending`. ' +
      'Если тело бросило ошибку, `status` — `упал`, иначе `пройден`. ' +
      'Незавершённые промисы тест не валят, но должны быть видны.',
    starter: `async function runTest(body) {
  // Состояние промиса проверяется гонкой с уже готовым значением.

  return { status: 'пройден', pending: 0 };
}`,
    hints: [
      'Узнать, завершился ли промис, можно `Promise.race` с уже разрешённым маркером.',
      'Проверять состояние нужно после того, как тело вернуло управление, а не во время регистрации.',
      'У каждого зарегистрированного промиса должен быть обработчик отклонения, иначе отказ уйдёт в пустоту.'
    ],
    tests: [
      {
        name: 'дождавшийся тест не оставляет хвостов',
        code: `expect(await runTest(async track => {
  await track(Promise.resolve('готово'));
})).toEqual({ status: 'пройден', pending: 0 });`
      },
      {
        name: 'пропущенное ожидание видно',
        code: `const leaked = await runTest(track => {
  track(new Promise(resolve => setTimeout(resolve, 50)));
});
expect(leaked).toEqual({ status: 'пройден', pending: 1 });`
      },
      {
        name: 'несколько незавершённых операций',
        code: `const many = await runTest(track => {
  track(new Promise(resolve => setTimeout(resolve, 50)));
  track(new Promise(resolve => setTimeout(resolve, 50)));
  track(Promise.resolve('быстрый'));
});
expect(many.pending).toBe(2);`
      },
      {
        name: 'падение тела отмечается',
        code: `const failed = await runTest(() => { throw new Error('проверка не прошла'); });
expect(failed.status).toBe('упал');`
      },
      {
        name: 'отклонённый промис не роняет прогон',
        code: `const rejected = await runTest(track => {
  track(Promise.reject(new Error('сетевой сбой')));
});
expect(rejected.status).toBe('пройден');`
      },
      {
        name: 'тело без операций',
        code: `expect(await runTest(() => {})).toEqual({ status: 'пройден', pending: 0 });`
      }
    ],
    solution: `async function runTest(body) {
  const tracked = [];

  function track(promise) {
    // Обработчик отклонения нужен сразу: иначе отказ останется без присмотра.
    const settled = Promise.resolve(promise).then(
      () => true,
      () => true
    );

    tracked.push(settled);

    return promise;
  }

  let status = 'пройден';

  try {
    await body(track);
  } catch {
    status = 'упал';
  }

  const marker = Symbol('ожидает');
  const states = await Promise.all(
    tracked.map(promise => Promise.race([promise, Promise.resolve(marker)]))
  );

  return { status, pending: states.filter(state => state === marker).length };
}`
  }
]
