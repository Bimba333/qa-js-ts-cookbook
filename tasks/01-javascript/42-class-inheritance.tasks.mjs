export default [
  {
    id: 'js-42-extend-reporter',
    title: 'Наследник с дополненным поведением',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Дан класс `BaseReporter` с методом `line(text)`, возвращающим ' +
      '`<prefix>: <text>`. Напишите класс `TimedReporter`, который наследует его и ' +
      'переопределяет `line`, добавляя в конец ` [ms]` — где `ms` берётся из поля ' +
      '`durationMs`, переданного вторым аргументом конструктора. Родительскую ' +
      'реализацию нужно переиспользовать.',
    starter: `class BaseReporter {
  constructor(prefix) {
    this.prefix = prefix;
  }

  line(text) {
    return \`\${this.prefix}: \${text}\`;
  }
}

class TimedReporter extends BaseReporter {
  // Конструктор должен передать prefix родителю.
}`,
    hints: [
      'Конструктор наследника вызывает родительский до обращения к this.',
      'Родительскую реализацию метода можно вызвать через super.',
      'Дополнение приписывается к результату родительского метода.'
    ],
    tests: [
      {
        name: 'дополняет родительский результат',
        code: `expect(new TimedReporter('api', 120).line('старт')).toBe('api: старт [120]');`
      },
      {
        name: 'остаётся экземпляром родителя',
        code: `expect(new TimedReporter('api', 1) instanceof BaseReporter).toBe(true);`
      },
      {
        name: 'родительский класс не изменился',
        code: `expect(new BaseReporter('api').line('старт')).toBe('api: старт');`
      },
      {
        name: 'два наследника независимы',
        code: `const first = new TimedReporter('a', 1);
const second = new TimedReporter('b', 2);
expect(first.line('x') + ' | ' + second.line('x')).toBe('a: x [1] | b: x [2]');`
      }
    ],
    solution: `class BaseReporter {
  constructor(prefix) {
    this.prefix = prefix;
  }

  line(text) {
    return \`\${this.prefix}: \${text}\`;
  }
}

class TimedReporter extends BaseReporter {
  constructor(prefix, durationMs) {
    super(prefix);
    this.durationMs = durationMs;
  }

  line(text) {
    return \`\${super.line(text)} [\${this.durationMs}]\`;
  }
}`
  },

  {
    id: 'js-42-super-before-this',
    title: 'Порядок вызова super',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `tryBuild(makeInstance)`, которая вызывает переданную функцию ' +
      'и возвращает `{ ok: true }` при успехе или `{ ok: false, isReferenceError: true }`, ' +
      'если была выброшена `ReferenceError`. Это позволит проверить, что обращение к ' +
      '`this` до `super()` в конструкторе наследника недопустимо.',
    starter: `function tryBuild(makeInstance) {
  // Отличите ReferenceError от других ошибок.
}`,
    hints: [
      'Ошибку нужно поймать и проверить её тип.',
      'Проверка типа выполняется через instanceof.',
      'При успехе поле isReferenceError не возвращается.'
    ],
    tests: [
      {
        name: 'успешное создание',
        code: `class Ok { constructor() { this.value = 1; } }
expect(tryBuild(() => new Ok())).toEqual({ ok: true });`
      },
      {
        name: 'обращение к this до super даёт ReferenceError',
        code: `class Parent { constructor() { this.a = 1; } }
class Broken extends Parent {
  constructor() { this.b = 2; super(); }
}
expect(tryBuild(() => new Broken())).toEqual({ ok: false, isReferenceError: true });`
      },
      {
        name: 'корректный наследник создаётся',
        code: `class Parent { constructor() { this.a = 1; } }
class Good extends Parent {
  constructor() { super(); this.b = 2; }
}
expect(tryBuild(() => new Good())).toEqual({ ok: true });`
      },
      {
        name: 'другие ошибки не считаются ReferenceError',
        code: `expect(tryBuild(() => { throw new TypeError('другая'); }))
  .toEqual({ ok: false, isReferenceError: false });`
      }
    ],
    solution: `function tryBuild(makeInstance) {
  try {
    makeInstance();

    return { ok: true };
  } catch (error) {
    return { ok: false, isReferenceError: error instanceof ReferenceError };
  }
}`
  }
]
