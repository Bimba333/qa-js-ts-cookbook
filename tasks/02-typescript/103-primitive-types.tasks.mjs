export default [
  {
    id: 'ts-103-primitive-behaviour',
    title: 'Примитивы и их поведение',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `describePrimitive(value: unknown): string`, возвращающую ' +
      '`"строка"`, `"число"`, `"булево"`, `"большое целое"`, `"символ"`, ' +
      '`"ничего"` (для `null` и `undefined`) или `"не примитив"`. ' +
      '`NaN` считается числом. Напишите `upperFirst(value: string): string` — ' +
      'строка с заглавной первой буквой; исходная строка измениться не может, ' +
      'потому что строки неизменяемы, и это надо показать: функция возвращает ' +
      'новую строку, а не меняет аргумент.',
    starter: `function describePrimitive(value: unknown): string {
  return '';
}

function upperFirst(value: string): string {
  return value;
}`,
    hints: [
      'typeof null возвращает "object" — этот случай проверяется отдельно.',
      'Для bigint и symbol есть собственные значения typeof.',
      'Изменить символ строки по индексу нельзя: операция просто не действует.'
    ],
    tests: [
      {
        name: 'примитивы распознаются',
        code: `expect(describePrimitive('a')).toBe('строка');
expect(describePrimitive(1)).toBe('число');
expect(describePrimitive(true)).toBe('булево');
expect(describePrimitive(10n)).toBe('большое целое');
expect(describePrimitive(Symbol('x'))).toBe('символ');`
      },
      {
        name: 'null и undefined — отсутствие значения',
        code: `expect(describePrimitive(null)).toBe('ничего');
expect(describePrimitive(undefined)).toBe('ничего');`
      },
      {
        name: 'NaN остаётся числом',
        code: `expect(describePrimitive(NaN)).toBe('число');`
      },
      {
        name: 'объекты и массивы примитивами не являются',
        code: `expect(describePrimitive({})).toBe('не примитив');
expect(describePrimitive([])).toBe('не примитив');
expect(describePrimitive(() => {})).toBe('не примитив');`
      },
      {
        name: 'первая буква становится заглавной',
        code: `expect(upperFirst('вход')).toBe('Вход');
expect(upperFirst('')).toBe('');`
      },
      {
        name: 'исходная строка не изменяется',
        code: `const source = 'вход';
upperFirst(source);
expect(source).toBe('вход');`
      },
      {
        name: 'строка неизменяема во время выполнения',
        code: `const value = 'abc';
try { (value as unknown as string[])[0] = 'z'; } catch { /* строгий режим */ }
expect(value).toBe('abc');`
      }
    ],
    solution: `function describePrimitive(value: unknown): string {
  if (value === null || value === undefined) {
    return 'ничего';
  }

  switch (typeof value) {
    case 'string': return 'строка';
    case 'number': return 'число';
    case 'boolean': return 'булево';
    case 'bigint': return 'большое целое';
    case 'symbol': return 'символ';
    default: return 'не примитив';
  }
}

function upperFirst(value: string): string {
  if (value === '') {
    return value;
  }

  return value[0].toUpperCase() + value.slice(1);
}`
  }
]
