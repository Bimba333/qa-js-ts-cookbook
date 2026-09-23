export default [
  {
    id: 'js-32-bound-reporter',
    title: 'Функция с закреплённым объектом',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Дан объект `reporter` с полем `prefix` и методом `line(text)`, который ' +
      'возвращает `<prefix>: <text>`. Напишите функцию `makeLine(reporter)`, ' +
      'которая возвращает **функцию** — её можно передать куда угодно, и она ' +
      'сохранит привязку к `reporter`. Сам метод вызывать не нужно.',
    starter: `function makeLine(reporter) {
  // Верните функцию, а не результат вызова.
}`,
    hints: [
      'Нужен метод функции, который не вызывает её, а создаёт новую с закреплённым объектом.',
      'Возвращать надо саму функцию — вызов произойдёт позже.',
      'Проверьте, что результат имеет тип function.'
    ],
    tests: [
      {
        name: 'возвращает функцию',
        code: `const reporter = { prefix: 'api', line(text) { return \`\${this.prefix}: \${text}\`; } };
expect(typeof makeLine(reporter)).toBe('function');`
      },
      {
        name: 'сохраняет объект при вызове',
        code: `const reporter = { prefix: 'api', line(text) { return \`\${this.prefix}: \${text}\`; } };
const line = makeLine(reporter);
expect(line('старт')).toBe('api: старт');`
      },
      {
        name: 'работает после передачи в другой код',
        code: `const reporter = { prefix: 'ui', line(text) { return \`\${this.prefix}: \${text}\`; } };
const line = makeLine(reporter);
expect(['a', 'b'].map(line)).toEqual(['ui: a', 'ui: b']);`
      },
      {
        name: 'исходный метод остаётся прежним',
        code: `const reporter = { prefix: 'api', line(text) { return \`\${this.prefix}: \${text}\`; } };
makeLine(reporter);
expect(reporter.line.call({ prefix: 'other' }, 'x')).toBe('other: x');`
      }
    ],
    solution: `function makeLine(reporter) {
  return reporter.line.bind(reporter);
}`
  },

  {
    id: 'js-32-partial-prefix',
    title: 'Частичное применение аргумента',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Дана функция `buildUrl(baseUrl, path)`, возвращающая `<baseUrl><path>`. ' +
      'Напишите функцию `urlBuilderFor(baseUrl)`, которая возвращает функцию ' +
      'одного аргумента `path`. Базовый адрес должен быть закреплён заранее, ' +
      'а не передаваться при каждом вызове.',
    starter: `function buildUrl(baseUrl, path) {
  return \`\${baseUrl}\${path}\`;
}

function urlBuilderFor(baseUrl) {
  // Первый аргумент закрепляется заранее.
}`,
    hints: [
      'Аргументы, переданные при создании привязанной функции, закрепляются за ней.',
      'Объект выполнения здесь не нужен — на его месте может стоять null.',
      'Оставшийся аргумент передаётся при вызове.'
    ],
    tests: [
      {
        name: 'подставляет базовый адрес',
        code: `const forStaging = urlBuilderFor('https://staging.test');
expect(forStaging('/orders')).toBe('https://staging.test/orders');`
      },
      {
        name: 'два построителя независимы',
        code: `const first = urlBuilderFor('http://a');
const second = urlBuilderFor('http://b');
expect(first('/x') + ' | ' + second('/y')).toBe('http://a/x | http://b/y');`
      },
      {
        name: 'возвращает функцию одного аргумента',
        code: `const forStaging = urlBuilderFor('http://a');
expect(typeof forStaging).toBe('function');`
      },
      {
        name: 'подходит для передачи в map',
        code: `const forStaging = urlBuilderFor('http://a');
expect(['/x', '/y'].map(forStaging)).toEqual(['http://a/x', 'http://a/y']);`
      }
    ],
    solution: `function buildUrl(baseUrl, path) {
  return \`\${baseUrl}\${path}\`;
}

function urlBuilderFor(baseUrl) {
  return buildUrl.bind(null, baseUrl);
}`
  }
]
