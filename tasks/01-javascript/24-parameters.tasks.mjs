export default [
  {
    id: 'js-24-default-parameters',
    title: 'Параметры со значениями по умолчанию',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `buildUrl(path, baseUrl = "http://127.0.0.1:4310", query = {})`, ' +
      'которая собирает адрес. Параметры запроса добавляются через `?` и склеиваются ' +
      'через `&`. Если объект запроса пуст, знака вопроса быть не должно.',
    starter: `function buildUrl(path, baseUrl = 'http://127.0.0.1:4310', query = {}) {
  // Пустой объект запроса не должен давать знак вопроса.
}`,
    hints: [
      'Значение по умолчанию срабатывает только при undefined.',
      'Пары ключ-значение удобно собрать из Object.entries.',
      'Проверьте, что пар вообще есть, прежде чем добавлять вопросительный знак.'
    ],
    tests: [
      {
        name: 'использует значения по умолчанию',
        code: `expect(buildUrl('/work-items')).toBe('http://127.0.0.1:4310/work-items');`
      },
      {
        name: 'добавляет параметры запроса',
        code: `expect(buildUrl('/work-items', 'http://a', { status: 'NEW', limit: 10 }))
  .toBe('http://a/work-items?status=NEW&limit=10');`
      },
      {
        name: 'пустой объект запроса не добавляет знак вопроса',
        code: `expect(buildUrl('/work-items', 'http://a', {})).toBe('http://a/work-items');`
      },
      {
        name: 'явный undefined включает значение по умолчанию',
        code: `expect(buildUrl('/x', undefined, {})).toBe('http://127.0.0.1:4310/x');`
      }
    ],
    solution: `function buildUrl(path, baseUrl = 'http://127.0.0.1:4310', query = {}) {
  const pairs = Object.entries(query).map(([key, value]) => key + '=' + value);

  return pairs.length === 0
    ? baseUrl + path
    : baseUrl + path + '?' + pairs.join('&');
}`
  },

  {
    id: 'js-24-destructured-options',
    title: 'Объект настроек в параметрах',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `describeRun({ name, retries = 0, verbose = false } = {})`, ' +
      'которая возвращает строку вида `login: 2 попытки` или ' +
      '`login: 0 попыток (подробно)`. Вызов без аргументов должен работать и давать ' +
      '`без имени: 0 попыток`.',
    starter: `function describeRun({ name, retries = 0, verbose = false } = {}) {
  // Вызов без аргументов тоже должен работать.
}`,
    hints: [
      'Значение по умолчанию у самого параметра нужно для вызова без аргументов.',
      'Отсутствующее имя нужно заменить строкой «без имени».',
      'Слово «попытки» менять по числу не требуется — используйте «попыток» для нуля.'
    ],
    tests: [
      {
        name: 'обычный вызов',
        code: `expect(describeRun({ name: 'login', retries: 2 })).toBe('login: 2 попытки');`
      },
      {
        name: 'подробный режим',
        code: `expect(describeRun({ name: 'login', verbose: true })).toBe('login: 0 попыток (подробно)');`
      },
      {
        name: 'вызов без аргументов',
        code: `expect(describeRun()).toBe('без имени: 0 попыток');`
      },
      {
        name: 'пустой объект настроек',
        code: `expect(describeRun({})).toBe('без имени: 0 попыток');`
      }
    ],
    solution: `function describeRun({ name, retries = 0, verbose = false } = {}) {
  const title = name ?? 'без имени';
  const word = retries === 0 ? 'попыток' : 'попытки';
  const base = title + ': ' + retries + ' ' + word;

  return verbose ? base + ' (подробно)' : base;
}`
  }
]
