export default [
  {
    id: 'js-11-primitives-are-immutable',
    title: 'Примитивы неизменяемы',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `describeValue(value)` — возвращает результат `typeof`, кроме ' +
      'двух случаев: для `null` вернуть `"null"`, для массива — `"array"`. ' +
      'Напишите `tryMutate(value)` — пытается изменить значение (присвоить ' +
      'свойство `mutated`) и возвращает `{ changed, result }`: изменилось ли ' +
      'значение и что вернуло обращение к `value.mutated` после попытки. ' +
      'Для примитивов изменение не происходит, для объектов — происходит.',
    starter: `function describeValue(value) {
  return '';
}

function tryMutate(value) {
  return { changed: false, result: undefined };
}`,
    hints: [
      'typeof null возвращает "object" — этот случай обрабатывается отдельно.',
      'Присваивание свойства примитиву не выбрасывает ошибку вне строгого режима.',
      'У примитива после присваивания свойства читается undefined.'
    ],
    tests: [
      {
        name: 'примитивы описываются',
        code: `expect(describeValue('a')).toBe('string');
expect(describeValue(1)).toBe('number');
expect(describeValue(true)).toBe('boolean');
expect(describeValue(undefined)).toBe('undefined');`
      },
      {
        name: 'null и массив — особые случаи',
        code: `expect(describeValue(null)).toBe('null');
expect(describeValue([])).toBe('array');`
      },
      {
        name: 'объект и функция',
        code: `expect(describeValue({})).toBe('object');
expect(describeValue(() => {})).toBe('function');`
      },
      {
        name: 'примитив не меняется',
        code: `const result = tryMutate('строка');
expect(result.changed).toBe(false);
expect(result.result).toBeUndefined();`
      },
      {
        name: 'число тоже не меняется',
        code: `expect(tryMutate(42).changed).toBe(false);`
      },
      {
        name: 'объект меняется',
        code: `const result = tryMutate({});
expect(result.changed).toBe(true);
expect(result.result).toBe(true);`
      },
      {
        name: 'массив меняется',
        code: `expect(tryMutate([]).changed).toBe(true);`
      }
    ],
    solution: `function describeValue(value) {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  return typeof value;
}

function tryMutate(value) {
  try {
    value.mutated = true;
  } catch {
    // Строгий режим запрещает присваивание свойства примитиву.
  }

  const result = value === null || value === undefined ? undefined : value.mutated;

  return { changed: result === true, result };
}`
  }
]
