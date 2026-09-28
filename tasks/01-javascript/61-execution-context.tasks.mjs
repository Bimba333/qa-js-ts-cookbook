export default [
  {
    id: 'js-61-two-phases',
    title: 'Две фазы одного контекста',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Смоделируйте подготовку и выполнение. Функция `runContext(declarations, steps)` ' +
      'получает массив объявлений вида `{ kind, name, value }`, где `kind` — ' +
      '`var`, `let` или `function`, и массив шагов-функций. Сначала выполняется ' +
      'фаза подготовки: `var` получает значение `undefined`, `function` — своё ' +
      'значение сразу, `let` помечается недоступным. Затем каждый шаг вызывается ' +
      'с объектом `{ read, assign }`. `read` для недоступного имени бросает ' +
      '`ReferenceError` с сообщением `временная мёртвая зона`, для незнакомого — ' +
      '`имя не определено`. `assign` делает имя доступным. Верните итоговую ' +
      'таблицу имён `{ имя: значение }` без недоступных.',
    starter: `function runContext(declarations, steps) {
  // Сначала подготовка всех имён, только потом выполнение шагов.

  return {};
}`,
    hints: [
      'Недоступность `let` — это отдельное состояние имени, а не его значение: хранить его лучше меткой, а не `undefined`.',
      'Фаза подготовки проходит по всем объявлениям до того, как выполнится первый шаг.',
      'В итоговую таблицу попадают только имена, которым присвоили значение либо которые получили его при подготовке.'
    ],
    tests: [
      {
        name: '`var` доступен со значением `undefined` до присваивания',
        code: `const seen = [];
runContext([{ kind: 'var', name: 'retries' }], [
  ctx => seen.push(ctx.read('retries'))
]);
expect(seen).toEqual([undefined]);`
      },
      {
        name: 'функция доступна с самого начала',
        code: `const results = [];
runContext([{ kind: 'function', name: 'ready', value: () => 'готово' }], [
  ctx => results.push(ctx.read('ready')())
]);
expect(results).toEqual(['готово']);`
      },
      {
        name: '`let` до присваивания недоступен',
        code: `let tdzError = '';
runContext([{ kind: 'let', name: 'env' }], [
  ctx => {
    try { ctx.read('env'); } catch (error) { tdzError = error.message; }
  }
]);
expect(tdzError).toBe('временная мёртвая зона');`
      },
      {
        name: 'после присваивания `let` читается',
        code: `const after = [];
runContext([{ kind: 'let', name: 'env' }], [
  ctx => ctx.assign('env', 'local'),
  ctx => after.push(ctx.read('env'))
]);
expect(after).toEqual(['local']);`
      },
      {
        name: 'незнакомое имя даёт другую ошибку',
        code: `let unknownError = '';
runContext([], [
  ctx => {
    try { ctx.read('нет'); } catch (error) { unknownError = error.message; }
  }
]);
expect(unknownError).toBe('имя не определено');`
      },
      {
        name: 'итог не содержит недоступных имён',
        code: `expect(runContext(
  [{ kind: 'var', name: 'a' }, { kind: 'let', name: 'b' }],
  [ctx => ctx.assign('a', 1)]
)).toEqual({ a: 1 });`
      }
    ],
    solution: `function runContext(declarations, steps) {
  const TDZ = Symbol('tdz');
  const cells = new Map();

  for (const declaration of declarations) {
    if (declaration.kind === 'function') {
      cells.set(declaration.name, declaration.value);
    } else if (declaration.kind === 'var') {
      cells.set(declaration.name, undefined);
    } else {
      cells.set(declaration.name, TDZ);
    }
  }

  const context = {
    read(name) {
      if (!cells.has(name)) throw new ReferenceError('имя не определено');

      const value = cells.get(name);
      if (value === TDZ) throw new ReferenceError('временная мёртвая зона');

      return value;
    },
    assign(name, value) {
      cells.set(name, value);
    }
  };

  for (const step of steps) step(context);

  const result = {};
  for (const [name, value] of cells) {
    if (value !== TDZ) result[name] = value;
  }

  return result;
}`
  }
]
