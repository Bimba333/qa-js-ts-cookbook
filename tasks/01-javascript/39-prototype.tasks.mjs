export default [
  {
    id: 'js-39-shared-behavior',
    title: 'Общее поведение через прототип',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `createReporter(prefix)`, которая создаёт объект с ' +
      'собственным полем `prefix` и методом `line(text)`, взятым из **общего** ' +
      'прототипа. Метод возвращает `<prefix>: <text>`. Два объекта должны делить ' +
      'один и тот же метод.',
    starter: `const reporterProto = {
  // Метод здесь будет общим для всех созданных объектов.
};

function createReporter(prefix) {
  // Создайте объект с указанным прототипом.
}`,
    hints: [
      'Создать объект с заданным прототипом позволяет Object.create.',
      'Собственные поля присваиваются после создания.',
      'Метод должен читать prefix через this.'
    ],
    tests: [
      {
        name: 'метод работает',
        code: `expect(createReporter('api').line('старт')).toBe('api: старт');`
      },
      {
        name: 'метод не является собственным свойством',
        code: `expect(Object.hasOwn(createReporter('api'), 'line')).toBe(false);`
      },
      {
        name: 'объекты делят один метод',
        code: `expect(createReporter('a').line === createReporter('b').line).toBe(true);`
      },
      {
        name: 'состояние у объектов своё',
        code: `const first = createReporter('a');
const second = createReporter('b');
expect(first.line('x') + ' | ' + second.line('x')).toBe('a: x | b: x');`
      }
    ],
    solution: `const reporterProto = {
  line(text) {
    return this.prefix + ': ' + text;
  }
};

function createReporter(prefix) {
  const reporter = Object.create(reporterProto);
  reporter.prefix = prefix;

  return reporter;
}`
  },

  {
    id: 'js-39-own-wins-over-proto',
    title: 'Собственное свойство перекрывает прототип',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `describeLookup(parent, child, key)`, которая возвращает ' +
      'объект `{ value, source }`: значение по ключу и строку `own`, если свойство ' +
      'собственное, `proto` — если найдено в прототипе, `none` — если не найдено ' +
      'нигде. Объект `child` создаётся с прототипом `parent`.',
    starter: `function describeLookup(parent, child, key) {
  // Поиск начинается с самого объекта.
}`,
    hints: [
      'Сначала нужно связать объекты: child получает parent как прототип.',
      'Собственное свойство проверяется отдельно от унаследованного.',
      'Отсутствие свойства в цепочке даёт значение undefined.'
    ],
    tests: [
      {
        name: 'собственное свойство выигрывает',
        code: `expect(describeLookup({ a: 'из прототипа' }, { a: 'своё' }, 'a'))
  .toEqual({ value: 'своё', source: 'own' });`
      },
      {
        name: 'находит свойство в прототипе',
        code: `expect(describeLookup({ a: 'из прототипа' }, {}, 'a'))
  .toEqual({ value: 'из прототипа', source: 'proto' });`
      },
      {
        name: 'свойства нет нигде',
        code: `expect(describeLookup({}, {}, 'a')).toEqual({ value: undefined, source: 'none' });`
      },
      {
        name: 'исходные объекты не изменяются',
        code: `const parent = { a: 1 };
const child = { b: 2 };
describeLookup(parent, child, 'a');
expect(Object.hasOwn(child, 'a')).toBe(false);`
      }
    ],
    solution: `function describeLookup(parent, child, key) {
  const linked = Object.create(parent);
  Object.assign(linked, child);

  if (Object.hasOwn(linked, key)) {
    return { value: linked[key], source: 'own' };
  }

  if (key in linked) {
    return { value: linked[key], source: 'proto' };
  }

  return { value: undefined, source: 'none' };
}`
  }
]
