export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
type LocatorMap = {
  submitButton: string;
  emailInput: string;
};

// @ts-expect-error passwordInput is not a key of LocatorMap.
const locatorName: keyof LocatorMap = "passwordInput";

console.log(locatorName);

