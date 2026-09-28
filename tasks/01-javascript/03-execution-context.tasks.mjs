export default [
  {
    id: 'js-03-own-context-per-call',
    title: 'Один вызов — свой контекст',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `collectLevels(depth)`, которая вызывает саму себя ' +
      '`depth` раз и возвращает массив строк вида `уровень N`, собранных ' +
      'от внешнего вызова к внутреннему. Каждый вызов должен хранить свой номер ' +
      'в **локальной** переменной: общая переменная модуля или свойство ' +
      '`globalThis` задачу не решают. Для `depth` меньше единицы верните пустой массив.',
    starter: `function collectLevels(depth) {
  // Номер уровня храните в локальной переменной этого вызова.

  return [];
}`,
    hints: [
      'Каждый вызов создаёт свой контекст выполнения, поэтому его локальные переменные не видны соседним вызовам.',
      'Проще всего передавать текущий номер параметром и уменьшать оставшуюся глубину.',
      'Результат внутреннего вызова присоединяется к строке текущего уровня.'
    ],
    tests: [
      {
        name: 'три уровня идут от внешнего к внутреннему',
        code: `expect(collectLevels(3)).toEqual(['уровень 1', 'уровень 2', 'уровень 3']);`
      },
      {
        name: 'один уровень',
        code: `expect(collectLevels(1)).toEqual(['уровень 1']);`
      },
      {
        name: 'нулевая глубина даёт пустой массив',
        code: `expect(collectLevels(0)).toEqual([]);`
      },
      {
        name: 'повторный вызов не помнит предыдущий',
        code: `collectLevels(4);
expect(collectLevels(2)).toEqual(['уровень 1', 'уровень 2']);`
      },
      {
        name: 'состояние не утекает в `globalThis`',
        code: `collectLevels(3);
expect(typeof globalThis.level).toBe('undefined');`
      }
    ],
    solution: `function collectLevels(depth) {
  function step(current, left) {
    const label = \`уровень \${current}\`;

    if (left <= 1) return [label];

    return [label, ...step(current + 1, left - 1)];
  }

  return depth < 1 ? [] : step(1, depth);
}`
  }
]
