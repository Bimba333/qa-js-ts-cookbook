export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
function printId<Entity>(entity: Entity): void {
  // @ts-expect-error Entity has no guaranteed id property.
  console.log(entity.id);
}

printId({ id: "u-1" });
