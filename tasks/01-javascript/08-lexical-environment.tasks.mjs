export default [
  {
    id: 'js-08-environment-chain',
    title: 'Цепочка окружений',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Смоделируйте лексическое окружение. Функция `createEnvironment(outer)` ' +
      'возвращает объект с методами `declare(name, value)`, `lookup(name)` и ' +
      '`chainDepth()`. `lookup` ищет имя в собственной записи окружения, затем ' +
      'во внешней, и так до конца цепочки; если имя не найдено нигде, бросает ' +
      '`ReferenceError` с сообщением `имя не определено`. `chainDepth()` ' +
      'возвращает число окружений от текущего до самого внешнего включительно. ' +
      'Внешнее окружение для глобального — `null`.',
    starter: `function createEnvironment(outer) {
  // Собственная запись окружения плюс ссылка на внешнее.

  return {
    declare(name, value) {},
    lookup(name) {},
    chainDepth() { return 0; }
  };
}`,
    hints: [
      'Каждое окружение хранит только свои имена, а к чужим обращается через ссылку на внешнее.',
      'Поиск удобно писать рекурсивно: «нет у меня — спроси внешнее»; конец цепочки и есть условие выхода.',
      'Имя, объявленное во внутреннем окружении, затеняет такое же имя снаружи — значит проверять своё надо раньше.'
    ],
    tests: [
      {
        name: 'находит собственное имя',
        code: `const global = createEnvironment(null);
global.declare('env', 'local');
expect(global.lookup('env')).toBe('local');`
      },
      {
        name: 'поднимается во внешнее окружение',
        code: `const outerEnv = createEnvironment(null);
outerEnv.declare('baseUrl', 'http://stand');
const innerEnv = createEnvironment(outerEnv);
expect(innerEnv.lookup('baseUrl')).toBe('http://stand');`
      },
      {
        name: 'внутреннее имя затеняет внешнее',
        code: `const parent = createEnvironment(null);
parent.declare('level', 'внешний');
const child = createEnvironment(parent);
child.declare('level', 'внутренний');
expect(child.lookup('level')).toBe('внутренний');
expect(parent.lookup('level')).toBe('внешний');`
      },
      {
        name: 'ненайденное имя даёт `ReferenceError`',
        code: `const lonely = createEnvironment(null);
expect(() => lonely.lookup('нет')).toThrow('имя не определено');`
      },
      {
        name: 'глубина цепочки считается до внешнего края',
        code: `const first = createEnvironment(null);
const second = createEnvironment(first);
const third = createEnvironment(second);
expect(first.chainDepth()).toBe(1);
expect(third.chainDepth()).toBe(3);`
      },
      {
        name: 'значение `undefined` отличается от отсутствия имени',
        code: `const holder = createEnvironment(null);
holder.declare('empty', undefined);
expect(holder.lookup('empty')).toBe(undefined);`
      }
    ],
    solution: `function createEnvironment(outer) {
  const record = new Map();

  const environment = {
    declare(name, value) {
      record.set(name, value);
    },
    lookup(name) {
      if (record.has(name)) return record.get(name);
      if (outer) return outer.lookup(name);

      throw new ReferenceError('имя не определено');
    },
    chainDepth() {
      return outer ? outer.chainDepth() + 1 : 1;
    }
  };

  return environment;
}`
  }
]
