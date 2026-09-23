export default [
  {
    id: 'qa-225-one-variable-at-a-time',
    title: 'Одна переменная за раз',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Расследование движется, когда между попытками меняется ровно одно ' +
      'условие. Напишите `reviewExperiments(baseline, experiments)`, где условия — ' +
      'плоские объекты. Верните массив ' +
      '`{ name, changed, verdict }` в порядке попыток: `changed` — отсортированные ' +
      'имена изменённых относительно **базового** набора условий, `verdict` — ' +
      '`"пригоден"` при ровно одном изменении, `"ничего не изменено"` при нуле и ' +
      '`"изменено несколько условий"` при двух и более. Новое условие, ' +
      'отсутствующее в базовом наборе, тоже считается изменением.',
    starter: `function reviewExperiments(baseline, experiments) {
  // Сравнение идёт с базовым набором, а не с предыдущей попыткой.

  return [];
}`,
    hints: [
      'Сравнивать нужно объединение ключей базового набора и попытки.',
      'Отсутствие условия в попытке — тоже изменение.',
      'Имена изменённых условий сортируются, чтобы отчёт был предсказуемым.'
    ],
    tests: [
      {
        name: 'одно изменение пригодно',
        code: `expect(reviewExperiments(
  { browser: 'chromium', workers: 4 },
  [{ name: 'один worker', conditions: { browser: 'chromium', workers: 1 } }]
)).toEqual([{ name: 'один worker', changed: ['workers'], verdict: 'пригоден' }]);`
      },
      {
        name: 'два изменения непригодны',
        code: `expect(reviewExperiments(
  { browser: 'chromium', workers: 4 },
  [{ name: 'другой браузер и worker', conditions: { browser: 'firefox', workers: 1 } }]
)[0]).toEqual({
  name: 'другой браузер и worker',
  changed: ['browser', 'workers'],
  verdict: 'изменено несколько условий'
});`
      },
      {
        name: 'повтор без изменений',
        code: `expect(reviewExperiments(
  { browser: 'chromium' },
  [{ name: 'повтор', conditions: { browser: 'chromium' } }]
)[0].verdict).toBe('ничего не изменено');`
      },
      {
        name: 'новое условие считается изменением',
        code: `expect(reviewExperiments(
  { browser: 'chromium' },
  [{ name: 'с задержкой', conditions: { browser: 'chromium', delayMs: 100 } }]
)[0]).toEqual({ name: 'с задержкой', changed: ['delayMs'], verdict: 'пригоден' });`
      },
      {
        name: 'убранное условие считается изменением',
        code: `expect(reviewExperiments(
  { browser: 'chromium', workers: 4 },
  [{ name: 'без workers', conditions: { browser: 'chromium' } }]
)[0].changed).toEqual(['workers']);`
      },
      {
        name: 'сравнение идёт с базовым набором, а не с предыдущей попыткой',
        code: `const reviewed = reviewExperiments(
  { browser: 'chromium', workers: 4 },
  [
    { name: 'первая', conditions: { browser: 'chromium', workers: 1 } },
    { name: 'вторая', conditions: { browser: 'chromium', workers: 2 } }
  ]
);
expect(reviewed.map(item => item.changed)).toEqual([['workers'], ['workers']]);`
      },
      {
        name: 'имена изменённых условий отсортированы',
        code: `expect(reviewExperiments(
  { a: 1, b: 2, c: 3 },
  [{ name: 'все', conditions: { a: 9, b: 9, c: 9 } }]
)[0].changed).toEqual(['a', 'b', 'c']);`
      }
    ],
    solution: `function reviewExperiments(baseline, experiments) {
  return experiments.map(experiment => {
    const keys = new Set([
      ...Object.keys(baseline),
      ...Object.keys(experiment.conditions)
    ]);

    const changed = [...keys]
      .filter(key => baseline[key] !== experiment.conditions[key])
      .sort();

    let verdict = 'пригоден';

    if (changed.length === 0) {
      verdict = 'ничего не изменено';
    } else if (changed.length > 1) {
      verdict = 'изменено несколько условий';
    }

    return { name: experiment.name, changed, verdict };
  });
}`
  }
]
