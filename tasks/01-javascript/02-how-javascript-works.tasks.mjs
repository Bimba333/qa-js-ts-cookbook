export default [
  {
    id: 'js-02-syntax-error-before-execution',
    title: 'Синтаксическая ошибка появляется до выполнения',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `tryPrepare(source)`, которая пытается подготовить текст ' +
      'программы к выполнению через `new Function(source)` и возвращает объект ' +
      '`{ prepared, errorName }`. Если разбор прошёл — `prepared: true` и ' +
      '`errorName: null`. Если разбор не удался — `prepared: false` и имя ошибки. ' +
      'Саму функцию вызывать не нужно: задача главы — показать, что ошибка ' +
      'разбора возникает **до** первой выполненной строки.',
    starter: `function tryPrepare(source) {
  // Разбор выполняет new Function(source). Вызывать результат не нужно.

  return { prepared: true, errorName: null };
}`,
    hints: [
      'Конструктор `Function` разбирает переданный текст сразу, поэтому ошибка появляется уже в этой строке.',
      'Ошибку нужно поймать через `try/catch`, иначе она выйдет наружу и уронит саму `tryPrepare`.',
      'Имя ошибки лежит в свойстве `error.name`; для неразобранного текста это `SyntaxError`.'
    ],
    tests: [
      {
        name: 'корректный текст разбирается',
        code: `expect(tryPrepare('return 1 + 1;')).toEqual({ prepared: true, errorName: null });`
      },
      {
        name: 'сломанный текст даёт `SyntaxError`',
        code: `const broken = tryPrepare('const = ;');
expect(broken.prepared).toBe(false);
expect(broken.errorName).toBe('SyntaxError');`
      },
      {
        name: 'ни одна строка сломанного текста не выполнилась',
        code: `globalThis.__prepared = 'нетронуто';
tryPrepare('globalThis.__prepared = "выполнено"; const = ;');
expect(globalThis.__prepared).toBe('нетронуто');`
      },
      {
        name: 'разбор не запускает и корректный текст',
        code: `globalThis.__ran = 'нетронуто';
tryPrepare('globalThis.__ran = "выполнено";');
expect(globalThis.__ran).toBe('нетронуто');`
      }
    ],
    solution: `function tryPrepare(source) {
  try {
    new Function(source);

    return { prepared: true, errorName: null };
  } catch (error) {
    return { prepared: false, errorName: error.name };
  }
}`
  }
]
