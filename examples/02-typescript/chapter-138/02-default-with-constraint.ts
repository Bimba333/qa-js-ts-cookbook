export {};

type EntityBox<Entity extends { id: string } = { id: string }> = {
  entity: Entity;
};

const defaultBox: EntityBox = {
  entity: { id: "base" },
};

const userBox: EntityBox<{ id: string; role: string }> = {
  entity: { id: "u-1", role: "admin" },
};

console.log(defaultBox.entity.id);
console.log(userBox.entity.role);
