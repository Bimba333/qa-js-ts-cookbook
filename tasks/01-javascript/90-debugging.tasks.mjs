export default [
  {
    id: 'js-90-error-chain',
    title: 'Разбор цепочки причин',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `explainFailure(action)`, которая вызывает `action()`, ' +
      'перехватывает исключение и возвращает объект `{ name, message, causes }`. ' +
      '`causes` — массив сообщений всей цепочки `error.cause`, от ближайшей ' +
      'причины к самой дальней. Если исключения не было, верните `null`. ' +
      'Если выброшено значение, не являющееся `Error`, верните `name` равным ' +
      '`не Error` и `message` — строковым представлением значения.',
    starter: `function explainFailure(action) {
  // Цепочку причин нужно пройти до конца, а не ограничиться первой.

  return null;
}`,
    hints: [
      'Поле `cause` задаётся вторым аргументом конструктора: `new Error("текст", { cause: исходная })`.',
      'Цепочка обходится циклом, пока у очередной ошибки есть `cause`.',
      'Выброшено может быть что угодно — строка, число, объект, — поэтому принадлежность к `Error` стоит проверить.'
    ],
    tests: [
      {
        name: 'без исключения возвращается `null`',
        code: `expect(explainFailure(() => 'всё хорошо')).toBe(null);`
      },
      {
        name: 'простая ошибка разбирается',
        code: `const simple = explainFailure(() => { throw new TypeError('плохой аргумент'); });
expect(simple.name).toBe('TypeError');
expect(simple.message).toBe('плохой аргумент');
expect(simple.causes).toEqual([]);`
      },
      {
        name: 'цепочка причин идёт от ближней к дальней',
        code: `const chained = explainFailure(() => {
  const low = new Error('соединение закрыто');
  const mid = new Error('запрос не выполнен', { cause: low });
  throw new Error('шаг сценария упал', { cause: mid });
});
expect(chained.message).toBe('шаг сценария упал');
expect(chained.causes).toEqual(['запрос не выполнен', 'соединение закрыто']);`
      },
      {
        name: 'выброшенная строка тоже описывается',
        code: `const raw = explainFailure(() => { throw 'просто строка'; });
expect(raw.name).toBe('не Error');
expect(raw.message).toBe('просто строка');`
      },
      {
        name: 'цепочка не зацикливается на самой себе',
        code: `const looped = explainFailure(() => {
  const error = new Error('сам себе причина');
  error.cause = error;
  throw error;
});
expect(looped.causes.length).toBeLessThan(5);`
      }
    ],
    solution: `function explainFailure(action) {
  try {
    action();

    return null;
  } catch (error) {
    if (!(error instanceof Error)) {
      return { name: 'не Error', message: String(error), causes: [] };
    }

    const causes = [];
    const seen = new Set([error]);
    let current = error.cause;

    while (current instanceof Error && !seen.has(current)) {
      seen.add(current);
      causes.push(current.message);
      current = current.cause;
    }

    return { name: error.name, message: error.message, causes };
  }
}`
  }
]
