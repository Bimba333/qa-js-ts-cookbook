export default [
  {
    id: 'fp-252-collect-all-config-problems',
    title: 'Все проблемы конфигурации сразу',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `loadRunConfig(env)`. На вход приходит объект со строковыми ' +
      'значениями (как `process.env`). Нужны три переменные: `BASE_URL` — ' +
      'непустая строка, `WORKERS` — целое число больше нуля, `HEADLESS` — ' +
      'строка `true` или `false`. Если всё верно, верните ' +
      '`{ baseUrl, workers, headless }` с приведёнными значениями. Если нет — ' +
      'бросьте `Error`, в сообщении которого перечислены **все** имена ' +
      'проблемных переменных, отсортированные и разделённые запятой с пробелом.',
    starter: `function loadRunConfig(env) {
  // Проверка должна назвать все проблемы, а не первую найденную.

  return {
    baseUrl: env.BASE_URL,
    workers: Number(env.WORKERS),
    headless: env.HEADLESS === 'true'
  };
}`,
    hints: [
      'Собирайте имена проблемных переменных в массив, а не бросайте сразу.',
      'Number("") даёт 0, а Number("два") даёт NaN — проверяйте результат.',
      'Строка "false" истинна: сравнивайте со списком допустимых значений.'
    ],
    tests: [
      {
        name: 'корректное окружение даёт приведённые значения',
        code: `const good = loadRunConfig({
  BASE_URL: 'http://127.0.0.1:4310',
  WORKERS: '4',
  HEADLESS: 'false'
});
expect(good).toEqual({
  baseUrl: 'http://127.0.0.1:4310',
  workers: 4,
  headless: false
});`
      },
      {
        name: 'сообщение перечисляет все проблемы',
        code: `expect(() => loadRunConfig({ HEADLESS: 'да' }))
  .toThrow('BASE_URL, HEADLESS, WORKERS');`
      },
      {
        name: 'пустая строка не является заданным значением',
        code: `expect(() => loadRunConfig({
  BASE_URL: '',
  WORKERS: '2',
  HEADLESS: 'true'
})).toThrow('BASE_URL');`
      },
      {
        name: 'нецелое и неположительное число не проходят',
        code: `expect(() => loadRunConfig({
  BASE_URL: 'http://x',
  WORKERS: '0',
  HEADLESS: 'true'
})).toThrow('WORKERS');
expect(() => loadRunConfig({
  BASE_URL: 'http://x',
  WORKERS: '1.5',
  HEADLESS: 'true'
})).toThrow('WORKERS');`
      }
    ],
    solution: `function loadRunConfig(env) {
  const problems = [];

  const baseUrl = typeof env.BASE_URL === 'string' ? env.BASE_URL.trim() : '';
  if (baseUrl === '') problems.push('BASE_URL');

  const workers = Number(env.WORKERS);
  if (!Number.isInteger(workers) || workers <= 0) problems.push('WORKERS');

  const headlessRaw = env.HEADLESS;
  if (headlessRaw !== 'true' && headlessRaw !== 'false') problems.push('HEADLESS');

  if (problems.length > 0) {
    throw new Error('неверные переменные окружения: ' + problems.sort().join(', '));
  }

  return { baseUrl, workers, headless: headlessRaw === 'true' };
}`
  },
  {
    id: 'fp-252-project-overrides-shared',
    title: 'Настройка проекта перекрывает общую',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите `resolveProject(config, name)`. В `config` есть общий блок ' +
      '`use` и массив `projects`, у каждого — своё имя и свой `use`. Верните ' +
      'настройку проекта: значения его `use` перекрывают общие, отсутствующие ' +
      'наследуются из общего блока. Имя проекта добавьте в результат полем ' +
      '`project`. Неизвестное имя — `Error` с этим именем в сообщении.',
    starter: `function resolveProject(config, name) {
  // Отсутствующее в проекте наследуется, а не обнуляется.

  const project = config.projects.find(item => item.name === name);

  return { project: name, ...project.use };
}`,
    hints: [
      'Раскрытие объектов накладывает правый на левый.',
      'Проект может не задать ни одного значения — тогда берутся все общие.',
      'Отсутствующий проект нужно обнаружить до обращения к его use.'
    ],
    tests: [
      {
        name: 'значение проекта перекрывает общее',
        code: `const overriding = {
  use: { baseUrl: 'http://local', timeout: 30000 },
  projects: [{ name: 'preview', use: { baseUrl: 'http://preview' } }]
};
expect(resolveProject(overriding, 'preview')).toEqual({
  project: 'preview',
  baseUrl: 'http://preview',
  timeout: 30000
});`
      },
      {
        name: 'проект без своих значений наследует все общие',
        code: `const inheriting = {
  use: { baseUrl: 'http://local', timeout: 30000 },
  projects: [{ name: 'local', use: {} }]
};
expect(resolveProject(inheriting, 'local')).toEqual({
  project: 'local',
  baseUrl: 'http://local',
  timeout: 30000
});`
      },
      {
        name: 'неизвестный проект даёт ошибку с именем',
        code: `const single = { use: {}, projects: [{ name: 'local', use: {} }] };
expect(() => resolveProject(single, 'staging')).toThrow('staging');`
      },
      {
        name: 'общий блок не изменяется',
        code: `const shared = { baseUrl: 'http://local' };
const configWithShared = {
  use: shared,
  projects: [{ name: 'preview', use: { baseUrl: 'http://preview' } }]
};
resolveProject(configWithShared, 'preview');
expect(shared.baseUrl).toBe('http://local');`
      }
    ],
    solution: `function resolveProject(config, name) {
  const project = config.projects.find(item => item.name === name);

  if (!project) {
    throw new Error('неизвестный проект: ' + name);
  }

  return { project: name, ...config.use, ...project.use };
}`
  }
];
