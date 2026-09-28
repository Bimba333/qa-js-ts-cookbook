export default [
  {
    id: 'js-64-registration-table',
    title: 'Сводная таблица регистрации',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `registrationTable()`, которая возвращает объект с ' +
      'четырьмя ключами: `varBefore`, `functionBefore`, `letBefore`, ' +
      '`classBefore`. Для каждого вида объявления попробуйте обратиться к имени ' +
      '**до** его строки в тексте и запишите результат: значение, если ' +
      'обращение прошло, и имя ошибки, если нет. Каждое обращение должно быть ' +
      'перехвачено отдельно, чтобы первая же ошибка не прервала остальные.',
    starter: `function registrationTable() {
  // Каждое обращение — в своём try/catch, иначе остальные не выполнятся.

  return { varBefore: null, functionBefore: null, letBefore: null, classBefore: null };
}`,
    hints: [
      'Имя `var` регистрируется заранее и до своей строки равно `undefined` — это значение, а не ошибка.',
      'Объявление функции регистрируется вместе с телом, поэтому доступно целиком.',
      '`let` и `class` тоже регистрируются, но до своей строки обращение к ним запрещено — отсюда `ReferenceError`.'
    ],
    tests: [
      {
        name: '`var` до строки равен `undefined`',
        code: `expect(registrationTable().varBefore).toBe(undefined);`
      },
      {
        name: 'функция до строки уже работает',
        code: `expect(registrationTable().functionBefore).toBe('готово');`
      },
      {
        name: '`let` до строки даёт `ReferenceError`',
        code: `expect(registrationTable().letBefore).toBe('ReferenceError');`
      },
      {
        name: '`class` до строки даёт `ReferenceError`',
        code: `expect(registrationTable().classBefore).toBe('ReferenceError');`
      },
      {
        name: 'все четыре ключа заполнены',
        code: `const table = registrationTable();
expect(Object.keys(table).sort()).toEqual([
  'classBefore', 'functionBefore', 'letBefore', 'varBefore'
]);`
      }
    ],
    solution: `function registrationTable() {
  let varBefore;
  let functionBefore;
  let letBefore;
  let classBefore;

  try {
    varBefore = counter;
  } catch (error) {
    varBefore = error.name;
  }

  try {
    functionBefore = ready();
  } catch (error) {
    functionBefore = error.name;
  }

  try {
    letBefore = env;
  } catch (error) {
    letBefore = error.name;
  }

  try {
    classBefore = new Client();
  } catch (error) {
    classBefore = error.name;
  }

  var counter;

  function ready() {
    return 'готово';
  }

  let env = 'local';

  class Client {}

  return { varBefore, functionBefore, letBefore, classBefore };
}`
  }
]
