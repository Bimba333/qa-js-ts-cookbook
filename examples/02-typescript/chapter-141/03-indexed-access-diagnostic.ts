export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type User = {
  id: string;
};

// @ts-expect-error User does not have an email property.
type Email = User["email"];

const value: Email = "qa@example.com";

console.log(value);

