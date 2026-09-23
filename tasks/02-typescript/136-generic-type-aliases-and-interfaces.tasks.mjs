export default [
  {
    id: 'ts-136-generic-envelope',
    title: 'Дженерик-оболочка ответа',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите `type ApiResponse<Body> = { status: number; body: Body }` и ' +
      'интерфейс `Parser<Input, Output> { parse(input: Input): Output }`. ' +
      'Напишите `ok<Body>(body: Body): ApiResponse<Body>` (статус `200`), ' +
      '`mapBody<A, B>(response: ApiResponse<A>, parser: Parser<A, B>): ApiResponse<B>` — ' +
      'новый ответ с преобразованным телом и тем же статусом, и ' +
      '`unwrap<Body>(response: ApiResponse<Body>): Body` — тело при статусе ' +
      'ниже `400`, иначе ошибка `ответ с кодом <status>`.',
    starter: `type ApiResponse<Body> = { status: number; body: Body };

interface Parser<Input, Output> {
  parse(input: Input): Output;
}

function ok<Body>(body: Body): ApiResponse<Body> {
  return { status: 0, body };
}

function mapBody<A, B>(response: ApiResponse<A>, parser: Parser<A, B>): ApiResponse<B> {
  return { status: 0, body: undefined as unknown as B };
}

function unwrap<Body>(response: ApiResponse<Body>): Body {
  return response.body;
}`,
    hints: [
      'Параметр-тип оболочки не зависит от того, что лежит внутри.',
      'Преобразование тела не должно менять исходный ответ.',
      'Граница успешности — код меньше четырёхсот.'
    ],
    tests: [
      {
        name: 'успешный ответ собирается',
        code: `expect(ok({ id: 'a' })).toEqual({ status: 200, body: { id: 'a' } });`
      },
      {
        name: 'тело преобразуется, статус сохраняется',
        code: `const mapped = mapBody({ status: 201, body: '42' }, { parse: value => Number(value) });
expect(mapped).toEqual({ status: 201, body: 42 });`
      },
      {
        name: 'исходный ответ не изменяется',
        code: `const source = { status: 200, body: '42' };
mapBody(source, { parse: value => Number(value) });
expect(source.body).toBe('42');`
      },
      {
        name: 'успешный ответ разворачивается',
        code: `expect(unwrap({ status: 200, body: 'значение' })).toBe('значение');
expect(unwrap({ status: 399, body: 1 })).toBe(1);`
      },
      {
        name: 'ответ с ошибкой не разворачивается',
        code: `let message = '';
try { unwrap({ status: 404, body: null }); } catch (error) { message = (error as Error).message; }
expect(message).toBe('ответ с кодом 404');`
      },
      {
        name: 'оболочка работает с любым телом',
        code: `expect(unwrap(ok([1, 2, 3]))).toEqual([1, 2, 3]);
expect(unwrap(ok('строка'))).toBe('строка');`
      },
      {
        name: 'преобразование можно применять цепочкой',
        code: `const first = mapBody(ok('42'), { parse: value => Number(value) });
const second = mapBody(first, { parse: value => value * 2 });
expect(unwrap(second)).toBe(84);`
      }
    ],
    solution: `type ApiResponse<Body> = { status: number; body: Body };

interface Parser<Input, Output> {
  parse(input: Input): Output;
}

function ok<Body>(body: Body): ApiResponse<Body> {
  return { status: 200, body };
}

function mapBody<A, B>(response: ApiResponse<A>, parser: Parser<A, B>): ApiResponse<B> {
  return { status: response.status, body: parser.parse(response.body) };
}

function unwrap<Body>(response: ApiResponse<Body>): Body {
  if (response.status >= 400) {
    throw new Error('ответ с кодом ' + response.status);
  }

  return response.body;
}`
  }
]
