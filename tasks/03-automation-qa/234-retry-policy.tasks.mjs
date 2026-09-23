export default [
  {
    id: 'qa-234-retry-only-retriable',
    title: 'Повтор только там, где он уместен',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `runWithRetry(action, { attempts, isRetriable })` — функцию, ' +
      'которая вызывает асинхронное `action()` и повторяет вызов при ошибке, ' +
      'но только если `isRetriable(error)` вернул истину. Всего попыток не больше ' +
      '`attempts`. Верните `{ value, attempts }` при успехе. Если попытки ' +
      'исчерпаны или ошибка неповторяемая — бросьте **последнюю** ошибку, ' +
      'предварительно записав в её свойство `attempts` число выполненных попыток.',
    starter: `async function runWithRetry(action, options) {
  const { attempts, isRetriable } = options;

  // Неповторяемая ошибка должна выйти наружу сразу.

  return { value: undefined, attempts: 0 };
}`,
    hints: [
      'Счётчик увеличивается на каждый вызов action, а не на каждую паузу.',
      'Решение о повторе принимает isRetriable, а не сама функция.',
      'Последняя ошибка выбрасывается как есть, с добавленным полем attempts.'
    ],
    tests: [
      {
        name: 'успех с первой попытки',
        code: `const result = await runWithRetry(async () => 'ok', {
  attempts: 3,
  isRetriable: () => true
});
expect(result).toEqual({ value: 'ok', attempts: 1 });`
      },
      {
        name: 'повтор после повторяемой ошибки',
        code: `let calls = 0;
const flaky = async () => {
  calls += 1;
  if (calls < 3) throw new Error('сеть недоступна');
  return 'ok';
};
const retried = await runWithRetry(flaky, { attempts: 5, isRetriable: () => true });
expect(retried).toEqual({ value: 'ok', attempts: 3 });`
      },
      {
        name: 'неповторяемая ошибка не повторяется',
        code: `let hardCalls = 0;
const failing = async () => { hardCalls += 1; throw new Error('ожидалось 1, получено 2'); };
let caught = null;
try {
  await runWithRetry(failing, { attempts: 5, isRetriable: error => error.message === 'сеть недоступна' });
} catch (error) { caught = error; }
expect(hardCalls).toBe(1);
expect(caught.attempts).toBe(1);`
      },
      {
        name: 'попытки исчерпаны',
        code: `let exhaustedCalls = 0;
const always = async () => { exhaustedCalls += 1; throw new Error('сеть недоступна'); };
let exhaustedError = null;
try {
  await runWithRetry(always, { attempts: 3, isRetriable: () => true });
} catch (error) { exhaustedError = error; }
expect(exhaustedCalls).toBe(3);
expect(exhaustedError.message).toBe('сеть недоступна');
expect(exhaustedError.attempts).toBe(3);`
      },
      {
        name: 'одна попытка означает отсутствие повторов',
        code: `let singleCalls = 0;
const single = async () => { singleCalls += 1; throw new Error('сеть недоступна'); };
try { await runWithRetry(single, { attempts: 1, isRetriable: () => true }); } catch { /* ожидаемо */ }
expect(singleCalls).toBe(1);`
      },
      {
        name: 'возвращается результат действия, а не признак успеха',
        code: `const valued = await runWithRetry(async () => ({ id: 'WI-1' }), {
  attempts: 2,
  isRetriable: () => true
});
expect(valued.value.id).toBe('WI-1');`
      }
    ],
    solution: `async function runWithRetry(action, options) {
  const { attempts, isRetriable } = options;
  let made = 0;

  while (true) {
    made += 1;

    try {
      return { value: await action(), attempts: made };
    } catch (error) {
      const canRetry = isRetriable(error) && made < attempts;

      if (!canRetry) {
        error.attempts = made;
        throw error;
      }
    }
  }
}`
  }
]
