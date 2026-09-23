export default [
  {
    id: 'ts-106-readonly-array',
    title: 'Массив только для чтения',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `withStep(steps: readonly string[], step: string): readonly string[]` — ' +
      'возвращает **новый** массив с добавленным шагом, не меняя исходный. ' +
      'Напишите `freezeSteps(steps: string[]): readonly string[]` — возвращает ' +
      'замороженную копию (`readonly` проверяет компилятор, заморозку надо ' +
      'сделать самому). И `lengths(groups: readonly (readonly string[])[]): number[]` — ' +
      'длины вложенных массивов в исходном порядке.',
    starter: `function withStep(steps: readonly string[], step: string): readonly string[] {
  return steps;
}

function freezeSteps(steps: string[]): readonly string[] {
  return steps;
}

function lengths(groups: readonly (readonly string[])[]): number[] {
  return [];
}`,
    hints: [
      'readonly не запрещает изменения во время выполнения.',
      'Добавление в новый массив выполняется без push по исходному.',
      'Заморожена должна быть копия, а не аргумент.'
    ],
    tests: [
      {
        name: 'шаг добавляется в новый массив',
        code: `expect(withStep(['открыть'], 'заполнить')).toEqual(['открыть', 'заполнить']);`
      },
      {
        name: 'исходный массив не меняется',
        code: `const steps = ['открыть'];
withStep(steps, 'заполнить');
expect(steps).toEqual(['открыть']);`
      },
      {
        name: 'замороженная копия не принимает изменений',
        code: `const frozen = freezeSteps(['a']) as string[];
expect(Object.isFrozen(frozen)).toBe(true);
try { frozen.push('b'); } catch { /* заморожен */ }
expect(frozen).toHaveLength(1);`
      },
      {
        name: 'исходный массив остаётся изменяемым',
        code: `const source = ['a'];
freezeSteps(source);
source.push('b');
expect(source).toHaveLength(2);`
      },
      {
        name: 'длины вложенных массивов',
        code: `expect(lengths([['a'], [], ['b', 'c']])).toEqual([1, 0, 2]);`
      },
      {
        name: 'пустой набор групп',
        code: `expect(lengths([])).toEqual([]);`
      }
    ],
    solution: `function withStep(steps: readonly string[], step: string): readonly string[] {
  return [...steps, step];
}

function freezeSteps(steps: string[]): readonly string[] {
  return Object.freeze([...steps]);
}

function lengths(groups: readonly (readonly string[])[]): number[] {
  return groups.map(group => group.length);
}`
  }
]
