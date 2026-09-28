export default [
  {
    id: 'js-87-reachability',
    title: 'Достижимость от корней',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `collectGarbage(heap, roots)`, которая возвращает ' +
      'отсортированный массив имён недостижимых объектов. `heap` — объект вида ' +
      '`{ имя: [имена, на которые объект ссылается] }`, `roots` — массив имён, ' +
      'достижимых напрямую. Объект достижим, если до него есть путь от любого ' +
      'корня. Циклические ссылки не должны приводить к бесконечному обходу: ' +
      'группа объектов, ссылающихся друг на друга, но не достижимая от корней, ' +
      'считается мусором.',
    starter: `function collectGarbage(heap, roots) {
  // Обходите граф от корней и помечайте достижимое.

  return [];
}`,
    hints: [
      'Достижимость — это обычный обход графа от нескольких стартовых вершин.',
      'Множество уже посещённых имён одновременно защищает от зацикливания и служит ответом «что достижимо».',
      'Мусор — это разность между всеми именами кучи и посещёнными.'
    ],
    tests: [
      {
        name: 'объект без входящих ссылок — мусор',
        code: `expect(collectGarbage(
  { config: [], orphan: [] },
  ['config']
)).toEqual(['orphan']);`
      },
      {
        name: 'достижимое через цепочку не собирается',
        code: `expect(collectGarbage(
  { root: ['client'], client: ['socket'], socket: [] },
  ['root']
)).toEqual([]);`
      },
      {
        name: 'цикл без корня всё равно мусор',
        code: `expect(collectGarbage(
  { a: ['b'], b: ['a'], root: [] },
  ['root']
)).toEqual(['a', 'b']);`
      },
      {
        name: 'цикл, достижимый от корня, сохраняется',
        code: `expect(collectGarbage(
  { root: ['a'], a: ['b'], b: ['a'] },
  ['root']
)).toEqual([]);`
      },
      {
        name: 'несколько корней',
        code: `expect(collectGarbage(
  { first: ['shared'], second: ['shared'], shared: [], lost: [] },
  ['first', 'second']
)).toEqual(['lost']);`
      },
      {
        name: 'без корней мусор — вся куча',
        code: `expect(collectGarbage({ a: ['b'], b: [] }, [])).toEqual(['a', 'b']);`
      },
      {
        name: 'ссылка на несуществующее имя не ломает обход',
        code: `expect(collectGarbage({ root: ['нет'] }, ['root'])).toEqual([]);`
      }
    ],
    solution: `function collectGarbage(heap, roots) {
  const reachable = new Set();
  const queue = [...roots];

  while (queue.length > 0) {
    const name = queue.pop();

    if (reachable.has(name)) continue;
    if (!Object.hasOwn(heap, name)) continue;

    reachable.add(name);
    queue.push(...heap[name]);
  }

  return Object.keys(heap)
    .filter(name => !reachable.has(name))
    .sort();
}`
  }
]
