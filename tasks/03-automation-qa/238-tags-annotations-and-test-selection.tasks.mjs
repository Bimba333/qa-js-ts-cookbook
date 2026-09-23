export default [
  {
    id: 'qa-238-select-tests',
    title: 'Отбор тестов по тегам',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `selectTests(tests, filter)`. Тест — объект `{ title, tags }`. ' +
      'Фильтр может содержать `include` (массив тегов: тест подходит, если есть ' +
      '**хотя бы один** из них), `exclude` (массив тегов: тест отбрасывается, если ' +
      'есть **хотя бы один**) и `titleContains` (подстрока заголовка, регистр ' +
      'не важен). Заданные условия применяются вместе. Пустой фильтр возвращает ' +
      'все тесты. Исключение сильнее включения. Порядок тестов сохраняется, ' +
      'исходный массив не изменяется.',
    starter: `function selectTests(tests, filter) {
  // Отбор строит представление набора, а не копию каждого теста.

  return [];
}`,
    hints: [
      'Незаданное условие не должно ничего отбрасывать.',
      'Исключение проверяется после включения.',
      'Сравнение заголовка не должно зависеть от регистра.'
    ],
    tests: [
      {
        name: 'пустой фильтр возвращает всё',
        code: `const all = [{ title: 'a', tags: [] }, { title: 'b', tags: ['smoke'] }];
expect(selectTests(all, {})).toHaveLength(2);`
      },
      {
        name: 'включение по любому из тегов',
        code: `const tests = [
  { title: 'a', tags: ['smoke'] },
  { title: 'b', tags: ['slow'] },
  { title: 'c', tags: ['api', 'smoke'] }
];
expect(selectTests(tests, { include: ['smoke'] }).map(test => test.title)).toEqual(['a', 'c']);`
      },
      {
        name: 'исключение сильнее включения',
        code: `const conflicting = [
  { title: 'a', tags: ['smoke'] },
  { title: 'b', tags: ['smoke', 'flaky'] }
];
expect(selectTests(conflicting, { include: ['smoke'], exclude: ['flaky'] }).map(test => test.title))
  .toEqual(['a']);`
      },
      {
        name: 'подстрока заголовка без учёта регистра',
        code: `const titled = [{ title: 'Login works', tags: [] }, { title: 'Checkout', tags: [] }];
expect(selectTests(titled, { titleContains: 'login' }).map(test => test.title))
  .toEqual(['Login works']);`
      },
      {
        name: 'условия применяются вместе',
        code: `const mixed = [
  { title: 'login smoke', tags: ['smoke'] },
  { title: 'login slow', tags: ['slow'] },
  { title: 'checkout smoke', tags: ['smoke'] }
];
expect(selectTests(mixed, { include: ['smoke'], titleContains: 'login' }).map(test => test.title))
  .toEqual(['login smoke']);`
      },
      {
        name: 'порядок сохраняется, исходный массив не меняется',
        code: `const source = [
  { title: 'b', tags: ['smoke'] },
  { title: 'a', tags: ['smoke'] }
];
expect(selectTests(source, { include: ['smoke'] }).map(test => test.title)).toEqual(['b', 'a']);
expect(source).toHaveLength(2);`
      },
      {
        name: 'тест без тегов не попадает под включение',
        code: `expect(selectTests([{ title: 'a', tags: [] }], { include: ['smoke'] })).toEqual([]);`
      },
      {
        name: 'пустой список включения ничего не отбрасывает',
        code: `expect(selectTests([{ title: 'a', tags: [] }], { include: [] })).toHaveLength(1);`
      }
    ],
    solution: `function selectTests(tests, filter) {
  const { include, exclude, titleContains } = filter;

  const hasAny = (tags, wanted) => wanted.some(tag => tags.includes(tag));

  return tests.filter(test => {
    if (include !== undefined && include.length > 0 && !hasAny(test.tags, include)) {
      return false;
    }

    if (exclude !== undefined && hasAny(test.tags, exclude)) {
      return false;
    }

    if (titleContains !== undefined) {
      return test.title.toLowerCase().includes(titleContains.toLowerCase());
    }

    return true;
  });
}`
  }
]
