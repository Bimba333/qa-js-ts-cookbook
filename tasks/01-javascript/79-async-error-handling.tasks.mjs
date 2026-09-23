export default [
  {
    id: 'js-79-return-await-in-try',
    title: 'return await внутри try',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `loadOrDefault(load, fallback)`, которая возвращает результат ' +
      'асинхронной функции `load`, а при её отклонении — значение `fallback`. ' +
      'Обработка должна происходить **внутри** функции: наружу отклонение не уходит.',
    starter: `async function loadOrDefault(load, fallback) {
  try {
    // Без await отклонение пройдёт мимо catch.
  } catch (error) {
    return fallback;
  }
}`,
    hints: [
      'Возврат промиса из try выходит из блока до его отклонения.',
      'Чтобы catch увидел ошибку, промис нужно развернуть внутри блока.',
      'Значение fallback возвращается как есть.'
    ],
    tests: [
      {
        name: 'успешное значение',
        code: `expect(await loadOrDefault(async () => 'данные', 'запасное')).toBe('данные');`
      },
      {
        name: 'при отклонении возвращает запасное значение',
        code: `expect(await loadOrDefault(async () => { throw new Error('x'); }, 'запасное'))
  .toBe('запасное');`
      },
      {
        name: 'отклонение наружу не уходит',
        code: `let failed = false;
try { await loadOrDefault(async () => { throw new Error('x'); }, 'запасное'); }
catch (error) { failed = true; }
expect(failed).toBe(false);`
      },
      {
        name: 'работает с функцией, возвращающей отклонённый промис',
        code: `const load = () => { const p = Promise.reject(new Error('x')); p.catch(() => {}); return p; };
expect(await loadOrDefault(load, 'запасное')).toBe('запасное');`
      }
    ],
    solution: `async function loadOrDefault(load, fallback) {
  try {
    return await load();
  } catch (error) {
    return fallback;
  }
}`
  },

  {
    id: 'js-79-error-with-cause',
    title: 'Проброс с сохранением причины',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `withContext(operation, context)`, которая выполняет ' +
      'асинхронную операцию и при ошибке бросает новую ошибку с сообщением ' +
      '`<context>: <исходное сообщение>`, сохраняя исходную ошибку в поле `cause`.',
    starter: `async function withContext(operation, context) {
  // Исходная ошибка не должна потеряться.
}`,
    hints: [
      'Исходная причина передаётся вторым аргументом конструктора ошибки.',
      'Сообщение собирается из контекста и текста исходной ошибки.',
      'При успехе значение возвращается без изменений.'
    ],
    tests: [
      {
        name: 'успешное значение проходит без изменений',
        code: `expect(await withContext(async () => 42, 'чтение конфигурации')).toBe(42);`
      },
      {
        name: 'сообщение дополняется контекстом',
        code: `let message = '';
try { await withContext(async () => { throw new Error('файл не найден'); }, 'чтение'); }
catch (error) { message = error.message; }
expect(message).toBe('чтение: файл не найден');`
      },
      {
        name: 'исходная ошибка сохранена в cause',
        code: `let causeMessage = '';
try { await withContext(async () => { throw new Error('файл не найден'); }, 'чтение'); }
catch (error) { causeMessage = error.cause.message; }
expect(causeMessage).toBe('файл не найден');`
      },
      {
        name: 'брошенное значение является объектом Error',
        code: `let isError = false;
try { await withContext(async () => { throw new Error('x'); }, 'ctx'); }
catch (error) { isError = error instanceof Error; }
expect(isError).toBe(true);`
      }
    ],
    solution: `async function withContext(operation, context) {
  try {
    return await operation();
  } catch (error) {
    throw new Error(context + ': ' + error.message, { cause: error });
  }
}`
  }
]
