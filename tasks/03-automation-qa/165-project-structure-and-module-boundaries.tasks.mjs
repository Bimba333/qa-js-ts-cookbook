export default [
  {
    id: 'qa-165-find-cycles',
    title: 'Циклы в графе модулей',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Цикл импортов — признак того, что граница между модулями проведена ' +
      'неверно. Напишите функцию `findCycle(graph)`, где `graph` — объект ' +
      '`{ модуль: [модули, которые он импортирует] }`. Верните первый ' +
      'найденный цикл как массив имён от начала до повторения включительно ' +
      '(`[\'a\', \'b\', \'a\']`) либо `null`, если циклов нет. Модули ' +
      'обходятся в порядке ключей объекта, а их зависимости — в порядке ' +
      'списка. Ссылка на неизвестный модуль циклом не является.',
    starter: `function findCycle(graph) {
  // Цикл — это возврат к модулю, который уже лежит на текущем пути обхода.

  return null;
}`,
    hints: [
      'Различайте «модуль уже полностью проверен» и «модуль лежит на текущем пути»: цикл даёт только второе.',
      'Текущий путь удобно хранить массивом: по нему же собирается ответ.',
      'Обход каждой вершины прекращается, как только цикл найден.'
    ],
    tests: [
      {
        name: 'граф без циклов',
        code: `expect(findCycle({ a: ['b'], b: ['c'], c: [] })).toBe(null);`
      },
      {
        name: 'простой цикл из двух модулей',
        code: `expect(findCycle({ a: ['b'], b: ['a'] })).toEqual(['a', 'b', 'a']);`
      },
      {
        name: 'цикл из трёх модулей',
        code: `expect(findCycle({ a: ['b'], b: ['c'], c: ['a'] })).toEqual(['a', 'b', 'c', 'a']);`
      },
      {
        name: 'модуль, ссылающийся сам на себя',
        code: `expect(findCycle({ a: ['a'] })).toEqual(['a', 'a']);`
      },
      {
        name: 'цикл в стороне от корня находится',
        code: `expect(findCycle({ root: ['a'], a: ['b'], b: ['a'] }))
  .toEqual(['root', 'a', 'b', 'a']);`
      },
      {
        name: 'общая зависимость не является циклом',
        code: `expect(findCycle({ a: ['shared'], b: ['shared'], shared: [] })).toBe(null);`
      },
      {
        name: 'ссылка на неизвестный модуль не ломает обход',
        code: `expect(findCycle({ a: ['нет'] })).toBe(null);`
      }
    ],
    solution: `function findCycle(graph) {
  const done = new Set();
  const path = [];
  const onPath = new Set();

  function walk(name) {
    if (!Object.hasOwn(graph, name)) return null;
    if (onPath.has(name)) return [...path, name];
    if (done.has(name)) return null;

    path.push(name);
    onPath.add(name);

    for (const next of graph[name]) {
      const found = walk(next);
      if (found) return found;
    }

    onPath.delete(name);
    path.pop();
    done.add(name);

    return null;
  }

  for (const name of Object.keys(graph)) {
    const found = walk(name);
    if (found) return found;
  }

  return null;
}`
  }
]
