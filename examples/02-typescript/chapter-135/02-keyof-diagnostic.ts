export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
function pickValue<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
): ObjectType[Key] {
  return object[key];
}

const config = { retries: 2 };

// @ts-expect-error timeout is not a key of config.
console.log(pickValue(config, "timeout"));
