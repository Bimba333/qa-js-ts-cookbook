export {};

class TypedStorage<Item> {
  private items: Item[] = [];

  add(item: Item): void {
    this.items.push(item);
  }

  all(): Item[] {
    return this.items;
  }
}

const storage = new TypedStorage<string>();
storage.add("passed");

console.log(storage.all());
