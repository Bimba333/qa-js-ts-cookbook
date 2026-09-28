export default [
  {
    id: 'qa-161-roles-coverage',
    title: 'Какие роли закрыты, а какие нет',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `coverageReport(tools, requiredRoles)`. `tools` — ' +
      'объект `{ имя инструмента: [роли] }`, `requiredRoles` — список ролей, ' +
      'нужных проекту. Верните ' +
      '`{ covered, uncovered, overlapping }`: закрытые роли, незакрытые и ' +
      'роли, которые закрывают два и более инструмента. Все списки ' +
      'отсортированы. Роль, не входящая в `requiredRoles`, в отчёт не попадает.',
    starter: `function coverageReport(tools, requiredRoles) {
  // Пересечение ролей — не дефект, но о нём нужно знать.

  return { covered: [], uncovered: [], overlapping: [] };
}`,
    hints: [
      'Для каждой нужной роли полезно посчитать, сколько инструментов её закрывают.',
      'Незакрытая роль — та, у которой счётчик равен нулю; пересечение — та, у которой он больше единицы.',
      'Роли инструментов, которых нет в списке нужных, просто игнорируются.'
    ],
    tests: [
      {
        name: 'все роли закрыты одним инструментом',
        code: `expect(coverageReport(
  { 'Playwright Test': ['раннер', 'проверки'] },
  ['раннер', 'проверки']
)).toEqual({ covered: ['проверки', 'раннер'], uncovered: [], overlapping: [] });`
      },
      {
        name: 'незакрытая роль видна',
        code: `expect(coverageReport(
  { Playwright: ['браузер'] },
  ['браузер', 'отчётность']
)).toEqual({ covered: ['браузер'], uncovered: ['отчётность'], overlapping: [] });`
      },
      {
        name: 'пересечение отмечается',
        code: `expect(coverageReport(
  { Playwright: ['проверки'], 'Playwright Test': ['проверки'] },
  ['проверки']
)).toEqual({ covered: ['проверки'], uncovered: [], overlapping: ['проверки'] });`
      },
      {
        name: 'лишние роли инструмента игнорируются',
        code: `expect(coverageReport(
  { Playwright: ['браузер', 'трассировка'] },
  ['браузер']
)).toEqual({ covered: ['браузер'], uncovered: [], overlapping: [] });`
      },
      {
        name: 'без инструментов не закрыто ничего',
        code: `expect(coverageReport({}, ['раннер'])).toEqual({
  covered: [], uncovered: ['раннер'], overlapping: []
});`
      },
      {
        name: 'пересекающаяся роль остаётся закрытой',
        code: `const report = coverageReport(
  { a: ['данные'], b: ['данные'], c: ['отчётность'] },
  ['данные', 'отчётность']
);
expect(report.covered).toEqual(['данные', 'отчётность']);
expect(report.overlapping).toEqual(['данные']);`
      }
    ],
    solution: `function coverageReport(tools, requiredRoles) {
  const counts = new Map(requiredRoles.map(role => [role, 0]));

  for (const roles of Object.values(tools)) {
    for (const role of roles) {
      if (counts.has(role)) counts.set(role, counts.get(role) + 1);
    }
  }

  const covered = [];
  const uncovered = [];
  const overlapping = [];

  for (const [role, count] of counts) {
    if (count === 0) uncovered.push(role);
    else covered.push(role);

    if (count > 1) overlapping.push(role);
  }

  return { covered: covered.sort(), uncovered: uncovered.sort(), overlapping: overlapping.sort() };
}`
  }
]
