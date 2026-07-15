export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
class TypedStorage<Item> {
  private items: Item[] = [];

  add(item: Item): void {
    this.items.push(item);
  }
}

const storage = new TypedStorage<number>();

// @ts-expect-error storage accepts only numbers.
storage.add("passed");
