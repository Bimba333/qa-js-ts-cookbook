export default [
  {
    id: 'ts-151-strip-type-imports',
    title: 'Что остаётся от импортов после компиляции',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Импорт, помеченный как типовой, до выполнения не доживает. Напишите ' +
      'функцию `stripTypeImports(lines: string[]): string[]`, которая убирает ' +
      'из списка строк все импорты вида `import type ...` и все ' +
      'импортированные имена с префиксом `type` внутри фигурных скобок. ' +
      'Строка, у которой после удаления не осталось ни одного имени, ' +
      'исчезает целиком. Остальные строки не меняются.',
    starter: `function stripTypeImports(lines: string[]): string[] {
  // Удалять нужно и строку целиком, и отдельные имена внутри скобок.
  return lines;
}`,
    hints: [
      'Строка с `import type` удаляется целиком: она не порождает кода.',
      'Внутри фигурных скобок имена разделены запятой, и типовые помечены словом `type` перед именем.',
      'Если после фильтрации имён не осталось, импорт становится пустым и его нужно убрать.'
    ],
    tests: [
      {
        name: 'обычный импорт сохраняется',
        code: `expect(stripTypeImports(["import { createClient } from './client';"]))
  .toEqual(["import { createClient } from './client';"]);`
      },
      {
        name: 'типовой импорт удаляется целиком',
        code: `expect(stripTypeImports(["import type { Task } from './types';"])).toEqual([]);`
      },
      {
        name: 'смешанный импорт теряет только типовые имена',
        code: `expect(stripTypeImports(["import { createClient, type Task } from './client';"]))
  .toEqual(["import { createClient } from './client';"]);`
      },
      {
        name: 'импорт из одних типов исчезает',
        code: `expect(stripTypeImports(["import { type Task, type Run } from './types';"])).toEqual([]);`
      },
      {
        name: 'строки, не являющиеся импортом, не трогаются',
        code: `expect(stripTypeImports(['const value = 1;', "import type { A } from './a';"]))
  .toEqual(['const value = 1;']);`
      },
      {
        name: 'несколько строк обрабатываются вместе',
        code: `expect(stripTypeImports([
  "import type { Task } from './types';",
  "import { run, type Options } from './run';",
  'const started = true;'
])).toEqual(["import { run } from './run';", 'const started = true;']);`
      }
    ],
    solution: `function stripTypeImports(lines: string[]): string[] {
  const result: string[] = [];

  for (const line of lines) {
    if (/^\\s*import\\s+type\\b/.test(line)) continue;

    const braces = line.match(/^(\\s*import\\s*\\{)([^}]*)(\\}.*)$/);

    if (!braces) {
      result.push(line);
      continue;
    }

    const kept = braces[2]
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0 && !/^type\\s/.test(name));

    if (kept.length === 0) continue;

    result.push(\`\${braces[1]} \${kept.join(', ')} \${braces[3]}\`);
  }

  return result;
}`
  }
]
