export default [
  {
    id: 'ts-147-private-field-is-real',
    title: 'Приватность до запуска и во время выполнения',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите класс `TestRun` с полем `#secretToken` (настоящее приватное поле ' +
      'JavaScript), полем `private attempts: number` и публичным ' +
      '`readonly id: string`. Конструктор принимает `id` и `token`. ' +
      'Методы: `retry()` увеличивает `attempts` и возвращает новое значение; ' +
      '`maskedToken()` возвращает `***` плюс последние три символа токена; ' +
      '`hasToken(value: unknown)` — статический метод, возвращающий `true`, если ' +
      'значение является экземпляром `TestRun` (проверяйте через `#secretToken in value`).',
    starter: `class TestRun {
  readonly id: string;

  constructor(id: string, token: string) {
    this.id = id;
  }

  retry(): number { return 0; }

  maskedToken(): string { return ''; }

  static hasToken(value: unknown): boolean { return false; }
}`,
    hints: [
      'Поле с решёткой недоступно снаружи не только компилятору, но и коду.',
      'Модификатор private стирается при компиляции, а решётка — нет.',
      'Оператор in с приватным полем отвечает, принадлежит ли объект классу.'
    ],
    tests: [
      {
        name: 'счётчик попыток растёт',
        code: `const run = new TestRun('R-1', 'abc123xyz');
expect(run.retry()).toBe(1);
expect(run.retry()).toBe(2);`
      },
      {
        name: 'токен маскируется',
        code: `expect(new TestRun('R-1', 'abc123xyz').maskedToken()).toBe('***xyz');`
      },
      {
        name: 'приватное поле недоступно снаружи',
        code: `const run = new TestRun('R-1', 'abc123xyz');
expect(Object.keys(run).includes('secretToken')).toBe(false);
expect(JSON.stringify(run).includes('abc123xyz')).toBe(false);`
      },
      {
        name: 'private стирается: поле видно во время выполнения',
        code: `const run = new TestRun('R-1', 'abc123xyz');
run.retry();
expect(Object.keys(run).includes('attempts')).toBe(true);`
      },
      {
        name: 'принадлежность классу определяется по приватному полю',
        code: `expect(TestRun.hasToken(new TestRun('R-1', 'abc'))).toBe(true);
expect(TestRun.hasToken({ id: 'R-1' })).toBe(false);
expect(TestRun.hasToken(null)).toBe(false);`
      },
      {
        name: 'идентификатор доступен на чтение',
        code: `expect(new TestRun('R-7', 'abc').id).toBe('R-7');`
      }
    ],
    solution: `class TestRun {
  readonly id: string;

  #secretToken: string;

  private attempts = 0;

  constructor(id: string, token: string) {
    this.id = id;
    this.#secretToken = token;
  }

  retry(): number {
    this.attempts += 1;

    return this.attempts;
  }

  maskedToken(): string {
    return '***' + this.#secretToken.slice(-3);
  }

  static hasToken(value: unknown): boolean {
    return typeof value === 'object' && value !== null && #secretToken in value;
  }
}`
  }
]
