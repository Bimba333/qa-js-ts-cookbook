export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
function label<Entity extends { id: string }>(entity: Entity): string {
  return `entity:${entity.id}`;
}

// @ts-expect-error id is required by the generic constraint.
console.log(label({ role: "admin" }));
