export default [
  {
    id: 'ts-122-build-url',
    title: 'Адрес с необязательными параметрами',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `buildUrl(path: string, params?: Record<string, string | number>, base = "http://127.0.0.1:4310"): string`. ' +
      'Результат — `<base><path>` плюс строка запроса, если параметры переданы и ' +
      'непусты. Ключи в строке запроса идут в порядке передачи, значения ' +
      'кодируются `encodeURIComponent`.',
    starter: `function buildUrl(
  path: string,
  params?: Record<string, string | number>,
  base = 'http://127.0.0.1:4310'
): string {
  return base + path;
}`,
    hints: [
      'Параметр со значением по умолчанию остаётся необязательным при вызове.',
      'Пустой объект параметров не должен добавлять вопросительный знак.',
      'Числовое значение перед кодированием превращается в строку.'
    ],
    tests: [
      {
        name: 'без параметров возвращается базовый адрес',
        code: `expect(buildUrl('/work-items')).toBe('http://127.0.0.1:4310/work-items');`
      },
      {
        name: 'параметры добавляются в порядке передачи',
        code: `expect(buildUrl('/work-items', { status: 'NEW', limit: 10 }))
  .toBe('http://127.0.0.1:4310/work-items?status=NEW&limit=10');`
      },
      {
        name: 'пустой объект не добавляет вопросительный знак',
        code: `expect(buildUrl('/work-items', {})).toBe('http://127.0.0.1:4310/work-items');`
      },
      {
        name: 'значение кодируется',
        code: `expect(buildUrl('/search', { q: 'a b&c' }))
  .toBe('http://127.0.0.1:4310/search?q=a%20b%26c');`
      },
      {
        name: 'база заменяется третьим аргументом',
        code: `expect(buildUrl('/x', undefined, 'https://stand.test'))
  .toBe('https://stand.test/x');`
      }
    ],
    solution: `function buildUrl(
  path: string,
  params?: Record<string, string | number>,
  base = 'http://127.0.0.1:4310'
): string {
  const entries = params === undefined ? [] : Object.entries(params);

  if (entries.length === 0) {
    return base + path;
  }

  const query = entries
    .map(([key, value]) => key + '=' + encodeURIComponent(String(value)))
    .join('&');

  return base + path + '?' + query;
}`
  },

  {
    id: 'ts-122-rest-steps',
    title: 'Остаточные параметры',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `describeScenario(name: string, ...steps: string[]): string`. ' +
      'Результат — `<name>: шаг1 → шаг2 → шаг3`. Если шагов нет, верните ' +
      '`<name>: шагов нет`. Пустые строки и строки из пробелов шагами не считаются.',
    starter: `function describeScenario(name: string, ...steps: string[]): string {
  return '';
}`,
    hints: [
      'Остаточный параметр всегда массив, даже когда аргументов нет.',
      'Отфильтровать пустые шаги надо до проверки на пустоту.',
      'Разделитель между шагами — пробел, стрелка, пробел.'
    ],
    tests: [
      {
        name: 'шаги соединяются стрелкой',
        code: `expect(describeScenario('Вход', 'открыть', 'заполнить', 'отправить'))
  .toBe('Вход: открыть → заполнить → отправить');`
      },
      {
        name: 'без шагов возвращается заглушка',
        code: `expect(describeScenario('Вход')).toBe('Вход: шагов нет');`
      },
      {
        name: 'пустые шаги отбрасываются',
        code: `expect(describeScenario('Вход', 'открыть', '', '   ', 'отправить'))
  .toBe('Вход: открыть → отправить');`
      },
      {
        name: 'единственный шаг не получает разделителя',
        code: `expect(describeScenario('Вход', 'открыть')).toBe('Вход: открыть');`
      },
      {
        name: 'все шаги пустые — как будто их нет',
        code: `expect(describeScenario('Вход', '', '  ')).toBe('Вход: шагов нет');`
      }
    ],
    solution: `function describeScenario(name: string, ...steps: string[]): string {
  const meaningful = steps.filter(step => step.trim() !== '');

  if (meaningful.length === 0) {
    return name + ': шагов нет';
  }

  return name + ': ' + meaningful.join(' → ');
}`
  }
]
