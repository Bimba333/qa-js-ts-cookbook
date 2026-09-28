export default [
  {
    id: 'ts-98-annotation-is-not-a-check',
    title: 'Аннотация не проверяет данные',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `Profile = { id: string; active: boolean }`. Напишите две ' +
      'функции. `trustAnnotation(value: unknown): Profile` просто утверждает тип ' +
      'через `as` и возвращает значение как есть. ' +
      '`checkAtRuntime(value: unknown): Profile | null` действительно проверяет ' +
      'форму и типы полей и возвращает `null`, если они не совпали. Задача ' +
      'показывает, что первая функция пропускает любые данные, а вторая — нет.',
    starter: `type Profile = { id: string; active: boolean };

function trustAnnotation(value: unknown): Profile {
  return value as Profile;
}

function checkAtRuntime(value: unknown): Profile | null {
  // Проверяйте форму объекта и тип каждого поля.
  return value as Profile;
}`,
    hints: [
      'Утверждение о типе ничего не выполняет: после компиляции от него не остаётся кода.',
      'Перед обращением к полям нужно убедиться, что значение — объект и не `null`.',
      'Тип каждого поля проверяется отдельно: наличие ключа ещё не означает нужный тип.'
    ],
    tests: [
      {
        name: 'утверждение пропускает заведомо чужие данные',
        code: `expect(trustAnnotation({ сломано: true })).toEqual({ сломано: true });`
      },
      {
        name: 'проверка принимает корректный объект',
        code: `expect(checkAtRuntime({ id: 't-1', active: true }))
  .toEqual({ id: 't-1', active: true });`
      },
      {
        name: 'неверный тип поля отвергается',
        code: `expect(checkAtRuntime({ id: 1, active: true })).toBe(null);
expect(checkAtRuntime({ id: 't-1', active: 'да' })).toBe(null);`
      },
      {
        name: 'отсутствующее поле отвергается',
        code: `expect(checkAtRuntime({ id: 't-1' })).toBe(null);`
      },
      {
        name: '`null` и примитивы отвергаются',
        code: `expect(checkAtRuntime(null)).toBe(null);
expect(checkAtRuntime('строка')).toBe(null);`
      }
    ],
    solution: `type Profile = { id: string; active: boolean };

function trustAnnotation(value: unknown): Profile {
  return value as Profile;
}

function checkAtRuntime(value: unknown): Profile | null {
  if (typeof value !== 'object' || value === null) return null;

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.id !== 'string') return null;
  if (typeof candidate.active !== 'boolean') return null;

  return { id: candidate.id, active: candidate.active };
}`
  }
]
