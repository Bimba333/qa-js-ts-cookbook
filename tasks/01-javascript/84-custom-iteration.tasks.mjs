export default [
  {
    id: 'js-84-iterable-collection',
    title: 'Своя коллекция, пригодная для for...of',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `createSuite(name)` — коллекцию тестов с методами ' +
      '`add(title, status)`, `size()` и итерацией. Обход через `for...of` даёт ' +
      'объекты `{ title, status }` в порядке добавления, и **каждый** обход ' +
      'начинается сначала. Добавьте метод `failed()`, возвращающий итерируемое ' +
      'значение только с упавшими тестами. Коллекция должна работать со ' +
      'спред-оператором и с `Array.from`.',
    starter: `function createSuite(name) {
  return {
    add(title, status) {},
    size() { return 0; }
  };
}`,
    hints: [
      'Symbol.iterator должен возвращать НОВЫЙ итератор при каждом вызове.',
      'Функция-генератор — самый короткий способ такой итератор получить.',
      'Отбор упавших тоже должен быть итерируемым, а не массивом.'
    ],
    tests: [
      {
        name: 'обход даёт добавленные тесты',
        code: `const suite = createSuite('smoke');
suite.add('вход', 'passed');
suite.add('оплата', 'failed');
expect([...suite]).toEqual([
  { title: 'вход', status: 'passed' },
  { title: 'оплата', status: 'failed' }
]);`
      },
      {
        name: 'повторный обход начинается сначала',
        code: `const suite = createSuite('smoke');
suite.add('вход', 'passed');
expect([...suite]).toEqual([...suite]);
expect([...suite]).toHaveLength(1);`
      },
      {
        name: 'размер отражает добавления',
        code: `const suite = createSuite('smoke');
expect(suite.size()).toBe(0);
suite.add('вход', 'passed');
expect(suite.size()).toBe(1);`
      },
      {
        name: 'отбор упавших итерируем',
        code: `const suite = createSuite('smoke');
suite.add('вход', 'passed');
suite.add('оплата', 'failed');
suite.add('отчёт', 'failed');
expect([...suite.failed()].map(test => test.title)).toEqual(['оплата', 'отчёт']);`
      },
      {
        name: 'работает с Array.from и for...of',
        code: `const suite = createSuite('smoke');
suite.add('вход', 'passed');
const titles = [];
for (const test of suite) titles.push(test.title);
expect(titles).toEqual(['вход']);
expect(Array.from(suite)).toHaveLength(1);`
      },
      {
        name: 'пустая коллекция обходится без ошибок',
        code: `expect([...createSuite('empty')]).toEqual([]);
expect([...createSuite('empty').failed()]).toEqual([]);`
      },
      {
        name: 'коллекции независимы',
        code: `const first = createSuite('a');
const second = createSuite('b');
first.add('вход', 'passed');
expect(second.size()).toBe(0);`
      }
    ],
    solution: `function createSuite(name) {
  const tests = [];

  return {
    name,

    add(title, status) {
      tests.push({ title, status });
    },

    size() {
      return tests.length;
    },

    failed() {
      return {
        *[Symbol.iterator]() {
          for (const test of tests) {
            if (test.status === 'failed') {
              yield test;
            }
          }
        }
      };
    },

    *[Symbol.iterator]() {
      for (const test of tests) {
        yield test;
      }
    }
  };
}`
  }
]
