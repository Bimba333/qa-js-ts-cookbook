export default [
  {
    id: 'js-31-apply-collected-args',
    title: 'Аргументы уже собраны в массив',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Дана функция `join(separator, ending)`, возвращающая строку ' +
      '`<name><separator><role><ending>` из `this`. Напишите функцию ' +
      '`joinWith(target, args)`, где `args` — массив аргументов. Выполните `join` ' +
      'с объектом `target`, передав аргументы одной коллекцией.',
    starter: `function join(separator, ending) {
  return \`\${this.name}\${separator}\${this.role}\${ending}\`;
}

function joinWith(target, args) {
  // Аргументы уже лежат в массиве.
}`,
    hints: [
      'Есть метод, принимающий аргументы одной коллекцией.',
      'Первым по-прежнему идёт объект выполнения.',
      'Разворачивать массив вручную не нужно.'
    ],
    tests: [
      {
        name: 'передаёт аргументы массивом',
        code: `expect(joinWith({ name: 'Анна', role: 'admin' }, [' / ', '!'])).toBe('Анна / admin!');`
      },
      {
        name: 'работает с другими значениями',
        code: `expect(joinWith({ name: 'a', role: 'b' }, ['-', ''])).toBe('a-b');`
      },
      {
        name: 'не изменяет массив аргументов',
        code: `const args = [' / ', '!'];
joinWith({ name: 'a', role: 'b' }, args);
expect(args).toEqual([' / ', '!']);`
      },
      {
        name: 'возвращает строку',
        code: `expect(typeof joinWith({ name: 'a', role: 'b' }, ['-', ''])).toBe('string');`
      }
    ],
    solution: `function join(separator, ending) {
  return \`\${this.name}\${separator}\${this.role}\${ending}\`;
}

function joinWith(target, args) {
  return join.apply(target, args);
}`
  },

  {
    id: 'js-31-max-duration',
    title: 'Максимум из массива длительностей',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `maxDuration(results)`, которая принимает массив ' +
      '`{ name, durationMs }` и возвращает наибольшую длительность. Для пустого ' +
      'массива вернуть `0`. Используйте передачу собранных значений функции ' +
      '`Math.max` одной коллекцией.',
    starter: `function maxDuration(results) {
  // Math.max принимает аргументы по одному.
}`,
    hints: [
      'Сначала соберите длительности в массив.',
      'Math.max не принимает массив — нужна передача аргументов коллекцией или spread.',
      'Math.max() без аргументов возвращает -Infinity: пустой случай обработайте отдельно.'
    ],
    tests: [
      {
        name: 'находит максимум',
        code: `expect(maxDuration([
  { name: 'a', durationMs: 10 },
  { name: 'b', durationMs: 300 },
  { name: 'c', durationMs: 50 }
])).toBe(300);`
      },
      {
        name: 'для пустого массива возвращает 0',
        code: `expect(maxDuration([])).toBe(0);`
      },
      {
        name: 'работает с одним элементом',
        code: `expect(maxDuration([{ name: 'a', durationMs: 42 }])).toBe(42);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [{ name: 'a', durationMs: 10 }];
maxDuration(source);
expect(source).toEqual([{ name: 'a', durationMs: 10 }]);`
      }
    ],
    solution: `function maxDuration(results) {
  if (results.length === 0) {
    return 0;
  }

  return Math.max.apply(null, results.map((result) => result.durationMs));
}`
  }
]
