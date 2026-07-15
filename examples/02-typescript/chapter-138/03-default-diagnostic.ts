export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type EntityBox<Entity extends { id: string } = { id: string }> = {
  entity: Entity;
};

const brokenBox: EntityBox = {
  // @ts-expect-error default type still requires id.
  entity: {},
};

console.log(brokenBox);
