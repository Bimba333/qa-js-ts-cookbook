export default [
  {
    id: 'qa-236-run-with-limit',
    title: 'Ограничение одновременных запусков',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `runWithLimit(jobs, limit)`, где `jobs` — массив функций, ' +
      'возвращающих промисы. Одновременно выполняется не больше `limit` задач; ' +
      'освободившееся место сразу занимает следующая. Результаты возвращаются ' +
      'в **порядке исходного массива**, а не завершения. Если задача отклоняется, ' +
      'на её месте в результате стоит `null`, а остальные задачи продолжают ' +
      'выполняться.',
    starter: `async function runWithLimit(jobs, limit) {
  // Порядок запуска и порядок результатов — разные вещи.

  return [];
}`,
    hints: [
      'Индекс задачи нужно запомнить до запуска.',
      'Свободное место занимает следующая задача, а не следующая партия.',
      'Отклонение одной задачи не должно прерывать остальные.'
    ],
    tests: [
      {
        name: 'результаты идут в порядке исходного массива',
        code: `const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const jobs = [
  async () => { await delay(20); return 'первый'; },
  async () => 'второй',
  async () => { await delay(10); return 'третий'; }
];
expect(await runWithLimit(jobs, 2)).toEqual(['первый', 'второй', 'третий']);`
      },
      {
        name: 'предел одновременности соблюдается',
        code: `const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let running = 0;
let peak = 0;
const heavy = Array.from({ length: 6 }, () => async () => {
  running += 1;
  peak = Math.max(peak, running);
  await pause(10);
  running -= 1;
  return 'ok';
});
await runWithLimit(heavy, 2);
expect(peak).toBe(2);`
      },
      {
        name: 'место занимает следующая задача сразу',
        code: `const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const started = [];
const staggered = [
  async () => { started.push(0); await wait(30); return 0; },
  async () => { started.push(1); await wait(5); return 1; },
  async () => { started.push(2); return 2; }
];
await runWithLimit(staggered, 2);
expect(started).toEqual([0, 1, 2]);`
      },
      {
        name: 'отклонение даёт null и не мешает остальным',
        code: `const mixed = [
  async () => 'ok',
  async () => { throw new Error('упал'); },
  async () => 'тоже ok'
];
expect(await runWithLimit(mixed, 2)).toEqual(['ok', null, 'тоже ok']);`
      },
      {
        name: 'предел больше числа задач',
        code: `expect(await runWithLimit([async () => 1, async () => 2], 10)).toEqual([1, 2]);`
      },
      {
        name: 'пустой список задач',
        code: `expect(await runWithLimit([], 2)).toEqual([]);`
      }
    ],
    solution: `async function runWithLimit(jobs, limit) {
  const results = new Array(jobs.length).fill(null);
  let next = 0;

  const worker = async () => {
    while (next < jobs.length) {
      const index = next;
      next += 1;

      try {
        results[index] = await jobs[index]();
      } catch {
        results[index] = null;
      }
    }
  };

  const workers = Array.from(
    { length: Math.min(limit, jobs.length) },
    () => worker()
  );

  await Promise.all(workers);

  return results;
}`
  }
]
