export default [
  {
    id: 'js-47-insert-step',
    title: 'Вставка шага в середину плана',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `insertAt(plan, index, step)`, которая вставляет шаг на ' +
      'указанную позицию, ничего не удаляя, и возвращает объект ' +
      '`{ removed, length }`: массив удалённых элементов и новую длину плана. ' +
      'Исходный массив изменяется — это ожидаемое поведение.',
    starter: `function insertAt(plan, index, step) {
  // Второй аргумент splice отвечает за количество удаляемых элементов.
}`,
    hints: [
      'Чтобы ничего не удалить, вторым аргументом передают ноль.',
      'splice возвращает массив удалённых элементов, а не изменённый массив.',
      'Новая длина доступна после операции.'
    ],
    tests: [
      {
        name: 'вставляет на нужную позицию',
        code: `const plan = ['login', 'pay'];
insertAt(plan, 1, 'discount');
expect(plan).toEqual(['login', 'discount', 'pay']);`
      },
      {
        name: 'ничего не удаляет',
        code: `expect(insertAt(['login', 'pay'], 1, 'discount').removed).toEqual([]);`
      },
      {
        name: 'возвращает новую длину',
        code: `expect(insertAt(['login', 'pay'], 1, 'discount').length).toBe(3);`
      },
      {
        name: 'вставка в конец работает',
        code: `const plan = ['login'];
insertAt(plan, 1, 'logout');
expect(plan).toEqual(['login', 'logout']);`
      }
    ],
    solution: `function insertAt(plan, index, step) {
  const removed = plan.splice(index, 0, step);

  return { removed, length: plan.length };
}`
  },

  {
    id: 'js-47-index-shift-after-splice',
    title: 'Индексы после изменения середины',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `replaceStep(plan, target, replacement)`, которая заменяет ' +
      'первое вхождение `target` на `replacement` и возвращает объект ' +
      '`{ replaced, index }`: признак того, что замена произошла, и позицию, где она ' +
      'случилась. Если шага нет, вернуть `{ replaced: false, index: -1 }`.',
    starter: `function replaceStep(plan, target, replacement) {
  // Позицию нужно найти до изменения массива.
}`,
    hints: [
      'Позицию элемента ищут до вызова splice.',
      'Отсутствие элемента даёт -1 — этот случай обрабатывается отдельно.',
      'Замена — это удаление одного элемента и вставка другого.'
    ],
    tests: [
      {
        name: 'заменяет элемент',
        code: `const plan = ['login', 'pay', 'logout'];
replaceStep(plan, 'pay', 'refund');
expect(plan).toEqual(['login', 'refund', 'logout']);`
      },
      {
        name: 'сообщает позицию замены',
        code: `expect(replaceStep(['login', 'pay'], 'pay', 'refund'))
  .toEqual({ replaced: true, index: 1 });`
      },
      {
        name: 'если шага нет, массив не меняется',
        code: `const plan = ['login'];
const report = replaceStep(plan, 'pay', 'refund');
expect([plan, report]).toEqual([['login'], { replaced: false, index: -1 }]);`
      },
      {
        name: 'заменяет только первое вхождение',
        code: `const plan = ['pay', 'pay'];
replaceStep(plan, 'pay', 'refund');
expect(plan).toEqual(['refund', 'pay']);`
      }
    ],
    solution: `function replaceStep(plan, target, replacement) {
  const index = plan.indexOf(target);

  if (index === -1) {
    return { replaced: false, index: -1 };
  }

  plan.splice(index, 1, replacement);

  return { replaced: true, index };
}`
  }
]
