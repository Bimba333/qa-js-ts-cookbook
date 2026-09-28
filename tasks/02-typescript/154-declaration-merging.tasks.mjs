export default [
  {
    id: 'ts-154-merge-interfaces',
    title: 'Слияние одноимённых интерфейсов',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Одноимённые интерфейсы сливаются, а одноимённые псевдонимы типов — нет. ' +
      'Напишите функцию ' +
      '`mergeDeclarations(declarations: Array<{ kind: \'interface\' | \'type\'; name: string; ' +
      'members: Record<string, string> }>): Record<string, Record<string, string>>`. ' +
      'Интерфейсы с одинаковым именем объединяют члены; при конфликте типа ' +
      'одного и того же члена бросьте `Error` с сообщением `конфликт членов`. ' +
      'Повторное объявление псевдонима типа даёт `Error` с сообщением ' +
      '`повторное объявление типа`.',
    starter: `function mergeDeclarations(
  declarations: Array<{ kind: 'interface' | 'type'; name: string; members: Record<string, string> }>
): Record<string, Record<string, string>> {
  // Интерфейсы сливаются, псевдонимы типов — нет.
  return {};
}`,
    hints: [
      'Конфликт возникает только когда один и тот же член объявлен с разными типами — повтор с тем же типом допустим.',
      'Псевдоним типа не сливается: второе объявление с тем же именем — ошибка независимо от содержимого.',
      'Объявления обрабатываются по порядку, поэтому ошибка возникает на первом же конфликте.'
    ],
    tests: [
      {
        name: 'одиночный интерфейс',
        code: `expect(mergeDeclarations([
  { kind: 'interface', name: 'Task', members: { id: 'string' } }
])).toEqual({ Task: { id: 'string' } });`
      },
      {
        name: 'два интерфейса сливаются',
        code: `expect(mergeDeclarations([
  { kind: 'interface', name: 'Task', members: { id: 'string' } },
  { kind: 'interface', name: 'Task', members: { title: 'string' } }
])).toEqual({ Task: { id: 'string', title: 'string' } });`
      },
      {
        name: 'повтор члена с тем же типом допустим',
        code: `expect(mergeDeclarations([
  { kind: 'interface', name: 'Task', members: { id: 'string' } },
  { kind: 'interface', name: 'Task', members: { id: 'string', title: 'string' } }
])).toEqual({ Task: { id: 'string', title: 'string' } });`
      },
      {
        name: 'конфликт типов члена — ошибка',
        code: `expect(() => mergeDeclarations([
  { kind: 'interface', name: 'Task', members: { id: 'string' } },
  { kind: 'interface', name: 'Task', members: { id: 'number' } }
])).toThrow('конфликт членов');`
      },
      {
        name: 'повторный псевдоним типа — ошибка',
        code: `expect(() => mergeDeclarations([
  { kind: 'type', name: 'Result', members: { ok: 'boolean' } },
  { kind: 'type', name: 'Result', members: { ok: 'boolean' } }
])).toThrow('повторное объявление типа');`
      },
      {
        name: 'разные имена не мешают друг другу',
        code: `expect(mergeDeclarations([
  { kind: 'interface', name: 'Task', members: { id: 'string' } },
  { kind: 'type', name: 'Result', members: { ok: 'boolean' } }
])).toEqual({ Task: { id: 'string' }, Result: { ok: 'boolean' } });`
      }
    ],
    solution: `function mergeDeclarations(
  declarations: Array<{ kind: 'interface' | 'type'; name: string; members: Record<string, string> }>
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  const kinds = new Map<string, string>();

  for (const declaration of declarations) {
    const known = kinds.get(declaration.name);

    if (known !== undefined && (known === 'type' || declaration.kind === 'type')) {
      throw new Error('повторное объявление типа');
    }

    kinds.set(declaration.name, declaration.kind);
    const target = result[declaration.name] ?? {};

    for (const [member, type] of Object.entries(declaration.members)) {
      if (Object.hasOwn(target, member) && target[member] !== type) {
        throw new Error('конфликт членов');
      }

      target[member] = type;
    }

    result[declaration.name] = target;
  }

  return result;
}`
  }
]
