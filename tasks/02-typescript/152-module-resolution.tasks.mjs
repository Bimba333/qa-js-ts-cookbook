export default [
  {
    id: 'ts-152-resolve-specifier',
    title: 'Разрешение относительного пути',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите функцию ' +
      '`resolveSpecifier(fromFile: string, specifier: string, files: string[]): string`. ' +
      'Относительный путь (`./` или `../`) разрешается от каталога `fromFile`. ' +
      'Расширение может отсутствовать: тогда проверяются `.ts`, `.d.ts` и ' +
      '`.js` — именно в этом порядке. Если ничего не найдено, пробуется ' +
      '`<путь>/index.ts`. Неразрешённый путь даёт `Error` с сообщением ' +
      '`модуль не разрешён`. Неотносительный путь даёт `Error` с сообщением ' +
      '`не относительный путь`.',
    starter: `function resolveSpecifier(fromFile: string, specifier: string, files: string[]): string {
  // Каталог берётся от fromFile, затем проверяются расширения по порядку.
  return '';
}`,
    hints: [
      'Каталог файла — это его путь без последнего сегмента; сегмент `..` поднимает на уровень выше.',
      'Порядок расширений важен: `.ts` выигрывает у `.js`, даже если есть оба файла.',
      'Точное совпадение с расширением проверяется до перебора вариантов.'
    ],
    tests: [
      {
        name: 'путь с расширением находится как есть',
        code: `expect(resolveSpecifier('src/app.ts', './client.ts', ['src/client.ts']))
  .toBe('src/client.ts');`
      },
      {
        name: 'расширение `.ts` подставляется',
        code: `expect(resolveSpecifier('src/app.ts', './client', ['src/client.ts']))
  .toBe('src/client.ts');`
      },
      {
        name: '`.ts` выигрывает у `.js`',
        code: `expect(resolveSpecifier('src/app.ts', './client', ['src/client.js', 'src/client.ts']))
  .toBe('src/client.ts');`
      },
      {
        name: 'файл объявлений идёт вторым',
        code: `expect(resolveSpecifier('src/app.ts', './legacy', ['src/legacy.js', 'src/legacy.d.ts']))
  .toBe('src/legacy.d.ts');`
      },
      {
        name: 'каталог разрешается через `index.ts`',
        code: `expect(resolveSpecifier('src/app.ts', './clients', ['src/clients/index.ts']))
  .toBe('src/clients/index.ts');`
      },
      {
        name: 'переход на уровень выше',
        code: `expect(resolveSpecifier('src/api/client.ts', '../config', ['src/config.ts']))
  .toBe('src/config.ts');`
      },
      {
        name: 'ненайденный модуль даёт ошибку',
        code: `expect(() => resolveSpecifier('src/app.ts', './нет', []))
  .toThrow('модуль не разрешён');`
      },
      {
        name: 'неотносительный путь отвергается',
        code: `expect(() => resolveSpecifier('src/app.ts', '@playwright/test', []))
  .toThrow('не относительный путь');`
      }
    ],
    solution: `function resolveSpecifier(fromFile: string, specifier: string, files: string[]): string {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
    throw new Error('не относительный путь');
  }

  const base = fromFile.split('/').slice(0, -1);

  for (const segment of specifier.split('/')) {
    if (segment === '.' || segment === '') continue;
    if (segment === '..') base.pop();
    else base.push(segment);
  }

  const target = base.join('/');
  const known = new Set(files);
  const candidates = [
    target,
    \`\${target}.ts\`,
    \`\${target}.d.ts\`,
    \`\${target}.js\`,
    \`\${target}/index.ts\`
  ];

  for (const candidate of candidates) {
    if (known.has(candidate)) return candidate;
  }

  throw new Error('модуль не разрешён');
}`
  }
]
