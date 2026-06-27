class PageObject {
  constructor(name) {
    this.name = name;
  }

  describePage() {
    return `Page: ${this.name}`;
  }
}

const loginPage = new PageObject('LoginPage');
const profilePage = new PageObject('ProfilePage');

console.log(loginPage.describePage === profilePage.describePage);
console.log(Object.getPrototypeOf(loginPage) === Object.getPrototypeOf(profilePage));
