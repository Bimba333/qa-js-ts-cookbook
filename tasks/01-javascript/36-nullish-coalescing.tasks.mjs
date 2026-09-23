export default [
  {
    id: 'js-36-retry-default',
    title: 'Значение по умолчанию без потери нуля',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `readRetries(config)`, которая возвращает `config.retries`. ' +
      'Если значение не задано, вернуть `2`. Ноль является допустимым значением и ' +
      'заменяться не должен.',
    starter: `function readRetries(config) {
  // Оператор || заменит и ноль.
}`,
    hints: [
      'Оператор || срабатывает на любом ложном значении, включая 0.',
      'Нужен оператор, реагирующий только на null и undefined.',
      'Значение 0 должно доходить до вызывающего кода без изменений.'
    ],
    tests: [
      {
        name: 'возвращает заданное значение',
        code: `expect(readRetries({ retries: 5 })).toBe(5);`
      },
      {
        name: 'ноль сохраняется',
        code: `expect(readRetries({ retries: 0 })).toBe(0);`
      },
      {
        name: 'при отсутствии подставляет 2',
        code: `expect(readRetries({})).toBe(2);`
      },
      {
        name: 'при null подставляет 2',
        code: `expect(readRetries({ retries: null })).toBe(2);`
      }
    ],
    solution: `function readRetries(config) {
  return config.retries ?? 2;
}`
  },

  {
    id: 'js-36-resolve-config',
    title: 'Собрать конфигурацию из двух источников',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `resolveConfig(fromEnv, defaults)`, которая возвращает объект ' +
      'с полями `baseUrl`, `retries` и `verbose`. Для каждого поля берётся значение ' +
      'из `fromEnv`, а если оно `null` или `undefined` — из `defaults`. Значения ' +
      '`0`, `false` и пустая строка из `fromEnv` считаются заданными.',
    starter: `function resolveConfig(fromEnv, defaults) {
  // Для каждого поля нужна проверка только на null и undefined.
}`,
    hints: [
      'Оператор || испортит false, 0 и пустую строку.',
      'Нужен оператор, реагирующий только на null и undefined.',
      'Полей три — правило для каждого одинаковое.'
    ],
    tests: [
      {
        name: 'берёт значения из окружения',
        code: `expect(resolveConfig(
  { baseUrl: 'http://a', retries: 3, verbose: true },
  { baseUrl: 'http://b', retries: 1, verbose: false }
)).toEqual({ baseUrl: 'http://a', retries: 3, verbose: true });`
      },
      {
        name: 'подставляет значения по умолчанию',
        code: `expect(resolveConfig({}, { baseUrl: 'http://b', retries: 1, verbose: false }))
  .toEqual({ baseUrl: 'http://b', retries: 1, verbose: false });`
      },
      {
        name: 'false и ноль из окружения сохраняются',
        code: `expect(resolveConfig(
  { retries: 0, verbose: false },
  { baseUrl: 'http://b', retries: 5, verbose: true }
)).toEqual({ baseUrl: 'http://b', retries: 0, verbose: false });`
      },
      {
        name: 'пустая строка из окружения сохраняется',
        code: `expect(resolveConfig({ baseUrl: '' }, { baseUrl: 'http://b', retries: 1, verbose: false }).baseUrl)
  .toBe('');`
      }
    ],
    solution: `function resolveConfig(fromEnv, defaults) {
  return {
    baseUrl: fromEnv.baseUrl ?? defaults.baseUrl,
    retries: fromEnv.retries ?? defaults.retries,
    verbose: fromEnv.verbose ?? defaults.verbose
  };
}`
  }
]
