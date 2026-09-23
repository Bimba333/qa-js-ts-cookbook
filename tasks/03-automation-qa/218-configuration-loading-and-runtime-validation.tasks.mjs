export default [
  {
    id: 'qa-218-load-or-fail',
    title: 'Загрузчик возвращает валидное или ничего',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `loadConfig(env)` — загрузчик конфигурации из объекта переменных ' +
      'окружения. Требования: `BASE_URL` обязателен; `WORKERS` — целое число ' +
      'больше нуля, по умолчанию `1`; `RETRIES` — целое число не меньше нуля, ' +
      'по умолчанию `0`. Пустая строка считается незаданным значением. ' +
      'При нарушениях бросьте ошибку с сообщением `Конфигурация неверна: ` и ' +
      'перечислением **всех** проблем через `; ` в порядке: BASE_URL, WORKERS, ' +
      'RETRIES. Тексты проблем: `BASE_URL не задан`, `WORKERS должен быть целым ' +
      'числом больше нуля`, `RETRIES должен быть целым числом не меньше нуля`. ' +
      'Успешный результат заморожен.',
    starter: `function loadConfig(env) {
  // Собирайте все проблемы, а не падайте на первой.

  return { baseUrl: '', workers: 1, retries: 0 };
}`,
    hints: [
      'Проблемы удобно копить в массиве и проверять его в конце.',
      'Number("") равен нулю, поэтому пустую строку нужно отсеять до преобразования.',
      'Замораживает объект Object.freeze.'
    ],
    tests: [
      {
        name: 'полная конфигурация читается',
        code: `expect(loadConfig({ BASE_URL: 'http://x', WORKERS: '4', RETRIES: '2' }))
  .toEqual({ baseUrl: 'http://x', workers: 4, retries: 2 });`
      },
      {
        name: 'значения по умолчанию подставляются',
        code: `expect(loadConfig({ BASE_URL: 'http://x' }))
  .toEqual({ baseUrl: 'http://x', workers: 1, retries: 0 });`
      },
      {
        name: 'результат заморожен',
        code: `const config = loadConfig({ BASE_URL: 'http://x' });
try { config.workers = 99; } catch (error) { /* строгий режим бросает */ }
expect(config.workers).toBe(1);
expect(Object.isFrozen(config)).toBe(true);`
      },
      {
        name: 'сообщение содержит все проблемы сразу',
        code: `let message = '';
try { loadConfig({ WORKERS: '0', RETRIES: '-1' }); }
catch (error) { message = error.message; }
expect(message).toBe(
  'Конфигурация неверна: BASE_URL не задан; ' +
  'WORKERS должен быть целым числом больше нуля; ' +
  'RETRIES должен быть целым числом не меньше нуля'
);`
      },
      {
        name: 'пустая строка считается незаданной',
        code: `let emptyMessage = '';
try { loadConfig({ BASE_URL: '' }); } catch (error) { emptyMessage = error.message; }
expect(emptyMessage).toBe('Конфигурация неверна: BASE_URL не задан');`
      },
      {
        name: 'дробное число работников отвергается',
        code: `let fractionMessage = '';
try { loadConfig({ BASE_URL: 'http://x', WORKERS: '2.5' }); }
catch (error) { fractionMessage = error.message; }
expect(fractionMessage).toContain('WORKERS должен быть целым числом больше нуля');`
      },
      {
        name: 'ноль попыток допустим',
        code: `expect(loadConfig({ BASE_URL: 'http://x', RETRIES: '0' }).retries).toBe(0);`
      }
    ],
    solution: `function loadConfig(env) {
  const problems = [];

  const rawBaseUrl = env.BASE_URL;
  const baseUrl = rawBaseUrl === undefined || rawBaseUrl === '' ? null : rawBaseUrl;

  if (baseUrl === null) {
    problems.push('BASE_URL не задан');
  }

  const readInteger = (raw, fallback) => {
    if (raw === undefined || raw === '') return fallback;
    return Number(raw);
  };

  const workers = readInteger(env.WORKERS, 1);

  if (!Number.isInteger(workers) || workers < 1) {
    problems.push('WORKERS должен быть целым числом больше нуля');
  }

  const retries = readInteger(env.RETRIES, 0);

  if (!Number.isInteger(retries) || retries < 0) {
    problems.push('RETRIES должен быть целым числом не меньше нуля');
  }

  if (problems.length > 0) {
    throw new Error('Конфигурация неверна: ' + problems.join('; '));
  }

  return Object.freeze({ baseUrl, workers, retries });
}`
  }
]
