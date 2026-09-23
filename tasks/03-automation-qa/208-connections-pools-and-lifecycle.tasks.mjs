export default [
  {
    id: 'qa-208-simple-pool',
    title: 'Пул подключений с ограничением',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `createPool(create, size)` — пул с методами `acquire()`, ' +
      '`release(connection)` и `stats()`. `acquire()` возвращает свободное ' +
      'подключение или создаёт новое через `create()`, пока их меньше `size`; ' +
      'если свободных нет и предел достигнут — ждёт, пока подключение вернут. ' +
      '`release()` возвращает подключение в пул. Повторный возврат того же ' +
      'подключения — ошибка `подключение уже возвращено`. ' +
      '`stats()` отдаёт `{ created, inUse, free }`.',
    starter: `function createPool(create, size) {
  return {
    async acquire() { return null; },
    release(connection) {},
    stats() { return { created: 0, inUse: 0, free: 0 }; }
  };
}`,
    hints: [
      'Пул хранит два списка: свободные подключения и выданные.',
      'Ожидание удобно выразить обещанием, которое разрешит release.',
      'Подключение создаётся только когда свободных нет и предел не достигнут.'
    ],
    tests: [
      {
        name: 'подключения создаются по требованию',
        code: `let made = 0;
const pool = createPool(() => ({ id: ++made }), 2);
const first = await pool.acquire();
expect(first.id).toBe(1);
expect(pool.stats()).toEqual({ created: 1, inUse: 1, free: 0 });`
      },
      {
        name: 'возвращённое подключение переиспользуется',
        code: `let reuseMade = 0;
const reusePool = createPool(() => ({ id: ++reuseMade }), 2);
const taken = await reusePool.acquire();
reusePool.release(taken);
const again = await reusePool.acquire();
expect(again).toBe(taken);
expect(reuseMade).toBe(1);`
      },
      {
        name: 'предел не превышается',
        code: `let limitMade = 0;
const limited = createPool(() => ({ id: ++limitMade }), 2);
await limited.acquire();
await limited.acquire();
expect(limited.stats()).toEqual({ created: 2, inUse: 2, free: 0 });`
      },
      {
        name: 'запрос сверх предела ждёт возврата',
        code: `const waiting = createPool(() => ({}), 1);
const busy = await waiting.acquire();
let got = null;
const pending = waiting.acquire().then(connection => { got = connection; });
expect(got).toBe(null);
waiting.release(busy);
await pending;
expect(got).toBe(busy);`
      },
      {
        name: 'повторный возврат отвергается',
        code: `const strict = createPool(() => ({}), 1);
const connection = await strict.acquire();
strict.release(connection);
let message = '';
try { strict.release(connection); } catch (error) { message = error.message; }
expect(message).toBe('подключение уже возвращено');`
      },
      {
        name: 'статистика отражает свободные подключения',
        code: `const counted = createPool(() => ({}), 2);
const a = await counted.acquire();
const b = await counted.acquire();
counted.release(a);
expect(counted.stats()).toEqual({ created: 2, inUse: 1, free: 1 });
counted.release(b);
expect(counted.stats()).toEqual({ created: 2, inUse: 0, free: 2 });`
      }
    ],
    solution: `function createPool(create, size) {
  const free = [];
  const inUse = new Set();
  const waiting = [];
  let created = 0;

  const handOut = connection => {
    inUse.add(connection);

    return connection;
  };

  return {
    async acquire() {
      if (free.length > 0) {
        return handOut(free.pop());
      }

      if (created < size) {
        created += 1;

        return handOut(create());
      }

      return new Promise(resolve => {
        waiting.push(connection => resolve(handOut(connection)));
      });
    },

    release(connection) {
      if (!inUse.has(connection)) {
        throw new Error('подключение уже возвращено');
      }

      inUse.delete(connection);

      const next = waiting.shift();

      if (next === undefined) {
        free.push(connection);
      } else {
        next(connection);
      }
    },

    stats() {
      return { created, inUse: inUse.size, free: free.length };
    }
  };
}`
  }
]
