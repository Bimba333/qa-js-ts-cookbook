type Profile = { id: string; active: boolean };

const isProfile = (value: unknown): value is Profile => {
  if (typeof value !== "object" || value === null) return false;
  return "id" in value
    && typeof value.id === "string"
    && "active" in value
    && typeof value.active === "boolean";
};

declare const raw: unknown;
if (isProfile(raw)) {
  const a: string = raw.id;
  const b: boolean = raw.active;
  console.log(a, b);
}

// без "in" — обращение к свойству у object
const bad = (value: unknown): boolean => {
  if (typeof value !== "object" || value === null) return false;
  // @ts-expect-error свойство не объявлено у object
  return typeof value.id === "string";
};
console.log(bad, isProfile);

// as вместо стража: компилятор молчит, проверки нет
declare const raw2: unknown;
const forced = raw2 as Profile;
console.log(forced.id.toUpperCase());
