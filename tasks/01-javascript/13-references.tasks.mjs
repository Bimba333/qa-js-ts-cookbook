export default [
  {
    id: 'js-13-copy-or-reference',
    title: 'Копия значения и копия ссылки',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `share(source)` — возвращает объект `{ same, copy }`, где ' +
      '`same` — тот же объект (копируется ссылка), а `copy` — поверхностная ' +
      'копия. Напишите `mutate(target)` — добавляет полю `visits` единицу ' +
      '(если поля нет, оно становится `1`) и возвращает `target`. ' +
      'И `compare(a, b)` — объект `{ byReference, byContent }`: сравнение по ' +
      'ссылке и сравнение содержимого первого уровня.',
    starter: `function share(source) {
  return { same: source, copy: source };
}

function mutate(target) {
  return target;
}

function compare(a, b) {
  return { byReference: false, byContent: false };
}`,
    hints: [
      'Присваивание объекта копирует ссылку, а не содержимое.',
      'Поверхностная копия делает новый объект, но вложенные остаются общими.',
      'Сравнение объектов оператором равенства сравнивает ссылки.'
    ],
    tests: [
      {
        name: 'ссылка ведёт на тот же объект',
        code: `const source = { visits: 1 };
const { same, copy } = share(source);
expect(same === source).toBe(true);
expect(copy === source).toBe(false);`
      },
      {
        name: 'изменение видно через ссылку',
        code: `const source = { visits: 1 };
const { same } = share(source);
mutate(same);
expect(source.visits).toBe(2);`
      },
      {
        name: 'изменение копии исходный объект не трогает',
        code: `const source = { visits: 1 };
const { copy } = share(source);
mutate(copy);
expect(source.visits).toBe(1);
expect(copy.visits).toBe(2);`
      },
      {
        name: 'отсутствующее поле становится единицей',
        code: `expect(mutate({}).visits).toBe(1);`
      },
      {
        name: 'сравнение различает ссылку и содержимое',
        code: `const first = { id: 'a' };
const second = { id: 'a' };
expect(compare(first, second)).toEqual({ byReference: false, byContent: true });
expect(compare(first, first)).toEqual({ byReference: true, byContent: true });`
      },
      {
        name: 'разное содержимое',
        code: `expect(compare({ id: 'a' }, { id: 'b' }).byContent).toBe(false);
expect(compare({ id: 'a' }, { id: 'a', extra: 1 }).byContent).toBe(false);`
      },
      {
        name: 'вложенный объект в копии остаётся общим',
        code: `const nested = { count: 0 };
const source = { nested };
const { copy } = share(source);
copy.nested.count = 5;
expect(nested.count).toBe(5);`
      }
    ],
    solution: `function share(source) {
  return { same: source, copy: { ...source } };
}

function mutate(target) {
  target.visits = (target.visits ?? 0) + 1;

  return target;
}

function compare(a, b) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  const byContent = keysA.length === keysB.length
    && keysA.every(key => a[key] === b[key]);

  return { byReference: a === b, byContent };
}`
  }
]
