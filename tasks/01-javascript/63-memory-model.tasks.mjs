export default [
  {
    id: 'js-63-freeze-name-and-content',
    title: '`const` защищает имя, а не содержимое',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `protectConfig(source)`, которая возвращает объект ' +
      '`{ config, tryReplace, tryMutate }`. `config` — неизменяемая копия ' +
      '`source`: попытка изменить её свойство не должна проходить. ' +
      '`tryReplace(next)` пытается заменить само значение `config` и всегда ' +
      'возвращает `false` — имя переприсвоить нельзя. `tryMutate(key, value)` ' +
      'пытается изменить свойство и возвращает, изменилось ли оно на самом деле.',
    starter: `function protectConfig(source) {
  // Копию нужно заморозить, а не просто вернуть исходный объект.

  return {
    config: source,
    tryReplace(next) { return true; },
    tryMutate(key, value) { return true; }
  };
}`,
    hints: [
      'Заморозка объекта выполняется `Object.freeze`, и она запрещает менять свойства первого уровня.',
      'Вне строгого режима присваивание в замороженное свойство молча ничего не делает — результат нужно проверить чтением.',
      'Замораживать стоит копию: заморозив аргумент, вы изменили бы объект вызывающего кода.'
    ],
    tests: [
      {
        name: 'исходный объект не заморожен',
        code: `const origin = { retries: 1 };
protectConfig(origin);
origin.retries = 5;
expect(origin.retries).toBe(5);`
      },
      {
        name: 'копия заморожена',
        code: `const guarded = protectConfig({ retries: 1 });
expect(Object.isFrozen(guarded.config)).toBe(true);`
      },
      {
        name: 'изменение свойства не проходит',
        code: `const locked = protectConfig({ retries: 1 });
expect(locked.tryMutate('retries', 9)).toBe(false);
expect(locked.config.retries).toBe(1);`
      },
      {
        name: 'замена самого имени невозможна',
        code: `const fixed = protectConfig({ retries: 1 });
expect(fixed.tryReplace({ retries: 2 })).toBe(false);
expect(fixed.config.retries).toBe(1);`
      },
      {
        name: 'значения копии совпадают с исходными',
        code: `const copied = protectConfig({ env: 'local', retries: 3 });
expect(copied.config).toEqual({ env: 'local', retries: 3 });`
      }
    ],
    solution: `function protectConfig(source) {
  const config = Object.freeze({ ...source });

  return {
    config,
    tryReplace() {
      return false;
    },
    tryMutate(key, value) {
      try {
        config[key] = value;
      } catch {
        return false;
      }

      return config[key] === value;
    }
  };
}`
  }
]
