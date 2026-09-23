export default [
  {
    id: 'js-77-finally-keeps-value',
    title: 'finally не меняет результат',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `withTeardown(promise, teardown)`, которая вызывает ' +
      '`teardown()` при любом исходе и возвращает промис с прежним результатом: ' +
      'значение при успехе, отклонение при ошибке. Возвращаемое из `teardown` ' +
      'значение влиять на результат не должно.',
    starter: `function withTeardown(promise, teardown) {
  // Очистка не должна вмешиваться в результат цепочки.
}`,
    hints: [
      'Есть метод цепочки, выполняющийся при любом исходе.',
      'Его возвращаемое значение игнорируется.',
      'Отклонение должно дойти до вызывающего кода.'
    ],
    tests: [
      {
        name: 'значение сохраняется',
        code: `expect(await withTeardown(Promise.resolve('готово'), () => 'другое')).toBe('готово');`
      },
      {
        name: 'очистка выполняется при успехе',
        code: `let called = false;
await withTeardown(Promise.resolve(1), () => { called = true; });
expect(called).toBe(true);`
      },
      {
        name: 'очистка выполняется при ошибке',
        code: `const source = Promise.reject(new Error('сбой'));
source.catch(() => {});
let called = false;
try { await withTeardown(source, () => { called = true; }); } catch (error) {}
expect(called).toBe(true);`
      },
      {
        name: 'отклонение доходит до вызывающего кода',
        code: `const source = Promise.reject(new Error('сбой'));
source.catch(() => {});
let message = '';
try { await withTeardown(source, () => {}); } catch (error) { message = error.message; }
expect(message).toBe('сбой');`
      }
    ],
    solution: `function withTeardown(promise, teardown) {
  return promise.finally(() => {
    teardown();
  });
}`
  },

  {
    id: 'js-77-catch-position',
    title: 'Положение catch в цепочке',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `safeTransform(promise, transform)`, которая применяет ' +
      '`transform` к значению промиса и возвращает промис со строкой. Если исходный ' +
      'промис отклонён **или** преобразование бросило ошибку, вернуть строку ' +
      '`сбой`. Обработчик ошибок должен ловить оба случая.',
    starter: `function safeTransform(promise, transform) {
  // catch ловит ошибки только тех звеньев, что стоят выше него.
}`,
    hints: [
      'Обработчик ошибок ставится после преобразования, а не до.',
      'Ошибка из обработчика успеха уходит в следующий catch по цепочке.',
      'Возвращать нужно результат цепочки.'
    ],
    tests: [
      {
        name: 'успешное преобразование',
        code: `expect(await safeTransform(Promise.resolve('ok'), (v) => v.toUpperCase())).toBe('OK');`
      },
      {
        name: 'отклонённый исходный промис',
        code: `const source = Promise.reject(new Error('x'));
source.catch(() => {});
expect(await safeTransform(source, (v) => v)).toBe('сбой');`
      },
      {
        name: 'ошибка внутри преобразования',
        code: `expect(await safeTransform(Promise.resolve('ok'), () => { throw new Error('x'); }))
  .toBe('сбой');`
      },
      {
        name: 'результат всегда успешный промис',
        code: `let failed = false;
try { await safeTransform(Promise.resolve('ok'), () => { throw new Error('x'); }); }
catch (error) { failed = true; }
expect(failed).toBe(false);`
      }
    ],
    solution: `function safeTransform(promise, transform) {
  return promise
    .then((value) => transform(value))
    .catch(() => 'сбой');
}`
  }
]
