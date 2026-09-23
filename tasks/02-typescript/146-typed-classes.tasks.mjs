export default [
  {
    id: 'ts-146-class-as-type-and-value',
    title: 'Класс как тип и как значение',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите класс `TestCase` с полями `title: string`, `retries: number` и ' +
      '`tags: readonly string[]`. Конструктор принимает `title` и необязательные ' +
      '`retries` (по умолчанию `0`) и `tags` (по умолчанию пустой список). ' +
      'Методы: `label()` возвращает `<title> (<retries>)`; `withTag(tag)` ' +
      'возвращает **новый** экземпляр с добавленным тегом; статический ' +
      '`fromTitles(titles: string[]): TestCase[]` создаёт список. ' +
      'Напишите также `describeAll(cases: TestCase[]): string[]` — метки всех ' +
      'случаев: тип параметра — сам класс в позиции типа.',
    starter: `class TestCase {
  title: string;
  retries: number;
  tags: readonly string[];

  constructor(title: string, retries = 0, tags: readonly string[] = []) {
    this.title = title;
    this.retries = retries;
    this.tags = tags;
  }

  label(): string { return ''; }

  withTag(tag: string): TestCase { return this; }

  static fromTitles(titles: string[]): TestCase[] { return []; }
}

function describeAll(cases: TestCase[]): string[] {
  return [];
}`,
    hints: [
      'Имя класса можно использовать и как тип, и как значение.',
      'Новый экземпляр создаётся конструктором, а не изменением текущего.',
      'Статический метод принадлежит классу, а не экземпляру.'
    ],
    tests: [
      {
        name: 'метка собирается из полей',
        code: `expect(new TestCase('вход', 2).label()).toBe('вход (2)');
expect(new TestCase('вход').label()).toBe('вход (0)');`
      },
      {
        name: 'добавление тега возвращает новый экземпляр',
        code: `const original = new TestCase('вход');
const tagged = original.withTag('smoke');
expect(tagged === original).toBe(false);
expect(tagged.tags).toEqual(['smoke']);
expect(original.tags).toEqual([]);`
      },
      {
        name: 'новый экземпляр сохраняет остальные поля',
        code: `const tagged = new TestCase('вход', 3, ['api']).withTag('smoke');
expect(tagged.title).toBe('вход');
expect(tagged.retries).toBe(3);
expect(tagged.tags).toEqual(['api', 'smoke']);`
      },
      {
        name: 'статическая фабрика создаёт список',
        code: `const cases = TestCase.fromTitles(['вход', 'оплата']);
expect(cases).toHaveLength(2);
expect(cases[0] instanceof TestCase).toBe(true);
expect(cases[1].label()).toBe('оплата (0)');`
      },
      {
        name: 'класс в позиции типа',
        code: `expect(describeAll(TestCase.fromTitles(['a', 'b']))).toEqual(['a (0)', 'b (0)']);`
      },
      {
        name: 'пустой список',
        code: `expect(TestCase.fromTitles([])).toEqual([]);
expect(describeAll([])).toEqual([]);`
      }
    ],
    solution: `class TestCase {
  title: string;
  retries: number;
  tags: readonly string[];

  constructor(title: string, retries = 0, tags: readonly string[] = []) {
    this.title = title;
    this.retries = retries;
    this.tags = tags;
  }

  label(): string {
    return this.title + ' (' + this.retries + ')';
  }

  withTag(tag: string): TestCase {
    return new TestCase(this.title, this.retries, [...this.tags, tag]);
  }

  static fromTitles(titles: string[]): TestCase[] {
    return titles.map(title => new TestCase(title));
  }
}

function describeAll(cases: TestCase[]): string[] {
  return cases.map(testCase => testCase.label());
}`
  }
]
