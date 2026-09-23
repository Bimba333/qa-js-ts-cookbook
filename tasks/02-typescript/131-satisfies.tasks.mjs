export default [
  {
    id: 'ts-131-satisfies-config',
    title: 'Конфигурация под satisfies',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `EnvConfig = { baseUrl: string; retries: number }` и константу ' +
      '`config`, описанную через `satisfies EnvConfig` (без аннотации типа). ' +
      'Затем напишите `describeConfig(): string`, возвращающую строку вида ' +
      '`<baseUrl> ×<retries>`. Значения: `http://127.0.0.1:8080` и `3`.',
    starter: `type EnvConfig = {
  baseUrl: string;
  retries: number;
};

const config = {
  // ваши значения
} satisfies EnvConfig;

function describeConfig(): string {
  return '';
}`,
    hints: [
      'satisfies проверяет объект на соответствие типу, но оставляет конкретные значения.',
      'Обращаться к полям надо через config, а не через литералы в строке.',
      'Разделитель между адресом и числом — пробел и символ ×.'
    ],
    tests: [
      {
        name: 'строка собрана из полей конфигурации',
        code: `expect(describeConfig()).toBe('http://127.0.0.1:8080 ×3');`
      },
      {
        name: 'адрес хранится в конфигурации',
        code: `expect(config.baseUrl).toBe('http://127.0.0.1:8080');`
      },
      {
        name: 'число попыток — число, а не строка',
        code: `expect(typeof config.retries).toBe('number');`
      },
      {
        name: 'описание читает актуальные поля',
        code: `expect(describeConfig()).toContain(String(config.retries));`
      }
    ],
    solution: `type EnvConfig = {
  baseUrl: string;
  retries: number;
};

const config = {
  baseUrl: 'http://127.0.0.1:8080',
  retries: 3
} satisfies EnvConfig;

function describeConfig(): string {
  return config.baseUrl + ' ×' + config.retries;
}`
  },

  {
    id: 'ts-131-satisfies-keeps-literals',
    title: 'Ключи остаются известными',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите карту таймаутов `timeouts` через `satisfies Record<string, number>` ' +
      'с ключами `short: 1000`, `normal: 5000`, `long: 30000`. ' +
      'Напишите `listTimeouts(): string[]`, которая возвращает ключи в порядке ' +
      'возрастания значения. Порядок объявления должен быть неважен: ' +
      'сортируйте по значению, а не полагайтесь на порядок ключей.',
    starter: `const timeouts = {
  // ваши значения
} satisfies Record<string, number>;

function listTimeouts(): string[] {
  return [];
}`,
    hints: [
      'Object.entries даёт пары «ключ — значение».',
      'Сортировать нужно по значению, а вернуть только ключи.',
      'Тип Record<string, number> допускает любые ключи, поэтому опираться стоит на данные.'
    ],
    tests: [
      {
        name: 'ключи отсортированы по значению',
        code: `expect(listTimeouts()).toEqual(['short', 'normal', 'long']);`
      },
      {
        name: 'значения заданы верно',
        code: `expect(timeouts.short).toBe(1000);
expect(timeouts.normal).toBe(5000);
expect(timeouts.long).toBe(30000);`
      },
      {
        name: 'возвращается ровно три ключа',
        code: `expect(listTimeouts()).toHaveLength(3);`
      },
      {
        name: 'список собирается из объекта, а не записан руками',
        code: `expect(listTimeouts()).toEqual(
  Object.entries(timeouts).sort((a, b) => a[1] - b[1]).map(pair => pair[0])
);`
      }
    ],
    solution: `const timeouts = {
  short: 1000,
  normal: 5000,
  long: 30000
} satisfies Record<string, number>;

function listTimeouts(): string[] {
  return Object.entries(timeouts)
    .sort((a, b) => a[1] - b[1])
    .map(([name]) => name);
}`
  }
]
