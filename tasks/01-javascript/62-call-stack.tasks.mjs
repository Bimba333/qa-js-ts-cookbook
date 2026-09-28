export default [
  {
    id: 'js-62-stack-empties-before-callback',
    title: 'Отложенный вызов начинается с пустого стека',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите асинхронную функцию `observeStack()`, которая возвращает массив ' +
      'событий. Синхронная цепочка `outer → inner` записывает `outer`, `inner` и ' +
      '`конец синхронного кода`. Внутри `inner` планируется отложенный вызов ' +
      'через `setTimeout(..., 0)`, который записывает `отложенный`. Дождитесь ' +
      'отложенного вызова и верните события в том порядке, в котором они ' +
      'произошли на самом деле.',
    starter: `async function observeStack() {
  const events = [];

  // Отложенный вызов выполнится только после того, как стек опустеет.

  return events;
}`,
    hints: [
      'Синхронный код доходит до конца, не прерываясь: отложенный вызов ждёт, пока стек опустеет.',
      'Чтобы дождаться отложенного вызова, оберните `setTimeout` в промис и дождитесь его.',
      'Запись «конец синхронного кода» должна попасть в массив раньше, чем промис будет ожидаться.'
    ],
    tests: [
      {
        name: 'отложенный вызов идёт последним',
        code: `expect(await observeStack()).toEqual([
  'outer',
  'inner',
  'конец синхронного кода',
  'отложенный'
]);`
      },
      {
        name: 'повторный вызов даёт тот же порядок',
        code: `await observeStack();
const second = await observeStack();
expect(second[3]).toBe('отложенный');`
      }
    ],
    solution: `async function observeStack() {
  const events = [];
  let release;
  const deferred = new Promise(resolve => {
    release = resolve;
  });

  function inner() {
    events.push('inner');
    setTimeout(() => {
      events.push('отложенный');
      release();
    }, 0);
  }

  function outer() {
    events.push('outer');
    inner();
  }

  outer();
  events.push('конец синхронного кода');

  await deferred;

  return events;
}`
  }
]
