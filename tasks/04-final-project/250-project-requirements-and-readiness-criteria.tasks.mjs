export default [
  {
    id: 'fp-250-missing-criteria',
    title: 'Чего не хватает до готовности',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Критерий готовности полезен, только если по нему можно ответить «да» или ' +
      '«нет». Напишите `missingCriteria(criteria)`: на вход приходит массив ' +
      'объектов `{ id, required, status }`, где `status` — `done`, `partial` ' +
      'или `todo`. Верните отсортированный массив идентификаторов тех ' +
      '**обязательных** критериев, которые не выполнены. Частично выполненный ' +
      'критерий выполненным не считается.',
    starter: `function missingCriteria(criteria) {
  // Верните идентификаторы обязательных и невыполненных критериев.

  return [];
}`,
    hints: [
      'Сначала отберите обязательные, потом — невыполненные.',
      'Выполненным считается только статус done.',
      'Порядок задаёт обычный sort() по идентификаторам.'
    ],
    tests: [
      {
        name: 'необязательные критерии не попадают в список',
        code: `const optionalOnly = [
  { id: 'a', required: false, status: 'todo' },
  { id: 'b', required: true, status: 'done' }
];
expect(missingCriteria(optionalOnly)).toEqual([]);`
      },
      {
        name: 'частичное выполнение считается невыполненным',
        code: `const partial = [{ id: 'ui-01', required: true, status: 'partial' }];
expect(missingCriteria(partial)).toEqual(['ui-01']);`
      },
      {
        name: 'результат отсортирован',
        code: `const several = [
  { id: 'db-02', required: true, status: 'todo' },
  { id: 'api-01', required: true, status: 'done' },
  { id: 'ci-03', required: true, status: 'partial' }
];
expect(missingCriteria(several)).toEqual(['ci-03', 'db-02']);`
      },
      {
        name: 'пустой список даёт пустой результат',
        code: `expect(missingCriteria([])).toEqual([]);`
      }
    ],
    solution: `function missingCriteria(criteria) {
  return criteria
    .filter(criterion => criterion.required && criterion.status !== 'done')
    .map(criterion => criterion.id)
    .sort();
}`
  },
  {
    id: 'fp-250-empty-is-not-ready',
    title: 'Пустой список не значит «готово»',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `readinessVerdict(criteria)`. Он возвращает ' +
      '`{ ready, missing }`, где `missing` — идентификаторы невыполненных ' +
      'обязательных критериев (как в предыдущей задаче), а `ready` истинно ' +
      'только тогда, когда невыполненных нет **и** проверять было что. ' +
      'Пустой список критериев — это не готовность, а отсутствие критериев: ' +
      'для него `ready` должно быть ложным.',
    starter: `function readinessVerdict(criteria) {
  const missing = criteria
    .filter(criterion => criterion.required && criterion.status !== 'done')
    .map(criterion => criterion.id)
    .sort();

  // every() на пустом массиве истинно — учтите это.
  return { ready: missing.length === 0, missing };
}`,
    hints: [
      'Проверьте, есть ли вообще обязательные критерии.',
      'Готовность требует двух условий: критерии есть и все выполнены.',
      'Отсутствие критериев стоит считать отдельным случаем, а не успехом.'
    ],
    tests: [
      {
        name: 'все обязательные выполнены — готово',
        code: `const allDone = [
  { id: 'a', required: true, status: 'done' },
  { id: 'b', required: false, status: 'todo' }
];
expect(readinessVerdict(allDone)).toEqual({ ready: true, missing: [] });`
      },
      {
        name: 'невыполненный обязательный критерий отменяет готовность',
        code: `const oneLeft = [
  { id: 'a', required: true, status: 'done' },
  { id: 'b', required: true, status: 'todo' }
];
const oneLeftVerdict = readinessVerdict(oneLeft);
expect(oneLeftVerdict.ready).toBe(false);
expect(oneLeftVerdict.missing).toEqual(['b']);`
      },
      {
        name: 'пустой список критериев не является готовностью',
        code: `expect(readinessVerdict([]).ready).toBe(false);`
      },
      {
        name: 'список только из необязательных тоже не готовность',
        code: `const optional = [{ id: 'nice', required: false, status: 'todo' }];
expect(readinessVerdict(optional).ready).toBe(false);`
      }
    ],
    solution: `function readinessVerdict(criteria) {
  const required = criteria.filter(criterion => criterion.required);

  const missing = required
    .filter(criterion => criterion.status !== 'done')
    .map(criterion => criterion.id)
    .sort();

  // Нечего проверять — значит, готовность не подтверждена ничем.
  return { ready: required.length > 0 && missing.length === 0, missing };
}`
  }
];
