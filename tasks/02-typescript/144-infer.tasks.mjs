export default [
  {
    id: 'ts-144-infer-return',
    title: 'Извлечение типа результата',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите два типа: ' +
      '`ResultOf<F> = F extends (...args: never[]) => infer R ? R : never` и ' +
      '`AwaitedResultOf<F> = F extends (...args: never[]) => Promise<infer R> ? R : ResultOf<F>`. ' +
      'Напишите асинхронную функцию ' +
      '`callAndDescribe<F extends (...args: never[]) => unknown>(fn: F): Promise<{ value: unknown; wasPromise: boolean }>`, ' +
      'которая вызывает `fn` без аргументов, дожидается результата, если это ' +
      'промис, и сообщает, был ли он промисом.',
    starter: `type ResultOf<F> = F extends (...args: never[]) => infer R ? R : never;
type AwaitedResultOf<F> = F extends (...args: never[]) => Promise<infer R> ? R : ResultOf<F>;

async function callAndDescribe<F extends (...args: never[]) => unknown>(
  fn: F
): Promise<{ value: unknown; wasPromise: boolean }> {
  // Признак промиса нужно определить до ожидания.
  return { value: undefined, wasPromise: false };
}`,
    hints: [
      '`infer` работает только при компиляции: во время выполнения о типе результата ничего не известно заранее.',
      'Промис узнаётся по наличию метода `then` у возвращённого значения.',
      'Признак `wasPromise` надо вычислить до `await`: после ожидания промиса уже нет.'
    ],
    tests: [
      {
        name: 'обычное значение возвращается как есть',
        code: `expect(await callAndDescribe(() => 42)).toEqual({ value: 42, wasPromise: false });`
      },
      {
        name: 'промис разворачивается',
        code: `expect(await callAndDescribe(async () => 'готово'))
  .toEqual({ value: 'готово', wasPromise: true });`
      },
      {
        name: 'промис, созданный вручную, тоже распознаётся',
        code: `const manual = await callAndDescribe(() => Promise.resolve({ id: 1 }));
expect(manual.wasPromise).toBe(true);
expect(manual.value).toEqual({ id: 1 });`
      },
      {
        name: 'объект с методом `then` считается промисом',
        code: `const thenable = await callAndDescribe(() => ({ then: (resolve: (v: string) => void) => resolve('из then') }));
expect(thenable.value).toBe('из then');
expect(thenable.wasPromise).toBe(true);`
      },
      {
        name: 'возврат `undefined` обрабатывается',
        code: `expect(await callAndDescribe(() => undefined))
  .toEqual({ value: undefined, wasPromise: false });`
      }
    ],
    solution: `type ResultOf<F> = F extends (...args: never[]) => infer R ? R : never;
type AwaitedResultOf<F> = F extends (...args: never[]) => Promise<infer R> ? R : ResultOf<F>;

async function callAndDescribe<F extends (...args: never[]) => unknown>(
  fn: F
): Promise<{ value: unknown; wasPromise: boolean }> {
  const returned = (fn as () => unknown)();
  const wasPromise =
    typeof (returned as { then?: unknown })?.then === 'function';

  return { value: await returned, wasPromise };
}`
  }
]
