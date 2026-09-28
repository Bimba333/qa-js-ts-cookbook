export default [
  {
    id: 'qa-242-redact-context',
    title: 'Безопасный контекст запуска',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `buildRunContext(env)`, которая возвращает объект, ' +
      'пригодный для журнала и отчёта. Несекретные значения (`ENVIRONMENT`, ' +
      '`API_BASE_URL`, `APP_VERSION`) переносятся как есть. Любой ключ, ' +
      'содержащий `TOKEN`, `SECRET`, `PASSWORD` или `KEY`, заменяется на ' +
      '`[REDACTED]`. Отсутствующее обязательное значение `ENVIRONMENT` даёт ' +
      '`Error` с сообщением `окружение не задано`. Неизвестные несекретные ' +
      'ключи в контекст не попадают.',
    starter: `function buildRunContext(env) {
  // Секреты маскируются до того, как контекст куда-либо уйдёт.

  return {};
}`,
    hints: [
      'Список разрешённых несекретных ключей задаётся явно: всё остальное либо секрет, либо шум.',
      'Признак секрета — подстрока в имени, поэтому проверять надо имя, а не значение.',
      'Маскировать нужно и те секреты, которых нет в списке разрешённых: иначе они просто не попадут в отчёт, но проверить это будет нечем.'
    ],
    tests: [
      {
        name: 'несекретные значения переносятся',
        code: `expect(buildRunContext({ ENVIRONMENT: 'preview', API_BASE_URL: 'http://stand' }))
  .toEqual({ ENVIRONMENT: 'preview', API_BASE_URL: 'http://stand' });`
      },
      {
        name: 'токен маскируется',
        code: `expect(buildRunContext({ ENVIRONMENT: 'preview', API_TOKEN: 'abc123' }))
  .toEqual({ ENVIRONMENT: 'preview', API_TOKEN: '[REDACTED]' });`
      },
      {
        name: 'пароль и ключ тоже маскируются',
        code: `expect(buildRunContext({
  ENVIRONMENT: 'ci',
  DB_PASSWORD: 'p',
  SIGNING_KEY: 'k',
  CLIENT_SECRET: 's'
})).toEqual({
  ENVIRONMENT: 'ci',
  DB_PASSWORD: '[REDACTED]',
  SIGNING_KEY: '[REDACTED]',
  CLIENT_SECRET: '[REDACTED]'
});`
      },
      {
        name: 'неизвестный несекретный ключ отбрасывается',
        code: `expect(buildRunContext({ ENVIRONMENT: 'ci', HOME: '/root' }))
  .toEqual({ ENVIRONMENT: 'ci' });`
      },
      {
        name: 'отсутствующее окружение — ошибка',
        code: `expect(() => buildRunContext({ API_BASE_URL: 'http://stand' }))
  .toThrow('окружение не задано');`
      },
      {
        name: 'значение секрета не попадает в результат',
        code: `const context = buildRunContext({ ENVIRONMENT: 'ci', API_TOKEN: 'очень-секретно' });
expect(JSON.stringify(context).includes('очень-секретно')).toBe(false);`
      },
      {
        name: 'версия приложения переносится',
        code: `expect(buildRunContext({ ENVIRONMENT: 'ci', APP_VERSION: '1.2.3' }))
  .toEqual({ ENVIRONMENT: 'ci', APP_VERSION: '1.2.3' });`
      }
    ],
    solution: `function buildRunContext(env) {
  const allowed = ['ENVIRONMENT', 'API_BASE_URL', 'APP_VERSION'];
  const secretMarkers = ['TOKEN', 'SECRET', 'PASSWORD', 'KEY'];

  if (typeof env.ENVIRONMENT !== 'string' || env.ENVIRONMENT.trim() === '') {
    throw new Error('окружение не задано');
  }

  const context = {};

  for (const [name, value] of Object.entries(env)) {
    if (secretMarkers.some(marker => name.includes(marker))) {
      context[name] = '[REDACTED]';
    } else if (allowed.includes(name)) {
      context[name] = value;
    }
  }

  return context;
}`
  }
]
