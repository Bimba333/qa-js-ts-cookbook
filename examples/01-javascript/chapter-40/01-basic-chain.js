const frameworkBehavior = {
  formatError() {
    return `${this.name}: formatted error`;
  }
};

const pageBehavior = {
  describePage() {
    return `Page: ${this.name}`;
  }
};

const loginPage = {
  name: 'LoginPage'
};

Object.setPrototypeOf(pageBehavior, frameworkBehavior);
Object.setPrototypeOf(loginPage, pageBehavior);

console.log(loginPage.describePage());
console.log(loginPage.formatError());
