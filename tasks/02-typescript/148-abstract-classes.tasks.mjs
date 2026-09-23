export default [
  {
    id: 'ts-148-base-is-not-instantiable',
    title: 'Базовый класс не создаётся напрямую',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите `abstract class ReportWriter` с готовым методом ' +
      '`writeHeader(title: string): string` (возвращает `Отчёт: <title>`) и ' +
      'абстрактным `writeBody(lines: string[]): string`. ' +
      '`abstract` проверяется только компилятором и после компиляции исчезает, ' +
      'поэтому добавьте в конструктор настоящую проверку через `new.target`: ' +
      'попытка создать сам `ReportWriter` выбрасывает ошибку ' +
      '`ReportWriter нельзя создать напрямую`. ' +
      'Напишите наследников `TextReportWriter` (строки через перевод строки) и ' +
      '`JsonReportWriter` (`JSON.stringify(lines)`), а также ' +
      '`render(writer: ReportWriter, title: string, lines: string[]): string` — ' +
      'заголовок и тело, разделённые переводом строки.',
    starter: `abstract class ReportWriter {
  constructor() {
    // abstract стирается при компиляции: нужна проверка во время выполнения.
  }

  writeHeader(title: string): string {
    return '';
  }

  abstract writeBody(lines: string[]): string;
}

class TextReportWriter extends ReportWriter {
  writeBody(lines: string[]): string {
    return '';
  }
}

class JsonReportWriter extends ReportWriter {
  writeBody(lines: string[]): string {
    return '';
  }
}

function render(writer: ReportWriter, title: string, lines: string[]): string {
  return '';
}`,
    hints: [
      'new.target указывает на класс, который вызвали через new.',
      'У наследника new.target равен самому наследнику, а не базовому классу.',
      'Готовый метод базового класса наследники не переопределяют.'
    ],
    tests: [
      {
        name: 'базовый класс создать нельзя',
        code: `let message = '';
try { new (ReportWriter as unknown as new () => unknown)(); }
catch (error) { message = (error as Error).message; }
expect(message).toBe('ReportWriter нельзя создать напрямую');`
      },
      {
        name: 'наследники создаются',
        code: `expect(new TextReportWriter() instanceof ReportWriter).toBe(true);
expect(new JsonReportWriter() instanceof ReportWriter).toBe(true);`
      },
      {
        name: 'общий метод достался обоим',
        code: `expect(new TextReportWriter().writeHeader('дневной')).toBe('Отчёт: дневной');
expect(new JsonReportWriter().writeHeader('дневной')).toBe('Отчёт: дневной');`
      },
      {
        name: 'тело пишется по-своему',
        code: `expect(new TextReportWriter().writeBody(['a', 'b'])).toBe('a\\nb');
expect(new JsonReportWriter().writeBody(['a', 'b'])).toBe('["a","b"]');`
      },
      {
        name: 'сборка отчёта не зависит от наследника',
        code: `expect(render(new TextReportWriter(), 'дневной', ['a']))
  .toBe('Отчёт: дневной\\na');
expect(render(new JsonReportWriter(), 'дневной', ['a']))
  .toBe('Отчёт: дневной\\n["a"]');`
      },
      {
        name: 'пустое тело',
        code: `expect(new TextReportWriter().writeBody([])).toBe('');
expect(new JsonReportWriter().writeBody([])).toBe('[]');`
      }
    ],
    solution: `abstract class ReportWriter {
  constructor() {
    if (new.target === ReportWriter) {
      throw new Error('ReportWriter нельзя создать напрямую');
    }
  }

  writeHeader(title: string): string {
    return 'Отчёт: ' + title;
  }

  abstract writeBody(lines: string[]): string;
}

class TextReportWriter extends ReportWriter {
  writeBody(lines: string[]): string {
    return lines.join('\\n');
  }
}

class JsonReportWriter extends ReportWriter {
  writeBody(lines: string[]): string {
    return JSON.stringify(lines);
  }
}

function render(writer: ReportWriter, title: string, lines: string[]): string {
  return writer.writeHeader(title) + '\\n' + writer.writeBody(lines);
}`
  }
]
