export default [
  {
    id: 'ts-149-override-calls-base',
    title: 'Переопределение и вызов базовой реализации',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите интерфейс `Serializer { serialize(value: unknown): string }`. ' +
      'Класс `JsonSerializer implements Serializer` возвращает ' +
      '`JSON.stringify(value)`. Класс `PrettyJsonSerializer extends ' +
      'JsonSerializer` переопределяет `serialize` так, чтобы результат был ' +
      'отформатирован с отступом в два пробела, и дополнительно имеет метод ' +
      '`serializeCompact(value: unknown): string`, который возвращает результат ' +
      '**базовой** реализации через `super`.',
    starter: `interface Serializer {
  serialize(value: unknown): string;
}

class JsonSerializer implements Serializer {
  serialize(value: unknown): string {
    return '';
  }
}

class PrettyJsonSerializer extends JsonSerializer {
  serializeCompact(value: unknown): string {
    return '';
  }
}`,
    hints: [
      'Третий аргумент JSON.stringify задаёт отступ.',
      'super.serialize вызывает реализацию родителя, а не текущую.',
      'Экземпляр наследника остаётся и экземпляром базового класса.'
    ],
    tests: [
      {
        name: 'базовая реализация компактна',
        code: `expect(new JsonSerializer().serialize({ a: 1 })).toBe('{"a":1}');`
      },
      {
        name: 'наследник форматирует',
        code: `expect(new PrettyJsonSerializer().serialize({ a: 1 })).toBe('{\\n  "a": 1\\n}');`
      },
      {
        name: 'super даёт базовую реализацию',
        code: `expect(new PrettyJsonSerializer().serializeCompact({ a: 1 })).toBe('{"a":1}');`
      },
      {
        name: 'наследник подходит везде, где ожидается интерфейс',
        code: `const serializers: Serializer[] = [new JsonSerializer(), new PrettyJsonSerializer()];
expect(serializers.map(item => item.serialize([1])).length).toBe(2);`
      },
      {
        name: 'экземпляр наследника принадлежит и базовому классу',
        code: `const pretty = new PrettyJsonSerializer();
expect(pretty instanceof PrettyJsonSerializer).toBe(true);
expect(pretty instanceof JsonSerializer).toBe(true);`
      },
      {
        name: 'переопределение не задело базовый класс',
        code: `expect(new JsonSerializer().serialize([1, 2])).toBe('[1,2]');`
      }
    ],
    solution: `interface Serializer {
  serialize(value: unknown): string;
}

class JsonSerializer implements Serializer {
  serialize(value: unknown): string {
    return JSON.stringify(value);
  }
}

class PrettyJsonSerializer extends JsonSerializer {
  override serialize(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }

  serializeCompact(value: unknown): string {
    return super.serialize(value);
  }
}`
  }
]
