export default [
  {
    id: 'ts-140-shape-from-value',
    title: 'Тип из значения и проверка по образцу',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите объект `defaultConfig` с полями `baseUrl: "http://127.0.0.1:4310"`, ' +
      '`retries: 2`, `headless: true` и тип `Config = typeof defaultConfig`. ' +
      'Напишите `matchesShape(sample: object, candidate: unknown): boolean` — ' +
      'проверку во время выполнения: у кандидата есть те же ключи, что у ' +
      'образца, и типы значений совпадают (сравнивается результат `typeof`). ' +
      'Напишите `withOverrides(overrides: Partial<Config>): Config` — ' +
      'конфигурация по умолчанию с перекрытыми полями; `undefined` в ' +
      'перекрытиях значение по умолчанию не затирает.',
    starter: `const defaultConfig = {
  baseUrl: 'http://127.0.0.1:4310',
  retries: 2,
  headless: true
};

type Config = typeof defaultConfig;

function matchesShape(sample: object, candidate: unknown): boolean {
  return false;
}

function withOverrides(overrides: Partial<Config>): Config {
  return defaultConfig;
}`,
    hints: [
      'Тип, выведенный из значения, до запуска не доживает — образцом служит сам объект.',
      'Сравнивать нужно и набор ключей, и typeof значений.',
      'Перекрытия применяются поэлементно, а не распространением объекта.'
    ],
    tests: [
      {
        name: 'совпадающая форма проходит',
        code: `expect(matchesShape(defaultConfig, {
  baseUrl: 'http://other',
  retries: 5,
  headless: false
})).toBe(true);`
      },
      {
        name: 'неверный тип поля не проходит',
        code: `expect(matchesShape(defaultConfig, {
  baseUrl: 'http://other',
  retries: '5',
  headless: false
})).toBe(false);`
      },
      {
        name: 'отсутствие поля не проходит',
        code: `expect(matchesShape(defaultConfig, { baseUrl: 'http://other', retries: 1 })).toBe(false);`
      },
      {
        name: 'не объект не проходит',
        code: `expect(matchesShape(defaultConfig, null)).toBe(false);
expect(matchesShape(defaultConfig, 'конфигурация')).toBe(false);`
      },
      {
        name: 'перекрытия применяются',
        code: `expect(withOverrides({ retries: 5 })).toEqual({
  baseUrl: 'http://127.0.0.1:4310',
  retries: 5,
  headless: true
});`
      },
      {
        name: 'undefined не затирает значение по умолчанию',
        code: `expect(withOverrides({ retries: undefined }).retries).toBe(2);`
      },
      {
        name: 'значения по умолчанию не изменяются',
        code: `withOverrides({ retries: 9, headless: false });
expect(defaultConfig.retries).toBe(2);
expect(defaultConfig.headless).toBe(true);`
      },
      {
        name: 'результат перекрытий сохраняет форму образца',
        code: `expect(matchesShape(defaultConfig, withOverrides({ headless: false }))).toBe(true);`
      }
    ],
    solution: `const defaultConfig = {
  baseUrl: 'http://127.0.0.1:4310',
  retries: 2,
  headless: true
};

type Config = typeof defaultConfig;

function matchesShape(sample: object, candidate: unknown): boolean {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const actual = candidate as Record<string, unknown>;
  const expected = sample as Record<string, unknown>;

  const sampleKeys = Object.keys(expected);

  if (Object.keys(actual).length !== sampleKeys.length) {
    return false;
  }

  return sampleKeys.every(key =>
    Object.hasOwn(actual, key) && typeof actual[key] === typeof expected[key]);
}

function withOverrides(overrides: Partial<Config>): Config {
  const result = { ...defaultConfig };

  for (const key of Object.keys(overrides) as (keyof Config)[]) {
    const value = overrides[key];

    if (value !== undefined) {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}`
  }
]
