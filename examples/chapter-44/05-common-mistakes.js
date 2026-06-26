class PageObject {
  constructor(name) {
    this.name = name;
  }

  describePage() {
    return this.name;
  }
}

const loginPage = new PageObject('LoginPage');

console.log(loginPage.describePage());
