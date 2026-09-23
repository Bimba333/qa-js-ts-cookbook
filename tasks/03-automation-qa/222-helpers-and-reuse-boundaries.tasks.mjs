export default [
  {
    id: 'qa-222-pure-and-effect',
    title: 'Вычисление отдельно, действие отдельно',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Разделите вспомогательную функцию на две. `summarize(results)` — чистая: ' +
      'принимает массив `{ id, status, durationMs }` и возвращает ' +
      '`{ total, passed, failed, slowest }`, где `slowest` — идентификатор самого ' +
      'долгого теста (при равенстве — первый встреченный, для пустого массива — ' +
      '`null`). Исходный массив изменяться не должен. ' +
      '`reportSummary(sink, summary)` — с эффектом: вызывает `sink` **один раз** ' +
      'со строкой `всего <total>, прошло <passed>, упало <failed>` и возвращает ' +
      'эту же строку.',
    starter: `function summarize(results) {
  return { total: 0, passed: 0, failed: 0, slowest: null };
}

function reportSummary(sink, summary) {
  return '';
}`,
    hints: [
      'Чистая функция не должна ни писать в журнал, ни менять вход.',
      'Сортировка массива меняет его — для поиска максимума она не нужна.',
      'Функция с эффектом возвращает то же, что отдала наружу.'
    ],
    tests: [
      {
        name: 'сводка считается',
        code: `expect(summarize([
  { id: 'a', status: 'passed', durationMs: 10 },
  { id: 'b', status: 'failed', durationMs: 30 }
])).toEqual({ total: 2, passed: 1, failed: 1, slowest: 'b' });`
      },
      {
        name: 'при равной длительности берётся первый',
        code: `expect(summarize([
  { id: 'a', status: 'passed', durationMs: 10 },
  { id: 'b', status: 'passed', durationMs: 10 }
]).slowest).toBe('a');`
      },
      {
        name: 'пустой массив',
        code: `expect(summarize([])).toEqual({ total: 0, passed: 0, failed: 0, slowest: null });`
      },
      {
        name: 'исходный массив не изменяется',
        code: `const results = [
  { id: 'a', status: 'passed', durationMs: 30 },
  { id: 'b', status: 'passed', durationMs: 10 }
];
summarize(results);
expect(results.map(item => item.id)).toEqual(['a', 'b']);`
      },
      {
        name: 'сводка не пишет наружу',
        code: `let written = 0;
const originalLog = console.log;
console.log = () => { written += 1; };
summarize([{ id: 'a', status: 'passed', durationMs: 1 }]);
console.log = originalLog;
expect(written).toBe(0);`
      },
      {
        name: 'отчёт вызывает приёмник один раз',
        code: `const lines = [];
const line = reportSummary(value => lines.push(value), { total: 2, passed: 1, failed: 1 });
expect(lines).toEqual(['всего 2, прошло 1, упало 1']);
expect(line).toBe('всего 2, прошло 1, упало 1');`
      },
      {
        name: 'отчёт работает с результатом сводки',
        code: `const written = [];
const summary = summarize([{ id: 'a', status: 'failed', durationMs: 5 }]);
reportSummary(value => written.push(value), summary);
expect(written).toEqual(['всего 1, прошло 0, упало 1']);`
      }
    ],
    solution: `function summarize(results) {
  let passed = 0;
  let failed = 0;
  let slowest = null;
  let slowestDuration = -1;

  for (const result of results) {
    if (result.status === 'passed') passed += 1;
    if (result.status === 'failed') failed += 1;

    if (result.durationMs > slowestDuration) {
      slowestDuration = result.durationMs;
      slowest = result.id;
    }
  }

  return { total: results.length, passed, failed, slowest };
}

function reportSummary(sink, summary) {
  const line = 'всего ' + summary.total +
    ', прошло ' + summary.passed +
    ', упало ' + summary.failed;

  sink(line);

  return line;
}`
  }
]
