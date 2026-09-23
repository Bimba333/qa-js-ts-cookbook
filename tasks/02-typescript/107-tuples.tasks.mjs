export default [
  {
    id: 'ts-107-parse-range',
    title: 'Кортеж вместо объекта',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `parseRange(value: string): [number, number]` — разбор строки вида ' +
      '`10-20` в кортеж из двух чисел. Порядок сохраняется как в строке. ' +
      'Если формат не подходит или границы не числа, выбросьте ошибку ' +
      '`некорректный диапазон`.',
    starter: `function parseRange(value: string): [number, number] {
  // Кортеж фиксирует длину и типы позиций.
  return [0, 0];
}`,
    hints: [
      'Разделитель встречается ровно один раз.',
      'Number("") даёт 0 — пустую часть нужно отсеять отдельно.',
      'Сообщение об ошибке должно совпадать дословно.'
    ],
    tests: [
      {
        name: 'разбирает обычный диапазон',
        code: `expect(parseRange('10-20')).toEqual([10, 20]);`
      },
      {
        name: 'порядок не исправляется',
        code: `expect(parseRange('20-10')).toEqual([20, 10]);`
      },
      {
        name: 'длина результата всегда два',
        code: `expect(parseRange('0-0')).toHaveLength(2);`
      },
      {
        name: 'нечисловая граница отвергается',
        code: `let message = '';
try { parseRange('a-2'); } catch (error) { message = error.message; }
expect(message).toBe('некорректный диапазон');`
      },
      {
        name: 'отсутствие разделителя отвергается',
        code: `let message = '';
try { parseRange('10'); } catch (error) { message = error.message; }
expect(message).toBe('некорректный диапазон');`
      },
      {
        name: 'пустая граница отвергается',
        code: `let message = '';
try { parseRange('10-'); } catch (error) { message = error.message; }
expect(message).toBe('некорректный диапазон');`
      }
    ],
    solution: `function parseRange(value: string): [number, number] {
  const parts = value.split('-');

  if (parts.length !== 2) {
    throw new Error('некорректный диапазон');
  }

  const [rawFrom, rawTo] = parts;

  if (rawFrom.trim() === '' || rawTo.trim() === '') {
    throw new Error('некорректный диапазон');
  }

  const from = Number(rawFrom);
  const to = Number(rawTo);

  if (Number.isNaN(from) || Number.isNaN(to)) {
    throw new Error('некорректный диапазон');
  }

  return [from, to];
}`
  }
]
