export default [
  {
    id: 'js-41-test-run-class',
    title: 'Класс с состоянием прогона',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите класс `TestRun`, который принимает имя прогона в конструктор, имеет ' +
      'метод `add(status)` для учёта результата и метод `summary()`, возвращающий ' +
      'строку вида `smoke: 2 passed, 1 failed`. Учитываются только статусы ' +
      '`passed` и `failed`.',
    starter: `class TestRun {
  constructor(name) {
    // Сохраните имя и счётчики.
  }

  add(status) {
    // Увеличьте нужный счётчик.
  }

  summary() {
    // Соберите строку отчёта.
  }
}`,
    hints: [
      'Состояние хранится в полях экземпляра через this.',
      'Методы класса лежат в прототипе, но работают с состоянием конкретного объекта.',
      'Неизвестные статусы учитывать не нужно.'
    ],
    tests: [
      {
        name: 'считает результаты',
        code: `const run = new TestRun('smoke');
run.add('passed');
run.add('passed');
run.add('failed');
expect(run.summary()).toBe('smoke: 2 passed, 1 failed');`
      },
      {
        name: 'новый прогон начинается с нулей',
        code: `expect(new TestRun('empty').summary()).toBe('empty: 0 passed, 0 failed');`
      },
      {
        name: 'два прогона независимы',
        code: `const first = new TestRun('a');
const second = new TestRun('b');
first.add('passed');
expect(second.summary()).toBe('b: 0 passed, 0 failed');`
      },
      {
        name: 'неизвестный статус не учитывается',
        code: `const run = new TestRun('smoke');
run.add('skipped');
expect(run.summary()).toBe('smoke: 0 passed, 0 failed');`
      }
    ],
    solution: `class TestRun {
  constructor(name) {
    this.name = name;
    this.passed = 0;
    this.failed = 0;
  }

  add(status) {
    if (status === 'passed') {
      this.passed += 1;
    }

    if (status === 'failed') {
      this.failed += 1;
    }
  }

  summary() {
    return \`\${this.name}: \${this.passed} passed, \${this.failed} failed\`;
  }
}`
  },

  {
    id: 'js-41-methods-in-prototype',
    title: 'Методы живут в прототипе',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите класс `Reporter` с полем `prefix` и методом `line(text)`, ' +
      'возвращающим `<prefix>: <text>`. Затем напишите функцию ' +
      '`sharesMethod(first, second)`, которая возвращает `true`, если два экземпляра ' +
      'используют **один и тот же** объект метода, а не собственные копии.',
    starter: `class Reporter {
  constructor(prefix) {
    // Только состояние, без методов в конструкторе.
  }

  line(text) {
    // Метод класса.
  }
}

function sharesMethod(first, second) {
  // Сравните ссылки на метод у двух экземпляров.
}`,
    hints: [
      'Методы класса создаются один раз и лежат в прототипе.',
      'Если присвоить функцию в конструкторе, у каждого объекта будет своя копия.',
      'Сравнивать нужно ссылки на функции через ===.'
    ],
    tests: [
      {
        name: 'метод работает',
        code: `expect(new Reporter('api').line('старт')).toBe('api: старт');`
      },
      {
        name: 'экземпляры делят один метод',
        code: `expect(sharesMethod(new Reporter('a'), new Reporter('b'))).toBe(true);`
      },
      {
        name: 'метод не является собственным свойством объекта',
        code: `expect(Object.hasOwn(new Reporter('a'), 'line')).toBe(false);`
      },
      {
        name: 'состояние у экземпляров своё',
        code: `const first = new Reporter('a');
const second = new Reporter('b');
expect(first.line('x') + ' | ' + second.line('x')).toBe('a: x | b: x');`
      }
    ],
    solution: `class Reporter {
  constructor(prefix) {
    this.prefix = prefix;
  }

  line(text) {
    return \`\${this.prefix}: \${text}\`;
  }
}

function sharesMethod(first, second) {
  return first.line === second.line;
}`
  }
]
