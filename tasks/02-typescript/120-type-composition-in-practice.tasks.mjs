export default [
  {
    id: 'ts-120-impossible-state',
    title: 'Невозможное состояние нельзя выразить',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Опишите результат шага как объединение по признаку: ' +
      '`{ state: "running"; startedAt: string }`, ' +
      '`{ state: "passed"; durationMs: number }`, ' +
      '`{ state: "failed"; durationMs: number; error: string }`. ' +
      'Напишите `describe(result)` — строка: для `running` — ' +
      '`идёт с <startedAt>`, для `passed` — `прошёл за <durationMs>мс`, ' +
      'для `failed` — `упал за <durationMs>мс: <error>`. Ветка по умолчанию ' +
      'должна опираться на `never` и выбрасывать ошибку ' +
      '`неизвестное состояние`. Ещё напишите `isFinished(result)`: истина для ' +
      '`passed` и `failed`.',
    starter: `type StepResult =
  | { state: 'running'; startedAt: string }
  | { state: 'passed'; durationMs: number }
  | { state: 'failed'; durationMs: number; error: string };

function describe(result: StepResult): string {
  return '';
}

function isFinished(result: StepResult): boolean {
  return false;
}`,
    hints: [
      'Поле-признак позволяет компилятору сузить тип в каждой ветке.',
      'Присваивание значения переменной типа never ловит необработанный вариант.',
      'Завершённость определяется набором состояний, а не наличием поля.'
    ],
    tests: [
      {
        name: 'идущий шаг',
        code: `expect(describe({ state: 'running', startedAt: '10:00' })).toBe('идёт с 10:00');`
      },
      {
        name: 'успешный шаг',
        code: `expect(describe({ state: 'passed', durationMs: 120 })).toBe('прошёл за 120мс');`
      },
      {
        name: 'упавший шаг',
        code: `expect(describe({ state: 'failed', durationMs: 90, error: 'таймаут' }))
  .toBe('упал за 90мс: таймаут');`
      },
      {
        name: 'неизвестное состояние отвергается',
        code: `let message = '';
try { describe({ state: 'skipped' } as unknown as StepResult); }
catch (error) { message = (error as Error).message; }
expect(message).toBe('неизвестное состояние');`
      },
      {
        name: 'завершённость определяется состоянием',
        code: `expect(isFinished({ state: 'running', startedAt: '10:00' })).toBe(false);
expect(isFinished({ state: 'passed', durationMs: 1 })).toBe(true);
expect(isFinished({ state: 'failed', durationMs: 1, error: 'x' })).toBe(true);`
      },
      {
        name: 'нулевая длительность допустима',
        code: `expect(describe({ state: 'passed', durationMs: 0 })).toBe('прошёл за 0мс');`
      }
    ],
    solution: `type StepResult =
  | { state: 'running'; startedAt: string }
  | { state: 'passed'; durationMs: number }
  | { state: 'failed'; durationMs: number; error: string };

function describe(result: StepResult): string {
  switch (result.state) {
    case 'running':
      return 'идёт с ' + result.startedAt;
    case 'passed':
      return 'прошёл за ' + result.durationMs + 'мс';
    case 'failed':
      return 'упал за ' + result.durationMs + 'мс: ' + result.error;
    default: {
      const unknownState: never = result;

      throw new Error('неизвестное состояние');
    }
  }
}

function isFinished(result: StepResult): boolean {
  return result.state === 'passed' || result.state === 'failed';
}`
  }
]
