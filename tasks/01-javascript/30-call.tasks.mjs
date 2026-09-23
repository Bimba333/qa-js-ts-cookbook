export default [
  {
    id: 'js-30-borrow-method',
    title: 'Одолжить метод другому объекту',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Дана функция `describe()`, которая возвращает строку `<name>: <role>` из ' +
      '`this`. Напишите функцию `describeAs(target)`, которая выполняет `describe` ' +
      'с объектом `target` в качестве объекта выполнения и возвращает результат. ' +
      'Функция должна выполняться немедленно.',
    starter: `function describe() {
  return \`\${this.name}: \${this.role}\`;
}

function describeAs(target) {
  // Выполните describe с чужим объектом прямо сейчас.
}`,
    hints: [
      'Есть метод функции, который вызывает её немедленно с указанным объектом.',
      'Первый аргумент этого метода задаёт объект выполнения.',
      'Возвращать нужно результат вызова, а не саму функцию.'
    ],
    tests: [
      {
        name: 'подставляет чужой объект',
        code: `expect(describeAs({ name: 'Анна', role: 'admin' })).toBe('Анна: admin');`
      },
      {
        name: 'работает с другим объектом',
        code: `expect(describeAs({ name: 'Иван', role: 'qa' })).toBe('Иван: qa');`
      },
      {
        name: 'возвращает строку, а не функцию',
        code: `expect(typeof describeAs({ name: 'a', role: 'b' })).toBe('string');`
      },
      {
        name: 'исходная функция не изменяется',
        code: `describeAs({ name: 'a', role: 'b' });
expect(describe.call({ name: 'c', role: 'd' })).toBe('c: d');`
      }
    ],
    solution: `function describe() {
  return \`\${this.name}: \${this.role}\`;
}

function describeAs(target) {
  return describe.call(target);
}`
  },

  {
    id: 'js-30-format-with-args',
    title: 'Передать объект и аргументы',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Дана функция `format(prefix, suffix)`, возвращающая строку ' +
      '`<prefix><name><suffix>` из `this`. Напишите функцию ' +
      '`formatFor(target, prefix, suffix)`, которая выполняет `format` с объектом ' +
      '`target` и переданными аргументами.',
    starter: `function format(prefix, suffix) {
  return \`\${prefix}\${this.name}\${suffix}\`;
}

function formatFor(target, prefix, suffix) {
  // Аргументы передаются по одному после объекта выполнения.
}`,
    hints: [
      'Первым аргументом идёт объект выполнения, остальные — аргументы самой функции.',
      'Аргументы передаются по одному, а не массивом.',
      'Порядок аргументов должен сохраниться.'
    ],
    tests: [
      {
        name: 'подставляет объект и аргументы',
        code: `expect(formatFor({ name: 'login' }, '[', ']')).toBe('[login]');`
      },
      {
        name: 'сохраняет порядок аргументов',
        code: `expect(formatFor({ name: 'order' }, '<<', '>>')).toBe('<<order>>');`
      },
      {
        name: 'работает с пустыми аргументами',
        code: `expect(formatFor({ name: 'solo' }, '', '')).toBe('solo');`
      },
      {
        name: 'не изменяет переданный объект',
        code: `const target = { name: 'login' };
formatFor(target, '[', ']');
expect(target).toEqual({ name: 'login' });`
      }
    ],
    solution: `function format(prefix, suffix) {
  return \`\${prefix}\${this.name}\${suffix}\`;
}

function formatFor(target, prefix, suffix) {
  return format.call(target, prefix, suffix);
}`
  }
]
