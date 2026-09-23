function runSuite(tests) {
  let totalDuration = 0;

  for (const test of tests) {
    totalDuration += test.durationMs;
  }

  return totalDuration;
}

const tests = [
  { id: 'T-1', durationMs: 120 },
  { id: 'T-2', durationMs: 340 },
  { id: 'T-3', durationMs: 90 },
];

const startedAt = Date.now();
const totalDuration = runSuite(tests);
const elapsedMs = Date.now() - startedAt;

// Сумма длительностей — это данные: она одинакова на любой машине.
console.log(`test duration: ${totalDuration}`);

// Время самого расчёта — измерение. Печатать его число бессмысленно:
// на другой машине или при другой нагрузке оно будет другим.
// Воспроизводимый вывод даёт сравнение с порогом.
console.log(`calculation under 50ms: ${elapsedMs < 50}`);
