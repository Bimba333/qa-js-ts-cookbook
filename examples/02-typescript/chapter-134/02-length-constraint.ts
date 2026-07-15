export {};

function hasItems<Collection extends { length: number }>(collection: Collection): boolean {
  return collection.length > 0;
}

console.log(hasItems(["login", "checkout"]));
console.log(hasItems("report"));
