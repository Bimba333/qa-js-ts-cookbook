const pageBehavior = {
  describePage() {
    return `Page object: ${this.name}`;
  },
  describeAction(actionName) {
    return `${this.name} -> ${actionName}`;
  }
};

const loginPage = {
  name: 'LoginPage'
};

const profilePage = {
  name: 'ProfilePage'
};

Object.setPrototypeOf(loginPage, pageBehavior);
Object.setPrototypeOf(profilePage, pageBehavior);

console.log(loginPage.describePage());
console.log(profilePage.describeAction('open settings'));
