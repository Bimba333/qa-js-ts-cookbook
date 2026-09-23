export default [
  {
    id: 'ts-145-pick-fields',
    title: 'Проекция объекта по списку полей',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите дженерик-функцию `pickFields<T, K extends keyof T>(item: T, keys: K[]): Pick<T, K>`, ' +
      'которая возвращает новый объект только с указанными полями. Отсутствующие в ' +
      'объекте ключи в результат попадать не должны.',
    starter: `function pickFields<T extends object, K extends keyof T>(item: T, keys: K[]): Pick<T, K> {
  // Собирайте новый объект, а не изменяйте исходный.
  return {} as Pick<T, K>;
}`,
    hints: [
      'Ограничение K extends keyof T допускает только существующие ключи.',
      'Перед копированием стоит убедиться, что свойство есть у объекта.',
      'Исходный объект изменяться не должен.'
    ],
    tests: [
      {
        name: 'оставляет указанные поля',
        code: `expect(pickFields({ id: 1, name: 'a', extra: true }, ['id', 'name']))
  .toEqual({ id: 1, name: 'a' });`
      },
      {
        name: 'пустой список ключей даёт пустой объект',
        code: `expect(pickFields({ id: 1 }, [])).toEqual({});`
      },
      {
        name: 'не изменяет исходный объект',
        code: `const source = { id: 1, name: 'a' };
pickFields(source, ['id']);
expect(source).toEqual({ id: 1, name: 'a' });`
      },
      {
        name: 'отсутствующее свойство не добавляется',
        code: `const partial = { id: 1 } as { id: number; name?: string };
expect(Object.keys(pickFields(partial, ['id', 'name']))).toEqual(['id']);`
      }
    ],
    solution: `function pickFields<T extends object, K extends keyof T>(item: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (Object.hasOwn(item, key as string)) {
      result[key] = item[key];
    }
  }

  return result;
}`
  },

  {
    id: 'ts-145-required-fields-check',
    title: 'Проверка заполненности обязательных полей',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `DraftItem` с необязательными полями `title?: string` и ' +
      '`priority?: string`. Напишите функцию ' +
      '`toComplete(draft: DraftItem): Required<DraftItem> | null`, которая возвращает ' +
      'объект со всеми заполненными полями или `null`, если хотя бы одно отсутствует. ' +
      'Пустая строка считается незаполненным значением.',
    starter: `type DraftItem = {
  title?: string;
  priority?: string;
};

function toComplete(draft: DraftItem): Required<DraftItem> | null {
  // Required убирает необязательность, но проверить значения нужно самому.
  return null;
}`,
    hints: [
      'Тип Required описывает результат, но не проверяет данные.',
      'Проверять нужно и отсутствие поля, и пустую строку.',
      'Возвращать следует новый объект.'
    ],
    tests: [
      {
        name: 'полный черновик проходит',
        code: `expect(toComplete({ title: 'login', priority: 'HIGH' }))
  .toEqual({ title: 'login', priority: 'HIGH' });`
      },
      {
        name: 'отсутствующее поле даёт null',
        code: `expect(toComplete({ title: 'login' })).toBe(null);`
      },
      {
        name: 'пустая строка считается незаполненной',
        code: `expect(toComplete({ title: '', priority: 'HIGH' })).toBe(null);`
      },
      {
        name: 'пустой черновик даёт null',
        code: `expect(toComplete({})).toBe(null);`
      }
    ],
    solution: `type DraftItem = {
  title?: string;
  priority?: string;
};

function toComplete(draft: DraftItem): Required<DraftItem> | null {
  const { title, priority } = draft;

  if (!title || !priority) {
    return null;
  }

  return { title, priority };
}`
  }
]
