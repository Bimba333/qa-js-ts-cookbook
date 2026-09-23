export default [
  {
    id: 'qa-235-resource-per-worker',
    title: 'У ресурса должен быть владелец',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `createResourcePool(names)` с методами `acquire(workerIndex)` и ' +
      '`release(workerIndex)`. Один worker получает **один и тот же** ресурс при ' +
      'повторных вызовах `acquire`, пока не освободит его. Разные worker никогда ' +
      'не получают один ресурс одновременно. Если свободных имён нет — ошибка ' +
      '`свободных ресурсов нет`. `release` для worker без ресурса — ошибка ' +
      '`ресурс не был выдан`. После освобождения имя снова доступно.',
    starter: `function createResourcePool(names) {
  return {
    acquire(workerIndex) { return ''; },
    release(workerIndex) {}
  };
}`,
    hints: [
      'Соответствие worker и ресурса удобно хранить в Map.',
      'Повторный acquire того же worker не должен занимать второй ресурс.',
      'Освобождённое имя возвращается в список свободных.'
    ],
    tests: [
      {
        name: 'разные worker получают разные ресурсы',
        code: `const pool = createResourcePool(['db-1', 'db-2']);
const first = pool.acquire(0);
const second = pool.acquire(1);
expect(first === second).toBe(false);`
      },
      {
        name: 'повторный запрос возвращает тот же ресурс',
        code: `const stable = createResourcePool(['db-1', 'db-2']);
expect(stable.acquire(0)).toBe(stable.acquire(0));`
      },
      {
        name: 'повторный запрос не занимает второй ресурс',
        code: `const counted = createResourcePool(['db-1', 'db-2']);
counted.acquire(0);
counted.acquire(0);
expect(counted.acquire(1)).toBe('db-2');`
      },
      {
        name: 'без свободных ресурсов выдаётся ошибка',
        code: `const tight = createResourcePool(['db-1']);
tight.acquire(0);
let message = '';
try { tight.acquire(1); } catch (error) { message = error.message; }
expect(message).toBe('свободных ресурсов нет');`
      },
      {
        name: 'освобождённый ресурс выдаётся снова',
        code: `const reused = createResourcePool(['db-1']);
const taken = reused.acquire(0);
reused.release(0);
expect(reused.acquire(1)).toBe(taken);`
      },
      {
        name: 'освобождение невыданного ресурса отвергается',
        code: `const strict = createResourcePool(['db-1']);
let releaseMessage = '';
try { strict.release(0); } catch (error) { releaseMessage = error.message; }
expect(releaseMessage).toBe('ресурс не был выдан');`
      },
      {
        name: 'после освобождения повторное освобождение отвергается',
        code: `const once = createResourcePool(['db-1']);
once.acquire(0);
once.release(0);
let twice = '';
try { once.release(0); } catch (error) { twice = error.message; }
expect(twice).toBe('ресурс не был выдан');`
      }
    ],
    solution: `function createResourcePool(names) {
  const free = [...names];
  const assigned = new Map();

  return {
    acquire(workerIndex) {
      const existing = assigned.get(workerIndex);

      if (existing !== undefined) {
        return existing;
      }

      if (free.length === 0) {
        throw new Error('свободных ресурсов нет');
      }

      const resource = free.shift();
      assigned.set(workerIndex, resource);

      return resource;
    },

    release(workerIndex) {
      const resource = assigned.get(workerIndex);

      if (resource === undefined) {
        throw new Error('ресурс не был выдан');
      }

      assigned.delete(workerIndex);
      free.push(resource);
    }
  };
}`
  }
]
