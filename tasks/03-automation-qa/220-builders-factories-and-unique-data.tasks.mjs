export default [
  {
    id: 'qa-220-work-item-builder',
    title: 'Строитель тестовых данных',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `createWorkItemBuilder()` — строитель с методами `withTitle`, ' +
      '`withPriority` и `build`. Методы настройки возвращают строитель, чтобы ' +
      'вызовы соединялись в цепочку. `build` отдаёт объект ' +
      '`{ title, description, priority }` со значениями по умолчанию ' +
      '`description: "Создано строителем"` и `priority: "MEDIUM"`. ' +
      'Заголовок по умолчанию — `Задача <n>`, где `n` — номер вызова `build` ' +
      'у этого строителя, начиная с 1. Каждый `build` возвращает **новый** объект.',
    starter: `function createWorkItemBuilder() {
  // Значения по умолчанию, настройка цепочкой, новый объект на каждый build.
  return {
    withTitle(title) { return this; },
    withPriority(priority) { return this; },
    build() { return {}; }
  };
}`,
    hints: [
      'Настройки хранятся в замыкании, а не в возвращаемом объекте.',
      'Чтобы цепочка работала, метод настройки возвращает сам строитель.',
      'Счётчик увеличивается только при сборке.'
    ],
    tests: [
      {
        name: 'значения по умолчанию заполнены',
        code: `expect(createWorkItemBuilder().build())
  .toEqual({ title: 'Задача 1', description: 'Создано строителем', priority: 'MEDIUM' });`
      },
      {
        name: 'настройка работает цепочкой',
        code: `const item = createWorkItemBuilder()
  .withTitle('Вход')
  .withPriority('HIGH')
  .build();
expect(item.title).toBe('Вход');
expect(item.priority).toBe('HIGH');`
      },
      {
        name: 'номер увеличивается с каждой сборкой',
        code: `const builder = createWorkItemBuilder();
expect(builder.build().title).toBe('Задача 1');
expect(builder.build().title).toBe('Задача 2');`
      },
      {
        name: 'разные строители считают независимо',
        code: `const first = createWorkItemBuilder();
first.build();
expect(createWorkItemBuilder().build().title).toBe('Задача 1');`
      },
      {
        name: 'каждая сборка даёт новый объект',
        code: `const builder = createWorkItemBuilder().withTitle('Вход');
const a = builder.build();
const b = builder.build();
expect(a === b).toBe(false);
a.priority = 'LOW';
expect(b.priority).toBe('MEDIUM');`
      },
      {
        name: 'заданный заголовок не перезаписывается счётчиком',
        code: `const builder = createWorkItemBuilder().withTitle('Вход');
builder.build();
expect(builder.build().title).toBe('Вход');`
      }
    ],
    solution: `function createWorkItemBuilder() {
  let title = null;
  let priority = 'MEDIUM';
  let built = 0;

  const builder = {
    withTitle(value) {
      title = value;
      return builder;
    },
    withPriority(value) {
      priority = value;
      return builder;
    },
    build() {
      built += 1;

      return {
        title: title ?? 'Задача ' + built,
        description: 'Создано строителем',
        priority
      };
    }
  };

  return builder;
}`
  }
]
