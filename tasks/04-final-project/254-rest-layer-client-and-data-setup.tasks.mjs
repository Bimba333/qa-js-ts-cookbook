export default [
  {
    id: 'fp-254-failure-as-value',
    title: 'Отказ как значение, а не исключение',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `toResult(response)`. На вход приходит объект ' +
      '`{ status, body }`. Для кодов 2xx верните ' +
      '`{ ok: true, value: body }`. Для остальных — ' +
      '`{ ok: false, failure: { status, code, message } }`, где `code` и ' +
      '`message` берутся из тела (`body.code`, `body.message`). Если тела нет ' +
      'или полей в нём нет, подставьте `code: "UNKNOWN"` и пустое сообщение. ' +
      'Исключений функция не бросает: отказ — это результат.',
    starter: `function toResult(response) {
  // Негативный сценарий должен проверяться как обычное значение.

  return { ok: true, value: response.body };
}`,
    hints: [
      'Успешными считаются коды от 200 до 299 включительно.',
      'Тело ошибки может отсутствовать — не обращайтесь к его полям напрямую.',
      'Возвращайте одну из двух форм, не смешивая их поля.'
    ],
    tests: [
      {
        name: 'успешный ответ отдаёт значение',
        code: `const okResult = toResult({ status: 201, body: { id: 'T-1' } });
expect(okResult).toEqual({ ok: true, value: { id: 'T-1' } });`
      },
      {
        name: 'отказ сохраняет код состояния и причину',
        code: `const conflict = toResult({
  status: 409,
  body: { code: 'VERSION_CONFLICT', message: 'устаревшая версия' }
});
expect(conflict).toEqual({
  ok: false,
  failure: { status: 409, code: 'VERSION_CONFLICT', message: 'устаревшая версия' }
});`
      },
      {
        name: 'ответ без тела не ломает разбор',
        code: `const noBody = toResult({ status: 500 });
expect(noBody.ok).toBe(false);
expect(noBody.failure.code).toBe('UNKNOWN');
expect(noBody.failure.message).toBe('');`
      },
      {
        name: 'код 204 успешен, 304 — нет',
        code: `expect(toResult({ status: 204, body: null }).ok).toBe(true);
expect(toResult({ status: 304, body: null }).ok).toBe(false);`
      }
    ],
    solution: `function toResult(response) {
  const status = response.status;

  if (status >= 200 && status <= 299) {
    return { ok: true, value: response.body };
  }

  const body = response.body ?? {};

  return {
    ok: false,
    failure: {
      status,
      code: body.code ?? 'UNKNOWN',
      message: body.message ?? ''
    }
  };
}`
  },
  {
    id: 'fp-254-contract-guard',
    title: 'Страж контракта называет поле',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `assertWorkItem(value)`. Запись обязана быть объектом с полями ' +
      '`id` (непустая строка), `title` (непустая строка) и `version` (целое ' +
      'число не меньше 1). При нарушении бросьте `Error`, в сообщении которого ' +
      'есть **имя первого проблемного поля** в этом порядке. Если значение — не ' +
      'объект или `null`, сообщение должно содержать слово `объект`. При ' +
      'успехе верните само значение.',
    starter: `function assertWorkItem(value) {
  // Сообщение должно называть поле, а не просто «ответ не подходит».

  return value;
}`,
    hints: [
      'Сначала проверьте, что это объект и не null.',
      'Порядок проверок задаёт, какое поле попадёт в сообщение.',
      'Целое число проверяется через Number.isInteger.'
    ],
    tests: [
      {
        name: 'корректная запись проходит и возвращается',
        code: `const valid = { id: 'T-1', title: 'Отчёт', version: 1 };
expect(assertWorkItem(valid)).toEqual(valid);`
      },
      {
        name: 'не объект отклоняется с понятным сообщением',
        code: `expect(() => assertWorkItem(null)).toThrow('объект');
expect(() => assertWorkItem('T-1')).toThrow('объект');`
      },
      {
        name: 'пустая строка не считается заданным полем',
        code: `expect(() => assertWorkItem({ id: '', title: 'Отчёт', version: 1 }))
  .toThrow('id');
expect(() => assertWorkItem({ id: 'T-1', title: '', version: 1 }))
  .toThrow('title');`
      },
      {
        name: 'версия обязана быть целым числом не меньше единицы',
        code: `expect(() => assertWorkItem({ id: 'T-1', title: 'Отчёт', version: 0 }))
  .toThrow('version');
expect(() => assertWorkItem({ id: 'T-1', title: 'Отчёт', version: '2' }))
  .toThrow('version');`
      },
      {
        name: 'при нескольких проблемах назван первый по порядку',
        code: `expect(() => assertWorkItem({ id: '', title: '', version: 0 }))
  .toThrow('id');`
      }
    ],
    solution: `function assertWorkItem(value) {
  if (typeof value !== 'object' || value === null) {
    throw new Error('ответ не объект: ' + typeof value);
  }

  if (typeof value.id !== 'string' || value.id === '') {
    throw new Error('контракт нарушен, поле id');
  }

  if (typeof value.title !== 'string' || value.title === '') {
    throw new Error('контракт нарушен, поле title');
  }

  if (!Number.isInteger(value.version) || value.version < 1) {
    throw new Error('контракт нарушен, поле version');
  }

  return value;
}`
  }
];
