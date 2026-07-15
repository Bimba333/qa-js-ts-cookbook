export {};

function getEntityId<Entity extends { id: string }>(entity: Entity): string {
  return entity.id;
}

const id = getEntityId({ id: "u-1", role: "admin" });

console.log(id);
