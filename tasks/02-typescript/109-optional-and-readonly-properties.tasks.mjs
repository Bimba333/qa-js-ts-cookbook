export default [
  {
    id: 'ts-109-absent-is-not-undefined',
    title: 'Отсутствие свойства и значение undefined',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `describeField(item: Record<string, unknown>, key: string)`, ' +
      'возвращающую одно из значений: `"отсутствует"` — ключа нет совсем; ' +
      '`"пусто"` — ключ есть, но значение `undefined`; `"есть значение"` — ' +
      'во всех остальных случаях, включая `null`, `0` и пустую строку. ' +
      'Затем напишите `freezeConfig<T extends object>(config: T): Readonly<T>`, ' +
      'которая возвращает замороженную копию: `readonly` проверяется только ' +
      'компилятором, а во время выполнения нужна настоящая заморозка.',
    starter: `function describeField(item: Record<string, unknown>, key: string): string {
  return '';
}

function freezeConfig<T extends object>(config: T): Readonly<T> {
  return config;
}`,
    hints: [
      'Наличие ключа проверяется отдельно от его значения.',
      'Object.hasOwn отвечает именно на вопрос о наличии.',
      'Заморозка должна касаться копии, а не исходного объекта.'
    ],
    tests: [
      {
        name: 'ключа нет',
        code: `expect(describeField({}, 'title')).toBe('отсутствует');`
      },
      {
        name: 'ключ есть, значение undefined',
        code: `expect(describeField({ title: undefined }, 'title')).toBe('пусто');`
      },
      {
        name: 'null, ноль и пустая строка — это значения',
        code: `expect(describeField({ title: null }, 'title')).toBe('есть значение');
expect(describeField({ retries: 0 }, 'retries')).toBe('есть значение');
expect(describeField({ title: '' }, 'title')).toBe('есть значение');`
      },
      {
        name: 'копия конфигурации заморожена',
        code: `const frozen = freezeConfig({ retries: 1 });
expect(Object.isFrozen(frozen)).toBe(true);
try { (frozen as { retries: number }).retries = 2; } catch { /* строгий режим */ }
expect(frozen.retries).toBe(1);`
      },
      {
        name: 'исходный объект остаётся изменяемым',
        code: `const source = { retries: 1 };
freezeConfig(source);
source.retries = 5;
expect(source.retries).toBe(5);`
      },
      {
        name: 'копия равна исходному объекту',
        code: `expect(freezeConfig({ a: 1, b: 'x' })).toEqual({ a: 1, b: 'x' });`
      }
    ],
    solution: `function describeField(item: Record<string, unknown>, key: string): string {
  if (!Object.hasOwn(item, key)) {
    return 'отсутствует';
  }

  return item[key] === undefined ? 'пусто' : 'есть значение';
}

function freezeConfig<T extends object>(config: T): Readonly<T> {
  return Object.freeze({ ...config });
}`
  }
]
