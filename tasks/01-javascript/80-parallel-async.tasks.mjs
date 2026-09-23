export default [
  {
    id: 'js-80-run-together',
    title: 'Запустить операции вместе',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `runTogether(operations)`, которая принимает массив функций, ' +
      'возвращающих промисы, запускает их одновременно и возвращает массив ' +
      'результатов в порядке аргументов. Если хотя бы одна операция отклонена, ' +
      'результат тоже отклоняется.',
    starter: `async function runTogether(operations) {
  // Сначала запустите все операции, потом дождитесь.
}`,
    hints: [
      'Параллельность даёт момент запуска, а не комбинатор.',
      'Сначала создайте промисы, затем передайте их комбинатору.',
      'Порядок результатов соответствует порядку аргументов, а не завершения.'
    ],
    tests: [
      {
        name: 'возвращает результаты по порядку аргументов',
        code: `expect(await runTogether([
  () => new Promise((resolve) => setTimeout(() => resolve('медленный'), 30)),
  () => Promise.resolve('быстрый')
])).toEqual(['медленный', 'быстрый']);`
      },
      {
        name: 'операции запускаются до ожидания',
        code: `const started = [];
await runTogether([
  async () => { started.push('первая'); },
  async () => { started.push('вторая'); }
]);
expect(started).toEqual(['первая', 'вторая']);`
      },
      {
        name: 'отклонение одной операции отклоняет результат',
        code: `let message = '';
try {
  await runTogether([
    () => Promise.reject(new Error('сбой')),
    () => Promise.resolve('ок')
  ]);
} catch (error) { message = error.message; }
expect(message).toBe('сбой');`
      },
      {
        name: 'для пустого списка возвращает пустой массив',
        code: `expect(await runTogether([])).toEqual([]);`
      }
    ],
    solution: `async function runTogether(operations) {
  const promises = operations.map((operation) => operation());

  return Promise.all(promises);
}`
  },

  {
    id: 'js-80-report-all-outcomes',
    title: 'Отчёт по всем операциям, включая упавшие',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `reportAll(operations)`, которая запускает все операции и ' +
      'возвращает массив объектов `{ ok, value }` или `{ ok, message }` для каждой — ' +
      'независимо от того, упала она или нет. Сам результат никогда не отклоняется.',
    starter: `async function reportAll(operations) {
  // Нужен комбинатор, который не падает на первой ошибке.
}`,
    hints: [
      'Есть комбинатор, который ждёт все операции и сообщает статус каждой.',
      'В его результате у каждого элемента есть поле status.',
      'Успешный элемент содержит value, отклонённый — reason.'
    ],
    tests: [
      {
        name: 'сообщает и об успехах, и об ошибках',
        code: `expect(await reportAll([
  () => Promise.resolve('ок'),
  () => Promise.reject(new Error('сбой'))
])).toEqual([
  { ok: true, value: 'ок' },
  { ok: false, message: 'сбой' }
]);`
      },
      {
        name: 'результат не отклоняется',
        code: `let failed = false;
try { await reportAll([() => Promise.reject(new Error('x'))]); }
catch (error) { failed = true; }
expect(failed).toBe(false);`
      },
      {
        name: 'сохраняет порядок операций',
        code: `const report = await reportAll([
  () => new Promise((resolve) => setTimeout(() => resolve('поздний'), 30)),
  () => Promise.resolve('ранний')
]);
expect(report.map((item) => item.value)).toEqual(['поздний', 'ранний']);`
      },
      {
        name: 'для пустого списка возвращает пустой массив',
        code: `expect(await reportAll([])).toEqual([]);`
      }
    ],
    solution: `async function reportAll(operations) {
  const settled = await Promise.allSettled(operations.map((operation) => operation()));

  return settled.map((item) => item.status === 'fulfilled'
    ? { ok: true, value: item.value }
    : { ok: false, message: item.reason.message });
}`
  }
]
