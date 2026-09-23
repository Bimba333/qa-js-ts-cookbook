export default [
  {
    id: 'ts-102-annotation-is-not-conversion',
    title: 'Аннотация не преобразует значение',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите `readRetriesLoose(raw: unknown): number`, которая просто ' +
      'утверждает тип (`raw as number`) и возвращает значение — преобразования ' +
      'не происходит. И `readRetriesStrict(raw: unknown): number`, которая ' +
      'приводит значение к числу сама: строку с числом превращает в число, ' +
      '`undefined` и пустую строку — в `0`, а всё остальное отвергает ошибкой ' +
      '`не число`. Проверки покажут, что первая функция возвращает то, что ей ' +
      'дали, несмотря на объявленный тип результата.',
    starter: `function readRetriesLoose(raw: unknown): number {
  return raw as number;
}

function readRetriesStrict(raw: unknown): number {
  // Приведение выполняет код, а не аннотация.
  return 0;
}`,
    hints: [
      'Аннотация влияет на проверку до запуска и ни на что больше.',
      'Number("") равен нулю, поэтому пустую строку надо обработать явно.',
      'Дробное и отрицательное значение числами остаются.'
    ],
    tests: [
      {
        name: 'аннотация не меняет тип значения',
        code: `const loose = readRetriesLoose('3');
expect(typeof loose).toBe('string');
expect(loose as unknown).toBe('3');`
      },
      {
        name: 'приведение возвращает число',
        code: `const strict = readRetriesStrict('3');
expect(typeof strict).toBe('number');
expect(strict).toBe(3);`
      },
      {
        name: 'число проходит как есть',
        code: `expect(readRetriesStrict(5)).toBe(5);`
      },
      {
        name: 'отсутствие значения даёт ноль',
        code: `expect(readRetriesStrict(undefined)).toBe(0);
expect(readRetriesStrict('')).toBe(0);`
      },
      {
        name: 'нечисловое значение отвергается',
        code: `let message = '';
try { readRetriesStrict('три'); } catch (error) { message = (error as Error).message; }
expect(message).toBe('не число');

let objectMessage = '';
try { readRetriesStrict({}); } catch (error) { objectMessage = (error as Error).message; }
expect(objectMessage).toBe('не число');`
      },
      {
        name: 'дробное значение остаётся числом',
        code: `expect(readRetriesStrict('2.5')).toBe(2.5);`
      }
    ],
    solution: `function readRetriesLoose(raw: unknown): number {
  return raw as number;
}

function readRetriesStrict(raw: unknown): number {
  if (raw === undefined || raw === '') {
    return 0;
  }

  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : (() => { throw new Error('не число'); })();
  }

  if (typeof raw !== 'string') {
    throw new Error('не число');
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed)) {
    throw new Error('не число');
  }

  return parsed;
}`
  }
]
