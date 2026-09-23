export default [
  {
    id: 'js-19-first-index-of-status',
    title: 'Поиск с досрочным выходом',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `indexOfStatus(results, status)`, которая возвращает индекс ' +
      'первого результата с указанным статусом или `-1`, если такого нет. ' +
      'Используйте обычный цикл и прекращайте обход на первом совпадении.',
    starter: `function indexOfStatus(results, status) {
  // Возврат из цикла прекращает и цикл, и функцию.
}`,
    hints: [
      'Классический цикл даёт доступ к индексу напрямую.',
      'return внутри цикла прекращает обход.',
      'Если цикл дошёл до конца, совпадений не было.'
    ],
    tests: [
      {
        name: 'находит первое совпадение',
        code: `expect(indexOfStatus([
  { status: 'passed' },
  { status: 'failed' },
  { status: 'failed' }
], 'failed')).toBe(1);`
      },
      {
        name: 'если совпадений нет, возвращает -1',
        code: `expect(indexOfStatus([{ status: 'passed' }], 'failed')).toBe(-1);`
      },
      {
        name: 'для пустого массива возвращает -1',
        code: `expect(indexOfStatus([], 'failed')).toBe(-1);`
      },
      {
        name: 'первый элемент даёт индекс 0',
        code: `expect(indexOfStatus([{ status: 'failed' }], 'failed')).toBe(0);`
      }
    ],
    solution: `function indexOfStatus(results, status) {
  for (let index = 0; index < results.length; index += 1) {
    if (results[index].status === status) {
      return index;
    }
  }

  return -1;
}`
  },

  {
    id: 'js-19-retry-until-success',
    title: 'Повтор до успеха с ограничением',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `retryUntil(attempt, maxAttempts)`, которая вызывает функцию ' +
      '`attempt(number)` начиная с номера `1`, пока та не вернёт истинное значение. ' +
      'Верните объект `{ value, attempts }`. Если за `maxAttempts` попыток успеха не ' +
      'было, вернуть `{ value: null, attempts: maxAttempts }`.',
    starter: `function retryUntil(attempt, maxAttempts) {
  // Счётчик попыток должен отражать фактическое число вызовов.
}`,
    hints: [
      'Номер попытки начинается с единицы.',
      'При успехе цикл нужно прекратить.',
      'При исчерпании попыток число вызовов равно maxAttempts.'
    ],
    tests: [
      {
        name: 'успех с первой попытки',
        code: `expect(retryUntil(() => 'готово', 3)).toEqual({ value: 'готово', attempts: 1 });`
      },
      {
        name: 'успех с третьей попытки',
        code: `expect(retryUntil((number) => number === 3 ? 'позже' : null, 5))
  .toEqual({ value: 'позже', attempts: 3 });`
      },
      {
        name: 'попытки исчерпаны',
        code: `expect(retryUntil(() => null, 2)).toEqual({ value: null, attempts: 2 });`
      },
      {
        name: 'число вызовов совпадает с отчётом',
        code: `let calls = 0;
const report = retryUntil(() => { calls += 1; return null; }, 4);
expect(calls).toBe(report.attempts);`
      }
    ],
    solution: `function retryUntil(attempt, maxAttempts) {
  for (let number = 1; number <= maxAttempts; number += 1) {
    const value = attempt(number);

    if (value) {
      return { value, attempts: number };
    }
  }

  return { value: null, attempts: maxAttempts };
}`
  }
]
