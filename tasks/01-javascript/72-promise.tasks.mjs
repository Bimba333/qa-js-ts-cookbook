export default [
  {
    id: 'js-72-resolve-status',
    title: 'Промис со статусом прогона',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `loadStatus(value)`, которая возвращает Promise. Если ' +
      '`value` равно `"failed"`, промис отклоняется ошибкой с сообщением ' +
      '`прогон упал`. В остальных случаях промис успешно завершается значением ' +
      '`{ status: value }`.',
    starter: `function loadStatus(value) {
  // Верните Promise, а не само значение.
}`,
    hints: [
      'Готовый промис можно получить через Promise.resolve и Promise.reject.',
      'Отклонённый промис принимает объект ошибки.',
      'Функция должна возвращать промис в обоих случаях.'
    ],
    tests: [
      {
        name: 'успешный случай возвращает значение',
        code: `const value = await loadStatus('passed');
expect(value).toEqual({ status: 'passed' });`
      },
      {
        name: 'возвращает именно промис',
        code: `expect(loadStatus('passed') instanceof Promise).toBe(true);`
      },
      {
        name: 'при failed промис отклоняется',
        code: `let message = '';
try { await loadStatus('failed'); } catch (error) { message = error.message; }
expect(message).toBe('прогон упал');`
      },
      {
        name: 'отклонение приходит объектом Error',
        code: `let isError = false;
try { await loadStatus('failed'); } catch (error) { isError = error instanceof Error; }
expect(isError).toBe(true);`
      }
    ],
    solution: `function loadStatus(value) {
  if (value === 'failed') {
    return Promise.reject(new Error('прогон упал'));
  }

  return Promise.resolve({ status: value });
}`
  },

  {
    id: 'js-72-chain-with-recovery',
    title: 'Цепочка с восстановлением после ошибки',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `statusOrDefault(promise)`, которая принимает промис и ' +
      'возвращает промис со строкой статуса. Если исходный промис успешен, вернуть ' +
      'его значение в верхнем регистре. Если отклонён — вернуть строку `unknown`. ' +
      'Решение постройте на `then()` и `catch()`.',
    starter: `function statusOrDefault(promise) {
  // catch() возвращает промис, и цепочка продолжается как успешная.
}`,
    hints: [
      'then() возвращает новый промис со значением обработчика.',
      'catch() тоже возвращает промис — его значение идёт дальше по цепочке.',
      'Возвращать нужно результат цепочки, а не исходный промис.'
    ],
    tests: [
      {
        name: 'успешное значение приводится к верхнему регистру',
        code: `expect(await statusOrDefault(Promise.resolve('passed'))).toBe('PASSED');`
      },
      {
        name: 'при отклонении возвращает unknown',
        code: `const rejected = Promise.reject(new Error('x'));
rejected.catch(() => {});
expect(await statusOrDefault(rejected)).toBe('unknown');`
      },
      {
        name: 'результат всегда успешный промис',
        code: `const source = Promise.reject(new Error('x'));
source.catch(() => {});
let failed = false;
try { await statusOrDefault(source); }
catch (error) { failed = true; }
expect(failed).toBe(false);`
      },
      {
        name: 'возвращает промис',
        code: `expect(statusOrDefault(Promise.resolve('passed')) instanceof Promise).toBe(true);`
      }
    ],
    solution: `function statusOrDefault(promise) {
  return promise
    .then((value) => value.toUpperCase())
    .catch(() => 'unknown');
}`
  }
]
