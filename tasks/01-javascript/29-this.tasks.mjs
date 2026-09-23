export default [
  {
    id: 'js-29-reporter-method',
    title: 'Метод, читающий своё состояние',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `createReporter(name)`, которая возвращает объект с полем ' +
      '`name` и методом `describe(testName)`. Метод возвращает строку вида ' +
      '`console reporter: login` и должен брать имя из самого объекта через `this`.',
    starter: `function createReporter(name) {
  return {
    name,
    describe(testName) {
      // Возьмите имя отчёта из самого объекта.
    }
  };
}`,
    hints: [
      'Внутри метода объект доступен через this.',
      'Метод-стрелка в литерале объекта не получает сам объект — нужна обычная запись метода.',
      'Строку удобно собрать шаблонным литералом.'
    ],
    tests: [
      {
        name: 'подставляет имя отчёта',
        code: `const reporter = createReporter('console reporter');
expect(reporter.describe('login')).toBe('console reporter: login');`
      },
      {
        name: 'работает после изменения поля',
        code: `const reporter = createReporter('первый');
reporter.name = 'второй';
expect(reporter.describe('order')).toBe('второй: order');`
      },
      {
        name: 'два отчёта независимы',
        code: `const first = createReporter('a');
const second = createReporter('b');
expect(first.describe('x') + ' | ' + second.describe('y')).toBe('a: x | b: y');`
      },
      {
        name: 'метод читает состояние объекта, а не замкнутый параметр',
        code: `const reporter = createReporter('исходное');
const copy = { name: 'чужое', describe: reporter.describe };
expect(copy.describe('login')).toBe('чужое: login');`
      }
    ],
    solution: `function createReporter(name) {
  return {
    name,
    describe(testName) {
      return \`\${this.name}: \${testName}\`;
    }
  };
}`
  },

  {
    id: 'js-29-safe-callback',
    title: 'Метод, переданный в колбэк',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Дан объект `counter` с полем `total` и методом `add(value)`, который ' +
      'увеличивает `this.total`. Напишите функцию `sumAll(counter, values)`, которая ' +
      'применяет метод к каждому элементу массива через `forEach()` и возвращает ' +
      'итоговое значение `counter.total`. Привязка объекта не должна теряться.',
    starter: `function sumAll(counter, values) {
  // Переданный в forEach метод потеряет свой объект.

  return counter.total;
}`,
    hints: [
      'Метод, переданный как значение, вызывается без объекта перед точкой.',
      'Сохранить привязку можно стрелочной обёрткой.',
      'Проверьте, что counter.total действительно изменился.'
    ],
    tests: [
      {
        name: 'суммирует значения',
        code: `const counter = { total: 0, add(value) { this.total += value; } };
expect(sumAll(counter, [1, 2, 3])).toBe(6);`
      },
      {
        name: 'изменяет сам объект',
        code: `const counter = { total: 10, add(value) { this.total += value; } };
sumAll(counter, [5]);
expect(counter.total).toBe(15);`
      },
      {
        name: 'для пустого массива возвращает исходное значение',
        code: `const counter = { total: 7, add(value) { this.total += value; } };
expect(sumAll(counter, [])).toBe(7);`
      },
      {
        name: 'не использует глобальное состояние',
        code: `const first = { total: 0, add(value) { this.total += value; } };
const second = { total: 0, add(value) { this.total += value; } };
sumAll(first, [1, 1]);
expect(second.total).toBe(0);`
      }
    ],
    solution: `function sumAll(counter, values) {
  values.forEach((value) => counter.add(value));

  return counter.total;
}`
  }
]
