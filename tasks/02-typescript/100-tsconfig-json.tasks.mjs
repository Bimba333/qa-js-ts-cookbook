export default [
  {
    id: 'ts-100-resolve-config',
    title: 'Слияние конфигураций компилятора',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Файл конфигурации может наследоваться от базового через `extends`. ' +
      'Напишите функцию ' +
      '`resolveConfig(files: Record<string, RawConfig>, name: string): CompilerOptions`, ' +
      'где `RawConfig = { extends?: string; compilerOptions?: CompilerOptions }`, ' +
      'а `CompilerOptions = Record<string, string | boolean>`. Настройки ' +
      'наследника перекрывают базовые. Неизвестное имя файла даёт `Error` с ' +
      'сообщением `конфигурация не найдена`, циклический `extends` — `Error` ' +
      'с сообщением `циклическое наследование`.',
    starter: `type CompilerOptions = Record<string, string | boolean>;
type RawConfig = { extends?: string; compilerOptions?: CompilerOptions };

function resolveConfig(files: Record<string, RawConfig>, name: string): CompilerOptions {
  // Базовые настройки применяются первыми, настройки наследника — поверх.
  return {};
}`,
    hints: [
      'Цепочку `extends` удобно обойти рекурсивно: сначала получить базовые настройки, затем наложить свои.',
      'Наложение — это раскрытие двух объектов, где второй перекрывает первый.',
      'От зацикливания защищает множество уже посещённых имён.'
    ],
    tests: [
      {
        name: 'конфигурация без наследования',
        code: `expect(resolveConfig(
  { 'tsconfig.json': { compilerOptions: { strict: true } } },
  'tsconfig.json'
)).toEqual({ strict: true });`
      },
      {
        name: 'наследник перекрывает базовое значение',
        code: `expect(resolveConfig(
  {
    'base.json': { compilerOptions: { strict: true, target: 'ES2020' } },
    'tsconfig.json': { extends: 'base.json', compilerOptions: { target: 'ES2022' } }
  },
  'tsconfig.json'
)).toEqual({ strict: true, target: 'ES2022' });`
      },
      {
        name: 'цепочка из трёх файлов',
        code: `expect(resolveConfig(
  {
    'a.json': { compilerOptions: { a: '1', shared: 'a' } },
    'b.json': { extends: 'a.json', compilerOptions: { b: '2', shared: 'b' } },
    'c.json': { extends: 'b.json', compilerOptions: { c: '3' } }
  },
  'c.json'
)).toEqual({ a: '1', shared: 'b', b: '2', c: '3' });`
      },
      {
        name: 'конфигурация без собственных настроек',
        code: `expect(resolveConfig(
  { 'base.json': { compilerOptions: { strict: true } }, 'own.json': { extends: 'base.json' } },
  'own.json'
)).toEqual({ strict: true });`
      },
      {
        name: 'неизвестное имя даёт ошибку',
        code: `expect(() => resolveConfig({}, 'нет.json')).toThrow('конфигурация не найдена');`
      },
      {
        name: 'цикл обнаруживается',
        code: `expect(() => resolveConfig(
  { 'a.json': { extends: 'b.json' }, 'b.json': { extends: 'a.json' } },
  'a.json'
)).toThrow('циклическое наследование');`
      }
    ],
    solution: `type CompilerOptions = Record<string, string | boolean>;
type RawConfig = { extends?: string; compilerOptions?: CompilerOptions };

function resolveConfig(files: Record<string, RawConfig>, name: string): CompilerOptions {
  const seen = new Set<string>();

  function resolve(current: string): CompilerOptions {
    if (seen.has(current)) throw new Error('циклическое наследование');
    if (!Object.hasOwn(files, current)) throw new Error('конфигурация не найдена');

    seen.add(current);

    const config = files[current];
    const base = config.extends ? resolve(config.extends) : {};

    return { ...base, ...(config.compilerOptions ?? {}) };
  }

  return resolve(name);
}`
  }
]
