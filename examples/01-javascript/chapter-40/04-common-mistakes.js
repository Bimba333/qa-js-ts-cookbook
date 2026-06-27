const frameworkBehavior = {
  describe() {
    return 'framework description';
  }
};

const pageBehavior = {
  describe() {
    return 'page description';
  }
};

const loginPage = {
  name: 'LoginPage'
};

Object.setPrototypeOf(pageBehavior, frameworkBehavior);
Object.setPrototypeOf(loginPage, pageBehavior);

console.log(loginPage.describe());
