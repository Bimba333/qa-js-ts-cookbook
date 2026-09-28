export default [
  {
    id: 'js-14-copy-and-share',
    title: 'Что копируется, а что разделяется',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `shallowCopy(source)`, которая возвращает новый объект ' +
      'с теми же свойствами первого уровня. Изменение свойства копии не должно ' +
      'задевать исходный объект, но вложенный объект остаётся **общим** — это и ' +
      'есть поверхностная копия. Дополнительно напишите `isSameReference(a, b)`, ' +
      'отвечающую, указывают ли два имени на один и тот же объект.',
    starter: `function shallowCopy(source) {
  // Копируются только свойства первого уровня.
}

function isSameReference(a, b) {
  // Сравнение идентичности, а не содержимого.
}`,
    hints: [
      'Свойства первого уровня переносит раскрытие объекта или `Object.assign` с пустым объектом-приёмником.',
      'Вложенный объект хранится в куче: в копию попадает та же ссылка, а не новая копия объекта.',
      'Идентичность проверяется строгим сравнением: для объектов оно истинно только при одной и той же ссылке.'
    ],
    tests: [
      {
        name: 'копия независима на первом уровне',
        code: `const origin = { env: 'local', retries: 1 };
const clone = shallowCopy(origin);
clone.retries = 5;
expect(origin.retries).toBe(1);
expect(clone.env).toBe('local');`
      },
      {
        name: 'копия — другой объект',
        code: `const source = { a: 1 };
expect(isSameReference(source, shallowCopy(source))).toBe(false);`
      },
      {
        name: 'вложенный объект остаётся общим',
        code: `const nested = { auth: { token: 'старый' } };
const copied = shallowCopy(nested);
copied.auth.token = 'новый';
expect(nested.auth.token).toBe('новый');
expect(isSameReference(nested.auth, copied.auth)).toBe(true);`
      },
      {
        name: 'два одинаковых по содержимому объекта не идентичны',
        code: `expect(isSameReference({ a: 1 }, { a: 1 })).toBe(false);`
      },
      {
        name: 'одно имя, переданное дважды, идентично самому себе',
        code: `const single = { a: 1 };
expect(isSameReference(single, single)).toBe(true);`
      },
      {
        name: 'примитивы сравниваются по значению',
        code: `expect(isSameReference('local', 'local')).toBe(true);
expect(isSameReference(1, 2)).toBe(false);`
      }
    ],
    solution: `function shallowCopy(source) {
  return { ...source };
}

function isSameReference(a, b) {
  return a === b;
}`
  }
]
