export default [
  {
    id: 'js-94-safe-stringify',
    title: 'Сериализация без потерь и падений',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `safeStringify(value)`, которая возвращает строку JSON. ' +
      'Циклическая ссылка не должна приводить к ошибке: повторно встреченный объект ' +
      'заменяется строкой `"[circular]"`. При любой другой ошибке сериализации ' +
      'вернуть `null`.',
    starter: `function safeStringify(value) {
  // JSON.stringify принимает вторым аргументом функцию замены.
}`,
    hints: [
      'Вторым аргументом JSON.stringify принимает функцию замены значений.',
      'Уже встреченные объекты удобно запоминать в Set.',
      'BigInt по-прежнему вызывает ошибку — её нужно перехватить.'
    ],
    tests: [
      {
        name: 'обычный объект сериализуется',
        code: `expect(safeStringify({ a: 1 })).toBe('{"a":1}');`
      },
      {
        name: 'циклическая ссылка не роняет функцию',
        code: `const cyclic = { name: 'a' };
cyclic.self = cyclic;
expect(safeStringify(cyclic)).toContain('[circular]');`
      },
      {
        name: 'BigInt даёт null вместо исключения',
        code: `expect(safeStringify({ big: 1n })).toBe(null);`
      },
      {
        name: 'массивы сериализуются',
        code: `expect(safeStringify([1, 'a'])).toBe('[1,"a"]');`
      }
    ],
    solution: `function safeStringify(value) {
  const seen = new Set();

  try {
    return JSON.stringify(value, (key, current) => {
      if (typeof current === 'object' && current !== null) {
        if (seen.has(current)) {
          return '[circular]';
        }

        seen.add(current);
      }

      return current;
    });
  } catch (error) {
    return null;
  }
}`
  },

  {
    id: 'js-94-revive-dates',
    title: 'Восстановление типов при разборе',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `parseWithDates(text, dateFields)`, которая разбирает JSON и ' +
      'превращает указанные поля в объекты `Date`. Остальные поля остаются как есть. ' +
      'При некорректном тексте вернуть `null`.',
    starter: `function parseWithDates(text, dateFields) {
  // JSON.parse принимает вторым аргументом функцию преобразования.
}`,
    hints: [
      'Вторым аргументом JSON.parse принимает функцию преобразования значений.',
      'Она получает имя ключа и значение.',
      'Некорректный текст выбрасывает SyntaxError.'
    ],
    tests: [
      {
        name: 'превращает указанные поля в даты',
        code: `const parsed = parseWithDates('{"createdAt":"2026-09-22T10:00:00.000Z"}', ['createdAt']);
expect(parsed.createdAt instanceof Date).toBe(true);`
      },
      {
        name: 'значение даты восстановлено верно',
        code: `const parsed = parseWithDates('{"createdAt":"2026-09-22T10:00:00.000Z"}', ['createdAt']);
expect(parsed.createdAt.toISOString()).toBe('2026-09-22T10:00:00.000Z');`
      },
      {
        name: 'остальные поля не трогаются',
        code: `const parsed = parseWithDates('{"name":"login","createdAt":"2026-09-22T10:00:00.000Z"}', ['createdAt']);
expect(parsed.name).toBe('login');`
      },
      {
        name: 'некорректный текст даёт null',
        code: `expect(parseWithDates('{не json}', [])).toBe(null);`
      }
    ],
    solution: `function parseWithDates(text, dateFields) {
  try {
    return JSON.parse(text, (key, value) =>
      dateFields.includes(key) ? new Date(value) : value);
  } catch (error) {
    return null;
  }
}`
  }
]
