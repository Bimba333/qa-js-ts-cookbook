export default [
  {
    id: 'ts-143-conditional-shape',
    title: 'Условный тип и его поведение',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите условный тип ' +
      '`Unwrapped<T> = T extends Array<infer Item> ? Item : T`. Напишите ' +
      'функцию `unwrapValue<T>(value: T): Unwrapped<T>`, которая для массива ' +
      'возвращает его первый элемент, а для остальных значений — само значение. ' +
      'Пустой массив даёт `undefined`. Дополнительно напишите ' +
      '`describeShape(value: unknown): \'массив\' | \'значение\'`. Условный тип ' +
      'существует только при компиляции, поэтому разветвление во время ' +
      'выполнения придётся написать самому.',
    starter: `type Unwrapped<T> = T extends Array<infer Item> ? Item : T;

function unwrapValue<T>(value: T): Unwrapped<T> {
  // Условный тип не создаёт кода: ветвление нужно написать руками.
  return value as Unwrapped<T>;
}

function describeShape(value: unknown): 'массив' | 'значение' {
  return 'значение';
}`,
    hints: [
      'Массив отличается от объекта проверкой `Array.isArray`, а не `typeof`.',
      'Ветка условного типа выбирается компилятором, а одноимённое ветвление в коде — оператором `if`.',
      'Результат для пустого массива — обычный `undefined` при обращении по индексу.'
    ],
    tests: [
      {
        name: 'массив разворачивается до первого элемента',
        code: `expect(unwrapValue([1, 2, 3])).toBe(1);`
      },
      {
        name: 'не массив возвращается как есть',
        code: `expect(unwrapValue('строка')).toBe('строка');
expect(unwrapValue(42)).toBe(42);`
      },
      {
        name: 'пустой массив даёт `undefined`',
        code: `expect(unwrapValue([])).toBe(undefined);`
      },
      {
        name: 'объект не считается массивом',
        code: `expect(unwrapValue({ length: 2 })).toEqual({ length: 2 });
expect(describeShape({ length: 2 })).toBe('значение');`
      },
      {
        name: 'форма определяется правильно',
        code: `expect(describeShape([1])).toBe('массив');
expect(describeShape('строка')).toBe('значение');
expect(describeShape(null)).toBe('значение');`
      },
      {
        name: 'вложенный массив разворачивается на один уровень',
        code: `expect(unwrapValue([[1, 2], [3]])).toEqual([1, 2]);`
      }
    ],
    solution: `type Unwrapped<T> = T extends Array<infer Item> ? Item : T;

function unwrapValue<T>(value: T): Unwrapped<T> {
  if (Array.isArray(value)) return value[0] as Unwrapped<T>;

  return value as Unwrapped<T>;
}

function describeShape(value: unknown): 'массив' | 'значение' {
  return Array.isArray(value) ? 'массив' : 'значение';
}`
  }
]
