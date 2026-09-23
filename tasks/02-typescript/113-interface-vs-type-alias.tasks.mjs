export default [
  {
    id: 'ts-113-interface-extends',
    title: 'Расширение интерфейса',
    difficulty: 'easy',
    lang: 'ts',
    prompt:
      'Объявите `interface BaseItem { id: string; title: string }` и ' +
      '`interface TrackedItem extends BaseItem { version: number }`. ' +
      'Напишите `describeItem(item: TrackedItem): string`, возвращающую ' +
      '`<id>/<title>/v<version>`.',
    starter: `interface BaseItem {
  id: string;
  title: string;
}

interface TrackedItem extends BaseItem {
  version: number;
}

function describeItem(item: TrackedItem): string {
  return '';
}`,
    hints: [
      'Наследник видит поля базового интерфейса как свои.',
      'Разделитель — косая черта.',
      'Перед номером версии стоит буква v.'
    ],
    tests: [
      {
        name: 'собирает описание из трёх полей',
        code: `expect(describeItem({ id: 'WI-1', title: 'login', version: 2 }))
  .toBe('WI-1/login/v2');`
      },
      {
        name: 'работает с нулевой версией',
        code: `expect(describeItem({ id: 'WI-9', title: 'draft', version: 0 }))
  .toBe('WI-9/draft/v0');`
      },
      {
        name: 'не подставляет фиксированные значения',
        code: `expect(describeItem({ id: 'A', title: 'B', version: 11 })).toBe('A/B/v11');`
      }
    ],
    solution: `interface BaseItem {
  id: string;
  title: string;
}

interface TrackedItem extends BaseItem {
  version: number;
}

function describeItem(item: TrackedItem): string {
  return item.id + '/' + item.title + '/v' + item.version;
}`
  },

  {
    id: 'ts-113-union-needs-alias',
    title: 'Там, где интерфейс не подходит',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объединение нельзя описать интерфейсом — только псевдонимом типа. ' +
      'Объявите `type Identifier = string | number` и напишите ' +
      '`toKey(id: Identifier): string`, которая возвращает строку: число ' +
      'превращается в строку с префиксом `n:`, строка — с префиксом `s:`. ' +
      'Пустая строка и `NaN` недопустимы — в этих случаях выбрасывайте ошибку ' +
      'с сообщением `некорректный идентификатор`.',
    starter: `type Identifier = string | number;

function toKey(id: Identifier): string {
  return '';
}`,
    hints: [
      'Различить варианты объединения помогает typeof.',
      'NaN не равен сам себе — это удобный способ его поймать.',
      'Сообщение об ошибке должно совпадать дословно.'
    ],
    tests: [
      {
        name: 'число получает префикс n:',
        code: `expect(toKey(42)).toBe('n:42');`
      },
      {
        name: 'строка получает префикс s:',
        code: `expect(toKey('WI-1')).toBe('s:WI-1');`
      },
      {
        name: 'пустая строка недопустима',
        code: `let message = '';
try { toKey(''); } catch (error) { message = error.message; }
expect(message).toBe('некорректный идентификатор');`
      },
      {
        name: 'NaN недопустим',
        code: `let message = '';
try { toKey(NaN); } catch (error) { message = error.message; }
expect(message).toBe('некорректный идентификатор');`
      },
      {
        name: 'ноль остаётся допустимым',
        code: `expect(toKey(0)).toBe('n:0');`
      }
    ],
    solution: `type Identifier = string | number;

function toKey(id: Identifier): string {
  if (typeof id === 'number') {
    if (Number.isNaN(id)) {
      throw new Error('некорректный идентификатор');
    }

    return 'n:' + id;
  }

  if (id === '') {
    throw new Error('некорректный идентификатор');
  }

  return 's:' + id;
}`
  }
]
