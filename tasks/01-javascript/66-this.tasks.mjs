export default [
  {
    id: 'js-66-four-call-forms',
    title: 'Четыре формы вызова — четыре получателя',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `describeCallForms()`, возвращающую ' +
      '`{ asMethod, borrowed, constructed, arrow }`. Объявите функцию ' +
      '`whoAmI()`, возвращающую `this?.name ?? "без получателя"`. ' +
      'Затем получите: результат вызова как метода объекта `{ name: "объект", whoAmI }`; ' +
      'результат вызова через `call` с получателем `{ name: "заимствованный" }`; ' +
      'значение поля `name` у объекта, созданного через `new` от функции ' +
      '`function Runner(name) { this.name = name; }`; результат стрелочной ' +
      'функции, объявленной внутри метода и возвращающей `this.name`.',
    starter: `function describeCallForms() {
  function whoAmI() {
    return this?.name ?? 'без получателя';
  }

  return { asMethod: '', borrowed: '', constructed: '', arrow: '' };
}`,
    hints: [
      'Получатель определяется формой вызова, а не местом объявления функции.',
      'new создаёт новый объект и делает его получателем.',
      'Стрелка берёт this из окружающего кода, а не из вызова.'
    ],
    tests: [
      {
        name: 'вызов как метода',
        code: `expect(describeCallForms().asMethod).toBe('объект');`
      },
      {
        name: 'явный получатель через call',
        code: `expect(describeCallForms().borrowed).toBe('заимствованный');`
      },
      {
        name: 'вызов через new',
        code: `expect(describeCallForms().constructed).toBe('созданный');`
      },
      {
        name: 'стрелка внутри метода',
        code: `expect(describeCallForms().arrow).toBe('объект со стрелкой');`
      },
      {
        name: 'все четыре формы различаются',
        code: `const forms = describeCallForms();
expect(new Set(Object.values(forms)).size).toBe(4);`
      },
      {
        name: 'результат воспроизводится',
        code: `expect(describeCallForms()).toEqual(describeCallForms());`
      }
    ],
    solution: `function describeCallForms() {
  function whoAmI() {
    return this?.name ?? 'без получателя';
  }

  const holder = { name: 'объект', whoAmI };

  function Runner(name) {
    this.name = name;
  }

  const withArrow = {
    name: 'объект со стрелкой',
    read() {
      const arrow = () => this.name;

      return arrow();
    }
  };

  return {
    asMethod: holder.whoAmI(),
    borrowed: whoAmI.call({ name: 'заимствованный' }),
    constructed: new Runner('созданный').name,
    arrow: withArrow.read()
  };
}`
  }
]
