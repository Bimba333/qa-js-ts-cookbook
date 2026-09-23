export default [
  {
    id: 'js-49-first-failed-name',
    title: 'Найти первое падение с выходом из цикла',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `firstFailedName(results)`, которая проходит по массиву ' +
      '`{ name, status }` циклом `for...of` и возвращает имя первого упавшего теста. ' +
      'Если упавших нет, вернуть `null`. Обход должен прекращаться на первом ' +
      'совпадении.',
    starter: `function firstFailedName(results) {
  for (const result of results) {
    // Верните имя сразу, как нашли.
  }

  return null;
}`,
    hints: [
      'for...of даёт сами элементы, а не индексы.',
      'return внутри цикла прекращает и цикл, и функцию.',
      'Если цикл дошёл до конца, значит совпадений не было.'
    ],
    tests: [
      {
        name: 'находит первое падение',
        code: `expect(firstFailedName([
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'failed' },
  { name: 'pay', status: 'failed' }
])).toBe('order');`
      },
      {
        name: 'если падений нет, возвращает null',
        code: `expect(firstFailedName([{ name: 'login', status: 'passed' }])).toBe(null);`
      },
      {
        name: 'для пустого массива возвращает null',
        code: `expect(firstFailedName([])).toBe(null);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [{ name: 'order', status: 'failed' }];
firstFailedName(source);
expect(source).toEqual([{ name: 'order', status: 'failed' }]);`
      }
    ],
    solution: `function firstFailedName(results) {
  for (const result of results) {
    if (result.status === 'failed') {
      return result.name;
    }
  }

  return null;
}`
  },

  {
    id: 'js-49-numbered-steps',
    title: 'Обход с индексом через entries',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `numberedSteps(plan)`, которая проходит по массиву строк и ' +
      'возвращает массив строк вида `"1) login"`. Используйте `for...of` вместе с ' +
      '`entries()`, а не ручной счётчик.',
    starter: `function numberedSteps(plan) {
  const lines = [];

  // entries() даёт пары [индекс, значение].

  return lines;
}`,
    hints: [
      'entries() возвращает пары «индекс — значение».',
      'Пару удобно разложить деструктуризацией прямо в заголовке цикла.',
      'Номер в отчёте на единицу больше индекса.'
    ],
    tests: [
      {
        name: 'нумерует шаги',
        code: `expect(numberedSteps(['login', 'order'])).toEqual(['1) login', '2) order']);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(numberedSteps([])).toEqual([]);`
      },
      {
        name: 'работает с одним элементом',
        code: `expect(numberedSteps(['solo'])).toEqual(['1) solo']);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = ['a', 'b'];
numberedSteps(source);
expect(source).toEqual(['a', 'b']);`
      }
    ],
    solution: `function numberedSteps(plan) {
  const lines = [];

  for (const [index, step] of plan.entries()) {
    lines.push(\`\${index + 1}) \${step}\`);
  }

  return lines;
}`
  }
]
