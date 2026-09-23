export default [
  {
    id: 'ts-142-freeze-snapshot',
    title: 'Снимок только для чтения',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите отображённый тип `Snapshot<T> = { readonly [K in keyof T]: T[K] }` и ' +
      'функцию `snapshot<T extends object>(source: T): Snapshot<T>`, которая ' +
      'возвращает замороженную копию объекта. Изменение копии не должно влиять ' +
      'на исходный объект и не должно проходить: копия заморожена.',
    starter: `type Snapshot<T> = {
  readonly [K in keyof T]: T[K];
};

function snapshot<T extends object>(source: T): Snapshot<T> {
  return source;
}`,
    hints: [
      'readonly в типе проверяется только компилятором — во время выполнения нужна заморозка.',
      'Возвращать надо копию, а не сам объект.',
      'Object.freeze возвращает тот же объект, который ему передали.'
    ],
    tests: [
      {
        name: 'копия равна исходному объекту',
        code: `expect(snapshot({ id: 'a', version: 1 })).toEqual({ id: 'a', version: 1 });`
      },
      {
        name: 'возвращается не тот же объект',
        code: `const source = { id: 'a' };
expect(snapshot(source) === source).toBe(false);`
      },
      {
        name: 'копия заморожена',
        code: `expect(Object.isFrozen(snapshot({ id: 'a' }))).toBe(true);`
      },
      {
        name: 'изменение копии не проходит',
        code: `const copy = snapshot({ version: 1 });
try { copy.version = 2; } catch (error) { /* строгий режим бросает */ }
expect(copy.version).toBe(1);`
      },
      {
        name: 'исходный объект остаётся изменяемым',
        code: `const source = { version: 1 };
snapshot(source);
source.version = 2;
expect(source.version).toBe(2);`
      }
    ],
    solution: `type Snapshot<T> = {
  readonly [K in keyof T]: T[K];
};

function snapshot<T extends object>(source: T): Snapshot<T> {
  return Object.freeze({ ...source });
}`
  },

  {
    id: 'ts-142-optional-map',
    title: 'Все поля становятся необязательными',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите `Draft<T> = { [K in keyof T]?: T[K] }` и напишите ' +
      '`toDraft<T extends object>(source: T, keep: (keyof T)[]): Draft<T>` — ' +
      'функцию, оставляющую только перечисленные поля. Поля со значением ' +
      '`undefined` в результат не попадают, даже если перечислены.',
    starter: `type Draft<T> = {
  [K in keyof T]?: T[K];
};

function toDraft<T extends object>(source: T, keep: (keyof T)[]): Draft<T> {
  return {};
}`,
    hints: [
      'Модификатор ? в отображённом типе делает необязательным каждое поле.',
      'Отсутствие ключа и значение undefined различаются через Object.keys.',
      'Повторяющиеся ключи не должны создавать дублей.'
    ],
    tests: [
      {
        name: 'оставляет перечисленные поля',
        code: `expect(toDraft({ id: 'a', version: 1, note: 'x' }, ['id', 'version']))
  .toEqual({ id: 'a', version: 1 });`
      },
      {
        name: 'поле со значением undefined не попадает',
        code: `const source = { id: 'a', note: undefined };
expect(Object.keys(toDraft(source, ['id', 'note']))).toEqual(['id']);`
      },
      {
        name: 'значение null сохраняется',
        code: `expect(toDraft({ note: null }, ['note'])).toEqual({ note: null });`
      },
      {
        name: 'пустой список полей даёт пустой черновик',
        code: `expect(toDraft({ id: 'a' }, [])).toEqual({});`
      },
      {
        name: 'повтор ключа не создаёт дублей',
        code: `expect(Object.keys(toDraft({ id: 'a' }, ['id', 'id']))).toHaveLength(1);`
      }
    ],
    solution: `type Draft<T> = {
  [K in keyof T]?: T[K];
};

function toDraft<T extends object>(source: T, keep: (keyof T)[]): Draft<T> {
  const draft: Draft<T> = {};

  for (const key of keep) {
    const value = source[key];

    if (value !== undefined) {
      draft[key] = value;
    }
  }

  return draft;
}`
  }
]
