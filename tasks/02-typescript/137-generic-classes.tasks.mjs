export default [
  {
    id: 'ts-137-typed-store',
    title: 'Дженерик-класс хранилища',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите класс `EntityStore<T extends { id: string }>` с методами ' +
      '`add(entity: T): void`, `findById(id: string): T | undefined`, ' +
      '`remove(id: string): boolean`, `all(): readonly T[]` и геттером ' +
      '`size: number`. Повторное добавление записи с тем же `id` заменяет ' +
      'прежнюю, сохраняя её позицию. `all()` возвращает копию, изменение которой ' +
      'не затрагивает хранилище.',
    starter: `class EntityStore<T extends { id: string }> {
  add(entity: T): void {}

  findById(id: string): T | undefined { return undefined; }

  remove(id: string): boolean { return false; }

  all(): readonly T[] { return []; }

  get size(): number { return 0; }
}`,
    hints: [
      'Ограничение по id позволяет искать запись, не зная остальных полей.',
      'Замена по месту отличается от удаления и добавления в конец.',
      'Возврат внутреннего массива открыл бы хранилище для изменений снаружи.'
    ],
    tests: [
      {
        name: 'добавление и поиск',
        code: `const store = new EntityStore<{ id: string; title: string }>();
store.add({ id: 'a', title: 'первая' });
expect(store.findById('a')).toEqual({ id: 'a', title: 'первая' });
expect(store.size).toBe(1);`
      },
      {
        name: 'повтор заменяет запись на месте',
        code: `const store = new EntityStore<{ id: string; title: string }>();
store.add({ id: 'a', title: 'первая' });
store.add({ id: 'b', title: 'вторая' });
store.add({ id: 'a', title: 'обновлённая' });
expect(store.size).toBe(2);
expect(store.all().map(item => item.title)).toEqual(['обновлённая', 'вторая']);`
      },
      {
        name: 'удаление сообщает о результате',
        code: `const store = new EntityStore<{ id: string }>();
store.add({ id: 'a' });
expect(store.remove('a')).toBe(true);
expect(store.remove('a')).toBe(false);
expect(store.size).toBe(0);`
      },
      {
        name: 'поиск отсутствующей записи',
        code: `expect(new EntityStore<{ id: string }>().findById('нет')).toBeUndefined();`
      },
      {
        name: 'all возвращает копию',
        code: `const store = new EntityStore<{ id: string }>();
store.add({ id: 'a' });
const items = store.all() as { id: string }[];
items.push({ id: 'b' });
expect(store.size).toBe(1);`
      },
      {
        name: 'хранилища независимы',
        code: `const first = new EntityStore<{ id: string }>();
const second = new EntityStore<{ id: string }>();
first.add({ id: 'a' });
expect(second.size).toBe(0);`
      }
    ],
    solution: `class EntityStore<T extends { id: string }> {
  #items: T[] = [];

  add(entity: T): void {
    const index = this.#items.findIndex(item => item.id === entity.id);

    if (index === -1) {
      this.#items.push(entity);
    } else {
      this.#items[index] = entity;
    }
  }

  findById(id: string): T | undefined {
    return this.#items.find(item => item.id === id);
  }

  remove(id: string): boolean {
    const index = this.#items.findIndex(item => item.id === id);

    if (index === -1) {
      return false;
    }

    this.#items.splice(index, 1);

    return true;
  }

  all(): readonly T[] {
    return [...this.#items];
  }

  get size(): number {
    return this.#items.length;
  }
}`
  }
]
