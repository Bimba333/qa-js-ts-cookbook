export default [
  {
    id: 'ts-108-nested-shape',
    title: 'Форма вложенного объекта',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите тип `TestRun = { id: string; env: { name: string; retries: number }; ' +
      'tags: string[] }`. Напишите `isTestRun(value: unknown): value is TestRun` — ' +
      'проверку формы, включая вложенный объект и элементы массива ' +
      '(все теги должны быть строками). Напишите ' +
      '`summarize(run: TestRun): string`, возвращающую ' +
      '`<id> [<name>] теги: <t1,t2>`; при пустом списке тегов — ' +
      '`<id> [<name>] без тегов`.',
    starter: `type TestRun = {
  id: string;
  env: { name: string; retries: number };
  tags: string[];
};

function isTestRun(value: unknown): value is TestRun {
  return false;
}

function summarize(run: TestRun): string {
  return '';
}`,
    hints: [
      'Вложенный объект проверяется теми же правилами, что и внешний.',
      'Массив проверяется через Array.isArray и тип каждого элемента.',
      'Пустой список тегов — отдельный случай вывода.'
    ],
    tests: [
      {
        name: 'полная форма проходит',
        code: `expect(isTestRun({
  id: 'R-1',
  env: { name: 'ci', retries: 2 },
  tags: ['smoke']
})).toBe(true);`
      },
      {
        name: 'неверный вложенный объект не проходит',
        code: `expect(isTestRun({ id: 'R-1', env: { name: 'ci' }, tags: [] })).toBe(false);
expect(isTestRun({ id: 'R-1', env: null, tags: [] })).toBe(false);`
      },
      {
        name: 'нестроковый тег не проходит',
        code: `expect(isTestRun({ id: 'R-1', env: { name: 'ci', retries: 1 }, tags: [1] })).toBe(false);`
      },
      {
        name: 'массив вместо объекта не проходит',
        code: `expect(isTestRun([])).toBe(false);
expect(isTestRun(null)).toBe(false);`
      },
      {
        name: 'сводка собирается',
        code: `expect(summarize({ id: 'R-1', env: { name: 'ci', retries: 1 }, tags: ['smoke', 'api'] }))
  .toBe('R-1 [ci] теги: smoke,api');`
      },
      {
        name: 'пустые теги выводятся отдельно',
        code: `expect(summarize({ id: 'R-2', env: { name: 'local', retries: 0 }, tags: [] }))
  .toBe('R-2 [local] без тегов');`
      },
      {
        name: 'лишние поля форме не мешают',
        code: `expect(isTestRun({
  id: 'R-1',
  env: { name: 'ci', retries: 1 },
  tags: [],
  extra: true
})).toBe(true);`
      }
    ],
    solution: `type TestRun = {
  id: string;
  env: { name: string; retries: number };
  tags: string[];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTestRun(value: unknown): value is TestRun {
  if (!isObject(value)) {
    return false;
  }

  if (typeof value.id !== 'string') {
    return false;
  }

  const env = value.env;

  if (!isObject(env) || typeof env.name !== 'string' || typeof env.retries !== 'number') {
    return false;
  }

  return Array.isArray(value.tags)
    && value.tags.every(tag => typeof tag === 'string');
}

function summarize(run: TestRun): string {
  const head = run.id + ' [' + run.env.name + ']';

  return run.tags.length === 0
    ? head + ' без тегов'
    : head + ' теги: ' + run.tags.join(',');
}`
  }
]
