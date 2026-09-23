export default [
  {
    id: 'qa-246-use-splits-setup-and-teardown',
    title: '`use` разделяет подготовку и уборку',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Фикстура в Playwright устроена как функция, которая готовит ресурс, ' +
      'отдаёт его через `use(value)` и убирает после возврата управления. ' +
      'Напишите `runWithFixture(fixture, body)`: вызовите `fixture(use)`, дождитесь ' +
      'завершения и верните `{ value, result, error }` — переданное в `use` ' +
      'значение, результат `body(value)` и текст ошибки, если `body` бросил ' +
      '(иначе `null`). Уборка фикстуры (код после `use`) обязана выполниться и ' +
      'при ошибке `body`. Если ошибка возникла в уборке, а не в теле, верните её ' +
      'в поле `error` только когда тело отработало успешно.',
    starter: `async function runWithFixture(fixture, body) {
  // use отдаёт значение и возвращает управление после тела.

  return { value: null, result: null, error: null };
}`,
    hints: [
      'use — это функция, которую вы передаёте фикстуре сами.',
      'Внутри use удобно выполнить тело и запомнить его результат.',
      'Ошибка тела не должна отменить код, идущий после use.'
    ],
    tests: [
      {
        name: 'подготовка, тело и уборка идут по порядку',
        code: `const trace = [];
const fixture = async use => {
  trace.push('подготовка');
  await use('ресурс');
  trace.push('уборка');
};
const run = await runWithFixture(fixture, value => { trace.push('тело:' + value); return 'ок'; });
expect(trace).toEqual(['подготовка', 'тело:ресурс', 'уборка']);
expect(run.result).toBe('ок');
expect(run.value).toBe('ресурс');`
      },
      {
        name: 'уборка выполняется и при ошибке тела',
        code: `const steps = [];
const fixture = async use => {
  steps.push('подготовка');
  await use(1);
  steps.push('уборка');
};
const failed = await runWithFixture(fixture, () => { throw new Error('тело упало'); });
expect(steps).toEqual(['подготовка', 'уборка']);
expect(failed.error).toBe('тело упало');
expect(failed.result).toBe(null);`
      },
      {
        name: 'асинхронное тело дожидается',
        code: `const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const fixture = async use => { await use('x'); };
const run = await runWithFixture(fixture, async value => { await delay(5); return value + '!'; });
expect(run.result).toBe('x!');`
      },
      {
        name: 'ошибка уборки видна, если тело прошло',
        code: `const fixture = async use => {
  await use('x');
  throw new Error('уборка упала');
};
const run = await runWithFixture(fixture, () => 'ок');
expect(run.result).toBe('ок');
expect(run.error).toBe('уборка упала');`
      },
      {
        name: 'ошибка тела важнее ошибки уборки',
        code: `const fixture = async use => {
  await use('x');
  throw new Error('уборка упала');
};
const run = await runWithFixture(fixture, () => { throw new Error('тело упало'); });
expect(run.error).toBe('тело упало');`
      },
      {
        name: 'значение фикстуры доступно снаружи',
        code: `const fixture = async use => { await use({ id: 'ресурс-1' }); };
const run = await runWithFixture(fixture, () => 'ок');
expect(run.value.id).toBe('ресурс-1');`
      }
    ],
    solution: `async function runWithFixture(fixture, body) {
  let value = null;
  let result = null;
  let bodyError = null;

  const use = async provided => {
    value = provided;

    try {
      result = await body(provided);
    } catch (error) {
      bodyError = error;
    }
  };

  let fixtureError = null;

  try {
    await fixture(use);
  } catch (error) {
    fixtureError = error;
  }

  // Ошибка тела важнее: она описывает сам сбой, а не последствия уборки.
  const error = bodyError ?? fixtureError;

  return { value, result, error: error === null ? null : error.message };
}`
  }
]
