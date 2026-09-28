export default [
  {
    id: 'ts-150-module-shape',
    title: 'Форма модуля и его экспорт',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `ModuleShape = { default?: unknown; [name: string]: unknown }`. ' +
      'Напишите функцию `describeModule(moduleObject: ModuleShape): ' +
      '{ hasDefault: boolean; named: string[]; total: number }`. `named` — ' +
      'отсортированные имена всех экспортов, кроме экспорта по умолчанию; ' +
      '`total` — общее число экспортов вместе с ним. Экспортированное значение ' +
      '`undefined` остаётся экспортом.',
    starter: `type ModuleShape = { default?: unknown; [name: string]: unknown };

function describeModule(moduleObject: ModuleShape): {
  hasDefault: boolean;
  named: string[];
  total: number;
} {
  // Наличие экспорта определяется ключом, а не значением.
  return { hasDefault: false, named: [], total: 0 };
}`,
    hints: [
      'Наличие экспорта по умолчанию проверяется через `Object.hasOwn`, а не сравнением с `undefined`.',
      'Имена всех экспортов даёт `Object.keys`; `default` из них нужно исключить отдельно.',
      'Индексная сигнатура описывает форму типа и ничего не проверяет во время выполнения.'
    ],
    tests: [
      {
        name: 'только именованные экспорты',
        code: `expect(describeModule({ parse: 1, build: 2 }))
  .toEqual({ hasDefault: false, named: ['build', 'parse'], total: 2 });`
      },
      {
        name: 'экспорт по умолчанию учитывается отдельно',
        code: `expect(describeModule({ default: 1, parse: 2 }))
  .toEqual({ hasDefault: true, named: ['parse'], total: 2 });`
      },
      {
        name: 'только экспорт по умолчанию',
        code: `expect(describeModule({ default: 1 }))
  .toEqual({ hasDefault: true, named: [], total: 1 });`
      },
      {
        name: 'пустой модуль',
        code: `expect(describeModule({})).toEqual({ hasDefault: false, named: [], total: 0 });`
      },
      {
        name: 'экспортированный `undefined` считается экспортом',
        code: `expect(describeModule({ default: undefined, nothing: undefined }))
  .toEqual({ hasDefault: true, named: ['nothing'], total: 2 });`
      }
    ],
    solution: `type ModuleShape = { default?: unknown; [name: string]: unknown };

function describeModule(moduleObject: ModuleShape): {
  hasDefault: boolean;
  named: string[];
  total: number;
} {
  const keys = Object.keys(moduleObject);
  const hasDefault = Object.hasOwn(moduleObject, 'default');

  return {
    hasDefault,
    named: keys.filter(name => name !== 'default').sort(),
    total: keys.length
  };
}`
  }
]
