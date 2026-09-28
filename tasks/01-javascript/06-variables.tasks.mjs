export default [
  {
    id: 'js-06-declaration-stages',
    title: 'Объявление, инициализация, присваивание',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `describeBinding()`, которая возвращает объект ' +
      '`{ afterDeclaration, afterInitialization, afterReassignment, constError, ' +
      'constPropertyChanged }`. Первые три поля — значение переменной `let` ' +
      'сразу после объявления без инициализации, после присваивания строки ' +
      '`первое` и после присваивания строки `второе`. `constError` — имя ошибки ' +
      'при попытке присвоить новое значение имени, объявленному через `const`. ' +
      '`constPropertyChanged` — удалось ли изменить свойство объекта, который ' +
      'хранится в `const`.',
    starter: `function describeBinding() {
  // Попытку присваивания в const нужно обернуть в try/catch.

  return {
    afterDeclaration: null,
    afterInitialization: '',
    afterReassignment: '',
    constError: '',
    constPropertyChanged: false
  };
}`,
    hints: [
      'Объявление без инициализации даёт имени значение `undefined` — это значение, а не отсутствие имени.',
      'Повторное присваивание имени `const` бросает `TypeError`; поймать его можно только через `try/catch`.',
      '`const` запрещает менять само имя, но не запрещает менять объект, на который оно указывает.'
    ],
    tests: [
      {
        name: 'объявление без инициализации даёт `undefined`',
        code: `expect(describeBinding().afterDeclaration).toBe(undefined);`
      },
      {
        name: 'инициализация и повторное присваивание',
        code: `const report = describeBinding();
expect(report.afterInitialization).toBe('первое');
expect(report.afterReassignment).toBe('второе');`
      },
      {
        name: 'присваивание в `const` даёт `TypeError`',
        code: `expect(describeBinding().constError).toBe('TypeError');`
      },
      {
        name: 'свойство объекта в `const` меняется',
        code: `expect(describeBinding().constPropertyChanged).toBe(true);`
      }
    ],
    solution: `function describeBinding() {
  let value;
  const afterDeclaration = value;

  value = 'первое';
  const afterInitialization = value;

  value = 'второе';
  const afterReassignment = value;

  const fixed = 'нельзя менять';
  let constError = 'нет ошибки';

  try {
    fixed = 'попытка';
  } catch (error) {
    constError = error.name;
  }

  const config = { retries: 1 };
  config.retries = 2;

  return {
    afterDeclaration,
    afterInitialization,
    afterReassignment,
    constError,
    constPropertyChanged: config.retries === 2
  };
}`
  }
]
