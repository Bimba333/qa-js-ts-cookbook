export default [
  {
    id: 'ts-126-promise-wrapping',
    title: 'Результат всегда обёрнут',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите три функции. `loadValue(): Promise<string>` — асинхронная, ' +
      'возвращает `готово`. `failLoad(): Promise<never>` — асинхронная, ' +
      'выбрасывает ошибку `загрузка не удалась`. ' +
      '`inspect(): Promise<{ isPromise, awaited, nested, caught, plain }>` — ' +
      'возвращает признак того, что `loadValue()` без `await` даёт промис; ' +
      'значение после `await`; результат `await` над промисом, который ' +
      'разрешается другим промисом; текст пойманной ошибки `failLoad`; ' +
      'результат `await` над обычным значением `42`.',
    starter: `async function loadValue(): Promise<string> {
  return '';
}

async function failLoad(): Promise<never> {
  throw new Error('');
}

async function inspect() {
  return { isPromise: false, awaited: '', nested: '', caught: '', plain: 0 };
}`,
    hints: [
      'Асинхронная функция возвращает промис, даже если внутри нет ожидания.',
      'Вложенные промисы разворачиваются: await не даёт промис внутри промиса.',
      'await работает и с обычными значениями.'
    ],
    tests: [
      {
        name: 'вызов без await даёт промис',
        code: `const inspected = await inspect();
expect(inspected.isPromise).toBe(true);`
      },
      {
        name: 'await разворачивает значение',
        code: `expect((await inspect()).awaited).toBe('готово');`
      },
      {
        name: 'вложенный промис разворачивается',
        code: `expect((await inspect()).nested).toBe('готово');`
      },
      {
        name: 'ошибка превращается в отклонение',
        code: `expect((await inspect()).caught).toBe('загрузка не удалась');`
      },
      {
        name: 'await над обычным значением',
        code: `expect((await inspect()).plain).toBe(42);`
      },
      {
        name: 'failLoad действительно отклоняется',
        code: `const rejected = failLoad();
rejected.catch(() => {});
let message = '';
try { await rejected; } catch (error) { message = (error as Error).message; }
expect(message).toBe('загрузка не удалась');`
      }
    ],
    solution: `async function loadValue(): Promise<string> {
  return 'готово';
}

async function failLoad(): Promise<never> {
  throw new Error('загрузка не удалась');
}

async function inspect() {
  const pending = loadValue();
  const isPromise = typeof (pending as { then?: unknown }).then === 'function';

  const awaited = await pending;

  const nested = await Promise.resolve(loadValue());

  let caught = '';

  try {
    await failLoad();
  } catch (error) {
    caught = (error as Error).message;
  }

  const plain = await 42;

  return { isPromise, awaited, nested, caught, plain };
}`
  }
]
