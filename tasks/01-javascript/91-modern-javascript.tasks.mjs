export default [
  {
    id: 'js-91-modern-rewrite',
    title: 'Современная запись того же поведения',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Перепишите старый helper на современный синтаксис, сохранив поведение. ' +
      'Напишите `buildReport(run)`, которая возвращает строку ' +
      '`<name>: <passed>/<total>`, где `name` берётся из `run.meta.name` ' +
      '(если пути нет — `без имени`), `passed` — число тестов со статусом ' +
      '`passed`, `total` — общее число тестов. Требования: значение по ' +
      'умолчанию для отсутствующего `run.tests` — пустой список; обращение к ' +
      'вложенному полю — через необязательную цепочку; сборка строки — через ' +
      'шаблонную строку; подсчёт — через методы массива.',
    starter: `function buildReport(run) {
  return '';
}`,
    hints: [
      'Необязательная цепочка избавляет от проверок на каждом уровне.',
      'Оператор ?? подставляет значение только при null или undefined.',
      'Пустое имя и отсутствующее имя — разные случаи.'
    ],
    tests: [
      {
        name: 'обычный отчёт',
        code: `expect(buildReport({
  meta: { name: 'smoke' },
  tests: [{ status: 'passed' }, { status: 'failed' }, { status: 'passed' }]
})).toBe('smoke: 2/3');`
      },
      {
        name: 'без метаданных',
        code: `expect(buildReport({ tests: [{ status: 'passed' }] })).toBe('без имени: 1/1');`
      },
      {
        name: 'без тестов',
        code: `expect(buildReport({ meta: { name: 'smoke' } })).toBe('smoke: 0/0');`
      },
      {
        name: 'пустой объект',
        code: `expect(buildReport({})).toBe('без имени: 0/0');`
      },
      {
        name: 'все тесты упали',
        code: `expect(buildReport({
  meta: { name: 'regression' },
  tests: [{ status: 'failed' }, { status: 'failed' }]
})).toBe('regression: 0/2');`
      },
      {
        name: 'пропущенные тесты считаются в общем числе',
        code: `expect(buildReport({
  meta: { name: 'smoke' },
  tests: [{ status: 'passed' }, { status: 'skipped' }]
})).toBe('smoke: 1/2');`
      }
    ],
    solution: `function buildReport(run) {
  const name = run?.meta?.name ?? 'без имени';
  const tests = run?.tests ?? [];
  const passed = tests.filter(test => test.status === 'passed').length;

  return \`\${name}: \${passed}/\${tests.length}\`;
}`
  }
]
