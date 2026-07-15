export {};

type LocatorMap = {
  loginButton: string;
  emailInput: string;
  passwordInput: string;
};

function getLocator(locators: LocatorMap, name: keyof LocatorMap) {
  return locators[name];
}

const locators: LocatorMap = {
  loginButton: "[data-test='login']",
  emailInput: "[data-test='email']",
  passwordInput: "[data-test='password']",
};

console.log(getLocator(locators, "loginButton"));

