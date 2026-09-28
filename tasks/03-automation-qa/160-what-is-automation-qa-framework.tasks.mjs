export default [
  {
    id: 'qa-160-classify-responsibility',
    title: 'Кому принадлежит ответственность',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `classifyResponsibilities(items)`, которая распределяет ' +
      'обязанности между тремя владельцами и возвращает объект ' +
      '`{ library, runner, team }` с отсортированными списками. Каждый элемент ' +
      'имеет вид `{ name, needsBrowser, needsDiscovery, needsDomainKnowledge }`. ' +
      'Обязанность, требующая знания предметной области, принадлежит команде — ' +
      'даже если попутно нужен браузер. Из оставшихся: требующая обнаружения и ' +
      'запуска тестов принадлежит раннеру, требующая браузера — библиотеке. ' +
      'Обязанность, не требующая ничего, тоже принадлежит команде.',
    starter: `function classifyResponsibilities(items) {
  // Знание предметной области перевешивает остальные признаки.

  return { library: [], runner: [], team: [] };
}`,
    hints: [
      'Признаки проверяются по порядку: сначала самый сильный, потом остальные.',
      'Инструмент не знает, какой пользователь нужен сценарию, — это и есть знание предметной области.',
      'Списки собираются как имена, а не как исходные объекты.'
    ],
    tests: [
      {
        name: 'управление браузером принадлежит библиотеке',
        code: `expect(classifyResponsibilities([
  { name: 'клик по кнопке', needsBrowser: true, needsDiscovery: false, needsDomainKnowledge: false }
])).toEqual({ library: ['клик по кнопке'], runner: [], team: [] });`
      },
      {
        name: 'запуск тестов принадлежит раннеру',
        code: `expect(classifyResponsibilities([
  { name: 'поиск файлов тестов', needsBrowser: false, needsDiscovery: true, needsDomainKnowledge: false }
])).toEqual({ library: [], runner: ['поиск файлов тестов'], team: [] });`
      },
      {
        name: 'знание домена перевешивает браузер',
        code: `expect(classifyResponsibilities([
  { name: 'выбор тестового пользователя', needsBrowser: true, needsDiscovery: true, needsDomainKnowledge: true }
])).toEqual({ library: [], runner: [], team: ['выбор тестового пользователя'] });`
      },
      {
        name: 'обязанность без признаков остаётся команде',
        code: `expect(classifyResponsibilities([
  { name: 'владение тестовыми данными', needsBrowser: false, needsDiscovery: false, needsDomainKnowledge: false }
])).toEqual({ library: [], runner: [], team: ['владение тестовыми данными'] });`
      },
      {
        name: 'списки отсортированы',
        code: `const report = classifyResponsibilities([
  { name: 'б', needsBrowser: true, needsDiscovery: false, needsDomainKnowledge: false },
  { name: 'а', needsBrowser: true, needsDiscovery: false, needsDomainKnowledge: false }
]);
expect(report.library).toEqual(['а', 'б']);`
      },
      {
        name: 'пустой список даёт три пустых раздела',
        code: `expect(classifyResponsibilities([])).toEqual({ library: [], runner: [], team: [] });`
      }
    ],
    solution: `function classifyResponsibilities(items) {
  const library = [];
  const runner = [];
  const team = [];

  for (const item of items) {
    if (item.needsDomainKnowledge) team.push(item.name);
    else if (item.needsDiscovery) runner.push(item.name);
    else if (item.needsBrowser) library.push(item.name);
    else team.push(item.name);
  }

  return { library: library.sort(), runner: runner.sort(), team: team.sort() };
}`
  }
]
