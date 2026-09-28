export default [
  {
    id: 'qa-249-pick-next-refactoring',
    title: 'Выбор следующего рефакторинга',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `pickNextRefactoring(signals)`, где сигнал — ' +
      '`{ problem, severity, evidence }`. Сигнал без доказательств ' +
      '(`evidence` — пустой массив) в выбор не участвует: без них разбор не ' +
      'начинается. Из оставшихся выбирается сигнал с наибольшей `severity`; ' +
      'при равенстве — тот, чьё `problem` меньше при обычном сравнении строк. ' +
      'Верните `{ problem, severity, evidence }` выбранного либо `null`, если ' +
      'выбирать не из чего: «ничего не менять» — допустимый исход.',
    starter: `function pickNextRefactoring(signals) {
  // Сигнал без доказательств в выбор не попадает.

  return null;
}`,
    hints: [
      'Сначала отсев по доказательствам, только потом сравнение важности.',
      'При равной важности нужен детерминированный признак, иначе выбор будет зависеть от порядка.',
      'Обычное сравнение строк не зависит от языковых настроек, в отличие от сравнения с учётом языка.'
    ],
    tests: [
      {
        name: 'выбирается самый важный сигнал',
        code: `expect(pickNextRefactoring([
  { problem: 'цикл импортов', severity: 3, evidence: ['граф'] },
  { problem: 'широкая фикстура', severity: 1, evidence: ['обзор'] }
])).toEqual({ problem: 'цикл импортов', severity: 3, evidence: ['граф'] });`
      },
      {
        name: 'сигнал без доказательств игнорируется',
        code: `expect(pickNextRefactoring([
  { problem: 'нужен репозиторий', severity: 9, evidence: [] },
  { problem: 'цикл импортов', severity: 1, evidence: ['граф'] }
]).problem).toBe('цикл импортов');`
      },
      {
        name: 'при равной важности сравниваются имена',
        code: `expect(pickNextRefactoring([
  { problem: 'б', severity: 2, evidence: ['x'] },
  { problem: 'а', severity: 2, evidence: ['y'] }
]).problem).toBe('а');`
      },
      {
        name: 'без подтверждённых проблем ничего не выбирается',
        code: `expect(pickNextRefactoring([
  { problem: 'предчувствие', severity: 5, evidence: [] }
])).toBe(null);`
      },
      {
        name: 'пустой список допустим',
        code: `expect(pickNextRefactoring([])).toBe(null);`
      },
      {
        name: 'порядок входных данных на результат не влияет',
        code: `const signals = [
  { problem: 'а', severity: 2, evidence: ['x'] },
  { problem: 'б', severity: 2, evidence: ['y'] }
];
expect(pickNextRefactoring(signals).problem)
  .toBe(pickNextRefactoring([...signals].reverse()).problem);`
      }
    ],
    solution: `function pickNextRefactoring(signals) {
  const confirmed = signals.filter(signal => signal.evidence.length > 0);

  if (confirmed.length === 0) return null;

  return confirmed.reduce((best, signal) => {
    if (signal.severity !== best.severity) {
      return signal.severity > best.severity ? signal : best;
    }

    return signal.problem < best.problem ? signal : best;
  });
}`
  }
]
