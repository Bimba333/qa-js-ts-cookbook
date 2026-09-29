export default [
  {
    id: 'fp-257-cleanup-stack',
    title: 'Стек очистки в обратном порядке',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `createOwnedData()`. Объект имеет два метода: ' +
      '`own(name, release)` — зарегистрировать ресурс, и `release()` — ' +
      'освободить всё. Освобождение идёт в порядке, обратном регистрации. Одна ' +
      'упавшая функция освобождения не должна прерывать остальные. Если ошибок ' +
      'не было, `release()` возвращает массив имён в порядке освобождения; если ' +
      'были — бросает `Error`, в сообщении которого перечислены имена упавших ' +
      'ресурсов через запятую с пробелом, в том же обратном порядке.',
    starter: `function createOwnedData() {
  const items = [];

  return {
    own(name, release) {
      items.push({ name, release });
    },
    async release() {
      // Обратный порядок и продолжение после ошибки.
      for (const item of items) await item.release();

      return items.map(item => item.name);
    }
  };
}`,
    hints: [
      'Дочерние ресурсы регистрируются позже родительских, поэтому освобождаются раньше.',
      'Каждый шаг закрывается собственным перехватом, иначе остальные не выполнятся.',
      'Имена упавших собираются в список и попадают в сообщение.'
    ],
    tests: [
      {
        name: 'освобождение идёт в обратном порядке',
        code: `const orderLog = [];
const owned = createOwnedData();
owned.own('владелец', async () => { orderLog.push('владелец'); });
owned.own('задача', async () => { orderLog.push('задача'); });
owned.own('метка', async () => { orderLog.push('метка'); });
expect(await owned.release()).toEqual(['метка', 'задача', 'владелец']);
expect(orderLog).toEqual(['метка', 'задача', 'владелец']);`
      },
      {
        name: 'одна ошибка не останавливает остальные шаги',
        code: `const partialLog = [];
const partial = createOwnedData();
partial.own('владелец', async () => { partialLog.push('владелец'); });
partial.own('задача', async () => { throw new Error('23503'); });
partial.own('метка', async () => { partialLog.push('метка'); });
let partialFailure = null;
try {
  await partial.release();
} catch (error) {
  partialFailure = error;
}
expect(partialLog).toEqual(['метка', 'владелец']);
expect(partialFailure.message).toContain('задача');`
      },
      {
        name: 'несколько упавших ресурсов названы в обратном порядке',
        code: `const twoBroken = createOwnedData();
twoBroken.own('первый', async () => { throw new Error('x'); });
twoBroken.own('второй', async () => { throw new Error('y'); });
let twoFailure = null;
try {
  await twoBroken.release();
} catch (error) {
  twoFailure = error;
}
expect(twoFailure.message).toContain('второй, первый');`
      },
      {
        name: 'пустой стек освобождается без ошибок',
        code: `const emptyOwned = createOwnedData();
expect(await emptyOwned.release()).toEqual([]);`
      }
    ],
    solution: `function createOwnedData() {
  const items = [];

  return {
    own(name, release) {
      items.push({ name, release });
    },
    async release() {
      const released = [];
      const broken = [];

      // Обратный порядок повторяет порядок зависимостей.
      for (const item of [...items].reverse()) {
        try {
          await item.release();
          released.push(item.name);
        } catch (error) {
          broken.push(item.name);
        }
      }

      if (broken.length > 0) {
        throw new Error('не удалось освободить: ' + broken.join(', '));
      }

      return released;
    }
  };
}`
  },
  {
    id: 'fp-257-original-error-first',
    title: 'Исходная ошибка идёт первой',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `runScenario(body, cleanup)`. Выполните `body()`, затем — ' +
      '**всегда** — `cleanup()`. Если упало только тело, пропустите его ошибку ' +
      'наружу. Если упала только очистка, пропустите её ошибку. Если упали ' +
      'оба, бросьте `AggregateError`, в котором `errors[0]` — ошибка тела, а ' +
      '`errors[1]` — ошибка очистки: причина падения важнее проблемы удаления. ' +
      'При успехе верните результат тела.',
    starter: `async function runScenario(body, cleanup) {
  try {
    return await body();
  } finally {
    // Ошибка очистки не должна подменять причину падения.
    await cleanup();
  }
}`,
    hints: [
      'Ошибку тела нужно сохранить, а не пробросить сразу.',
      'Очистка выполняется в собственном try.',
      'AggregateError принимает массив ошибок первым аргументом.'
    ],
    tests: [
      {
        name: 'успешный сценарий возвращает результат и чистит данные',
        code: `let cleanedOnSuccess = 0;
const okValue = await runScenario(
  async () => 'готово',
  async () => { cleanedOnSuccess += 1; }
);
expect(okValue).toBe('готово');
expect(cleanedOnSuccess).toBe(1);`
      },
      {
        name: 'ошибка тела доходит наружу, очистка всё равно выполняется',
        code: `let cleanedOnFailure = 0;
let bodyFailure = null;
try {
  await runScenario(
    async () => { throw new Error('статус не изменился'); },
    async () => { cleanedOnFailure += 1; }
  );
} catch (error) {
  bodyFailure = error;
}
expect(bodyFailure.message).toBe('статус не изменился');
expect(cleanedOnFailure).toBe(1);`
      },
      {
        name: 'при падении обоих исходная ошибка идёт первой',
        code: `let bothFailure = null;
try {
  await runScenario(
    async () => { throw new Error('проверка не прошла'); },
    async () => { throw new Error('не удалось удалить запись'); }
  );
} catch (error) {
  bothFailure = error;
}
expect(bothFailure.errors).toHaveLength(2);
expect(bothFailure.errors[0].message).toBe('проверка не прошла');
expect(bothFailure.errors[1].message).toBe('не удалось удалить запись');`
      },
      {
        name: 'падение только очистки сообщается как есть',
        code: `let cleanupOnlyFailure = null;
try {
  await runScenario(
    async () => 'готово',
    async () => { throw new Error('не удалось удалить запись'); }
  );
} catch (error) {
  cleanupOnlyFailure = error;
}
expect(cleanupOnlyFailure.message).toBe('не удалось удалить запись');`
      }
    ],
    solution: `async function runScenario(body, cleanup) {
  let bodyFailure = null;
  let value;

  try {
    value = await body();
  } catch (error) {
    bodyFailure = error;
  }

  let cleanupFailure = null;

  try {
    await cleanup();
  } catch (error) {
    cleanupFailure = error;
  }

  if (bodyFailure && cleanupFailure) {
    // Первой идёт причина падения теста, второй — проблема очистки.
    throw new AggregateError([bodyFailure, cleanupFailure], 'сценарий и очистка не удались');
  }

  if (bodyFailure) throw bodyFailure;
  if (cleanupFailure) throw cleanupFailure;

  return value;
}`
  }
];
