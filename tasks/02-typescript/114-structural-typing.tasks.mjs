export default [
  {
    id: 'ts-114-shape-not-name',
    title: 'Подходит форма, а не имя',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `Reporter = { write(line: string): void }` и напишите ' +
      '`collect(reporter: Reporter, lines: string[]): number`, которая вызывает ' +
      '`write` для каждой строки и возвращает число вызовов. Затем напишите ' +
      '`runStructural()`, возвращающую `{ fromObject, fromClass, fromArrayLike }`: ' +
      'результаты вызова `collect` с тремя разными получателями — объектным ' +
      'литералом, экземпляром класса `FileReporter` и объектом, у которого ' +
      '`write` добавлен после создания. Все трое подходят, потому что совпадает ' +
      'форма, а не имя типа.',
    starter: `type Reporter = { write(line: string): void };

class FileReporter {
  lines: string[] = [];

  write(line: string): void {
    this.lines.push(line);
  }
}

function collect(reporter: Reporter, lines: string[]): number {
  return 0;
}

function runStructural() {
  return { fromObject: 0, fromClass: 0, fromArrayLike: 0 };
}`,
    hints: [
      'Совместимость определяется набором свойств, а не объявленным именем типа.',
      'Экземпляр класса тоже просто объект с методом.',
      'Число вызовов считает сама функция collect.'
    ],
    tests: [
      {
        name: 'объектный литерал подходит',
        code: `expect(runStructural().fromObject).toBe(2);`
      },
      {
        name: 'экземпляр класса подходит',
        code: `expect(runStructural().fromClass).toBe(2);`
      },
      {
        name: 'объект с добавленным методом подходит',
        code: `expect(runStructural().fromArrayLike).toBe(2);`
      },
      {
        name: 'collect действительно вызывает write',
        code: `const written: string[] = [];
const count = collect({ write: line => { written.push(line); } }, ['a', 'b', 'c']);
expect(count).toBe(3);
expect(written).toEqual(['a', 'b', 'c']);`
      },
      {
        name: 'пустой список не вызывает write',
        code: `let calls = 0;
expect(collect({ write: () => { calls += 1; } }, [])).toBe(0);
expect(calls).toBe(0);`
      },
      {
        name: 'экземпляр класса сохраняет строки',
        code: `const reporter = new FileReporter();
collect(reporter, ['x', 'y']);
expect(reporter.lines).toEqual(['x', 'y']);`
      }
    ],
    solution: `type Reporter = { write(line: string): void };

class FileReporter {
  lines: string[] = [];

  write(line: string): void {
    this.lines.push(line);
  }
}

function collect(reporter: Reporter, lines: string[]): number {
  let calls = 0;

  for (const line of lines) {
    reporter.write(line);
    calls += 1;
  }

  return calls;
}

function runStructural() {
  const collected: string[] = [];

  const literal: Reporter = { write: line => { collected.push(line); } };
  const instance = new FileReporter();

  const late: Record<string, unknown> = {};
  late.write = (line: string) => { collected.push(line); };

  return {
    fromObject: collect(literal, ['a', 'b']),
    fromClass: collect(instance, ['a', 'b']),
    fromArrayLike: collect(late as unknown as Reporter, ['a', 'b'])
  };
}`
  }
]
