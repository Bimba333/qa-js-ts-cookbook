export default [
  {
    id: 'js-04-stack-order',
    title: 'Порядок снятия со стека',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `traceCalls()`, которая вызывает три вложенные функции ' +
      '`first → second → third` и возвращает массив событий. Каждая функция ' +
      'записывает `вход N` перед вызовом следующей и `выход N` после её ' +
      'возврата, где `N` — её собственное имя: `first`, `second`, `third`. ' +
      'Самая внутренняя функция никого не вызывает.',
    starter: `function traceCalls() {
  const events = [];

  // Запишите вход и выход каждой функции.

  return events;
}`,
    hints: [
      'Строка «выход» выполняется после того, как вложенный вызов вернул управление.',
      'Массив событий удобно создать один раз снаружи и передавать внутрь или замкнуть на него.',
      'Стек снимается в обратном порядке, поэтому выходы идут зеркально входам.'
    ],
    tests: [
      {
        name: 'входы и выходы зеркальны',
        code: `expect(traceCalls()).toEqual([
  'вход first',
  'вход second',
  'вход third',
  'выход third',
  'выход second',
  'выход first'
]);`
      },
      {
        name: 'повторный вызов начинает с пустого списка',
        code: `traceCalls();
expect(traceCalls().length).toBe(6);`
      }
    ],
    solution: `function traceCalls() {
  const events = [];

  function third() {
    events.push('вход third');
    events.push('выход third');
  }

  function second() {
    events.push('вход second');
    third();
    events.push('выход second');
  }

  function first() {
    events.push('вход first');
    second();
    events.push('выход first');
  }

  first();

  return events;
}`
  },

  {
    id: 'js-04-stack-overflow',
    title: 'Переполнение стека',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `probeStack()`, которая доводит стек вызовов до ' +
      'переполнения бесконечной рекурсией, перехватывает ошибку и возвращает ' +
      'объект `{ errorName, depthReached }`: имя ошибки и глубину, на которой ' +
      'рекурсия остановилась. Глубина должна быть заметно больше тысячи — ' +
      'иначе рекурсия прервалась не стеком, а вашим условием.',
    starter: `function probeStack() {
  // Считайте глубину и перехватите ошибку снаружи рекурсии.

  return { errorName: '', depthReached: 0 };
}`,
    hints: [
      'Рекурсия без условия выхода упирается в предел стека и выбрасывает ошибку.',
      'Счётчик глубины нужно держать снаружи рекурсивной функции, иначе он пропадёт вместе с её контекстом.',
      'Перехватывать ошибку нужно там, где рекурсия запускается, а не внутри каждого вызова.'
    ],
    tests: [
      {
        name: 'переполнение даёт `RangeError`',
        code: `expect(probeStack().errorName).toBe('RangeError');`
      },
      {
        name: 'глубина оказалась большой',
        code: `expect(probeStack().depthReached).toBeGreaterThan(1000);`
      },
      {
        name: 'функция возвращает управление, а не падает',
        code: `const probe = probeStack();
expect(Object.keys(probe).sort()).toEqual(['depthReached', 'errorName']);`
      }
    ],
    solution: `function probeStack() {
  let depth = 0;

  function grow() {
    depth += 1;
    grow();
  }

  try {
    grow();

    return { errorName: 'нет ошибки', depthReached: depth };
  } catch (error) {
    return { errorName: error.name, depthReached: depth };
  }
}`
  }
]
