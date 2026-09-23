export default [
  {
    id: 'js-20-parse-json-safely',
    title: 'Разбор JSON без падения',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `parseBody(text)`, которая возвращает разобранный объект или ' +
      '`null`, если текст не является корректным JSON. Исключение наружу уходить ' +
      'не должно.',
    starter: `function parseBody(text) {
  // JSON.parse выбрасывает SyntaxError на некорректном тексте.
}`,
    hints: [
      'Разбор нужно обернуть в try/catch.',
      'В блоке catch достаточно вернуть null.',
      'Пустая строка тоже не является корректным JSON.'
    ],
    tests: [
      {
        name: 'разбирает корректный JSON',
        code: `expect(parseBody('{"status":"ok"}')).toEqual({ status: 'ok' });`
      },
      {
        name: 'некорректный текст даёт null',
        code: `expect(parseBody('{не json}')).toBe(null);`
      },
      {
        name: 'пустая строка даёт null',
        code: `expect(parseBody('')).toBe(null);`
      },
      {
        name: 'исключение наружу не уходит',
        code: `let thrown = false;
try { parseBody('<html>'); } catch (error) { thrown = true; }
expect(thrown).toBe(false);`
      }
    ],
    solution: `function parseBody(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}`
  },

  {
    id: 'js-20-finally-runs-always',
    title: 'Очистка выполняется при любом исходе',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `withCleanup(operation, cleanup)`, которая вызывает ' +
      '`operation()` и всегда вызывает `cleanup()` — и при успехе, и при ошибке. ' +
      'При успехе вернуть `{ ok: true, value }`, при ошибке — ' +
      '`{ ok: false, message }`. Ошибка наружу не уходит.',
    starter: `function withCleanup(operation, cleanup) {
  // Очистка должна выполняться в блоке finally.
}`,
    hints: [
      'Блок finally выполняется независимо от исхода.',
      'Возврат из try не отменяет finally.',
      'В message передавайте текст ошибки.'
    ],
    tests: [
      {
        name: 'успешный случай',
        code: `let cleaned = false;
const report = withCleanup(() => 42, () => { cleaned = true; });
expect([report, cleaned]).toEqual([{ ok: true, value: 42 }, true]);`
      },
      {
        name: 'очистка выполняется после ошибки',
        code: `let cleaned = false;
const report = withCleanup(() => { throw new Error('упало'); }, () => { cleaned = true; });
expect([report, cleaned]).toEqual([{ ok: false, message: 'упало' }, true]);`
      },
      {
        name: 'ошибка наружу не уходит',
        code: `let thrown = false;
try { withCleanup(() => { throw new Error('x'); }, () => {}); }
catch (error) { thrown = true; }
expect(thrown).toBe(false);`
      },
      {
        name: 'очистка вызывается ровно один раз',
        code: `let calls = 0;
withCleanup(() => 1, () => { calls += 1; });
expect(calls).toBe(1);`
      }
    ],
    solution: `function withCleanup(operation, cleanup) {
  try {
    return { ok: true, value: operation() };
  } catch (error) {
    return { ok: false, message: error.message };
  } finally {
    cleanup();
  }
}`
  }
]
