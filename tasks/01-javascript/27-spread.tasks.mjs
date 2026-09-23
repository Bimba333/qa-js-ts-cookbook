export default [
  {
    id: 'js-27-merge-config',
    title: 'Слияние настроек через spread',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `mergeConfig(base, override)`, которая возвращает новый объект: ' +
      'поля `override` перекрывают поля `base`. Исходные объекты изменяться не должны, ' +
      'а поле со значением `undefined` в `override` **должно** перекрывать базовое.',
    starter: `function mergeConfig(base, override) {
  // Порядок в spread определяет, кто перекрывает кого.
}`,
    hints: [
      'Порядок важен: последний источник перекрывает предыдущие.',
      'spread копирует и свойства со значением undefined.',
      'Исходные объекты остаются без изменений.'
    ],
    tests: [
      {
        name: 'переопределяет поля',
        code: `expect(mergeConfig({ retries: 1, verbose: false }, { retries: 3 }))
  .toEqual({ retries: 3, verbose: false });`
      },
      {
        name: 'добавляет новые поля',
        code: `expect(mergeConfig({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });`
      },
      {
        name: 'не изменяет исходные объекты',
        code: `const base = { retries: 1 };
mergeConfig(base, { retries: 3 });
expect(base).toEqual({ retries: 1 });`
      },
      {
        name: 'undefined в override перекрывает базовое значение',
        code: `expect(mergeConfig({ a: 1 }, { a: undefined }).a).toBe(undefined);`
      }
    ],
    solution: `function mergeConfig(base, override) {
  return { ...base, ...override };
}`
  },

  {
    id: 'js-27-shallow-copy-limit',
    title: 'Граница поверхностной копии',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `copyRun(run)`, которая возвращает копию объекта ' +
      '`{ name, tags }` так, чтобы изменение массива `tags` в копии **не** затрагивало ' +
      'исходный объект. Поверхностной копии здесь недостаточно.',
    starter: `function copyRun(run) {
  // spread копирует верхний уровень, но не вложенный массив.
}`,
    hints: [
      'Поверхностная копия оставляет вложенный массив общим.',
      'Массив тоже нужно скопировать.',
      'Проверьте оба направления: изменение копии и изменение исходного.'
    ],
    tests: [
      {
        name: 'копия содержит те же значения',
        code: `expect(copyRun({ name: 'smoke', tags: ['ui'] })).toEqual({ name: 'smoke', tags: ['ui'] });`
      },
      {
        name: 'изменение массива в копии не затрагивает исходный',
        code: `const source = { name: 'smoke', tags: ['ui'] };
copyRun(source).tags.push('api');
expect(source.tags).toEqual(['ui']);`
      },
      {
        name: 'изменение исходного не затрагивает копию',
        code: `const source = { name: 'smoke', tags: ['ui'] };
const copy = copyRun(source);
source.tags.push('api');
expect(copy.tags).toEqual(['ui']);`
      },
      {
        name: 'возвращается новый объект',
        code: `const source = { name: 'smoke', tags: [] };
expect(copyRun(source) === source).toBe(false);`
      }
    ],
    solution: `function copyRun(run) {
  return { ...run, tags: [...run.tags] };
}`
  }
]
