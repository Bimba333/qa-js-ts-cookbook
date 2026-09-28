export default [
  {
    id: 'ts-155-audit-options',
    title: 'Аудит настроек компилятора',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите функцию `auditOptions(options: Record<string, unknown>): string[]`, ' +
      'которая возвращает отсортированный список проблем в настройках ' +
      'компилятора тестового проекта. Правила: отсутствующий или выключенный ' +
      '`strict` — `strict выключен`; `skipLibCheck` со значением `false` при ' +
      'выключенном `strict` проблемой не является, но включённый ' +
      '`allowJs` без `checkJs` — `allowJs без checkJs`; ' +
      '`noEmit` со значением `false` — `сборка включена в тестовом проекте`; ' +
      'неизвестная настройка — `неизвестная настройка: <имя>`. Известны только ' +
      '`strict`, `skipLibCheck`, `allowJs`, `checkJs`, `noEmit`, `target`.',
    starter: `function auditOptions(options: Record<string, unknown>): string[] {
  // Каждое правило добавляет свою строку; итог сортируется.
  return [];
}`,
    hints: [
      'Отсутствие настройки и её значение `false` для `strict` дают одну и ту же проблему.',
      'Проверка `allowJs` зависит от второй настройки, поэтому её нельзя рассматривать в отрыве.',
      'Неизвестные имена находятся сравнением ключей с заранее заданным списком.',
      'Сортировать лучше обычным `sort()`: сравнение с учётом языка зависит от окружения.'
    ],
    tests: [
      {
        name: 'корректный набор проблем не даёт',
        code: `expect(auditOptions({ strict: true, noEmit: true, target: 'ES2022' })).toEqual([]);`
      },
      {
        name: 'выключенный `strict`',
        code: `expect(auditOptions({ strict: false, noEmit: true })).toEqual(['strict выключен']);`
      },
      {
        name: 'отсутствующий `strict`',
        code: `expect(auditOptions({ noEmit: true })).toEqual(['strict выключен']);`
      },
      {
        name: '`allowJs` без `checkJs`',
        code: `expect(auditOptions({ strict: true, noEmit: true, allowJs: true }))
  .toEqual(['allowJs без checkJs']);`
      },
      {
        name: '`allowJs` вместе с `checkJs` допустим',
        code: `expect(auditOptions({ strict: true, noEmit: true, allowJs: true, checkJs: true }))
  .toEqual([]);`
      },
      {
        name: 'включённая сборка',
        code: `expect(auditOptions({ strict: true, noEmit: false }))
  .toEqual(['сборка включена в тестовом проекте']);`
      },
      {
        name: 'неизвестная настройка',
        code: `expect(auditOptions({ strict: true, noEmit: true, выдумка: 1 }))
  .toEqual(['неизвестная настройка: выдумка']);`
      },
      {
        name: 'несколько проблем сортируются',
        code: `expect(auditOptions({ noEmit: false, allowJs: true })).toEqual([
  'allowJs без checkJs',
  'strict выключен',
  'сборка включена в тестовом проекте'
]);`
      }
    ],
    solution: `function auditOptions(options: Record<string, unknown>): string[] {
  const known = ['strict', 'skipLibCheck', 'allowJs', 'checkJs', 'noEmit', 'target'];
  const problems: string[] = [];

  if (options.strict !== true) problems.push('strict выключен');
  if (options.allowJs === true && options.checkJs !== true) {
    problems.push('allowJs без checkJs');
  }
  if (options.noEmit === false) problems.push('сборка включена в тестовом проекте');

  for (const name of Object.keys(options)) {
    if (!known.includes(name)) problems.push(\`неизвестная настройка: \${name}\`);
  }

  return problems.sort();
}`
  }
]
