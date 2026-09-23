export default [
  {
    id: 'qa-244-merge-shard-reports',
    title: 'Объединение отчётов сегментов',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `mergeShards(reports, expectedShards)`. Отчёт сегмента — ' +
      '`{ shard, tests }`, где `tests` — массив `{ id, status }` со статусами ' +
      '`passed`, `failed` или `skipped`. Верните ' +
      '`{ total, passed, failed, skipped, missingShards, duplicates, ok }`: ' +
      'счётчики по всем тестам, номера сегментов, отчётов от которых нет ' +
      '(по возрастанию), идентификаторы тестов, встретившихся в разных ' +
      'сегментах (по первому появлению), и признак того, что прогон пригоден ' +
      'для выводов: все сегменты на месте, повторов нет и упавших нет.',
    starter: `function mergeShards(reports, expectedShards) {
  // Недостающий сегмент делает зелёный итог ложным.

  return {
    total: 0, passed: 0, failed: 0, skipped: 0,
    missingShards: [], duplicates: [], ok: false
  };
}`,
    hints: [
      'Ожидаемые номера сегментов идут от единицы до expectedShards.',
      'Повтор теста означает, что сегменты пересеклись, — это дефект распределения.',
      'Признак пригодности учитывает все три условия сразу.'
    ],
    tests: [
      {
        name: 'полный прогон без падений',
        code: `expect(mergeShards([
  { shard: 1, tests: [{ id: 'a', status: 'passed' }] },
  { shard: 2, tests: [{ id: 'b', status: 'passed' }] }
], 2)).toEqual({
  total: 2, passed: 2, failed: 0, skipped: 0,
  missingShards: [], duplicates: [], ok: true
});`
      },
      {
        name: 'недостающий сегмент виден',
        code: `const partial = mergeShards([
  { shard: 1, tests: [{ id: 'a', status: 'passed' }] }
], 3);
expect(partial.missingShards).toEqual([2, 3]);
expect(partial.ok).toBe(false);`
      },
      {
        name: 'падение делает прогон непригодным',
        code: `const failed = mergeShards([
  { shard: 1, tests: [{ id: 'a', status: 'failed' }] }
], 1);
expect(failed.failed).toBe(1);
expect(failed.ok).toBe(false);`
      },
      {
        name: 'пропущенные тесты считаются отдельно',
        code: `const skipped = mergeShards([
  { shard: 1, tests: [{ id: 'a', status: 'skipped' }, { id: 'b', status: 'passed' }] }
], 1);
expect(skipped.skipped).toBe(1);
expect(skipped.passed).toBe(1);
expect(skipped.total).toBe(2);
expect(skipped.ok).toBe(true);`
      },
      {
        name: 'повтор теста между сегментами',
        code: `const overlapping = mergeShards([
  { shard: 1, tests: [{ id: 'a', status: 'passed' }] },
  { shard: 2, tests: [{ id: 'a', status: 'passed' }] }
], 2);
expect(overlapping.duplicates).toEqual(['a']);
expect(overlapping.ok).toBe(false);`
      },
      {
        name: 'порядок недостающих сегментов по возрастанию',
        code: `expect(mergeShards([{ shard: 3, tests: [] }], 4).missingShards).toEqual([1, 2, 4]);`
      },
      {
        name: 'пустой список отчётов',
        code: `const empty = mergeShards([], 2);
expect(empty.total).toBe(0);
expect(empty.missingShards).toEqual([1, 2]);
expect(empty.ok).toBe(false);`
      }
    ],
    solution: `function mergeShards(reports, expectedShards) {
  const seen = new Set();
  const duplicates = [];
  const counts = { passed: 0, failed: 0, skipped: 0 };
  let total = 0;

  for (const report of reports) {
    for (const test of report.tests) {
      total += 1;
      counts[test.status] += 1;

      if (seen.has(test.id)) {
        if (!duplicates.includes(test.id)) {
          duplicates.push(test.id);
        }
      } else {
        seen.add(test.id);
      }
    }
  }

  const present = new Set(reports.map(report => report.shard));
  const missingShards = [];

  for (let shard = 1; shard <= expectedShards; shard += 1) {
    if (!present.has(shard)) {
      missingShards.push(shard);
    }
  }

  return {
    total,
    passed: counts.passed,
    failed: counts.failed,
    skipped: counts.skipped,
    missingShards,
    duplicates,
    ok: missingShards.length === 0 && duplicates.length === 0 && counts.failed === 0
  };
}`
  }
]
