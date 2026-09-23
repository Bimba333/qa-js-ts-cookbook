export default [
  {
    id: 'qa-232-classify-results',
    title: 'Классификация по истории запусков',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `classify(runs)`, где `runs` — массив прогонов одного теста вида ' +
      '`{ status: "passed" | "failed", environment }`. Верните одно из значений: ' +
      '`"стабильно проходит"`, `"стабильно падает"`, `"нестабильный"` или ' +
      '`"условия несопоставимы"`. Нестабильным считается тест, у которого ' +
      'при **одинаковом** окружении есть и успехи, и падения. Если результаты ' +
      'различаются, но и окружения разные, вернуть `"условия несопоставимы"`. ' +
      'Пустая история — ошибка `нет данных о прогонах`.',
    starter: `function classify(runs) {
  // Одно падение ещё ничего не доказывает: важны условия.

  return 'стабильно проходит';
}`,
    hints: [
      'Сначала посмотрите, различаются ли результаты вообще.',
      'Различие результатов важно только при одинаковых условиях.',
      'Одинаковость окружения проверяется по всему набору прогонов.'
    ],
    tests: [
      {
        name: 'все успешны',
        code: `expect(classify([
  { status: 'passed', environment: 'ci' },
  { status: 'passed', environment: 'ci' }
])).toBe('стабильно проходит');`
      },
      {
        name: 'все падают',
        code: `expect(classify([
  { status: 'failed', environment: 'ci' },
  { status: 'failed', environment: 'ci' }
])).toBe('стабильно падает');`
      },
      {
        name: 'разные результаты при одинаковом окружении',
        code: `expect(classify([
  { status: 'passed', environment: 'ci' },
  { status: 'failed', environment: 'ci' },
  { status: 'passed', environment: 'ci' }
])).toBe('нестабильный');`
      },
      {
        name: 'разные результаты при разных окружениях',
        code: `expect(classify([
  { status: 'passed', environment: 'local' },
  { status: 'failed', environment: 'ci' }
])).toBe('условия несопоставимы');`
      },
      {
        name: 'одинаковые результаты при разных окружениях',
        code: `expect(classify([
  { status: 'passed', environment: 'local' },
  { status: 'passed', environment: 'ci' }
])).toBe('стабильно проходит');`
      },
      {
        name: 'единственный прогон не делает тест нестабильным',
        code: `expect(classify([{ status: 'failed', environment: 'ci' }])).toBe('стабильно падает');`
      },
      {
        name: 'пустая история отвергается',
        code: `let message = '';
try { classify([]); } catch (error) { message = error.message; }
expect(message).toBe('нет данных о прогонах');`
      }
    ],
    solution: `function classify(runs) {
  if (runs.length === 0) {
    throw new Error('нет данных о прогонах');
  }

  const passed = runs.filter(run => run.status === 'passed').length;
  const failed = runs.length - passed;

  if (failed === 0) return 'стабильно проходит';
  if (passed === 0) return 'стабильно падает';

  const environments = new Set(runs.map(run => run.environment));

  return environments.size === 1 ? 'нестабильный' : 'условия несопоставимы';
}`
  }
]
