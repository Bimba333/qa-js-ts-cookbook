export {};

function pickValue<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
): ObjectType[Key] {
  return object[key];
}

const config = {
  baseUrl: "https://service.local",
  retries: 2,
};

const retries = pickValue(config, "retries");

console.log(retries);
