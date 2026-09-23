export default [
  {
    id: 'js-35-nested-email',
    title: 'Доступ к вложенному полю',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `readEmail(response)`, которая возвращает ' +
      '`response.body.user.email`. Если любое звено отсутствует, вернуть `null` ' +
      'вместо ошибки.',
    starter: `function readEmail(response) {
  // Опциональная цепочка прерывается на первом отсутствующем звене.
}`,
    hints: [
      'Опциональная цепочка возвращает undefined, если звено отсутствует.',
      'Требуется именно null, а не undefined — значение нужно подменить.',
      'Подменять следует и undefined, и null.'
    ],
    tests: [
      {
        name: 'возвращает вложенное значение',
        code: `expect(readEmail({ body: { user: { email: 'a@b.test' } } })).toBe('a@b.test');`
      },
      {
        name: 'нет user — возвращает null',
        code: `expect(readEmail({ body: {} })).toBe(null);`
      },
      {
        name: 'нет body — возвращает null',
        code: `expect(readEmail({})).toBe(null);`
      },
      {
        name: 'ошибки не возникает',
        code: `let thrown = false;
try { readEmail({}); } catch (error) { thrown = true; }
expect(thrown).toBe(false);`
      }
    ],
    solution: `function readEmail(response) {
  return response?.body?.user?.email ?? null;
}`
  },

  {
    id: 'js-35-safe-method-call',
    title: 'Вызов метода, которого может не быть',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `describeSafely(reporter)`, которая вызывает ' +
      '`reporter.describe()` и возвращает результат. Если объекта нет или у него нет ' +
      'метода `describe`, вернуть строку `нет описания` без ошибки.',
    starter: `function describeSafely(reporter) {
  // Опциональная цепочка работает и для вызова метода.
}`,
    hints: [
      'Для безопасного вызова есть форма ?.() — она проверяет наличие метода.',
      'Если метода нет, результатом будет undefined.',
      'Подменить нужно и undefined, и null.'
    ],
    tests: [
      {
        name: 'вызывает существующий метод',
        code: `expect(describeSafely({ describe: () => 'отчёт' })).toBe('отчёт');`
      },
      {
        name: 'нет метода — возвращает заглушку',
        code: `expect(describeSafely({})).toBe('нет описания');`
      },
      {
        name: 'нет объекта — возвращает заглушку',
        code: `expect(describeSafely(undefined)).toBe('нет описания');`
      },
      {
        name: 'ошибки не возникает',
        code: `let thrown = false;
try { describeSafely({}); } catch (error) { thrown = true; }
expect(thrown).toBe(false);`
      }
    ],
    solution: `function describeSafely(reporter) {
  return reporter?.describe?.() ?? 'нет описания';
}`
  }
]
