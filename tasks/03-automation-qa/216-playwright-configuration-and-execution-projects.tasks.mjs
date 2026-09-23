export default [
  {
    id: 'qa-216-resolve-projects',
    title: 'Проект перекрывает общие настройки',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `resolveProjects(config)`, где `config` — объект вида ' +
      '`{ use, projects }`. Каждый проект — `{ name, use }`. Верните массив ' +
      '`{ name, use }`, где `use` проекта наложен поверх общего: поля проекта ' +
      'перекрывают общие, недостающие берутся из общих, значение `undefined` ' +
      'в проекте общее значение **не** затирает. Порядок проектов сохраняется. ' +
      'Проектов может не быть — тогда верните один проект с именем `default` и ' +
      'общими настройками. Общий объект `use` изменяться не должен.',
    starter: `function resolveProjects(config) {
  // Настройки проекта перекрывают общие, но не отменяют их целиком.

  return [];
}`,
    hints: [
      'Распространение объекта копирует и явные undefined — это ловушка.',
      'Отсутствие списка проектов и пустой список — разные случаи.',
      'Общие настройки не должны меняться от вызова к вызову.'
    ],
    tests: [
      {
        name: 'настройки проекта перекрывают общие',
        code: `expect(resolveProjects({
  use: { baseURL: 'http://x', headless: true },
  projects: [{ name: 'chromium', use: { headless: false } }]
})).toEqual([
  { name: 'chromium', use: { baseURL: 'http://x', headless: false } }
]);`
      },
      {
        name: 'порядок проектов сохраняется',
        code: `const resolved = resolveProjects({
  use: { retries: 0 },
  projects: [
    { name: 'быстрый', use: {} },
    { name: 'медленный', use: { retries: 2 } }
  ]
});
expect(resolved.map(project => project.name)).toEqual(['быстрый', 'медленный']);
expect(resolved[1].use.retries).toBe(2);`
      },
      {
        name: 'явный undefined не затирает общее значение',
        code: `expect(resolveProjects({
  use: { baseURL: 'http://x' },
  projects: [{ name: 'chromium', use: { baseURL: undefined } }]
})[0].use.baseURL).toBe('http://x');`
      },
      {
        name: 'без проектов возвращается один default',
        code: `expect(resolveProjects({ use: { headless: true } }))
  .toEqual([{ name: 'default', use: { headless: true } }]);`
      },
      {
        name: 'пустой список проектов остаётся пустым',
        code: `expect(resolveProjects({ use: { headless: true }, projects: [] })).toEqual([]);`
      },
      {
        name: 'общие настройки не изменяются',
        code: `const shared = { headless: true };
resolveProjects({ use: shared, projects: [{ name: 'a', use: { headless: false } }] });
expect(shared.headless).toBe(true);`
      },
      {
        name: 'проект без своих настроек получает общие',
        code: `expect(resolveProjects({
  use: { baseURL: 'http://x' },
  projects: [{ name: 'a', use: {} }]
})[0].use).toEqual({ baseURL: 'http://x' });`
      }
    ],
    solution: `function resolveProjects(config) {
  const shared = config.use ?? {};

  if (config.projects === undefined) {
    return [{ name: 'default', use: { ...shared } }];
  }

  return config.projects.map(project => {
    const use = { ...shared };

    for (const [key, value] of Object.entries(project.use ?? {})) {
      if (value !== undefined) {
        use[key] = value;
      }
    }

    return { name: project.name, use };
  });
}`
  }
]
