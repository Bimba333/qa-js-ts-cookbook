export default [
  {
    id: 'ts-158-typed-client-parse',
    title: 'Типизированный клиент с проверкой ответа',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите `fetchItem(transport, id)`, где `transport: (path: string) => Promise<unknown>`. ' +
      'Функция запрашивает `/work-items/<id>` и возвращает объект типа ' +
      '`{ id: string; version: number }`. Форму ответа нужно проверить в runtime: ' +
      'если ответ не объект или поля имеют неверный тип, выбросьте ошибку ' +
      '`неожиданная форма ответа`. Использовать `as` для подмены проверки нельзя — ' +
      'проверки подают неверные данные и ждут ошибку.',
    starter: `type WorkItem = {
  id: string;
  version: number;
};

type Transport = (path: string) => Promise<unknown>;

async function fetchItem(transport: Transport, id: string): Promise<WorkItem> {
  const payload = await transport('/work-items/' + id);

  // Проверьте форму ответа перед тем, как его вернуть.
  return payload as WorkItem;
}`,
    hints: [
      'Тип ответа объявлен как unknown — его нужно проверить, а не утверждать.',
      'null тоже имеет typeof "object".',
      'Проверять надо и наличие полей, и их типы.'
    ],
    tests: [
      {
        name: 'корректный ответ возвращается как есть',
        code: `const transport = async () => ({ id: 'WI-1', version: 2 });
expect(await fetchItem(transport, 'WI-1')).toEqual({ id: 'WI-1', version: 2 });`
      },
      {
        name: 'путь собирается из идентификатора',
        code: `let requested = '';
const transport = async (path) => { requested = path; return { id: 'x', version: 1 }; };
await fetchItem(transport, 'WI-7');
expect(requested).toBe('/work-items/WI-7');`
      },
      {
        name: 'неверный тип поля отвергается',
        code: `const transport = async () => ({ id: 'WI-1', version: '2' });
let message = '';
try { await fetchItem(transport, 'WI-1'); } catch (error) { message = error.message; }
expect(message).toBe('неожиданная форма ответа');`
      },
      {
        name: 'отсутствующее поле отвергается',
        code: `const transport = async () => ({ id: 'WI-1' });
let message = '';
try { await fetchItem(transport, 'WI-1'); } catch (error) { message = error.message; }
expect(message).toBe('неожиданная форма ответа');`
      },
      {
        name: 'null отвергается',
        code: `const transport = async () => null;
let message = '';
try { await fetchItem(transport, 'WI-1'); } catch (error) { message = error.message; }
expect(message).toBe('неожиданная форма ответа');`
      }
    ],
    solution: `type WorkItem = {
  id: string;
  version: number;
};

type Transport = (path: string) => Promise<unknown>;

function isWorkItem(value: unknown): value is WorkItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === 'string'
    && typeof candidate.version === 'number';
}

async function fetchItem(transport: Transport, id: string): Promise<WorkItem> {
  const payload = await transport('/work-items/' + id);

  if (!isWorkItem(payload)) {
    throw new Error('неожиданная форма ответа');
  }

  return payload;
}`
  }
]
