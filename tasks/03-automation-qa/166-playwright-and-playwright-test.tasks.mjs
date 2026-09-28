export default [
  {
    id: 'qa-166-config-applies-to-runner',
    title: 'Конфигурацию читает раннер',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `resolveCallOptions(config, call)`, которая показывает, ' +
      'откуда берутся значения. `config` — `{ baseURL, timeout }` из файла ' +
      'конфигурации, `call` — `{ viaRunner, url, timeout }`. Если вызов идёт ' +
      'через раннер (`viaRunner: true`), недостающие `url` и `timeout` берутся ' +
      'из конфигурации, а относительный `url` достраивается до `baseURL`. Если ' +
      'вызов идёт напрямую через библиотеку, конфигурация не применяется: ' +
      'отсутствующий `timeout` становится `null`, а относительный `url` даёт ' +
      '`Error` с сообщением `нужен абсолютный адрес`.',
    starter: `function resolveCallOptions(config, call) {
  // Конфигурацию видит только вызов через раннер.

  return { url: '', timeout: null };
}`,
    hints: [
      'Относительным считается адрес, не начинающийся с `http://` или `https://`.',
      'Явно переданное значение всегда важнее значения из конфигурации.',
      'Прямой вызов библиотеки ничего не знает о файле конфигурации — в этом и смысл задачи.'
    ],
    tests: [
      {
        name: 'раннер достраивает относительный адрес',
        code: `expect(resolveCallOptions(
  { baseURL: 'http://stand', timeout: 5000 },
  { viaRunner: true, url: '/work-items' }
)).toEqual({ url: 'http://stand/work-items', timeout: 5000 });`
      },
      {
        name: 'явный срок важнее значения из конфигурации',
        code: `expect(resolveCallOptions(
  { baseURL: 'http://stand', timeout: 5000 },
  { viaRunner: true, url: '/a', timeout: 100 }
).timeout).toBe(100);`
      },
      {
        name: 'абсолютный адрес не меняется',
        code: `expect(resolveCallOptions(
  { baseURL: 'http://stand', timeout: 5000 },
  { viaRunner: true, url: 'http://other/page' }
).url).toBe('http://other/page');`
      },
      {
        name: 'прямой вызов не получает срок из конфигурации',
        code: `expect(resolveCallOptions(
  { baseURL: 'http://stand', timeout: 5000 },
  { viaRunner: false, url: 'http://stand/a' }
)).toEqual({ url: 'http://stand/a', timeout: null });`
      },
      {
        name: 'прямой вызов требует абсолютного адреса',
        code: `expect(() => resolveCallOptions(
  { baseURL: 'http://stand', timeout: 5000 },
  { viaRunner: false, url: '/work-items' }
)).toThrow('нужен абсолютный адрес');`
      },
      {
        name: 'прямой вызов со своим сроком сохраняет его',
        code: `expect(resolveCallOptions(
  { baseURL: 'http://stand', timeout: 5000 },
  { viaRunner: false, url: 'https://stand/a', timeout: 250 }
).timeout).toBe(250);`
      }
    ],
    solution: `function resolveCallOptions(config, call) {
  const absolute = /^https?:\\/\\//.test(call.url);

  if (!call.viaRunner) {
    if (!absolute) throw new Error('нужен абсолютный адрес');

    return { url: call.url, timeout: call.timeout ?? null };
  }

  return {
    url: absolute ? call.url : \`\${config.baseURL}\${call.url}\`,
    timeout: call.timeout ?? config.timeout
  };
}`
  }
]
