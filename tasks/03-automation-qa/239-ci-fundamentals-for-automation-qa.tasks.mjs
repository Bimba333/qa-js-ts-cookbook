export default [
  {
    id: 'qa-239-exit-code-is-the-signal',
    title: 'Код завершения — единственный надёжный сигнал',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `evaluateRun(run)`, где `run` — `{ exitCode, stdout, reportExists, ' +
      'testsTotal, failed }`. Верните `{ verdict, reasons }`. Вердикт `"провал"` ' +
      'при ненулевом коде завершения; `"ненадёжно"`, если код нулевой, но есть ' +
      'признаки того, что прогон бессмысленен: отчёта нет, тестов ноль или в ' +
      'выводе встречается `No tests found`; иначе `"успех"`. ' +
      '`reasons` — список причин в порядке: `ненулевой код завершения`, ' +
      '`отчёт не создан`, `тестов не выполнено`, `в выводе нет тестов`. ' +
      'При успехе список пуст.',
    starter: `function evaluateRun(run) {
  // Зелёный прогон, в котором ничего не выполнялось, — не успех.

  return { verdict: 'успех', reasons: [] };
}`,
    hints: [
      'Ненулевой код завершения перекрывает всё остальное, но причины всё равно собираются.',
      'Ноль тестов и отсутствие отчёта — разные признаки.',
      'Порядок причин задан условием и не зависит от данных.'
    ],
    tests: [
      {
        name: 'обычный успешный прогон',
        code: `expect(evaluateRun({
  exitCode: 0, stdout: '12 passed', reportExists: true, testsTotal: 12, failed: 0
})).toEqual({ verdict: 'успех', reasons: [] });`
      },
      {
        name: 'ненулевой код завершения — провал',
        code: `const failed = evaluateRun({
  exitCode: 1, stdout: '1 failed', reportExists: true, testsTotal: 12, failed: 1
});
expect(failed.verdict).toBe('провал');
expect(failed.reasons).toEqual(['ненулевой код завершения']);`
      },
      {
        name: 'зелёный прогон без тестов ненадёжен',
        code: `const empty = evaluateRun({
  exitCode: 0, stdout: 'No tests found', reportExists: true, testsTotal: 0, failed: 0
});
expect(empty.verdict).toBe('ненадёжно');
expect(empty.reasons).toEqual(['тестов не выполнено', 'в выводе нет тестов']);`
      },
      {
        name: 'отсутствие отчёта замечается',
        code: `const noReport = evaluateRun({
  exitCode: 0, stdout: '5 passed', reportExists: false, testsTotal: 5, failed: 0
});
expect(noReport.verdict).toBe('ненадёжно');
expect(noReport.reasons).toEqual(['отчёт не создан']);`
      },
      {
        name: 'причины идут в заданном порядке',
        code: `const broken = evaluateRun({
  exitCode: 2, stdout: 'No tests found', reportExists: false, testsTotal: 0, failed: 0
});
expect(broken.reasons).toEqual([
  'ненулевой код завершения',
  'отчёт не создан',
  'тестов не выполнено',
  'в выводе нет тестов'
]);`
      },
      {
        name: 'провал важнее ненадёжности',
        code: `expect(evaluateRun({
  exitCode: 1, stdout: '', reportExists: false, testsTotal: 0, failed: 0
}).verdict).toBe('провал');`
      }
    ],
    solution: `function evaluateRun(run) {
  const { exitCode, stdout, reportExists, testsTotal } = run;
  const reasons = [];

  if (exitCode !== 0) reasons.push('ненулевой код завершения');
  if (!reportExists) reasons.push('отчёт не создан');
  if (testsTotal === 0) reasons.push('тестов не выполнено');
  if (stdout.includes('No tests found')) reasons.push('в выводе нет тестов');

  if (exitCode !== 0) {
    return { verdict: 'провал', reasons };
  }

  return { verdict: reasons.length > 0 ? 'ненадёжно' : 'успех', reasons };
}`
  }
]
