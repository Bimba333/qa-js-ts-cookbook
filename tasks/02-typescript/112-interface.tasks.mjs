export default [
  {
    id: 'ts-112-contract-and-extension',
    title: 'Договор и его расширение',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите `interface Step { name: string; run(): string }` и ' +
      '`interface RetriableStep extends Step { retries: number }`. Напишите ' +
      '`runAll(steps: Step[]): string[]` — результаты вызова `run()` в порядке ' +
      'шагов. Напишите `runWithRetries(step: RetriableStep): string` — вызывает ' +
      '`run()` и при ошибке повторяет, всего не больше `retries + 1` попыток; ' +
      'если все попытки исчерпаны, выбрасывает **последнюю** ошибку. ' +
      'Шаг, объявленный как `Step`, подходит везде, где ожидается `Step`, ' +
      'даже если он на самом деле `RetriableStep`.',
    starter: `interface Step {
  name: string;
  run(): string;
}

interface RetriableStep extends Step {
  retries: number;
}

function runAll(steps: Step[]): string[] {
  return [];
}

function runWithRetries(step: RetriableStep): string {
  return '';
}`,
    hints: [
      'Наследник интерфейса удовлетворяет и базовому договору.',
      'Число попыток на единицу больше числа повторов.',
      'Последняя ошибка должна дойти до вызывающего кода как есть.'
    ],
    tests: [
      {
        name: 'шаги выполняются по порядку',
        code: `expect(runAll([
  { name: 'a', run: () => 'первый' },
  { name: 'b', run: () => 'второй' }
])).toEqual(['первый', 'второй']);`
      },
      {
        name: 'пустой список шагов',
        code: `expect(runAll([])).toEqual([]);`
      },
      {
        name: 'успех с первой попытки',
        code: `let calls = 0;
expect(runWithRetries({ name: 'a', retries: 2, run: () => { calls += 1; return 'ок'; } }))
  .toBe('ок');
expect(calls).toBe(1);`
      },
      {
        name: 'повтор после ошибки',
        code: `let attempts = 0;
const result = runWithRetries({
  name: 'a',
  retries: 2,
  run: () => {
    attempts += 1;
    if (attempts < 3) throw new Error('неудача ' + attempts);
    return 'ок';
  }
});
expect(result).toBe('ок');
expect(attempts).toBe(3);`
      },
      {
        name: 'попытки исчерпаны — последняя ошибка наружу',
        code: `let tries = 0;
let message = '';
try {
  runWithRetries({
    name: 'a',
    retries: 1,
    run: () => { tries += 1; throw new Error('неудача ' + tries); }
  });
} catch (error) { message = (error as Error).message; }
expect(tries).toBe(2);
expect(message).toBe('неудача 2');`
      },
      {
        name: 'наследник подходит там, где ожидается базовый договор',
        code: `const retriable: RetriableStep = { name: 'a', retries: 0, run: () => 'ок' };
expect(runAll([retriable])).toEqual(['ок']);`
      }
    ],
    solution: `interface Step {
  name: string;
  run(): string;
}

interface RetriableStep extends Step {
  retries: number;
}

function runAll(steps: Step[]): string[] {
  return steps.map(step => step.run());
}

function runWithRetries(step: RetriableStep): string {
  const attempts = step.retries + 1;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return step.run();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}`
  }
]
