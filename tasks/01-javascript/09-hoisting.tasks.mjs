export default [
  {
    id: 'js-09-declaration-vs-expression',
    title: 'Объявление функции против выражения',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `compareHoisting()`, которая возвращает объект ' +
      '`{ declarationResult, expressionError, valueBeforeAssignment }`. ' +
      'Внутри неё объявите функцию `ready()` через `function` и переменную ' +
      '`notReady` через `var`, которой ниже присваивается функциональное ' +
      'выражение. Обе нужно попытаться вызвать **до** их строк в тексте. ' +
      '`declarationResult` — что вернул успешный вызов, `expressionError` — ' +
      'имя ошибки неуспешного, `valueBeforeAssignment` — значение `notReady` ' +
      'до присваивания.',
    starter: `function compareHoisting() {
  // Оба вызова идут до строк объявления. Неудачный нужно перехватить.

  return { declarationResult: '', expressionError: '', valueBeforeAssignment: null };
}`,
    hints: [
      'Объявление функции регистрируется целиком до выполнения строк, поэтому вызов выше по тексту работает.',
      'Имя `var` тоже регистрируется заранее, но получает значение только на своей строке — до неё там `undefined`.',
      'Вызов значения `undefined` даёт `TypeError`, а не `ReferenceError`: имя-то существует.'
    ],
    tests: [
      {
        name: 'объявление функции вызывается выше своей строки',
        code: `expect(compareHoisting().declarationResult).toBe('готово');`
      },
      {
        name: 'функциональное выражение до присваивания недоступно',
        code: `expect(compareHoisting().expressionError).toBe('TypeError');`
      },
      {
        name: 'до присваивания имя существует со значением `undefined`',
        code: `expect(compareHoisting().valueBeforeAssignment).toBe(undefined);`
      }
    ],
    solution: `function compareHoisting() {
  const declarationResult = ready();
  const valueBeforeAssignment = notReady;
  let expressionError = 'нет ошибки';

  try {
    notReady();
  } catch (error) {
    expressionError = error.name;
  }

  function ready() {
    return 'готово';
  }

  var notReady = function () {
    return 'поздно';
  };

  return { declarationResult, expressionError, valueBeforeAssignment };
}`
  }
]
