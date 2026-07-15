export {};

class EntityStore<Entity extends { id: string }> {
  private items: Entity[] = [];

  add(entity: Entity): void {
    this.items.push(entity);
  }

  findById(id: string): Entity | undefined {
    return this.items.find((entity) => entity.id === id);
  }
}

const users = new EntityStore<{ id: string; role: string }>();
users.add({ id: "u-1", role: "admin" });

console.log(users.findById("u-1"));
