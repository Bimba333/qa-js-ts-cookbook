export default [
  {
    id: 'js-26-collect-status-codes',
    title: 'Собрать произвольное число аргументов',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `allSuccessful(...codes)`, которая принимает произвольное ' +
      'число кодов и возвращает `true`, только если аргументов хотя бы один и все они ' +
      'в диапазоне 200–299.',
    starter: `function allSuccessful(...codes) {
  // Rest-параметр всегда даёт массив.
}`,
    hints: [
      'Rest-параметр собирает аргументы в массив, даже если их нет.',
      'Вызов без аргументов даёт пустой массив — это не успех.',
      'Проверка «все подходят» выполняется одним обходом.'
    ],
    tests: [
      {
        name: 'все коды успешны',
        code: `expect(allSuccessful(200, 201, 204)).toBe(true);`
      },
      {
        name: 'один неуспешный код делает результат ложным',
        code: `expect(allSuccessful(200, 404)).toBe(false);`
      },
      {
        name: 'вызов без аргументов даёт false',
        code: `expect(allSuccessful()).toBe(false);`
      },
      {
        name: 'один успешный код',
        code: `expect(allSuccessful(200)).toBe(true);`
      }
    ],
    solution: `function allSuccessful(...codes) {
  return codes.length > 0 && codes.every((code) => code >= 200 && code <= 299);
}`
  },

  {
    id: 'js-26-required-and-rest',
    title: 'Обязательный параметр перед остаточным',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `matchExpected(expected, ...actual)`, которая возвращает ' +
      'объект `{ total, matched, mismatched }`: сколько значений передано, сколько ' +
      'совпало с ожидаемым и сколько нет. Сравнение строгое.',
    starter: `function matchExpected(expected, ...actual) {
  // Остаточный параметр идёт последним.
}`,
    hints: [
      'Остаточный параметр может быть только последним в списке.',
      'Сравнение строгое: тип тоже должен совпадать.',
      'Сумма совпавших и несовпавших равна общему количеству.'
    ],
    tests: [
      {
        name: 'считает совпадения',
        code: `expect(matchExpected('passed', 'passed', 'failed', 'passed'))
  .toEqual({ total: 3, matched: 2, mismatched: 1 });`
      },
      {
        name: 'без переданных значений все нули',
        code: `expect(matchExpected('passed')).toEqual({ total: 0, matched: 0, mismatched: 0 });`
      },
      {
        name: 'сравнение строгое',
        code: `expect(matchExpected(1, '1')).toEqual({ total: 1, matched: 0, mismatched: 1 });`
      },
      {
        name: 'сумма частей равна общему числу',
        code: `const report = matchExpected('a', 'a', 'b', 'a', 'c');
expect(report.matched + report.mismatched).toBe(report.total);`
      }
    ],
    solution: `function matchExpected(expected, ...actual) {
  const matched = actual.filter((value) => value === expected).length;

  return {
    total: actual.length,
    matched,
    mismatched: actual.length - matched
  };
}`
  }
]
