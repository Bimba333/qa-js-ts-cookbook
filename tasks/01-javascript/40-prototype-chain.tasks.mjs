export default [
  {
    id: 'js-40-chain-depth',
    title: 'Глубина цепочки прототипов',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `protoDepth(value)`, которая возвращает количество звеньев ' +
      'цепочки прототипов до `null`. Для объекта, созданного литералом, глубина ' +
      'равна `1`, для объекта без прототипа — `0`.',
    starter: `function protoDepth(value) {
  // Цепочка заканчивается значением null.
}`,
    hints: [
      'Следующее звено даёт Object.getPrototypeOf.',
      'Цепочка заканчивается, когда прототип равен null.',
      'Объект без прототипа создаётся через Object.create(null).'
    ],
    tests: [
      {
        name: 'литерал объекта — одно звено',
        code: `expect(protoDepth({})).toBe(1);`
      },
      {
        name: 'объект без прототипа — ноль звеньев',
        code: `expect(protoDepth(Object.create(null))).toBe(0);`
      },
      {
        name: 'дополнительное звено удлиняет цепочку',
        code: `expect(protoDepth(Object.create({}))).toBe(2);`
      },
      {
        name: 'массив длиннее обычного объекта',
        code: `expect(protoDepth([]) > protoDepth({})).toBe(true);`
      }
    ],
    solution: `function protoDepth(value) {
  let depth = 0;
  let current = Object.getPrototypeOf(value);

  while (current !== null) {
    depth += 1;
    current = Object.getPrototypeOf(current);
  }

  return depth;
}`
  },

  {
    id: 'js-40-method-this-binding',
    title: 'Чему равен this у найденного метода',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Дан прототип с методом `whoAmI()`, возвращающим `this.name`. Напишите функцию ' +
      '`callOn(proto, own)`, которая создаёт объект с прототипом `proto`, копирует в ' +
      'него поля `own` и возвращает результат вызова метода. Проверки покажут, что ' +
      '`this` указывает на объект вызова, а не на место хранения метода.',
    starter: `function callOn(proto, own) {
  // Метод найден в прототипе, но this — объект вызова.
}`,
    hints: [
      'Объект с нужным прототипом создаётся через Object.create.',
      'Собственные поля копируются после создания.',
      'Метод вызывается через созданный объект.'
    ],
    tests: [
      {
        name: 'this указывает на объект вызова',
        code: `const proto = { whoAmI() { return this.name; } };
expect(callOn(proto, { name: 'свой' })).toBe('свой');`
      },
      {
        name: 'имя из прототипа используется, если своего нет',
        code: `const proto = { name: 'из прототипа', whoAmI() { return this.name; } };
expect(callOn(proto, {})).toBe('из прототипа');`
      },
      {
        name: 'собственное имя перекрывает прототип',
        code: `const proto = { name: 'из прототипа', whoAmI() { return this.name; } };
expect(callOn(proto, { name: 'своё' })).toBe('своё');`
      },
      {
        name: 'прототип не изменяется',
        code: `const proto = { name: 'из прототипа', whoAmI() { return this.name; } };
callOn(proto, { name: 'своё' });
expect(proto.name).toBe('из прототипа');`
      }
    ],
    solution: `function callOn(proto, own) {
  const item = Object.create(proto);
  Object.assign(item, own);

  return item.whoAmI();
}`
  }
]
