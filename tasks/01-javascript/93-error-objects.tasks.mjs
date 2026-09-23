export default [
  {
    id: 'js-93-custom-error-class',
    title: 'Собственный класс ошибки',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Объявите класс `ConfigError`, наследующий `Error`, с корректным полем `name`. ' +
      'Напишите функцию `describeError(error)`, которая возвращает ' +
      '`{ name, message, isConfigError }`, различая ошибки по типу, а не по тексту.',
    starter: `class ConfigError extends Error {
  // Поле name нужно задать явно.
}

function describeError(error) {
  // Тип проверяется через instanceof.
}`,
    hints: [
      'Без явного присваивания name останется значением Error.',
      'Конструктор родителя вызывается через super.',
      'Принадлежность классу проверяется через instanceof.'
    ],
    tests: [
      {
        name: 'имя класса задано',
        code: `expect(new ConfigError('нет файла').name).toBe('ConfigError');`
      },
      {
        name: 'остаётся объектом Error',
        code: `expect(new ConfigError('x') instanceof Error).toBe(true);`
      },
      {
        name: 'различает свой тип ошибки',
        code: `expect(describeError(new ConfigError('нет файла')))
  .toEqual({ name: 'ConfigError', message: 'нет файла', isConfigError: true });`
      },
      {
        name: 'обычная ошибка не считается своей',
        code: `expect(describeError(new Error('другое')).isConfigError).toBe(false);`
      }
    ],
    solution: `class ConfigError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'ConfigError';
  }
}

function describeError(error) {
  return {
    name: error.name,
    message: error.message,
    isConfigError: error instanceof ConfigError
  };
}`
  },

  {
    id: 'js-93-serialize-error',
    title: 'Ошибка в журнал',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `toLogEntry(error)`, которая возвращает объект ' +
      '`{ name, message, hasStack }` для записи в журнал. Обычная сериализация ' +
      'ошибки теряет данные, поэтому поля нужно извлечь явно. Для значения, ' +
      'не являющегося ошибкой, вернуть `{ name: "Unknown", message: String(value), hasStack: false }`.',
    starter: `function toLogEntry(error) {
  // JSON.stringify(error) возвращает пустой объект.
}`,
    hints: [
      'Поля message и stack не перечисляемые, поэтому теряются при сериализации.',
      'Извлекать их нужно явно по имени.',
      'Значение может вообще не быть ошибкой.'
    ],
    tests: [
      {
        name: 'извлекает поля ошибки',
        code: `const entry = toLogEntry(new Error('упало'));
expect([entry.name, entry.message, entry.hasStack]).toEqual(['Error', 'упало', true]);`
      },
      {
        name: 'обычная сериализация действительно теряет данные',
        code: `expect(JSON.stringify(new Error('упало'))).toBe('{}');`
      },
      {
        name: 'значение не из Error описывается отдельно',
        code: `expect(toLogEntry('строка'))
  .toEqual({ name: 'Unknown', message: 'строка', hasStack: false });`
      },
      {
        name: 'подкласс ошибки сохраняет своё имя',
        code: `class MyError extends Error { constructor(m) { super(m); this.name = 'MyError'; } }
expect(toLogEntry(new MyError('x')).name).toBe('MyError');`
      }
    ],
    solution: `function toLogEntry(error) {
  if (!(error instanceof Error)) {
    return { name: 'Unknown', message: String(error), hasStack: false };
  }

  return {
    name: error.name,
    message: error.message,
    hasStack: typeof error.stack === 'string'
  };
}`
  }
]
