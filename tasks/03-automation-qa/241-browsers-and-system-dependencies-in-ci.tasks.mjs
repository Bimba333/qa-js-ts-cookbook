export default [
  {
    id: 'qa-241-cache-key',
    title: 'Ключ кеша браузеров',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Кеш браузеров ускоряет подготовку, но неверный ключ отдаёт несовместимую ' +
      'сборку. Напишите функцию `browserCacheKey(input)`, где `input` — ' +
      '`{ os, playwrightVersion, lockfileHash }`. Ключ имеет вид ' +
      '`browsers-<os>-<версия>-<хеш>`. Любое отсутствующее или пустое поле ' +
      'даёт `Error` с сообщением `неполный ключ кеша`. Дополнительно напишите ' +
      '`isCacheUsable(key, input)`: попадание в кеш возможно, только если ключ ' +
      'совпадает целиком.',
    starter: `function browserCacheKey(input) {
  // Все три составляющие обязательны: иначе кеш отдаст чужую сборку.
  return '';
}

function isCacheUsable(key, input) {
  return true;
}`,
    hints: [
      'Пустая строка и строка из пробелов — это тоже отсутствующее значение.',
      'Ключ собирается в фиксированном порядке, иначе одинаковые входные данные дадут разные ключи.',
      'Сравнение ключей строгое: частичное совпадение промахом кеша не является.'
    ],
    tests: [
      {
        name: 'ключ собирается из трёх частей',
        code: `expect(browserCacheKey({ os: 'ubuntu-22.04', playwrightVersion: '1.47.0', lockfileHash: 'abc123' }))
  .toBe('browsers-ubuntu-22.04-1.47.0-abc123');`
      },
      {
        name: 'отсутствующее поле даёт ошибку',
        code: `expect(() => browserCacheKey({ os: 'ubuntu-22.04', playwrightVersion: '1.47.0' }))
  .toThrow('неполный ключ кеша');`
      },
      {
        name: 'пустое значение даёт ошибку',
        code: `expect(() => browserCacheKey({ os: '  ', playwrightVersion: '1.47.0', lockfileHash: 'abc' }))
  .toThrow('неполный ключ кеша');`
      },
      {
        name: 'совпадающий ключ попадает в кеш',
        code: `const input = { os: 'ubuntu-22.04', playwrightVersion: '1.47.0', lockfileHash: 'abc' };
expect(isCacheUsable(browserCacheKey(input), input)).toBe(true);`
      },
      {
        name: 'другая версия Playwright — промах',
        code: `const older = { os: 'ubuntu-22.04', playwrightVersion: '1.46.0', lockfileHash: 'abc' };
const newer = { os: 'ubuntu-22.04', playwrightVersion: '1.47.0', lockfileHash: 'abc' };
expect(isCacheUsable(browserCacheKey(older), newer)).toBe(false);`
      },
      {
        name: 'другая операционная система — промах',
        code: `const linux = { os: 'ubuntu-22.04', playwrightVersion: '1.47.0', lockfileHash: 'abc' };
const mac = { os: 'macos-14', playwrightVersion: '1.47.0', lockfileHash: 'abc' };
expect(isCacheUsable(browserCacheKey(linux), mac)).toBe(false);`
      },
      {
        name: 'другой файл фиксации версий — промах',
        code: `const before = { os: 'ubuntu-22.04', playwrightVersion: '1.47.0', lockfileHash: 'abc' };
const after = { os: 'ubuntu-22.04', playwrightVersion: '1.47.0', lockfileHash: 'def' };
expect(isCacheUsable(browserCacheKey(before), after)).toBe(false);`
      }
    ],
    solution: `function browserCacheKey(input) {
  const parts = [input?.os, input?.playwrightVersion, input?.lockfileHash];

  if (parts.some(part => typeof part !== 'string' || part.trim() === '')) {
    throw new Error('неполный ключ кеша');
  }

  return \`browsers-\${parts.join('-')}\`;
}

function isCacheUsable(key, input) {
  return key === browserCacheKey(input);
}`
  }
]
