export default [
  {
    id: 'qa-221-cleanup-scope',
    title: 'Очистка в обратном порядке',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `createCleanupScope()` со свойствами `register(name, dispose)` и ' +
      '`cleanup()`. `cleanup()` вызывает зарегистрированные `dispose` в **обратном** ' +
      'порядке, дожидается каждого и продолжает после ошибки. Результат — массив ' +
      'имён тех, чей `dispose` бросил ошибку, в порядке выполнения. Повторный ' +
      'вызов `cleanup()` не должен вызывать те же `dispose` второй раз.',
    starter: `function createCleanupScope() {
  return {
    register(name, dispose) {},
    async cleanup() { return []; }
  };
}`,
    hints: [
      'Последний созданный ресурс обычно зависит от предыдущих — отсюда обратный порядок.',
      'Ошибка одного dispose не должна остановить остальные.',
      'После очистки список зарегистрированного должен опустеть.'
    ],
    tests: [
      {
        name: 'порядок очистки обратный',
        code: `const order = [];
const scope = createCleanupScope();
scope.register('первый', () => { order.push('первый'); });
scope.register('второй', () => { order.push('второй'); });
await scope.cleanup();
expect(order).toEqual(['второй', 'первый']);`
      },
      {
        name: 'ошибка не останавливает очистку',
        code: `const done = [];
const failing = createCleanupScope();
failing.register('база', () => { done.push('база'); });
failing.register('файл', () => { throw new Error('нет доступа'); });
const failed = await failing.cleanup();
expect(done).toEqual(['база']);
expect(failed).toEqual(['файл']);`
      },
      {
        name: 'асинхронный dispose дожидается',
        code: `const finished = [];
const asyncScope = createCleanupScope();
asyncScope.register('медленный', async () => {
  await new Promise(resolve => setTimeout(resolve, 10));
  finished.push('медленный');
});
asyncScope.register('быстрый', () => { finished.push('быстрый'); });
await asyncScope.cleanup();
expect(finished).toEqual(['быстрый', 'медленный']);`
      },
      {
        name: 'без ошибок возвращается пустой список',
        code: `const clean = createCleanupScope();
clean.register('ресурс', () => {});
expect(await clean.cleanup()).toEqual([]);`
      },
      {
        name: 'повторная очистка ничего не вызывает',
        code: `let calls = 0;
const once = createCleanupScope();
once.register('ресурс', () => { calls += 1; });
await once.cleanup();
await once.cleanup();
expect(calls).toBe(1);`
      },
      {
        name: 'пустая область очищается без ошибок',
        code: `expect(await createCleanupScope().cleanup()).toEqual([]);`
      }
    ],
    solution: `function createCleanupScope() {
  const registered = [];

  return {
    register(name, dispose) {
      registered.push({ name, dispose });
    },

    async cleanup() {
      // splice забирает список целиком: повторный вызов уже ничего не найдёт.
      const pending = registered.splice(0, registered.length).reverse();
      const failed = [];

      for (const { name, dispose } of pending) {
        try {
          await dispose();
        } catch {
          failed.push(name);
        }
      }

      return failed;
    }
  };
}`
  }
]
