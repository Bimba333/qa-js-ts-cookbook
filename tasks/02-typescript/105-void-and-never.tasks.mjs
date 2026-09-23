export default [
  {
    id: 'ts-105-void-and-never',
    title: '`void` игнорирует результат, `never` не возвращается',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `forEachStep(steps: string[], action: (step: string) => void): number` — ' +
      'вызывает `action` для каждого шага и возвращает число вызовов. ' +
      'Значение, которое вернул `action`, должно игнорироваться: наружу оно не ' +
      'попадает. Напишите `fail(message: string): never`, которая всегда ' +
      'выбрасывает ошибку с этим сообщением. И `runSafely(steps, action)`, ' +
      'которая вызывает `forEachStep` и возвращает ' +
      '`{ calls, failedAt }`: число вызовов до ошибки и текст ошибки ' +
      '(`null`, если ошибки не было).',
    starter: `function forEachStep(steps: string[], action: (step: string) => void): number {
  return 0;
}

function fail(message: string): never {
  throw new Error('');
}

function runSafely(steps: string[], action: (step: string) => void) {
  return { calls: 0, failedAt: null as string | null };
}`,
    hints: [
      'Тип void в результате колбэка означает «результат не нужен», а не «его нет».',
      'Функция с типом never не возвращает управление обычным путём.',
      'Число выполненных вызовов надо знать и в случае ошибки.'
    ],
    tests: [
      {
        name: 'считает вызовы',
        code: `expect(forEachStep(['a', 'b', 'c'], () => {})).toBe(3);`
      },
      {
        name: 'результат колбэка игнорируется',
        code: `expect(forEachStep(['a'], () => 42 as unknown as void)).toBe(1);`
      },
      {
        name: 'пустой список вызовов не делает',
        code: `let calls = 0;
expect(forEachStep([], () => { calls += 1; })).toBe(0);
expect(calls).toBe(0);`
      },
      {
        name: 'fail всегда выбрасывает',
        code: `let message = '';
try { fail('шаг невозможен'); } catch (error) { message = (error as Error).message; }
expect(message).toBe('шаг невозможен');`
      },
      {
        name: 'успешный прогон без ошибки',
        code: `expect(runSafely(['a', 'b'], () => {})).toEqual({ calls: 2, failedAt: null });`
      },
      {
        name: 'ошибка останавливает обход и запоминается',
        code: `const result = runSafely(['a', 'b', 'c'], step => {
  if (step === 'b') fail('шаг b невозможен');
});
expect(result.calls).toBe(1);
expect(result.failedAt).toBe('шаг b невозможен');`
      }
    ],
    solution: `function forEachStep(steps: string[], action: (step: string) => void): number {
  let calls = 0;

  for (const step of steps) {
    action(step);
    calls += 1;
  }

  return calls;
}

function fail(message: string): never {
  throw new Error(message);
}

function runSafely(steps: string[], action: (step: string) => void) {
  let calls = 0;

  try {
    forEachStep(steps, step => {
      action(step);
      calls += 1;
    });

    return { calls, failedAt: null as string | null };
  } catch (error) {
    return { calls, failedAt: (error as Error).message };
  }
}`
  }
]
