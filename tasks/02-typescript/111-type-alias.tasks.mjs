export default [
  {
    id: 'ts-111-test-result-alias',
    title: 'Type alias для результата теста',
    difficulty: 'easy',
    lang: 'ts',
    prompt:
      'Объявите type alias `TestResult` с полями `name: string`, `status` ' +
      '(одно из `"passed" | "failed" | "skipped"`) и необязательным `durationMs: number`. ' +
      'Затем напишите функцию `describe(result: TestResult): string`, которая возвращает ' +
      '`"<имя>: <статус>"`, а при наличии длительности — `"<имя>: <статус> (<мс> мс)"`.',
    starter: `type TestResult = {
  // Опишите поля результата теста.
};

function describe(result: TestResult): string {
  // Верните строку по правилам из условия.
  return '';
}`,
    hints: [
      'Объединение literal types записывается через вертикальную черту.',
      'Необязательное поле помечается знаком вопроса после имени.',
      'Отсутствующее необязательное поле равно undefined — это и нужно проверить.'
    ],
    tests: [
      {
        name: 'описывает результат без длительности',
        code: `expect(describe({ name: 'логин', status: 'passed' })).toBe('логин: passed');`
      },
      {
        name: 'добавляет длительность, когда она задана',
        code: `expect(describe({ name: 'логин', status: 'failed', durationMs: 120 }))
  .toBe('логин: failed (120 мс)');`
      },
      {
        name: 'поддерживает статус skipped',
        code: `expect(describe({ name: 'экспорт', status: 'skipped' })).toBe('экспорт: skipped');`
      },
      {
        name: 'нулевая длительность считается заданной',
        code: `expect(describe({ name: 'быстрый', status: 'passed', durationMs: 0 }))
  .toBe('быстрый: passed (0 мс)');`
      }
    ],
    solution: `type TestResult = {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  durationMs?: number;
};

function describe(result: TestResult): string {
  const base = result.name + ': ' + result.status;

  return result.durationMs === undefined
    ? base
    : base + ' (' + result.durationMs + ' мс)';
}`
  }
]
