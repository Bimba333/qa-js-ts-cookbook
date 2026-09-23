export default [
  {
    id: 'js-21-extract-validation',
    title: 'Вынести повторяющуюся проверку',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Объявите функцию `isSuccessful(statusCode)`, которая возвращает `true` для ' +
      'кодов от `200` до `299` включительно. Затем напишите функцию ' +
      '`countSuccessful(codes)`, которая использует первую и возвращает количество ' +
      'успешных кодов.',
    starter: `function isSuccessful(statusCode) {
  // Диапазон успеха — от 200 до 299.
}

function countSuccessful(codes) {
  // Переиспользуйте isSuccessful.
}`,
    hints: [
      'Границы диапазона входят в него.',
      'Вторая функция не должна повторять условие — она вызывает первую.',
      'Количество подходящих элементов удобно получить отбором.'
    ],
    tests: [
      {
        name: 'границы диапазона включены',
        code: `expect([isSuccessful(200), isSuccessful(299)]).toEqual([true, true]);`
      },
      {
        name: 'коды вне диапазона не успешны',
        code: `expect([isSuccessful(199), isSuccessful(300), isSuccessful(404)])
  .toEqual([false, false, false]);`
      },
      {
        name: 'считает успешные коды',
        code: `expect(countSuccessful([200, 201, 404, 500, 204])).toBe(3);`
      },
      {
        name: 'для пустого массива возвращает 0',
        code: `expect(countSuccessful([])).toBe(0);`
      }
    ],
    solution: `function isSuccessful(statusCode) {
  return statusCode >= 200 && statusCode <= 299;
}

function countSuccessful(codes) {
  return codes.filter((code) => isSuccessful(code)).length;
}`
  },

  {
    id: 'js-21-callable-before-declaration',
    title: 'Вызов до строки объявления',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `buildReport(results)`, которая возвращает строку из числа ' +
      'пройденных и упавших тестов вида `2 passed / 1 failed`. Вспомогательную ' +
      'функцию `countByStatus(results, status)` объявите **после** её первого ' +
      'использования — объявления функций доступны до своей строки.',
    starter: `function buildReport(results) {
  // Вызовите countByStatus здесь, а объявите её ниже.
}

// Объявление вспомогательной функции — после buildReport.`,
    hints: [
      'Объявление через function доступно до своей строки в тексте.',
      'Это отличает его от функции, присвоенной переменной.',
      'Вспомогательная функция считает элементы с нужным статусом.'
    ],
    tests: [
      {
        name: 'собирает отчёт',
        code: `expect(buildReport([
  { status: 'passed' },
  { status: 'failed' },
  { status: 'passed' }
])).toBe('2 passed / 1 failed');`
      },
      {
        name: 'пустой прогон даёт нули',
        code: `expect(buildReport([])).toBe('0 passed / 0 failed');`
      },
      {
        name: 'пропущенные не учитываются',
        code: `expect(buildReport([{ status: 'skipped' }])).toBe('0 passed / 0 failed');`
      },
      {
        name: 'вспомогательная функция доступна отдельно',
        code: `expect(countByStatus([{ status: 'passed' }], 'passed')).toBe(1);`
      }
    ],
    solution: `function buildReport(results) {
  const passed = countByStatus(results, 'passed');
  const failed = countByStatus(results, 'failed');

  return passed + ' passed / ' + failed + ' failed';
}

function countByStatus(results, status) {
  return results.filter((result) => result.status === status).length;
}`
  }
]
