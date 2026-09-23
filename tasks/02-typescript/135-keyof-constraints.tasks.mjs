export default [
  {
    id: 'ts-135-set-field-immutably',
    title: 'Изменение поля без изменения объекта',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите `setField<T extends object, K extends keyof T>(item: T, key: K, ' +
      'value: T[K]): T` — возвращает **копию** объекта с заменённым полем. ' +
      'Исходный объект не меняется. Напишите ' +
      '`setFields<T extends object>(item: T, patch: Partial<T>): T` — ту же ' +
      'операцию для нескольких полей, причём ключи, которых нет у объекта, ' +
      'пропускаются, а значение `undefined` не затирает существующее.',
    starter: `function setField<T extends object, K extends keyof T>(item: T, key: K, value: T[K]): T {
  return item;
}

function setFields<T extends object>(item: T, patch: Partial<T>): T {
  return item;
}`,
    hints: [
      'Ограничение K extends keyof T допускает только существующие ключи.',
      'Копия создаётся до присваивания, а не после.',
      'Наличие ключа у объекта проверяется во время выполнения.'
    ],
    tests: [
      {
        name: 'поле заменяется в копии',
        code: `expect(setField({ id: 'a', version: 1 }, 'version', 2))
  .toEqual({ id: 'a', version: 2 });`
      },
      {
        name: 'исходный объект не меняется',
        code: `const source = { id: 'a', version: 1 };
setField(source, 'version', 9);
expect(source.version).toBe(1);`
      },
      {
        name: 'возвращается другой объект',
        code: `const source = { id: 'a' };
expect(setField(source, 'id', 'b') === source).toBe(false);`
      },
      {
        name: 'несколько полей сразу',
        code: `expect(setFields({ id: 'a', version: 1, title: 'x' }, { version: 2, title: 'y' }))
  .toEqual({ id: 'a', version: 2, title: 'y' });`
      },
      {
        name: 'undefined не затирает значение',
        code: `expect(setFields({ id: 'a', version: 1 }, { version: undefined }).version).toBe(1);`
      },
      {
        name: 'неизвестный ключ пропускается',
        code: `const patch = { missing: 'x' } as unknown as Partial<{ id: string }>;
expect(setFields({ id: 'a' }, patch)).toEqual({ id: 'a' });`
      },
      {
        name: 'пустое изменение даёт копию',
        code: `const source = { id: 'a' };
const copy = setFields(source, {});
expect(copy).toEqual({ id: 'a' });
expect(copy === source).toBe(false);`
      }
    ],
    solution: `function setField<T extends object, K extends keyof T>(item: T, key: K, value: T[K]): T {
  return { ...item, [key]: value };
}

function setFields<T extends object>(item: T, patch: Partial<T>): T {
  const result = { ...item };

  for (const key of Object.keys(patch) as (keyof T)[]) {
    const value = patch[key];

    if (value !== undefined && Object.hasOwn(item, key as string)) {
      result[key] = value as T[keyof T];
    }
  }

  return result;
}`
  }
]
