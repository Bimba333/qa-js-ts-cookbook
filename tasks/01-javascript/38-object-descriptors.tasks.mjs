export default [
  {
    id: 'js-38-readonly-field',
    title: 'Свойство только для чтения',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `withFrozenId(item, id)`, которая возвращает объект с полем ' +
      '`id`, недоступным для изменения и не участвующим в переборе ключей. ' +
      'Остальные поля `item` остаются обычными.',
    starter: `function withFrozenId(item, id) {
  // Поведение свойства задаётся дескриптором.
}`,
    hints: [
      'Дескриптор задаётся через Object.defineProperty.',
      'За изменяемость отвечает writable, за перебор — enumerable.',
      'По умолчанию оба признака равны false.'
    ],
    tests: [
      {
        name: 'значение читается',
        code: `expect(withFrozenId({ name: 'login' }, 'x-1').id).toBe('x-1');`
      },
      {
        name: 'изменение не проходит',
        code: `const item = withFrozenId({ name: 'login' }, 'x-1');
try { item.id = 'другое'; } catch (error) { /* в строгом режиме бросает */ }
expect(item.id).toBe('x-1');`
      },
      {
        name: 'поле не попадает в перебор ключей',
        code: `expect(Object.keys(withFrozenId({ name: 'login' }, 'x-1'))).toEqual(['name']);`
      },
      {
        name: 'остальные поля остаются обычными',
        code: `const item = withFrozenId({ name: 'login' }, 'x-1');
item.name = 'order';
expect(item.name).toBe('order');`
      }
    ],
    solution: `function withFrozenId(item, id) {
  const result = { ...item };

  Object.defineProperty(result, 'id', { value: id });

  return result;
}`
  },

  {
    id: 'js-38-freeze-is-shallow',
    title: 'Заморозка действует на один уровень',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `describeFreeze(config)`, которая замораживает объект и ' +
      'возвращает `{ topFrozen, nestedFrozen }`: заморожен ли сам объект и заморожен ' +
      'ли вложенный объект `nested`. Задача показывает, что заморозка поверхностная.',
    starter: `function describeFreeze(config) {
  // Object.freeze действует только на верхний уровень.
}`,
    hints: [
      'Проверить состояние помогает Object.isFrozen.',
      'Вложенный объект остаётся изменяемым.',
      'Возвращать нужно два признака, а не сам объект.'
    ],
    tests: [
      {
        name: 'верхний уровень заморожен',
        code: `expect(describeFreeze({ a: 1, nested: { b: 2 } }).topFrozen).toBe(true);`
      },
      {
        name: 'вложенный объект не заморожен',
        code: `expect(describeFreeze({ a: 1, nested: { b: 2 } }).nestedFrozen).toBe(false);`
      },
      {
        name: 'вложенный объект действительно изменяем',
        code: `const config = { a: 1, nested: { b: 2 } };
describeFreeze(config);
config.nested.b = 99;
expect(config.nested.b).toBe(99);`
      },
      {
        name: 'верхний уровень изменить нельзя',
        code: `const config = { a: 1, nested: { b: 2 } };
describeFreeze(config);
try { config.a = 99; } catch (error) { /* строгий режим бросает */ }
expect(config.a).toBe(1);`
      }
    ],
    solution: `function describeFreeze(config) {
  Object.freeze(config);

  return {
    topFrozen: Object.isFrozen(config),
    nestedFrozen: Object.isFrozen(config.nested)
  };
}`
  }
]
