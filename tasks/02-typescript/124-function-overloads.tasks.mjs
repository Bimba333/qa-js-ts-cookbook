export default [
  {
    id: 'ts-124-one-implementation',
    title: 'Несколько входов, одна реализация',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите перегрузки функции `findItems`: ' +
      '`findItems(id: string): Item | undefined` и ' +
      '`findItems(ids: string[]): Item[]`, где ' +
      '`Item = { id: string; title: string }`. Реализация одна и обязана ' +
      'покрывать оба варианта: для строки — поиск одной записи в массиве ' +
      '`ITEMS`, для массива — все найденные записи в порядке переданных ' +
      'идентификаторов. Неизвестный идентификатор в массиве просто ' +
      'пропускается. Аргумент другого типа — ошибка `неподдерживаемый аргумент`.',
    starter: `type Item = { id: string; title: string };

const ITEMS: Item[] = [
  { id: 'WI-1', title: 'вход' },
  { id: 'WI-2', title: 'оплата' },
  { id: 'WI-3', title: 'отчёт' }
];

function findItems(id: string): Item | undefined;
function findItems(ids: string[]): Item[];
function findItems(input: string | string[]): Item | Item[] | undefined {
  // Реализация одна: различайте варианты во время выполнения.
  return undefined;
}`,
    hints: [
      'Перегрузки видны вызывающему коду, реализация — нет.',
      'Различить варианты помогает Array.isArray.',
      'Порядок результата задаётся переданными идентификаторами, а не массивом ITEMS.'
    ],
    tests: [
      {
        name: 'поиск по одному идентификатору',
        code: `expect(findItems('WI-2')).toEqual({ id: 'WI-2', title: 'оплата' });`
      },
      {
        name: 'неизвестный идентификатор даёт undefined',
        code: `expect(findItems('WI-9')).toBeUndefined();`
      },
      {
        name: 'поиск по списку сохраняет порядок запроса',
        code: `expect(findItems(['WI-3', 'WI-1']).map(item => item.title))
  .toEqual(['отчёт', 'вход']);`
      },
      {
        name: 'неизвестные идентификаторы пропускаются',
        code: `expect(findItems(['WI-9', 'WI-1']).map(item => item.id)).toEqual(['WI-1']);`
      },
      {
        name: 'пустой список даёт пустой массив',
        code: `expect(findItems([])).toEqual([]);`
      },
      {
        name: 'аргумент другого типа отвергается',
        code: `let message = '';
try { (findItems as any)(42); } catch (error) { message = error.message; }
expect(message).toBe('неподдерживаемый аргумент');`
      },
      {
        name: 'результат для строки не является массивом',
        code: `expect(Array.isArray(findItems('WI-1'))).toBe(false);`
      }
    ],
    solution: `type Item = { id: string; title: string };

const ITEMS: Item[] = [
  { id: 'WI-1', title: 'вход' },
  { id: 'WI-2', title: 'оплата' },
  { id: 'WI-3', title: 'отчёт' }
];

function findItems(id: string): Item | undefined;
function findItems(ids: string[]): Item[];
function findItems(input: string | string[]): Item | Item[] | undefined {
  if (typeof input === 'string') {
    return ITEMS.find(item => item.id === input);
  }

  if (Array.isArray(input)) {
    return input
      .map(id => ITEMS.find(item => item.id === id))
      .filter((item): item is Item => item !== undefined);
  }

  throw new Error('неподдерживаемый аргумент');
}`
  }
]
