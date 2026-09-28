export default [
  {
    id: 'ts-97-types-do-not-reach-runtime',
    title: 'Что доживает до выполнения',
    difficulty: 'easy',
    lang: 'ts',
    prompt:
      'Объявите тип `Priority = \'LOW\' | \'HIGH\'`, интерфейс ' +
      '`Task { id: string; priority: Priority }` и перечисление ' +
      '`Stage { Setup, Run }`. Напишите функцию ' +
      '`describeArtifacts(): { hasEnum: boolean; stageName: string; taskKeys: string[] }`. ' +
      '`hasEnum` — существует ли `Stage` во время выполнения, `stageName` — ' +
      'имя, полученное обратным отображением `Stage[0]`, `taskKeys` — ключи ' +
      'объекта, собранного по форме `Task`. Тип и интерфейс до выполнения не ' +
      'доживают, поэтому опираться на них в коде нельзя.',
    starter: `type Priority = 'LOW' | 'HIGH';

interface Task {
  id: string;
  priority: Priority;
}

enum Stage {
  Setup,
  Run
}

function describeArtifacts(): { hasEnum: boolean; stageName: string; taskKeys: string[] } {
  // Проверяйте только то, что действительно существует после компиляции.
  return { hasEnum: false, stageName: '', taskKeys: [] };
}`,
    hints: [
      'Перечисление порождает обычный объект, поэтому его можно проверить через `typeof`.',
      'У числового перечисления есть обратное отображение: по значению `0` доступно имя варианта.',
      'Интерфейс не порождает кода — чтобы получить его ключи, нужен реальный объект такой формы.'
    ],
    tests: [
      {
        name: 'перечисление существует после компиляции',
        code: `expect(describeArtifacts().hasEnum).toBe(true);`
      },
      {
        name: 'обратное отображение даёт имя варианта',
        code: `expect(describeArtifacts().stageName).toBe('Setup');`
      },
      {
        name: 'форма интерфейса видна только через объект',
        code: `expect(describeArtifacts().taskKeys.sort()).toEqual(['id', 'priority']);`
      }
    ],
    solution: `type Priority = 'LOW' | 'HIGH';

interface Task {
  id: string;
  priority: Priority;
}

enum Stage {
  Setup,
  Run
}

function describeArtifacts(): { hasEnum: boolean; stageName: string; taskKeys: string[] } {
  const sample: Task = { id: 't-1', priority: 'LOW' };

  return {
    hasEnum: typeof Stage === 'object',
    stageName: Stage[0],
    taskKeys: Object.keys(sample)
  };
}`
  }
]
