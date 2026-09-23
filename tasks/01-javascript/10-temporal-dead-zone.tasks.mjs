export default [
  {
    id: 'js-10-tdz-is-observable',
    title: 'Мёртвая зона видна во время выполнения',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `probeTdz()`, возвращающую объект ' +
      '`{ varBefore, letError, typeofVarBefore, typeofLetError, afterDeclaration }`. ' +
      'Внутри функции: обратитесь к переменной `withVar` **до** её объявления ' +
      'через `var` и запишите полученное значение; попробуйте обратиться к ' +
      '`withLet` до объявления через `let` и запишите **имя** ошибки; то же ' +
      'самое сделайте через `typeof` для обеих; после объявлений запишите ' +
      'значение `withLet`. Объявите `var withVar = "объявлено"` и ' +
      '`let withLet = "объявлено"` в конце функции.',
    starter: `function probeTdz() {
  // До объявления через var имя уже существует, через let — ещё нет.

  return {
    varBefore: null,
    letError: '',
    typeofVarBefore: '',
    typeofLetError: '',
    afterDeclaration: ''
  };
}`,
    hints: [
      'var объявляется заранее, но значение получает только в строке объявления.',
      'Обращение к let до объявления выбрасывает ошибку — её нужно поймать.',
      'typeof не спасает от мёртвой зоны, в отличие от необъявленной переменной.'
    ],
    tests: [
      {
        name: 'var до объявления даёт undefined',
        code: `expect(probeTdz().varBefore).toBeUndefined();`
      },
      {
        name: 'let до объявления бросает ReferenceError',
        code: `expect(probeTdz().letError).toBe('ReferenceError');`
      },
      {
        name: 'typeof для var работает',
        code: `expect(probeTdz().typeofVarBefore).toBe('undefined');`
      },
      {
        name: 'typeof не спасает от мёртвой зоны',
        code: `expect(probeTdz().typeofLetError).toBe('ReferenceError');`
      },
      {
        name: 'после объявления значение доступно',
        code: `expect(probeTdz().afterDeclaration).toBe('объявлено');`
      },
      {
        name: 'результат воспроизводится',
        code: `expect(probeTdz()).toEqual(probeTdz());`
      }
    ],
    solution: `function probeTdz() {
  const varBefore = withVar;

  let letError = '';

  try {
    withLet;
  } catch (error) {
    letError = error.name;
  }

  const typeofVarBefore = typeof withVar;

  let typeofLetError = '';

  try {
    typeof withLet;
  } catch (error) {
    typeofLetError = error.name;
  }

  var withVar = 'объявлено';
  let withLet = 'объявлено';

  return {
    varBefore,
    letError,
    typeofVarBefore,
    typeofLetError,
    afterDeclaration: withLet
  };
}`
  }
]
