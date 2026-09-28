export default [
  {
    id: 'ts-138-default-payload',
    title: 'Параметр типа со значением по умолчанию',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `ApiResult<T = Record<string, unknown>> = { ok: boolean; data: T }`. ' +
      'Напишите функцию `wrapResult<T = Record<string, unknown>>(data: T, ok?: boolean): ApiResult<T>`: ' +
      'она оборачивает данные, а `ok` по умолчанию равен `true`. Дополнительно ' +
      'напишите `unwrapResult<T>(result: ApiResult<T>, fallback: T): T`, которая ' +
      'возвращает `data` при `ok: true` и `fallback` иначе. Значение по ' +
      'умолчанию у параметра типа существует только при компиляции — на ' +
      'поведение во время выполнения оно не влияет.',
    starter: `type ApiResult<T = Record<string, unknown>> = { ok: boolean; data: T };

function wrapResult<T = Record<string, unknown>>(data: T, ok?: boolean): ApiResult<T> {
  return { ok: true, data };
}

function unwrapResult<T>(result: ApiResult<T>, fallback: T): T {
  return fallback;
}`,
    hints: [
      'Значение по умолчанию у параметра функции и значение по умолчанию у параметра типа — разные вещи: первое работает во время выполнения, второе нет.',
      'Флаг `ok` отсутствует только когда он `undefined`; переданный `false` должен сохраниться.',
      '`unwrapResult` смотрит на `ok`, а не на содержимое `data`: пустой объект — это данные.'
    ],
    tests: [
      {
        name: 'по умолчанию результат успешен',
        code: `expect(wrapResult({ id: 1 })).toEqual({ ok: true, data: { id: 1 } });`
      },
      {
        name: 'явный `false` сохраняется',
        code: `expect(wrapResult({ id: 1 }, false)).toEqual({ ok: false, data: { id: 1 } });`
      },
      {
        name: 'разворачивание успешного результата',
        code: `expect(unwrapResult({ ok: true, data: 'значение' }, 'запасное')).toBe('значение');`
      },
      {
        name: 'при неуспехе берётся запасное значение',
        code: `expect(unwrapResult({ ok: false, data: 'значение' }, 'запасное')).toBe('запасное');`
      },
      {
        name: 'пустые данные успешного результата остаются данными',
        code: `expect(unwrapResult({ ok: true, data: {} }, { id: 0 })).toEqual({});`
      },
      {
        name: 'обёртка не копирует данные лишний раз',
        code: `const payload = { id: 1 };
expect(wrapResult(payload).data === payload).toBe(true);`
      }
    ],
    solution: `type ApiResult<T = Record<string, unknown>> = { ok: boolean; data: T };

function wrapResult<T = Record<string, unknown>>(data: T, ok?: boolean): ApiResult<T> {
  return { ok: ok ?? true, data };
}

function unwrapResult<T>(result: ApiResult<T>, fallback: T): T {
  return result.ok ? result.data : fallback;
}`
  }
]
