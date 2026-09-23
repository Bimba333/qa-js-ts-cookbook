export default [
  {
    id: 'js-48-take-page',
    title: 'Страница результатов',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `page(items, pageNumber, size)`, которая возвращает страницу ' +
      'элементов. Нумерация страниц начинается с единицы. Исходный массив изменяться ' +
      'не должен, а выход за границы даёт пустой массив.',
    starter: `function page(items, pageNumber, size) {
  // Конец диапазона в slice не включается.
}`,
    hints: [
      'Начало страницы вычисляется из номера и размера.',
      'Конец диапазона в slice не включается.',
      'Выход за границы массива сам даёт пустой результат.'
    ],
    tests: [
      {
        name: 'первая страница',
        code: `expect(page(['a', 'b', 'c', 'd'], 1, 2)).toEqual(['a', 'b']);`
      },
      {
        name: 'вторая страница',
        code: `expect(page(['a', 'b', 'c', 'd'], 2, 2)).toEqual(['c', 'd']);`
      },
      {
        name: 'страница за границами пуста',
        code: `expect(page(['a', 'b'], 5, 2)).toEqual([]);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = ['a', 'b', 'c'];
page(source, 1, 2);
expect(source).toEqual(['a', 'b', 'c']);`
      },
      {
        name: 'неполная последняя страница',
        code: `expect(page(['a', 'b', 'c'], 2, 2)).toEqual(['c']);`
      }
    ],
    solution: `function page(items, pageNumber, size) {
  const start = (pageNumber - 1) * size;

  return items.slice(start, start + size);
}`
  },

  {
    id: 'js-48-snapshot-is-shallow',
    title: 'Снимок списка и его граница',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `snapshot(items)`, которая возвращает копию массива, ' +
      'защищённую от изменения **состава** исходного списка. Проверки покажут, что ' +
      'такая копия поверхностная: изменение объекта внутри видно в обоих массивах.',
    starter: `function snapshot(items) {
  // Копия массива не делает копий его элементов.
}`,
    hints: [
      'Полную копию массива даёт вызов slice без аргументов.',
      'Добавление элемента в исходный массив копию не затронет.',
      'Изменение объекта-элемента будет видно в обоих массивах — это ожидаемо.'
    ],
    tests: [
      {
        name: 'копия содержит те же элементы',
        code: `expect(snapshot(['a', 'b'])).toEqual(['a', 'b']);`
      },
      {
        name: 'добавление в исходный не влияет на копию',
        code: `const source = ['a'];
const copy = snapshot(source);
source.push('b');
expect(copy).toEqual(['a']);`
      },
      {
        name: 'возвращается новый массив',
        code: `const source = ['a'];
expect(snapshot(source) === source).toBe(false);`
      },
      {
        name: 'копия поверхностная: объект внутри общий',
        code: `const item = { n: 1 };
const copy = snapshot([item]);
copy[0].n = 99;
expect(item.n).toBe(99);`
      }
    ],
    solution: `function snapshot(items) {
  return items.slice();
}`
  }
]
