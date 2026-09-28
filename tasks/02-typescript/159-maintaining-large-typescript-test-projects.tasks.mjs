export default [
  {
    id: 'ts-159-layer-dependencies',
    title: 'Проверка направления зависимостей',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'В большом тестовом проекте важно направление зависимостей. Напишите ' +
      'функцию `checkLayering(imports: Array<{ from: string; to: string }>, ' +
      'order: string[]): string[]`, где путь файла начинается с имени слоя ' +
      '(`tests/login.spec.ts` → слой `tests`). `order` перечисляет слои от ' +
      'верхнего к нижнему. Импорт допустим внутри своего слоя и вниз по ' +
      'списку; импорт вверх даёт нарушение вида `tests ← fixtures`, где слева ' +
      'стоит слой, на который ссылаются. Файл из неизвестного слоя даёт ' +
      '`Error` с сообщением `неизвестный слой`. Нарушения не повторяются и ' +
      'отсортированы.',
    starter: `function checkLayering(
  imports: Array<{ from: string; to: string }>,
  order: string[]
): string[] {
  // Слой определяется первым сегментом пути, допустимость — его позицией.
  return [];
}`,
    hints: [
      'Позиция слоя в списке и есть его уровень: чем меньше индекс, тем выше слой.',
      'Импорт вверх — это переход к слою с меньшим индексом, чем у импортирующего файла.',
      'Повторы убираются множеством, а порядок задаётся сортировкой готовых строк.'
    ],
    tests: [
      {
        name: 'импорт вниз допустим',
        code: `expect(checkLayering(
  [{ from: 'tests/login.spec.ts', to: 'fixtures/auth.ts' }],
  ['tests', 'fixtures', 'clients']
)).toEqual([]);`
      },
      {
        name: 'импорт внутри слоя допустим',
        code: `expect(checkLayering(
  [{ from: 'clients/api.ts', to: 'clients/http.ts' }],
  ['tests', 'fixtures', 'clients']
)).toEqual([]);`
      },
      {
        name: 'импорт вверх — нарушение',
        code: `expect(checkLayering(
  [{ from: 'fixtures/auth.ts', to: 'tests/helpers.ts' }],
  ['tests', 'fixtures', 'clients']
)).toEqual(['tests ← fixtures']);`
      },
      {
        name: 'через два уровня тоже нарушение',
        code: `expect(checkLayering(
  [{ from: 'clients/api.ts', to: 'tests/helpers.ts' }],
  ['tests', 'fixtures', 'clients']
)).toEqual(['tests ← clients']);`
      },
      {
        name: 'повторы не дублируются',
        code: `expect(checkLayering(
  [
    { from: 'clients/api.ts', to: 'tests/a.ts' },
    { from: 'clients/http.ts', to: 'tests/b.ts' }
  ],
  ['tests', 'fixtures', 'clients']
)).toEqual(['tests ← clients']);`
      },
      {
        name: 'несколько нарушений сортируются',
        code: `expect(checkLayering(
  [
    { from: 'clients/api.ts', to: 'fixtures/a.ts' },
    { from: 'fixtures/auth.ts', to: 'tests/b.ts' }
  ],
  ['tests', 'fixtures', 'clients']
)).toEqual(['fixtures ← clients', 'tests ← fixtures']);`
      },
      {
        name: 'неизвестный слой даёт ошибку',
        code: `expect(() => checkLayering(
  [{ from: 'выдумка/a.ts', to: 'clients/http.ts' }],
  ['tests', 'fixtures', 'clients']
)).toThrow('неизвестный слой');`
      }
    ],
    solution: `function checkLayering(
  imports: Array<{ from: string; to: string }>,
  order: string[]
): string[] {
  function layerOf(path: string): number {
    const name = path.split('/')[0];
    const index = order.indexOf(name);

    if (index === -1) throw new Error('неизвестный слой');

    return index;
  }

  const violations = new Set<string>();

  for (const edge of imports) {
    const fromLevel = layerOf(edge.from);
    const toLevel = layerOf(edge.to);

    if (toLevel < fromLevel) {
      violations.add(\`\${order[toLevel]} ← \${order[fromLevel]}\`);
    }
  }

  return [...violations].sort();
}`
  }
]
