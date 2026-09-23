export default [
  {
    id: 'js-73-execution-order',
    title: 'Порядок выполнения очередей',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `collectOrder()`, которая возвращает промис с массивом ' +
      'строк в порядке их фактического выполнения. Внутри нужно добавить ' +
      '`"синхронно"` сразу, `"микрозадача"` через `queueMicrotask`, ' +
      '`"таймер"` через `setTimeout` с нулевой задержкой — и дождаться всех.',
    starter: `function collectOrder() {
  const order = [];

  // Добавьте три записи разными способами и дождитесь таймера.
}`,
    hints: [
      'Синхронная запись попадает в массив немедленно.',
      'Микрозадача выполняется после синхронного кода, но раньше таймера.',
      'Чтобы дождаться таймера, оберните его в промис и верните его.'
    ],
    tests: [
      {
        name: 'синхронная запись идёт первой',
        code: `const order = await collectOrder();
expect(order[0]).toBe('синхронно');`
      },
      {
        name: 'микрозадача выполняется раньше таймера',
        code: `const order = await collectOrder();
expect(order.indexOf('микрозадача') < order.indexOf('таймер')).toBe(true);`
      },
      {
        name: 'порядок полностью определён',
        code: `expect(await collectOrder()).toEqual(['синхронно', 'микрозадача', 'таймер']);`
      },
      {
        name: 'возвращает промис',
        code: `expect(collectOrder() instanceof Promise).toBe(true);`
      }
    ],
    solution: `function collectOrder() {
  const order = [];

  order.push('синхронно');
  queueMicrotask(() => order.push('микрозадача'));

  return new Promise((resolve) => {
    setTimeout(() => {
      order.push('таймер');
      resolve(order);
    }, 0);
  });
}`
  },

  {
    id: 'js-73-wait-for-condition',
    title: 'Ожидание условия вместо паузы',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `waitFor(read, timeoutMs)`, которая повторно вызывает ' +
      '`read()` и возвращает промис с первым истинным результатом. Первая проверка ' +
      'выполняется сразу, без начальной паузы. Если за `timeoutMs` условие не ' +
      'выполнилось, промис отклоняется ошибкой `условие не выполнено`.',
    starter: `async function waitFor(read, timeoutMs) {
  // Первая проверка идёт до любой паузы.
}`,
    hints: [
      'Проверку удобно делать в цикле с ограничением по времени.',
      'Между попытками нужна короткая асинхронная пауза, а не блокирующий цикл.',
      'Проверка «сразу» означает, что первый вызов read() происходит до первой паузы.'
    ],
    tests: [
      {
        name: 'возвращает готовое значение сразу',
        code: `expect(await waitFor(() => 'готово', 100)).toBe('готово');`
      },
      {
        name: 'первая проверка выполняется без паузы',
        code: `let calls = 0;
await waitFor(() => { calls += 1; return calls >= 1 ? 'ok' : null; }, 100);
expect(calls).toBe(1);`
      },
      {
        name: 'дожидается появления значения',
        code: `let calls = 0;
const value = await waitFor(() => { calls += 1; return calls >= 3 ? 'позже' : null; }, 500);
expect(value).toBe('позже');`
      },
      {
        name: 'отклоняется по истечении времени',
        code: `let message = '';
try { await waitFor(() => null, 50); } catch (error) { message = error.message; }
expect(message).toBe('условие не выполнено');`
      }
    ],
    solution: `async function waitFor(read, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (true) {
    const value = read();

    if (value) {
      return value;
    }

    if (Date.now() >= deadline) {
      throw new Error('условие не выполнено');
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}`
  }
]
