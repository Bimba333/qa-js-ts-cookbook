export default [
  {
    id: 'ts-153-declaration-has-no-code',
    title: 'Файл объявлений не порождает кода',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите функцию `emitFiles(sources: Array<{ path: string; hasValues: boolean }>): ' +
      '{ emitted: string[]; declarationsOnly: string[] }`. Файл с расширением ' +
      '`.d.ts` кода не порождает и попадает только в `declarationsOnly`. ' +
      'Обычный `.ts` попадает в `emitted`, но лишь если содержит значения ' +
      '(`hasValues: true`); файл из одних типов кода тоже не даёт и ' +
      'учитывается как объявление. Оба списка отсортированы.',
    starter: `function emitFiles(sources: Array<{ path: string; hasValues: boolean }>): {
  emitted: string[];
  declarationsOnly: string[];
} {
  // Признак «порождает код» зависит и от расширения, и от содержимого.
  return { emitted: [], declarationsOnly: [] };
}`,
    hints: [
      'Файл `.d.ts` описывает форму уже существующего кода и сам ничего не компилирует.',
      'Обычный файл без значений — только типы и интерфейсы — после компиляции пуст.',
      'Каждый файл попадает ровно в один из двух списков.'
    ],
    tests: [
      {
        name: 'обычный файл со значениями порождает код',
        code: `expect(emitFiles([{ path: 'src/client.ts', hasValues: true }]))
  .toEqual({ emitted: ['src/client.ts'], declarationsOnly: [] });`
      },
      {
        name: 'файл объявлений кода не порождает',
        code: `expect(emitFiles([{ path: 'types/global.d.ts', hasValues: true }]))
  .toEqual({ emitted: [], declarationsOnly: ['types/global.d.ts'] });`
      },
      {
        name: 'файл из одних типов тоже не порождает кода',
        code: `expect(emitFiles([{ path: 'src/types.ts', hasValues: false }]))
  .toEqual({ emitted: [], declarationsOnly: ['src/types.ts'] });`
      },
      {
        name: 'списки отсортированы',
        code: `expect(emitFiles([
  { path: 'src/b.ts', hasValues: true },
  { path: 'src/a.ts', hasValues: true }
]).emitted).toEqual(['src/a.ts', 'src/b.ts']);`
      },
      {
        name: 'смешанный набор разделяется',
        code: `expect(emitFiles([
  { path: 'src/client.ts', hasValues: true },
  { path: 'src/types.ts', hasValues: false },
  { path: 'types/global.d.ts', hasValues: true }
])).toEqual({
  emitted: ['src/client.ts'],
  declarationsOnly: ['src/types.ts', 'types/global.d.ts']
});`
      },
      {
        name: 'пустой набор',
        code: `expect(emitFiles([])).toEqual({ emitted: [], declarationsOnly: [] });`
      }
    ],
    solution: `function emitFiles(sources: Array<{ path: string; hasValues: boolean }>): {
  emitted: string[];
  declarationsOnly: string[];
} {
  const emitted: string[] = [];
  const declarationsOnly: string[] = [];

  for (const source of sources) {
    const isDeclaration = source.path.endsWith('.d.ts');

    if (isDeclaration || !source.hasValues) declarationsOnly.push(source.path);
    else emitted.push(source.path);
  }

  return { emitted: emitted.sort(), declarationsOnly: declarationsOnly.sort() };
}`
  }
]
