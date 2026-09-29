export default [
  {
    id: 'fp-253-scoped-component',
    title: 'Компонент ищет только внутри своего корня',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Область поиска — это и есть граница компонента. Дерево задано объектами ' +
      '`{ role, name, children }`. Напишите `createComponent(root)`, который ' +
      'возвращает объект с методом `find(role, name)`: он ищет узел с такими ' +
      'ролью и именем **внутри поддерева root** (сам корень тоже считается) и ' +
      'возвращает найденный узел или `null`. Узел с теми же ролью и именем за ' +
      'пределами корня найден быть не должен.',
    starter: `function createComponent(root) {
  return {
    find(role, name) {
      // Поиск должен ограничиваться поддеревом root.

      return null;
    }
  };
}`,
    hints: [
      'Обход в глубину: проверить сам узел, затем его детей.',
      'Дети могут отсутствовать — тогда считайте их пустым массивом.',
      'Первое совпадение и есть результат.'
    ],
    tests: [
      {
        name: 'элемент внутри корня находится',
        code: `const insideTree = {
  role: 'row',
  name: 'order-42',
  children: [{ role: 'button', name: 'Открыть', children: [] }]
};
const insideComponent = createComponent(insideTree);
expect(insideComponent.find('button', 'Открыть').name).toBe('Открыть');`
      },
      {
        name: 'такой же элемент вне корня не находится',
        code: `const page = {
  role: 'table',
  name: 'Задачи',
  children: [
    { role: 'row', name: 'order-42', children: [] },
    { role: 'row', name: 'order-43', children: [
      { role: 'button', name: 'Открыть', children: [] }
    ] }
  ]
};
const firstRow = createComponent(page.children[0]);
expect(firstRow.find('button', 'Открыть')).toBeNull();`
      },
      {
        name: 'сам корень тоже участвует в поиске',
        code: `const rootOnly = { role: 'form', name: 'Фильтр задач', children: [] };
const rootComponent = createComponent(rootOnly);
expect(rootComponent.find('form', 'Фильтр задач').role).toBe('form');`
      },
      {
        name: 'поиск идёт на любую глубину',
        code: `const deepTree = {
  role: 'dialog',
  name: 'Подтверждение',
  children: [{ role: 'section', name: 'тело', children: [
    { role: 'button', name: 'Удалить', children: [] }
  ] }]
};
const deepComponent = createComponent(deepTree);
expect(deepComponent.find('button', 'Удалить').name).toBe('Удалить');`
      }
    ],
    solution: `function createComponent(root) {
  function search(node, role, name) {
    if (node.role === role && node.name === name) return node;

    for (const child of node.children ?? []) {
      const found = search(child, role, name);

      if (found) return found;
    }

    return null;
  }

  // Корень захвачен замыканием: снаружи область поиска изменить нельзя.
  return {
    find(role, name) {
      return search(root, role, name);
    }
  };
}`
  },
  {
    id: 'fp-253-fixture-releases-on-failure',
    title: 'Фикстура освобождает ресурс и после падения',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `withPage(open, body)`. Функция `open()` создаёт объект ' +
      'страницы и возвращает `{ page, close }`. Вызовите `open()`, передайте ' +
      '`page` в `body`, а затем **всегда** вызовите `close()` — и при успехе, и ' +
      'при исключении. Верните то, что вернул `body`. Исключение из `body` ' +
      'пропустите наружу без изменений; ошибка из `close()` не должна его ' +
      'подменять.',
    starter: `async function withPage(open, body) {
  const { page, close } = await open();

  const value = await body(page);

  await close();

  return value;
}`,
    hints: [
      'Освобождение принадлежит блоку finally.',
      'Ошибку close() нужно перехватить отдельно, чтобы не потерять исходную.',
      'Возврат значения body должен происходить после освобождения.'
    ],
    tests: [
      {
        name: 'значение тела возвращается, ресурс освобождён',
        code: `let closedOnSuccess = 0;
const openOk = async () => ({ page: { id: 1 }, close: async () => { closedOnSuccess += 1; } });
expect(await withPage(openOk, async page => page.id)).toBe(1);
expect(closedOnSuccess).toBe(1);`
      },
      {
        name: 'после падения тела ресурс тоже освобождён',
        code: `let closedOnFailure = 0;
const openFail = async () => ({ page: {}, close: async () => { closedOnFailure += 1; } });
let caught = null;
try {
  await withPage(openFail, async () => { throw new Error('проверка не прошла'); });
} catch (error) {
  caught = error;
}
expect(caught.message).toBe('проверка не прошла');
expect(closedOnFailure).toBe(1);`
      },
      {
        name: 'ошибка освобождения не подменяет ошибку теста',
        code: `const openBroken = async () => ({
  page: {},
  close: async () => { throw new Error('не удалось закрыть страницу'); }
});
let replaced = null;
try {
  await withPage(openBroken, async () => { throw new Error('статус не изменился'); });
} catch (error) {
  replaced = error;
}
expect(replaced.message).toBe('статус не изменился');`
      },
      {
        name: 'при успешном теле ошибка освобождения не теряется молча',
        code: `const openNoisy = async () => ({
  page: {},
  close: async () => { throw new Error('канал не закрыт'); }
});
let quiet = null;
try {
  await withPage(openNoisy, async () => 'готово');
} catch (error) {
  quiet = error;
}
expect(quiet.message).toBe('канал не закрыт');`
      }
    ],
    solution: `async function withPage(open, body) {
  const { page, close } = await open();

  let failure = null;
  let value;

  try {
    value = await body(page);
  } catch (error) {
    failure = error;
  }

  try {
    await close();
  } catch (closeError) {
    // Ошибка освобождения важна, но не важнее причины падения теста.
    if (!failure) failure = closeError;
  }

  if (failure) throw failure;

  return value;
}`
  }
];
