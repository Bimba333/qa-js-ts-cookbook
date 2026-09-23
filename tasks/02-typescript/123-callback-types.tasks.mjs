export default [
  {
    id: 'ts-123-callback-contract',
    title: 'Договор на будущий вызов',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите `runSteps(steps: string[], options)` — исполнитель шагов. ' +
      '`options` содержит необязательные колбэки `onStep(step: string, index: number): void` ' +
      'и `onError(step: string, error: Error): void`, а также обязательный ' +
      '`run(step: string): void`. Каждый шаг: вызвать `onStep`, затем `run`; ' +
      'если `run` бросил — вызвать `onError` и продолжить со следующего шага. ' +
      'Верните `{ completed, failed }`: списки успешных и упавших шагов. ' +
      'Значение, возвращённое колбэками, игнорируется.',
    starter: `type StepOptions = {
  run: (step: string) => void;
  onStep?: (step: string, index: number) => void;
  onError?: (step: string, error: Error) => void;
};

function runSteps(steps: string[], options: StepOptions) {
  return { completed: [] as string[], failed: [] as string[] };
}`,
    hints: [
      'Необязательный колбэк может отсутствовать: вызывать его нужно осторожно.',
      'Ошибка одного шага не должна прерывать остальные.',
      'Индекс шага передаётся колбэку, а не вычисляется внутри него.'
    ],
    tests: [
      {
        name: 'все шаги выполнены',
        code: `expect(runSteps(['a', 'b'], { run: () => {} }))
  .toEqual({ completed: ['a', 'b'], failed: [] });`
      },
      {
        name: 'колбэк шага получает индекс',
        code: `const seen: string[] = [];
runSteps(['a', 'b'], {
  run: () => {},
  onStep: (step, index) => { seen.push(step + ':' + index); }
});
expect(seen).toEqual(['a:0', 'b:1']);`
      },
      {
        name: 'ошибка не прерывает обход',
        code: `const result = runSteps(['a', 'b', 'c'], {
  run: step => { if (step === 'b') throw new Error('упал'); }
});
expect(result.completed).toEqual(['a', 'c']);
expect(result.failed).toEqual(['b']);`
      },
      {
        name: 'колбэк ошибки получает сам шаг и ошибку',
        code: `const errors: string[] = [];
runSteps(['b'], {
  run: () => { throw new Error('таймаут'); },
  onError: (step, error) => { errors.push(step + ':' + error.message); }
});
expect(errors).toEqual(['b:таймаут']);`
      },
      {
        name: 'отсутствие колбэков не ломает работу',
        code: `expect(runSteps(['a'], { run: () => {} }).completed).toEqual(['a']);`
      },
      {
        name: 'результат колбэка игнорируется',
        code: `const result = runSteps(['a'], {
  run: () => {},
  onStep: (() => 'что-то') as unknown as (step: string, index: number) => void
});
expect(result.completed).toEqual(['a']);`
      },
      {
        name: 'пустой список шагов',
        code: `expect(runSteps([], { run: () => {} })).toEqual({ completed: [], failed: [] });`
      }
    ],
    solution: `type StepOptions = {
  run: (step: string) => void;
  onStep?: (step: string, index: number) => void;
  onError?: (step: string, error: Error) => void;
};

function runSteps(steps: string[], options: StepOptions) {
  const completed: string[] = [];
  const failed: string[] = [];

  steps.forEach((step, index) => {
    options.onStep?.(step, index);

    try {
      options.run(step);
      completed.push(step);
    } catch (error) {
      failed.push(step);
      options.onError?.(step, error as Error);
    }
  });

  return { completed, failed };
}`
  }
]
