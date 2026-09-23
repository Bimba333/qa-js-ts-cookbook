export default [
  {
    id: 'js-71-error-first-callback',
    title: 'Колбэк с ошибкой первым аргументом',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `readConfig(source, callback)`, которая вызывает `callback` ' +
      'по соглашению «ошибка первым аргументом». Если `source` — непустая строка, ' +
      'вызвать `callback(null, { source })`. Иначе вызвать ' +
      '`callback(new Error("источник не задан"))` без второго аргумента.',
    starter: `function readConfig(source, callback) {
  // Первым аргументом идёт ошибка или null.
}`,
    hints: [
      'При успехе первый аргумент — null, второй — результат.',
      'При ошибке второй аргумент не передаётся вовсе.',
      'После вызова колбэка в ветке ошибки нужно прекратить выполнение.'
    ],
    tests: [
      {
        name: 'при успехе передаёт null и результат',
        code: `let captured = null;
readConfig('config.json', (error, config) => { captured = { error, config }; });
expect(captured).toEqual({ error: null, config: { source: 'config.json' } });`
      },
      {
        name: 'при ошибке передаёт объект Error',
        code: `let captured = null;
readConfig('', (error, config) => { captured = { isError: error instanceof Error, config }; });
expect(captured).toEqual({ isError: true, config: undefined });`
      },
      {
        name: 'сообщение об ошибке понятное',
        code: `let message = '';
readConfig('', (error) => { message = error.message; });
expect(message).toBe('источник не задан');`
      },
      {
        name: 'колбэк вызывается ровно один раз',
        code: `let calls = 0;
readConfig('config.json', () => { calls += 1; });
expect(calls).toBe(1);`
      }
    ],
    solution: `function readConfig(source, callback) {
  if (typeof source !== 'string' || source === '') {
    callback(new Error('источник не задан'));
    return;
  }

  callback(null, { source });
}`
  },

  {
    id: 'js-71-run-steps-with-callback',
    title: 'Прогон шагов с отчётом через колбэк',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `runSteps(steps, onStep)`, которая для каждого шага вызывает ' +
      '`onStep(step, position)`, где `position` начинается с единицы, и возвращает ' +
      'количество выполненных шагов. Возвращаемые значения `onStep` игнорируются.',
    starter: `function runSteps(steps, onStep) {
  // Колбэк получает шаг и его номер.
}`,
    hints: [
      'Колбэк вызывается для каждого элемента.',
      'Нумерация в отчёте начинается с единицы, а индекс — с нуля.',
      'Возвращать нужно количество шагов, а не результат обхода.'
    ],
    tests: [
      {
        name: 'вызывает колбэк для каждого шага',
        code: `const seen = [];
runSteps(['login', 'order'], (step, position) => seen.push(position + ':' + step));
expect(seen).toEqual(['1:login', '2:order']);`
      },
      {
        name: 'возвращает количество шагов',
        code: `expect(runSteps(['a', 'b', 'c'], () => {})).toBe(3);`
      },
      {
        name: 'для пустого списка колбэк не вызывается',
        code: `let calls = 0;
const total = runSteps([], () => { calls += 1; });
expect([calls, total]).toEqual([0, 0]);`
      },
      {
        name: 'игнорирует значения, возвращённые колбэком',
        code: `expect(runSteps(['a'], () => 'что-то')).toBe(1);`
      }
    ],
    solution: `function runSteps(steps, onStep) {
  steps.forEach((step, index) => {
    onStep(step, index + 1);
  });

  return steps.length;
}`
  }
]
