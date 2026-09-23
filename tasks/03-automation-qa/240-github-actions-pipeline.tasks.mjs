export default [
  {
    id: 'qa-240-validate-workflow',
    title: 'Проверка описания конвейера',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `validateWorkflow(workflow)` — разбор описания конвейера вида ' +
      '`{ on, permissions, jobs }`, где `jobs` — объект ' +
      '`{ <имя>: { steps, permissions } }`, а шаг — `{ name, run, uses, with } `. ' +
      'Верните массив проблем в порядке проверок: ' +
      '`события не заданы` — пустой или отсутствующий `on`; ' +
      '`<job>: шагов нет` — пустой список шагов; ' +
      '`<job>: разрешения шире необходимых` — если разрешения задания или ' +
      'конвейера содержат `contents: write`; ' +
      '`<job>: установка зависимостей без ci` — если есть шаг с `run`, ' +
      'содержащим `npm install`; ' +
      '`<job>: кеш без версии в ключе` — если шаг использует ' +
      '`actions/cache` и его `with.key` не содержит подстроки `\${{`. ' +
      'Задания обходятся в порядке объявления.',
    starter: `function validateWorkflow(workflow) {
  // Минимальные разрешения и воспроизводимая установка — часть контракта запуска.

  return [];
}`,
    hints: [
      'Разрешения могут быть заданы и у конвейера, и у задания.',
      'npm install и npm ci решают разные задачи: первый может обновить версии.',
      'Ключ кеша без подстановки не различает версии и потому бесполезен.'
    ],
    tests: [
      {
        name: 'корректный конвейер проблем не даёт',
        code: `expect(validateWorkflow({
  on: ['push'],
  permissions: { contents: 'read' },
  jobs: {
    test: {
      steps: [
        { name: 'install', run: 'npm ci' },
        { name: 'cache', uses: 'actions/cache@v4', with: { key: 'pw-\${{ hashFiles(1) }}' } }
      ]
    }
  }
})).toEqual([]);`
      },
      {
        name: 'отсутствие событий замечается',
        code: `expect(validateWorkflow({ jobs: { test: { steps: [{ run: 'npm ci' }] } } }))
  .toEqual(['события не заданы']);`
      },
      {
        name: 'задание без шагов',
        code: `expect(validateWorkflow({ on: ['push'], jobs: { test: { steps: [] } } }))
  .toEqual(['test: шагов нет']);`
      },
      {
        name: 'широкие разрешения замечаются',
        code: `expect(validateWorkflow({
  on: ['push'],
  permissions: { contents: 'write' },
  jobs: { test: { steps: [{ run: 'npm ci' }] } }
})).toEqual(['test: разрешения шире необходимых']);`
      },
      {
        name: 'разрешения задания тоже проверяются',
        code: `expect(validateWorkflow({
  on: ['push'],
  jobs: { test: { steps: [{ run: 'npm ci' }], permissions: { contents: 'write' } } }
})).toEqual(['test: разрешения шире необходимых']);`
      },
      {
        name: 'npm install вместо npm ci',
        code: `expect(validateWorkflow({
  on: ['push'],
  jobs: { test: { steps: [{ run: 'npm install' }] } }
})).toEqual(['test: установка зависимостей без ci']);`
      },
      {
        name: 'кеш без подстановки в ключе',
        code: `expect(validateWorkflow({
  on: ['push'],
  jobs: {
    test: {
      steps: [
        { run: 'npm ci' },
        { uses: 'actions/cache@v4', with: { key: 'playwright-browsers' } }
      ]
    }
  }
})).toEqual(['test: кеш без версии в ключе']);`
      },
      {
        name: 'задания обходятся в порядке объявления',
        code: `expect(validateWorkflow({
  on: ['push'],
  jobs: {
    первое: { steps: [] },
    второе: { steps: [{ run: 'npm install' }] }
  }
})).toEqual(['первое: шагов нет', 'второе: установка зависимостей без ci']);`
      }
    ],
    solution: `function validateWorkflow(workflow) {
  const problems = [];

  const events = workflow.on;
  const hasEvents = Array.isArray(events)
    ? events.length > 0
    : events !== undefined && Object.keys(events).length > 0;

  if (!hasEvents) {
    problems.push('события не заданы');
  }

  const widePipeline = workflow.permissions?.contents === 'write';

  for (const [name, job] of Object.entries(workflow.jobs ?? {})) {
    const steps = job.steps ?? [];

    if (steps.length === 0) {
      problems.push(name + ': шагов нет');
    }

    if (widePipeline || job.permissions?.contents === 'write') {
      problems.push(name + ': разрешения шире необходимых');
    }

    if (steps.some(step => typeof step.run === 'string' && step.run.includes('npm install'))) {
      problems.push(name + ': установка зависимостей без ci');
    }

    const cacheStep = steps.find(step =>
      typeof step.uses === 'string' && step.uses.includes('actions/cache'));

    if (cacheStep !== undefined && !String(cacheStep.with?.key ?? '').includes('\${{')) {
      problems.push(name + ': кеш без версии в ключе');
    }
  }

  return problems;
}`
  }
]
