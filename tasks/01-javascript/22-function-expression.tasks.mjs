export default [
  {
    id: 'js-22-function-as-value',
    title: 'Функция как значение в таблице',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Создайте объект `formatters`, где ключ — имя формата, а значение — функция ' +
      'преобразования: `short` возвращает имя теста, `full` — строку ' +
      '`<имя> — <статус>`. Затем напишите функцию `format(result, kind)`, которая ' +
      'выбирает форматтер по имени и применяет его. Для неизвестного формата вернуть ' +
      'строку `неизвестный формат`.',
    starter: `const formatters = {
  // Значениями свойств могут быть функции.
};

function format(result, kind) {
  // Выберите функцию по ключу и вызовите её.
}`,
    hints: [
      'Функция — обычное значение, её можно положить в свойство объекта.',
      'Перед вызовом нужно убедиться, что значение по ключу существует.',
      'Проверка типа значения надёжнее проверки наличия ключа.'
    ],
    tests: [
      {
        name: 'короткий формат',
        code: `expect(format({ name: 'login', status: 'passed' }, 'short')).toBe('login');`
      },
      {
        name: 'полный формат',
        code: `expect(format({ name: 'login', status: 'passed' }, 'full')).toBe('login — passed');`
      },
      {
        name: 'неизвестный формат',
        code: `expect(format({ name: 'login', status: 'passed' }, 'xml')).toBe('неизвестный формат');`
      },
      {
        name: 'форматтеры доступны как значения',
        code: `expect(typeof formatters.short).toBe('function');`
      }
    ],
    solution: `const formatters = {
  short: (result) => result.name,
  full: (result) => result.name + ' — ' + result.status
};

function format(result, kind) {
  const formatter = formatters[kind];

  return typeof formatter === 'function' ? formatter(result) : 'неизвестный формат';
}`
  },

  {
    id: 'js-22-named-expression-in-trace',
    title: 'Имя функции в выражении',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Объявите через выражение функцию с внутренним именем `validateStatusCode` и ' +
      'присвойте её переменной `check`. Функция бросает ошибку ' +
      '`недопустимый код: <код>` для кодов вне диапазона 100–599 и возвращает код ' +
      'в остальных случаях. Внутреннее имя должно быть видно в свойстве `name`.',
    starter: `const check = function /* имя */ (statusCode) {
  // Проверьте диапазон и бросьте ошибку при выходе за него.
};`,
    hints: [
      'Имя ставится между ключевым словом и скобками.',
      'Свойство name у функции доступно для чтения.',
      'Сообщение об ошибке собирается из текста и кода.'
    ],
    tests: [
      {
        name: 'допустимый код возвращается',
        code: `expect(check(200)).toBe(200);`
      },
      {
        name: 'границы диапазона допустимы',
        code: `expect([check(100), check(599)]).toEqual([100, 599]);`
      },
      {
        name: 'недопустимый код бросает ошибку',
        code: `let message = '';
try { check(42); } catch (error) { message = error.message; }
expect(message).toBe('недопустимый код: 42');`
      },
      {
        name: 'внутреннее имя видно в свойстве name',
        code: `expect(check.name).toBe('validateStatusCode');`
      }
    ],
    solution: `const check = function validateStatusCode(statusCode) {
  if (statusCode < 100 || statusCode > 599) {
    throw new Error('недопустимый код: ' + statusCode);
  }

  return statusCode;
};`
  }
]
