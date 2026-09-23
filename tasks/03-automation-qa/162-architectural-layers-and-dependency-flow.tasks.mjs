export default [
  {
    id: 'qa-162-dependency-direction',
    title: 'Направление зависимостей и циклы',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Слои перечислены сверху вниз: зависеть можно только на слой ниже или на ' +
      'тот же. Напишите `checkDependencies(layers, modules)`, где `layers` — ' +
      'массив имён слоёв от верхнего к нижнему, а `modules` — массив ' +
      '`{ name, layer, imports }` (`imports` — имена других модулей). ' +
      'Верните массив нарушений в порядке обхода модулей, каждое — строка: ' +
      '`<name> → <imported>: зависимость снизу вверх` для обращения к верхнему ' +
      'слою и `<name> → <imported>: цикл` для взаимного импорта внутри одного ' +
      'слоя. Импорт неизвестного модуля — `<name> → <imported>: модуль неизвестен`.',
    starter: `function checkDependencies(layers, modules) {
  // Позиция слоя в списке задаёт допустимое направление.

  return [];
}`,
    hints: [
      'Номер слоя удобно получить один раз для всех модулей.',
      'Зависимость внутри одного слоя допустима, пока она не взаимна.',
      'Неизвестный модуль нельзя отнести ни к какому слою — это отдельное нарушение.'
    ],
    tests: [
      {
        name: 'разрешённое направление нарушений не даёт',
        code: `expect(checkDependencies(['тесты', 'страницы', 'транспорт'], [
  { name: 'loginSpec', layer: 'тесты', imports: ['loginPage'] },
  { name: 'loginPage', layer: 'страницы', imports: ['httpClient'] },
  { name: 'httpClient', layer: 'транспорт', imports: [] }
])).toEqual([]);`
      },
      {
        name: 'обращение снизу вверх — нарушение',
        code: `expect(checkDependencies(['тесты', 'страницы'], [
  { name: 'loginSpec', layer: 'тесты', imports: [] },
  { name: 'loginPage', layer: 'страницы', imports: ['loginSpec'] }
])).toEqual(['loginPage → loginSpec: зависимость снизу вверх']);`
      },
      {
        name: 'взаимный импорт внутри слоя — цикл',
        code: `expect(checkDependencies(['страницы'], [
  { name: 'a', layer: 'страницы', imports: ['b'] },
  { name: 'b', layer: 'страницы', imports: ['a'] }
])).toEqual(['a → b: цикл', 'b → a: цикл']);`
      },
      {
        name: 'односторонняя связь внутри слоя допустима',
        code: `expect(checkDependencies(['страницы'], [
  { name: 'a', layer: 'страницы', imports: ['b'] },
  { name: 'b', layer: 'страницы', imports: [] }
])).toEqual([]);`
      },
      {
        name: 'неизвестный модуль отмечается отдельно',
        code: `expect(checkDependencies(['тесты'], [
  { name: 'spec', layer: 'тесты', imports: ['helper'] }
])).toEqual(['spec → helper: модуль неизвестен']);`
      },
      {
        name: 'нарушения идут в порядке обхода',
        code: `const found = checkDependencies(['тесты', 'страницы'], [
  { name: 'pageA', layer: 'страницы', imports: ['spec'] },
  { name: 'pageB', layer: 'страницы', imports: ['spec'] },
  { name: 'spec', layer: 'тесты', imports: [] }
]);
expect(found).toEqual([
  'pageA → spec: зависимость снизу вверх',
  'pageB → spec: зависимость снизу вверх'
]);`
      },
      {
        name: 'пустой проект нарушений не даёт',
        code: `expect(checkDependencies(['тесты'], [])).toEqual([]);`
      }
    ],
    solution: `function checkDependencies(layers, modules) {
  const levelOf = new Map(layers.map((layer, index) => [layer, index]));
  const byName = new Map(modules.map(module => [module.name, module]));
  const violations = [];

  for (const module of modules) {
    for (const imported of module.imports) {
      const target = byName.get(imported);

      if (target === undefined) {
        violations.push(module.name + ' → ' + imported + ': модуль неизвестен');
        continue;
      }

      const from = levelOf.get(module.layer);
      const to = levelOf.get(target.layer);

      if (to < from) {
        violations.push(module.name + ' → ' + imported + ': зависимость снизу вверх');
        continue;
      }

      if (to === from && target.imports.includes(module.name)) {
        violations.push(module.name + ' → ' + imported + ': цикл');
      }
    }
  }

  return violations;
}`
  }
]
