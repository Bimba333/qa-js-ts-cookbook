export default [
  {
    id: 'qa-237-split-into-shards',
    title: 'Разбиение набора на сегменты',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `selectShard(items, shardIndex, shardTotal)` — выбор сегмента ' +
      'по номеру. Нумерация с единицы, как в `--shard=X/Y`. Каждый элемент ' +
      'должен попасть ровно в один сегмент, размеры сегментов различаются не ' +
      'больше чем на единицу, порядок элементов внутри сегмента сохраняется. ' +
      'Неверный номер сегмента — ошибка `номер сегмента вне диапазона`.',
    starter: `function selectShard(items, shardIndex, shardTotal) {
  // Нумерация начинается с единицы.

  return [];
}`,
    hints: [
      'Границы сегмента считаются от длины набора, а не подбираются вручную.',
      'Остаток от деления распределяется по первым сегментам.',
      'Объединение всех сегментов должно дать исходный набор.'
    ],
    tests: [
      {
        name: 'делится нацело',
        code: `const items = [1, 2, 3, 4, 5, 6];
expect(selectShard(items, 1, 3)).toEqual([1, 2]);
expect(selectShard(items, 3, 3)).toEqual([5, 6]);`
      },
      {
        name: 'остаток уходит в первые сегменты',
        code: `const uneven = [1, 2, 3, 4, 5];
expect(selectShard(uneven, 1, 3)).toEqual([1, 2]);
expect(selectShard(uneven, 2, 3)).toEqual([3, 4]);
expect(selectShard(uneven, 3, 3)).toEqual([5]);`
      },
      {
        name: 'объединение сегментов равно исходному набору',
        code: `const source = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const joined = [];
for (let index = 1; index <= 4; index += 1) {
  joined.push(...selectShard(source, index, 4));
}
expect(joined).toEqual(source);`
      },
      {
        name: 'размеры различаются не больше чем на единицу',
        code: `const many = Array.from({ length: 10 }, (item, index) => index);
const sizes = [];
for (let index = 1; index <= 4; index += 1) {
  sizes.push(selectShard(many, index, 4).length);
}
expect(Math.max(...sizes) - Math.min(...sizes) <= 1).toBe(true);`
      },
      {
        name: 'сегментов больше, чем элементов',
        code: `expect(selectShard([1, 2], 3, 4)).toEqual([]);
expect(selectShard([1, 2], 1, 4)).toEqual([1]);`
      },
      {
        name: 'неверный номер отвергается',
        code: `let outOfRange = '';
try { selectShard([1, 2], 0, 2); } catch (error) { outOfRange = error.message; }
expect(outOfRange).toBe('номер сегмента вне диапазона');

let tooBig = '';
try { selectShard([1, 2], 3, 2); } catch (error) { tooBig = error.message; }
expect(tooBig).toBe('номер сегмента вне диапазона');`
      },
      {
        name: 'исходный набор не изменяется',
        code: `const original = [1, 2, 3];
selectShard(original, 1, 2);
expect(original).toEqual([1, 2, 3]);`
      }
    ],
    solution: `function selectShard(items, shardIndex, shardTotal) {
  if (!Number.isInteger(shardIndex) || shardIndex < 1 || shardIndex > shardTotal) {
    throw new Error('номер сегмента вне диапазона');
  }

  const base = Math.floor(items.length / shardTotal);
  const remainder = items.length % shardTotal;

  // Первые remainder сегментов получают по одному лишнему элементу.
  const before = shardIndex - 1;
  const start = before * base + Math.min(before, remainder);
  const size = base + (before < remainder ? 1 : 0);

  return items.slice(start, start + size);
}`
  }
]
