export default [
  {
    id: 'js-01-language-and-host',
    title: 'Что даёт язык, а что — среда выполнения',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `describeEnvironment()`, которая возвращает объект ' +
      '`{ languageResult, hasTimer, hasDom }`. `languageResult` — сумма квадратов ' +
      'чисел `[1, 2, 3]`, посчитанная средствами самого языка. `hasTimer` — есть ' +
      'ли в текущей среде функция `setTimeout`. `hasDom` — доступен ли объект ' +
      '`document`. Проверяйте наличие через `typeof`, а не через обращение к имени: ' +
      'обращение к необъявленному имени выбрасывает ошибку.',
    starter: `function describeEnvironment() {
  // Сумму считайте методами массива, а наличие имён — через typeof.

  return { languageResult: 0, hasTimer: false, hasDom: false };
}`,
    hints: [
      'Сумму квадратов даёт пара `map` и `reduce` — это часть самого языка и работает в любой среде.',
      'Выражение `typeof имя` не бросает ошибку даже для необъявленного имени — этим оно и отличается от прямого обращения.',
      'Код главы выполняется вне страницы, поэтому `document` здесь недоступен, а таймеры — есть.'
    ],
    tests: [
      {
        name: 'ядро языка считает одинаково в любой среде',
        code: `expect(describeEnvironment().languageResult).toBe(14);`
      },
      {
        name: 'таймеры предоставляет среда выполнения',
        code: `expect(describeEnvironment().hasTimer).toBe(true);`
      },
      {
        name: 'DOM вне страницы недоступен',
        code: `expect(describeEnvironment().hasDom).toBe(false);`
      },
      {
        name: 'проверка наличия не роняет функцию',
        code: `const report = describeEnvironment();
expect(Object.keys(report).sort()).toEqual(['hasDom', 'hasTimer', 'languageResult']);`
      }
    ],
    solution: `function describeEnvironment() {
  const languageResult = [1, 2, 3]
    .map(value => value * value)
    .reduce((sum, value) => sum + value, 0);

  return {
    languageResult,
    hasTimer: typeof setTimeout === 'function',
    hasDom: typeof document !== 'undefined'
  };
}`
  }
]
