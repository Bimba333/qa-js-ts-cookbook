export default [
  {
    id: 'ts-129-is-work-item',
    title: 'Функция-страж для ответа API',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `WorkItem` с полями `id: string` и `version: number`. Напишите ' +
      'предикат `isWorkItem(value: unknown): value is WorkItem`, который выполняет ' +
      '**настоящие** проверки формы. Приведение через `as` вместо проверки ' +
      'недопустимо.',
    starter: `type WorkItem = {
  id: string;
  version: number;
};

function isWorkItem(value: unknown): value is WorkItem {
  // Проверьте границу объекта и тип каждого поля.
  return false;
}`,
    hints: [
      'Сначала проверьте, что значение — объект и не null.',
      'Оператор in даёт доступ к свойству у суженного object.',
      'Для каждого поля нужна отдельная проверка типа.'
    ],
    tests: [
      {
        name: 'подходящий объект',
        code: `expect(isWorkItem({ id: 'a', version: 1 })).toBe(true);`
      },
      {
        name: 'неверный тип поля',
        code: `expect(isWorkItem({ id: 'a', version: '1' })).toBe(false);`
      },
      {
        name: 'отсутствующее поле',
        code: `expect(isWorkItem({ id: 'a' })).toBe(false);`
      },
      {
        name: 'null и массив не подходят',
        code: `expect(isWorkItem(null) || isWorkItem([])).toBe(false);`
      },
      {
        name: 'лишние поля не мешают',
        code: `expect(isWorkItem({ id: 'a', version: 1, extra: true })).toBe(true);`
      }
    ],
    solution: `type WorkItem = {
  id: string;
  version: number;
};

function isWorkItem(value: unknown): value is WorkItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'id' in value
    && typeof (value as { id: unknown }).id === 'string'
    && 'version' in value
    && typeof (value as { version: unknown }).version === 'number';
}`
  },

  {
    id: 'ts-129-parse-or-throw',
    title: 'Разбор с понятной ошибкой',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Используя предикат из предыдущей задачи как образец, напишите функцию ' +
      '`parseWorkItem(value: unknown)`, которая возвращает объект с полями ' +
      '`id: string` и `version: number`, а при несоответствии формы выбрасывает ' +
      'ошибку с сообщением `ответ не соответствует контракту WorkItem`.',
    starter: `function parseWorkItem(value: unknown): { id: string; version: number } {
  // Сначала проверка, потом использование.
  throw new Error('не реализовано');
}`,
    hints: [
      'Проверку формы удобно вынести в отдельный предикат.',
      'Сообщение об ошибке должно совпадать точно.',
      'После успешной проверки поля доступны без приведения.'
    ],
    tests: [
      {
        name: 'возвращает разобранное значение',
        code: `expect(parseWorkItem({ id: 'a', version: 2 })).toEqual({ id: 'a', version: 2 });`
      },
      {
        name: 'бросает ошибку с точным сообщением',
        code: `let message = '';
try { parseWorkItem({ id: 'a' }); } catch (error) { message = (error as Error).message; }
expect(message).toBe('ответ не соответствует контракту WorkItem');`
      },
      {
        name: 'бросает ошибку на null',
        code: `let thrown = false;
try { parseWorkItem(null); } catch (error) { thrown = true; }
expect(thrown).toBe(true);`
      },
      {
        name: 'лишние поля не мешают разбору',
        code: `expect(parseWorkItem({ id: 'a', version: 1, extra: 'x' }).id).toBe('a');`
      }
    ],
    solution: `function parseWorkItem(value: unknown): { id: string; version: number } {
  const isWorkItem = (candidate: unknown): candidate is { id: string; version: number } => {
    if (typeof candidate !== 'object' || candidate === null) {
      return false;
    }

    return 'id' in candidate
      && typeof (candidate as { id: unknown }).id === 'string'
      && 'version' in candidate
      && typeof (candidate as { version: unknown }).version === 'number';
  };

  if (!isWorkItem(value)) {
    throw new Error('ответ не соответствует контракту WorkItem');
  }

  return { id: value.id, version: value.version };
}`
  }
]
