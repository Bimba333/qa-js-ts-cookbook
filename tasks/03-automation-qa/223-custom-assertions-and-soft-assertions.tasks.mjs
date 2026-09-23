export default [
  {
    id: 'qa-223-soft-assertions',
    title: 'Мягкие проверки',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `createSoftAssert()` со свойствами `check(name, condition)` и ' +
      '`verify()`. `check` записывает неудачу и **не** прерывает выполнение. ' +
      '`verify` ничего не делает, если неудач нет, и выбрасывает ошибку с ' +
      'сообщением `Не пройдено проверок: <n>: <имена через запятую>`, если они есть. ' +
      'Имена перечисляются в порядке проверок.',
    starter: `function createSoftAssert() {
  return {
    check(name, condition) {},
    verify() {}
  };
}`,
    hints: [
      'Мягкая проверка копит неудачи, а не бросает исключение сразу.',
      'Сообщение собирается только в момент verify.',
      'Успешная проверка в список не попадает.'
    ],
    tests: [
      {
        name: 'без неудач verify молчит',
        code: `const soft = createSoftAssert();
soft.check('первая', true);
soft.check('вторая', true);
soft.verify();
expect(true).toBe(true);`
      },
      {
        name: 'неудачная проверка не прерывает выполнение',
        code: `const soft = createSoftAssert();
let reached = false;
soft.check('первая', false);
reached = true;
expect(reached).toBe(true);`
      },
      {
        name: 'verify сообщает обо всех неудачах',
        code: `const soft = createSoftAssert();
soft.check('первая', false);
soft.check('вторая', true);
soft.check('третья', false);
let message = '';
try { soft.verify(); } catch (error) { message = error.message; }
expect(message).toBe('Не пройдено проверок: 2: первая, третья');`
      },
      {
        name: 'порядок имён сохраняется',
        code: `const soft = createSoftAssert();
soft.check('b', false);
soft.check('a', false);
let message = '';
try { soft.verify(); } catch (error) { message = error.message; }
expect(message).toContain('b, a');`
      },
      {
        name: 'ложное значение считается неудачей',
        code: `const soft = createSoftAssert();
soft.check('пусто', '');
soft.check('ноль', 0);
let message = '';
try { soft.verify(); } catch (error) { message = error.message; }
expect(message).toBe('Не пройдено проверок: 2: пусто, ноль');`
      },
      {
        name: 'разные наборы проверок независимы',
        code: `const first = createSoftAssert();
first.check('x', false);
const second = createSoftAssert();
second.check('y', true);
second.verify();
expect(true).toBe(true);`
      }
    ],
    solution: `function createSoftAssert() {
  const failed = [];

  return {
    check(name, condition) {
      if (!condition) {
        failed.push(name);
      }
    },
    verify() {
      if (failed.length === 0) {
        return;
      }

      throw new Error(
        'Не пройдено проверок: ' + failed.length + ': ' + failed.join(', ')
      );
    }
  };
}`
  }
]
