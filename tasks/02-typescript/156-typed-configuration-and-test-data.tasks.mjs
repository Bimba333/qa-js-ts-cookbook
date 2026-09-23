export default [
  {
    id: 'ts-156-read-config',
    title: 'Чтение конфигурации с проверкой',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите `readConfig(env: Record<string, string | undefined>): Config`, где ' +
      '`Config = { baseUrl: string; retries: number; headless: boolean }`. ' +
      'Значения берутся из `BASE_URL`, `RETRIES`, `HEADLESS`. ' +
      '`BASE_URL` обязателен — без него ошибка `BASE_URL не задан`. ' +
      '`RETRIES` по умолчанию `0`, нечисловое значение — ошибка `RETRIES не число`. ' +
      '`HEADLESS` считается истинным только для строки `true`, по умолчанию `true`.',
    starter: `type Config = {
  baseUrl: string;
  retries: number;
  headless: boolean;
};

function readConfig(env: Record<string, string | undefined>): Config {
  // Границу конфигурации проверяют один раз — здесь.
  return { baseUrl: '', retries: 0, headless: true };
}`,
    hints: [
      'Значение переменной окружения всегда строка или undefined.',
      'Пустая строка — это тоже «не задано».',
      'Number("") равно нулю: проверять надо до преобразования.'
    ],
    tests: [
      {
        name: 'читает все три значения',
        code: `expect(readConfig({ BASE_URL: 'http://x', RETRIES: '3', HEADLESS: 'false' }))
  .toEqual({ baseUrl: 'http://x', retries: 3, headless: false });`
      },
      {
        name: 'значения по умолчанию применяются',
        code: `expect(readConfig({ BASE_URL: 'http://x' }))
  .toEqual({ baseUrl: 'http://x', retries: 0, headless: true });`
      },
      {
        name: 'отсутствие адреса — ошибка',
        code: `let message = '';
try { readConfig({}); } catch (error) { message = error.message; }
expect(message).toBe('BASE_URL не задан');`
      },
      {
        name: 'пустой адрес тоже ошибка',
        code: `let message = '';
try { readConfig({ BASE_URL: '' }); } catch (error) { message = error.message; }
expect(message).toBe('BASE_URL не задан');`
      },
      {
        name: 'нечисловое число попыток — ошибка',
        code: `let message = '';
try { readConfig({ BASE_URL: 'http://x', RETRIES: 'три' }); }
catch (error) { message = error.message; }
expect(message).toBe('RETRIES не число');`
      },
      {
        name: 'произвольная строка не включает режим окна',
        code: `expect(readConfig({ BASE_URL: 'http://x', HEADLESS: 'yes' }).headless).toBe(false);`
      }
    ],
    solution: `type Config = {
  baseUrl: string;
  retries: number;
  headless: boolean;
};

function readConfig(env: Record<string, string | undefined>): Config {
  const baseUrl = env.BASE_URL;

  if (baseUrl === undefined || baseUrl === '') {
    throw new Error('BASE_URL не задан');
  }

  const rawRetries = env.RETRIES;
  let retries = 0;

  if (rawRetries !== undefined && rawRetries !== '') {
    retries = Number(rawRetries);

    if (!Number.isFinite(retries)) {
      throw new Error('RETRIES не число');
    }
  }

  const rawHeadless = env.HEADLESS;
  const headless = rawHeadless === undefined ? true : rawHeadless === 'true';

  return { baseUrl, retries, headless };
}`
  }
]
